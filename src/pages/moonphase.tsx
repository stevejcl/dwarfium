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
          rowData.push(<td key={dayOfWeek}></td>);
        } else if (currentDay <= daysCount) {
          const date = new Date(year, month - 1, currentDay);
          const phase = <MoonPhaseCalculator date={date} />;
          rowData.push(
            <td key={currentDay}>
              <div className="moon-phase">
                {currentDay}
                {phase}
              </div>
            </td>
          );
          currentDay++;
        } else {
          rowData.push(<td key={dayOfWeek}></td>);
        }
      }
      if (rowData.length > 0) {
        moonPhasesTable.push(<tr key={row}>{rowData}</tr>);
      }
    }

    return moonPhasesTable;
  };

  return (
    <div>
      <section className="daily-horp d-inline-block w-100">
        <div className="container">
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
            <label htmlFor="start" className="is-size-3">
              Select Month :
            </label>
            <input
              type="month"
              id="start"
              name="start"
              min="2024-01"
              value={selectedMonth}
              onChange={handleChange}
            />
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
        </div>
      </section>
    </div>
  );
}
