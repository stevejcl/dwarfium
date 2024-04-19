import React from "react";
import { ArraySensorDataInterface } from "@/lib/witmotion/Interfaces";
import { SingleGraph } from "./SingleGraph";
import Grid2 from "@mui/material/Unstable_Grid2";

interface GraphsInterface {
  inputData: ArraySensorDataInterface;
}

export const Graphs: React.FC<GraphsInterface> = ({ inputData }) => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={8}>
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

        <SingleGraph
          counter={inputData.counter}
          x={inputData.ang.x}
          y={inputData.ang.y}
          z={inputData.ang.z}
          title={"Angle"}
        />
      </Grid2>
    </Grid2>
  );
};
