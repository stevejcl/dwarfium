import { useState, useContext, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { getExposureIndexByName, getGainIndexByName } from "@/lib/data_utils";
import { saveLoggerViewDb, savePiPViewDb } from "@/db/db_utils";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import {
  calibrationHandler,
  stopGotoHandler,
  shutDownHandler,
  savePositionHandler,
  gotoPositionHandler,
  RingLightsHandlerFn,
  PowerLightsHandlerFn,
  dwarfResetMotorHandlerFn,
  polarAlignHandlerFn,
  polarAlignPositionHandlerFn,
} from "@/lib/goto_utils";
import {
  turnOnTeleCameraFn,
  updateTelescopeISPSetting,
} from "@/lib/dwarf_utils";
import eventBus from "@/lib/event_bus";
import { AstroObject } from "@/types";
import GotoModal from "../astroObjects/GotoModal";

type Message = {
  [k: string]: string;
};
type CalibrationDwarfPropType = {
  setModule: Dispatch<SetStateAction<string | undefined>>;
  setErrors: Dispatch<SetStateAction<string | undefined>>;
  setSuccess: Dispatch<SetStateAction<string | undefined>>;
};

export default function CalibrationDwarf(props: CalibrationDwarfPropType) {
  const { setModule, setErrors, setSuccess } = props;

  let connectionCtx = useContext(ConnectionContext);
  //const [errors, setErrors] = useState<string | undefined>();
  //const [success, setSuccess] = useState<string | undefined>();
  const [position, setPosition] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [gotoMessages, setGotoMessages] = useState<Message[]>([] as Message[]);
  const [showPolarAlign, setShowPolarAlign] = useState(false);
  //const prevErrors = usePrevious(errors);
  //const prevSuccess = usePrevious(success);

  useEffect(() => {
    eventBus.on("clearErrors", () => {
      setErrors(undefined);
    });
    eventBus.on("clearSuccess", () => {
      setSuccess(undefined);
    });
  }, []);

  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  function calibrateFn() {
    setModule(t("cCalibrationDwarfLogProcessCalibration"));
    setShowModal(connectionCtx.loggerView);
    initCamera();
    setTimeout(() => {
      calibrationHandler(connectionCtx, setErrors, setSuccess, (options) => {
        setGotoMessages((prev) => prev.concat(options));
      });
    }, 7000);
  }

  function stopGotoFn() {
    setModule(t("cCalibrationDwarfLogProcessStopGoto"));
    setShowModal(connectionCtx.loggerView);
    stopGotoHandler(connectionCtx, setErrors, setSuccess, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function dwarfResetMotorFn() {
    setModule(t("cMotorResetProcess"));
    let polarAlign = false;
    setShowModal(connectionCtx.loggerView);
    dwarfResetMotorHandlerFn(
      polarAlign,
      connectionCtx,
      setErrors,
      setSuccess,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }

  function polarAlignFn() {
    setModule(t("cPolarAlignProcess"));
    setShowModal(connectionCtx.loggerView);
    polarAlignHandlerFn(connectionCtx, setErrors, setSuccess, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function polarAlignMode90Fn() {
    setModule(t("cLensAlignProcess"));
    setShowModal(connectionCtx.loggerView);
    polarAlignPositionHandlerFn(
      1,
      connectionCtx,
      setErrors,
      setSuccess,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }

  function polarAlignMode0Fn() {
    setModule(t("cLensAlignProcess"));
    setShowModal(connectionCtx.loggerView);
    polarAlignPositionHandlerFn(
      0,
      connectionCtx,
      setErrors,
      setSuccess,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }

  function polarAlignTurnDownFn() {
    setModule(t("cLensTurnDownProcess"));
    setShowModal(connectionCtx.loggerView);
    polarAlignPositionHandlerFn(
      2,
      connectionCtx,
      setErrors,
      setSuccess,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }
  function savePositionFn() {
    savePositionHandler(
      connectionCtx,
      setPosition,
      t("cCalibrationDwarfRecordedPosition"),
      t("cCalibrationDwarfNoPosition")
    );
  }

  function resetPositionFn() {
    connectionCtx.setIsSavedPosition(false);
    setPosition(t("cCalibrationDwarfNoPosition"));
  }

  function gotoPositionFn() {
    setModule(t("cCalibrationDwarfLogProcessGotoPosition"));
    gotoPositionHandler(
      connectionCtx,
      setPosition,
      setErrors,
      setSuccess,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      },
      t("cCalibrationDwarfInitialPosition"),
      t("cCalibrationDwarfNoPosition")
    );
  }

  function RingLightsOffFn() {
    setModule(t("cCalibrationDwarfLogProcessRingLightsOff"));
    setShowModal(connectionCtx.loggerView);
    RingLightsHandlerFn(true, connectionCtx, setErrors, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function RingLightsOnFn() {
    setModule(t("cCalibrationDwarfLogProcessRingLightsOn"));
    setShowModal(connectionCtx.loggerView);
    RingLightsHandlerFn(false, connectionCtx, setErrors, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function PowerLightsOffFn() {
    setModule(t("cCalibrationDwarfLogProcessPowerLightsOff"));
    setShowModal(connectionCtx.loggerView);
    PowerLightsHandlerFn(true, connectionCtx, setErrors, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function PowerLightsOnFn() {
    setModule(t("cCalibrationDwarfLogProcessPowerLightsOn"));
    setShowModal(connectionCtx.loggerView);
    PowerLightsHandlerFn(false, connectionCtx, setErrors, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function shutDownFn() {
    setModule(t("cCalibrationDwarfLogProcessShutDown"));
    setShowModal(connectionCtx.loggerView);
    shutDownHandler(false, connectionCtx, setErrors, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function rebootFn() {
    setModule(t("cCalibrationDwarfLogProcessReboot"));
    setShowModal(connectionCtx.loggerView);
    shutDownHandler(true, connectionCtx, setErrors, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function toggleLogger() {
    if (connectionCtx.loggerView) {
      saveLoggerViewDb("false");
    } else {
      saveLoggerViewDb("true");
    }

    connectionCtx.setLoggerView((prev) => !prev);
  }

  function togglePiP() {
    if (connectionCtx.PiPView) {
      savePiPViewDb("false");
    } else {
      savePiPViewDb("true");
    }

    connectionCtx.setPiPView((prev) => !prev);
  }

  function togglePolarAlignAction() {
    setShowPolarAlign(!showPolarAlign);
  }

  function initCamera() {
    {
      setTimeout(() => {
        turnOnTeleCameraFn(connectionCtx);
      }, 1000);
      setTimeout(() => {
        updateTelescopeISPSetting("gainMode", 1, connectionCtx);
      }, 1500);
      setTimeout(() => {
        updateTelescopeISPSetting("exposureMode", 1, connectionCtx);
      }, 2000);
      setTimeout(() => {
        updateTelescopeISPSetting(
          "gain",
          getGainIndexByName("80"),
          connectionCtx
        );
      }, 2500);
      setTimeout(() => {
        updateTelescopeISPSetting(
          "exposure",
          getExposureIndexByName("1"),
          connectionCtx
        );
      }, 3500);
      setTimeout(() => {
        updateTelescopeISPSetting("IR", 0, connectionCtx);
      }, 4500);
    }
  }

  function showStatusRingLightsDwarf() {
    if (connectionCtx.statusRingLightsDwarf)
      return (
        <button
          className={`btn ${
            connectionCtx.connectionStatus ? "btn-lights" : "btn-lights"
          } me-2 mt-3`}
          onClick={RingLightsOffFn}
          disabled={!connectionCtx.connectionStatus}
        >
          {t("cCalibrationDwarfLights")}
          <br />
          {t("cCalibrationDwarfRingOn")}
        </button>
      );
    else
      return (
        <button
          className={`btn ${
            connectionCtx.connectionStatus ? "btn-more03" : "btn-more03"
          } me-2 mt-3`}
          onClick={RingLightsOnFn}
          disabled={!connectionCtx.connectionStatus}
        >
          {t("cCalibrationDwarfLights")}
          <br />
          {t("cCalibrationDwarfRingOff")}
        </button>
      );
  }

  function showStatusPowerLightsDwarf() {
    if (connectionCtx.statusPowerLightsDwarf)
      return (
        <button
          className={`btn ${
            connectionCtx.connectionStatus ? "btn-lights" : "btn-lights"
          } me-2 mt-3`}
          onClick={PowerLightsOffFn}
          disabled={
            !connectionCtx.connectionStatus ||
            connectionCtx.statusRingLightsDwarf === undefined
          }
        >
          {t("cCalibrationDwarfLights")}
          <br />
          {t("cCalibrationDwarfPowerOn")}
        </button>
      );
    else
      return (
        <button
          className={`btn ${
            connectionCtx.connectionStatus ? "btn-more03" : "btn-more03"
          } me-2 mt-3`}
          onClick={PowerLightsOnFn}
          disabled={
            !connectionCtx.connectionStatus ||
            connectionCtx.statusPowerLightsDwarf === undefined
          }
        >
          {t("cCalibrationDwarfLights")}
          <br />
          {t("cCalibrationDwarfPowerOff")}
        </button>
      );
  }

  return (
    <>
      <h2>{t("cCalibrationDwarfTitle")}</h2>

      <p>
        {t("cCalibrationDwarfTitleDesc")}
        <br />
        <span className="text-danger">
          <b> {t("cCalibrationDwarfWarning")} </b>
        </span>
        {t("cCalibrationDwarfWarningDesc")}
      </p>
      <br />

      <div className="row mb-3">
        <div className="col-sm-1 nav nav-pills">
          <div
            title="Show Logs"
            className={`daily-horp nav nav-pills nav-item nav-link rounded-pill ${
              connectionCtx.loggerView ? "active" : ""
            }  me-2 mb-0`}
            onClick={toggleLogger}
          >
            <i className="bi bi-info-square"></i>
          </div>
          <div
            title="Show Camera Preview"
            className={`daily-horp nav nav-pills nav-item nav-link rounded-pill ${
              connectionCtx.PiPView ? "active" : ""
            }  me-2 mb-0`}
            onClick={togglePiP}
          >
            <i className="bi bi-pip" aria-hidden="true"></i>
          </div>
        </div>
        <div className="col-sm-2-cal">
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
            } me-2 mt-3`}
            onClick={calibrateFn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("CCalibrationDwarfCalibrate")}
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
            } me-2 mt-3`}
            onClick={stopGotoFn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cCalibrationDwarfStopGoto")}
          </button>
        </div>
        <div className="col-sm-5">
          <button
            className={`btn ${
              connectionCtx.connectionStatus && connectionCtx.savePositionStatus
                ? "btn-more02"
                : "btn-more02"
            } me-2 mt-3`}
            onClick={savePositionFn}
            disabled={
              !connectionCtx.connectionStatus &&
              !connectionCtx.savePositionStatus
            }
          >
            {t("cCalibrationDwarfSavePosition")}
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus && connectionCtx.isSavedPosition
                ? "btn-more02"
                : "btn-more02"
            }  me-2 mt-3`}
            onClick={resetPositionFn}
            disabled={
              !connectionCtx.connectionStatus && !connectionCtx.isSavedPosition
            }
          >
            {t("cCalibrationDwarfResetPosition")}
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus && connectionCtx.isSavedPosition
                ? "btn-more02"
                : "btn-more02"
            } mt-3`}
            onClick={gotoPositionFn}
            disabled={
              !connectionCtx.connectionStatus && !connectionCtx.isSavedPosition
            }
          >
            {t("cCalibrationDwarfGoToPosition")}
          </button>
        </div>
        <div className="col-sm-4-cal">
          {showStatusRingLightsDwarf()}
          {showStatusPowerLightsDwarf()}
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more03" : "btn-more03"
            } me-2 mt-3`}
            onClick={shutDownFn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cCalibrationDwarfShutdown")}
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more03" : "btn-more03"
            } me-2 mt-3`}
            onClick={rebootFn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cCalibrationDwarfReboot")}
          </button>
        </div>
      </div>
      <div>
        <div className="col-sm-8 mt-2">
          &nbsp; {position && <span className="text-success">{position}</span>}
        </div>
        {showPolarAlign && (
          <div className="polar-align-object">
            <button
              className={`btn ${
                connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
              } me-4 mt-5`}
              onClick={dwarfResetMotorFn}
              disabled={!connectionCtx.connectionStatus}
            >
              {t("cMotorResetAction")}
            </button>
            <button
              className={`btn ${
                connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
              } me-2 mt-5`}
              onClick={polarAlignFn}
              disabled={!connectionCtx.connectionStatus}
            >
              {t("cPolarAlignAction")}
            </button>
            <button
              className={`btn ${
                connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
              } me-2 mt-5`}
              onClick={polarAlignMode90Fn}
              disabled={!connectionCtx.connectionStatus}
            >
              {t("cPolarAlignTo90")}
            </button>
            <button
              className={`btn ${
                connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
              } me-2 mt-5`}
              onClick={polarAlignMode0Fn}
              disabled={!connectionCtx.connectionStatus}
            >
              {t("cPolarAlignInitial")}
            </button>
            <button
              className={`btn ${
                connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
              } me-2 mt-5`}
              onClick={polarAlignTurnDownFn}
              disabled={!connectionCtx.connectionStatus}
            >
              {t("cPolarAlignTurnDownLens")}
            </button>
          </div>
        )}
        {showPolarAlign && (
          <div className="connect-dwarf" title={t("cMotorActionHide")}>
            <button
              className={`btn ${
                connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
              } mb-4`}
              onClick={togglePolarAlignAction}
              disabled={!connectionCtx.connectionStatus}
            >
              {t(">")}
            </button>
          </div>
        )}
        {!showPolarAlign && (
          <div className="connect-dwarf" title={t("cMotorActionShow")}>
            <button
              className={`btn ${
                connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
              } mb-4`}
              onClick={togglePolarAlignAction}
              disabled={!connectionCtx.connectionStatus}
            >
              {t("<")}
            </button>
          </div>
        )}
        <GotoModal
          object={
            {
              displayName: "Calibration",
              ra: "",
              dec: "",
            } as AstroObject
          }
          showModal={showModal}
          setShowModal={setShowModal}
          messages={gotoMessages}
          setMessages={setGotoMessages}
        />
      </div>
    </>
  );
}
