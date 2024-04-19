/* eslint-disable no-unused-vars */
//import { sleep } from "@amcharts/amcharts5/.internal/core/util/Time";
import { sleep } from "./helper";

const CommandSettings = {
  accelerometer_calibration: new Uint8Array([255, 170, 1, 1, 0]),
  magnetometer_calibration: new Uint8Array([255, 170, 1, 7, 0]),
  exit_calibration_mode: new Uint8Array([255, 170, 1, 0, 0]),
  DOF_6: new Uint8Array([255, 170, 36, 1, 0]),
  DOF_9: new Uint8Array([255, 170, 36, 0, 0]),
  save_configuration: new Uint8Array([255, 170, 0, 0, 0]),
};
const RateSettings = {
  rate_02: new Uint8Array([255, 170, 3, 1, 0]),
  rate_05: new Uint8Array([255, 170, 3, 2, 0]),
  rate_1: new Uint8Array([255, 170, 3, 3, 0]),
  rate_2: new Uint8Array([255, 170, 3, 4, 0]),
  rate_5: new Uint8Array([255, 170, 3, 5, 0]),
  rate_10: new Uint8Array([255, 170, 3, 6, 0]),
  rate_20: new Uint8Array([255, 170, 3, 7, 0]),
  rate_50: new Uint8Array([255, 170, 3, 8, 0]),
};

export const defaultAccelerometerCalibration = async (
  writeValue?: (value: ArrayBufferView) => Promise<void>
) => {
  writeValue && (await writeValue(CommandSettings.accelerometer_calibration));
  await sleep(3100);
  writeValue && (await writeValue(CommandSettings.exit_calibration_mode));
};

export const defaultMagnetometerCalibration = async (
  command: String,
  writeValue?: (value: ArrayBufferView) => Promise<void>
) => {
  switch (command) {
    case "start":
      writeValue &&
        (await writeValue(CommandSettings.magnetometer_calibration));
      break;
    case "stop":
      writeValue && (await writeValue(CommandSettings.exit_calibration_mode));
      break;
  }
};

export const defaultDofSelect = async (
  command: String,
  writeValue?: (value: ArrayBufferView) => Promise<void>
) => {
  switch (command) {
    case "6 DOF":
      writeValue && (await writeValue(CommandSettings.DOF_6));
      break;
    case "9 DOF":
      writeValue && (await writeValue(CommandSettings.DOF_9));
      break;
  }
  writeValue && (await writeValue(CommandSettings.save_configuration));
};

export const defaultRateSelect = async (
  command: Number,
  writeValue?: (value: ArrayBufferView) => Promise<void>
) => {
  switch (command) {
    case 0.2:
      writeValue && (await writeValue(RateSettings.rate_02));
      break;
    case 0.5:
      writeValue && (await writeValue(RateSettings.rate_05));
      break;
    case 1:
      writeValue && (await writeValue(RateSettings.rate_1));
      break;
    case 2:
      writeValue && (await writeValue(RateSettings.rate_2));
      break;
    case 5:
      writeValue && (await writeValue(RateSettings.rate_5));
      break;
    case 10:
      writeValue && (await writeValue(RateSettings.rate_10));
      break;
    case 20:
      writeValue && (await writeValue(RateSettings.rate_20));
      break;
    case 50:
      writeValue && (await writeValue(RateSettings.rate_50));
      break;
  }
  writeValue && (await writeValue(CommandSettings.save_configuration));
};
