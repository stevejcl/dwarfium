import { useState, useEffect, useContext } from "react";
import type { ChangeEvent } from "react";
import Link from "next/link";

import { ConnectionContext } from "@/stores/ConnectionContext";
import DSOList from "@/components/astroObjects/DSOList";
import ImportObjectListModal from "@/components/ImportObservationListModal";
import DeleteObjectListModal from "./DeleteObservationListModal";
import { fetchObjectFavoriteNamesDb } from "@/db/db_utils";
import { AstroObject } from "@/types";
import {
  fetchObjectListsDb,
  fetchObjectListsNamesDb,
  saveUserCurrentObjectListNameDb,
} from "@/db/db_utils";

export default function GotoUserLists() {
  let connectionCtx = useContext(ConnectionContext);

  let [objectFavoriteNames, setObjectFavoriteNames] = useState<string[]>([]);
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
    // get objects lists from local storage on page load
    let favoriteNames = fetchObjectFavoriteNamesDb();
    if (favoriteNames) {
      setObjectFavoriteNames(favoriteNames);
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

  return (
    <div>
      <div className="container">
        {!connectionCtx.connectionStatusStellarium && (
          <p className="text-danger">
            You must connect to Stellarium for Center to work.
          </p>
        )}
        {!connectionCtx.connectionStatus && (
          <p className="text-danger">
            You must connect to Dwarf II for Goto to work.
          </p>
        )}

        <div className="row">
          <div className="col-md-4">
            <select
              className="form-select mb-2"
              value={connectionCtx.currentUserObjectListName || "default"}
              onChange={selectListHandler}
            >
              <option value="default">Select object lists</option>
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
              Add new list
            </button>
            <button
              className="btn btn-more03 me-2 mb-2"
              onClick={deleteListModalHandle}
            >
              Delete list
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
            <p className="mt-4">
              To add custom objects lists, create an objects list at{" "}
              <Link href="https://telescopius.com">Telescopius</Link>, download
              the CSV, and click &quot;Add new list&quot;.
            </p>
            <p>
              The lists are stored in the browser&apos;s database
              (localStorage). Since the data is stored in your browser, other
              users of the site will not be able to access your lists.
            </p>
            <p>
              If you want to share your list with other people, you can send
              other people the csv from Telescopius.
            </p>
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
