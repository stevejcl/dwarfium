export interface ArraySensorDataInterface {
  axc: ArrayCoordinatesInterface;
  vel: ArrayCoordinatesInterface;
  ang: ArrayCoordinatesInterface;
  counter: number[];
}

interface ArrayCoordinatesInterface {
  x: number[];
  y: number[];
  z: number[];
}

export interface SingleGraphInterface {
  counter: number[];
  x: number[];
  y: number[];
  z: number[];
  title: string;
}

export const columns = [
  {
    id: "1",
    displayName: "t",
  },
  {
    id: "2",
    displayName: "aX, м/с2",
  },
  {
    id: "3",
    displayName: "aY, м/с2",
  },
  {
    id: "4",
    displayName: "aZ, м/с2",
  },
  {
    id: "5",
    displayName: "wX, °/с",
  },
  {
    id: "6",
    displayName: "wY, °/с",
  },
  {
    id: "7",
    displayName: "wZ, °/с",
  },
  {
    id: "8",
    displayName: "AX, °",
  },
  {
    id: "9",
    displayName: "AY, °",
  },
  {
    id: "10",
    displayName: "AZ, °",
  },
];
