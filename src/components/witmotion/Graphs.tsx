import React from "react";
import { ArraySensorDataInterface } from "@/lib/witmotion/Interfaces";
import { SingleGraph } from "./SingleGraph";
import Grid2 from "@mui/material/Unstable_Grid2";

interface GraphsInterface {
  inputData: ArraySensorDataInterface;
}

export const Graphs: React.FC<GraphsInterface> = ({ inputData }) => {
  const calculateDirection = (angleZ: number) => {
    let direction = "";
    if (angleZ <= -135 || angleZ > 135) {
      direction = "North";
    } else if (angleZ <= -45 && angleZ > -135) {
      direction = "East";
    } else if (angleZ > -45 && angleZ <= 45) {
      direction = "South";
    } else if (angleZ <= 135 && angleZ > 45) {
      direction = "West";
    }
    return direction;
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={4}>
        <SingleGraph
          counter={inputData.counter}
          x={inputData.axc.x}
          y={inputData.axc.y}
          z={inputData.axc.z}
          title={"Accelerometer"}
        />
      </Grid2>
      <Grid2 xs={4}>
        <SingleGraph
          counter={inputData.counter}
          x={inputData.vel.x}
          y={inputData.vel.y}
          z={inputData.vel.z}
          title={"Angular velocity"}
        />
      </Grid2>
      <Grid2 xs={4}>
        <SingleGraph
          counter={inputData.counter}
          x={inputData.ang.x}
          y={inputData.ang.y}
          z={inputData.ang.z}
          title={"Angle"}
        />
      </Grid2>

      <div>
        <p>Angle Y: {inputData.ang.y[0].toFixed(2)}°</p>
        <h3>Direction</h3>
        <p>{calculateDirection(inputData.ang.z[0])}</p>
      </div>
    </Grid2>
  );
};
