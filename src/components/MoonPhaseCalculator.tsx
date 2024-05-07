import React, { useState, useEffect } from "react";
import { Moon } from "lunarphase-js";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const MoonPhaseCalculator = ({ date }) => {
  const [moonPhase, setMoonPhase] = useState<string | null>(null);
  const [moonImage, setMoonImage] = useState<string | null>(null);

  useEffect(() => {
    calculateMoonPhase();
  }, [date]);

  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

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
      return t("cMoonphaseCalculatorNewMoon");
    } else if (phase === "Waxing Crescent") {
      return t("cMoonphaseCalculatorWaxingCrescent");
    } else if (phase === "First Quarter") {
      return t("cMoonphaseCalculatorFirstQuarter");
    } else if (phase === "Waxing Gibbous") {
      return t("cMoonphaseCalculatorWaxingGibbous");
    } else if (phase === "Full") {
      return t("cMoonphaseCalculatorFullMoon");
    } else if (phase === "Waning Gibbous") {
      return t("cMoonphaseCalculatorWaningGibbous");
    } else if (phase === "Last Quarter") {
      return t("cMoonphaseCalculatorLastQuarter");
    } else if (phase === "Waning Crescent") {
      return t("cMoonphaseCalculatorWaningCrescent");
    } else {
      return t("cMoonphaseCalculatorUnknown");
    }
  };

  return (
    <div className="prosA">
      <div className="prosP">{moonPhase}</div>
      {moonImage && (
        <img
          className="moonimg"
          src={`../assets/images/Moon/${moonImage}`}
          alt="Moon"
        />
      )}
    </div>
  );
};

export default MoonPhaseCalculator;
