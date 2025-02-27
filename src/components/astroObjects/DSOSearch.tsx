import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import React, { useState, useContext, useEffect } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";

export default function DSOSearch({ updateSearchText }) {
  let connectionCtx = useContext(ConnectionContext);
  const [searchTxtValue, setSearchTxtValue] = useState(connectionCtx.searchTxt);

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

  function searchHandler() {
    updateSearchText(searchTxtValue);
  }

  return (
    <div className="search_object">
      <div className="row mb-3">
        <div className="col-lg-1 col-md-2 col-4 mb-2 mb-md-0">
          <button className="btn btn-more02 w-100" onClick={searchHandler}>
            {t("cObjectsSearch")}
          </button>
        </div>
        <div className="col-lg-3 col-md-4 col-6">
          <input
            pattern="^[\w\s]{0,255}$/i"
            className="form-control"
            placeholder=""
            id="search"
            name="search"
            value={searchTxtValue}
            onChange={(e) => setSearchTxtValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
