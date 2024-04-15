import React from "react";
import FormattedDate from "./FormattedDate";
import WeatherIcon from "./WeatherIcon";
import WeatherTemperature from "./WeatherTemperature";

function WeatherInfo(props) {
  return (
    <div className="WeatherInfo">
      <h1>{props.infoData.city}</h1>
      <ul>
        <li>
          Last updated:
          <div className="update">
            <FormattedDate date={props.infoData.date} />
          </div>
        </li>
        <li className="text-capitalize">{props.infoData.description}</li>
      </ul>
      <div className="row mt-3">
        <div className="col-6">
          <WeatherIcon code={props.infoData.icon} size={62} />
          <WeatherTemperature celsius={props.infoData.temperature} />
        </div>
        <div className="col-6">
          <ul>
            <li>
              <svg
                className="svg-temp"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 30 30"
              >
                <path d="M12,23a3,3,0,0,1-6,0Z" transform="translate(0 0)" />
                <path
                  d="M30,22H15.9192A7.0107,7.0107,0,0,0,14,18.1108V7A5,5,0,0,0,4,7V18.1108A6.9946,6.9946,0,1,0,15.92,24H30ZM9,28a4.9933,4.9933,0,0,1-3.332-8.7183L6,18.9834V7a3,3,0,0,1,6,0V18.9834l.332.2983A4.9933,4.9933,0,0,1,9,28Z"
                  transform="translate(0 0)"
                />
              </svg>{" "}
              Min Temp: {Math.round(props.infoData.temp_min)} &deg;C
            </li>
            <li>
              <svg
                className="svg-temp"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 30 30"
              >
                <path d="M12,23a3,3,0,0,1-6,0Z" transform="translate(0 0)" />
                <path
                  d="M10,20.1839V7H8V20.1839a3,3,0,1,0,2,0Z"
                  transform="translate(0 0)"
                />
                <path
                  d="M30,4H12.9744A4.9829,4.9829,0,0,0,4,7V18.1108a7,7,0,1,0,10,0V7a5.0019,5.0019,0,0,0-.1011-1H30ZM9,28a4.9933,4.9933,0,0,1-3.332-8.7183L6,18.9834V7a3,3,0,0,1,6,0V18.9834l.332.2983A4.9933,4.9933,0,0,1,9,28Z"
                  transform="translate(0 0)"
                />
              </svg>{" "}
              Max Temp: {Math.round(props.infoData.temp_max)} &deg;C
            </li>

            <li>
              <svg
                className="svg-temp"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M523-580v-60h230v60H523Zm0-120v-60h320v60H523ZM296-121q-75.53 0-128.765-53.235Q114-227.47 114-303q0-48 24-90.5t66-68.5v-286q0-38.333 26.765-65.167 26.764-26.833 65-26.833Q334-840 361-813.167q27 26.834 27 65.167v286q42 26 66 68.5t24 90.5q0 75.53-53.235 128.765Q371.53-121 296-121ZM174-303h244q0-40-19-71.5T348-420l-20-9v-319q0-13.6-9.2-22.8-9.2-9.2-22.8-9.2-13.6 0-22.8 9.2-9.2 9.2-9.2 22.8v319l-20 9q-32 14-51 46t-19 71Z" />
              </svg>{" "}
              Feels Like: {Math.round(props.infoData.feels_like)} &deg;C
            </li>
            <li>
              <svg
                className="svg-temp"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M480-100q-133 0-226.5-91.709T160-415q0-63.142 24.5-120.771Q209-593.401 254-637.5L480-860l226 222.5q45 44.099 69.5 101.729Q800-478.142 800-415q0 131.582-93.5 223.291T480-100Zm-.235-60Q588-160 664-234.067q76-74.067 76-181.113Q740-466 720.5-512 701-558 666-593L480-776 294-593q-35 35-54.5 80.996-19.5 45.995-19.5 96.861Q220-308 295.765-234q75.764 74 184 74Z" />
              </svg>{" "}
              Humidity: {props.infoData.humidity} %
            </li>
            <li>
              <svg
                className="svg-temp"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13 5.5C13 3.57 11.43 2 9.5 2 7.466 2 6.25 3.525 6.25 5h2c0-.415.388-1 1.25-1 .827 0 1.5.673 1.5 1.5S10.327 7 9.5 7H2v2h7.5C11.43 9 13 7.43 13 5.5zm2.5 9.5H8v2h7.5c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5c-.862 0-1.25-.585-1.25-1h-2c0 1.475 1.216 3 3.25 3 1.93 0 3.5-1.57 3.5-3.5S17.43 15 15.5 15z"></path>
                <path d="M18 5c-2.206 0-4 1.794-4 4h2c0-1.103.897-2 2-2s2 .897 2 2-.897 2-2 2H2v2h16c2.206 0 4-1.794 4-4s-1.794-4-4-4zM2 15h4v2H2z"></path>
              </svg>{" "}
              Wind: {Math.round(props.infoData.wind)} kmh
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WeatherInfo;
