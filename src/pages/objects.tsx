import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import i18n from "@/i18n";

import { useContext } from "react";

import GotoStellarium from "@/components/GotoStellarium";
import GotoLists from "@/components/GotoLists";
import GotoUserLists from "@/components/GotoUserLists";
import Asteroids from "@/components/Asteroids";
import StatusBar from "@/components/shared/StatusBar";
import CalibrationDwarf from "@/components/shared/CalibrationDwarf";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { fetchObjectFavoriteNamesDb } from "@/db/db_utils";

import ResizablePIP from "@/components/ResizablePIP";
import DwarfCameras from "@/components/DwarfCameras";

export default function Goto() {
  let connectionCtx = useContext(ConnectionContext);
  useSetupConnection();
  useLoadIntialValues();

  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [objectFavoriteNames, setObjectFavoriteNames] = useState<string[]>([]);
  const [errors, setErrors] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [module, setModule] = useState<string | undefined>();
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState<string | undefined>();
  const prevErrors = usePrevious(errors);
  const prevSuccess = usePrevious(success);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  // custom hook for getting previous value
  function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  useEffect(() => {
    // get objects lists from local storage on page load
    let favoriteNames = fetchObjectFavoriteNamesDb();
    if (favoriteNames) {
      setObjectFavoriteNames(favoriteNames);
    }
  }, []);

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

  return (
    <section className="daily-horp d-inline-block w-100">
      <div className="container">
        <br />
        <br />
        <br />
        <br />

        <StatusBar />
        <hr></hr>
        <CalibrationDwarf
          setModule={setModule}
          setErrors={setErrors}
          setSuccess={setSuccess}
        />
        <hr />
        <ul className=" nav nav-tabs mb-2">
          <li
            className={`nav-item nav-link ${
              connectionCtx.gotoType === "lists" ? "active" : ""
            }`}
            onClick={() => connectionCtx.setGotoType("lists")}
          >
            {t("pObjectsList")}
          </li>
          <li
            className={`nav-item nav-link ${
              connectionCtx.gotoType === "userLists" ? "active" : ""
            }`}
            onClick={() => connectionCtx.setGotoType("userLists")}
          >
            {t("pObjectsCustomsList")}
          </li>
          <li
            className={`nav-item nav-link ${
              connectionCtx.gotoType === "stellarium" ? "active" : ""
            }`}
            onClick={() => connectionCtx.setGotoType("stellarium")}
          >
            Stellarium
          </li>
          <li
            className={`nav-item nav-link ${
              connectionCtx.gotoType === "asteroids" ? "active" : ""
            }`}
            onClick={() => connectionCtx.setGotoType("asteroids")}
          >
            Asteroids
          </li>
        </ul>
        <hr />
        {connectionCtx.connectionStatus && connectionCtx.PiPView && (
          <div className="float-right-align">
            <ResizablePIP
              width={320}
              height={180}
              minConstraints={[320, 180]}
              maxConstraints={[1280, 720]}
            >
              <DwarfCameras
                showWideangle={false}
                useRawPreviewURL={false}
                showControls={false}
              />
            </ResizablePIP>
          </div>
        )}
        {connectionCtx.gotoType === "lists" && (
          <GotoLists
            objectFavoriteNames={objectFavoriteNames}
            setObjectFavoriteNames={setObjectFavoriteNames}
            setModule={setModule}
            setErrors={setErrors}
            setSuccess={setSuccess}
          ></GotoLists>
        )}
        {connectionCtx.gotoType === "stellarium" && (
          <GotoStellarium
            objectFavoriteNames={objectFavoriteNames}
            setObjectFavoriteNames={setObjectFavoriteNames}
            setModule={setModule}
            setErrors={setErrors}
            setSuccess={setSuccess}
          ></GotoStellarium>
        )}
        {connectionCtx.gotoType === "userLists" && (
          <GotoUserLists
            objectFavoriteNames={objectFavoriteNames}
            setObjectFavoriteNames={setObjectFavoriteNames}
            setModule={setModule}
            setErrors={setErrors}
            setSuccess={setSuccess}
          ></GotoUserLists>
        )}
        {connectionCtx.gotoType === "asteroids" && (
          <Asteroids
            setModule={setModule}
            setErrors={setErrors}
            setSuccess={setSuccess}
          ></Asteroids>
        )}
        <br />
        <br />
        <br />
        <br />
      </div>
      {isVisible && (prevErrors || errors || prevSuccess || success) && (
        <div
          className="slide-pane_from_bottom"
          style={{
            position: "fixed",
            bottom: "60px",
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
    </section>
  );
}
