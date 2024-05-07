import React from "react";
import FormattedDate from "./FormattedDate";
import WeatherIcon from "./WeatherIcon";
import WeatherTemperature from "./WeatherTemperature";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

function WeatherInfo(props) {
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
        <div className="WeatherInfo">
            <h1>{props.infoData.city}</h1>
            <ul>
                <li>
                    {t("cWeatherInfoLastUpdate")}
                    <div className="update">
                        <FormattedDate date={props.infoData.date} />
                    </div>
                </li>
                <li className="text-capitalize">{props.infoData.description}</li>
            </ul>
            <div className="row mt-3">
                <div className="col-md-6">
                    <div className="canvas-info">
                        <div className="canvas-info-content">
                            <WeatherIcon icon={props.infoData.icon} size={62} />
                        </div>
                    </div>
                    <WeatherTemperature celsius={props.infoData.temperature} />
                </div>
                <div className="col-md-6">
                    <ul>
                        <li>
                            <svg
                                className="svg-temp"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 30 30"
                            >
                                {/* Temperature SVG */}
                            </svg>{" "}
                            {t("cWeatherInfoMinTemp")} {Math.round(props.infoData.temp_min)} &deg;C
                        </li>
                        <li>
                            <svg
                                className="svg-temp"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 30 30"
                            >
                                {/* Temperature SVG */}
                            </svg>{" "}
                            {t("cWeatherInfoMaxTemp")} {Math.round(props.infoData.temp_max)} &deg;C
                        </li>
                        <li>
                            <svg
                                className="svg-temp"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 30 30"
                            >
                                {/* Humidity SVG */}
                            </svg>{" "}
                            {t("cWeatherInfoFeelsLike")} {Math.round(props.infoData.feels_like)} &deg;C
                        </li>
                        <li>
                            <svg
                                className="svg-temp"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 30 30"
                            >
                                {/* Humidity SVG */}
                            </svg>{" "}
                            {t("cWeatherInfoHumidity")} {props.infoData.humidity} %
                        </li>
                        <li>
                            <svg
                                className="svg-temp"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 30 30"
                            >
                                {/* Wind SVG */}
                            </svg>{" "}
                            {t("cWeatherInfoWind")} {Math.round(props.infoData.wind)} km/h
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default WeatherInfo;
