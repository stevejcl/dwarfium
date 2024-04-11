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
      icon: string;
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleApiKeyChange = (e) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("weatherApiKey", newApiKey);
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity); // Update state with the new city
    localStorage.setItem("weatherCity", newCity); // Update localStorage
  };

  const getForecastDivData = () => {
    if (!forecastData) return null;

    const groupedByDay: { [date: string]: any } = {};
    forecastData.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!groupedByDay[date]) {
        groupedByDay[date] = forecast;
      }
    });

    const forecastDivs = Object.values(groupedByDay).map((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const averageTemp = forecast.main.temp;
      const description = `${forecast.weather[0].description}`;
      const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

      return (
        <div key={forecast.dt} className="forecast-item">
          <div>{date.toLocaleDateString()}</div>
          <div>{averageTemp.toFixed(1)}&deg;C</div>
          <div>
            {description}
            <img src={iconUrl} alt="Weather Icon" />
          </div>
        </div>
      );
    });

    return (
      <div className="forecast-container">
        <div className="forecast-header">
          <div>Date</div>
          <div>Average Temperature (&deg;C)</div>
          <div>Description</div>
        </div>
        {forecastDivs}
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
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
            {getForecastDivData()}
          </div>
        </>
      ) : (
        <p>Enter a city name and API key, then click &quot;Get Weather&quot;</p>
      )}
    </div>
  );
};

export default Weather;
