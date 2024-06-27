import { SensorData } from "./ExtractDataFromRaw";
import { UsingUsb } from "./ConnectToUsb";
import { UsingBluetooth } from "./ConnectToBluetooth";
import { DeviceInterface } from "./DeviceInterface";

export class Application implements DeviceInterface {
  private device: DeviceInterface;

  // Constructor to set default device to Bluetooth
  constructor() {
    this.device = new UsingBluetooth();
  }

  public choiceReader = (kind: boolean) => {
    switch (kind) {
      case false:
        this.device = new UsingUsb();
        console.log("Device set to USB.");
        break;
      case true:
        this.device = new UsingBluetooth();
        console.log("Device set to Bluetooth.");
        break;
      default:
        console.log("default to Bluetooth");
        this.device = new UsingBluetooth();
    }
  };

  // eslint-disable-next-line no-unused-vars
  public connect = async (onDataReceived?: (data: SensorData) => void) => {
    if (!this.device) {
      console.log("Device is not initialized. Please call choiceReader first.");
      return;
    }
    try {
      console.log("Attempting to connect to the device...");
      await this.device.connect(onDataReceived);
      console.log("Connected to the device successfully.");
    } catch (error) {
      console.log("Error while connecting to device:", error);
    }
  };

  public disconnect = async () => {
    if (!this.device) {
      console.log("Device is not initialized. Please call choiceReader first.");
      return;
    }
    try {
      console.log("Attempting to disconnect from the device...");
      await this.device.disconnect();
      console.log("Disconnected from the device successfully.");
    } catch (error) {
      console.log("Error while disconnecting from device:", error);
    }
  };

  public accelerometerCalibration = async () => {
    if (!this.device) {
      console.log("Device is not initialized.");
      return;
    }
    try {
      await this.device.accelerometerCalibration();
    } catch (error) {
      console.log("Error during accelerometer calibration:", error);
    }
  };

  public magnetometerCalibration = async (command: String) => {
    if (!this.device) {
      console.log("Device is not initialized.");
      return;
    }
    try {
      await this.device.magnetometerCalibration(command);
    } catch (error) {
      console.log("Error during magnetometer calibration:", error);
    }
  };

  public dofSelect = async (command: String) => {
    if (!this.device) {
      console.log("Device is not initialized.");
      return;
    }
    try {
      await this.device.dofSelect(command);
    } catch (error) {
      console.log("Error during DOF selection:", error);
    }
  };

  public rateSelect = async (command: Number) => {
    if (!this.device) {
      console.log("Device is not initialized.");
      return;
    }
    try {
      await this.device.rateSelect(command);
    } catch (error) {
      console.log("Error during rate selection:", error);
    }
  };
}
