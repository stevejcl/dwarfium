import { useState } from "react";
import React from "react";
import Link from "next/link";

function WeatherTemperature(props) {
  let [unit, setUnit] = useState("celsius");
  function showFahrenheit(event) {
    event.preventDefault();
    setUnit("fahrenheit");
  }
  function showCelsius(event) {
    event.preventDefault();
    setUnit("celsius");
  }

  if (unit === "celsius") {
    return (
      <div className="WeatherTemperature">
        <span className="units">
          {" "}
          ºC |{" "}
          <Link href="/" onClick={showFahrenheit}>
            ºF
          </Link>
        </span>
        <p className="Temperature">{Math.round(props.celsius)} ºC</p>
      </div>
    );
  } else {
    let fahrenheit = (props.celsius * 9) / 5 + 32;
    return (
      <div className="WeatherTemperature">
        <span className="units">
          <Link href="/" onClick={showCelsius}>
            ºC{" "}
          </Link>
          | ºF
        </span>{" "}
        <p className="Temperature">{Math.round(fahrenheit)} ºF</p>
      </div>
    );
  }
}

export default WeatherTemperature;
