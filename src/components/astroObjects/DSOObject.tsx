import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useState, useContext, useEffect, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { AstroObject } from "@/types";
import {
  renderLocalRiseSetTime,
  computeRaDecToAltAz,
  convertAzToCardinal,
} from "@/lib/astro_utils";
import { centerHandler, startGotoHandler } from "@/lib/goto_utils";
import eventBus from "@/lib/event_bus";
import {
  convertHMSToDecimalDegrees,
  convertDMSToDecimalDegrees,
} from "@/lib/math_utils";
import { toIsoStringInLocalTime } from "@/lib/date_utils";
import { saveObjectFavoriteNamesDb } from "@/db/db_utils";

import GotoModal from "./GotoModal";

type AstronomyObjectPropType = {
  object: AstroObject;
  objectFavoriteNames: string[];
  setObjectFavoriteNames: Dispatch<SetStateAction<string[]>>;
  setModule: Dispatch<SetStateAction<string | undefined>>;
  setErrors: Dispatch<SetStateAction<string | undefined>>;
  setSuccess: Dispatch<SetStateAction<string | undefined>>;
};
type Message = {
  [k: string]: string;
};
export default function DSOObject(props: AstronomyObjectPropType) {
  const { object, objectFavoriteNames, setObjectFavoriteNames } = props;
  const { setModule, setErrors, setSuccess } = props;
  let connectionCtx = useContext(ConnectionContext);
  const [showModal, setShowModal] = useState(false);
  const [gotoMessages, setGotoMessages] = useState<Message[]>([] as Message[]);
  const [forceFavoriteUpdate, setForceFavoriteUpdate] = useState(false);

  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  setModule(t("cCalibrationDwarfLogProcessAstroObject"));

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    eventBus.on("clearErrors", () => {
      setErrors(undefined);
    });
    eventBus.on("clearSuccess", () => {
      setSuccess(undefined);
    });
  }, [forceFavoriteUpdate]);

  const [forceUpdate, setForceUpdate] = useState(false);

  // Recalculate all data
  const handleRefreshClick = () => {
    setForceUpdate((prev) => !prev);
  };

  // Reactualize Object
  const handleFavoriteClick = () => {
    let updatedListsNames;
    if (object.favorite) {
      object.favorite = false;
      if (!objectFavoriteNames) updatedListsNames.push(object.displayName);
      else
        updatedListsNames = objectFavoriteNames.filter(
          (name) => name != object.displayName
        );
      setObjectFavoriteNames(updatedListsNames);
      saveObjectFavoriteNamesDb(updatedListsNames.join("|"));
    } else {
      object.favorite = true;
      updatedListsNames = objectFavoriteNames
        .concat(object.displayName)
        .join("|");
      saveObjectFavoriteNamesDb(updatedListsNames);
      setObjectFavoriteNames(objectFavoriteNames.concat(object.displayName));
    }
    setForceFavoriteUpdate((prev) => !prev);
  };

  // Memorize the calculated data using useMemo
  const riseSetTime = useMemo(() => renderRiseSetTime(), [forceUpdate]);
  const altAz = useMemo(
    () => renderAltAz(),
    [forceUpdate, connectionCtx.visibleSkyLimit]
  );
  const raDec = useMemo(() => renderRADec(), [forceUpdate]);

  function renderRiseSetTime() {
    if (connectionCtx.latitude && connectionCtx.longitude) {
      let times = renderLocalRiseSetTime(
        object,
        connectionCtx.latitude,
        connectionCtx.longitude
      );

      if (times?.error) {
        return <span>{t(times.error)}</span>;
      }

      if (times) {
        return (
          <span>
            {t("cObjectsRises")}: {times.rise}, {t("cObjectsSets")}: {times.set}
          </span>
        );
      }
    }
  }

  function renderAltAz() {
    let raDecimal: undefined | number;
    let decDecimal: undefined | number;
    if (object.ra) {
      raDecimal = convertHMSToDecimalDegrees(object.ra);
    }
    if (object.dec) {
      decDecimal = convertDMSToDecimalDegrees(object.dec);
    }

    if (
      connectionCtx.latitude &&
      connectionCtx.longitude &&
      raDecimal &&
      decDecimal
    ) {
      let today = new Date();

      let results = computeRaDecToAltAz(
        connectionCtx.latitude,
        connectionCtx.longitude,
        raDecimal,
        decDecimal,
        toIsoStringInLocalTime(today),
        connectionCtx.timezone
      );

      let visibility = false;

      // Verify SkyLimit test Cardinal
      if (results && connectionCtx.visibleSkyLimitTarget) {
        const targets = Array.isArray(connectionCtx.visibleSkyLimitTarget)
          ? connectionCtx.visibleSkyLimitTarget
          : [connectionCtx.visibleSkyLimitTarget]; // Wrap single object in an array if it's not already an array

        let notPresentInDirection = true;
        for (const target of targets) {
          if (
            target &&
            typeof target === "object" &&
            "number" in target &&
            "directions" in target
          ) {
            const isInTargetDirections = target.directions.includes(
              convertAzToCardinal(results.az)
            );
            if (isInTargetDirections) notPresentInDirection = false;
            if (results.alt >= target.number && isInTargetDirections) {
              visibility = true;
              break; // Exit loop early if visibility is set to true
            }
          }
        }
        // case where Current direction is not Limited (not Present)
        object.visible = visibility;
        if (notPresentInDirection && results.alt >= 0) object.visible = true;
      }

      if (results) {
        return (
          <span>
            Alt: {results.alt.toFixed(0)}°, Az: {results.az.toFixed(0)}°{" "}
            {convertAzToCardinal(results.az)}
          </span>
        );
      }
    }
  }

  function renderRADec() {
    if (
      connectionCtx.latitude &&
      connectionCtx.longitude &&
      object.ra &&
      object.dec
    ) {
      return (
        <span>
          RA: {object.ra}, Dec: {object.dec}
        </span>
      );
    }
  }

  function gotoFn() {
    setShowModal(connectionCtx.loggerView);
    startGotoHandler(
      connectionCtx,
      setErrors,
      setSuccess,
      undefined,
      object.ra,
      object.dec,
      object.displayName,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }

  function saveData() {
    connectionCtx.setSaveAstroData(object);
  }

  return (
    <div className="border-bottom p-2">
      <h3 className="fs-5 mb-0">
        {!object.favorite && (
          <button className="btn-refresh" onClick={handleFavoriteClick}>
            <i className="bi bi-heart" aria-hidden="true"></i>
          </button>
        )}
        {object.favorite && (
          <button className="btn-refresh" onClick={handleFavoriteClick}>
            <i className="bi bi-heart-fill" aria-hidden="true"></i>
          </button>
        )}{" "}
        {object.displayName}
      </h3>
      <div className="mb-2">{object.alternateNames}</div>
      <div className="row">
        <div className="col-md-4">
          {t(object.type)}{" "}
          {object.constellation && t("cObjectsIn") + t(object.constellation)}
          <br />
          {t("cObjectsSize")}: {object.size}
          <br />
          {t("cObjectsMagnitude")}: {object.magnitude}
        </div>
        <div className="col-md-5">
          {riseSetTime}
          <br></br>
          {altAz}{" "}
          <button className="btn-refresh" onClick={handleRefreshClick}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
          </button>
          <br></br>
          {raDec}
        </div>
        <div className="col-md-3">
          <button
            className={`btn ${
              connectionCtx.connectionStatusStellarium
                ? "btn-more02"
                : "btn-secondary"
            } me-2 mb-2`}
            onClick={() => centerHandler(object, connectionCtx, setErrors)}
            disabled={!connectionCtx.connectionStatusStellarium}
          >
            {t("cObjectsCenter")}
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-secondary"
            } me-4 mb-2`}
            onClick={gotoFn}
            disabled={!connectionCtx.connectionStatus}
          >
            {t("cObjectsGoto")}
          </button>
          <button
            className={`btn btn-more02 me-2 mb-2`}
            onClick={saveData}
            disabled={
              !connectionCtx.saveAstroData ||
              object.displayName == connectionCtx.saveAstroData.displayName
            }
          >
            {t("cObjectsCopyData")}
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
