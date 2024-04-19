import { SensorData } from "./ExtractDataFromRaw";
import { ArraySensorDataInterface } from "./Interfaces";

export const dataFlowRestriction = (
  inputData: ArraySensorDataInterface,
  data: SensorData
) => {
  if (inputData.ang.x.length >= 50) {
    inputData.axc.x.splice(0, 1);
    inputData.axc.y.splice(0, 1);
    inputData.axc.z.splice(0, 1);

    inputData.vel.x.splice(0, 1);
    inputData.vel.y.splice(0, 1);
    inputData.vel.z.splice(0, 1);

    inputData.ang.x.splice(0, 1);
    inputData.ang.y.splice(0, 1);
    inputData.ang.z.splice(0, 1);

    inputData.counter.splice(0, 1);
  }

  inputData.axc.x.push(data.acceleration.x);
  inputData.axc.y.push(data.acceleration.y);
  inputData.axc.z.push(data.acceleration.z);

  inputData.vel.x.push(data.angularVelocity.x);
  inputData.vel.y.push(data.angularVelocity.y);
  inputData.vel.z.push(data.angularVelocity.z);

  inputData.ang.x.push(data.corners.x);
  inputData.ang.y.push(data.corners.y);
  inputData.ang.z.push(data.corners.z);

  inputData.counter.push(inputData.counter[inputData.counter.length - 1] + 1);

  return {
    axc: {
      x: inputData.axc.x,
      y: inputData.axc.y,
      z: inputData.axc.z,
    },
    vel: {
      x: inputData.vel.x,
      y: inputData.vel.y,
      z: inputData.vel.z,
    },
    ang: {
      x: inputData.ang.x,
      y: inputData.ang.y,
      z: inputData.ang.z,
    },
    counter: inputData.counter,
  };
};
