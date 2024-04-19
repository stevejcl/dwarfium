/* eslint-disable no-unused-vars */
import { SensorData } from "./ExtractDataFromRaw";

export interface DeviceInterface {
  connect(onDataReceived?: (data: SensorData) => void): Promise<void>;
  disconnect(): Promise<void>;
  accelerometerCalibration(): Promise<void>;
  magnetometerCalibration(command: String): Promise<void>;
  dofSelect(command: String): Promise<void>;
  rateSelect(command: Number): Promise<void>;
}
