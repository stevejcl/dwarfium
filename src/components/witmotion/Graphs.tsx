//import { useState } from "react";
import React from "react";
import { ArraySensorDataInterface } from "@/lib/witmotion/Interfaces";
import { SingleGraph } from "./SingleGraph";
import Grid2 from "@mui/material/Unstable_Grid2";
//import DwarfCameras from "@/components/DwarfCameras";
interface GraphsInterface {
    inputData: ArraySensorDataInterface;
}
//const [showWideangle] = useState(false);
//const [useRawPreviewURL] = useState(false);

export const Graphs: React.FC<GraphsInterface> = ({ inputData }) => {
    {/*const calculateDirection = (angleZ: number) => {
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
    */}
    return (
        <Grid2 container spacing={4}>
            {/* <Grid2 md={8} xs={12}>
                <SingleGraph
                    counter={inputData.counter}
                    x={inputData.axc.x}
                    y={inputData.axc.y}
                    z={inputData.axc.z}
                    title={"Accelerometer"}
                />
            </Grid2>
            <Grid2 md={8} xs={12}>
                <SingleGraph
                    counter={inputData.counter}
                    x={inputData.vel.x}
                    y={inputData.vel.y}
                    z={inputData.vel.z}
                    title={"Angular velocity"}
                />
            </Grid2> */}
            <Grid2 md={8} xs={12}>
                <SingleGraph
                    counter={inputData.counter}
                    x={inputData.ang.x}
                    y={inputData.ang.y}
                    z={inputData.ang.z}
                    title={"Angle"}
                />
            </Grid2>
            <Grid2 md={4} xs={12}>
                <div className="camera-witmotion">
                   
                    <h3>Camera</h3>
                    <main className="col">
                        {/* <DwarfCameras
                            //showWideangle={showWideangle}
                            //useRawPreviewURL={useRawPreviewURL}
                            //showControls={true}
                        /> */}
                    </main>
                </div>
            </Grid2>
            <Grid2 md={8} xs={12} container justifyContent="space-between">
                <div>
                    <p>Angle Y: {inputData.ang.y[0].toFixed(2)}°</p>
                </div>
                {/*<div>
                    <h3>Direction</h3>
                    <p>{calculateDirection(inputData.ang.z[0])}</p>
                </div>*/}
            </Grid2>
        </Grid2>
    );
};
