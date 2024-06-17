import { useState, useEffect, useContext } from "react";
import type { ChangeEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import { ConnectionContext } from "@/stores/ConnectionContext";
import DSOList from "@/components/astroObjects/DSOList";
import ImportObjectListModal from "@/components/ImportObservationListModal";
import DeleteObjectListModal from "./DeleteObservationListModal";
import { AstroObject } from "@/types";
import {
  fetchObjectListsDb,
  fetchObjectListsNamesDb,
  saveUserCurrentObjectListNameDb,
} from "@/db/db_utils";

type PropType = {
  objectFavoriteNames: string[];
  setObjectFavoriteNames: Dispatch<SetStateAction<string[]>>;
};

export default function GotoUserLists(props: PropType) {
  const { objectFavoriteNames, setObjectFavoriteNames } = props;
  let connectionCtx = useContext(ConnectionContext);

  let [objectListsNames, setObjectListsNames] = useState<string[]>([]);
  let [objectLists, setObjectLists] = useState<{
    [k: string]: AstroObject[];
  }>({});
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // get objects lists from local storage on page load
    let names = fetchObjectListsNamesDb();
    if (names) {
      setObjectListsNames(names);
    }
    let lists = fetchObjectListsDb();
    if (lists) {
      setObjectLists(lists);
    }
  }, []);

  function selectListHandler(e: ChangeEvent<HTMLSelectElement>) {
    let listName = e.target.value;
    connectionCtx.setUserCurrentObjectListName(listName);
    saveUserCurrentObjectListNameDb(listName);
  }

  let showInstructions =
    objectListsNames.length === 0 ||
    connectionCtx.currentUserObjectListName === "default";

  function importListModalHandle() {
    setShowImportModal(true);
  }

  function deleteListModalHandle() {
    setShowDeleteModal(true);
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
      <div className="container">
        {!connectionCtx.connectionStatusStellarium && (
          <p className="text-danger">{t("cGoToListConnectStellarium")}.</p>
        )}
        {!connectionCtx.connectionStatus && (
          <p className="text-danger">{t("cGoToListConnectDwarf")}</p>
        )}

        <div className="row">
          <div className="col-md-4">
            <select
              className="form-select mb-2"
              value={connectionCtx.currentUserObjectListName || "default"}
              onChange={selectListHandler}
            >
              <option value="default">{t("cGoToListdefault")}</option>
              {objectListsNames.map((list, index) => (
                <option key={index} value={list}>
                  {list}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <button
              className="btn btn-more02 me-2 mb-2"
              onClick={importListModalHandle}
            >
              {t("cGoToUserListNewList")}
            </button>
            <button
              className="btn btn-more03 me-2 mb-2"
              onClick={deleteListModalHandle}
            >
              {t("cGoToUserListDeleteList")}
            </button>
          </div>
        </div>

        {connectionCtx.currentUserObjectListName &&
          objectLists[connectionCtx.currentUserObjectListName] && (
            <DSOList
              objects={objectLists[connectionCtx.currentUserObjectListName]}
              objectFavoriteNames={objectFavoriteNames}
              setObjectFavoriteNames={setObjectFavoriteNames}
            ></DSOList>
          )}

        {showInstructions && (
          <>
            <p
              className="mt-4"
              dangerouslySetInnerHTML={{
                __html: t("cGoToUserListCustomObjectsListInstruction1"),
              }}
            />

            <p>{t("cGoToUserListCustomObjectsListInstruction2")}</p>
            <p>{t("cGoToUserListCustomObjectsListInstruction3")}</p>
            {""}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </>
        )}
        <ImportObjectListModal
          showModal={showImportModal}
          setShowModal={setShowImportModal}
          objectListsNames={objectListsNames}
          setObjectListsNames={setObjectListsNames}
          objectLists={objectLists}
          setObjectLists={setObjectLists}
        />
        <DeleteObjectListModal
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          objectListsNames={objectListsNames}
          setObjectListsNames={setObjectListsNames}
          objectLists={objectLists}
          setObjectLists={setObjectLists}
        />
      </div>
    </div>
  );
}
