import { useContext, useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import Link from "next/link";

import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  Dwarfii_Api,
  messageAstroStartCaptureRawLiveStacking,
  messageAstroStopCaptureRawLiveStacking,
  messageAstroGoLive,
  messageFocusStartAstroAutoFocus,
  messageFocusStopAstroAutoFocus,
  messageFocusManualSingleStepFocus,
  messageFocusStartManualContinuFocus,
  messageFocusStopManualContinuFocus,
  WebSocketHandler,
} from "dwarfii_api";
import ImagingAstroSettings from "@/components/imaging/ImagingAstroSettings";
import RecordingButton from "@/components/icons/RecordingButton";
import RecordButton from "@/components/icons/RecordButton";
import { logger } from "@/lib/logger";
import { validateAstroSettings } from "@/components/imaging/form_validations";
import { ImagingSession } from "@/types";
import { saveImagingSessionDb, removeImagingSessionDb } from "@/db/db_utils";
import {
  turnOnTeleCameraFn,
  calculateSessionTime,
  updateTelescopeISPSetting,
} from "@/lib/dwarf_utils";
import styles from "@/components/imaging/ImagingMenu.module.css";

type PropType = {
  setShowWideangle: Dispatch<SetStateAction<boolean>>;
  setUseRawPreviewURL: Dispatch<SetStateAction<boolean>>;
};

export default function ImagingMenu(props: PropType) {
  const { setShowWideangle, setUseRawPreviewURL } = props;
  let connectionCtx = useContext(ConnectionContext);
  const [showWideAngle, setShowWideAngle] = useState(false);
  const [astroFocus, setAstroFocus] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [validSettings, setValidSettings] = useState(isValid());
  const [isRecording, setIsRecording] = useState(false);
  const [endRecording, setEndRecording] = useState(false);
  const [isStackedCountStart, setIsStackedCountStart] = useState(false);
  const [timerGlobal, setTimerGlobal] =
    useState<ReturnType<typeof setInterval>>();

  let timerSession: ReturnType<typeof setInterval>;
  let timerSessionInit: boolean = false;

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    logger(" TG --- Global Timer:", testTimer, connectionCtx);
    if (isRecording)
      logger("TG setIsRecording True:", testTimer, connectionCtx);
    else logger("TG setIsRecording False:", testTimer, connectionCtx);
    if (endRecording) logger("TG endRecording True:", testTimer, connectionCtx);
    else logger("TG endRecording False:", testTimer, connectionCtx);
  }, [timerGlobal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    if (isRecording) logger("setIsRecording True:", testTimer, connectionCtx);
    else logger("setIsRecording False:", testTimer, connectionCtx);
  }, [isRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    if (endRecording) logger("endRecording True:", testTimer, connectionCtx);
    else logger("endRecording false:", testTimer, connectionCtx);
  }, [endRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    if (endRecording) logger("endRecording True:", testTimer, connectionCtx);
    else logger("endRecording false:", testTimer, connectionCtx);
  }, [endRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    if (isStackedCountStart)
      logger("isStackedCountStart True:", testTimer, connectionCtx);
    else logger("isStackedCountStart false:", testTimer, connectionCtx);
  }, [isStackedCountStart]); // eslint-disable-line react-hooks/exhaustive-deps

  function isValid() {
    let errors = validateAstroSettings(connectionCtx.astroSettings as any);
    return (
      Object.keys(errors).length === 0 &&
      Object.keys(connectionCtx.astroSettings).length > 0
    );
  }

  function startTimer() {
    let timer: string | any = "";
    if (!timerSessionInit) {
      timer = setInterval(() => {
        let time = calculateSessionTime(connectionCtx);
        if (time) {
          connectionCtx.setImagingSession((prev) => {
            prev["sessionElaspsedTime"] = time as string;
            return { ...prev };
          });
        }
      }, 2000);
    } else timer = timerSession;

    return timer;
  }

  const customErrorHandler = () => {
    console.error("ConnectDwarf : Socket Close!");
    connectionCtx.setConnectionStatus(false);
  };

  const customStateHandler = (state) => {
    if (state != connectionCtx.connectionStatus) {
      connectionCtx.setConnectionStatus(state);
    }
  };

  function takeAstroPhotoHandler() {
    if (connectionCtx.IPDwarf == undefined) {
      return;
    }
    if (validSettings === false) {
      return;
    }

    let testTimer: string | any = "";
    if (!timerSessionInit) {
      timerSession = startTimer();
      if (timerSession) {
        timerSessionInit = true;
        testTimer = timerSession.toString();
        logger("startTimer timer:", testTimer, connectionCtx);
        setTimerGlobal(timerSession);
      } else timerSessionInit = false;
    }

    if (timerSessionInit && timerSession) {
      testTimer = timerSession.toString();
      logger("startImagingSession timer:", testTimer, connectionCtx);

      let now = Date.now();
      connectionCtx.setImagingSession((prev) => {
        prev.startTime = now;
        return { ...prev };
      });
      setIsRecording(true);
      setIsStackedCountStart(false);

      saveImagingSessionDb("startTime", now.toString());
      setEndRecording(false);

      //startAstroPhotoHandler

      logger("startAstroPhotoHandler current ST:", testTimer, connectionCtx);
      connectionCtx.setImagingSession((prev) => {
        prev["imagesTaken"] = 0;
        return { ...prev };
      });
      connectionCtx.setImagingSession((prev) => {
        prev["imagesStacked"] = 0;
        return { ...prev };
      });

      const customMessageHandler = (txt_info, result_data) => {
        // CMD_ASTRO_START_CAPTURE_RAW_LIVE_STACKING -> Start Capture
        // CMD_NOTIFY_PROGRASS_CAPTURE_RAW_LIVE_STACKING -> get details of shooting progress
        // CMD_NOTIFY_STATE_CAPTURE_RAW_LIVE_STACKING  -> get state of shooting progress
        if (
          result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_CAPTURE_RAW_LIVE_STACKING
        ) {
          if (
            result_data.data.code ==
            Dwarfii_Api.DwarfErrorCode.CODE_ASTRO_NEED_GOTO
          ) {
            logger("Capture Need Goto ", {}, connectionCtx);
            return false;
          } else if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
            logger("Start Capture error", {}, connectionCtx);
            endImagingSession();
            return false;
          } else {
            logger("Start Capture ok", {}, connectionCtx);
          }
        } else if (
          result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_CAPTURE_RAW_LIVE_STACKING
        ) {
          if (
            result_data.data.state ==
            Dwarfii_Api.OperationState.OPERATION_STATE_STOPPED
          ) {
            logger("Stop Capture", {}, connectionCtx);
            //Call endImagingSession
            endImagingSession();
            return false;
          }
        } else if (
          result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_NOTIFY_PROGRASS_CAPTURE_RAW_LIVE_STACKING
        ) {
          if (
            result_data.data.updateCountType == 0 ||
            result_data.data.updateCountType == 2
          ) {
            connectionCtx.setImagingSession((prev) => {
              prev["imagesTaken"] = result_data.data.currentCount;
              return { ...prev };
            });
            saveImagingSessionDb(
              "imagesTaken",
              result_data.data.currentCount.toString()
            );
            logger(
              "Photos count : ",
              result_data.data.currentCount,
              connectionCtx
            );

            if (timerSession) testTimer = timerSession.toString();
            logger("takeAstroPhoto currentCount ST:", testTimer, connectionCtx);
          }
          if (
            result_data.data.updateCountType == 1 ||
            result_data.data.updateCountType == 2
          ) {
            connectionCtx.setImagingSession((prev) => {
              prev["imagesStacked"] = result_data.data.stackedCount;
              return { ...prev };
            });
            saveImagingSessionDb(
              "imagesStacked",
              result_data.data.stackedCount.toString()
            );
            logger(
              "Photos stacked : ",
              result_data.data.stackedCount,
              connectionCtx
            );
            // update Camera to rawPreviewURL once first stacked image is done
            if (result_data.data.stackedCount > 0 && !isStackedCountStart) {
              setIsStackedCountStart(true);
              //let payload = updateRawPreviewSource();
              //logger("start swithRawPreview...", payload, connectionCtx);
              //socketSend(socket, payload);
              //setUseRawPreviewURL(true);
            }
          }
          /*        } else if (message.interface === setRAWPreviewCmd) {
          logger(
            "setRAWPreviewCmd Camera to rawPreviewURL:",
            message,
            connectionCtx
          );
          let IPDwarf = connectionCtx.IPDwarf || DwarfIP;
          let testPreviewURL = rawPreviewURL(IPDwarf);
          if (testPreviewURL)
            console.log("start UseRawPreviewURL : " + testPreviewURL);
*/
        } else {
          logger("", result_data, connectionCtx);
        }
        logger(txt_info, result_data, connectionCtx);
      };

      console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
      const webSocketHandler = connectionCtx.socketIPDwarf
        ? connectionCtx.socketIPDwarf
        : new WebSocketHandler(connectionCtx.IPDwarf);

      // Send Command : messageAstroStartCaptureRawLiveStacking
      let WS_Packet = messageAstroStartCaptureRawLiveStacking();
      let txtInfoCommand = "takeAstroPhoto";

      webSocketHandler.prepare(
        WS_Packet,
        txtInfoCommand,
        [
          Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_CAPTURE_RAW_LIVE_STACKING,
          Dwarfii_Api.DwarfCMD.CMD_NOTIFY_PROGRASS_CAPTURE_RAW_LIVE_STACKING,
          Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_CAPTURE_RAW_LIVE_STACKING,
        ],
        customMessageHandler,
        customStateHandler,
        customErrorHandler
      );

      if (!webSocketHandler.run()) {
        console.error(" Can't launch Web Socket Run Action!");
      }
    }
  }

  function stopAstroPhotoHandler() {
    if (connectionCtx.IPDwarf === undefined) {
      return;
    }

    const customMessageHandler = (txt_info, result_data) => {
      // CMD_ASTRO_STOP_CAPTURE_RAW_LIVE_STACKING -> Stop Capture
      // CMD_NOTIFY_PROGRASS_CAPTURE_RAW_LIVE_STACKING -> get details of shooting progress
      // CMD_NOTIFY_STATE_CAPTURE_RAW_LIVE_STACKING  -> get state of shooting progress
      if (
        result_data.cmd ==
        Dwarfii_Api.DwarfCMD.CMD_ASTRO_STOP_CAPTURE_RAW_LIVE_STACKING
      ) {
        if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
          logger("Stop Capture error", {}, connectionCtx);
        } else {
          logger("Stop Capture ok", {}, connectionCtx);
        }
        endImagingSession();
      } else if (
        result_data.cmd ==
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_CAPTURE_RAW_LIVE_STACKING
      ) {
        if (
          result_data.data.state ==
          Dwarfii_Api.OperationState.OPERATION_STATE_STOPPED
        ) {
          logger("Stop Capture.", {}, connectionCtx);
          endImagingSession();
          return false;
        }
      } else if (
        result_data.cmd ==
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_PROGRASS_CAPTURE_RAW_LIVE_STACKING
      ) {
        if (
          result_data.data.updateCountType == 0 ||
          result_data.data.updateCountType == 2
        ) {
          connectionCtx.setImagingSession((prev) => {
            prev["imagesTaken"] = result_data.data.currentCount;
            return { ...prev };
          });
          saveImagingSessionDb(
            "imagesTaken",
            result_data.data.currentCount.toString()
          );
        }
        if (
          result_data.data.updateCountType == 1 ||
          result_data.data.updateCountType == 2
        ) {
          connectionCtx.setImagingSession((prev) => {
            prev["imagesStacked"] = result_data.data.stackedCount;
            return { ...prev };
          });
          saveImagingSessionDb(
            "imagesStacked",
            result_data.data.stackedCount.toString()
          );
        }
      } else {
        logger("", result_data, connectionCtx);
      }
      logger(txt_info, result_data, connectionCtx);
    };

    console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    // Send Command : messageAstroStopCaptureRawLiveStacking
    let WS_Packet = messageAstroStopCaptureRawLiveStacking();
    let txtInfoCommand = "stopAstroPhoto";

    webSocketHandler.prepare(
      WS_Packet,
      txtInfoCommand,
      [
        Dwarfii_Api.DwarfCMD.CMD_ASTRO_STOP_CAPTURE_RAW_LIVE_STACKING,
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_PROGRASS_CAPTURE_RAW_LIVE_STACKING,
        Dwarfii_Api.DwarfCMD.CMD_NOTIFY_STATE_CAPTURE_RAW_LIVE_STACKING,
      ],
      customMessageHandler,
      customStateHandler,
      customErrorHandler
    );

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
  }

  function goLiveHandler() {
    if (connectionCtx.IPDwarf === undefined) {
      return;
    }

    const customMessageHandler = (txt_info, result_data) => {
      // CMD_ASTRO_GO_LIVE -> Stop Capture
      if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_ASTRO_GO_LIVE) {
        if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
          logger("Go Live error", {}, connectionCtx);
        } else {
          logger("Go Live ok", {}, connectionCtx);
        }
      } else {
        logger("", result_data, connectionCtx);
      }
      logger(txt_info, result_data, connectionCtx);
    };

    console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    // Send Command : messageAstroGoLive
    let WS_Packet = messageAstroGoLive();
    let txtInfoCommand = "goLive";

    webSocketHandler.prepare(
      WS_Packet,
      txtInfoCommand,
      [Dwarfii_Api.DwarfCMD.CMD_ASTRO_GO_LIVE],
      customMessageHandler,
      customStateHandler,
      customErrorHandler
    );

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
  }

  function endImagingSession() {
    let testTimer: string | any = "";
    if (timerSession) {
      testTimer = timerSession.toString();
      logger("ImagingSession tS clearInterval:", testTimer, connectionCtx);
    }
    if (timerGlobal) {
      testTimer = timerGlobal.toString();
      logger("ImagingSession tG clearInterval:", testTimer, connectionCtx);
    }
    // timerSession if Photos Session is completed !
    if (timerSession) clearInterval(timerSession);
    if (timerGlobal) clearInterval(timerGlobal);
    timerSessionInit = false;
    setEndRecording(true);
    setIsRecording(false);
  }

  function endPreview() {
    connectionCtx.setImagingSession({} as ImagingSession);
    removeImagingSessionDb();

    setEndRecording(false);
    setUseRawPreviewURL(false);

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

  function focusMinus() {
    focusAction(false, false, false, 0);
  }

  function focusMinusLong() {
    focusAction(false, true, false, 0);
  }

  function focusLongStop() {
    focusAction(false, true, true, 0);
  }

  function focusPlus() {
    focusAction(false, false, false, 1);
  }

  function focusPlusLong() {
    focusAction(false, true, false, 1);
  }

  function focusAutoAstro() {
    console.log("Astro click");
    setAstroFocus(true);
    focusAction(true, false, false, 0, 1);
  }

  function focusAutoAstroStop() {
    setAstroFocus(false);
    focusAction(true, false, true, 0);
  }

  const handleRightClick = (event) => {
    event.preventDefault(); // Prevent default context menu
    console.log("Right-click detected!");
    // Your custom logic for right-click event
    console.log("Astro Right click");
    setAstroFocus(true);
    focusAction(true, false, false, 0, 0);
  };

  function focusAction(Astro, Continu, Stop, Direction, ModeAstro = 1) {
    if (connectionCtx.IPDwarf === undefined) {
      return;
    }

    const customMessageHandler = (txt_info, result_data) => {
      // CMD_FOCUS_START_ASTRO_AUTO_FOCUS
      // CMD_FOCUS_STOP_ASTRO_AUTO_FOCUS
      // CMD_FOCUS_MANUAL_SINGLE_STEP_FOCUS
      // CMD_FOCUS_START_MANUAL_CONTINU_FOCUS
      // CMD_FOCUS_STOP_MANUAL_CONTINU_FOCUS
      if (
        result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_FOCUS_START_ASTRO_AUTO_FOCUS ||
        result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_FOCUS_STOP_ASTRO_AUTO_FOCUS ||
        result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_FOCUS_MANUAL_SINGLE_STEP_FOCUS ||
        result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_FOCUS_START_MANUAL_CONTINU_FOCUS ||
        result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_FOCUS_STOP_MANUAL_CONTINU_FOCUS
      ) {
        if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
          logger("Focus error", {}, connectionCtx);
        } else {
          logger("Focus ok", {}, connectionCtx);
        }
      } else {
        logger("", result_data, connectionCtx);
      }
      logger(txt_info, result_data, connectionCtx);
    };

    console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    // Send Command : messageFocusStartAstroAutoFocus
    let WS_Packet;
    let txtInfoCommand;
    let Cmd;
    if (Astro && !Continu && !Stop) {
      WS_Packet = messageFocusStartAstroAutoFocus(ModeAstro);
      txtInfoCommand = "AstroFocus";
      Cmd = [Dwarfii_Api.DwarfCMD.CMD_FOCUS_START_ASTRO_AUTO_FOCUS];
      console.log("Focus : CMD_FOCUS_START_ASTRO_AUTO_FOCUS");
    }
    if (Astro && !Continu && Stop) {
      WS_Packet = messageFocusStopAstroAutoFocus();
      txtInfoCommand = "AstroFocus";
      Cmd = [Dwarfii_Api.DwarfCMD.CMD_FOCUS_STOP_ASTRO_AUTO_FOCUS];
      console.log("Focus : CMD_FOCUS_STOP_ASTRO_AUTO_FOCUS");
    }
    if (!Astro && Continu && !Stop) {
      WS_Packet = messageFocusStartManualContinuFocus(Direction);
      txtInfoCommand = "AstroFocus";
      Cmd = [Dwarfii_Api.DwarfCMD.CMD_FOCUS_START_MANUAL_CONTINU_FOCUS];
      console.log("Focus : CMD_FOCUS_START_MANUAL_CONTINU_FOCUS");
    }
    if (!Astro && Continu && Stop) {
      WS_Packet = messageFocusStopManualContinuFocus();
      txtInfoCommand = "AstroFocus";
      Cmd = [Dwarfii_Api.DwarfCMD.CMD_FOCUS_STOP_MANUAL_CONTINU_FOCUS];
      console.log("Focus : CMD_FOCUS_STOP_MANUAL_CONTINU_FOCUS");
    }
    if (!Astro && !Continu) {
      WS_Packet = messageFocusManualSingleStepFocus(Direction);
      txtInfoCommand = "AstroFocus";
      Cmd = [Dwarfii_Api.DwarfCMD.CMD_FOCUS_MANUAL_SINGLE_STEP_FOCUS];
      console.log("Focus : CMD_FOCUS_MANUAL_SINGLE_STEP_FOCUS");
    }

    webSocketHandler.prepare(
      WS_Packet,
      txtInfoCommand,
      Cmd,
      customMessageHandler,
      customStateHandler,
      customErrorHandler
    );

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
  }

  function renderRecordButton() {
    console.log("Record Button");
    // don't have clickable record button if the setting menu is shown
    if (showSettingsMenu) {
      console.log("Record Button1");
      return <RecordButton />;
      // display clickable record button if all fields are completed
    } else if (validSettings) {
      console.log("Record Button2");
      if (isRecording) {
        console.log("Record Button3");
        return <RecordingButton onClick={stopAstroPhotoHandler} />;
      } else if (endRecording) {
        console.log("Record Button4");
        // Live Button is on
        return (
          <RecordButton onClick={goLiveHandler} title="End of Recording" />
        );
      } else {
        console.log("Record Button OK");
        return (
          <RecordButton
            onClick={takeAstroPhotoHandler}
            title="Start Recording"
          />
        );
      }
      // if fields are not filled in, display warning
    } else {
      return (
        <>
          <OverlayTrigger
            placement="left"
            delay={{ show: 100, hide: 200 }}
            overlay={renderRecordButtonWarning}
          >
            <svg
              height="100%"
              version="1.1"
              viewBox="0 0 64 64"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 32C2 15.4317 15.4317 2 32 2C48.5683 2 62 15.4317 62 32C62 48.5683 48.5683 62 32 62C15.4317 62 2 48.5683 2 32Z"
                fill="none"
                opacity="1"
                stroke="currentColor"
                strokeLinecap="butt"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              <path
                d="M21 32C21 25.9249 25.9249 21 32 21C38.0751 21 43 25.9249 43 32C43 38.0751 38.0751 43 32 43C25.9249 43 21 38.0751 21 32Z"
                fill="currentColor"
                fillRule="nonzero"
                opacity="1"
                stroke="currentColor"
                strokeLinecap="butt"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </OverlayTrigger>
        </>
      );
    }
  }

  const renderRecordButtonWarning = (props: any) => {
    if (showSettingsMenu) {
      return <></>;
    }

    return (
      <Tooltip id="button-tooltip" {...props}>
        You must set the camera settings.
      </Tooltip>
    );
  };

  /*
  let startTime;
  let isLongPress = false;

  function handleMouseDown() {
    startTime = new Date().getTime();

    // Set a timeout for the long press
    setTimeout(() => {
      isLongPress = true;
      console.log("Long press detected");
    }, 500); // Adjust the duration as needed
  }

  function handleMouseUp() {
    const endTime = new Date().getTime();
    const duration = endTime - startTime;

    // Check if it was a short click
    if (duration < 500 && !isLongPress) {
      console.log("Short click detected");
      // Perform your action for a short click
    }

    // Reset variables for the next interaction
    startTime = 0;
    isLongPress = false;
  }
  */

  return (
    <ul className="nav nav-pills flex-column mb-auto border">
      <li className={`nav-item ${styles.box}`}>
        <Link href="#" className="">
          Astro
        </Link>
      </li>
      <li className={`nav-item ${styles.box}`}>
        <Link href="#" className="" title="Show Settings">
          <OverlayTrigger
            trigger="click"
            placement={"left"}
            show={showSettingsMenu}
            onToggle={() => setShowSettingsMenu((p) => !p)}
            overlay={
              <Popover id="popover-positioned-left">
                <Popover.Body>
                  <ImagingAstroSettings
                    setValidSettings={setValidSettings}
                    validSettings={validSettings}
                    setShowSettingsMenu={setShowSettingsMenu}
                  />
                </Popover.Body>
              </Popover>
            }
          >
            <i className="bi bi-sliders" style={{ fontSize: "1.75rem" }}></i>
          </OverlayTrigger>
        </Link>
      </li>
      <li className={`nav-item ${styles.box}`}>
        <Link href="#" className="">
          {renderRecordButton()}
        </Link>
      </li>
      <li className={`nav-item ${styles.box}`}>
        {showWideAngle && (
          <Link
            href="#"
            className=""
            onClick={() => {
              setShowWideangle((prev) => !prev);
              setShowWideAngle((prev) => !prev);
            }}
            title="Show Wideangle"
          >
            <i
              className="bi bi-pip"
              style={{
                fontSize: "1.75rem",
                transform: "rotate(180deg)",
                display: "inline-block",
              }}
            ></i>
          </Link>
        )}
        {!showWideAngle && (
          <Link
            href="#"
            className=""
            onClick={() => {
              setShowWideangle((prev) => !prev);
              setShowWideAngle((prev) => !prev);
            }}
            title="Hide Wideangle"
          >
            <i
              className="bi bi-pip"
              style={{
                fontSize: "1.75rem",
                transform: "rotate(180deg)",
                display: "inline-block",
              }}
            ></i>
          </Link>
        )}
      </li>
      {!isRecording && connectionCtx.imagingSession.startTime && (
        <li className={`nav-item ${styles.box}`}>
          <Link
            href="#"
            className=""
            onClick={() => {
              goLiveHandler();
              endPreview();
            }}
          >
            Live
          </Link>
        </li>
      )}
      <hr />
      {!isRecording && !endRecording && !astroFocus && (
        <div onContextMenu={handleRightClick}>
          <li className={`nav-item ${styles.box}`}>
            <Link
              href="#"
              className=""
              onClick={focusAutoAstro}
              title="Astro Auto Focus"
            >
              <i
                className="icon-bullseye"
                style={{
                  fontSize: "2rem",
                }}
              ></i>
            </Link>
          </li>
        </div>
      )}
      {!isRecording && !endRecording && astroFocus && (
        <li className={`nav-item ${styles.box}`}>
          <Link
            href="#"
            className=""
            onClick={focusAutoAstroStop}
            title="Astro Focus Stop"
          >
            <i
              className="icon-bullseye"
              style={{
                fontSize: "2rem",
              }}
            ></i>
          </Link>
        </li>
      )}
      <hr />
      {!isRecording && !endRecording && (
        <li className={`nav-item ${styles.box}`}>
          <Link href="#" className="" onClick={focusPlus} title="Focus + Click">
            <i
              className="icon-plus-squared-alt"
              style={{
                fontSize: "2rem",
              }}
            ></i>
          </Link>
        </li>
      )}
      <hr />
      {!isRecording && !endRecording && (
        <li className={`nav-item ${styles.box}`}>
          <Link
            href="#"
            className=""
            onClick={focusMinus}
            title="Focus - Click"
          >
            <i
              className="icon-minus-squared-alt"
              style={{
                fontSize: "2rem",
              }}
            ></i>
          </Link>
        </li>
      )}
      <hr />
      {!isRecording && !endRecording && (
        <li className={`nav-item ${styles.box}`}>
          <Link
            href="#"
            className=""
            onMouseDown={focusPlusLong}
            onMouseUp={focusLongStop}
            title="Focus + Long Press"
          >
            <i
              className="icon-plus-squared"
              style={{
                fontSize: "2rem",
              }}
            ></i>
          </Link>
        </li>
      )}
      <hr />
      {!isRecording && !endRecording && (
        <li className={`nav-item ${styles.box}`}>
          <Link
            href="#"
            className=""
            onMouseDown={focusMinusLong}
            onMouseUp={focusLongStop}
            title="Focus - Long Press"
          >
            <i
              className="icon-minus-squared"
              style={{
                fontSize: "2rem",
              }}
            ></i>
          </Link>
        </li>
      )}
    </ul>
  );
}
