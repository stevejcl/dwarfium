import {
  Dwarfii_Api,
  binning1x1,
  binning2x2,
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
  messageCameraWideGetAllParams,
  messageCameraWideSetExpMode,
  messageCameraWideSetExp,
  messageCameraWideSetGain,
  messageCameraWideSetWBMode,
  messageCameraWideSetWBColorTemp,
  messageCameraWideSetBrightness,
  messageCameraWideSetContrast,
  messageCameraWideSetSaturation,
  messageCameraWideSetHue,
  messageCameraWideSetSharpness,
  messageCameraTeleSetWBMode,
  messageCameraTeleSetWBScene,
  messageCameraTeleSetWBColorTemp,
  messageCameraTeleSetBrightness,
  messageCameraTeleSetContrast,
  messageCameraTeleSetSaturation,
  messageCameraTeleSetHue,
  messageCameraTeleSetSharpness,
  WebSocketHandler,
} from "dwarfii_api";
import { getExposureIndexDefault } from "@/lib/data_utils";
import { getWideExposureIndexDefault } from "@/lib/data_wide_utils";
import { ConnectionContextType } from "@/types";
import { logger } from "@/lib/logger";
import { saveAstroSettingsDb } from "@/db/db_utils";

export const telephotoCamera = 0;
export const wideangleCamera = 1;

async function sleep(ms) {
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
  } else if (type === "AiEnhance") {
    cmd = Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_FEATURE_PARAM;
    let hasAuto = false;
    let autoMode = 1; // Manual
    let id = 14; // "AiEnhance"
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
        let AiEnhance;
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

          // For id=14 : AiEnhance
          const resultObject3 = result_data.data.allFeatureParams.find(
            (item) => item.id === 14
          );
          console.log("allFeatureParams-resultObject3:", resultObject3);
          AiEnhance = 0;
          if (resultObject3 && resultObject3.index) {
            AiEnhance = resultObject3.index;
          }

          connectionCtx.astroSettings.binning = binning;
          saveAstroSettingsDb("binning", binning.toString());
          connectionCtx.astroSettings.fileFormat = fileFormat;
          saveAstroSettingsDb("fileFormat", fileFormat.toString());
          connectionCtx.astroSettings.count = count;
          saveAstroSettingsDb("count", count.toString());
          connectionCtx.astroSettings.AiEnhance = AiEnhance;
          saveAstroSettingsDb("AiEnhance", AiEnhance.toString());
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
            exposure = getExposureIndexDefault(connectionCtx.typeIdDwarf);
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
          let val_IRCut = 0;
          if (resultObject2.index) val_IRCut = resultObject2.index;
          // For id=9 : previewQuality : only dwarf II
          let previewQuality;
          const resultObject4 = result_data.data.allParams.find(
            (item) => item.id === 9
          );
          if (resultObject4 && resultObject4.continueValue) {
            console.log(
              "previewQuality: allParams-resultObject4:",
              resultObject4
            );
            previewQuality = resultObject4.continueValue;
          }
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
          if (previewQuality) {
            connectionCtx.astroSettings.quality = previewQuality;
            saveAstroSettingsDb("quality", previewQuality.toString());
          }
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

function update_data_camera_wide_settings(connectionCtx, result_data) {
  let exp_mode,
    exp_index,
    gain_index,
    wb_mode,
    wb_index,
    brightness,
    contrast,
    hue,
    saturation,
    sharpness;

  exp_index = 0;
  if (result_data.data.allParams) {
    console.log("allParams:", result_data.data.allParams);
    // For id=0 : "exp_index"
    const filteredArray = result_data.data.allParams.filter(
      (commonParam) =>
        !Object.prototype.hasOwnProperty.call(commonParam, "id") ||
        commonParam.id === undefined
    );
    // id = 0 (no present)
    // autoMode == 0 => Auto not present
    if (!filteredArray[0].autoMode) exp_mode = modeAuto;
    else exp_mode = modeManual;
    if (filteredArray[0].index) exp_index = filteredArray[0].index;
    else if (exp_mode == modeAuto)
      exp_index = getWideExposureIndexDefault(connectionCtx.typeIdDwarf);

    // For id=1 : "Gain"
    const resultObject1 = result_data.data.allParams.find(
      (item) => item.id === 1
    );
    console.log("allParams-resultObject1:", resultObject1);
    if (resultObject1.index) gain_index = resultObject1.index;

    // For id=2 : WB
    const resultObject2 = result_data.data.allParams.find(
      (item) => item.id === 2
    );
    console.log("allParams-resultObject2:", resultObject2);
    // autoMode == 0 => Auto not present
    if (!resultObject2.autoMode) wb_mode = modeAuto;
    else wb_mode = modeManual;
    if (resultObject2.index) wb_index = resultObject2.index;

    // For id=3 : Brightness
    const resultObject3 = result_data.data.allParams.find(
      (item) => item.id === 3
    );
    console.log("allParams-resultObject3:", resultObject3);
    if (resultObject3.continueValue) brightness = resultObject3.continueValue;
    else brightness = 0;

    // For id=4 : Contrast
    const resultObject4 = result_data.data.allParams.find(
      (item) => item.id === 4
    );
    console.log("allParams-resultObject4:", resultObject4);
    if (resultObject4.continueValue) contrast = resultObject4.continueValue;
    else contrast = 0;

    // For id=5 : Hue
    const resultObject5 = result_data.data.allParams.find(
      (item) => item.id === 5
    );
    console.log("allParams-resultObject5:", resultObject5);
    if (resultObject5.continueValue) hue = resultObject5.continueValue;
    else hue = 0;

    // For id=6 : Saturation
    const resultObject6 = result_data.data.allParams.find(
      (item) => item.id === 6
    );
    console.log("allParams-resultObject6:", resultObject6);
    if (resultObject6.continueValue) saturation = resultObject6.continueValue;
    else saturation = 0;

    // For id=7 : Sharpness
    const resultObject7 = result_data.data.allParams.find(
      (item) => item.id === 7
    );
    console.log("allParams-resultObject7:", resultObject7);
    if (resultObject7.continueValue) sharpness = resultObject7.continueValue;
    else sharpness = 0;
    //error APP; get B Value not A value (UI) : B = A * 6.0 / 100 + 1
    sharpness = Math.round(((sharpness - 1) * 100) / 6.0);

    // Save Settings
    connectionCtx.cameraWideSettings.exp_index = exp_index;
    connectionCtx.cameraWideSettings.exp_mode = exp_mode;
    connectionCtx.cameraWideSettings.gain_index = gain_index;
    connectionCtx.cameraWideSettings.wb_mode = wb_mode;
    connectionCtx.cameraWideSettings.wb_index = wb_index;
    connectionCtx.cameraWideSettings.brightness = brightness;
    connectionCtx.cameraWideSettings.contrast = contrast;
    connectionCtx.cameraWideSettings.hue = hue;
    connectionCtx.cameraWideSettings.saturation = saturation;
    connectionCtx.cameraWideSettings.sharpness = sharpness;
  }
}

function update_data_camera_tele_settings(connectionCtx, result_data) {
  let wb_mode,
    wb_index_mode,
    wb_index,
    brightness,
    contrast,
    hue,
    saturation,
    sharpness;

  if (result_data.data.allParams) {
    console.log("allParams:", result_data.data.allParams);

    // For id=2 : WB
    const resultObject2 = result_data.data.allParams.find(
      (item) => item.id === 2
    );
    console.log("allParams-resultObject2:", resultObject2);
    // autoMode == 0 => Auto not present
    if (!resultObject2.autoMode) {
      wb_mode = modeAuto;
      wb_index_mode = modeAuto;
    } else wb_mode = modeManual;
    if (resultObject2.index) {
      wb_index_mode = modeAuto;
      wb_index = resultObject2.index;
    }

    // For id=3 : Brightness
    const resultObject3 = result_data.data.allParams.find(
      (item) => item.id === 3
    );
    console.log("allParams-resultObject3:", resultObject3);
    if (resultObject3.continueValue) brightness = resultObject3.continueValue;
    else brightness = 0;

    // For id=4 : Contrast
    const resultObject4 = result_data.data.allParams.find(
      (item) => item.id === 4
    );
    console.log("allParams-resultObject4:", resultObject4);
    if (resultObject4.continueValue) contrast = resultObject4.continueValue;
    else contrast = 0;

    // For id=5 : Hue
    const resultObject5 = result_data.data.allParams.find(
      (item) => item.id === 5
    );
    console.log("allParams-resultObject5:", resultObject5);
    if (resultObject5.continueValue) hue = resultObject5.continueValue;
    else hue = 0;

    // For id=6 : Saturation
    const resultObject6 = result_data.data.allParams.find(
      (item) => item.id === 6
    );
    console.log("allParams-resultObject6:", resultObject6);
    if (resultObject6.continueValue) saturation = resultObject6.continueValue;
    else saturation = 0;

    // For id=7 : Sharpness
    const resultObject7 = result_data.data.allParams.find(
      (item) => item.id === 7
    );
    console.log("allParams-resultObject7:", resultObject7);
    if (resultObject7.continueValue) sharpness = resultObject7.continueValue;
    else sharpness = 0;

    // Save Settings
    connectionCtx.cameraTeleSettings.wb_mode = wb_mode;
    connectionCtx.cameraTeleSettings.wb_index_mode = wb_index_mode;
    connectionCtx.cameraTeleSettings.wb_index = wb_index;
    connectionCtx.cameraTeleSettings.brightness = brightness;
    connectionCtx.cameraTeleSettings.contrast = contrast;
    connectionCtx.cameraTeleSettings.hue = hue;
    connectionCtx.cameraTeleSettings.saturation = saturation;
    connectionCtx.cameraTeleSettings.sharpness = sharpness;
  }
}

export async function getWideAllParamsFn(connectionCtx: ConnectionContextType) {
  const customMessageHandler = (txt_info, result_data) => {
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        update_data_camera_wide_settings(connectionCtx, result_data);
        logger(txt_info, result_data, connectionCtx);
        return;
      } else {
        logger(txt_info, result_data, connectionCtx);
        return;
      }
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Commands
  let WS_Packet = messageCameraWideGetAllParams();
  let txtInfoCommand = "getWideAllParamsFn";

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_GET_ALL_PARAMS],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  await sleep(100);
}

export async function setWideAllParamsFn(
  connectionCtx: ConnectionContextType,
  exp_mode,
  exp_index,
  gain_index,
  wb_mode,
  wb_index,
  brightness,
  contrast,
  hue,
  saturation,
  sharpness
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  const customMessageHandler = (txt_info, result_data) => {
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        update_data_camera_wide_settings(connectionCtx, result_data);
        logger(txt_info, result_data, connectionCtx);
        return;
      } else {
        logger(txt_info, result_data, connectionCtx);
        return;
      }
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Commands
  let WS_Packet1 = messageCameraWideSetExpMode(exp_mode);
  let WS_Packet2 = new Uint8Array([]);
  if (exp_mode == modeManual) WS_Packet2 = messageCameraWideSetExp(exp_index);
  let WS_Packet3 = messageCameraWideSetGain(gain_index);
  let WS_Packet4 = messageCameraWideSetWBMode(wb_mode);
  let WS_Packet5 = new Uint8Array([]);
  if (wb_mode == modeManual)
    WS_Packet5 = messageCameraWideSetWBColorTemp(wb_index);
  let WS_Packet6 = messageCameraWideSetBrightness(brightness);
  let WS_Packet7 = messageCameraWideSetContrast(contrast);
  let WS_Packet8 = messageCameraWideSetSaturation(saturation);
  let WS_Packet9 = messageCameraWideSetHue(hue);
  let WS_Packet10 = messageCameraWideSetSharpness(sharpness);

  let txtInfoCommand = "setWideAllParamsFn";

  webSocketHandler.prepare(
    [
      WS_Packet1,
      WS_Packet2,
      WS_Packet3,
      WS_Packet4,
      WS_Packet5,
      WS_Packet6,
      WS_Packet7,
      WS_Packet8,
      WS_Packet9,
      WS_Packet10,
    ],
    txtInfoCommand,
    [Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_GET_ALL_PARAMS],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  await sleep(100);
}

export async function getTeleAllParamsFn(connectionCtx: ConnectionContextType) {
  const customMessageHandler = (txt_info, result_data) => {
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        update_data_camera_tele_settings(connectionCtx, result_data);
        logger(txt_info, result_data, connectionCtx);
        return;
      } else {
        logger(txt_info, result_data, connectionCtx);
        return;
      }
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Commands
  let WS_Packet = messageCameraTeleGetAllParams();
  let txtInfoCommand = "getTeleWideAllParamsFn";

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS],
    customMessageHandler
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  await sleep(100);
}

export async function setTeleAllParamsFn(
  connectionCtx: ConnectionContextType,
  wb_mode,
  wb_index_mode,
  wb_index,
  brightness,
  contrast,
  hue,
  saturation,
  sharpness
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  const customMessageHandlerTele = (txt_info, result_data) => {
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        update_data_camera_tele_settings(connectionCtx, result_data);
        logger(txt_info, result_data, connectionCtx);
        return;
      } else {
        logger(txt_info, result_data, connectionCtx);
        return;
      }
    }
    logger(txt_info, result_data, connectionCtx);
  };

  console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
  const webSocketHandler = connectionCtx.socketIPDwarf
    ? connectionCtx.socketIPDwarf
    : new WebSocketHandler(connectionCtx.IPDwarf);

  // Send Commands
  let WS_Packet1 = messageCameraTeleSetWBMode(wb_mode);
  let WS_Packet2 = new Uint8Array([]);
  if (wb_mode == modeManual && wb_index_mode == modeAuto)
    WS_Packet2 = messageCameraTeleSetWBColorTemp(wb_index);
  if (wb_mode == modeManual && wb_index_mode == modeManual)
    WS_Packet2 = messageCameraTeleSetWBScene(wb_index);
  let WS_Packet3 = messageCameraTeleSetBrightness(brightness);
  let WS_Packet4 = messageCameraTeleSetContrast(contrast);
  let WS_Packet5 = messageCameraTeleSetSaturation(saturation);
  let WS_Packet6 = messageCameraTeleSetHue(hue);
  let WS_Packet7 = messageCameraTeleSetSharpness(sharpness);

  let txtInfoCommand = "setTeleAllParamsFn";

  webSocketHandler.prepare(
    [
      WS_Packet1,
      WS_Packet2,
      WS_Packet3,
      WS_Packet4,
      WS_Packet5,
      WS_Packet6,
      WS_Packet7,
    ],
    txtInfoCommand,
    [Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS],
    customMessageHandlerTele
  );

  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }

  await sleep(100);
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
