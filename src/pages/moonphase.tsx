import React, { useState, useRef, useEffect } from "react";
import MoonPhaseCalculator from "../components/MoonPhaseCalculator";
import { useTranslation } from "react-i18next";
//import i18n from "@/i18n";
import SunCalc from "suncalc";

export default function Moonphase() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentYear}-${currentMonth}`
  );
  const { t } = useTranslation();
  const [apiKey] = useState(
    typeof window !== "undefined" ? localStorage.getItem("apiKey") || "" : ""
  );
  const [city, setCity] = useState(
    typeof window !== "undefined" ? localStorage.getItem("city") || "" : ""
  );
  const cityInputRef = useRef<HTMLInputElement>(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [timezoneOffset, setTimezoneOffset] = useState(0);

  useEffect(() => {
    if (apiKey && city) {
      fetchCoordinates(city);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Haal coördinaten op van OpenWeatherMap API
  const fetchCoordinates = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.coord) {
        setLatitude(data.coord.lat);
        setLongitude(data.coord.lon);
        setTimezoneOffset(data.timezone);
        setCity(data.name), localStorage.setItem("city", data.name);
      } else {
        alert(t("cCloudsCityNotFound"));
      }
    } catch (error) {
      console.error("Error retrieving coordinates:", error);
    }
  };

  const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newCityValue = cityInputRef.current?.value || "";
    setCity(newCityValue);
  };

  // Zoek stad en update coördinaten
  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchCoordinates(city);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
  };

  const renderMoonPhasesTable = () => {
    const [yearStr, monthStr] = selectedMonth.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const daysCount = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const moonPhasesTable: React.ReactNode[] = [];

    let currentDay = 1;

    for (let row = 0; row < 5; row++) {
      const rowData: React.JSX.Element[] = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (row === 0 && dayOfWeek < firstDayOfMonth) {
          rowData.push(<td key={`empty-${row}-${dayOfWeek}`}></td>);
        } else if (currentDay <= daysCount) {
          const date = new Date(year, month - 1, currentDay);
          const phase = <MoonPhaseCalculator date={date} />;

          // Maanopgang en ondergang berekenen
          const moonTimes = SunCalc.getMoonTimes(date, latitude, longitude);
          const adjustMoonTimesToLocal = (
            moonTimes: { rise: Date | null; set: Date | null },
            timezoneOffset: number
          ): { rise: Date | null; set: Date | null } => {
            if (!moonTimes.rise || !moonTimes.set)
              return { rise: null, set: null };
            const date = new Date(); // Current date and time
            const localTimezoneOffset = date.getTimezoneOffset() * 60; // negative for GMT + X
            // Apply the timezone offset to the moon rise and set times (in seconds)
            const adjustedMoonTimes = {
              rise: moonTimes.rise
                ? new Date(
                    moonTimes.rise.getTime() +
                      (timezoneOffset + localTimezoneOffset) * 1000
                  )
                : null,
              set: moonTimes.set
                ? new Date(
                    moonTimes.set.getTime() +
                      (timezoneOffset + localTimezoneOffset) * 1000
                  )
                : null,
            };
            return adjustedMoonTimes;
          };
          // Function to format the date as a string
          const formatDate = (date: Date | null): string => {
            if (!date) return "-";

            return new Intl.DateTimeFormat(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            }).format(date);
          };
          const localMoonTimes = adjustMoonTimesToLocal(
            moonTimes,
            timezoneOffset
          );

          const moonrise = formatDate(localMoonTimes.rise);
          const moonset = formatDate(localMoonTimes.set);

          // Maanzichtbaarheid en afstand tot aarde
          const moonIllumination =
            SunCalc.getMoonIllumination(date).fraction * 100;
          const moonDistance = SunCalc.getMoonPosition(
            date,
            latitude,
            longitude
          ).distance.toFixed(0);

          rowData.push(
            <td
              key={`day-${year}-${month}-${currentDay}`}
              className="moon-cell"
            >
              <div className="moon-phase">
                <strong>
                  {currentDay}{" "}
                  {date
                    .toLocaleString("default", { month: "short" })
                    .toUpperCase()}
                </strong>
                {phase}
                <div className="moon-times">
                  <div>
                    <span>🌙</span> {t("pMoonphaseMoonrise")}: {moonrise}
                  </div>
                  <div>
                    <span>🌘</span> {t("pMoonphaseMoonset")}: {moonset}
                  </div>
                  <div>
                    <span>🔆</span> {t("pMoonphaseVisibility")}:{" "}
                    {moonIllumination.toFixed(1)}%
                  </div>
                  <div>
                    <span>🌍</span> {t("pMoonphaseDistance")}: {moonDistance} km
                  </div>
                </div>
              </div>
            </td>
          );
          currentDay++;
        } else {
          rowData.push(<td key={`empty-${row}-${dayOfWeek}`}></td>);
        }
      }
      if (rowData.length > 0) {
        moonPhasesTable.push(<tr key={`row-${row}`}>{rowData}</tr>);
      }
    }

    return moonPhasesTable;
  };

  return (
    <div>
      <section className="d-inline-block w-100">
        <div className="container">
          <br />
          {/* Flex-container voor stad en maand selectie */}
          <div className="input-container">
            {/* Stad invoerveld + zoekknop */}
            <div className="city-input">
              <label htmlFor="city">{t("pMoonphaseSelectCity")}</label>
              <div className="city-search-box">
                <input
                  type="text"
                  id="city"
                  defaultValue={city}
                  ref={cityInputRef}
                  placeholder={t("cCloudsCityInput")}
                  onChange={handleCityInput}
                />
                <button onClick={handleSearch}>{t("pMoonphaseSearch")}</button>
              </div>
            </div>

            {/* Maand selecteren */}
            <div className="month-input">
              <label htmlFor="start">{t("pMoonphaseSelectMonth")}</label>
              <input
                type="month"
                id="start"
                name="start"
                min="2024-01"
                value={selectedMonth}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Kalender */}
          <div className="calendar">
            <table>
              <thead>
                <tr>
                  <th>{t("cMoonDaySun")}</th>
                  <th>{t("cMoonDayMon")}</th>
                  <th>{t("cMoonDayTue")}</th>
                  <th>{t("cMoonDayWed")}</th>
                  <th>{t("cMoonDayThu")}</th>
                  <th>{t("cMoonDayFri")}</th>
                  <th>{t("cMoonDaySat")}</th>
                </tr>
              </thead>
              <tbody>{latitude && longitude && renderMoonPhasesTable()}</tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
