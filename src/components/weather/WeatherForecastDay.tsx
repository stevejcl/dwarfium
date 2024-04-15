import React from "react";
import WeatherIcon from "./WeatherIcon";

interface WeatherForecastDayProps {
  data: {
    dt: number;
    weather: {
      icon: string;
    }[];
    main: {
      temp_max: number;
      temp_min: number;
    };
  };
}

const WeatherForecastDay: React.FC<WeatherForecastDayProps> = (props) => {
  function day() {
    let date = new Date(props.data.dt * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }

  return (
    <div>
      <div className="WeatherForecast-day">{day()}</div>
      <WeatherIcon icon={props.data.weather[0].icon} size={36} />
      <div className="WeatherForecast-temperatures">
        <span className="WeatherForecast-temperature__max">
          {Math.round(props.data.main.temp_max)}° |
        </span>
        <span className="WeatherForecast-temperature__min">
          {Math.round(props.data.main.temp_min)}°
        </span>
      </div>
    </div>
  );
};

export default WeatherForecastDay;
