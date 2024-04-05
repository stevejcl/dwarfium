import React, { useState, useEffect } from "react";
import MoonPhaseCalculator from "../components/MoonPhaseCalculator";

export default function Moonphase() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentYear}-${currentMonth}`
  );
  const [selectedCity, setSelectedCity] = useState("");

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  useEffect(() => {}, [selectedMonth, selectedCity]);

  const renderMoonPhasesTable = () => {
    const [year, month] = selectedMonth.split("-");
    const daysCount = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // Get the day of the week for the first day of the month (0 for Sunday, 1 for Monday, etc.)
    const moonPhasesTable = [];

    let currentDay = 1; // Initialize the current day to 1

    for (let row = 0; row < 5; row++) {
      const rowData = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (row === 0 && dayOfWeek < firstDayOfMonth) {
          // If it's the first row and the current day of the week is before the first day of the month, display an empty cell
          rowData.push(<td key={dayOfWeek}></td>);
        } else if (currentDay <= daysCount) {
          // Display the current day
          const date = new Date(year, parseInt(month) - 1, currentDay);
          const phase = <MoonPhaseCalculator date={date} city={selectedCity} />;
          const phaseName = phase.toString().toLowerCase().replace(" ", "-");
          const imagePath = `/assets/images/${phaseName}-realistic.png`;
          rowData.push(
            <td key={currentDay}>
              <div className="moon-phase">
                {currentDay}
                {phase}
              </div>
            </td>
          );
          currentDay++; // Move to the next day
        } else {
          // If all days have been displayed, display an empty cell
          rowData.push(<td key={dayOfWeek}></td>);
        }
      }
      moonPhasesTable.push(<tr key={row}>{rowData}</tr>);
    }

    return moonPhasesTable;
  };

  return (
    <div>
      <section className="daily-horp d-inline-block w-100">
        <div className="level">
          <div className="month-input">
            <label htmlFor="start" className="is-size-3">
              Select Month :
            </label>
            <input
              type="month"
              id="start"
              name="start"
              min="2024-01"
              defaultValue="2024-01"
              onChange={handleChange}
            />
          </div>
          <div className="city-input">
            <label htmlFor="city" className="is-size-3">
              Select City :
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={selectedCity}
              onChange={handleCityChange}
            />
          </div>
        </div>
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
      </section>
    </div>
  );
}
