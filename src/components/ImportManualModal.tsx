import type { FormEvent, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

import type { ChangeEvent } from "react";
import Modal from "react-bootstrap/Modal";

import {
  parseRaToFloat,
  formatRa,
  parseDecToFloat,
  formatDec,
} from "@/lib/math_utils";

type PropTypes = {
  showImportModal: boolean;
  setShowImportModal: Dispatch<SetStateAction<boolean>>;
  setRA: Dispatch<SetStateAction<string | undefined>>;
  setDeclination: Dispatch<SetStateAction<string | undefined>>;
  setObjectName: Dispatch<SetStateAction<string | undefined>>;
  displayName: string | undefined;
  ra : string | undefined;
  dec: string | undefined;
};
export default function ImportManualModal(props: PropTypes) {
  const {
    showImportModal,
    setShowImportModal,
    setRA,
    setDeclination,
    setObjectName,
    displayName,
    ra,
    dec,
  } = props;

  let [error, setError] = useState<string | undefined>();
  const [manualRA, setManualRA] = useState<string>(ra || "");
  const [manualDeclination, setManualDeclination] = useState<string>(dec || "");
  const [manualObjectName, setManualObjectName] = useState<string>(displayName || "");

  function handleCloseModal() {
    setShowImportModal(false);
  }

  function validateData(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formName = formData.get("object_name");
    if (formName === null) {
      setError("Object Name is required.");
      return;
    }
    setError(``);
    setObjectName(formName.toString());

    const formRA = formData.get("right_ascension");
    if (formRA === null) {
      setError("Right Ascension is required.");
      return;
    }

    if (!parseRaToFloat(formRA)) {
      setError("The value of Right Ascension has a bad format!");
      return;
    }

    let parseRA = formatRa(parseRaToFloat(formRA));
    if (parseRA == "Invalid RA") {
      setError("The value of Right Ascension has a bad format!");
      return;
    }

    const formDeclination = formData.get("declination");
    if (formDeclination === null) {
      setError("Declination is required.");
      return;
    }

    if (!parseDecToFloat(formDeclination)) {
      setError("The value of Declination has a bad format!");
      return;
    }

    let parseDeclination = formatDec(parseDecToFloat(formDeclination));
    if (parseDeclination == "Invalid Dec") {
      setError("The value of Declination has a bad format!");
      return;
    }

    setObjectName(formName.toString());

    setRA(parseRA.toString());

    setDeclination(parseDeclination.toString());

    // close modal
    setShowImportModal(false);
  }

  function nameInputHandler(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    setManualObjectName(e.currentTarget.value);
  }

  function RAInputHandler(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    setManualRA(e.currentTarget.value);
  }

  function declinationInputHandler(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    setManualDeclination(e.currentTarget.value);
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
    <Modal show={showImportModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("cImportManualModalTitle")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={validateData}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              {t("cImportManualModalObjecTName")}
            </label>
            <input
              type="text"
              className="form-control"
              id="object_name"
              name="object_name"
              value={manualObjectName || displayName}
              onChange={nameInputHandler}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              {t("cGoToStellariumRightAscension")}
            </label>
            <input
              type="text"
              placeholder="Enter the Right Ascension (hr:mm:ss.s) or decimal"
              className="form-control"
              id="right_ascension"
              name="right_ascension"
              value={manualRA || ra}
              onChange={RAInputHandler}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              {t("cGoToStellariumDeclination")}
            </label>
            <input
              type="text"
              placeholder="Enter the Declination (sign deg:mm:ss.s) or decimal"
              className="form-control"
              id="declination"
              name="declination"
              value={manualDeclination || dec}
              onChange={declinationInputHandler}
              required
            />
          </div>
          <button type="submit" className="btn btn-more02 me-2 mb-2">
            {t("cGoToStellariumImportData")}
          </button>
          {error && <p className="text-danger">{error}</p>}
        </form>
      </Modal.Body>
    </Modal>
  );
}
