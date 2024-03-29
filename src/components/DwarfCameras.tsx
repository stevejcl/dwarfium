/*  eslint-disable @next/next/no-img-element */

import { useState, useContext, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Link from "next/link";

import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  Dwarfii_Api,
  DwarfIP,
  wideangleURL,
  telephotoURL,
  rawPreviewURL,
  messageCameraTeleGetSystemWorkingState,
  messageCameraTeleGetAllParams,
  messageCameraWideGetAllParams,
  WebSocketHandler,
} from "dwarfii_api";

import styles from "@/components/DwarfCameras.module.css";
import { ConnectionContextType } from "@/types";
import { logger } from "@/lib/logger";
import {
  telephotoCamera,
  wideangleCamera,
  turnOnTeleCameraFn,
  turnOnWideCameraFn,
} from "@/lib/dwarf_utils";

type PropType = {
  showWideangle: boolean;
  useRawPreviewURL: boolean;
};

export default function DwarfCameras(props: PropType) {
  const { showWideangle, useRawPreviewURL } = props;
  let connectionCtx = useContext(ConnectionContext);

  useEffect(() => {
    checkCameraStatus(telephotoCamera, connectionCtx);
    checkCameraStatus(wideangleCamera, connectionCtx);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [telephotoCameraStatus, setTelephotoCameraStatus] = useState<
    string | undefined
  >("off");
  const [wideangleCameraStatus, setWideangleCameraStatus] = useState<
    string | undefined
  >("off");

  let IPDwarf = connectionCtx.IPDwarf || DwarfIP;

  function turnOnCameraHandler(cameraId: number, connectionCtx) {
    if (cameraId === telephotoCamera) {
      turnOnTeleCameraFn(connectionCtx, setTelephotoCameraStatus);
    } else {
      turnOnWideCameraFn(connectionCtx, setWideangleCameraStatus);
    }
  }

  function checkCameraStatus(
    camera: number,
    connectionCtx: ConnectionContextType
  ) {
    if (camera == telephotoCamera) {
      setTelephotoCameraStatus("off");
    } else {
      setWideangleCameraStatus("off");
    }
    setTimeout(() => {
      checkCameraStatusLater(camera, connectionCtx, true);
    }, 2000);
  }

  const customMessageHandlerTele = (txt_info, result_data) => {
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger("telephoto open", {}, connectionCtx);
        setTelephotoCameraStatus("on");
      } else if (
        result_data.data.code ==
        Dwarfii_Api.DwarfErrorCode.CODE_CAMERA_TELE_CLOSED
      ) {
        setTelephotoCameraStatus("off");
      }
    } else if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_SDCARD_INFO) {
      connectionCtx.setAvailableSizeDwarf(result_data.data.availableSize);
      connectionCtx.setTotalSizeDwarf(result_data.data.totalSize);
      connectionCtx.setConnectionStatus(true);
    } else if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_ELE) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        connectionCtx.setBatteryLevelDwarf(result_data.data.value);
      }
    } else if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_CHARGE) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        connectionCtx.setBatteryStatusDwarf(result_data.data.value);
      }
    } else {
      logger("", result_data, connectionCtx);
    }
    logger(txt_info, result_data, connectionCtx);
  };

  const customMessageHandlerWide = (txt_info, result_data) => {
    if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger("wide open", {}, connectionCtx);
        setWideangleCameraStatus("on");
      } else if (
        result_data.data.code ==
        Dwarfii_Api.DwarfErrorCode.CODE_CAMERA_WIDE_CLOSED
      ) {
        setWideangleCameraStatus("off");
      }
    } else {
      logger("", result_data, connectionCtx);
    }
    logger(txt_info, result_data, connectionCtx);
  };

  const customErrorHandler = () => {
    console.error("ConnectDwarf : Socket Close!");
    connectionCtx.setConnectionStatus(false);
  };

  const customStateHandler = (state) => {
    if (state != connectionCtx.connectionStatus) {
      connectionCtx.setConnectionStatus(state);
    }
  };

  function checkCameraStatusLater(
    camera: number,
    connectionCtx: ConnectionContextType,
    type: boolean
  ) {
    if (connectionCtx.IPDwarf === undefined) {
      return;
    }
    if (type) {
      setTelephotoCameraStatus("on");
      setWideangleCameraStatus("on");
    }
    console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    // Send Command : messageCameraTeleOpenCamera
    let WS_Packet;
    let txtInfoCommand = "";
    if (camera == telephotoCamera) {
      let WS_Packet1 = messageCameraTeleGetSystemWorkingState();
      WS_Packet = messageCameraTeleGetAllParams();
      txtInfoCommand = "OpenTeleCamera";
      webSocketHandler.prepare(
        WS_Packet1,
        txtInfoCommand,
        [
          Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS,
          Dwarfii_Api.DwarfCMD.CMD_NOTIFY_SDCARD_INFO,
          Dwarfii_Api.DwarfCMD.CMD_NOTIFY_ELE,
          Dwarfii_Api.DwarfCMD.CMD_NOTIFY_CHARGE,
        ],
        customMessageHandlerTele,
        customStateHandler,
        customErrorHandler
      );
    } else {
      WS_Packet = messageCameraWideGetAllParams();
      txtInfoCommand = "OpenWideCamera";
      webSocketHandler.prepare(
        WS_Packet,
        txtInfoCommand,
        [Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_GET_ALL_PARAMS],
        customMessageHandlerWide,
        customStateHandler,
        customErrorHandler
      );
    }

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
  }

  function renderWideAngle() {
    console.info("showWideangle : ", showWideangle);
    return (
      <div className={`${showWideangle ? "" : "d-none"}`}>
        <img
          onLoad={() => setWideangleCameraStatus("on")}
          src={wideangleURL(IPDwarf)}
          alt="livestream for wideangle camera"
          className={styles.wideangle}
        ></img>
      </div>
    );
  }

  function renderMainCamera() {
    console.info("useRawPreviewURL : ", useRawPreviewURL);
    // TODO: use rawPreviewURL vs   telephotoURL,
    return (
      <div className="camera-container">
        <img
          onLoad={() => setTelephotoCameraStatus("on")}
          src={
            useRawPreviewURL ? rawPreviewURL(IPDwarf) : telephotoURL(IPDwarf)
          }
          alt="livestream for telephoto camera"
          className={styles.telephoto}
        ></img>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      {wideangleCameraStatus === "off" && (
        <div className="py-2 clearfix">
          <div className="float-end">
            <button
              className="btn btn-more02"
              onClick={() =>
                turnOnCameraHandler(wideangleCamera, connectionCtx)
              }
            >
              Turn on wideangle camera
            </button>
            <br />
            <Link href={wideangleURL(IPDwarf)}>{wideangleURL(IPDwarf)}</Link>
          </div>
        </div>
      )}
      {telephotoCameraStatus === "off" && (
        <div className="py-2">
          <div className="float-end">
            <button
              className="btn btn-more02"
              onClick={() =>
                turnOnCameraHandler(telephotoCamera, connectionCtx)
              }
            >
              Turn on telephoto camera
            </button>
            <br />
            <Link href={telephotoURL(IPDwarf)}>{telephotoURL(IPDwarf)}</Link>
          </div>
        </div>
      )}
      <TransformWrapper>
        <TransformComponent>
          {renderWideAngle()}
          {renderMainCamera()}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
