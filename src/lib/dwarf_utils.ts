import {
  Dwarfii_Api,
  binning1x1,
  binning2x2,
  IRCut,
  IRPass,
  fileFits,
  fileTiff,
  modeManual,
  modeAuto,
  messageCameraTeleOpenCamera,
  messageCameraWideOpenCamera,
  messageCameraTeleSetExpMode,
  messageCameraTeleSetExp,
  messageCameraTeleSetGainMode,
  messageCameraTeleSetGain,
  messageCameraTeleSetIRCut,
  messageCameraTeleGetExpMode,
  messageCameraTeleGetExp,
  messageCameraTeleGetGainMode,
  messageCameraTeleGetGain,
  messageCameraTeleGetIRCut,
  messageCameraTeleSetFeatureParams,
  messageCameraTeleGetAllParams,
  messageCameraTeleGetAllFeatureParams,
  messageCameraTeleSetJPGQuality,
  WebSocketHandler,
} from "dwarfii_api";
import { getExposureIndexDefault } from "@/lib/data_utils";
import { ConnectionContextType } from "@/types";
import { logger } from "@/lib/logger";
import { saveAstroSettingsDb } from "@/db/db_utils";

export const telephotoCamera = 0;
export const wideangleCamera = 1;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function turnOnTeleCameraFn(
  connectionCtx: ConnectionContextType,
  setTelephotoCameraStatus: any | undefined = undefined,
  setSrcTeleCamera: any | undefined = undefined
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  let binning = connectionCtx.astroSettings.binning
    ? connectionCtx.astroSettings.binning
    : binning2x2;

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_OPEN_CAMERA) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger(txt_info, result_data, connectionCtx);
        if (setTelephotoCameraStatus) {
          setTelephotoCameraStatus("on");
          setSrcTeleCamera(true);
        }
        return;
      } else {
        logger(txt_info, result_data, connectionCtx);
        if (setTelephotoCameraStatus) {
          setTelephotoCameraStatus("off");
          setSrcTeleCamera(false);
        }
        return;
      }
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Command : messageCameraTeleOpenCamera
  let WS_Packet = messageCameraTeleOpenCamera(binning);
  let txtInfoCommand = "turnOnTeleCamera";

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_OPEN_CAMERA],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  await sleep(100);
}

export async function turnOnWideCameraFn(
  connectionCtx: ConnectionContextType,
  setWideangleCameraStatus: any | undefined = undefined,
  setSrcWideCamera: any | undefined = undefined
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_OPEN_CAMERA) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger(txt_info, result_data, connectionCtx);
        if (setWideangleCameraStatus) {
          setWideangleCameraStatus("on");
          setSrcWideCamera(true);
        }
        return;
      } else {
        logger(txt_info, result_data, connectionCtx);
        if (setWideangleCameraStatus) {
          setWideangleCameraStatus("off");
          setSrcWideCamera(false);
        }
        return;
      }
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Command : messageCameraWideOpenCamera
  let WS_Packet = messageCameraWideOpenCamera();
  let txtInfoCommand = "turnOnWideCamera";

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_OPEN_CAMERA],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  await sleep(100);
}

export async function updateTelescopeISPSetting(
  type: string,
  value: number,
  connectionCtx: ConnectionContextType
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  let WS_Packet;
  let WS_Packet2;
  let cmd = "";
  let cmd2 = "";
  if (type === "exposure") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_EXP;
    WS_Packet = messageCameraTeleSetExp(value);
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_EXP;
    WS_Packet2 = messageCameraTeleGetExp();
  } else if (type === "exposureMode") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_EXP_MODE;
    WS_Packet = messageCameraTeleSetExpMode(value);
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_EXP_MODE;
    WS_Packet2 = messageCameraTeleGetExpMode();
  } else if (type === "gain") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_GAIN;
    WS_Packet = messageCameraTeleSetGain(value);
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_GAIN;
    WS_Packet2 = messageCameraTeleGetGain();
  } else if (type === "gainMode") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_GAIN_MODE;
    WS_Packet = messageCameraTeleSetGainMode(value);
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_GAIN_MODE;
    WS_Packet2 = messageCameraTeleGetGainMode();
  } else if (type === "IR") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_IRCUT;
    WS_Packet = messageCameraTeleSetIRCut(value);
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_IRCUT;
    WS_Packet2 = messageCameraTeleGetIRCut();
  } else if (type === "binning") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_FEATURE_PARAM;
    let hasAuto = false;
    let autoMode = 1; // Manual
    let id = 0; // "Astro binning"
    let modeIndex = 0;
    let index = value;
    let continueValue = 0;
    WS_Packet = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_FEATURE_PARAMS;
    WS_Packet2 = messageCameraTeleGetAllFeatureParams();
  } else if (type === "fileFormat") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_FEATURE_PARAM;
    let hasAuto = false;
    let autoMode = 1; // Manual
    let id = 2; // "Astro format"
    let modeIndex = 0;
    let index = value;
    let continueValue = 0;
    WS_Packet = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_FEATURE_PARAMS;
    WS_Packet2 = messageCameraTeleGetAllFeatureParams();
  } else if (type === "count") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_FEATURE_PARAM;
    let hasAuto = false;
    let autoMode = 1; // Manual
    let id = 1; // "Astro img_to_take"
    let modeIndex = 1;
    let index = 0;
    let continueValue = value; // Imgages To Take
    WS_Packet = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_FEATURE_PARAMS;
    WS_Packet2 = messageCameraTeleGetAllFeatureParams();
  } else if (type === "quality") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_JPG_QUALITY;
    WS_Packet = messageCameraTeleSetJPGQuality(value);
    cmd2 = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS;
    WS_Packet2 = messageCameraTeleGetAllParams();
  }

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == cmd) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger(txt_info, result_data, connectionCtx);
        return;
      }
    } else if (result_data.cmd == cmd2) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger(txt_info, result_data, connectionCtx);
        return;
      }
    }
    logger("", result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  let txtInfoCommand = `set ${type}`;

  webSocketHandler.prepare(
    [WS_Packet, WS_Packet2],
    txtInfoCommand,
    [cmd, cmd2],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function getAllTelescopeISPSetting(
  connectionCtx: ConnectionContextType,
  webSocketHandlerVal: any | undefined = undefined
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  const customMessageHandler = (txt_info, result_data) => {
    if (
      result_data.cmd ==
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_FEATURE_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        let count = 0;
        let binning;
        let fileFormat;
        if (result_data.data.allFeatureParams) {
          console.log("allFeatureParams:", result_data.data.allFeatureParams);
          // For id=0 : "Astro binning"
          const filteredArray = result_data.data.allFeatureParams.filter(
            (commonParam) =>
              !Object.prototype.hasOwnProperty.call(commonParam, "id") ||
              commonParam.id === undefined
          );
          if (filteredArray[0].index) binning = binning2x2;
          else binning = binning1x1;
          // For id=1 : "Astro img_to_take"
          const resultObject1 = result_data.data.allFeatureParams.find(
            (item) => item.id === 1
          );
          console.log("allFeatureParams-resultObject1:", resultObject1);
          count = 0;
          if (resultObject1.continueValue) {
            count = resultObject1.continueValue;
          }
          // For id=2 : Astro Format
          const resultObject2 = result_data.data.allFeatureParams.find(
            (item) => item.id === 2
          );
          console.log("allFeatureParams-resultObject2:", resultObject2);
          if (resultObject2.index) fileFormat = fileTiff;
          else fileFormat = fileFits;
          connectionCtx.astroSettings.binning = binning;
          saveAstroSettingsDb("binning", binning.toString());
          connectionCtx.astroSettings.fileFormat = fileFormat;
          saveAstroSettingsDb("fileFormat", fileFormat.toString());
          connectionCtx.astroSettings.count = count;
          saveAstroSettingsDb("count", count.toString());
        }
      }
    }
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        let exposureMode;
        let exposure = 0;
        if (result_data.data.allParams) {
          console.log("allParams:", result_data.data.allParams);
          // For id=0 : "Exposure"
          const filteredArray = result_data.data.allParams.filter(
            (commonParam) =>
              !Object.prototype.hasOwnProperty.call(commonParam, "id") ||
              commonParam.id === undefined
          );
          // id = 0 (no present)
          // autoMode == 0 => Auto not present
          if (!filteredArray[0].autoMode) exposureMode = modeAuto;
          else exposureMode = modeManual;
          if (filteredArray[0].index) exposure = filteredArray[0].index;
          else if (exposureMode == modeAuto)
            exposure = getExposureIndexDefault();
          // For id=1 : "Gain"
          const resultObject1 = result_data.data.allParams.find(
            (item) => item.id === 1
          );
          console.log("allParams-resultObject1:", resultObject1);
          let gain = 0;
          if (resultObject1.index) gain = resultObject1.index;
          // For id=8 : IR Cut
          const resultObject2 = result_data.data.allParams.find(
            (item) => item.id === 8
          );
          console.log("allParams-resultObject2:", resultObject2);
          let val_IRCut;
          if (resultObject2.index) val_IRCut = IRPass;
          else val_IRCut = IRCut;
          // For id=8 : IR Cut
          const resultObject3 = result_data.data.allParams.find(
            (item) => item.id === 8
          );
          console.log("allParams-resultObject3:", resultObject3);
          // For id=9 : previewQuality
          let previewQuality = 0;
          const resultObject4 = result_data.data.allParams.find(
            (item) => item.id === 9
          );
          console.log(
            "previewQuality: allParams-resultObject4:",
            resultObject4
          );
          if (resultObject4.continueValue)
            previewQuality = resultObject4.continueValue;
          connectionCtx.astroSettings.gain = gain;
          saveAstroSettingsDb("gain", gain.toString());
          connectionCtx.astroSettings.gainMode = modeManual;
          saveAstroSettingsDb("gainMode", modeManual.toString());
          connectionCtx.astroSettings.exposure = exposure;
          saveAstroSettingsDb("exposure", exposure.toString());
          connectionCtx.astroSettings.exposureMode = exposureMode;
          saveAstroSettingsDb("exposureMode", exposureMode.toString());
          connectionCtx.astroSettings.IR = val_IRCut;
          saveAstroSettingsDb("IR", val_IRCut.toString());
          connectionCtx.astroSettings.quality = previewQuality;
          saveAstroSettingsDb("quality", previewQuality.toString());
        }
      }
    }
  };

  // get webSocketHandlerVal from first connection : avoid undefined value from connectionCtx
  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = webSocketHandlerVal
    ? webSocketHandlerVal
    : connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  let txtInfoCommand = "get CameraParameter";
  let WS_Packet = messageCameraTeleGetAllParams();
  let WS_Packet2 = messageCameraTeleGetAllFeatureParams();

  webSocketHandler.prepare(
    [WS_Packet, WS_Packet2],
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS,
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_FEATURE_PARAMS,
    ],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  /*
  cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_ALL_PARAMS;
  WS_Packet = messageCameraTeleSetAllParams(1,99, 1, 18, 1, 1, 2, 3, 120, 100, 90, 80, 60, 50 );

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_ALL_PARAMS,
    ],
    customMessageHandler,
  );
*/
}

import { calculateElapsedTime } from "@/lib/date_utils";
import { padNumber } from "@/lib/math_utils";

export function calculateSessionTime(connectionCtx: ConnectionContextType) {
  let data = calculateElapsedTime(
    connectionCtx.imagingSession.startTime,
    Date.now()
  );
  if (data) {
    return `${padNumber(data.hours)}:${padNumber(data.minutes)}:${padNumber(
      data.seconds
    )}`;
  }
}
