import React, { useState } from "react";
import WeatherInfo from "./weather/WeatherInfo";
import WeatherForecast from "./weather/WeatherForecast";
import axios from "axios";

function Weather(props) {
    const [cityInput, setCityInput] = useState("");
    const [weatherData, setWeatherData] = useState({ ready: false });
    const [city, setCity] = useState(props.defaultCity);

    function handleResponse(response) {
        console.log(response.data);
        setWeatherData({
            ready: true,
            coordinates: response.data.coord,
            city: response.data.name,
            date: new Date(response.data.dt * 1000),
            temperature: response.data.main.temp,
            temp_min: response.data.main.temp_min,
            temp_max: response.data.main.temp_max,
            feels_like: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            wind: response.data.wind.speed,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            
            
        });
    }
    function search() {
        const apiKey = "";
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        axios.get(apiUrl).then(handleResponse);
    }

    function handleSubmit(event) {
        event.preventDefault();
        search();
        setCityInput("");
        // Search for a city
    }

    function handleCityInput(event) {
        setCity(event.target.value);
        setCityInput(event.target.value);
    }

    if (weatherData.ready) {
        return (
            <div className="Weather">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-3">
                            <input
                                type="search"
                                value={cityInput}
                                placeholder="Enter a city..."
                                className="form-control-weather"
                                autoFocus="on"
                                onChange={handleCityInput}
                            />
                        </div>
                        <div className="col-search">
                            <input
                                type="submit"
                                value="Search"
                                className="btn btn-more02 w-100"
                            />
                        </div>
                        <div className="col-3">
                            <input
                                type="text"
                                //value={apiKey}
                                //onChange={handleApiKeyChange}
                                placeholder="Enter API-key"
                                className="form-control-weather"
                               
                            />
                        </div>
                        <div className="col-search">
                            <input
                                type="submit"
                                value="Save"
                                className="btn btn-more02 w-100"
                            />
                        </div>
                    </div>
                </form>
                <WeatherInfo infoData={weatherData} />
                <WeatherForecast coordinates={weatherData.coordinates} />
            </div>
        );
    } else {
        search();

        return <div>Loading...<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /></div>;

    }
}

export default Weather;
