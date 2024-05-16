import type { FormEvent, Dispatch, SetStateAction } from "react";
import Modal from "react-bootstrap/Modal";
import { useState, useContext, useEffect } from "react";

import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import { AstroObject } from "@/types";
import {
  saveObjectListsNamesDb,
  saveObjectListsDb,
  saveUserCurrentObjectListNameDb,
} from "@/db/db_utils";
import { ConnectionContext } from "@/stores/ConnectionContext";

type PropTypes = {
  objectListsNames: string[];
  setObjectListsNames: Dispatch<SetStateAction<string[]>>;
  objectLists: { [k: string]: AstroObject[] };
  setObjectLists: Dispatch<SetStateAction<{ [k: string]: AstroObject[] }>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteObjectListModal(props: PropTypes) {
  const {
    objectListsNames,
    setObjectListsNames,
    objectLists,
    setObjectLists,
    showModal,
    setShowModal,
  } = props;

  let connectionCtx = useContext(ConnectionContext);

  function handleCloseModal() {
    setShowModal(false);
  }

  function deleteListHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let updatedListsNames = objectListsNames.filter(
      (name) => name != connectionCtx.currentUserObjectListName
    );
    setObjectListsNames(updatedListsNames);
    saveObjectListsNamesDb(updatedListsNames.join("|"));

    const cloneObjectLists = structuredClone(objectLists);
    delete cloneObjectLists[connectionCtx.currentUserObjectListName as string];
    setObjectLists(cloneObjectLists);
    saveObjectListsDb(JSON.stringify(cloneObjectLists));
    connectionCtx.setUserCurrentObjectListName(undefined);
    saveUserCurrentObjectListNameDb("default");

    // close modal
    setShowModal(false);
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
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("cDeleteObservationListModalTitle")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={deleteListHandler}>
          <p className="mb-3">{t("cDeleteObservationListConfirm")}?</p>

          <button type="submit" className="btn btn-more03 me-2 mb-2">
            {t("cDeleteObservationListButton")}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
