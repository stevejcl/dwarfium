/*  eslint-disable @next/next/no-img-element */

import { useState, useContext, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import Link from "next/link";
import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  Dwarfii_Api,
  DwarfIP,
  wideangleURL,
  telephotoURL,
  messageCameraTeleGetSystemWorkingState,
  messageCameraTeleOpenCamera,
  messageCameraWideOpenCamera,
  WebSocketHandler,
} from "dwarfii_api";

import Image from "next/image";

import imgTeleCameraSrc from "/public/images/dwarflab_camera.png"
import imgWideCameraSrc from "/public/images/dwarfII.png"

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
  setExchangeCamerasStatus: Dispatch<SetStateAction<boolean>>;
  showWideangle: boolean;
  useRawPreviewURL: boolean;
  showControls: boolean;
};

export default function DwarfCameras(props: PropType) {
  const {
    setExchangeCamerasStatus,
    showWideangle,
    useRawPreviewURL,
    showControls,
  } = props;
  let connectionCtx = useContext(ConnectionContext);

  //  const wideangleURL_D3 = "http://localhost:8083/static/wide_angle_stream.html";
  //  const telePhotoURL_D3 = "http://localhost:8083/static/tele_stream.html";
  const wideangleURL_D3 = "http://127.0.0.1:8888/dwarf_wide";
  const telePhotoURL_D3 = "http://127.0.0.1:8888/dwarf_tele/";

  const [errorTxt, setErrorTxt] = useState("");
  const [telephotoCameraStatus, setTelephotoCameraStatus] = useState<
    string | undefined
  >("off");
  const [wideangleCameraStatus, setWideangleCameraStatus] = useState<
    string | undefined
  >("off");
  const [wideCameraSrc, setWideCameraSrc] = useState< string>("");
  const [teleCameraSrc, setTeleCameraSrc] = useState< string>("");
  let lastRenderTime = useRef(Date.now());

  let IPDwarf = connectionCtx.IPDwarf || DwarfIP;
  const defaultTeleCameraSrc : string = imgTeleCameraSrc.src;
  const defaultWideCameraSrc : string = imgWideCameraSrc.src;

  const [teleCameraClass, setTeleCameraClass] = useState(styles.telephoto);
  const [wideCameraClass, setWideCameraClass] = useState(styles.wideangle);

  const iframeRefTele = useRef<HTMLIFrameElement | null>(null);
  const iframeRefWide = useRef<HTMLIFrameElement | null>(null);
  const iImgRefWide = useRef<HTMLImageElement | null>(null);
  const imgTeleRef = useRef<HTMLImageElement | null>(null);
  const imgWideRef = useRef<HTMLImageElement | null>(null);

  // Function to adjust iframe size to match the image
  const adjustIframeSize = () => {
    if (
      imgTeleRef.current &&
      imgTeleRef.current.clientWidth != 0 &&
      iframeRefTele.current
    ) {
      const imgWidth = imgTeleRef.current.clientWidth;
      const imgHeight = imgTeleRef.current.clientHeight;
      console.error(`imgWidth ${imgWidth}px`);
      iframeRefTele.current.style.width = `${imgWidth}px`;
      iframeRefTele.current.style.height = `${imgHeight}px`;
      console.error(` set imgWidth ${imgWidth}px set imgHeight ${imgHeight}px`);
    }
    console.error("End Of adjustIframeSize");
  };

  useEffect(() => {
    console.debug("Start Of Effect DwarfCameras");
    checkCameraStatus(connectionCtx);
    return () => {
      setExchangeCamerasStatus(false);
      setWideangleCameraStatus("off");
      setTelephotoCameraStatus("off");
      setWideCameraSrc(defaultWideCameraSrc);
      setTeleCameraSrc(defaultTeleCameraSrc);
      console.debug("End Of Effect DwarfCameras");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getWideAngleURL() {
    if (!connectionCtx.typeIdDwarf || connectionCtx.typeIdDwarf == 1)
      return wideangleURL(IPDwarf);
    else return wideangleURL_D3;
  }

  function getTelePhotoURL() {
    if (!connectionCtx.typeIdDwarf || connectionCtx.typeIdDwarf == 1)
      return telephotoURL(IPDwarf);
    else return telePhotoURL_D3;
  }

  function turnOnCameraHandler(cameraId: number, connectionCtx) {
    if (cameraId === telephotoCamera) {
      turnOnTeleCameraFn(
        connectionCtx,
        setTelephotoCameraStatus,
        setSrcTeleCamera
      );
    } else {
      turnOnWideCameraFn(
        connectionCtx,
        setWideangleCameraStatus,
        setSrcWideCamera
      );
    }
  }

  function checkCameraStatus(connectionCtx: ConnectionContextType) {
    if (wideCameraSrc && wideCameraSrc !== defaultWideCameraSrc)
      setWideangleCameraStatus("on");
    else setWideangleCameraStatus("off");
    if (teleCameraSrc && teleCameraSrc !== defaultTeleCameraSrc)
      setTelephotoCameraStatus("on");
    else setTelephotoCameraStatus("off");
    setTimeout(() => {
      checkCameraStatusLater(connectionCtx);
    }, 2000);
  }

  const customMessageHandlerTeleWide = (txt_info, result_data) => {
    if (
      result_data.cmd ==
      Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_SYSTEM_WORKING_STATE
    ) {
      if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
        setTelephotoCameraStatus("off");
        setTelephotoCameraStatus("off");
        if (result_data.data.errorPlainTxt)
          setErrorTxt(errorTxt + " " + result_data.data.errorPlainTxt);
        else if (result_data.data.errorTxt)
          setErrorTxt(
            (prevError) => prevError + " " + result_data.data.errorTxt
          );
        else setErrorTxt(errorTxt + " " + "Error: " + result_data.data.code);
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_OPEN_CAMERA
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger(txt_info, result_data, connectionCtx);
        setTelephotoCameraStatus("on");
        setSrcTeleCamera(true);
        return;
      } else {
        logger(txt_info, result_data, connectionCtx);
        setTelephotoCameraStatus("off");
        setSrcTeleCamera(false);
        return;
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_OPEN_CAMERA
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger(txt_info, result_data, connectionCtx);
        setWideangleCameraStatus("on");
        setSrcWideCamera(true);
        return;
      } else {
        logger(txt_info, result_data, connectionCtx);
        setWideangleCameraStatus("off");
        setSrcWideCamera(false);
        return;
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger("telephoto open", {}, connectionCtx);
        setTelephotoCameraStatus("on");
      } else if (
        result_data.data.code ==
        Dwarfii_Api.DwarfErrorCode.CODE_CAMERA_TELE_CLOSED
      ) {
        console.error(txt_info + " CAMERA TELE CLOSED!");
        setTelephotoCameraStatus("off");
      }
    } else if (
      result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_GET_ALL_PARAMS
    ) {
      if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
        logger("wide open", {}, connectionCtx);
        setWideangleCameraStatus("on");
      } else if (
        result_data.data.code ==
        Dwarfii_Api.DwarfErrorCode.CODE_CAMERA_WIDE_CLOSED
      ) {
        console.error(txt_info + " CAMERA WIDE CLOSED!");
        setWideangleCameraStatus("off");
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

  function checkCameraStatusLater(connectionCtx: ConnectionContextType) {
    if (connectionCtx.IPDwarf === undefined) {
      return;
    }
    adjustIframeSize();
    // Slave Mode turn on Camera
    if (connectionCtx.connectionStatusSlave) {
      setWideangleCameraStatus("on");
      setSrcWideCamera(true);
      setTelephotoCameraStatus("on");
      setSrcTeleCamera(true);
      return;
    }

    console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    // Send Command : messageCameraTeleOpenCamera
    let txtInfoCommand = "";
    let WS_Packet1 = messageCameraTeleGetSystemWorkingState();
    let WS_Packet2 = messageCameraTeleOpenCamera();
    let WS_Packet3 = messageCameraWideOpenCamera();
    txtInfoCommand = "CheckCamera";
    webSocketHandler.prepare(
      [WS_Packet1, WS_Packet2, WS_Packet3],
      txtInfoCommand,
      [
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_SYSTEM_WORKING_STATE,
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_OPEN_CAMERA,
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_OPEN_CAMERA,
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_SDCARD_INFO,
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_ELE,
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_CHARGE,
      ],
      customMessageHandlerTeleWide
    );

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
  }

  // Function to set the source for the wide-angle camera
  function setSrcWideCamera(status: boolean) {
    console.info("Render setSrcWideCamera : ", status);
    if (status) {
      const url: string = getWideAngleURL();
      setWideCameraSrc(url);
    } else {
      const url: string = defaultWideCameraSrc;
      setWideCameraSrc(url);
    }
  }

  // Function to set the source for the tele camera
  function setSrcTeleCamera(status: boolean) {
    console.info("Render setSrcTeleCamera : ", status);
    if (status) {
      const url: string = getTelePhotoURL();
      setTeleCameraSrc(url);
    } else {
      const url: string = defaultTeleCameraSrc;
      setTeleCameraSrc(url);
    }
  }

  function renderWideAngle() {
    console.info("Render showWideangle : ", showWideangle);
    console.info("Render SRC : ", wideCameraSrc);
    return (
      <div className={`${showWideangle ? "" : "d-none"}`}>
        <Image
          className={`${
            wideangleCameraStatus == "off" ? wideCameraClass : "d-none"
          }`}
          id="idImgWideCamera"
          width = "720"
          height = "480"
          src={defaultWideCameraSrc}
          alt={wideCameraSrc ? "livestream for wide camera" : ""}
          ref={imgWideRef} // Reference to the image element
          style={{
            height: "auto", // Maintain the aspect ratio of the image
          }}
        />
        <div
          className={`${
            wideangleCameraStatus == "on" ? wideCameraClass : "d-none"
          }`}
        >
          {!connectionCtx.typeIdDwarf || connectionCtx.typeIdDwarf == 1 ? (
            <img
              id="idWideCamera"
              onLoad={() => {
                wideCameraSrc !== defaultWideCameraSrc
                  ? setWideangleCameraStatus("on")
                  : setWideangleCameraStatus("off");
              }}
              src={wideCameraSrc}
              alt={wideCameraSrc ? "" : ""}
              ref={iImgRefWide} // Reference to the image element
            />
          ) : (
            // Render <iframe> if the condition is false
            <iframe
              id="idWideCamera"
              onLoad={() => {
                wideCameraSrc !== defaultWideCameraSrc
                  ? setWideangleCameraStatus("on")
                  : setWideangleCameraStatus("off");
              }}
              src={wideCameraSrc}
              ref={iframeRefWide} // Reference to the iframe element
              style={{
                width: "100%", // Customize as needed
                height: "100%", // Customize as needed
                border: "none", // No border for iframe
              }}
            ></iframe>
          )}
        </div>
      </div>
    );
  }

  const handleImageLoad = () => {
    // Only hide the image and show the iframe after adjusting the size
    if (teleCameraSrc !== defaultTeleCameraSrc) {
      adjustIframeSize();
      setTelephotoCameraStatus("on");
    } else {
      setTelephotoCameraStatus("off");
    }
  };

  function renderMainCamera() {
    let newRenderTime = Date.now();

    if (
      lastRenderTime.current === undefined ||
      newRenderTime > lastRenderTime.current + 500
    ) {
      lastRenderTime.current = newRenderTime;
      console.debug("Timer Render useRawPreviewURL : ", useRawPreviewURL);
    }
    console.debug("Render useRawPreviewURL : ", useRawPreviewURL);
    console.debug("Render SRC : ", teleCameraSrc);
    // TODO: use rawPreviewURL vs   telephotoURL,
    return (
      <div className="camera-container">
        <Image
          className={`${telephotoCameraStatus == "off" ? "" : "d-none"}`}
          id="idTeleCamera"
          src={teleCameraSrc}
          width = "1280"
          height = "720"
          alt={teleCameraSrc ? "livestream for telephoto camera" : ""}
          ref={imgTeleRef} // Reference to the image element
          onLoad={() => handleImageLoad()}
        />
        <div
          className={`${
            telephotoCameraStatus == "on" ? { teleCameraClass } : "d-none"
          }`}
        >
          <iframe
            id="idTeleCamera"
            onLoad={() =>
              teleCameraSrc !== defaultTeleCameraSrc
                ? setTelephotoCameraStatus("on")
                : setTelephotoCameraStatus("off")
            }
            scrolling="no"
            style={{
              height: "720",
              width: "1280",
            }}
            src={teleCameraSrc}
            className={teleCameraClass}
            ref={iframeRefTele} // Reference to the iframe element
          ></iframe>
        </div>
      </div>
    );
  }

  function exchangeCameras() {
    if (!showWideangle) return;

    // Swap the classes
    const tempClass = teleCameraClass;
    setTeleCameraClass(wideCameraClass);
    setWideCameraClass(tempClass);

    if (!connectionCtx.typeIdDwarf || connectionCtx.typeIdDwarf == 1) {
      if (iImgRefWide.current && iframeRefTele.current) {
        const tempStyleWidth = iImgRefWide.current.clientWidth;
        const tempStyleHeight = iImgRefWide.current.clientHeight;
        const iframeWidth = parseFloat(iframeRefTele.current.style.width) || 0; // Default to 0 if NaN
        iImgRefWide.current.width = iframeWidth;
        const iframeHeight =
          parseFloat(iframeRefTele.current.style.height) || 0; // Default to 0 if NaN
        iImgRefWide.current.height = iframeHeight;
        iframeRefTele.current.style.width = `${tempStyleWidth}px`;
        iframeRefTele.current.style.height = `${tempStyleHeight}px`;
      }
    } else {
      if (iframeRefWide.current && iframeRefTele.current) {
        const tempStyleWidth = iframeRefWide.current.clientWidth;
        const tempStyleHeight = iframeRefWide.current.clientHeight;
        console.error(iframeRefWide.current.clientWidth);
        console.error(iframeRefWide.current.clientHeight);
        iframeRefWide.current.style.width = iframeRefTele.current.style.width;
        iframeRefWide.current.style.height = iframeRefTele.current.style.height;
        iframeRefTele.current.style.width = `${tempStyleWidth}px`;
        iframeRefTele.current.style.height = `${tempStyleHeight}px`;
      }
    }
    setExchangeCamerasStatus((prev) => !prev);

    // Not Recording
    if (
      !connectionCtx.imagingSession.isRecording &&
      !connectionCtx.imagingSession.endRecording &&
      !connectionCtx.imagingSession.isGoLive &&
      connectionCtx.typeIdDwarf != 1
    ) {
      connectionCtx.setCurrentAstroCamera(
        connectionCtx.currentAstroCamera == telephotoCamera
          ? wideangleCamera
          : telephotoCamera
      );
    }
  }

  const Controls = () => {
    const { resetTransform, zoomIn, zoomOut } = useControls();
    return (
      <>
        <button
          className="btn btn-more02 me-3 top-align"
          onClick={() => resetTransform()}
        >
          Reset view
        </button>
        <button
          className="btn btn-more02 me-3 top-align"
          onClick={() => zoomIn()}
        >
          Zoom In
        </button>
        <button
          className="btn btn-more02 me-3 top-align"
          onClick={() => zoomOut()}
        >
          Zoom Out
        </button>
        <button
          className="btn btn-more02 me-3 top-align"
          onClick={() => exchangeCameras()}
        >
          Exchange
        </button>
      </>
    );
  };

  if (showControls)
    return (
      <div>
        {wideangleCameraStatus !== "off" && telephotoCameraStatus !== "off" && (
          <div className="py-2 clearfix">
            <span className="text-danger">{errorTxt}&nbsp;</span>
          </div>
        )}
        {wideangleCameraStatus === "off" && telephotoCameraStatus === "off" && (
          <div className="py-2 clearfix">
            <span className="text-danger">{errorTxt}</span>
            <div className="float-end">
              <Link
                className="minilink me-4"
                target="_blank"
                href={getWideAngleURL()}
              >
                {getWideAngleURL()}
              </Link>
              <Link
                className="minilink"
                target="_blank"
                href={getTelePhotoURL()}
              >
                {getTelePhotoURL()}
              </Link>
            </div>
          </div>
        )}
        {wideangleCameraStatus === "off" && telephotoCameraStatus !== "off" && (
          <div className="py-2 clearfix">
            <div className="float-end">
              <Link
                className="minilink me-4"
                target="_blank"
                href={getWideAngleURL()}
              >
                {getWideAngleURL()}
              </Link>
            </div>
          </div>
        )}
        {wideangleCameraStatus !== "off" && telephotoCameraStatus === "off" && (
          <div className="py-2 clearfix">
            <div className="float-end">
              <Link
                className="minilink"
                target="_blank"
                href={getTelePhotoURL()}
              >
                {getTelePhotoURL()}
              </Link>
            </div>
          </div>
        )}
        <TransformWrapper>
          <Controls />
          {wideangleCameraStatus === "off" &&
            telephotoCameraStatus === "off" && (
              <div className="float-end">
                <button
                  className="btn btn-more02 me-4"
                  onClick={() =>
                    turnOnCameraHandler(wideangleCamera, connectionCtx)
                  }
                >
                  Turn on wideangle cam.
                </button>
                <button
                  className="btn btn-more02"
                  onClick={() =>
                    turnOnCameraHandler(telephotoCamera, connectionCtx)
                  }
                >
                  Turn on telephoto cam.
                </button>
              </div>
            )}
          {wideangleCameraStatus === "off" &&
            telephotoCameraStatus !== "off" && (
              <div className="float-end">
                <button
                  className="btn btn-more02 me-4"
                  onClick={() =>
                    turnOnCameraHandler(wideangleCamera, connectionCtx)
                  }
                >
                  Turn on wideangle cam.
                </button>
              </div>
            )}
          {wideangleCameraStatus !== "off" &&
            telephotoCameraStatus === "off" && (
              <div className="float-end">
                <button
                  className="btn btn-more02"
                  onClick={() =>
                    turnOnCameraHandler(telephotoCamera, connectionCtx)
                  }
                >
                  Turn on telephoto cam.
                </button>
              </div>
            )}
          <TransformComponent>
            {renderWideAngle()}
            {renderMainCamera()}
          </TransformComponent>
        </TransformWrapper>
      </div>
    );
  else
    return (
      <div>
        <TransformWrapper>
          <TransformComponent>
            {renderWideAngle()}
            {renderMainCamera()}
          </TransformComponent>
        </TransformWrapper>
      </div>
    );
}
