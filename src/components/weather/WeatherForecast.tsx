import React, { useState, useEffect } from "react";

import axios from "axios";
import WeatherForecastDay from "./WeatherForecastDay";

function WeatherForecast(props) {
  const [loaded, setLoad] = useState(false);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    setLoad(false);
  }, [props.coordinates]);
  //If the coordinates change

  function handleDataResponse(response) {
    setForecast(response.data.daily);
    setLoad(true);
  }

  if (loaded) {
    console.log(forecast);
    return (
      <div className="WeatherForecast">
        <div className="row">
          {forecast.map(function (dailyforecast, index) {
            if (index < 6) {
              return (
                <div className="col" key={index}>
                  <WeatherForecastDay data={dailyforecast} />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  } else {
    let apiKey = "";
    let units = "metric";
    let lat = props.coordinates.lat;
    let lon = props.coordinates.lon;
    let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

    axios.get(apiURL).then(handleDataResponse);
    return null;
  }
}

export default WeatherForecast;
