import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useContext, useState } from "react";
import type { ChangeEvent } from "react";

import { getCoordinates } from "@/lib/geolocation";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { saveLatitudeDB, saveLongitudeDB, saveTimezoneDB } from "@/db/db_utils";
import { logger } from "@/lib/logger";

export default function SetLocation() {
  let connectionCtx = useContext(ConnectionContext);
  const [latitude, setLatitude] = useState<string | undefined>(
    connectionCtx.latitude?.toString()
  );
  const [longitude, setLongitude] = useState<string | undefined>(
    connectionCtx.longitude?.toString()
  );
  const [errors, setErrors] = useState<string | undefined>();

  function browserCoordinatesHandler() {
    logger("start getCoordinates...", {}, connectionCtx);
    setErrors(undefined);

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    saveTimezoneDB(timezone);
    connectionCtx.setTimezone(timezone);

    getCoordinates(
      (position) => {
        let coords = position.coords;
        logger("getCoordinates:", coords, connectionCtx);
        saveLatitudeDB(coords.latitude);
        saveLongitudeDB(coords.longitude);
        connectionCtx.setLatitude(coords.latitude);
        connectionCtx.setLongitude(coords.longitude);
        setLatitude(coords.latitude.toString());
        setLongitude(coords.longitude.toString());
      },
      (err) => {
        logger("getCoordinates err:", err, connectionCtx);
        setErrors("Could not detect location.");
      }
    );
  }

  function latitudeHandler(e: ChangeEvent<HTMLInputElement>) {
    setErrors(undefined);

    let value = e.target.value.trim();
    //if (value === "") return;
    if (value == "-" || value == "+") {
      setLatitude(value);
      return;
    }

    // old : if (/^(-?\d{1,2}(.\d+)?|[-+]?(?:90(.0+)?|[1-8]?\d(.\d+)?))$/.test(value)) {
    //if (/^([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?))$/.test(value)) {
    if (/^(|[-+]?(90?(\.0*)?|[1-8]?\d(\.\d*)?))$/.test(value)) {
      if (!value.endsWith(".")) {
        setLatitude(value);
        saveLatitudeDB(Number(value));
        connectionCtx.setLatitude(Number(value));
      } else if (!isNaN(parseFloat(value))) {
        setLatitude(value);
      }
    }
  }

  function longitudeHandler(e: ChangeEvent<HTMLInputElement>) {
    setErrors(undefined);

    let value = e.target.value.trim();
    if (value == "-" || value == "+") {
      setLongitude(value);
      return;
    }

    // old : if (/^(-?\d{1,3}(.\d+)?|[-+]?(?:180(.0+)?|1[0-7]\d(.\d+)?|\d{1,2}(.\d+)?))$/.test(value)) {
    // if (/^([-+]?(180(\.\d+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?))$/.test(value)) {
    if (
      /^(|[-+]?(180?(\.0*)?|1[0-7]?\d(\.\d*)?|\d{1,2}(\.\d*)?))$/.test(value)
    ) {
      if (!value.endsWith(".")) {
        setLongitude(value);
        saveLongitudeDB(Number(value));
        connectionCtx.setLongitude(Number(value));
      } else if (!isNaN(parseFloat(value))) {
        setLongitude(value);
      }
    }
  }

  function timezoneHandler(e: ChangeEvent<HTMLInputElement>) {
    setErrors(undefined);

    let value = e.target.value.trim();
    if (value === "") {
      let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      saveTimezoneDB(timezone);
      connectionCtx.setTimezone(timezone);
    }

    if (/^[a-z]*(\/*[a-z]*)$/i.test(value)) {
      saveTimezoneDB(value);
      connectionCtx.setTimezone(value);
    }
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
    <>
      <div>
        <h2>{t("pSetLocation")}</h2>
        <p>{t("pSetLocationContent")}.</p>

        <form>
          <div className="row mb-3">
            <div className="col-lg-1 col-md-2">
              <label htmlFor="latitude" className="form-label">
                {t("pLatitude")}
              </label>
            </div>
            <div className="col-lg-2 col-md-10">
              <input
                //pattern="^([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?))$"
                className="form-control"
                id="latitude"
                name="latitude"
                placeholder="-12.3456"
                required
                value={latitude || connectionCtx.latitude || ""}
                onChange={(e) => latitudeHandler(e)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-1 col-md-2">
              <label htmlFor="longitude" className="form-label">
                {t("pLongitude")}
              </label>
            </div>
            <div className="col-lg-2 col-md-10">
              <input
                //pattern="^([-+]?(180(\.\d+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?))$"
                className="form-control"
                id="longitude"
                name="longitude"
                placeholder="56.7890"
                required
                value={longitude || connectionCtx.longitude || ""}
                onChange={(e) => longitudeHandler(e)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-1 col-md-2">
              <label htmlFor="timezone" className="form-label">
                {t("pTimezone")}
              </label>
            </div>
            <div className="col-lg-2 col-md-10">
              <input
                pattern="^[a-z]*(\*/[a-z]+)$/i"
                className="form-control"
                id="timezone"
                name="timezone"
                placeholder="?"
                required
                value={connectionCtx.timezone || ""}
                onChange={(e) => timezoneHandler(e)}
              />
            </div>
          </div>
        </form>

        <button className="btn btn-more02" onClick={browserCoordinatesHandler}>
          <i className="icon-location" /> {t("pUseCurrentLocation")}
        </button>
        {errors && <p className="text-danger">{errors}</p>}
      </div>
    </>
  );
}
