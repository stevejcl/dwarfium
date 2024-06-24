import API from "@/components/asteroids/api/api";
import { ApiNasaResponse } from "@/components/asteroids/api/types";
import { useLocalStorage } from "@/components/asteroids/functions/hooks";
import AsteroidLoadingSpinner from "asteroid-loading-spinner";
import { NextPage } from "next";
import React from "react";

import Asteroid from "@/components/asteroids/asteroid";
import Counter from "@/components/asteroids/counter";

const MainPage: NextPage = () => {
  const currentDate = new Date(new Date() + "Z").toJSON().slice(0, 10);
  const [localStorage, setLocalStorage] = useLocalStorage("asteroids", "");
  const [getAsteroids, { data, isLoading }] = API.useGetAsteroidsMutation();

  const asteroidsData: ApiNasaResponse = React.useMemo(
    () => (localStorage ? JSON.parse(localStorage) : {}),
    [localStorage]
  );

  React.useEffect(() => {
    if (localStorage !== undefined && !localStorage) {
      getAsteroids(currentDate);
    }
  }, [localStorage]);

  React.useEffect(() => {
    if (!asteroidsData?.near_earth_objects?.[currentDate]) {
      getAsteroids(currentDate);
    }
  }, [asteroidsData, currentDate]);

  React.useEffect(() => {
    if (data) {
      setLocalStorage(JSON.stringify(data));
    }
  }, [data]);

  return (
    <>
      <div className={"wrapper"}>
        <div className="col-sm-6 col-md-3 mb-3 input-button-container">
          <input
            type="text"
            value={""}
            placeholder="Api Nasa"
            className="form-control-nasa"
          />
          <button
            type="button" // Changed to button to avoid form submission
            className="btn btn-more02 w-40"
          >
            Save Api
          </button>
        </div>

        <span className={"date"}>{currentDate}</span>
        <Counter
          total={asteroidsData?.element_count}
          dangerous={
            asteroidsData?.near_earth_objects?.[currentDate]?.filter(
              (asteroid) => asteroid.is_potentially_hazardous_asteroid
            )?.length
          }
        />

        {isLoading && (
          <div className={"loader"}>
            <h2>Please wait</h2>
            <h4>Looking for asteroids approaching Earth</h4>
            <AsteroidLoadingSpinner />
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
