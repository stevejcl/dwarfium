import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useState, useContext, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { AstroObject } from "@/types";
import { renderLocalRiseSetTime } from "@/lib/astro_utils";
import { centerHandler, startGotoHandler } from "@/lib/goto_utils";
import eventBus from "@/lib/event_bus";
import GotoModal from "./GotoModal";

type AstronomyObjectPropType = {
  object: AstroObject;
  setModule: Dispatch<SetStateAction<string | undefined>>;
  setErrors: Dispatch<SetStateAction<string | undefined>>;
  setSuccess: Dispatch<SetStateAction<string | undefined>>;
};
type Message = {
  [k: string]: string;
};
export default function PlanetObject(props: AstronomyObjectPropType) {
  const { object } = props;
  const { setModule, setErrors, setSuccess } = props;

  let connectionCtx = useContext(ConnectionContext);
  const [showModal, setShowModal] = useState(false);
  const [gotoMessages, setGotoMessages] = useState<Message[]>([] as Message[]);

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

  useEffect(() => {
    setModule(t("cCalibrationDwarfLogProcessSolarObject"));
    eventBus.on("clearErrors", () => {
      setErrors(undefined);
    });
    eventBus.on("clearSuccess", () => {
      setSuccess(undefined);
    });
  }, []);

  function renderRiseSetTime(object: AstroObject) {
    if (connectionCtx.latitude && connectionCtx.longitude) {
      // eslint-disable-next-line testing-library/render-result-naming-convention
      let timesObject = renderLocalRiseSetTime(
        object,
        connectionCtx.latitude,
        connectionCtx.longitude
      );

      if (timesObject?.error) {
        return <span>{timesObject.error}</span>;
      }

      if (timesObject) {
        return (
          <span>
            Rises: {timesObject.rise}, Sets: {timesObject.set}
          </span>
        );
      }
    }
  }

  function gotoFn() {
    let planet = -1;
    if (object.displayName === "Mercury") {
      planet = 1;
    } else if (object.displayName === "Venus") {
      planet = 2;
    } else if (object.displayName === "Mars") {
      planet = 3;
    } else if (object.displayName === "Jupiter") {
      planet = 4;
    } else if (object.displayName === "Saturn") {
      planet = 5;
    } else if (object.displayName === "Uranus") {
      planet = 6;
    } else if (object.displayName === "Neptune") {
      planet = 7;
    } else if (object.displayName === "Moon") {
      planet = 8;
    } else if (object.displayName === "Sun") {
      planet = 9;
    } else {
      planet = 7;
    }
    setShowModal(connectionCtx.loggerView);
    startGotoHandler(
      connectionCtx,
      setErrors,
      setSuccess,
      planet,
      undefined,
      undefined,
      object.displayName,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }

  return (
    <div className="border-bottom p-2">
      <h3 className="fs-5">{object.displayName}</h3>
      <div className="row">
        <div className="col-md-9">
          {/* {JSON.sdivingify(object)} */}
          Average magnitude: {object.magnitude}
          <br />
          {renderRiseSetTime(object)}
        </div>
        <div className="col-md-3">
          <button
            className={`btn ${
              connectionCtx.connectionStatusStellarium
                ? "btn btn-more02"
                : "btn-secondary"
            } me-2 mb-2`}
            onClick={() => centerHandler(object, connectionCtx, setErrors)}
            disabled={!connectionCtx.connectionStatusStellarium}
          >
            Center
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus
                ? "btn btn-more02"
                : "btn-secondary"
            } mb-2`}
            onClick={gotoFn}
            disabled={!connectionCtx.connectionStatus}
          >
            Goto
          </button>
          <br />
          <GotoModal
            object={object}
            showModal={showModal}
            setShowModal={setShowModal}
            messages={gotoMessages}
            setMessages={setGotoMessages}
          />
        </div>
      </div>
    </div>
  );
}
