import { useGetAsteroidsMutation } from "@/components/asteroids/api/api"; // Adjust the path as needed
import { ApiNasaResponse } from "@/components/asteroids/api/types";
import { useLocalStorage } from "@/components/asteroids/functions/hooks";
import { NextPage } from "next";
import React, { useState, useEffect } from "react";

import Asteroid from "@/components/asteroids/asteroid";
import Counter from "@/components/asteroids/counter";

const MainPage: NextPage = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [localStorageData, setLocalStorageData] = useLocalStorage("asteroids", "");
  const [NasaApiKey, setNasaApiKey] = useLocalStorage("NasaApiKey", ""); // Store NasaApiKey in local storage
  const [getAsteroids, { data, isLoading }] = useGetAsteroidsMutation(); // Using the hook directly
  const [inputNasaApiKey, setInputNasaApiKey] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Parse the local storage data or initialize it as an empty object
  const asteroidsData: ApiNasaResponse = React.useMemo(
    () => (localStorageData ? JSON.parse(localStorageData) : {}),
    [localStorageData]
  );

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
            className="btn btn-more02 w-40"
            onClick={handleSaveNasaApiKey}
          >
            Save API
          </button>
          <button
            type="button"
            className="btn btn-more02 w-40 ml-2"
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
            .map((data, index) => <Asteroid key={index} data={data} />)}
      </div>
    </>
  );
};

export default MainPage;
