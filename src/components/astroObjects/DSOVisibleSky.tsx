import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import React, { useState, useContext, useEffect } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";

export default function DSOVisibleSky({ updateVisibleSkyLimit }) {
  let connectionCtx = useContext(ConnectionContext);
  const [visibleSkyLimitValue, setVisibleSkyLimitValue] = useState(
    connectionCtx.visibleSkyLimit
  );
  const [showTooltip, setShowTooltip] = useState(false);

  function setSkyLimitHandler() {
    updateVisibleSkyLimit(visibleSkyLimitValue);
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
    <div className="sky_object">
      <div className="row mb-3">
        <div className="col-lg-2 col-md-3 col-sm-4 col-12 mb-2 mb-md-0">
          <button className="btn btn-more02 w-100" onClick={setSkyLimitHandler}>
            {t("cVisibleSkyLimit")}
          </button>
        </div>
        <div className="col-lg-5 col-md-9 col-sm-8 col-12">
          <div className="tooltip-container">
            <input
              pattern="^[\\w\\s]{0,255}$/i"
              className="form-control"
              placeholder=""
              id="setLimit"
              name="setLimit"
              value={visibleSkyLimitValue}
              onChange={(e) => setVisibleSkyLimitValue(e.target.value)}
            />
            <span className={`tooltip-text-SK ${showTooltip ? "show" : ""}`}>
              {t("cSkyLimitHelp1")}
              <br />
              {t("cSkyLimitHelp2")}
              <br />
              {t("cSkyLimitHelp3")}
              <br />
              {t("cSkyLimitHelp4")}
              <br />
              {t("cSkyLimitHelp5")}
              <br />
              {t("cSkyLimitHelp6")}
              <br />
              {t("cSkyLimitHelp7")}
            </span>
          </div>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-4 col-12 mb-2 mb-md-0">
          <i
            className="bi bi-info-circle"
            role="button"
            onClick={() => setShowTooltip(!showTooltip)}
          ></i>
        </div>
      </div>
    </div>
  );
}
