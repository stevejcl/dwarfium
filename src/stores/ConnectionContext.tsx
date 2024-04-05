import { createContext, useState } from "react";
import type { ReactNode } from "react";

import {
  ConnectionContextType,
  AstroSettings,
  AstroSavePosition,
  ImagingSession,
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
  const [BlePWDDwarf, setBlePWDDwarf] = useState<string | undefined>();
  const [BleSTASSIDDwarf, setBleSTASSIDDwarf] = useState<string | undefined>();
  const [BleSTAPWDDwarf, setBleSTAPWDDwarf] = useState<string | undefined>();
  const [BatteryLevelDwarf, setBatteryLevelDwarf] = useState<any | undefined>();
  const [BatteryStatusDwarf, setBatteryStatusDwarf] = useState<any>(0);
  const [availableSizeDwarf, setAvailableSizeDwarf] = useState<
    any | undefined
  >();
  const [totalSizeDwarf, setTotalSizeDwarf] = useState<any | undefined>();

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

  const [savePositionStatus, setSavePositionStatus] = useState<
    boolean | undefined
  >();

  const [isSavedPosition, setIsSavedPosition] = useState<boolean | undefined>();

  const [currentObjectListName, setCurrentObjectListName] = useState<
    string | undefined
  >();
  const [currentUserObjectListName, setUserCurrentObjectListName] = useState<
    string | undefined
  >();
  const [astroSettings, setAstroSettings] = useState<AstroSettings>(
    {} as AstroSettings
  );
  const [astroSavePosition, setAstroSavePosition] = useState<AstroSavePosition>(
    {} as AstroSavePosition
  );
  const [imagingSession, setImagingSession] = useState<ImagingSession>(
    {} as ImagingSession
  );

  const [logger, setLogger] = useState<{ [k: string]: any }[] | undefined>();
  const [loggerStatus, setLoggerStatus] = useState<boolean | undefined>();
  const [loggerView, setLoggerView] = useState<boolean>(false);

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

    savePositionStatus,
    setSavePositionStatus,

    isSavedPosition,
    setIsSavedPosition,

    currentObjectListName,
    setCurrentObjectListName,
    currentUserObjectListName,
    setUserCurrentObjectListName,

    astroSettings,
    setAstroSettings,
    imagingSession,
    setImagingSession,
    astroSavePosition,
    setAstroSavePosition,

    deleteConnection,

    logger,
    setLogger,
    loggerStatus,
    setLoggerStatus,
    loggerView,
    setLoggerView,
  };
  return (
    <ConnectionContext.Provider value={context}>
      {children}
    </ConnectionContext.Provider>
  );
}

export default ConnectionContext;
