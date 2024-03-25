import { useState, useContext, useEffect, useRef } from "react";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { getExposureIndexByName, getGainIndexByName } from "@/lib/data_utils";

import {
  calibrationHandler,
  stopGotoHandler,
  shutDownHandler,
  savePositionHandler,
  gotoPositionHandler,
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

export default function CalibrationDwarf() {
  let connectionCtx = useContext(ConnectionContext);
  const [errors, setErrors] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [position, setPosition] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [gotoMessages, setGotoMessages] = useState<Message[]>([] as Message[]);
  const prevErrors = usePrevious(errors);
  const prevSuccess = usePrevious(success);

  useEffect(() => {
    eventBus.on("clearErrors", () => {
      setErrors(undefined);
    });
    eventBus.on("clearSuccess", () => {
      setSuccess(undefined);
    });
  }, []);

  // custom hook for getting previous value
  function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  function calibrateFn() {
    setShowModal(true);
    initCamera();
    setTimeout(() => {
      calibrationHandler(connectionCtx, setErrors, setSuccess, (options) => {
        setGotoMessages((prev) => prev.concat(options));
      });
    }, 7000);
  }

  function stopGotoFn() {
    setShowModal(true);
    stopGotoHandler(connectionCtx, setErrors, setSuccess, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function savePositionFn() {
    savePositionHandler(connectionCtx, setPosition);
  }

  function resetPositionFn() {
    connectionCtx.setIsSavedPosition(false);
    setPosition("No position has been recorded");
  }

  function gotoPositionFn() {
    gotoPositionHandler(
      connectionCtx,
      setPosition,
      setErrors,
      setSuccess,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }

  function shutDownFn() {
    setShowModal(true);
    shutDownHandler(false, connectionCtx, setErrors, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
  }

  function rebootFn() {
    setShowModal(true);
    shutDownHandler(true, connectionCtx, setErrors, (options) => {
      setGotoMessages((prev) => prev.concat(options));
    });
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

  return (
    <>
      <h2>Calibrate the Dwarf II</h2>

      <p>
        In order to use Astro function, you must calibrate the dwarf II first.
        <span className="text-danger">
          <b> WARNING: </b>
        </span>
        don&#39;t put anything on the lens at this moment (no filters holder).
      </p>

      <div className="row mb-3">
        <div className="col-sm-4">
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-primary" : "btn-secondary"
            } me-4 mb-2`}
            onClick={calibrateFn}
            disabled={!connectionCtx.connectionStatus}
          >
            Calibrate
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-primary" : "btn-secondary"
            } me-4 mb-2`}
            onClick={stopGotoFn}
            disabled={!connectionCtx.connectionStatus}
          >
            Stop Goto
          </button>
        </div>
        <div className="col-sm-4">
          <button
            className={`btn ${
              connectionCtx.connectionStatus && connectionCtx.savePositionStatus
                ? "btn-primary"
                : "btn-secondary"
            } me-4 mb-2`}
            onClick={savePositionFn}
            disabled={
              !connectionCtx.connectionStatus &&
              !connectionCtx.savePositionStatus
            }
          >
            Save Position
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus && connectionCtx.isSavedPosition
                ? "btn-primary"
                : "btn-secondary"
            }  me-4 mb-2`}
            onClick={resetPositionFn}
            disabled={
              !connectionCtx.connectionStatus && !connectionCtx.isSavedPosition
            }
          >
            Reset Position
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus && connectionCtx.isSavedPosition
                ? "btn-primary"
                : "btn-secondary"
            } mb-2`}
            onClick={gotoPositionFn}
            disabled={
              !connectionCtx.connectionStatus && !connectionCtx.isSavedPosition
            }
          >
            Goto Position
          </button>
        </div>
        <div className="col-sm-4 text-end">
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-primary" : "btn-secondary"
            } me-4 mb-2`}
            onClick={shutDownFn}
            disabled={!connectionCtx.connectionStatus}
          >
            Shutdown!
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-primary" : "btn-secondary"
            } mb-2`}
            onClick={rebootFn}
            disabled={!connectionCtx.connectionStatus}
          >
            Reboot!
          </button>
        </div>
      </div>
      <div>
        <div className="col-sm-8">
          {position && <span className="text-success">{position}</span>}
        </div>
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
        {prevErrors && <span className="text-danger">{prevErrors} </span>}
        {errors && errors != prevErrors && (
          <span className="text-danger">{errors} </span>
        )}
        {prevSuccess && <span className="text-success">{prevSuccess} </span>}
        {success && success != prevSuccess && (
          <span className="text-success">{success}</span>
        )}
      </div>
    </>
  );
}
