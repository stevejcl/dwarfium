import { useState, useContext, useEffect, useRef } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import {
  polarAlignHandlerFn,
  polarAlignPositionHandlerFn,
} from "@/lib/goto_utils";

export default function PolarAlignDwarf() {
  let connectionCtx = useContext(ConnectionContext);
  const [errors, setErrors] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [module, setModule] = useState<string | undefined>();
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState<string | undefined>();
  const prevErrors = usePrevious(errors);
  const prevSuccess = usePrevious(success);

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

  function polarAlignFn() {
    setModule(t("cPolarAlignProcess"));
    polarAlignHandlerFn(connectionCtx, setErrors, setSuccess);
  }

  function polarAlignMode90Fn() {
    setModule(t("cPolarAlignProcess"));
    polarAlignPositionHandlerFn(1, connectionCtx, setErrors, setSuccess);
  }

  function polarAlignMode0Fn() {
    setModule(t("cPolarAlignProcess"));
    polarAlignPositionHandlerFn(0, connectionCtx, setErrors, setSuccess);
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm">
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
            } me-4 mt-3`}
            onClick={polarAlignFn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cPolarAlignAction")}
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
            } me-4 mt-3`}
            onClick={polarAlignMode90Fn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cPolarAlignTo90")}
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-more02"
            } me-2 mt-3`}
            onClick={polarAlignMode0Fn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cPolarAlignInitial")}
          </button>
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
