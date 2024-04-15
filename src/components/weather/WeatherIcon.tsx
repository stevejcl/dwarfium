import React from "react";
import ReactAnimatedWeather from "react-animated-weather";

function WeatherIcon(props) {
  const icon = props;

  if (!icon) {
    return null;
  }

  const iconCodeMapping = {
    "01d": "CLEAR_DAY",
    "01n": "CLEAR_NIGHT",
    "02d": "PARTLY_CLOUDY_DAY",
    "02n": "PARTLY_CLOUDY_NIGHT",
    "03d": "CLOUDY",
    "03n": "CLOUDY",
    "04d": "CLOUDY",
    "04n": "CLOUDY",
    "09d": "RAIN",
    "09n": "RAIN",
    "10d": "RAIN",
    "10n": "RAIN",
    "11d": "RAIN",
    "11n": "RAIN",
    "13d": "SNOW",
    "13n": "SNOW",
    "50d": "FOG",
    "50n": "FOG",
  };
  return (
    <ReactAnimatedWeather
      icon={iconCodeMapping[props.icon]}
      color="#D5CFD3"
      size={62}
      animate={true}
    />
  );
}

export default WeatherIcon;
