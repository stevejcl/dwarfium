import type { FormEvent, Dispatch, SetStateAction } from "react";
import { useState, useContext } from "react";
import Papa from "papaparse";
import type { ChangeEvent } from "react";
import Modal from "react-bootstrap/Modal";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { processObjectListTelescopius } from "@/lib/observation_lists_utils";
import { AstroObject, ObjectTelescopius } from "@/types";
import {
  saveObjectListsDb,
  saveObjectListsNamesDb,
  saveUserCurrentObjectListNameDb,
} from "@/db/db_utils";

type PropTypes = {
  objectListsNames: string[];
  setObjectListsNames: Dispatch<SetStateAction<string[]>>;
  objectLists: { [k: string]: AstroObject[] };
  setObjectLists: Dispatch<SetStateAction<{ [k: string]: AstroObject[] }>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};
export default function ImportObjectListModal(props: PropTypes) {
  const {
    objectListsNames,
    setObjectListsNames,
    objectLists,
    setObjectLists,
    showModal,
    setShowModal,
  } = props;

  let connectionCtx = useContext(ConnectionContext);

  let [error, setError] = useState<string | undefined>();
  const [listName, setListName] = useState(""); // State to store the list Name from file name

  function handleCloseModal() {
    setShowModal(false);
  }

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const modifiedName = modifyListName(file.name); // Modify the file name as needed
      setListName(modifiedName);
    }
  };

  // Function to modify the file name as needed
  const modifyListName = (fileName) => {
    const startIndex =
      fileName.indexOf("telescopius_list_") + "telescopius_list_".length;
    const endIndex = fileName.indexOf(".csv");
    if (startIndex !== -1 && endIndex !== -1) {
      const objectName = fileName.substring(startIndex, endIndex);
      return objectName;
    }
    return ""; // Return an empty string if the pattern is not found
  };
  function fileUploadHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formName = formData.get("list_name");
    if (formName === null) {
      setError("List name is required.");
      return;
    }
    if (objectListsNames.includes(formName)) {
      setError(`There is a list already named "${formName}".`);
      return;
    }
    setError(``);
    let name = formName.toString();

    // handle list csv
    // https://stackoverflow.com/a/68597716
    const formFile = formData.get("upload") as File;
    formFile.text().then((data) => {
      const csvData = Papa.parse(data, { header: true });
      const cloneObjectLists = structuredClone(objectLists);
      cloneObjectLists[name] = processObjectListTelescopius(
        csvData.data as ObjectTelescopius[]
      );
      saveObjectListsDb(JSON.stringify(cloneObjectLists));
      setObjectLists(cloneObjectLists);

      // handle list name
      let updatedListsNames = objectListsNames.concat(name).join("|");
      saveObjectListsNamesDb(updatedListsNames);
      setObjectListsNames(objectListsNames.concat(name));
      connectionCtx.setUserCurrentObjectListName(name);
      saveUserCurrentObjectListNameDb(name);

      // close modal
      setShowModal(false);
    });
  }

  function nameInputHandler(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    if (objectListsNames.includes(e.currentTarget.value)) {
      setError(`There is a list already named "${e.currentTarget.value}".`);
    } else {
      setListName (e.currentTarget.value);
    }
  }

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Object List</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Import objects list from Telescopius.</p>

        <form onSubmit={fileUploadHandler}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              List Name
            </label>
            <input
              type="text"
              className="form-control"
              id="list_name"
              name="list_name"
              value={listName}
              onChange={nameInputHandler}
              required
            />
            {error && <p className="text-danger">{error}</p>}
          </div>
          <div className="mb-3">
            <input
              type="file"
              name="upload"
              accept=".csv"
              className="form-control"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-more02 me-2 mb-2">
            Import List
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
