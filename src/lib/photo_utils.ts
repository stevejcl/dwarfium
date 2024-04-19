import { ConnectionContextType } from "@/types";

import {
  Dwarfii_Api,
  messageCameraWidePhotograph,
  messageCameraTelePhotograph,
  messageCameraTeleStartRecord,
  messageCameraTeleStopRecord,
  messageCameraTeleSetFeatureParams,
  messagePanoramaStartGrid,
  messagePanoramaStop,
  messageCameraTeleStartBurst,
  messageCameraWideStartBurst,
  messageCameraTeleStopBurst,
  messageCameraWideStopBurst,
  messageCameraTeleStartTimeLapsePhoto,
  messageCameraWideStartTimeLapsePhoto,
  messageCameraTeleStopTimeLapsePhoto,
  messageCameraWideStopTimeLapsePhoto,
  messageCameraTeleGetAllFeatureParams,
  WebSocketHandler,
} from "dwarfii_api";

import { logger } from "@/lib/logger";

function callback(message) {
  console.log(message);
}

function get_error(result_data, setErrorTxt: Function) {
  if (result_data.data.errorPlainTxt)
    setErrorTxt(
      (prevError) => prevError + " " + result_data.data.errorPlainTxt
    );
  else if (result_data.data.errorTxt)
    setErrorTxt((prevError) => prevError + " " + result_data.data.errorTxt);
  else if (result_data.data.code)
    setErrorTxt(
      (prevError) => prevError + " " + "Error: " + result_data.data.code
    );
  else setErrorTxt((prevError) => prevError + " " + "Error");
}

export async function startPhoto(
  camera: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_PHOTOGRAPH) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Take Photograph Tele Success");
        if (callback) {
          callback("Take Photograph Success");
        }
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 2 && result_data.data.state == 1) {
        setErrorTxt("Start Take Tele Photograph");
        if (callback) {
          callback("Start Take Tele Photograph");
        }
      } else if (
        result_data.data.functionId == 2 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stop Taking Tele Photograph");
        if (callback) {
          callback("Stop Taking Tele Photograph");
        }
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_PHOTOGRAPH
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Take Photograph Wide Success");
        if (callback) {
          callback("Take Photograph Wide Success");
        }
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 2 && result_data.data.state == 1) {
        setErrorTxt("Start Take Wide Photograph");
        if (callback) {
          callback("Start Take Wide Photograph");
        }
      } else if (
        result_data.data.functionId == 2 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stop Taking Wide Photograph");
        if (callback) {
          callback("Stop Taking Wide Photograph");
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

  // Send Command : messageCameraTelePhotograph
  let WS_Packet;
  let txtInfoCommand = "";
  if (camera === 0) {
    WS_Packet = messageCameraTelePhotograph();
    txtInfoCommand = "TELE_Photograph";
  } else {
    WS_Packet = messageCameraWidePhotograph();
    txtInfoCommand = "WIDE_Photograph";
  }

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_PHOTOGRAPH,
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_PHOTOGRAPH,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_FUNCTION_STATE,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_NEW_MEDIA_CREATED,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function startVideo(
  camera: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_START_RECORD) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Start Video Success");
        if (callback) {
          callback("Start Video Success");
        }
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_RECORD_TIME
    ) {
      const errorText = `Record Time: ${result_data.data.recordTime}`;
      setErrorTxt(errorText);
      if (callback) {
        callback("Time Photograph");
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 4 && result_data.data.state == 1) {
        setErrorTxt("Starting Video");
        if (callback) {
          callback("Starting Video");
        }
      } else if (
        result_data.data.functionId == 4 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stopping Video");
        if (callback) {
          callback("Stopping Video");
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

  // Send Command : messageCameraTeleStartRecord
  let WS_Packet;
  let txtInfoCommand = "";
  if (camera === 0) {
    WS_Packet = messageCameraTeleStartRecord();
    txtInfoCommand = "TELE_start_Video";
  } else {
    setErrorTxt("Function not available for Wide angle");
    return;
  }

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_START_RECORD,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_RECORD_TIME,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function stopVideo(
  camera: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_STOP_RECORD) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Stop Recording Video Success");
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_RECORD_TIME
    ) {
      const errorText = `Record Time: ${result_data.data.recordTime}`;
      setErrorTxt(errorText);
      if (callback) {
        callback("Stop Recording Video Success");
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 4 && result_data.data.state == 1) {
        setErrorTxt("Starting Video");
        if (callback) {
          callback("Starting Video");
        }
      } else if (
        result_data.data.functionId == 4 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stopping Video");
        if (callback) {
          callback("Stopping Video");
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

  // Send Command : messageCameraTeleStopRecord
  let WS_Packet;
  let txtInfoCommand = "";
  if (camera === 0) {
    WS_Packet = messageCameraTeleStopRecord();
    txtInfoCommand = "TELE_stop_Video";
  } else {
    setErrorTxt("Function not available for Wide angle");
    return;
  }

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_STOP_RECORD,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_RECORD_TIME,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_NEW_MEDIA_CREATED,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function startPano(
  camera: number,
  rows: number,
  cols: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function,
  setActiveAction: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }
  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_PANORAMA_START_GRID) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Panorama Success");
        if (callback) {
          callback("Panorama Success");
        }
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_PANORAMA_PROGRESS
    ) {
      const errorText = `Progress: ${result_data.data.completedCount} out of ${result_data.data.totalCount}`;
      console.log(errorText);
      setErrorTxt(errorText);
      if (callback) {
        callback(errorText);
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 6 && result_data.data.state == 1) {
        setErrorTxt("Starting Panorama");
        if (callback) {
          callback("Starting Panorama");
        }
      } else if (
        result_data.data.functionId == 6 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stopping Panorama");
        // End of Action
        setActiveAction(undefined);
        if (callback) {
          callback("Stopping Panorama");
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

  // Send Command : messageCameraTeleSetFeatureParams, messagePanoramaStartGrid
  let WS_Packet = messagePanoramaStartGrid(rows, cols);
  let txtInfoCommand = "TELE_start_Panorama";
  let WS_Packet1, WS_Packet2;
  let hasAuto = false;
  let autoMode = 1; // Manual
  let id = 6; // "Panorama row"
  let modeIndex = 1;
  let index = 0;
  let continueValue = rows;

  if (camera === 0) {
    id = 6; // "Panorama row"
    continueValue = rows;
    WS_Packet1 = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
    id = 7; // "Panorama col"
    continueValue = cols;
    WS_Packet2 = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
  } else {
    setErrorTxt("Function not available for Wide angle");
    return;
  }

  webSocketHandler.prepare(
    [WS_Packet1, WS_Packet2, WS_Packet],
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_FEATURE_PARAM,
      Dwarfii_Api.DwarfCMD.CMD_PANORAMA_START_GRID,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_PANORAMA_PROGRESS,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function stopPano(
  camera: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_PANORAMA_STOP) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Stop Panorama Success");
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_PANORAMA_PROGRESS
    ) {
      const errorText = `Pano Progress: ${result_data.data.completedCount} out of ${result_data.data.totalCount}`;
      console.log(errorText);
      setErrorTxt(errorText);
      if (callback) {
        callback("Stop Recording Video Success");
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 6 && result_data.data.state == 1) {
        setErrorTxt("Starting Panorama");
        if (callback) {
          callback("Starting Panorama");
        }
      } else if (
        result_data.data.functionId == 6 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stopping Panorama");
        if (callback) {
          callback("Stopping Panorama");
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

  // Send Command : messagePanoramaStop
  let WS_Packet;
  let txtInfoCommand = "";
  if (camera === 0) {
    WS_Packet = messagePanoramaStop();
    txtInfoCommand = "TELE_stop_Panorama";
  } else {
    setErrorTxt("Function not available for Wide angle");
    return;
  }

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_PANORAMA_STOP,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_PANORAMA_PROGRESS,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function startBurst(
  camera: number,
  count: number,
  interval: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function,
  setActiveAction: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }
  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_BURST) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Start Tele Burst Success");
        if (callback) {
          callback("Start Tele Burst Success");
        }
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_BURST_PROGRESS
    ) {
      const errorText = `Burst Tele Progress: ${result_data.data.completedCount} out of ${result_data.data.totalCount}`;
      console.log(errorText);
      setErrorTxt(errorText);
      if (callback) {
        callback(errorText);
      }
    } else if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_BURST) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Start Wide Burst Success");
        if (callback) {
          callback("Start Wide Burst Success");
        }
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_BURST_PROGRESS
    ) {
      const errorText = `Burst Wide Progress: ${result_data.data.completedCount} out of ${result_data.data.totalCount}`;
      setErrorTxt(errorText);
      if (callback) {
        callback(errorText);
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 3 && result_data.data.state == 1) {
        setErrorTxt("Starting Burst");
        if (callback) {
          callback("Starting Burst");
        }
      } else if (
        result_data.data.functionId == 3 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stopping Burst ");
        // End of Action
        setActiveAction(undefined);
        if (callback) {
          callback("Stopping Burst");
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

  // Send Command : messageCameraTeleSetFeatureParams, messageCameraTeleStartBurst, messageCameraWideStartBurst
  let WS_Packet, WS_Packet1, WS_Packet2, WS_Packet3;
  let txtInfoCommand;
  let hasAuto = false;
  let autoMode = 1; // Manual
  let id = 3; // "Burst count"
  let modeIndex = 0;
  let index = count;
  let continueValue = 0;

  if (camera === 0) {
    WS_Packet = messageCameraTeleStartBurst();
    id = 3; // "Burst count"
    txtInfoCommand = "TELE start Burst";
    modeIndex = 0;
    index = count;
    continueValue = 0;
    WS_Packet1 = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
    id = 9; // "Burst interval"
    autoMode = 1;
    modeIndex = 0;
    index = interval;
    continueValue = 0;
    WS_Packet2 = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
    WS_Packet3 = messageCameraTeleGetAllFeatureParams();
  } else {
    WS_Packet = messageCameraWideStartBurst();
    id = 3; // "Burst count"
    txtInfoCommand = "WIDE start Burst";
    continueValue = count;
    WS_Packet = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
  }

  webSocketHandler.prepare(
    [WS_Packet1, WS_Packet2, WS_Packet3, WS_Packet],
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_FEATURE_PARAM,
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_BURST,
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_BURST,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_BURST_PROGRESS,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_BURST_PROGRESS,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function stopBurst(
  camera: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_TELE_STOP_BURST) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Stop Wide Burst Success");
      } else get_error(result_data, setErrorTxt);
    } else if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_WIDE_STOP_BURST) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Stop Wide Burst Success");
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_BURST_PROGRESS
    ) {
      const errorText = `Burst Progress: ${result_data.data.completedCount} out of ${result_data.data.totalCount}`;
      console.log(errorText);
      setErrorTxt(errorText);
      if (callback) {
        callback("errorText");
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_BURST_PROGRESS
    ) {
      const errorText = `Burst Progress: ${result_data.data.completedCount} out of ${result_data.data.totalCount}`;
      console.log(errorText);
      setErrorTxt(errorText);
      if (callback) {
        callback("errorText");
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 3 && result_data.data.state == 1) {
        setErrorTxt("Starting Burst");
        if (callback) {
          callback("Starting Burst");
        }
      } else if (
        result_data.data.functionId == 3 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stopping Burst");
        if (callback) {
          callback("Stopping Burst");
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

  // Send Command : messageCameraTeleStopBurst, messageCameraWideStopBurst
  let WS_Packet;
  let txtInfoCommand = "";
  if (camera === 0) {
    WS_Packet = messageCameraTeleStopBurst();
    txtInfoCommand = "TELE stop Burst";
  } else {
    WS_Packet = messageCameraWideStopBurst();
    txtInfoCommand = "WIDE stop Burst";
  }

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_STOP_BURST,
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_STOP_BURST,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_BURST_PROGRESS,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_BURST_PROGRESS,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function startTimeLapse(
  camera: number,
  interval_index: number,
  totalTime_index: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function,
  setActiveAction: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }
  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (
      result_data.cmd ==
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_START_TIMELAPSE_PHOTO
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Start Tele TimeLapse Success");
        if (callback) {
          callback("Start Tele TimeLapse Success");
        }
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_TIMELAPSE_OUT_TIME
    ) {
      const errorText = `TimeLapse Tele Progress: ${result_data.data.totalTime}s for an interval of ${result_data.data.interval}s film duration of ${result_data.data.outTime}s`;
      console.log(errorText);
      setErrorTxt(errorText);
      if (callback) {
        callback(errorText);
      }
    } else if (
      result_data.cmd ==
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_START_TIMELAPSE_PHOTO
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Start Wide TimeLapse Success");
        if (callback) {
          callback("Start Wide TimeLapse Success");
        }
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_TIMELAPSE_OUT_TIME
    ) {
      const errorText = `TimeLapse Tele Progress: ${result_data.data.totalTime} for interval of ${result_data.data.outTime} of ${result_data.data.outTime}`;
      console.log(errorText);
      setErrorTxt(errorText);
      if (callback) {
        callback(errorText);
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 5 && result_data.data.state == 1) {
        setErrorTxt("Starting TimeLapse");
        if (callback) {
          callback("Starting TimeLapse");
        }
      } else if (
        result_data.data.functionId == 5 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stopping TimeLapse ");
        // End of Action
        setActiveAction(undefined);
        if (callback) {
          callback("Stopping TimeLapse");
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

  // Send Command : messageCameraTeleSetFeatureParams, messageCameraTeleStartTimeLapsePhoto, messageCameraWideStartTimeLapsePhoto
  let WS_Packet, WS_Packet1, WS_Packet2;
  let txtInfoCommand;
  let hasAuto = false;
  let autoMode = 1; // Manual
  let id = 4; // "TimeLapse Interval"
  let modeIndex = 0;
  let index = interval_index;
  let continueValue = 0;

  if (camera === 0) {
    WS_Packet = messageCameraTeleStartTimeLapsePhoto();
    id = 4; // "interval_index count"
    txtInfoCommand = "TELE start TimeLapse";
    index = interval_index;
    WS_Packet1 = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
    id = 5; // "TimeLapse totalTime"
    index = interval_index;
    WS_Packet2 = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
  } else {
    WS_Packet = messageCameraWideStartTimeLapsePhoto();
    id = 4; // "interval_index count"
    txtInfoCommand = "WIDE start TimeLapse";
    index = interval_index;
    WS_Packet1 = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
    id = 5; // "TimeLapse totalTime"
    index = interval_index;
    WS_Packet2 = messageCameraTeleSetFeatureParams(
      hasAuto,
      autoMode,
      id,
      modeIndex,
      index,
      continueValue
    );
  }

  webSocketHandler.prepare(
    [WS_Packet1, WS_Packet2, WS_Packet],
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_SET_FEATURE_PARAM,
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_START_TIMELAPSE_PHOTO,
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_START_TIMELAPSE_PHOTO,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_TIMELAPSE_OUT_TIME,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}

export async function stopTimeLapse(
  camera: number,
  connectionCtx: ConnectionContextType,
  setErrorTxt: Function
) {
  if (connectionCtx.IPDwarf === undefined) {
    return;
  }

  setErrorTxt("");

  const customMessageHandler = (txt_info, result_data) => {
    if (
      result_data.cmd ==
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_STOP_TIMELAPSE_PHOTO
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Stop Wide TimeLapse Success");
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd ==
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_STOP_TIMELAPSE_PHOTO
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        setErrorTxt("Stop Wide TimeLapse Success");
      } else get_error(result_data, setErrorTxt);
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_TIMELAPSE_OUT_TIME
    ) {
      const errorText = `TimeLapse Tele Progress: ${result_data.data.totalTime} for interval of ${result_data.data.outTime} of ${result_data.data.outTime}`;
      console.log(errorText);
      setErrorTxt(errorText);
      if (callback) {
        callback(errorText);
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE
    ) {
      if (result_data.data.functionId == 5 && result_data.data.state == 1) {
        setErrorTxt("Starting TimeLapse");
        if (callback) {
          callback("Starting TimeLapse");
        }
      } else if (
        result_data.data.functionId == 5 &&
        result_data.data.state == 0
      ) {
        setErrorTxt("Stopping TimeLapse");
        if (callback) {
          callback("Stopping TimeLapse");
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

  // Send Command : messageCameraTeleStopTimeLapsePhoto, messageCameraWideStopTimeLapsePhoto
  let WS_Packet;
  let txtInfoCommand = "";
  if (camera === 0) {
    WS_Packet = messageCameraTeleStopTimeLapsePhoto();
    txtInfoCommand = "TELE stop TimeLapse";
  } else {
    WS_Packet = messageCameraWideStopTimeLapsePhoto();
    txtInfoCommand = "WIDE stop TimeLapse";
  }

  webSocketHandler.prepare(
    WS_Packet,
    txtInfoCommand,
    [
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_STOP_TIMELAPSE_PHOTO,
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_STOP_TIMELAPSE_PHOTO,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_TELE_FUNCTION_STATE,
      Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WIDE_TIMELAPSE_OUT_TIME,
    ],
    customMessageHandler
  );
  if (!webSocketHandler.run()) {
    console.error(" Can't launch Web Socket Run Action!");
  }
}
