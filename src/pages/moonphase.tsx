import React, { useState } from "react";
import MoonPhaseCalculator from "../components/MoonPhaseCalculator";
import { useTranslation } from "react-i18next";
//import i18n from "@/i18n";
import SunCalc from "suncalc";

const API_KEY = ""; // Vervang dit met je eigen API-key

export default function Moonphase() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${currentMonth}`);
    const { t } = useTranslation();

    // Standaardinstellingen voor locatie
    const [city, setCity] = useState("Brussel");
    const [latitude, setLatitude] = useState(50.85045);
    const [longitude, setLongitude] = useState(4.34878);

    // Haal coördinaten op van OpenWeatherMap API
    const fetchCoordinates = async (cityName: string) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
            );
            const data = await response.json();
            if (data.coord) {
                setLatitude(data.coord.lat);
                setLongitude(data.coord.lon);
            } else {
                alert("Stad niet gevonden. Probeer een andere naam.");
            }
        } catch (error) {
            console.error("Fout bij ophalen van coördinaten:", error);
        }
    };

    // Bij veranderen van de stad in het invoerveld
    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    // Zoek stad en update coördinaten
    const handleSearch = () => {
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
                    const toLocalTime = (date: Date | null): string => {
                        if (!date) return "-";
                        return new Intl.DateTimeFormat("nl-NL", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Europe/Amsterdam",
                        }).format(date);
                    };

                    const moonrise = toLocalTime(moonTimes.rise);
                    const moonset = toLocalTime(moonTimes.set);

                    // Maanzichtbaarheid en afstand tot aarde
                    const moonIllumination = SunCalc.getMoonIllumination(date).fraction * 100;
                    const moonDistance = SunCalc.getMoonPosition(date, latitude, longitude).distance.toFixed(0);

                    rowData.push(
                        <td key={`day-${year}-${month}-${currentDay}`} className="moon-cell">
                            <div className="moon-phase">
                                <strong>{currentDay} {date.toLocaleString('default', { month: 'short' }).toUpperCase()}</strong>
                                {phase}
                                <div className="moon-times">
                                    <div><span>🌙</span> {t("pMoonphaseMoonrise")}: {moonrise}</div>
                                    <div><span>🌘</span> {t("pMoonphaseMoonset")}: {moonset}</div>
                                    <div><span>🔆</span> {t("pMoonphaseVisibility")}: {moonIllumination.toFixed(1)}%</div>
                                    <div><span>🌍</span> {t("pMoonphaseDistance")}: {moonDistance} km</div>
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
                                    value={city}
                                    onChange={handleCityChange}
                                    placeholder="Voer een stad in..."
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
                                    <th>Sun</th>
                                    <th>Mon</th>
                                    <th>Tue</th>
                                    <th>Wed</th>
                                    <th>Thu</th>
                                    <th>Fri</th>
                                    <th>Sat</th>
                                </tr>
                            </thead>
                            <tbody>{renderMoonPhasesTable()}</tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
