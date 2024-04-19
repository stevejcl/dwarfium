import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { SingleGraphInterface } from "@/lib/witmotion/Interfaces";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const SingleGraph: React.FC<SingleGraphInterface> = ({
  counter,
  x,
  y,
  z,
  title,
}) => {
  const options = {
    animation: {
      duration: 0,
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  let data = {
    labels: counter,
    datasets: [
      {
        label: "oX",
        data: x,
        borderColor: "rgb(255, 0, 0)",
        backgroundColor: "rgba(255, 143, 162, 0.5)",
      },
      {
        label: "oY",
        data: y,
        borderColor: "rgb(0, 128, 0)",
        backgroundColor: "rgba(102, 255, 102, 0.5)",
      },
      {
        label: "oZ",
        data: z,
        borderColor: "rgb(0, 0, 255)",
        backgroundColor: "rgba(66, 170, 255, 0.5)",
      },
    ],
  };

  return <Line options={options} data={data} />;
};
