import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomChart from "@/components/clouds/Chart";
import Daypicker from "@/components/clouds/Daypicker";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

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
  const [initialRequestMade, setInitialRequestMade] = useState(false);
  const [apiRequestCount, setApiRequestCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const cityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);

    const fetchData = async () => {
      if (city && apiKey) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
          );

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
          setApiRequestCount((prevCount) => prevCount + 1);
          console.log(
            "API Request Successful. Total API Requests Made:",
            apiRequestCount + 1
          );
        } catch (error: any) {
          if (error.response && error.response.status === 429) {
            setErrorMessage(
              "Too many requests. Please wait before trying again."
            );
          } else if (error.response && error.response.status === 500) {
            setErrorMessage("Internal server error. Please try again later.");
          } else {
            setError(error.message);
            console.error("API Request Failed:", error.message);
          }
        }
      }
    };

    if (!initialRequestMade && city && apiKey) {
      fetchData();
    }
  }, [city, apiKey, selectedDate, initialRequestMade, apiRequestCount]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setInitialRequestMade(false);
    setErrorMessage("");
  };

  const handleApiKeySave = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.setItem("apiKey", apiKey);
    setInitialRequestMade(false);
    setErrorMessage("");
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchData();
  };

  const handleSearchWithCityChange = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const newCityValue = cityInputRef.current?.value || "";
    setCity(newCityValue);
    handleSearch(e);
  };

  // eslint-disable-next-line no-unused-vars
  const handleDateChange = (newDate: Date | ((prevState: Date) => Date)) => {
    if (typeof newDate === "function") {
      setSelectedDate((prevState) => newDate(prevState));
    } else {
      setSelectedDate(newDate);
    }
    setInitialRequestMade(false);
    setErrorMessage("");
  };

  const fetchData = async () => {
    setErrorMessage("");
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
      );

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

      setForecastTimes(weatherTonight.map((hr) => hr.dt_txt.substring(11, 16)));
      setCloudArray(weatherTonight.map((hr) => hr.clouds.all));
      setHumidityArray(weatherTonight.map((hr) => hr.main.humidity));
      setWindArray(weatherTonight.map((hr) => hr.wind.speed));

      setInitialRequestMade(true);
      setApiRequestCount((prevCount) => prevCount + 1);
      console.log(
        "API Request Successful. Total API Requests Made:",
        apiRequestCount + 1
      );
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        setErrorMessage("Too many requests. Please wait before trying again.");
      } else if (error.response && error.response.status === 500) {
        setErrorMessage("Internal server error. Please try again later.");
      } else {
        setError(error.message);
        console.error("API Request Failed:", error.message);
      }
    }
  };
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
      {isClient && (
        <section className="d-inline-block w-100">
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
                      defaultValue={city}
                      ref={cityInputRef}
                      placeholder={t("cCloudsCityInput")}
                      className="form-control-weather"
                      autoFocus={true}
                    />
                  </div>
                  <div className="col-1">
                    <button
                      type="button"
                      className="btn btn-more02 w-40"
                      onClick={handleSearchWithCityChange}
                    >
                      {t("cCloudsSearch")}
                    </button>
                  </div>
                  {apiKey && (
                    <>
                      <div className="col-sm-6 col-md-3 mb-3">
                        <input
                          type="text"
                          value={apiKey}
                          placeholder={t("cCloudsApiKeyInput")}
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
                          {t("cCloudsSaveAPIKey")}
                        </button>
                      </div>
                    </>
                  )}
                  <div className="col-1">
                    <Daypicker
                      selectedDate={selectedDate}
                      setSelectedDate={handleDateChange}
                    />
                  </div>
                </div>
              </div>
            </form>
            {error && <div>{error}</div>}
            {errorMessage && <div>{errorMessage}</div>}
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
    </>
  );
};

export default Clouds;
