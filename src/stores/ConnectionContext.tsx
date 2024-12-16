import { createContext, useState } from "react";
import type { ReactNode } from "react";

import { telephotoCamera } from "@/lib/dwarf_utils";

import {
  ConnectionContextType,
  AstroSettings,
  AstroSavePosition,
  AstroEQSolvingResult,
  ImagingSession,
  CameraWideSettings,
  CameraTeleSettings,
  SkyLimitObject,
  AstroObject,
} from "@/types";

type ProviderProps = {
  children: ReactNode;
};

export const ConnectionContext = createContext<ConnectionContextType>(
  {} as ConnectionContextType
);

export function ConnectionContextProvider({ children }: ProviderProps) {
  const [connectionStatus, setConnectionStatus] = useState<
    boolean | undefined
  >();
  const [connectionStatusSlave, setConnectionStatusSlave] = useState<
    boolean | undefined
  >();
  const [initialConnectionTime, setInitialConnectionTime] = useState<
    number | undefined
  >();
  const [IPDwarf, setIPDwarf] = useState<string | undefined>();
  const [socketIPDwarf, setSocketIPDwarf] = useState<any | undefined>();
  const [typeIdDwarf, setTypeIdDwarf] = useState<number | undefined>();
  const [typeNameDwarf, setTypeNameDwarf] = useState<string>("Dwarf");
  const [typeUidDwarf, setTypeUidDwarf] = useState<string>("");
  const [BlePWDDwarf, setBlePWDDwarf] = useState<string | undefined>();
  const [BleSTASSIDDwarf, setBleSTASSIDDwarf] = useState<string | undefined>();
  const [BleSTAPWDDwarf, setBleSTAPWDDwarf] = useState<string | undefined>();
  const [BatteryLevelDwarf, setBatteryLevelDwarf] = useState<any | undefined>();
  const [BatteryStatusDwarf, setBatteryStatusDwarf] = useState<any>(0);
  const [availableSizeDwarf, setAvailableSizeDwarf] = useState<
    any | undefined
  >();
  const [totalSizeDwarf, setTotalSizeDwarf] = useState<any | undefined>();
  const [statusPowerLightsDwarf, setStatusPowerLightsDwarf] = useState<
    any | undefined
  >();
  const [statusRingLightsDwarf, setStatusRingLightsDwarf] = useState<
    any | undefined
  >();
  const [statusTemperatureDwarf, setStatusTemperatureDwarf] = useState<
    any | undefined
  >();
  const [streamTypeTeleDwarf, setStreamTypeTeleDwarf] = useState<
    any | undefined
  >();
  const [streamTypeWideDwarf, setStreamTypeWideDwarf] = useState<
    any | undefined
  >();

  const [connectionStatusStellarium, setConnectionStatusStellarium] = useState<
    boolean | undefined
  >();
  const [IPStellarium, setIPStellarium] = useState<string | undefined>();
  const [portStellarium, setPortStellarium] = useState<number | undefined>();
  const [urlStellarium, setUrlStellarium] = useState<string | undefined>();

  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [timezone, setTimezone] = useState<string | undefined>();

  const [searchTxt, setSearchTxt] = useState<string | undefined>("");
  const [visibleSkyLimit, setVisibleSkyLimit] = useState<string | undefined>(
    ""
  );
  const [visibleSkyLimitTarget, setVisibleSkyLimitTarget] =
    useState<SkyLimitObject[]>();

  const [savePositionStatus, setSavePositionStatus] = useState<
    boolean | undefined
  >();

  const [isSavedPosition, setIsSavedPosition] = useState<boolean | undefined>();

  const [saveAstroData, setSaveAstroData] = useState<AstroObject | undefined>(
    {} as AstroObject
  );

  const [gotoType, setGotoType] = useState<string | undefined>("lists");

  const [currentObjectListName, setCurrentObjectListName] = useState<
    string | undefined
  >();
  const [currentUserObjectListName, setUserCurrentObjectListName] = useState<
    string | undefined
  >();
  const [astroSettings, setAstroSettings] = useState<AstroSettings>(
    {} as AstroSettings
  );

  const [currentAstroCamera, setCurrentAstroCamera] =
    useState<number>(telephotoCamera);
  const [isFullScreenCameraTele, setIsFullScreenCameraTele] =
    useState<boolean>(true);

  const [astroSavePosition, setAstroSavePosition] = useState<AstroSavePosition>(
    {} as AstroSavePosition
  );
  const [astroEQSolvingResult, setAstroEQSolvingResult] =
    useState<AstroEQSolvingResult>({} as AstroEQSolvingResult);
  const [imagingSession, setImagingSession] = useState<ImagingSession>(
    {} as ImagingSession
  );
  const [timerGlobal, setTimerGlobal] =
    useState<ReturnType<typeof setInterval>>();
  const [cameraWideSettings, setCameraWideSettings] =
    useState<CameraWideSettings>({} as CameraWideSettings);
  const [cameraTeleSettings, setCameraTeleSettings] =
    useState<CameraTeleSettings>({} as CameraTeleSettings);

  const [logger, setLogger] = useState<{ [k: string]: any }[] | undefined>();
  const [loggerStatus, setLoggerStatus] = useState<boolean | undefined>();
  const [loggerView, setLoggerView] = useState<boolean>(false);
  const [PiPView, setPiPView] = useState<boolean>(false);

  function deleteConnection() {
    setConnectionStatus(undefined);
    setConnectionStatusSlave(undefined);
    setInitialConnectionTime(undefined);

    setConnectionStatusStellarium(undefined);
  }

  let context = {
    connectionStatus,
    setConnectionStatus,
    connectionStatusSlave,
    setConnectionStatusSlave,
    initialConnectionTime,
    setInitialConnectionTime,
    IPDwarf,
    setIPDwarf,
    socketIPDwarf,
    setSocketIPDwarf,
    typeIdDwarf,
    setTypeIdDwarf,
    typeNameDwarf,
    setTypeNameDwarf,
    typeUidDwarf,
    setTypeUidDwarf,
    BlePWDDwarf,
    setBlePWDDwarf,
    BleSTASSIDDwarf,
    setBleSTASSIDDwarf,
    BleSTAPWDDwarf,
    setBleSTAPWDDwarf,
    BatteryLevelDwarf,
    setBatteryLevelDwarf,
    BatteryStatusDwarf,
    setBatteryStatusDwarf,
    availableSizeDwarf,
    setAvailableSizeDwarf,
    totalSizeDwarf,
    setTotalSizeDwarf,
    statusPowerLightsDwarf,
    setStatusPowerLightsDwarf,
    statusRingLightsDwarf,
    setStatusRingLightsDwarf,
    streamTypeTeleDwarf,
    setStreamTypeTeleDwarf,
    streamTypeWideDwarf,
    setStreamTypeWideDwarf,
    statusTemperatureDwarf,
    setStatusTemperatureDwarf,
    connectionStatusStellarium,
    setConnectionStatusStellarium,
    IPStellarium,
    setIPStellarium,
    portStellarium,
    setPortStellarium,
    urlStellarium,
    setUrlStellarium,

    latitude,
    setLatitude,
    longitude,
    setLongitude,
    timezone,
    setTimezone,

    searchTxt,
    setSearchTxt,
    visibleSkyLimit,
    setVisibleSkyLimit,
    visibleSkyLimitTarget,
    setVisibleSkyLimitTarget,

    savePositionStatus,
    setSavePositionStatus,

    isSavedPosition,
    setIsSavedPosition,

    saveAstroData,
    setSaveAstroData,

    gotoType,
    setGotoType,

    currentObjectListName,
    setCurrentObjectListName,
    currentUserObjectListName,
    setUserCurrentObjectListName,

    astroSettings,
    setAstroSettings,
    currentAstroCamera,
    setCurrentAstroCamera,
    isFullScreenCameraTele,
    setIsFullScreenCameraTele,
    cameraWideSettings,
    setCameraWideSettings,
    cameraTeleSettings,
    setCameraTeleSettings,
    astroSavePosition,
    setAstroSavePosition,
    astroEQSolvingResult,
    setAstroEQSolvingResult,
    imagingSession,
    setImagingSession,
    timerGlobal,
    setTimerGlobal,

    deleteConnection,

    logger,
    setLogger,
    loggerStatus,
    setLoggerStatus,
    loggerView,
    setLoggerView,
    PiPView,
    setPiPView,
  };
  return (
    <ConnectionContext.Provider value={context}>
      {children}
    </ConnectionContext.Provider>
  );
}

export default ConnectionContext;
