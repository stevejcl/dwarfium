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
import { StaticImageData } from "next/image";
import imgTeleCameraSrc from "/public/images/dwarflab_camera.png";
import imgWideCameraSrc from "/public/images/dwarfII.png";
import { get_error } from "@/lib/dwarf_utils";
import styles from "@/components/DwarfCameras.module.css";
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
  const defaultTeleCameraSrc: StaticImageData = imgTeleCameraSrc;
  const defaultWideCameraSrc: StaticImageData = imgWideCameraSrc;
  const [errorTxt, setErrorTxt] = useState("");
  const [telephotoCameraStatus, setTelephotoCameraStatus] = useState<
    string | undefined
  >("off");
  const [wideangleCameraStatus, setWideangleCameraStatus] = useState<
    string | undefined
  >("off");

  const [mainMediaScreenCameraStatus, setMainMediaScreenCameraStatus] =
    useState<string | undefined>("off");
  const [smallMediaScreenCameraStatus, setSmallMediaScreenCameraStatus] =
    useState<string | undefined>("off");
  const [mainMediaScreenStreamType, setMainMediaScreenStreamType] =
    useState<number>(2); // 1: RTSP 2:JPEG
  const [smallMediaScreenStreamType, setSmallMediaScreenStreamType] =
    useState<number>(2); // 1: RTSP 2:JPEG
  const [mainMediaScreenCameraSrc, setMainMediaScreenCameraSrc] =
    useState<string>(defaultTeleCameraSrc.src);
  const [smallMediaScreenCameraSrc, setSmallMediaScreenCameraSrc] =
    useState<string>(defaultWideCameraSrc.src);
  const [mainMediaScreenCamera, setMainMediaScreenCamera] = useState<number>(0);
  const [smallMediaScreenCamera, setSmallMediaScreenCamera] =
    useState<number>(1);
  const [mainMediaScreenCameraName, setMainMediaScreenCameraName] =
    useState<string>("telephoto");
  const [smallMediaScreenCameraName, setSmallMediaScreenCameraName] =
    useState<string>("wide-angle");
  const initFullScreenRcv = useRef<boolean>(
    connectionCtx.isFullScreenCameraTele
  );

  const doneIframeRefTele = useRef<number>(0);
  const doneIframeRefWide = useRef<number>(0);
  const iframeRefTele = useRef<HTMLIFrameElement | null>(null);
  const iframeRefWide = useRef<HTMLIFrameElement | null>(null);

  const doneIImgRefTele = useRef<number>(0);
  const doneIImgRefWide = useRef<number>(0);
  const iImgRefTele = useRef<HTMLImageElement | null>(null);
  const iImgRefWide = useRef<HTMLImageElement | null>(null);

  const [dimensionsTele, setDimensionsTele] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [dimensionsWide, setDimensionsWide] = useState<{
    width: number;
    height: number;
  } | null>(null);

  console.debug("Default Wide SRC : ", defaultWideCameraSrc.src);
  console.debug("Default Tele SRC : ", defaultTeleCameraSrc.src);
  console.debug("Init useRawPreviewURL : ", useRawPreviewURL);

  let lastRenderTime = useRef(Date.now());

  let IPDwarf = connectionCtx.IPDwarf || DwarfIP;

  useEffect(() => {
    console.debug("Start Of Effect DwarfCameras");
    console.debug("Init Wide SRC : ", smallMediaScreenCameraSrc);
    console.debug("Init Tele SRC : ", mainMediaScreenCameraSrc);
    console.debug(
      "Init is Tele Fullscreen : ",
      connectionCtx.isFullScreenCameraTele
    );
    initFullScreenRcv.current = connectionCtx.isFullScreenCameraTele;
    console.debug("initFullScreenRcv : ", initFullScreenRcv.current);
    setExchangeCamerasStatus(!connectionCtx.isFullScreenCameraTele);
    checkCameraStatus();
    return () => {
      console.debug("Reset Effect DwarfCameras");
      setWideangleCameraStatus("off");
      setTelephotoCameraStatus("off");
      setSmallMediaScreenCameraStatus("off");
      setMainMediaScreenCameraStatus("off");
      if (doneIframeRefTele.current) {
        console.debug("iframeRefTele reset");
        iframeRefTele.current = null;
      }
      if (doneIImgRefTele.current) {
        console.debug("iImgRefTele reset");
        iImgRefTele.current = null;
      }
      if (doneIframeRefWide.current) {
        console.debug("iframeRefWide reset");
        iframeRefWide.current = null;
      }
      if (doneIImgRefWide.current) {
        console.debug("iImgRefWide reset");
        iImgRefWide.current = null;
      }
      console.info(
        `Device type read: ${connectionCtx.typeIdDwarf} - ${
          connectionCtx.typeIdDwarf === 1 ? "Dwarf II" : "Dwarf 3"
        }`
      );
      console.debug("End Of Effect DwarfCameras");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.debug("Change wideangleCamera Status: ", wideangleCameraStatus);
    console.debug("Change smallCamera Status: ", smallMediaScreenCameraStatus);
    console.debug("Change mainCamera Status: ", mainMediaScreenCameraStatus);
    console.debug("Change smallCamera SRC: ", smallMediaScreenCameraSrc);
    console.debug("Tele fullScreen: ", connectionCtx.isFullScreenCameraTele);
    if (connectionCtx.isFullScreenCameraTele) {
      if (smallMediaScreenCameraStatus != wideangleCameraStatus) {
        setSmallMediaScreenCameraStatus(wideangleCameraStatus);
        console.debug("Update smallCamera Status");
        if (wideangleCameraStatus == "on") {
          adjustIframeSizeWide();
          console.debug("Update smallCamera Status: on");
        }
      }
    } else {
      if (mainMediaScreenCameraStatus != wideangleCameraStatus) {
        setMainMediaScreenCameraStatus(wideangleCameraStatus);
        console.debug("Update mainCamera Status");
        if (wideangleCameraStatus == "on") {
          adjustIframeSize();
          console.debug("Update mainCamera Status: on");
        }
      }
    }
    return () => {};
  }, [wideangleCameraStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.debug("Change telephotoCamera Status: ", telephotoCameraStatus);
    console.debug("Change mainCamera Status: ", mainMediaScreenCameraStatus);
    console.debug("Change smallCamera Status: ", smallMediaScreenCameraStatus);
    console.debug("Change mainCamera SRC: ", mainMediaScreenCameraSrc);
    console.debug("Tele fullScreen: ", connectionCtx.isFullScreenCameraTele);
    if (connectionCtx.isFullScreenCameraTele) {
      if (mainMediaScreenCameraStatus != telephotoCameraStatus) {
        setMainMediaScreenCameraStatus(telephotoCameraStatus);
        console.debug("Update mainCamera Status");
        if (telephotoCameraStatus == "on") {
          adjustIframeSize();
          console.debug("Update mainCamera Status: on");
        }
      }
    } else {
      if (smallMediaScreenCameraStatus != telephotoCameraStatus) {
        setSmallMediaScreenCameraStatus(telephotoCameraStatus);
        console.debug("Update smallCamera Status");
        if (telephotoCameraStatus == "on") {
          adjustIframeSizeWide();
          console.debug("Update smallCamera Status: on");
        }
      }
    }
    return () => {};
  }, [telephotoCameraStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.debug(
      "Change StreamTypeWideDwarf: ",
      connectionCtx.streamTypeWideDwarf
    );

    console.debug(
      " API Cam 2 Tele fullScreen: ",
      connectionCtx.isFullScreenCameraTele
    );
    if (connectionCtx.isFullScreenCameraTele) {
      if (connectionCtx.streamTypeWideDwarf != smallMediaScreenStreamType)
        setSmallMediaScreenStreamType(connectionCtx.streamTypeWideDwarf!);
    } else {
      if (connectionCtx.streamTypeWideDwarf != mainMediaScreenStreamType)
        setMainMediaScreenStreamType(connectionCtx.streamTypeWideDwarf!);
    }
    return () => {};
  }, [connectionCtx.streamTypeWideDwarf]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.debug(
      "Change StreamTypeTeleDwarf: ",
      connectionCtx.streamTypeTeleDwarf
    );

    console.debug(
      " API Cam 1 Tele fullScreen: ",
      connectionCtx.isFullScreenCameraTele
    );
    if (connectionCtx.isFullScreenCameraTele) {
      if (connectionCtx.streamTypeTeleDwarf != mainMediaScreenStreamType)
        setMainMediaScreenStreamType(connectionCtx.streamTypeTeleDwarf!);
    } else {
      if (connectionCtx.streamTypeTeleDwarf != smallMediaScreenStreamType)
        setSmallMediaScreenStreamType(connectionCtx.streamTypeTeleDwarf!);
    }
    return () => {};
  }, [connectionCtx.streamTypeTeleDwarf]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.debug(
      "smallMediaScreenStreamType changed: ",
      smallMediaScreenStreamType
    );
    console.debug("Tele fullScreen: ", connectionCtx.isFullScreenCameraTele);

    // Trigger any additional actions when stream type changes
    if (connectionCtx.isFullScreenCameraTele) {
      if (smallMediaScreenCameraStatus == "on") {
        setSrcWideCamera(true);
      }
    } else {
      if (smallMediaScreenCameraStatus == "on") {
        setSrcTeleCamera(true);
      }
    }
  }, [smallMediaScreenStreamType]);

  useEffect(() => {
    console.debug(
      "mainMediaScreenStreamType changed: ",
      mainMediaScreenStreamType
    );
    console.debug("Tele fullScreen: ", connectionCtx.isFullScreenCameraTele);
    if (connectionCtx.isFullScreenCameraTele) {
      if (mainMediaScreenCameraStatus == "on") {
        setSrcTeleCamera(true);
      }
    } else {
      if (mainMediaScreenCameraStatus == "on") {
        setSrcWideCamera(true);
      }
    }
    // Trigger any additional actions when stream type changes
  }, [mainMediaScreenStreamType]);

  useEffect(() => {
    console.debug("showWideangle changed: ", showWideangle);
    if (showWideangle) adjustIframeSizeWide();
  }, [showWideangle]);

  useEffect(() => {
    //  verify if exchange has been launched
    if (initFullScreenRcv.current != connectionCtx.isFullScreenCameraTele) {
      // with this all data will be updated after exchange

      console.debug(
        "exchange Effect IsFullScreen:",
        connectionCtx.isFullScreenCameraTele
      );
      setSrcTeleCamera(true);
      setSrcWideCamera(true);

      setWideangleCameraStatus("on");
      setTelephotoCameraStatus("on");
      setExchangeCamerasStatus((prev) => !prev);
      initFullScreenRcv.current = connectionCtx.isFullScreenCameraTele;
    }
  }, [connectionCtx.isFullScreenCameraTele]);

  // Function to adjust iframe size to match the image
  const adjustIframeSize = () => {
    console.debug("iframeRefTele current :", iframeRefTele);
    console.debug("iImgRefTele current :", iImgRefTele);
    console.debug("dimensionsTele :", dimensionsTele);
    if (
      iframeRefTele.current != null &&
      dimensionsTele != null &&
      dimensionsTele.width != 0 &&
      dimensionsTele.height != 0
    ) {
      doneIframeRefTele.current = 1;
      iframeRefTele.current.style.width = `${dimensionsTele.width}px`;
      iframeRefTele.current.style.height = `${dimensionsTele.height}px`;
      iframeRefTele.current.style.display = `block`;
      console.debug(
        ` set Iframe dimensions ${dimensionsTele.width}px set imgHeight ${dimensionsTele.height}px`
      );
    }
    if (
      iImgRefTele.current != null &&
      dimensionsTele != null &&
      dimensionsTele.width != 0 &&
      dimensionsTele.height != 0
    ) {
      doneIImgRefTele.current = 1;
      iImgRefTele.current.style.width = `${dimensionsTele.width}px`;
      iImgRefTele.current.style.height = `${dimensionsTele.height}px`;
      iImgRefTele.current.style.display = `block`;
      console.debug(
        ` set IImg dimensions ${dimensionsTele.width}px set imgHeight ${dimensionsTele.height}px`
      );
    }
    console.debug("End Of adjustIframeSize");
  };
  const adjustIframeSizeWide = () => {
    console.debug("iframeRefWide current :", iframeRefWide);
    console.debug("iImgRefWide current :", iImgRefTele);
    console.debug("dimensionsWide :", dimensionsWide);
    if (
      iframeRefWide.current != null &&
      dimensionsWide != null &&
      dimensionsWide.width != 0 &&
      dimensionsWide.height != 0
    ) {
      doneIframeRefWide.current = 1;
      iframeRefWide.current.style.width = `${dimensionsWide.width}px`;
      iframeRefWide.current.style.height = `${dimensionsWide.height}px`;
      iframeRefWide.current.style.display = `block`;
      console.debug(
        ` set Iframe dimensions ${dimensionsWide.width}px set imgHeight ${dimensionsWide.height}px`
      );
    }
    if (
      iImgRefWide.current != null &&
      dimensionsWide != null &&
      dimensionsWide.width != 0 &&
      dimensionsWide.height != 0
    ) {
      doneIImgRefWide.current = 1;
      iImgRefWide.current.style.width = `${dimensionsWide.width}px`;
      iImgRefWide.current.style.height = `${dimensionsWide.height}px`;
      iImgRefWide.current.style.display = `block`;
      console.debug(
        ` set IImg dimensions ${dimensionsWide.width}px set imgHeight ${dimensionsWide.height}px`
      );
    }
    console.debug("End Of adjustIframeSizeWide");
  };

  function getWideAngleURL() {
    if (!connectionCtx.typeIdDwarf || connectionCtx.typeIdDwarf == 1) {
      return wideangleURL(IPDwarf);
    } else if (
      connectionCtx.typeIdDwarf == 2 &&
      connectionCtx.streamTypeWideDwarf == 2
    ) {
      return wideangleURL(IPDwarf);
    } else {
      return wideangleURL_D3;
    }
  }

  function getTelePhotoURL() {
    console.debug(
      "getTelePhotoURL :",
      connectionCtx.typeIdDwarf,
      connectionCtx.streamTypeTeleDwarf
    );
    if (!connectionCtx.typeIdDwarf || connectionCtx.typeIdDwarf == 1) {
      return telephotoURL(IPDwarf);
    } else if (
      connectionCtx.typeIdDwarf == 2 &&
      connectionCtx.streamTypeTeleDwarf == 2
    ) {
      return telephotoURL(IPDwarf);
    } else {
      return telePhotoURL_D3;
    }
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

  function checkCameraStatus() {
    let mainScreenStatus = "off";
    // at Start only default value need to change them if Exchange is on
    if (
      smallMediaScreenCameraSrc &&
      smallMediaScreenCameraSrc !== defaultWideCameraSrc.src
    ) {
      setSmallMediaScreenCameraStatus("on");
      if (!connectionCtx.isFullScreenCameraTele) {
        mainScreenStatus = "on";
      }
    } else {
      setSmallMediaScreenCameraStatus("off");
    }

    if (
      mainMediaScreenCameraSrc &&
      mainMediaScreenCameraSrc !== defaultTeleCameraSrc.src
    ) {
      setMainMediaScreenCameraStatus("on");
      if (connectionCtx.isFullScreenCameraTele) {
        mainScreenStatus = "on";
      }
    } else {
      setMainMediaScreenCameraStatus("off");
    }

    if (mainScreenStatus == "off") {
      console.debug("mainScreenStatus : ", mainScreenStatus);
      setTimeout(() => {
        checkCameraStatusLater();
      }, 1000);
    }
  }

  function checkScreenCameraDefault(isMainCamera: boolean) {
    let isDefault = true;
    console.log("isdefaut mainMediaScreenCameraSrc", defaultTeleCameraSrc.src);
    console.log("isdefaut smallMediaScreenCameraSrc", defaultWideCameraSrc.src);
    if (isMainCamera) {
      if (
        mainMediaScreenCameraSrc &&
        mainMediaScreenCameraSrc !== defaultTeleCameraSrc.src
      ) {
        isDefault = false;
      }
    } else {
      if (
        smallMediaScreenCameraSrc &&
        smallMediaScreenCameraSrc !== defaultWideCameraSrc.src
      ) {
        isDefault = false;
      }
    }
    console.log("isdefault", isDefault);
    return isDefault;
  }

  async function checkCameraStatusLater() {
    if (connectionCtx.IPDwarf === undefined) {
      return;
    }
    console.debug("checkCameraStatusLater");
    // Slave Mode turn on Camera
    if (connectionCtx.connectionStatusSlave) {
      setWideangleCameraStatus("on");
      setSrcWideCamera(true);
      setTelephotoCameraStatus("on");
      setSrcTeleCamera(true);
      return;
    }
    adjustIframeSize();

    const customMessageHandlerTeleWide = (txt_info, result_data) => {
      if (
        result_data.cmd ==
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_SYSTEM_WORKING_STATE
      ) {
        if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
          setTelephotoCameraStatus("off");
          get_error("Error: ", result_data, setErrorTxt);
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
      } else {
        logger("", result_data, connectionCtx);
      }
      logger(txt_info, result_data, connectionCtx);
    };

    console.debug("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
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
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_GET_ALL_PARAMS,
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_OPEN_CAMERA,
        Dwarfii_Api.DwarfCMD.CMD_CAMERA_WIDE_OPEN_CAMERA,
      ],
      customMessageHandlerTeleWide
    );

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
  }

  // Function to set the source for the wide-angle camera
  function setSrcWideCamera(status: boolean) {
    console.debug("Render setSrcWideCamera : ", status);
    let url: string = "";
    if (status) {
      url = getWideAngleURL();
    } else {
      if (connectionCtx.isFullScreenCameraTele) {
        url = defaultWideCameraSrc.src;
      } else {
        url = defaultTeleCameraSrc.src;
      }
    }

    if (connectionCtx.isFullScreenCameraTele) {
      if (url != smallMediaScreenCameraSrc) {
        setSmallMediaScreenCameraSrc(url);
      }
    } else {
      if (url != mainMediaScreenCameraSrc) {
        setMainMediaScreenCameraSrc(url);
      }
    }
    console.info("setSrcWideCamera: ", url);
  }

  // Function to set the source for the tele camera
  function setSrcTeleCamera(status: boolean) {
    console.debug("Render setSrcTeleCamera : ", status);
    let url: string = "";
    if (status) {
      url = getTelePhotoURL();
    } else {
      if (connectionCtx.isFullScreenCameraTele) {
        url = defaultTeleCameraSrc.src;
      } else {
        url = defaultWideCameraSrc.src;
      }
    }

    if (connectionCtx.isFullScreenCameraTele) {
      if (url != mainMediaScreenCameraSrc) {
        setMainMediaScreenCameraSrc(url);
      }
    } else {
      if (url != smallMediaScreenCameraSrc) {
        setSmallMediaScreenCameraSrc(url);
      }
    }
    console.info("setSrcTeleCamera: ", url);
  }

  function renderSmallScreen() {
    console.debug("Render Small Screen : ", showWideangle);
    console.info("Render Small Screen SRC : ", smallMediaScreenCameraSrc);
    return (
      <div className={`${showWideangle ? "" : "d-none"}`}>
        <Image
          className={`${
            smallMediaScreenCameraStatus == "off" ? styles.wideangle : "d-none"
          }`}
          id="idImageWideCamera"
          width="640"
          height="360"
          priority
          src={defaultWideCameraSrc}
          alt={
            smallMediaScreenCameraSrc
              ? `livestream for ${smallMediaScreenCameraName} camera`
              : ""
          }
          onLoadingComplete={(img) => {
            setDimensionsWide({
              width: img.offsetWidth,
              height: img.offsetHeight,
            });
            adjustIframeSizeWide();
          }}
          style={{
            height: "auto", // Maintain the aspect ratio of the image
          }}
        />
        <div
          className={`${
            smallMediaScreenCameraStatus == "on" ? styles.wideangle : "d-none"
          }`}
        >
          {!connectionCtx.typeIdDwarf ||
          connectionCtx.typeIdDwarf == 1 ||
          smallMediaScreenStreamType == 2 ? (
            <img
              id="idImgWideCamera"
              onLoad={() => {
                handleWideImageLoad();
              }}
              src={smallMediaScreenCameraSrc}
              alt={smallMediaScreenCameraSrc ? "" : ""}
              style={{
                width: "100%", // Customize as needed
                height: "auto", // Customize as needed
                border: "none", // No border for iframe
              }}
              ref={iImgRefWide} // Reference to the image element
            />
          ) : (
            <iframe
              id="idWideCamera"
              onLoad={() => {
                handleWideImageLoad();
              }}
              className="styles.wideangle"
              src={smallMediaScreenCameraSrc}
              style={{
                width: "100%", // Customize as needed
                height: "100%", // Customize as needed
                border: "none", // No border for iframe
              }}
              ref={iframeRefWide} // Reference to the iframe element
            ></iframe>
          )}
        </div>
      </div>
    );
  }

  function renderMainScreen() {
    let newRenderTime = Date.now();

    if (
      lastRenderTime.current === undefined ||
      newRenderTime > lastRenderTime.current + 500
    ) {
      lastRenderTime.current = newRenderTime;
      console.debug("Timer Render Main Screen : ", newRenderTime);
    }

    console.info("Render Main Screen SRC : ", mainMediaScreenCameraSrc);
    return (
      <div className="camera-container">
        {showControls && (
          <Image
            className={`${
              mainMediaScreenCameraStatus == "off" ? "" : "d-none"
            }`}
            id="idImageTeleCamera"
            src={defaultTeleCameraSrc}
            width="1216"
            height="684"
            priority
            alt={
              mainMediaScreenCameraSrc
                ? `livestream for ${mainMediaScreenCameraName} camera`
                : ""
            }
            onLoadingComplete={(img) => {
              setDimensionsTele({
                width: img.offsetWidth,
                height: img.offsetHeight,
              });
              adjustIframeSize();
            }}
          />
        )}
        {!showControls && (
          <img
            className={`${
              mainMediaScreenCameraStatus == "off" ? "" : "d-none"
            }`}
            id="idImage2TeleCamera"
            src={defaultTeleCameraSrc.src}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
            onLoad={(event) => {
              const img = event.target as HTMLImageElement;
              if (mainMediaScreenStreamType == 1) {
                setDimensionsTele({
                  width: img.offsetWidth,
                  height: img.offsetHeight,
                });
                adjustIframeSize();
              }
            }}
          />
        )}
        <div
          className={`${
            mainMediaScreenCameraStatus == "on" ? "styles.telephoto" : "d-none"
          }`}
        >
          {!connectionCtx.typeIdDwarf ||
          connectionCtx.typeIdDwarf == 1 ||
          mainMediaScreenStreamType == 2 ? (
            <img
              id="idImgTeleCamera"
              onLoad={() => {
                handleImageLoad();
              }}
              src={mainMediaScreenCameraSrc}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              ref={iImgRefTele} // Reference to the image element
            />
          ) : (
            <iframe
              id="idTeleCamera"
              onLoad={() => handleImageLoad()}
              scrolling="no"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              className=""
              src={mainMediaScreenCameraSrc}
              ref={iframeRefTele} // Reference to the iframe element
            ></iframe>
          )}
        </div>
      </div>
    );
  }

  const handleWideImageLoad = () => {
    // Only hide the image and show the iframe after adjusting the size
    if (!checkScreenCameraDefault(false)) {
      adjustIframeSizeWide();
      setSmallMediaScreenCameraStatus("on");
    } else {
      setSmallMediaScreenCameraStatus("off");
    }
  };

  const handleImageLoad = () => {
    // Only hide the image and show the iframe after adjusting the size
    if (!checkScreenCameraDefault(true)) {
      adjustIframeSize();
      setMainMediaScreenCameraStatus("on");
    } else {
      setMainMediaScreenCameraStatus("off");
    }
  };

  function exchangeCameras() {
    if (!showWideangle) return;

    if (
      mainMediaScreenCameraStatus == "off" ||
      smallMediaScreenCameraStatus == "off"
    )
      return;

    console.debug(
      "start exchange IsFullScreen:",
      connectionCtx.isFullScreenCameraTele
    );

    setWideangleCameraStatus("off");
    setTelephotoCameraStatus("off");

    connectionCtx.setIsFullScreenCameraTele((prev) => !prev);
    console.debug("exchange IsFullScreen:", connectionCtx.isFullScreenCameraTele);

    let currentMainMediaScreenStreamType = mainMediaScreenStreamType;
    setMainMediaScreenStreamType(smallMediaScreenStreamType);
    setSmallMediaScreenStreamType(currentMainMediaScreenStreamType);

    // not really used
    let currentMainMediaScreenCamera = mainMediaScreenCamera;
    let currentMainMediaScreenCameraName = mainMediaScreenCameraName;
    setMainMediaScreenCamera(smallMediaScreenCamera);
    setSmallMediaScreenCamera(currentMainMediaScreenCamera);
    setMainMediaScreenCameraName(smallMediaScreenCameraName);
    setSmallMediaScreenCameraName(currentMainMediaScreenCameraName);

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
            {renderSmallScreen()}
            {renderMainScreen()}
          </TransformComponent>
        </TransformWrapper>
      </div>
    );
  else
    return (
      <div>
        <TransformWrapper>
          <TransformComponent>
            {renderSmallScreen()}
            {renderMainScreen()}
          </TransformComponent>
        </TransformWrapper>
      </div>
    );
}
