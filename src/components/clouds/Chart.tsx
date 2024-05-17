import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

export interface ChartDataProps {
  forecastTimes: string[];
  cloudArray: string[];
  humidityArray: string[];
  windArray: string[];
}

const Chart = ({
  forecastTimes,
  cloudArray,
  humidityArray,
  windArray,
}: ChartDataProps) => {
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
    <div className="chart-container">
      <Line
        data={{
          labels: forecastTimes,
          datasets: [
            {
              label: t("cCloudsChartCloudCover"),
              data: cloudArray,
              fill: false,
              borderColor: "rgba(255, 99, 132, 0.8)",
              tension: 0.4,
            },
            {
              label: t("cCloudsChartHumidity"),
              data: humidityArray,
              fill: false,
              borderColor: "rgba(54, 162, 235, 0.8)",
              tension: 0.4,
            },
            {
              label: t("cCloudsChartWindSpeed"),
              data: windArray,
              fill: false,
              borderColor: "rgba(255, 206, 86, 0.8)",
              tension: 0.4,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: t("cCloudsChartForecast"),
              font: {
                size: 24,
                weight: "bold",
              },
              padding: 20,
              color: "#fff",
            },
            legend: {
              display: true,
              labels: {
                font: {
                  size: 16,
                },
                padding: 10,
                color: "#fff",
              },
            },
          },
          scales: {
            x: {
              display: true,
              grid: {
                display: true,
                color: "rgba(255, 255, 255, 0.2)",
              },
              ticks: {
                color: "white",
                font: {
                  size: 14,
                },
              },
            },
            y: {
              display: true,
              grid: {
                display: true,
                color: "rgba(255, 255, 255, 0.2)",
              },
              ticks: {
                color: "white",
                font: {
                  size: 14,
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Chart;
