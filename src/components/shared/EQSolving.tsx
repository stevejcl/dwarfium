import { useState, useContext, useEffect, useRef } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { AstroEQSolvingResult } from "@/types";
import { EQSolvingHandlerFn, stopEQSolvingHandler } from "@/lib/goto_utils";

export default function EQSolvingDwarf() {
  let connectionCtx = useContext(ConnectionContext);
  const [errors, setErrors] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [module, setModule] = useState<string | undefined>();
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState<string | undefined>();
  const prevErrors = usePrevious(errors);
  const prevSuccess = usePrevious(success);
  const { azimuth_err, altitude_err } = connectionCtx.astroEQSolvingResult;

  // Local state to manage displayed results
  const [displayedResults, setDisplayedResults] =
    useState<AstroEQSolvingResult>({
      azimuth_err: undefined,
      altitude_err: undefined,
    });

  // Update displayed results whenever the context values change
  useEffect(() => {
    setDisplayedResults({
      azimuth_err,
      altitude_err,
    });
  }, [azimuth_err, altitude_err]);

  // custom hook for getting previous value
  function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  useEffect(() => {
    let new_message =
      (prevErrors ?? "") +
      (errors ?? "") +
      (prevSuccess ?? "") +
      (success ?? "");
    if (new_message != (message ?? "")) {
      setIsVisible(true);
      setMessage(new_message);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 30000);

      // Clear the timeout if new messages come in within the 10 seconds
      return () => clearTimeout(timer);
    }
  }, [prevErrors, errors, prevSuccess, success]);

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

  function EQSolvingFn() {
    setModule(t("cPolarAlignProcess"));
    EQSolvingHandlerFn(connectionCtx, setErrors, setSuccess);
  }

  function stopEQSolving() {
    setModule(t("cPolarAlignProcess"));
    stopEQSolvingHandler(connectionCtx, setErrors, setSuccess);
  }

  return (
    <div>
      <div className="row align-items-center ms-5 mt-2">
        <div className="col-sm-auto">
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
            } me-4 mt-3`}
            onClick={EQSolvingFn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cEQSolvingAction")}
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
            } me-4 mt-3`}
            onClick={stopEQSolving}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cEQSolvingStopAction")}
          </button>
        </div>
        <div className="col-sm">
          <div className="EQ-result d-flex flex-wrap">
            {displayedResults.azimuth_err !== undefined && (
              <div className="result-item">
                <span
                  className="d-inline-flex align-items-center justify-content-center bg-light border rounded-circle p-2"
                  style={{ width: "25px", height: "25px" }}
                >
                  {displayedResults.azimuth_err > 0 ? (
                    <i className="bi bi-arrow-clockwise text-success"></i>
                  ) : (
                    <i className="bi bi-arrow-counterclockwise text-danger"></i>
                  )}
                </span>
                <span className="value ms-1">
                  {Math.abs(displayedResults.azimuth_err).toFixed(2)}°
                </span>
                <span> : {t("cEQSolvingAzimuthResult")}</span>
              </div>
            )}

            {displayedResults.altitude_err !== undefined && (
              <div className="result-item">
                <span
                  className="d-inline-flex align-items-center justify-content-center bg-light border rounded-circle p-2"
                  style={{ width: "25px", height: "25px" }}
                >
                  {displayedResults.altitude_err > 0 ? (
                    <i className="bi bi-arrow-up text-success"></i>
                  ) : (
                    <i className="bi bi-arrow-down text-danger"></i>
                  )}
                </span>
                <span className="value ms-1">
                  {Math.abs(displayedResults.altitude_err).toFixed(2)}°
                </span>
                <span> : {t("cEQSolvingAltitudeResult")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {isVisible && (prevErrors || errors || prevSuccess || success) && (
        <div
          className="slide-pane_from_bottom"
          style={{
            position: "fixed",
            bottom: "65px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "fit-content",
            height: "30px",
            paddingTop: "5px",
            paddingBottom: "20px",
            paddingLeft: "50px",
            paddingRight: "50px",
            color: "rgb(0, 0, 0)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          {module && (
            <span>
              <b> {module} </b>{" "}
            </span>
          )}
          {prevErrors && (
            <span className="text-danger">
              <b>{prevErrors} </b>
            </span>
          )}
          {errors && errors != prevErrors && (
            <span className="text-danger">
              <b>{errors} </b>
            </span>
          )}
          {prevSuccess && (
            <span className="text-success">
              <b>{prevSuccess} </b>
            </span>
          )}
          {success && success != prevSuccess && (
            <span className="text-success">
              <b>{success} </b>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
