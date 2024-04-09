import React from "react";
import Weather from "@/components/Weather";

const App = () => {
  return (
    <div className="daily-horp d-inline-block w-100">
      <div className="container">
        <h1>Weather Forecast App</h1>
        <Weather />
      </div>
    </div>
  );
};

export default App;
