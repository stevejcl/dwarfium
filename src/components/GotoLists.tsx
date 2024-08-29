import { useContext, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import DSOList from "@/components/astroObjects/DSOList";
import PlanetsList from "@/components/astroObjects/PlanetsList";
import dsoCatalog from "../../data/catalogs/dso_catalog.json";
import { processObjectListOpenNGC } from "@/lib/observation_lists_utils";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { saveCurrentObjectListNameDb } from "@/db/db_utils";

let dsoObject = processObjectListOpenNGC(dsoCatalog);
console.info("DSO processObjectListOpenNGC");

type PropType = {
  objectFavoriteNames: string[];
  setObjectFavoriteNames: Dispatch<SetStateAction<string[]>>;
  setModule: Dispatch<SetStateAction<string | undefined>>;
  setErrors: Dispatch<SetStateAction<string | undefined>>;
  setSuccess: Dispatch<SetStateAction<string | undefined>>;
};

export default function AutoGoto(props: PropType) {
  const { objectFavoriteNames, setObjectFavoriteNames } = props;
  const { setModule, setErrors, setSuccess } = props;
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

  let connectionCtx = useContext(ConnectionContext);

  function selectListHandler(e: ChangeEvent<HTMLSelectElement>) {
    connectionCtx.setCurrentObjectListName(e.target.value);
    saveCurrentObjectListNameDb(e.target.value);
  }

  let showInstructions =
    connectionCtx.currentObjectListName === "default" ||
    connectionCtx.currentObjectListName === undefined;

  return (
    <div>
      <div className="container">
        {!connectionCtx.connectionStatusStellarium && (
          <p className="text-danger">{t("cGoToListConnectStellarium")}</p>
        )}
        {!connectionCtx.connectionStatus && (
          <p className="text-danger">
            {t("cGoToListConnectDwarf", {
              DwarfType: connectionCtx.typeNameDwarf,
            })}
          </p>
        )}

        <select
          className="form-select-dso"
          value={connectionCtx.currentObjectListName || "default"}
          onChange={selectListHandler}
        >
          <option value="default">{t("cGoToListdefault")}</option>
          <option value="dso">DSO</option>
          <option value="planets">{t("cGotoListplanets")}</option>
        </select>
        {showInstructions && (
          <>
            <p className="mt-4">{t("cGotoListSelectObject")}</p>

            <ol>
              <li>
                {t("cGotoListDSOList")}
                <ul>
                  <li>{t("cGotoListDSOList1")}</li>
                  <li>{t("cGotoListDSOList2")}</li>
                  <li>{t("cGotoListDSOList3")}</li>
                  <li>{t("cGotoListDSOList4")}</li>
                </ul>
              </li>
              <li>
                {t("cGotoListDSOList5", {
                  DwarfType: connectionCtx.typeNameDwarf,
                })}
              </li>
            </ol>
            <p>
              {t("cGotoListinfo", { DwarfType: connectionCtx.typeNameDwarf })}
            </p>
            {""}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </>
        )}
        {connectionCtx.currentObjectListName === "dso" && (
          <DSOList
            objects={dsoObject}
            objectFavoriteNames={objectFavoriteNames}
            setObjectFavoriteNames={setObjectFavoriteNames}
            setModule={setModule}
            setErrors={setErrors}
            setSuccess={setSuccess}
          ></DSOList>
        )}
        {connectionCtx.currentObjectListName === "planets" && (
          <PlanetsList
            setModule={setModule}
            setErrors={setErrors}
            setSuccess={setSuccess}
          ></PlanetsList>
        )}
      </div>
    </div>
  );
}
