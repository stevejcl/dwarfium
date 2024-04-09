import React, { useState, useEffect } from "react";
import axios from "axios";

interface ForecastData {
    list: {
      dt_txt: string;
      main: {
        temp: number;
      };
      weather: {
        description: string;
      }[];
    }[];
  }

interface WeatherData {
    name: string;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    wind: {
        speed: number;
    };
    weather: {
      description: string;
    }[];
  }

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Access localStorage only in the client-side code
    if (typeof window !== "undefined") {
      const storedApiKey = localStorage.getItem("weatherApiKey");
      setApiKey(storedApiKey || "");
    }
  }, []);

  const fetchData = async () => {
    try {
      // Fetch current weather data
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&amp;appid=${apiKey}`
      );
      setWeatherData(currentWeatherResponse.data);

      // Fetch forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&amp;appid=${apiKey}`
      );
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const getForecastTableData = () => {
    if (!forecastData) return null;

    const forecastTableRows = forecastData.list.map((forecast) => {
      const dateTime = forecast.dt_txt;
      const temperature = forecast.main.temp;
      const description = forecast.weather[0].description;

      return (
        <tr key={dateTime}>
          <td>{dateTime}</td>
          <td>{temperature}&deg;C</td>
          <td>{description}</td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Temperature (&deg;C)</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{forecastTableRows}</tbody>
      </table>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter API key"
          value={apiKey}
          onChange={handleApiKeyChange}
        />
        <button type="submit">Get Weather</button>
      </form>
      {weatherData && forecastData ? (
        <>
          <div>
            <h2>{weatherData.name}</h2>
            <p>Temperature: {weatherData.main.temp}&deg;C</p>
            <p>Description: {weatherData.weather[0].description}</p>
            <p>Feels like : {weatherData.main.feels_like}&deg;C</p>
            <p>Humidity : {weatherData.main.humidity}%</p>
            <p>Pressure : {weatherData.main.pressure}</p>
            <p>Wind Speed : {weatherData.wind.speed}m/s</p>
          </div>
          <div>
            <h2>Forecast</h2>
            {getForecastTableData()}
          </div>
        </>
      ) : (
        <p>Enter a city name and API key, then click &quot;Get Weather&quot;</p>
      )}
    </div>
  );
};

export default Weather;
