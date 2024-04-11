import React from "react";
import Weather from "@/components/Weather";

export default function WeatherForeCast() {
  return (
    <div className="daily-horp d-inline-block w-100">
      <div className="forecast-container-main">
        <h1>Weather Forecast</h1>
        <Weather />
      </div>
    </div>
  );
}
