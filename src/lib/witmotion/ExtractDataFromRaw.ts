import { Buffer } from "buffer";

const divider = 32768.0;

export interface SensorData {
  acceleration: Coordinates;
  angularVelocity: Coordinates;
  corners: Coordinates;
}

interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export function extractDataFromRaw(raw: Uint8Array): SensorData {
  const length = raw.length;
  let accelerationDecoded: number[] = [];
  let angularVelocityDecoded: number[] = [];
  let cornersDecoded: number[] = [];
  let decoded: number[] = [];

  for (let i = 2; i < length; i = i + 2) {
    let buffer = Buffer.from(raw.slice(i, i + 2));
    decoded = decoded.concat(buffer.readInt16LE(0));
  }

  for (let i = 0; i < 3; i++) {
    accelerationDecoded[i] = (decoded[i] / divider) * 16;
    angularVelocityDecoded[i] = (decoded[i + 3] / divider) * 2000;
    cornersDecoded[i] = (decoded[i + 6] / divider) * 180;
  }

  return {
    acceleration: {
      x: accelerationDecoded[0],
      y: accelerationDecoded[1],
      z: accelerationDecoded[2],
    },
    angularVelocity: {
      x: angularVelocityDecoded[0],
      y: angularVelocityDecoded[1],
      z: angularVelocityDecoded[2],
    },
    corners: {
      x: cornersDecoded[0],
      y: cornersDecoded[1],
      z: cornersDecoded[2],
    },
  };
}
