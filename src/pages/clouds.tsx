import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomChart from "@/components/clouds/Chart";
import Daypicker from "@/components/clouds/Daypicker";

const Clouds = () => {
  const [forecastTimes, setForecastTimes] = useState<string[]>([]);
  const [cloudArray, setCloudArray] = useState<string[]>([]);
  const [humidityArray, setHumidityArray] = useState<number[]>([]);
  const [windArray, setWindArray] = useState<number[]>([]);
  const [apiKey, setApiKey] = useState(
    typeof window !== "undefined" ? localStorage.getItem("apiKey") || "" : ""
  );
  const [city, setCity] = useState(
    typeof window !== "undefined" ? localStorage.getItem("city") || "" : ""
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [initialRequestMade, setInitialRequestMade] = useState(false);
  const [apiRequestCount, setApiRequestCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    if (city && apiKey) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
        )
        .then((response) => {
          setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setHours(23, 0, 0, 0);
            return newDate;
          });

          const weatherTonight = response.data.list.filter((weathersingle) => {
            const currentTime = new Date(weathersingle.dt * 1000).getTime();
            const lowerBound = selectedDate.getTime() - 3600000 * 6;
            const upperBound = selectedDate.getTime() + 3600000 * 12;
            return currentTime >= lowerBound && currentTime <= upperBound;
          });

          setForecastTimes(
            weatherTonight.map((hr) => hr.dt_txt.substring(11, 16))
          );
          setCloudArray(weatherTonight.map((hr) => hr.clouds.all));
          setHumidityArray(weatherTonight.map((hr) => hr.main.humidity));
          setWindArray(weatherTonight.map((hr) => hr.wind.speed));

          setInitialRequestMade(true);
          setApiRequestCount(1);
        })
        .catch((error) => setError(error.message));
    }
  }, [city, apiKey, selectedDate]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setInitialRequestMade(false);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setInitialRequestMade(false);
  };

  const handleApiKeySave = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.setItem("apiKey", apiKey);
  };

  return (
    <>
      {error && <div>{error}</div>}
      {isClient && (
        <section className="daily-horp d-inline-block w-100">
          <div className="container">
            <br />
            <br />
            <br />
            <br />
            <form className="searchform">
              <div className="Weather">
                <div className="row">
                  <div className="col-sm-6 col-md-3 mb-3">
                    <input
                      type="search"
                      value={city}
                      placeholder="Enter a city..."
                      className="form-control-weather"
                      autoFocus={true}
                      onChange={handleCityChange}
                    />
                  </div>
                  {apiKey && (
                    <>
                      <div className="col-sm-6 col-md-3 mb-3">
                        <input
                          type="text"
                          value={apiKey}
                          placeholder="Enter API-key"
                          className="form-control-weather"
                          onChange={handleApiKeyChange}
                                              />

                      </div>
                      <div className="col-api-clouds mb-3">
                        <button
                          type="submit"
                          className="btn btn-more02 w-40"
                          onClick={handleApiKeySave}
                        >
                          Save API Key
                        </button>
                      </div>
                    </>
                  )}
                  <div className="col-1">
                    <Daypicker
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <CustomChart
            forecastTimes={forecastTimes}
            cloudArray={cloudArray}
            humidityArray={humidityArray.map(String)}
            windArray={windArray.map(String)}
          />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </section>
      )}
      <div>API Requests Made: {apiRequestCount}</div>
    </>
  );
};

export default Clouds;
