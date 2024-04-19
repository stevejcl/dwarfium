import { SensorData } from "./ExtractDataFromRaw";
import { UsingUsb } from "./ConnectToUsb";
import { UsingBluetooth } from "./ConnectToBluetooth";
import { DeviceInterface } from "./DeviceInterface";

export class Application implements DeviceInterface {
  device!: DeviceInterface;

  public choiceReader = (kind: boolean) => {
    switch (kind) {
      case false:
        this.device = new UsingUsb();
        break;
      case true:
        this.device = new UsingBluetooth();
        break;
    }
  };

  // eslint-disable-next-line no-unused-vars
  public connect = async (onDataReceived?: (data: SensorData) => void) => {
    this.device.connect(onDataReceived);
  };

  public disconnect = async () => {
    this.device.disconnect();
  };

  public accelerometerCalibration = async () => {
    this.device.accelerometerCalibration();
  };

  public magnetometerCalibration = async (command: String) => {
    this.device.magnetometerCalibration(command);
  };

  public dofSelect = async (command: String) => {
    this.device.dofSelect(command);
  };

  public rateSelect = async (command: Number) => {
    this.device.rateSelect(command);
  };
}
