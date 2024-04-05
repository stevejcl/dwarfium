import React, { useState, useEffect } from "react";
import { Moon } from "lunarphase-js";

const MoonPhaseCalculator = ({ date }) => {
  const [moonPhase, setMoonPhase] = useState<string | null>(null);
  const [moonImage, setMoonImage] = useState<string | null>(null);

  useEffect(() => {
    calculateMoonPhase();
  }, [date]);

  const calculateMoonPhase = () => {
    if (!date) return;

    const phase = Moon.lunarPhase(date);
    setMoonPhase(getMoonPhaseName(phase));

    const age = Moon.lunarAge(date);

    const imageName = `Moon-${Math.floor(age)}.jpg`;
    setMoonImage(imageName);
  };

  const getMoonPhaseName = (phase) => {
    if (phase === "New") {
      return "New Moon";
    } else if (phase === "Waxing Crescent") {
      return "Waxing Crescent";
    } else if (phase === "First Quarter") {
      return "First Quarter";
    } else if (phase === "Waxing Gibbous") {
      return "Waxing Gibbous";
    } else if (phase === "Full") {
      return "Full Moon";
    } else if (phase === "Waning Gibbous") {
      return "Waning Gibbous";
    } else if (phase === "Last Quarter") {
      return "Last Quarter";
    } else if (phase === "Waning Crescent") {
      return "Waning Crescent";
    } else {
      return "Unknown";
    }
  };

  return (
    <div>
      <div>{moonPhase}</div>
      {moonImage && (
        <img src={`../assets/images/Moon/${moonImage}`} alt="Moon" />
      )}
    </div>
  );
};

export default MoonPhaseCalculator;
