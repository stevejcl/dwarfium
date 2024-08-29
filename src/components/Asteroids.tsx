import { useGetAsteroidsMutation } from "@/components/asteroids/api/api"; // Adjust the path as needed
import { ApiNasaResponse } from "@/components/asteroids/api/types";
import { useLocalStorage } from "@/components/asteroids/functions/hooks";
import { NextPage } from "next";
import React, { useState, useContext, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import Asteroid from "@/components/asteroids/asteroid";
import Counter from "@/components/asteroids/counter";

type PropType = {
  setModule: Dispatch<SetStateAction<string | undefined>>;
  setErrors: Dispatch<SetStateAction<string | undefined>>;
  setSuccess: Dispatch<SetStateAction<string | undefined>>;
};

const MainPage: NextPage<PropType> = ({ setModule, setErrors, setSuccess }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [localStorageData, setLocalStorageData] = useLocalStorage(
    "asteroids",
    ""
  );
  let connectionCtx = useContext(ConnectionContext);
  const [NasaApiKey, setNasaApiKey] = useLocalStorage("NasaApiKey", ""); // Store NasaApiKey in local storage
  const [getAsteroids, { data, isLoading }] = useGetAsteroidsMutation(); // Using the hook directly
  const [inputNasaApiKey, setInputNasaApiKey] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Parse the local storage data or initialize it as an empty object
  const asteroidsData: ApiNasaResponse = React.useMemo(
    () => (localStorageData ? JSON.parse(localStorageData) : {}),
    [localStorageData]
  );

  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    setModule("Asteroids");
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  // Fetch asteroids data if not available in local storage for the current date
  useEffect(() => {
    if (NasaApiKey && !asteroidsData?.near_earth_objects?.[currentDate]) {
      getAsteroids(currentDate);
    }
    if (!initialized && NasaApiKey) {
      setInputNasaApiKey(NasaApiKey);
      setInitialized(true);
    }
  }, [NasaApiKey, initialized, asteroidsData, currentDate, getAsteroids]);

  // Update local storage when new data is fetched
  useEffect(() => {
    if (data) {
      setLocalStorageData(JSON.stringify(data));
    }
  }, [data, setLocalStorageData]);

  // Handler to save NasaApiKey to local storage
  const handleSaveNasaApiKey = () => {
    setNasaApiKey(inputNasaApiKey);
  };

  // Handler to load objects (trigger API call)
  const handleLoadObjects = () => {
    if (NasaApiKey) {
      getAsteroids(currentDate);
    }
  };

  return (
    <>
      <div className="wrapper">
        {!connectionCtx.connectionStatusStellarium && (
          <p className="text-danger">{t("cGoToAsteroidConnectStellarium")}</p>
        )}
        {!connectionCtx.connectionStatusStellarium && <br />}
        {!connectionCtx.connectionStatus && (
          <p className="text-danger">
            {t("cGoToListConnectDwarf", {
              DwarfType: connectionCtx.typeNameDwarf,
            })}
          </p>
        )}
        <div className="col-sm-6 col-md-3 mb-3 input-button-container">
          <input
            type="text"
            value={inputNasaApiKey}
            onChange={(e) => setInputNasaApiKey(e.target.value)}
            placeholder="Enter NASA API Key"
            className="form-control-nasa"
          />
          <button
            type="button"
            className="btn btn-more02 w-100 me-2"
            onClick={handleSaveNasaApiKey}
          >
            Save API
          </button>
          <button
            type="button"
            className="btn btn-more02 w-100 me-2 ml-2"
            onClick={handleLoadObjects}
          >
            Load Objects
          </button>
        </div>

        <span className="date">{currentDate}</span>
        <Counter
          total={asteroidsData?.element_count}
          dangerous={
            asteroidsData?.near_earth_objects?.[currentDate]?.filter(
              (asteroid) => asteroid.is_potentially_hazardous_asteroid
            )?.length
          }
        />

        {isLoading && (
          <div className="loader">
            <h2>Please wait</h2>
            <h4>Looking for asteroids approaching Earth</h4>
          </div>
        )}
        {asteroidsData &&
          asteroidsData.near_earth_objects?.[currentDate]
            ?.sort(({ is_potentially_hazardous_asteroid }) =>
              is_potentially_hazardous_asteroid ? -1 : 1
            )
            .map((data, index) => (
              <Asteroid
                key={index}
                data={data}
                setErrors={setErrors}
                setSuccess={setSuccess}
              />
            ))}
      </div>
    </>
  );
};

export default MainPage;
