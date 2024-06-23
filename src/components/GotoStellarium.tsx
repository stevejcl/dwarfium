/* eslint react/no-unescaped-entities: 0 */

import { useContext, useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import { ConnectionContext } from "@/stores/ConnectionContext";
import ConnectStellarium from "@/components/setup/ConnectStellarium";
import { statusPath, parseStellariumData } from "@/lib/stellarium_utils";
import { AstroObject, ParsedStellariumData } from "@/types";
import DSOObject from "@/components/astroObjects/DSOObject";
import { getObjectByNamesListOpenNGC } from "@/lib/observation_lists_utils";
import dsoCatalog from "../../data/catalogs/dso_catalog.json";
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
  formatModifyRa,
  formatModifyDec,
} from "@/lib/math_utils";
import GotoModal from "./astroObjects/GotoModal";
import ImportManualModal from "./ImportManualModal";

type Message = {
  [k: string]: string;
};

type PropType = {
  objectFavoriteNames: string[];
  setObjectFavoriteNames: Dispatch<SetStateAction<string[]>>;
  setModule: Dispatch<SetStateAction<string | undefined>>;
  setErrors: Dispatch<SetStateAction<string | undefined>>;
  setSuccess: Dispatch<SetStateAction<string | undefined>>;
};

export default function ManualGoto(props: PropType) {
  const { objectFavoriteNames, setObjectFavoriteNames } = props;
  const { setModule, setErrors, setSuccess } = props;
  let connectionCtx = useContext(ConnectionContext);
  const [RA, setRA] = useState<string | undefined>();
  const [declination, setDeclination] = useState<string | undefined>();
  const [objectName, setObjectName] = useState<string | undefined>();
  const [objectNGC, setObjectNGC] = useState<AstroObject | undefined>(
    undefined
  );
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [gotoMessages, setGotoMessages] = useState<Message[]>([] as Message[]);

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

    if (objectData.objectNGC)
      setObjectName(objectData.objectNGC + " - " + objectData.objectName);
    else setObjectName(objectData.objectName);

    // find Object in DataBase
    console.log(objectData.objectNGC);

    let object = getObjectByNamesListOpenNGC(
      dsoCatalog,
      objectData.objectNGC.split(" - "),
      objectFavoriteNames
    );

    setObjectNGC(object);
  }

  function resetData() {
    setErrors(undefined);
    setSuccess(undefined);
    setDeclination(undefined);
    setRA(undefined);
    setObjectName("");
    setObjectNGC(undefined);
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
            console.log(data.selectioninfo);
            const objectData = parseStellariumData(data.selectioninfo);
            console.error(objectData);
            if (objectData) {
              validDataHandler(objectData);
            }
          }
        })
        .catch((err) => stellariumErrorHandler(err, setErrors));
    } else {
      setErrors("App is not connect to Stellarium.");
    }
  }

  function changeCoordinate(RA_dif: number = 0, dec_diff: number = 0) {
    let RA_number = 0;

    if (RA_dif) {
      if (RA) RA_number = convertHMSToDecimalHours(RA, 9);
      let new_RA = RA_number + RA_dif;
      if (new_RA > 24) new_RA = 24;
      if (new_RA < 0) new_RA = 0;
      let { hour, minute, second } = convertDecimalHoursToHMS(new_RA);
      let secondParts = second.toString().split(".");
      let secondStr = padNumber(Number(secondParts[0]));
      if (secondParts[1]) {
        secondStr = secondStr + "." + secondParts[1];
      }
      setRA(`${padNumber(hour)}h ${padNumber(minute)}m ${secondStr}s`);
    }
    if (dec_diff) {
      let declination_number = declination
        ? convertDMSToDecimalDegrees(declination!, 7)
        : 0;
      let new_dec = declination_number + dec_diff;
      if (new_dec > 90) new_dec = 90;
      if (new_dec < -90) new_dec = -90;
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

  function pasteData() {
    if (connectionCtx.saveAstroData) {
      setObjectName(connectionCtx.saveAstroData.displayName);
      let RA: string | undefined = undefined;
      if (connectionCtx.saveAstroData.ra != null) {
        RA = connectionCtx.saveAstroData.ra;
        setRA(RA);
      } else setRA(undefined);
      let Declination: string | undefined = undefined;
      if (connectionCtx.saveAstroData.dec != null) {
        Declination = connectionCtx.saveAstroData.dec;
        setDeclination(Declination);
      } else setDeclination(undefined);
      setObjectNGC(connectionCtx.saveAstroData);
    }
  }

  function gotoFn() {
    setShowModal(connectionCtx.loggerView);

    startGotoHandler(
      connectionCtx,
      setErrors,
      setSuccess,
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
    setModule("");
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
      {!connectionCtx.connectionStatusStellarium && (
        <ConnectStellarium showInfoTxt={false} />
      )}
      {!connectionCtx.connectionStatusStellarium && <br />}
      {!connectionCtx.connectionStatus && (
        <p className="text-danger">{t("cGoToListConnectDwarf")}</p>
      )}

      <p>{t("cGoToStellariumPickObject")}</p>
      <ol>
        <li>{t("cGoToStellariumListTitle")}</li>
        <li>{t("cGoToStellariumList1")}</li>
        <li>{t("cGoToStellariumList2")}</li>
      </ol>
      <br />
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
        {objectName && t("cGoToStellariumImportModifyData")}{" "}
        {!objectName && t("cGoToStellariumImportManualData")}
      </button>
      <button
        className={`btn ${
          connectionCtx.saveAstroData
            ? connectionCtx.saveAstroData.displayName
              ? "btn btn-more02"
              : "btn-more02"
            : "btn-more02"
        } me-4 mb-3`}
        onClick={pasteData}
        disabled={
          !connectionCtx.saveAstroData ||
          !connectionCtx.saveAstroData.displayName
        }
      >
        {t("cGoToStellariumPasteData")}
      </button>
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
      {objectNGC && (
        <div className="row mb-3">
          <div className="col-sm-4">{t("cGoToStellariumFoundInCatalog")}</div>
        </div>
      )}
      {objectNGC && (
        <DSOObject
          key={objectNGC.designation}
          object={objectNGC}
          objectFavoriteNames={objectFavoriteNames}
          setObjectFavoriteNames={setObjectFavoriteNames}
          setModule={setModule}
          setErrors={setErrors}
          setSuccess={setSuccess}
        />
      )}
      {objectNGC && <br />}
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
        displayName={objectName}
        ra={RA && formatModifyRa(convertHMSToDecimalHours(RA, 9))}
        dec={
          declination &&
          formatModifyDec(convertDMSToDecimalDegrees(declination, 7))
        }
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
