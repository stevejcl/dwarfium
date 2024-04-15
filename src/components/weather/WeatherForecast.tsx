import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherForecastDay from "./WeatherForecastDay";

interface ForecastData {
  dt: number;
  weather: { icon: string }[];
  main: { temp_max: number; temp_min: number };
}

function WeatherForecast(props: { coordinates: { lat: number; lon: number } }) {
  const [loaded, setLoaded] = useState(false);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [apiKey] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("apiKey") || "" : ""
  );

  useEffect(() => {
    if (
      props.coordinates &&
      props.coordinates.lat &&
      props.coordinates.lon &&
      apiKey
    ) {
      let units = "metric";
      let lat = props.coordinates.lat;
      let lon = props.coordinates.lon;
      let apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

      axios
        .get(apiURL)
        .then((response) => {
          const filteredForecast = filterForecast(response.data.list);
          setForecast(filteredForecast);
          setLoaded(true);
        })
        .catch((error) => {
          console.error("Weather forecast API call failed:", error);
        });
    } else {
      console.error("Invalid coordinates or API key provided.");
    }
  }, [props.coordinates, apiKey]);

  const filterForecast = (forecastData: any[]): ForecastData[] => {
    const filteredForecast: ForecastData[] = [];
    const datesSet = new Set<string>();

    forecastData.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const dateString = date.toDateString();

      if (!datesSet.has(dateString)) {
        filteredForecast.push({
          dt: entry.dt,
          weather: entry.weather,
          main: entry.main,
        });
        datesSet.add(dateString);
      }
    });

    return filteredForecast;
  };

  if (loaded) {
    return (
      <div className="WeatherForecast">
        <div className="row">
          {forecast.map((dailyForecast, index) => (
            <div className="col" key={index}>
              <WeatherForecastDay data={dailyForecast} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default WeatherForecast;
