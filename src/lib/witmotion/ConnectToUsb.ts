/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { DeviceInterface } from "./DeviceInterface";
import { SensorData, extractDataFromRaw } from "./ExtractDataFromRaw";
import {
  defaultAccelerometerCalibration,
  defaultDofSelect,
  defaultMagnetometerCalibration,
  defaultRateSelect,
} from "./CalibrationFunctions";

export class UsingUsb implements DeviceInterface {
  private port!: SerialPort;
  private reader!: ReadableStreamDefaultReader<any>;

  connect = async (onDataReceived?: (data: SensorData) => void) => {
    this.port = await navigator.serial.requestPort({
      filters: [{ usbVendorId: 6790, usbProductId: 29987 }],
    });
    await this.port.open({ baudRate: 115200 });
    this.reader = this.port.readable.getReader();

    while (true) {
      const { value, done } = await this.reader.read();

      if (value.length !== 20) {
        continue;
      }

      onDataReceived && onDataReceived(extractDataFromRaw(value));

      if (done) {
        break;
      }
    }
  };

  public disconnect = async () => {
    this.reader.cancel();
    this.reader.releaseLock();
    this.port.close();
  };

  public accelerometerCalibration = async () => {
    const writer = this.port.writable.getWriter();
    await defaultAccelerometerCalibration(writer.write.bind(writer));
    writer.releaseLock();
  };

  public magnetometerCalibration = async (command: String) => {
    const writer = this.port.writable.getWriter();
    await defaultMagnetometerCalibration(command, writer.write.bind(writer));
    writer.releaseLock();
  };

  public dofSelect = async (command: String) => {
    const writer = this.port.writable.getWriter();
    await defaultDofSelect(command, writer.write.bind(writer));
    writer.releaseLock();
  };

  public rateSelect = async (command: Number) => {
    const writer = this.port.writable.getWriter();
    await defaultRateSelect(command, writer.write.bind(writer));
    writer.releaseLock();
  };
}
