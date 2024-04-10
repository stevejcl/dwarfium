import React, { useState, useEffect } from "react";
import axios from "axios";

interface ForecastData {
  list: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      description: string;
    }[];
  }[];
}

const Weather = () => {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedApiKey = localStorage.getItem("weatherApiKey");
      setApiKey(storedApiKey || "");
    }
  }, []);

  const fetchData = async () => {
    try {
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      setForecastData(forecastResponse.data);
      console.log(forecastResponse);
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

    // Group forecast data by day
    const groupedByDay: { [date: string]: any } = {};
    forecastData.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!groupedByDay[date]) {
        groupedByDay[date] = forecast;
      }
    });

    // Create forecast rows
    const forecastRows = Object.values(groupedByDay).map((forecast) => {
      const date = new Date(forecast.dt * 1000); // Convert timestamp to date
      const averageTemp = forecast.main.temp;
      const description = `${forecast.weather[0].description} <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon" />`;

      return (
        <tr key={forecast.dt}>
          <td>{date.toLocaleDateString()}</td>
          <td>{averageTemp.toFixed(1)}&deg;C</td>
          <td dangerouslySetInnerHTML={{ __html: description }}></td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Average Temperature (&deg;C)</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{forecastRows}</tbody>
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
        <p>
          Get your own key here{" "}
          <a
            href="https://home.openweathermap.org/api_keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://home.openweathermap.org/api_keys
          </a>
        </p>
      </form>
      {forecastData ? (
        <>
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
