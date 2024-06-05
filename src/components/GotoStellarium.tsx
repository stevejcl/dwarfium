/* eslint react/no-unescaped-entities: 0 */

import { useContext, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { statusPath, parseStellariumData } from "@/lib/stellarium_utils";
import { AstroObject, ParsedStellariumData } from "@/types";
import {
  startGotoHandler,
  stellariumErrorHandler,
  centerCoordinatesHandler,
} from "@/lib/goto_utils";
import {
  padNumber,
  convertDMSToDwarfDec,
  convertHMSToDwarfRA,
  convertHMSToDecimalHours,
  convertDecimalHoursToHMS,
  convertDMSToDecimalDegrees,
  convertDecimalDegreesToDMS,
} from "@/lib/math_utils";
import GotoModal from "./astroObjects/GotoModal";
import ImportManualModal from "./ImportManualModal";

type Message = {
  [k: string]: string;
};
export default function ManualGoto() {
  let connectionCtx = useContext(ConnectionContext);
  const [errors, setErrors] = useState<string | undefined>();
  const [gotoErrors, setGotoErrors] = useState<string | undefined>();
  const [gotoSuccess, setGotoSuccess] = useState<string | undefined>();
  const [RA, setRA] = useState<string | undefined>();
  const [declination, setDeclination] = useState<string | undefined>();
  const [objectName, setObjectName] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [gotoMessages, setGotoMessages] = useState<Message[]>([] as Message[]);
  const prevErrors = usePrevious(gotoErrors);
  const prevSuccess = usePrevious(gotoSuccess);

  // custom hook for getting previous value
  function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  function noObjectSelectedHandler() {
    setErrors("You must select an object in Stellarium.");
    setRA(undefined);
    setDeclination(undefined);
    setObjectName(undefined);
  }

  function validDataHandler(objectData: ParsedStellariumData) {
    let parsedRA = convertHMSToDwarfRA(objectData.RA);
    if (parsedRA) {
      setRA(parsedRA);
    } else {
      setErrors("Invalid RA: " + objectData.RA);
    }

    let parsedDeclination = convertDMSToDwarfDec(objectData.declination);
    if (parsedDeclination) {
      setDeclination(parsedDeclination);
    } else {
      setErrors("Invalid declination: " + objectData.declination);
    }

    setObjectName(objectData.objectName);
  }

  function resetData() {
    setErrors(undefined);
    setGotoErrors(undefined);
    setGotoSuccess(undefined);
    setDeclination(undefined);
    setRA(undefined);
  }

  function fetchStellariumData() {
    resetData();
    console.log("start fetchStellariumData...");

    let url = connectionCtx.urlStellarium;
    if (url) {
      fetch(`${url}${statusPath}`, {
        signal: AbortSignal.timeout(2000),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              noObjectSelectedHandler();
            } else {
              setErrors("Error when connecting to Stellarium");
            }
            return;
          }

          return response.json();
        })
        .then((data) => {
          if (data.selectioninfo === "") {
            noObjectSelectedHandler();
          } else {
            const objectData = parseStellariumData(data.selectioninfo);
            console.log(objectData);
            if (objectData) {
              validDataHandler(objectData);
            }
          }
        })
        .catch((err) => stellariumErrorHandler(err, setGotoErrors));
    } else {
      setErrors("App is not connect to Stellarium.");
    }
  }

  function changeCoordinate(RA_dif: number = 0, dec_diff: number = 0) {
    let RA_number = 0;

    if (RA_dif) {
      if (RA) RA_number = convertHMSToDecimalHours(RA);
      let new_RA = RA_number + RA_dif;
      let { hour, minute, second } = convertDecimalHoursToHMS(new_RA);
      setRA(`${hour}h ${minute}m ${second}s`);
    }
    if (dec_diff) {
      let declination_number = declination
        ? convertDMSToDecimalDegrees(declination!)
        : 0;
      let new_dec = declination_number + dec_diff;
      let { degree, minute, second, negative } =
        convertDecimalDegreesToDMS(new_dec);
      let secondParts = second.toString().split(".");
      let secondStr = padNumber(Number(secondParts[0]));
      if (secondParts[1]) {
        secondStr = secondStr + "." + secondParts[1];
      }
      let newDec = `${padNumber(degree)}° ${padNumber(minute)}' ${secondStr}"`;

      setDeclination(negative ? "-" + newDec : "+" + newDec);
    }
  }

  function importManualData() {
    setShowImportModal(true);
  }

  function gotoFn() {
    setShowModal(connectionCtx.loggerView);

    startGotoHandler(
      connectionCtx,
      setGotoErrors,
      setGotoSuccess,
      undefined,
      RA,
      declination,
      objectName,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }

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

  return (
    <div>
      {!connectionCtx.connectionStatusStellarium && (
        <p className="text-danger">{t("cGoToStellariumConnectStellarium")}</p>
      )}
      {!connectionCtx.connectionStatus && (
        <p className="text-danger">{t("cGoToListConnectDwarf")}</p>
      )}

      <p>{t("cGoToStellariumPickObject")}</p>
      <ol>
        <li>{t("cGoToStellariumListTitle")}</li>
        <li>{t("cGoToStellariumList1")}</li>
        <li>{t("cGoToStellariumList2")}</li>
      </ol>
      <button
        className={`btn ${
          connectionCtx.connectionStatusStellarium
            ? "btn btn-more02"
            : "btn-more02"
        } me-4 mb-3`}
        onClick={fetchStellariumData}
        disabled={!connectionCtx.connectionStatusStellarium}
      >
        {t("cGoToStellariumImportData")}
      </button>
      <button
        className={`btn btn btn-more02
        } me-4 mb-3`}
        onClick={importManualData}
      >
        {objectName && t("cGoToStellariumImportModifyData")} {!objectName && t("cGoToStellariumImportManualData")}
      </button>
      {errors && <p className="text-danger">{errors}</p>}
      <div className="row mb-3">
        <div className="col-sm-4">{t("pLatitude")}</div>
        <div className="col-sm-8">{connectionCtx.latitude}</div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-4">{t("pLongitude")}</div>
        <div className="col-sm-8">{connectionCtx.longitude}</div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-4">{t("cGoToStellariumObject")}</div>
        <div className="col-sm-8">{objectName}</div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-4">{t("cGoToStellariumRightAscension")}</div>
        <div className="col-sm-8">{RA}</div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-4">{t("cGoToStellariumDeclination")}</div>
        <div className="col-sm-8">{declination}</div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-4">
          <button
            className={`btn ${
              RA !== undefined ? "btn-more02" : "btn-more02"
            } me-4 mb-2`}
            onClick={gotoFn}
            disabled={!connectionCtx.connectionStatus || RA === undefined}
          >
            Goto
          </button>
        </div>
        <div className="col-sm-8">
          <button
            className={`btn ${
              RA !== undefined ? "btn-more02" : "btn-more02"
            } me-4 mb-4`}
            onClick={() =>
              centerCoordinatesHandler(
                RA,
                declination,
                connectionCtx,
                setErrors
              )
            }
            disabled={
              !connectionCtx.connectionStatusStellarium || RA === undefined
            }
          >
            {t("cGoToStellariumCenter")}
          </button>
          <button
            className={`btn ${
              RA !== undefined ? "btn-more02" : "btn-more02"
            } me-2 mb-4`}
            onClick={() => changeCoordinate(+1 / 60, 0)}
            disabled={RA === undefined}
          >
            RA + 1 min
          </button>
          <button
            className={`btn ${
              RA !== undefined ? "btn-more02" : "btn-more02"
            } me-2 mb-4`}
            onClick={() => changeCoordinate(-1 / 60, 0)}
            disabled={RA === undefined}
          >
            RA - 1 min
          </button>
          <button
            className={`btn ${
              RA !== undefined ? "btn-more02" : "btn-more02"
            } me-2 mb-4`}
            onClick={() => changeCoordinate(0, +0.1)}
            disabled={RA === undefined}
          >
            Dec + 0.1°
          </button>
          <button
            className={`btn ${
              RA !== undefined ? "btn-more02" : "btn-more02"
            } mb-4`}
            onClick={() => changeCoordinate(0, -0.1)}
            disabled={RA === undefined}
          >
            Dec - 0.1°
          </button>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-4">
          {prevErrors && <span className="text-danger"> {prevErrors} </span>}
          {gotoErrors && gotoErrors != prevErrors && (
            <span className="text-danger">{gotoErrors} </span>
          )}
          {prevSuccess && <span className="text-success"> {prevSuccess} </span>}
          {gotoSuccess && gotoSuccess != prevSuccess && (
            <span className="text-danger">{gotoSuccess} </span>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-4 text-end">
          <p>
            {t("cGoToStellariumMoveCenter")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        </div>
        <div className="col-sm-8">
          <ol>
            <li>{t("cGoToStellariumMoveCenterli1")}</li>
            <li>{t("cGoToStellariumMoveCenterli2")}</li>
            <li>{t("cGoToStellariumMoveCenterli3")}</li>
            <li>{t("cGoToStellariumMoveCenterli4")}</li>
            <li>{t("cGoToStellariumMoveCenterli5")}</li>
          </ol>
        </div>
      </div>
      <ImportManualModal
        showImportModal={showImportModal}
        setShowImportModal={setShowImportModal}
        setRA={setRA}
        setDeclination={setDeclination}
        setObjectName={setObjectName}
        displayName= {objectName}
        ra= {RA && convertHMSToDecimalHours(RA)}
        dec= {declination && convertDMSToDecimalDegrees(declination)}
      />
      <GotoModal
        object={
          {
            displayName: objectName || "",
            ra: RA || "",
            dec: declination || "",
          } as AstroObject
        }
        showModal={showModal}
        setShowModal={setShowModal}
        messages={gotoMessages}
        setMessages={setGotoMessages}
      />
    </div>
  );
}
