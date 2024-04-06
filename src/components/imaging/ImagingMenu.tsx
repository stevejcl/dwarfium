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
import { validateAstroSettings } from "@/components/imaging/form_validations";
import { ImagingSession } from "@/types";
import { saveImagingSessionDb, removeImagingSessionDb } from "@/db/db_utils";
import CameraAddOn from "@/components/imaging/CameraAddOn";
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
  const [showModal, setShowModal] = useState(false);
  const [timerGlobal, setTimerGlobal] =
    useState<ReturnType<typeof setInterval>>();

  let timerSession: ReturnType<typeof setInterval>;
  let timerSessionInit: boolean = false;

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    console.debug(" TG --- Global Timer:", testTimer, connectionCtx);
    if (connectionCtx.imagingSession.isRecording)
      console.debug("TG isRecording True:", testTimer, connectionCtx);
    else console.debug("TG isRecording False:", testTimer, connectionCtx);
    if (connectionCtx.imagingSession.endRecording)
      console.debug("TG endRecording True:", testTimer, connectionCtx);
    else console.debug("TG endRecording False:", testTimer, connectionCtx);
  }, [timerGlobal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    if (connectionCtx.imagingSession.isRecording)
      console.debug("setIsRecording True:", testTimer, connectionCtx);
    else console.debug("setIsRecording False:", testTimer, connectionCtx);
  }, [connectionCtx.imagingSession.isRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    if (connectionCtx.imagingSession.endRecording)
      console.debug("endRecording True:", testTimer, connectionCtx);
    else console.debug("endRecording false:", testTimer, connectionCtx);
  }, [connectionCtx.imagingSession.endRecording]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    if (connectionCtx.imagingSession.isStackedCountStart)
      console.debug("isStackedCountStart True:", testTimer, connectionCtx);
    else console.debug("isStackedCountStart false:", testTimer, connectionCtx);
  }, [connectionCtx.imagingSession.isStackedCountStart]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let testTimer: string | any = "";
    if (timerGlobal) testTimer = timerGlobal.toString();
    if (connectionCtx.imagingSession.isGoLive) {
      console.debug("isGoLive True:", testTimer, connectionCtx);
      endImagingSession();
    } else console.debug("isGoLive false:", testTimer, connectionCtx);
  }, [connectionCtx.imagingSession.isGoLive]); // eslint-disable-line react-hooks/exhaustive-deps

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
        console.debug("startTimer timer:", testTimer, connectionCtx);
        setTimerGlobal(timerSession);
      } else timerSessionInit = false;
    }

    if (timerSessionInit && timerSession) {
      testTimer = timerSession.toString();
      console.debug("startImagingSession timer:", testTimer, connectionCtx);

      let now = Date.now();
      connectionCtx.setImagingSession((prev) => {
        prev.startTime = now;
        return { ...prev };
      });
      connectionCtx.setImagingSession((prev) => {
        prev["isRecording"] = true;
        return { ...prev };
      });
      connectionCtx.setImagingSession((prev) => {
        prev["endRecording"] = false;
        return { ...prev };
      });
      connectionCtx.setImagingSession((prev) => {
        prev["isStackedCountStart"] = false;
        return { ...prev };
      });
      saveImagingSessionDb("isRecording", true.toString());
      saveImagingSessionDb("endRecording", false.toString());
      saveImagingSessionDb("isStackedCountStart", false.toString());
      saveImagingSessionDb("startTime", now.toString());

      //startAstroPhotoHandler

      console.debug(
        "startAstroPhotoHandler current ST:",
        testTimer,
        connectionCtx
      );
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
        if (
          result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_CAPTURE_RAW_LIVE_STACKING
        ) {
          if (
            result_data.data.code ==
            Dwarfii_Api.DwarfErrorCode.CODE_ASTRO_NEED_GOTO
          ) {
            console.error("Capture Need Goto");
            console.debug("Capture Need Goto ", {}, connectionCtx);
            return false;
          } else if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
            console.error("Capture error:", result_data.data.code);
            console.debug("Start Capture error", {}, connectionCtx);
            endImagingSession();
            return false;
          } else {
            console.debug("Start Capture ok", {}, connectionCtx);
          }
        } else {
          console.debug("", result_data, connectionCtx);
        }
        console.debug(txt_info, result_data, connectionCtx);
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
        [Dwarfii_Api.DwarfCMD.CMD_ASTRO_START_CAPTURE_RAW_LIVE_STACKING],
        customMessageHandler
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
      if (
        result_data.cmd ==
        Dwarfii_Api.DwarfCMD.CMD_ASTRO_STOP_CAPTURE_RAW_LIVE_STACKING
      ) {
        if (result_data.data.code != Dwarfii_Api.DwarfErrorCode.OK) {
          console.debug("Stop Capture error", {}, connectionCtx);
        } else {
          console.debug("Stop Capture ok", {}, connectionCtx);
        }
        endImagingSession();
      } else {
        console.debug("", result_data, connectionCtx);
      }
      console.debug(txt_info, result_data, connectionCtx);
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
      [Dwarfii_Api.DwarfCMD.CMD_ASTRO_STOP_CAPTURE_RAW_LIVE_STACKING],
      customMessageHandler
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
          console.debug("Go Live error", {}, connectionCtx);
        } else {
          console.debug("Go Live ok", {}, connectionCtx);
        }
        saveImagingSessionDb("goLive", false.toString());
        saveImagingSessionDb("endRecording", false.toString());
      } else {
        console.debug("", result_data, connectionCtx);
      }
      console.debug(txt_info, result_data, connectionCtx);
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
      customMessageHandler
    );

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
  }

  function endImagingSession() {
    let testTimer: string | any = "";
    if (timerSession) {
      testTimer = timerSession.toString();
      console.debug(
        "ImagingSession tS clearInterval:",
        testTimer,
        connectionCtx
      );
    }
    if (timerGlobal) {
      testTimer = timerGlobal.toString();
      console.debug(
        "ImagingSession tG clearInterval:",
        testTimer,
        connectionCtx
      );
    }
    // timerSession if Photos Session is completed !
    if (timerSession) clearInterval(timerSession);
    if (timerGlobal) clearInterval(timerGlobal);
    timerSessionInit = false;
    if (connectionCtx.imagingSession.isRecording) {
      connectionCtx.setImagingSession((prev) => {
        prev["isRecording"] = false;
        return { ...prev };
      });
    }
    if (connectionCtx.imagingSession.endRecording) {
      connectionCtx.setImagingSession((prev) => {
        prev["endRecording"] = true;
        return { ...prev };
      });
    }
    saveImagingSessionDb("isRecording", false.toString());
    saveImagingSessionDb("endRecording", true.toString());
  }

  function endPreview() {
    saveImagingSessionDb("endRecording", false.toString());
    if (connectionCtx.imagingSession.endRecording) {
      connectionCtx.setImagingSession((prev) => {
        prev["endRecording"] = false;
        return { ...prev };
      });
    }
    saveImagingSessionDb("isGoLive", false.toString());
    if (connectionCtx.imagingSession.isGoLive) {
      connectionCtx.setImagingSession((prev) => {
        prev["isGoLive"] = false;
        return { ...prev };
      });
    }
    connectionCtx.setImagingSession({} as ImagingSession);
    removeImagingSessionDb();
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
          console.debug("Focus error", {}, connectionCtx);
        } else {
          console.debug("Focus ok", {}, connectionCtx);
        }
      } else {
        console.debug("", result_data, connectionCtx);
      }
      console.debug(txt_info, result_data, connectionCtx);
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
      customMessageHandler
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
      if (
        connectionCtx.imagingSession.isRecording &&
        !connectionCtx.imagingSession.endRecording
      ) {
        console.log("Record Button3");
        return (
          <RecordingButton
            onClick={stopAstroPhotoHandler}
            color_stroke={"red"}
            title="Stop Recording"
          />
        );
      } else if (connectionCtx.imagingSession.isGoLive) {
        console.log("Record Button5");
        // Live Button is on
        return (
          <RecordButton
            onClick={() => {
              goLiveHandler();
              endPreview();
            }}
            title="End Current Session"
          />
        );
      } else if (connectionCtx.imagingSession.endRecording) {
        console.log("Record Button4");
        return (
          <RecordingButton
            onClick={() => {
              goLiveHandler();
              endPreview();
            }}
            color_stroke={"currentColor"}
            title="Wait till the End of Stacking"
          />
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
  function anim_close() {
    const joystickContainer = document.querySelector(
      ".joystick-container"
    ) as HTMLElement;
    // Check if the element is found
    if (joystickContainer) {
      const animationDuration = 500; // 0.5 seconds
      const start = performance.now();

      const animateHide = (timestamp) => {
        const elapsed = timestamp - start;
        const opacity = 1 - elapsed / animationDuration;

        joystickContainer.style.opacity = opacity.toString();

        if (opacity > 0) {
          requestAnimationFrame(animateHide);
        } else {
          joystickContainer.style.display = "none";
        }
      };
      requestAnimationFrame(animateHide);
    }
  }

  return (
    <ul className="nav nav-pills flex-column mb-auto border">
      <li className={`nav-item ${styles.box}`}>
        {!showModal && (
          <Link
            href="#"
            className=""
            onClick={() => {
              setShowModal(true);
            }}
          >
            Astro
          </Link>
        )}
        {showModal && (
          <Link
            href="#"
            className=""
            onClick={() => {
              setShowModal(false);
              anim_close();
            }}
          >
            Photo
          </Link>
        )}
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
        {!showWideAngle && (
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
        {showWideAngle && (
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
      {!connectionCtx.imagingSession.isRecording &&
        connectionCtx.imagingSession.isGoLive && (
          <li className={`nav-item ${styles.box}`}>
            <Link
              href="#"
              className=""
              onClick={() => {
                goLiveHandler();
                endPreview();
              }}
              title="End Current Session"
            >
              Live
            </Link>
          </li>
        )}
      <hr />
      {!connectionCtx.imagingSession.isRecording &&
        !connectionCtx.imagingSession.endRecording &&
        !astroFocus && (
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
      {!connectionCtx.imagingSession.isRecording &&
        !connectionCtx.imagingSession.endRecording &&
        astroFocus && (
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
      {!connectionCtx.imagingSession.isRecording &&
        !connectionCtx.imagingSession.endRecording && (
          <li className={`nav-item ${styles.box}`}>
            <Link
              href="#"
              className=""
              onClick={focusPlus}
              title="Focus + Click"
            >
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
      {!connectionCtx.imagingSession.isRecording &&
        !connectionCtx.imagingSession.endRecording && (
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
      {!connectionCtx.imagingSession.isRecording &&
        !connectionCtx.imagingSession.endRecording && (
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
      {!connectionCtx.imagingSession.isRecording &&
        !connectionCtx.imagingSession.endRecording && (
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
      <CameraAddOn showModal={showModal} />
    </ul>
  );
}
