import type { Dispatch, SetStateAction } from "react";
import { AstroObject, ConnectionContextType } from "@/types";
import { focusPath, focusPosPath } from "@/lib/stellarium_utils";
import { getProxyUrl } from "@/lib/get_proxy_url";

import {
  Dwarfii_Api,
  messageSystemSetTime,
  messageSystemSetTimezone,
  messageAstroStartCalibration,
  messageAstroStartGotoSolarSystem,
  messageAstroStartGotoDso,
  messageAstroStopGoto,
  messageCameraTeleCloseCamera,
  messageCameraWideCloseCamera,
  messageRgbPowerReboot,
  messageRgbPowerDown,
  messageRgbPowerCloseRGB,
  messageRgbPowerOpenRGB,
  messageRgbPowerPowerIndOFF,
  messageRgbPowerPowerIndON,
  messageStepMotorReset,
  messageStepMotorMotionTo,
  messageAstroStopEqSolving,
  messageAstroStartEqSolving,
  //  messageCameraTeleGetAllFeatureParams,
  WebSocketHandler,
} from "dwarfii_api";
import { get_error } from "@/lib/dwarf_utils";
import eventBus from "@/lib/event_bus";
import { logger } from "@/lib/logger";
import {
  convertHMSToDecimalHours,
  convertHMSToDecimalDegrees,
  convertDMSToDecimalDegrees,
  convertRaDecToVec3d,
  ConvertStrDeg,
  ConvertStrHours,
  formatFloatToDecimalPlaces,
} from "@/lib/math_utils";
import { computeRaDecToAltAz, computealtAzToHADec } from "@/lib/astro_utils";
import { toIsoStringInLocalTime } from "@/lib/date_utils";
import {
  turnOnTeleCameraFn,
  updateTelescopeISPSetting,
  getAllTelescopeISPSetting,
} from "@/lib/dwarf_utils";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function calibrationHandler(
  connectionCtx: ConnectionContextType,
  setErrors: Dispatch<SetStateAction<string | undefined>>,
  setSuccess: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }
  setErrors(undefined);
  setSuccess(undefined);
  eventBus.dispatch("clearErrors", { message: "clear errors" });
  eventBus.dispatch("clearSuccess", { message: "clear success" });

  let timezone = "";

  if (connectionCtx.timezone) timezone = connectionCtx.timezone;

  let lat = connectionCtx.latitude;
  /////////////////////////////////////////
  // Reverse the Longitude for the dwarf : positive for WEST
  /////////////////////////////////////////
  let lon = 0;
  if (connectionCtx.longitude) lon = -connectionCtx.longitude;
  if (lat === undefined) return;
  if (lon === undefined) return;
  let calibration_status = false;

  connectionCtx.setAstroSettings((prev) => ({
    ...prev, // Spread the previous state
    target: undefined, // Update the target property
  }));
  connectionCtx.setAstroSettings((prev) => ({
    ...prev, // Spread the previous state
    status: undefined, // Update the status property
  }));

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_SYSTEM_SET_TIME) {
      if (result_data.data.code == 0) {
        if (callback) {
          callback(txt_info + " ok");
        }
      } else {
        if (callback) {
          callback(txt_info + " error");
        }
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_SYSTEM_SET_TIME_ZONE
    ) {
      if (result_data.data.code == 0) {
        if (callback) {
          callback(txt_info + " ok");
        }
      } else {
        if (callback) {
          callback(txt_info + " error");
        }
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_CALIBRATION
    ) {
      if (
        result_data.data.code ==
        Dwarfii_Api.DwarfErrorCode.CODE_ASTRO_PLATE_SOLVING_FAILED
      ) {
        setErrors("");
        setSuccess("");
        setErrors("Error Plate Solving");
        if (callback) {
          callback("Error Plate Solving");
        }
        console.error("Error CALIBRATION CODE_ASTRO_PLATE_SOLVING_FAILED");
      }
      if (
        result_data.data.code ==
        Dwarfii_Api.DwarfErrorCode.CODE_ASTRO_FUNCTION_BUSY
      ) {
        setErrors("");
        setSuccess("");
        setErrors("Error function Busy, verify => Go Live");
        if (callback) {
          callback("Error function Busy, verify => Go Live");
        }
        console.error("Error CALIBRATION CODE_ASTRO_FUNCTION_BUSY");
      }
      if (
        result_data.data.code ==
        Dwarfii_Api.DwarfErrorCode.CODE_ASTRO_CALIBRATION_FAILED
      ) {
        setErrors("");
        setSuccess("");
        calibration_status = true;
        setErrors(txt_info + " Failure");
        if (callback) {
          callback(txt_info + " Failure");
        }
        console.error("Error CALIBRATION CODE_ASTRO_CALIBRATION_FAILED");
      }
      logger("calibrateGoto:", result_data, connectionCtx);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_ASTRO_CALIBRATION
    ) {
      if (
        calibration_status == false &&
        result_data.data.state == Dwarfii_Api.AstroState.ASTRO_STATE_IDLE
      ) {
        getAllTelescopeISPSetting(connectionCtx);
        setErrors("");
        setSuccess(txt_info + " Done");
        if (callback) {
          callback(txt_info + " Successfully");
        }
      } else if (
        calibration_status == true &&
        result_data.data.state == Dwarfii_Api.AstroState.ASTRO_STATE_IDLE
      ) {
        getAllTelescopeISPSetting(connectionCtx);
        setErrors("");
        setSuccess("");
        setErrors(txt_info + " Failure");
        if (callback) {
          callback(txt_info + " Failure");
        }
      } else {
        setErrors("");
        setSuccess(
          txt_info +
            " Phase #" +
            result_data.data.plateSolvingTimes +
            " " +
            result_data.data.statePlainTxt
        );
        if (callback) {
          callback(
            txt_info +
              " Phase #" +
              result_data.data.plateSolvingTimes +
              " " +
              result_data.data.statePlainTxt
          );
        }
      }
    } else {
      logger("", result_data, connectionCtx);
      return;
    }
    if (callback) {
      callback(result_data);
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Command : messageSystemSetTime
  let WS_Packet1 = messageSystemSetTime();
  let txtInfoCommand1 = "SetTime";

  webSocketHandler.prepare(
    WS_Packet1,
    txtInfoCommand1,
    [Dwarfii_Api.DwarfCMD.CMD_SYSTEM_SET_TIME],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  await sleep(500);

  // Send Command : messageSystemSetTimezone
  let WS_Packet2 = messageSystemSetTimezone(timezone);
  let txtInfoCommand2 = "SetTimezone";

  webSocketHandler.prepare(
    WS_Packet2,
    txtInfoCommand2,
    [Dwarfii_Api.DwarfCMD.CMD_SYSTEM_SET_TIME_ZONE],
    customMessageHandler
  );

  await sleep(500);

  // Send Command : messageAstroStartCalibration
  let WS_Packet3 = messageAstroStartCalibration();
  let txtInfoCommand3 = "Calibration";
  webSocketHandler.prepare(
    WS_Packet3,
    txtInfoCommand3,
    [
      Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_CALIBRATION,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_ASTRO_CALIBRATION,
    ],
    customMessageHandler
  );
}

export async function startGotoHandler(
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  setGotoSuccess: Dispatch<SetStateAction<string | undefined>>,
  planet: number | undefined | null,
  RA: string | undefined | null,
  declination: string | undefined | null,
  objectName: string | undefined,
  callback?: (options: any) => void, // eslint-disable-line no-unused-vars
  stopGoto: boolean = false
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }
  setGotoErrors(undefined);
  setGotoSuccess(undefined);
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  //Get all Character before ( and remove spaces in Target Name
  let targetName = "";
  if (objectName) {
    let beginStr = objectName.substring(0, objectName.indexOf("("));
    if (beginStr) targetName = beginStr.trim().replace(/ /g, "_");
    else targetName = objectName.trim().replace(/ /g, "_");
  }
  let lat = 0;
  if (connectionCtx.latitude) lat = connectionCtx.latitude;
  /////////////////////////////////////////
  // Reverse the Longitude for the dwarf : positive for WEST
  /////////////////////////////////////////
  let lon = 0;
  if (connectionCtx.longitude) lon = -connectionCtx.longitude;
  if (lat === undefined) return;
  if (lon === undefined) return;
  let goto_status = false;

  const customMessageHandler = (txt_info, result_data) => {
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_GOTO_DSO ||
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_GOTO_SOLAR_SYSTEM
    ) {
      if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
        setGotoSuccess("");
        get_error("Error GOTO: ", result_data, setGotoErrors);
        if (
          result_data.data.code ==
            Dwarfii_Api.DwarfErrorCode.CODE_ASTRO_GOTO_FAILED ||
          result_data.data.code ==
            Dwarfii_Api.DwarfErrorCode.CODE_ASTRO_FUNCTION_BUSY
        )
          goto_status = true;
        connectionCtx.setAstroSettings((prev) => ({
          ...prev, // Spread the previous state
          status: -1, // Update the status property // Error
        }));

        if (callback) {
          callback("Error GoTo");

          resetCameraData(connectionCtx);
        }
      }
    } else if (
      !goto_status &&
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_ASTRO_GOTO
    ) {
      setGotoSuccess(result_data.data.statePlainTxt);
      setGotoErrors("");
      if (callback) {
        callback("Info GoTo");
      }
    } else if (
      !goto_status &&
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_ASTRO_TRACKING
    ) {
      if (
        result_data.data.state ==
          Dwarfii_Api.OperationState.OPERATION_STATE_RUNNING &&
        result_data.data.targetName == targetName
      ) {
        goto_status = true;
        connectionCtx.setAstroSettings((prev) => ({
          ...prev, // Spread the previous state
          status: 1, // Update the status property // OK
        }));
        setGotoSuccess("Start Tracking");
        setGotoErrors("");
        if (callback) {
          callback("Start Tracking");
        }
        // Stop Goto for Reset Position
        if (stopGoto) {
          stopGotoHandler(
            connectionCtx,
            setGotoErrors,
            setGotoSuccess,
            callback
          );
        }
        resetCameraData(connectionCtx);
      }
    } else {
      logger("", result_data, connectionCtx);
      return;
    }
    if (callback) {
      callback(result_data);
    }
    logger(txt_info, result_data, connectionCtx);
  };

  let RA_number = RA ? convertHMSToDecimalHours(RA!, 7) : 0;
  let declination_number = declination
    ? convertDMSToDecimalDegrees(declination!)
    : 0;

  connectionCtx.setAstroSettings((prev) => ({
    ...prev, // Spread the previous state
    rightAscension: RA!, // Update the rightAscension property
  }));
  connectionCtx.setAstroSettings((prev) => ({
    ...prev, // Spread the previous state
    declination: declination!, // Update the declination property
  }));

  if (!connectionCtx.isSavedPosition && RA_number && declination_number) {
    let today = new Date();
    connectionCtx.setAstroSavePosition((prev) => ({
      ...prev, // Spread the previous state
      rightAscension: RA_number, // Update the rightAscension property
    }));
    connectionCtx.setAstroSavePosition((prev) => ({
      ...prev, // Spread the previous state
      declination: declination_number, // Update the declination property
    }));
    connectionCtx.setAstroSavePosition((prev) => ({
      ...prev, // Spread the previous state
      strLocalTime: toIsoStringInLocalTime(today), // Update the strLocalTime property
    }));
    connectionCtx.setSavePositionStatus(true); // OK
  }
  console.log("Object Name :  " + objectName);
  console.log("Target Name :  " + targetName);
  if (planet) {
    console.log("planet :  " + planet);
  }
  if (planet) {
    console.log("planet Name : " + Dwarfii_Api.SolarSystemTarget[planet]);
  }
  let WS_Packet;
  if (planet) {
    // Send Command : cmdAstroStartGotoDso
    if (Dwarfii_Api.SolarSystemTarget[planet]) {
      targetName = Dwarfii_Api.SolarSystemTarget[planet];
      WS_Packet = messageAstroStartGotoSolarSystem(
        planet,
        lon,
        lat,
        Dwarfii_Api.SolarSystemTarget[planet]
      );
    } else if (targetName) {
      WS_Packet = messageAstroStartGotoSolarSystem(
        planet,
        lon,
        lat,
        targetName
      );
    } else {
      WS_Packet = messageAstroStartGotoSolarSystem(planet, lon, lat, "-");
    }
  } else if (targetName) {
    // Send Command : messageAstroStartGotoDso
    WS_Packet = messageAstroStartGotoDso(
      RA_number,
      declination_number,
      targetName
    );
  }
  connectionCtx.setAstroSettings((prev) => ({
    ...prev, // Spread the previous state
    target: targetName!, // Update the target property
  }));
  connectionCtx.setAstroSettings((prev) => ({
    ...prev, // Spread the previous state
    status: 0, // Update the status property // in progress
  }));

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Command
  let txtInfoCommand = "Start Goto";

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_GOTO_DSO,
      Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_GOTO_SOLAR_SYSTEM,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_ASTRO_GOTO,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_ASTRO_TRACKING,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

function resetCameraData(connectionCtx) {
  setTimeout(() => {
    turnOnTeleCameraFn(connectionCtx);
  }, 1000);
  setTimeout(() => {
    updateTelescopeISPSetting(
      "gainMode",
      connectionCtx.astroSettings.gainMode as number,
      connectionCtx
    );
  }, 1500);
  setTimeout(() => {
    updateTelescopeISPSetting(
      "exposureMode",
      connectionCtx.astroSettings.exposureMode as number,
      connectionCtx
    );
  }, 2000);
  setTimeout(() => {
    updateTelescopeISPSetting(
      "gain",
      connectionCtx.astroSettings.gain as number,
      connectionCtx
    );
  }, 2500);
  setTimeout(() => {
    updateTelescopeISPSetting(
      "exposure",
      connectionCtx.astroSettings.exposure as number,
      connectionCtx
    );
  }, 3000);
  setTimeout(() => {
    updateTelescopeISPSetting(
      "IR",
      connectionCtx.astroSettings.IR as number,
      connectionCtx
    );
  }, 3500);
}

export function savePositionHandler(
  connectionCtx: ConnectionContextType,
  setPosition: Dispatch<SetStateAction<string | undefined>>,
  current_position = "Recorded Position: ",
  no_position = "No Recorded Position"
) {
  //Save Position

  if (
    connectionCtx.astroSavePosition.rightAscension &&
    connectionCtx.astroSavePosition.declination &&
    connectionCtx.astroSavePosition.strLocalTime
  ) {
    //Convert to RA to Degrees
    let results = computeRaDecToAltAz(
      connectionCtx.latitude!,
      connectionCtx.longitude!,
      connectionCtx.astroSavePosition.rightAscension! * 15,
      connectionCtx.astroSavePosition.declination!,
      connectionCtx.astroSavePosition.strLocalTime,
      connectionCtx.timezone
    );

    if (results) {
      connectionCtx.setAstroSavePosition((prev) => ({
        ...prev, // Spread the previous state
        altitude: results.alt!, // Update the altitude property
      }));
      connectionCtx.setAstroSettings((prev) => ({
        ...prev, // Spread the previous state
        azimuth: results.az!, // Update the azimuth property
      }));
      connectionCtx.setAstroSettings((prev) => ({
        ...prev, // Spread the previous state
        lst: results.lst!, // Update the lst property
      }));

      connectionCtx.setIsSavedPosition(true);
      setPosition(
        current_position +
          "alt: " +
          ConvertStrDeg(formatFloatToDecimalPlaces(results.alt, 4)) +
          ",az: " +
          ConvertStrDeg(formatFloatToDecimalPlaces(results.az, 4))
      );
    }
  } else setPosition(no_position);
}

export function gotoPositionHandler(
  connectionCtx: ConnectionContextType,
  setPosition: Dispatch<SetStateAction<string | undefined>>,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  setGotoSuccess: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void, // eslint-disable-line no-unused-vars
  info_txt = "Initial Position",
  no_position = "No Recorded Position"
) {
  //get Save Position
  let today = new Date();

  if (
    connectionCtx.astroSavePosition.altitude &&
    connectionCtx.astroSavePosition.azimuth
  ) {
    let results = computealtAzToHADec(
      connectionCtx.latitude!,
      connectionCtx.longitude!,
      connectionCtx.astroSavePosition.altitude!,
      connectionCtx.astroSavePosition.azimuth!,
      toIsoStringInLocalTime(today),
      connectionCtx.timezone
    );

    if (results) {
      setPosition(
        info_txt +
          ": alt: " +
          ConvertStrDeg(
            formatFloatToDecimalPlaces(
              connectionCtx.astroSavePosition.altitude,
              4
            )
          ) +
          ",az: " +
          ConvertStrDeg(
            formatFloatToDecimalPlaces(
              connectionCtx.astroSavePosition.azimuth,
              4
            )
          ) +
          " => RA: " +
          ConvertStrHours(results.ra / 15) +
          ", Declination: " +
          ConvertStrDeg(results.dec)
      );
      startGotoHandler(
        connectionCtx,
        setGotoErrors,
        setGotoSuccess,
        undefined,
        ConvertStrHours(results.ra / 15),
        ConvertStrDeg(results.dec),
        info_txt,
        callback,
        true
      );
    }
  } else setPosition(no_position);
}

export async function stopGotoHandler(
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  setGotoSuccess: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setGotoErrors(undefined);
  setGotoSuccess(undefined);
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_ASTRO_STOP_GOTO) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setGotoSuccess("Stopping Goto");
        setGotoErrors("");
        connectionCtx.setAstroSettings((prev) => ({
          ...prev, // Spread the previous state
          target: undefined!, // Update the target property
        }));
        connectionCtx.setAstroSettings((prev) => ({
          ...prev, // Spread the previous state
          status: undefined, // Update the status property
        }));
        if (callback) {
          callback("Stopping Goto");
        }
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_ASTRO_GOTO
    ) {
      if (callback) {
        callback(result_data);
      }
    } else {
      logger("", result_data, connectionCtx);
      return;
    }
    if (callback) {
      callback(result_data);
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  if (connectionCtx.socketIPDwarf) {
    console.log("OK KEEP SOCKET");
  } else {
    console.log("NO NEW SOCKET");
  }
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Command : messageAstroStopGoto
  let WS_Packet = messageAstroStopGoto();
  //  let WS_Packet = messageCameraTeleGetAllFeatureParams();
  let txtInfoCommand = "Stop Goto";

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_ASTRO_STOP_GOTO,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_ASTRO_GOTO,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function PowerLightsHandlerFn(
  setOff: boolean,
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }
  setGotoErrors(undefined);
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  // Send Command : CmdRGBPowerPowerIndON or CmdRGBPowerPowerIndOFF
  let WS_Packet1 = {};
  let txtInfoCommand = "Switch Power Light";
  if (setOff) {
    WS_Packet1 = messageRgbPowerPowerIndOFF();
  } else WS_Packet1 = messageRgbPowerPowerIndON();

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  await sleep(10);

  webSocketHandler.prepare(WS_Packet1, txtInfoCommand, [
    Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_POWERIND_ON,
    Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_POWERIND_OFF,
    Dwarfii_Api.DwarfCMD.CMD_NOTIFY_POWER_IND_STATE,
  ]);

  await sleep(100);
}

export async function RingLightsHandlerFn(
  setOff: boolean,
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }
  setGotoErrors(undefined);
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  // Send Command : cmdRgbPowerOpenRGB or cmdRgbCloseRGB
  let WS_Packet1 = {};
  let txtInfoCommand = "Switch Ring Light";
  if (setOff) {
    WS_Packet1 = messageRgbPowerCloseRGB();
  } else WS_Packet1 = messageRgbPowerOpenRGB();

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  await sleep(10);

  webSocketHandler.prepare(WS_Packet1, txtInfoCommand, [
    Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_OPEN_RGB,
    Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_CLOSE_RGB,
    Dwarfii_Api.DwarfCMD.CMD_NOTIFY_POWER_IND_STATE,
  ]);

  await sleep(100);
}

export async function shutDownHandler(
  reboot: boolean,
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }
  setGotoErrors(undefined);
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  const customMessageHandler = (txt_info, result_data) => {
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_POWER_DOWN ||
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_REBOOT ||
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_CLOSE_CAMERA ||
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_CLOSE_CAMERA ||
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_POWER_OFF
    ) {
      if (callback) {
        callback(result_data);
      }
      logger(txt_info, result_data, connectionCtx);
    } else {
      logger("", result_data, connectionCtx);
    }
  };

  // Send Command : cmdRgbPowerReboot or cmdRgbPowerDown
  let WS_Packet1 = {};
  let WS_Packet2 = {};
  let WS_Packet3 = {};
  let txtInfoCommand = "Shutdown";
  if (reboot) {
    WS_Packet1 = messageCameraTeleCloseCamera();
    WS_Packet2 = messageCameraWideCloseCamera();
    WS_Packet3 = messageRgbPowerReboot();
    txtInfoCommand = "Reboot";
  } else WS_Packet1 = messageRgbPowerDown();

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  if (reboot) {
    await sleep(10);

    webSocketHandler.prepare(
      [WS_Packet1, WS_Packet2, WS_Packet3],
      txtInfoCommand,
      [
        Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_REBOOT,
        Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_POWER_DOWN,
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_CLOSE_CAMERA,
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_CLOSE_CAMERA,
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_POWER_OFF,
      ],
      customMessageHandler
    );
  } else {
    webSocketHandler.prepare(
      WS_Packet1,
      txtInfoCommand,
      [
        Dwarfii_Api.DwarfCMD.CMD_RGB_POWER_POWER_DOWN,
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_CLOSE_CAMERA,
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_CLOSE_CAMERA,
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_POWER_OFF,
      ],
      customMessageHandler
    );
  }

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  await sleep(5000);
}

export async function dwarfResetMotorHandlerFn(
  polarAlign: boolean,
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  setGotoSuccess: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setGotoErrors(undefined);
  setGotoSuccess("Start Motor Reseting");
  eventBus.dispatch("clearErrors", { message: "clear errors" });
  let currentCommand = 0;
  let maxCommand = 4;

  const customMessageHandler = (txt_info, result_data) => {
    let find_error = false;
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_STEP_MOTOR_RESET) {
      if (result_data.type == 3) {
        if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
          console.log("Notification CMD_STEP_MOTOR_RESET");
          processCommand(currentCommand);
          currentCommand++;
          setGotoSuccess("Motor Reset");
          setGotoErrors("");
          if (callback) {
            callback("Polar align Goto");
          }
        } else find_error = true;
      } else if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setGotoSuccess("Motor Reset");
        setGotoErrors("");
        if (callback) {
          callback("Motor Reseting");
        }
      } else find_error = true;
    } else {
      logger("", result_data, connectionCtx);
      return;
    }
    if (callback) {
      callback(result_data);
    }
    logger(txt_info, result_data, connectionCtx);
    if (find_error) {
      get_error("Error: ", result_data, setGotoErrors);
    }
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  if (connectionCtx.socketIPDwarf) {
    console.log("OK KEEP SOCKET");
  } else {
    console.log("NO NEW SOCKET");
  }
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  const processCommand = (indCommand) => {
    if (indCommand < maxCommand) {
      webSocketHandler.prepare(
        WS_Packet[indCommand],
        txtInfoCommand,
        [Dwarfii_Api.DwarfCMD.CMD_STEP_MOTOR_RESET],
        customMessageHandler
      );
    }
    if (indCommand == maxCommand && polarAlign)
      polarAlignHandlerFn(
        connectionCtx,
        setGotoErrors,
        setGotoSuccess,
        callback
      );
  };
  // Send Command : messageStepMotorReset
  let WS_Packet = new Array();
  WS_Packet[0] = messageStepMotorReset(1, true);
  WS_Packet[1] = messageStepMotorReset(1, false);
  WS_Packet[2] = messageStepMotorReset(2, false);
  WS_Packet[3] = messageStepMotorReset(2, true);
  let txtInfoCommand = "motor Reset";

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  processCommand(currentCommand);
  currentCommand++;
}

export async function polarAlignHandlerFn(
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  setGotoSuccess: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setGotoErrors(undefined);
  setGotoSuccess("Start Polar Align Process");
  eventBus.dispatch("clearErrors", { message: "clear errors" });
  let currentCommand = 0;
  let maxCommand = 2;

  const customMessageHandler = (txt_info, result_data) => {
    let find_error = false;
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_STEP_MOTOR_RUN_TO) {
      if (result_data.type == 3) {
        if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
          console.log("Notification CMD_STEP_MOTOR_RUN_TO");
          if (currentCommand < maxCommand) {
            processCommand(currentCommand);
            currentCommand++;
            setGotoSuccess("Motor Goto Position");
            setGotoErrors("");
            if (callback) {
              callback("Polar align Goto");
            }
          } else {
            // End OK
            setGotoSuccess("POLAR ALIGN POSITION OK");
            setGotoErrors("");
          }
        } else find_error = true;
      } else if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setGotoSuccess("Motor Goto Position");
        setGotoErrors("");
        if (callback) {
          callback("Polar align Goto");
        }
      } else find_error = true;
    } else if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_STEP_MOTOR_RESET) {
      if (result_data.type == 3) {
        if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
          console.log("Notification CMD_STEP_MOTOR_RESET");
          processCommand(currentCommand);
          currentCommand++;
          setGotoSuccess("Motor Reset");
          setGotoErrors("");
          if (callback) {
            callback("Polar align Goto");
          }
        } else find_error = true;
      } else if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setGotoSuccess("Motor Reset");
        setGotoErrors("");
        if (callback) {
          callback("Polar align Goto");
        }
      } else find_error = true;
    } else {
      logger("", result_data, connectionCtx);
      return;
    }
    if (callback) {
      callback(result_data);
    }
    logger(txt_info, result_data, connectionCtx);
    if (find_error) {
      get_error("Error: ", result_data, setGotoErrors);
    }
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  if (connectionCtx.socketIPDwarf) {
    console.log("OK KEEP SOCKET");
  } else {
    console.log("NO NEW SOCKET");
  }
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  const processCommand = (indCommand) => {
    if (indCommand < maxCommand) {
      webSocketHandler.prepare(
        WS_Packet[indCommand],
        txtInfoCommand,
        [Dwarfii_Api.DwarfCMD.CMD_STEP_MOTOR_RUN_TO],
        customMessageHandler
      );
    }
  };
  // Send Command : messageStepMotorReset
  let WS_Packet = new Array();
  if (connectionCtx.typeNameDwarf == "Dwarf II")
    WS_Packet[0] = messageStepMotorMotionTo(1, 158.6, 10, 100, 3);
  else WS_Packet[0] = messageStepMotorMotionTo(2, 158, 10, 100, 3);
  if (connectionCtx.typeNameDwarf == "Dwarf II")
    WS_Packet[1] = messageStepMotorMotionTo(2, 150.5, 10, 100, 3);
  else WS_Packet[1] = messageStepMotorMotionTo(2, 169, 10, 100, 3);
  let txtInfoCommand = "Polar align Goto";

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  processCommand(currentCommand);
  currentCommand++;
}

export async function polarAlignPositionHandlerFn(
  mode: number,
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  setGotoSuccess: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setGotoErrors(undefined);
  setGotoSuccess("Start Polar Align Position");
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  const customMessageHandler = (txt_info, result_data) => {
    let find_error = false;
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_STEP_MOTOR_RUN_TO) {
      if (result_data.type == 3) {
        if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
          console.log("Notification CMD_STEP_MOTOR_RUN_TO");
          if (mode == 1) setGotoSuccess("POLAR ALIGN POSITION OK");
          else setGotoSuccess("POLAR ALIGN POSITION OK");
          setGotoErrors("");
          if (callback) {
            callback("Polar align Goto");
          }
        } else find_error = true;
      } else if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setGotoSuccess("Motor Goto Position");
        setGotoErrors("");
        if (callback) {
          callback("Polar align Goto");
        }
      } else find_error = true;
    } else {
      logger("", result_data, connectionCtx);
      return;
    }
    if (callback) {
      callback(result_data);
    }
    logger(txt_info, result_data, connectionCtx);
    if (find_error) {
      get_error("Error: ", result_data, setGotoErrors);
    }
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  if (connectionCtx.socketIPDwarf) {
    console.log("OK KEEP SOCKET");
  } else {
    console.log("NO NEW SOCKET");
  }
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  let WS_Packet;
  if (mode == 1)
    if (connectionCtx.typeNameDwarf == "Dwarf II")
      WS_Packet = messageStepMotorMotionTo(1, 67.6, 10, 100, 3);
    else WS_Packet = messageStepMotorMotionTo(1, 67.6 + 0.5, 10, 100, 3);
  else if (mode == 0)
    if (connectionCtx.typeNameDwarf == "Dwarf II")
      WS_Packet = messageStepMotorMotionTo(1, 158.6, 10, 100, 3);
    else WS_Packet = messageStepMotorMotionTo(1, 158, 10, 100, 3);
  else if (mode == 2) WS_Packet = messageStepMotorMotionTo(2, 317, 10, 100, 2);

  let txtInfoCommand = "Polar align Position";

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [Dwarfii_Api.DwarfCMD.CMD_STEP_MOTOR_RUN_TO],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function EQSolvingHandlerFn(
  connectionCtx: ConnectionContextType,
  setErrors: Dispatch<SetStateAction<string | undefined>>,
  setSuccess: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  let lat = 0;
  if (connectionCtx.latitude) lat = connectionCtx.latitude;
  /////////////////////////////////////////
  // Reverse the Longitude for the dwarf : positive for WEST
  /////////////////////////////////////////
  let lon = 0;
  if (connectionCtx.longitude) lon = -connectionCtx.longitude;
  if (lat === undefined || lon === undefined) {
    setErrors("Longitude or Lattitude are not defined");
    return;
  }

  setErrors(undefined);
  setSuccess("Start EQ Solving Process");
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  const customMessageHandler = (txt_info, result_data) => {
    let find_error = false;
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_EQ_SOLVING) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrors("");
        setSuccess("EQ Solving Result");
        connectionCtx.setAstroEQSolvingResult((prev) => ({
          ...prev, // Spread the previous state
          azimuth_err: result_data.data.aziErr, // Update the azimuth_err property
        }));
        connectionCtx.setAstroEQSolvingResult((prev) => ({
          ...prev, // Spread the previous state
          altitude_err: result_data.data.altErr, // Update the altitude_err property
        }));
        setSuccess(
          " azi_err = " +
            result_data.data.aziErr +
            " , alt_err = " +
            result_data.data.altErr
        );
        if (callback) {
          callback(
            txt_info +
              " Result: azi_err = " +
              result_data.data.aziErr +
              " , alt_err = " +
              result_data.data.altErr
          );
        }
      } else find_error = true;
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_EQ_SOLVING_STATE
    ) {
      console.log("Notification CMD_NOTIFY_EQ_SOLVING_STATE");
      setSuccess("EQ Solving State");
      setErrors("");
      if (callback) {
        callback("EQ Solving State");
      }

      setErrors("");
      setSuccess(
        txt_info +
          " Phase #" +
          result_data.data.step +
          " " +
          result_data.data.statePlainTxt
      );
      if (callback) {
        callback(
          txt_info +
            " Phase #" +
            result_data.data.step +
            " " +
            result_data.data.statePlainTxt
        );
      }
    } else {
      logger("", result_data, connectionCtx);
      return;
    }
    if (callback) {
      callback(result_data);
    }
    logger(txt_info, result_data, connectionCtx);
    if (find_error) {
      get_error("Error: ", result_data, setErrors);
    }
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  if (connectionCtx.socketIPDwarf) {
    console.log("OK KEEP SOCKET");
  } else {
    console.log("NO NEW SOCKET");
  }
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Command : messageAstroStartEqSolving
  let WS_Packet = messageAstroStartEqSolving(lon, lat);
  let txtInfoCommand = "EQ Solving";

  // Init Errors values
  connectionCtx.setAstroEQSolvingResult((prev) => ({
    ...prev, // Spread the previous state
    azimuth_err: undefined, // Update the azimuth_err property
  }));
  connectionCtx.setAstroEQSolvingResult((prev) => ({
    ...prev, // Spread the previous state
    altitude_err: undefined, // Update the altitude_err property
  }));

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_EQ_SOLVING,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_EQ_SOLVING_STATE,
    ],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function stopEQSolvingHandler(
  connectionCtx: ConnectionContextType,
  setGotoErrors: Dispatch<SetStateAction<string | undefined>>,
  setGotoSuccess: Dispatch<SetStateAction<string | undefined>>,
  callback?: (options: any) => void // eslint-disable-line no-unused-vars
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setGotoErrors(undefined);
  setGotoSuccess(undefined);
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_ASTRO_STOP_EQ_SOLVING) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setGotoSuccess("Stopping EQ Align");
        setGotoErrors("");
        if (callback) {
          callback("Stopping EQ Align");
        }
      }
    } else {
      logger("", result_data, connectionCtx);
      return;
    }
    if (callback) {
      callback(result_data);
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  if (connectionCtx.socketIPDwarf) {
    console.log("OK KEEP SOCKET");
  } else {
    console.log("NO NEW SOCKET");
  }
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Command : messageAstroStopEqSolving
  let WS_Packet = messageAstroStopEqSolving();
  let txtInfoCommand = "Stop EQ Mode";

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [Dwarfii_Api.DwarfCMD.CMD_ASTRO_STOP_EQ_SOLVING],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export function stellariumErrorHandler(
  err: any,
  setErrors: Dispatch<SetStateAction<string | undefined>>
) {
  if (
    err.name === "AbortError" ||
    err.message === "Failed to fetch" ||
    err.message === "Load failed"
  ) {
    setErrors("Can not connect to Stellarium");
  } else if (err.message === "StellariumError") {
    setErrors(err.cause);
  } else {
    setErrors(`Error processing Stellarium data>> ${err}`);
  }
}

export function centerCoordinatesHandler(
  RA: string | undefined,
  declination: string | undefined,
  connectionCtx: ConnectionContextType,
  setErrors: Dispatch<SetStateAction<string | undefined>>
) {
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  let url = connectionCtx.urlStellarium;
  if (url) {
    console.log("select object in stellarium...");

    console.log("select object by coordinates in stellarium...");

    // Convert Ra and Dec to Vec3d used by Stellarium
    let RA_number = RA ? convertHMSToDecimalDegrees(RA!) : 0;
    let declination_number = declination
      ? convertDMSToDecimalDegrees(declination!)
      : 0;

    let coord = convertRaDecToVec3d(declination_number, RA_number);
    let str_coord = `[${coord.x},${coord.y},${coord.z}]`;
    console.log(`coordinates found: ${str_coord}`);

    let focusUrl = `${url}${focusPosPath}${str_coord}`;
    if (connectionCtx.proxyIP && getProxyUrl(connectionCtx)) {
      const targetUrl = new URL(focusUrl);
      focusUrl = `${getProxyUrl(connectionCtx)}?target=${encodeURIComponent(
        targetUrl.href
      )}`;
    }
    console.log("focusUrl : " + focusUrl);
    fetch(focusUrl, { method: "POST", signal: AbortSignal.timeout(2000) })
      // res.json don't work here
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        console.log(data);
        if (data != "ok") {
          setErrors(`Could not find object by coordinates : ${str_coord}`);
        }
      })
      .catch((err) => stellariumErrorHandler(err, setErrors));
  } else {
    setErrors("App is not connect to Stellarium.");
  }
}

export function centerHandler(
  object: AstroObject,
  connectionCtx: ConnectionContextType,
  setErrors: Dispatch<SetStateAction<string | undefined>>,
  functionSuccess?: () => void // eslint-disable-line no-unused-vars
) {
  eventBus.dispatch("clearErrors", { message: "clear errors" });

  let url = connectionCtx.urlStellarium;
  if (url) {
    console.log("select object in stellarium...");

    if (object.type == "Mosaic") {
      console.log("select object by coordinates in stellarium...");

      // Convert Ra and Dec to Vec3d used by Stellarium
      let RA_number = object.ra ? convertHMSToDecimalDegrees(object.ra!) : 0;
      let declination_number = object.dec
        ? convertDMSToDecimalDegrees(object.dec!)
        : 0;

      let coord = convertRaDecToVec3d(declination_number, RA_number);
      let str_coord = `[${coord.x},${coord.y},${coord.z}]`;
      console.log(`coordinates found: ${str_coord}`);

      let focusUrl = `${url}${focusPosPath}${str_coord}`;
      if (connectionCtx.proxyIP && getProxyUrl(connectionCtx)) {
        const targetUrl = new URL(focusUrl);
        focusUrl = `${getProxyUrl(connectionCtx)}?target=${encodeURIComponent(
          targetUrl.href
        )}`;
      }
      console.log("focusUrl : " + focusUrl);
      fetch(focusUrl, { method: "POST", signal: AbortSignal.timeout(2000) })
        // res.json don't work here
        .then((res) => {
          return res.text();
        })
        .then((data) => {
          console.log(data);
          if (data != "ok") {
            setErrors(`Could not find object by coordinates : ${str_coord}`);
          }
        })
        .catch((err) => stellariumErrorHandler(err, setErrors));
    } else {
      console.log("select object by name in stellarium...");
      let focusUrl = `${url}${focusPath}${object.designation}`;
      if (connectionCtx.proxyIP && getProxyUrl(connectionCtx)) {
        const targetUrl = new URL(focusUrl);
        focusUrl = `${getProxyUrl(connectionCtx)}?target=${encodeURIComponent(
          targetUrl.href
        )}`;
      }
      console.log("focusUrl : " + focusUrl);
      fetch(focusUrl, { method: "POST", signal: AbortSignal.timeout(2000) })
        .then((res) => {
          return res.text();
        })
        .then((data) => {
          console.log(data);
          if (data != "true" && object.type != "Asteroid") {
            // try by coordinate
            // Convert Ra and Dec to Vec3d used by Stellarium
            let RA_number = object.ra
              ? convertHMSToDecimalDegrees(object.ra!)
              : 0;
            let declination_number = object.dec
              ? convertDMSToDecimalDegrees(object.dec!)
              : 0;

            let coord = convertRaDecToVec3d(declination_number, RA_number);
            let str_coord = `[${coord.x},${coord.y},${coord.z}]`;
            console.log(`coordinates found: ${str_coord}`);

            focusUrl = `${url}${focusPosPath}${str_coord}`;
            if (connectionCtx.proxyIP && getProxyUrl(connectionCtx)) {
              const targetUrl = new URL(focusUrl);
              focusUrl = `${getProxyUrl(
                connectionCtx
              )}?target=${encodeURIComponent(targetUrl.href)}`;
            }
            console.log("focusUrl : " + focusUrl);
            fetch(focusUrl, {
              method: "POST",
              signal: AbortSignal.timeout(2000),
            })
              // res.json don't work here
              .then((res) => {
                return res.text();
              })
              .then((data) => {
                console.log(data);
                if (data != "ok") {
                  setErrors(
                    `Could not find object by coordinates : ${object.designation}`
                  );
                }
              })
              .catch((err) => stellariumErrorHandler(err, setErrors));
          } else if (data != "true" && object.type == "Asteroid") {
            setErrors(
              `Could not find Asteroid : ${object.designation} in Stellarium`
            );
          } else if (functionSuccess) functionSuccess();
        })
        .catch((err) => stellariumErrorHandler(err, setErrors));
    }
  } else {
    setErrors("App is not connect to Stellarium.");
  }
}
