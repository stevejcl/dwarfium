import type { Dispatch, SetStateAction } from "react";

export type ConnectionContextType = {
  connectionStatus: boolean | undefined;
  setConnectionStatus: Dispatch<SetStateAction<boolean | undefined>>;
  connectionStatusSlave: boolean | undefined;
  setConnectionStatusSlave: Dispatch<SetStateAction<boolean | undefined>>;
  initialConnectionTime: number | undefined;
  setInitialConnectionTime: Dispatch<SetStateAction<number | undefined>>;

  connectionStatusStellarium: boolean | undefined;
  setConnectionStatusStellarium: Dispatch<SetStateAction<boolean | undefined>>;
  useHttps: boolean;
  setUseHttps: Dispatch<SetStateAction<boolean>>;
  proxyInLan: boolean | undefined;
  setProxyInLan: Dispatch<SetStateAction<boolean | undefined>>;
  proxyIP: string | undefined;
  setProxyIP: Dispatch<SetStateAction<string | undefined>>;
  proxyLocalIP: string | undefined;
  setProxyLocalIP: Dispatch<SetStateAction<string | undefined>>;
  useDirectBluetoothServer: boolean | undefined;
  setUseDirectBluetoothServer: Dispatch<SetStateAction<boolean | undefined>>;
  IPDwarf: string | undefined;
  setIPDwarf: Dispatch<SetStateAction<string | undefined>>;
  socketIPDwarf: any | undefined;
  setSocketIPDwarf: Dispatch<SetStateAction<any | undefined>>;
  typeIdDwarf: number | undefined;
  setTypeIdDwarf: Dispatch<SetStateAction<number | undefined>>;
  typeNameDwarf: string | undefined;
  setTypeNameDwarf: Dispatch<SetStateAction<string>>;
  typeUidDwarf: string | undefined;
  setTypeUidDwarf: Dispatch<SetStateAction<string>>;
  BlePWDDwarf: string | undefined;
  setBlePWDDwarf: Dispatch<SetStateAction<string | undefined>>;
  BleSTASSIDDwarf: string | undefined;
  setBleSTASSIDDwarf: Dispatch<SetStateAction<string | undefined>>;
  BleSTAPWDDwarf: string | undefined;
  setBleSTAPWDDwarf: Dispatch<SetStateAction<string | undefined>>;
  BatteryLevelDwarf: number | undefined;
  setBatteryLevelDwarf: Dispatch<SetStateAction<number | undefined>>;
  BatteryStatusDwarf: number;
  setBatteryStatusDwarf: Dispatch<SetStateAction<number>>;
  availableSizeDwarf: number | undefined;
  setAvailableSizeDwarf: Dispatch<SetStateAction<number | undefined>>;
  totalSizeDwarf: number | undefined;
  setTotalSizeDwarf: Dispatch<SetStateAction<number | undefined>>;
  statusPowerLightsDwarf: boolean | undefined;
  setStatusPowerLightsDwarf: Dispatch<SetStateAction<boolean | undefined>>;
  statusRingLightsDwarf: boolean | undefined;
  setStatusRingLightsDwarf: Dispatch<SetStateAction<boolean | undefined>>;
  statusTemperatureDwarf: number | undefined;
  setStatusTemperatureDwarf: Dispatch<SetStateAction<number | undefined>>;
  streamTypeTeleDwarf: number | undefined;
  setStreamTypeTeleDwarf: Dispatch<SetStateAction<number | undefined>>;
  streamTypeWideDwarf: number | undefined;
  setStreamTypeWideDwarf: Dispatch<SetStateAction<number | undefined>>;
  valueFocusDwarf: number | undefined;
  setValueFocusDwarf: Dispatch<SetStateAction<number | undefined>>;

  connectionStatusStellarium: boolean | undefined;
  setConnectionStatusStellarium: Dispatch<SetStateAction<boolean | undefined>>;
  IPStellarium: string | undefined;
  setIPStellarium: Dispatch<SetStateAction<string | undefined>>;
  portStellarium: number | undefined;
  setPortStellarium: Dispatch<SetStateAction<number | undefined>>;
  urlStellarium: string | undefined;
  setUrlStellarium: Dispatch<SetStateAction<string | undefined>>;

  latitude: number | undefined;
  setLatitude: Dispatch<SetStateAction<number | undefined>>;
  longitude: number | undefined;
  setLongitude: Dispatch<SetStateAction<number | undefined>>;
  timezone: string | undefined;
  setTimezone: Dispatch<SetStateAction<string | undefined>>;

  searchTxt: string | undefined;
  setSearchTxt: Dispatch<SetStateAction<string | undefined>>;
  visibleSkyLimit: string | undefined;
  setVisibleSkyLimit: Dispatch<SetStateAction<string | undefined>>;
  visibleSkyLimitTarget: SkyLimitObject[] | undefined;
  setVisibleSkyLimitTarget: Dispatch<
    SetStateAction<SkyLimitObject[] | undefined>
  >;

  savePositionStatus: boolean | undefined;
  setSavePositionStatus: Dispatch<SetStateAction<boolean | undefined>>;
  isSavedPosition: boolean | undefined;
  setIsSavedPosition: Dispatch<SetStateAction<boolean | undefined>>;

  saveAstroData: AstroObject | undefined;
  setSaveAstroData: Dispatch<SetStateAction<AstroObject | undefined>>;

  gotoType: string | undefined;
  setGotoType: Dispatch<SetStateAction<string | undefined>>;

  currentObjectListName: string | undefined;
  setCurrentObjectListName: Dispatch<SetStateAction<string | undefined>>;
  currentUserObjectListName: string | undefined;
  setUserCurrentObjectListName: Dispatch<SetStateAction<string | undefined>>;

  currentAstroCamera: number;
  setCurrentAstroCamera: Dispatch<SetStateAction<number>>;
  isFullScreenCameraTele: boolean | true;
  setIsFullScreenCameraTele: Dispatch<SetStateAction<boolean>>;

  astroSettings: AstroSettings;
  setAstroSettings: Dispatch<SetStateAction<AstroSettings>>;
  astroSavePosition: AstroSavePosition;
  setAstroSavePosition: Dispatch<SetStateAction<AstroSavePosition>>;
  astroEQSolvingResult: AstroEQSolvingResult;
  setAstroEQSolvingResult: Dispatch<SetStateAction<AstroEQSolvingResult>>;

  imagingSession: ImagingSession;
  setImagingSession: Dispatch<SetStateAction<ImagingSession>>;

  cameraWideSettings: CameraWideSettings;
  setCameraWideSettings: Dispatch<SetStateAction<CameraWideSettings>>;

  cameraTeleSettings: CameraTeleSettings;
  setCameraTeleSettings: Dispatch<SetStateAction<CameraTeleSettings>>;

  timerGlobal: ReturnType<typeof setInterval> | undefined;
  setTimerGlobal: Dispatch<
    SetStateAction<ReturnType<typeof setInterval> | undefined>
  >;

  logger: { [k: string]: any }[] | undefined;
  setLogger: Dispatch<SetStateAction<{ [k: string]: any }[] | undefined>>;
  loggerStatus: boolean | undefined;
  setLoggerStatus: Dispatch<SetStateAction<boolean | undefined>>;
  loggerView: boolean;
  setLoggerView: Dispatch<SetStateAction<boolean>>;
  PiPView: boolean;
  setPiPView: Dispatch<SetStateAction<boolean>>;

  deleteConnection: () => void;
};

export type CoordinatesData = {
  latitude?: number;
  longitude?: number;
};

export type RADeclinationData = {
  RA?: number;
  declination?: number;
};

export type ParsedStellariumData = {
  objectName: string;
  objectNGC: string;
  RA: string;
  declination: string;
};

export type ObjectStellarium = {
  constellation: string;
  dec: string;
  designation?: string;
  fov: number;
  isVisibleMarker: boolean;
  jd: number;
  landscapeID: string;
  location: string;
  magnitude: string;
  name?: string;
  nameI18n?: string;
  objtype: string;
  ra: string;
  type: string;
};

export type AstroObject = {
  dec: string | null;
  designation: string;
  magnitude: string | null | number;
  type: string;
  typeCategory: string;
  ra: string | null;
  displayName: string;
  alternateNames: string | null;
  catalogue: string;
  objectNumber: number;
  size?: string;
  constellation: string | null | undefined;
  visible?: boolean | undefined;
  notes: string | null;
  favorite: boolean | undefined;
};

export type ObjectStellariumInfo = {
  "above-horizon": boolean;
  airmass: number;
  altitude: number;
  "altitude-geometric": number;
  ambientInt: number;
  ambientLum: number;
  appSidTm: string;
  azimuth: number;
  "azimuth-geometric": number;
  bmag: number;
  dec: number;
  decJ2000: number;
  designations: string;
  elat: number;
  elatJ2000: number;
  elong: number;
  elongJ2000: number;
  found: boolean;
  glat: number;
  glong: number;
  "hourAngle-dd": number;
  "hourAngle-hms": string;
  iauConstellation: string;
  "localized-name": string;
  meanSidTm: string;
  morpho: string;
  name: string;
  "object-type": string;
  parallacticAngle: number;
  ra: number;
  raJ2000: number;
  redshift: number;
  rise: string;
  "rise-dhr": number;
  set: string;
  "set-dhr": number;
  sglat: number;
  sglong: number;
  size: number;
  "size-dd": number;
  "size-deg": string;
  "size-dms": string;
  "surface-brightness": number;
  transit: string;
  "transit-dhr": number;
  type: string;
  vmag: number;
  vmage: number;
};

export type ObjectOpenNGC = {
  "Catalogue Entry": string;
  "Alternative Entries": string | null;
  "Familiar Name": string | null;
  "Right Ascension": string | null;
  Declination: string | null;
  "Major Axis": number | null;
  "Minor Axis": number | null;
  Magnitude: number | null;
  "Name catalog": string;
  "Name number": number;
  Type: string;
  "Type Category": string;
  "Height (')": number | null;
  "Width (')": number | null;
  Constellation: string | null | undefined;
  Notes: string | null;
};

export type ObjectTelescopius = {
  "Alternative Entries": string;
  "Apparent Magnitude": string;
  "Catalogue Entry": string;
  Constellation: string;
  Declination: string;
  DEC: string;
  "Familiar Name": string;
  Magnitude: string;
  "Maximum Altitude": string;
  Name: string;
  Notes: string;
  "Orbit Type": string;
  "Position Angle (East)": string;
  RA: string;
  "Right Ascension": string;
  Size: string;
  "Surface Brightness": string;
  "Transit Time": string;
  Type: string;
  [k: string]: string;
};

export type AstroSettings = {
  rightAscension?: string;
  declination?: string;
  gain?: number | string;
  gainMode?: number;
  exposure?: number | string;
  exposureMode?: number;
  IR?: number;
  binning?: number;
  fileFormat?: number;
  AiEnhance?: number;
  count?: number;
  quality?: number;
  target?: string;
  status?: number;
  wideExposure?: number | string;
  wideExposureMode?: number;
  wideGain?: number | string;
};

export type ImagingSession = {
  startTime: number;
  sessionElaspsedTime: string;
  imagesTaken: number;
  imagesStacked: number;
  isRecording: boolean;
  isStackedCountStart: boolean;
  endRecording: boolean;
  isGoLive: boolean;
  astroCamera: number;
};

export type AstroSavePosition = {
  displayName: string;
  rightAscension: number;
  declination: number;
  altitude: number;
  azimuth: number;
  lst: number;
  strLocalTime: string;
};

export type AstroEQSolvingResult = {
  azimuth_err: number | undefined;
  altitude_err: number | undefined;
};

export type CameraWideSettings = {
  exp_mode?: number;
  exp_index?: number;
  gain_index?: number;
  wb_mode?: number;
  wb_index?: number;
  brightness?: number;
  contrast?: number;
  hue?: number;
  saturation?: number;
  sharpness?: number;
};

export type CameraTeleSettings = {
  wb_mode?: number;
  wb_index_mode?: number;
  wb_index?: number;
  brightness?: number;
  contrast?: number;
  hue?: number;
  saturation?: number;
  sharpness?: number;
};

export type ReactAnimatedWeatherProps = {
  icon: string;
  color: string;
  size: number;
  animate?: boolean;
  code: string;
};

export type SkyLimitObject = {
  number: number;
  directions: string;
};
