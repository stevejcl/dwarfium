import React from "react";
import { ArraySensorDataInterface } from "@/lib/witmotion/Interfaces";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

interface GraphsInterface {
  inputData: ArraySensorDataInterface;
}

export const Graphs: React.FC<GraphsInterface> = ({ inputData }) => {
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

  return (
    <>
      <Grid2 container spacing={4}>
        <Grid2 md={9} xs={12} className="camera-container">
          <div className="camera-witmotion">
            <div>
              <p>
                {t("cWitmotionAltitude")}: {inputData.ang.y[0].toFixed(2)}°
              </p>
            </div>
          </div>
        </Grid2>
      </Grid2>
      {""}
      <br />
      <br />
      <br />
    </>
  );
};
