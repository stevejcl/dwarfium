import { CoordinatesData } from "@/types";

export function saveCoordinatesDB(
  latitude: number,
  longitude: number,
  timezone: string
) {
  localStorage.setItem("latitude", latitude.toString());
  localStorage.setItem("longitude", longitude.toString());
  localStorage.setItem("timezone", timezone);
}

export function saveLatitudeDB(latitude: number) {
  localStorage.setItem("latitude", latitude.toString());
}

export function saveLongitudeDB(longitude: number) {
  localStorage.setItem("longitude", longitude.toString());
}

export function saveTimezoneDB(timezone: string) {
  localStorage.setItem("timezone", timezone);
}

export function fetchCoordinatesDB(): CoordinatesData {
  let lat = localStorage.getItem("latitude");
  let lon = localStorage.getItem("longitude");
  if (typeof lat === "string" && typeof lon === "string") {
    return { latitude: Number(lat), longitude: Number(lon) };
  } else {
    return {};
  }
}

export function fetchTimezoneDB(): string {
  let tzone = localStorage.getItem("timezone");

  if (tzone) {
    return tzone;
  } else {
    return "";
  }
}

export function saveConnectionStatusDB(status: boolean) {
  localStorage.setItem("connectionStatus", status ? "true" : "false");
}

export function fetchConnectionStatusDB(): boolean | undefined {
  let status = localStorage.getItem("connectionStatus");
  if (status) {
    return status === "true";
  }
}

export function saveInitialConnectionTimeDB() {
  localStorage.setItem("initialConnectionTime", Date.now().toString());
}

export function fetchInitialConnectionTimeDB(): number | undefined {
  let time = localStorage.getItem("initialConnectionTime");
  if (time) {
    return Number(time);
  }
}

export function saveIPDwarfDB(ip: string) {
  localStorage.setItem("IPDwarf", ip);
}

export function fetchIPDwarfDB(): string | undefined {
  let data = localStorage.getItem("IPDwarf");
  if (data) {
    return data;
  }
}

export function saveBlePWDDwarfDB(ble_pwd: string) {
  localStorage.setItem("BlePWDDwarf", ble_pwd);
}

export function fetchBlePWDDwarfDB(): string | undefined {
  let data = localStorage.getItem("BlePWDDwarf");
  if (data) {
    return data;
  } else return "DWARF_12345678";
}

export function saveBleSTASSIDDwarfDB(ble_STA_ssid: string) {
  localStorage.setItem("BleSTASSIDDwarf", ble_STA_ssid);
}

export function fetchBleSTASSIDDwarfDB(): string | undefined {
  let data = localStorage.getItem("BleSTASSIDDwarf");
  if (data) {
    return data;
  }
}

export function saveBleSTAPWDDwarfDB(ble_STA_pwd: string) {
  localStorage.setItem("BleSTAPWDDwarf", ble_STA_pwd);
}

export function fetchBleSTAPWDDwarfDB(): string | undefined {
  let data = localStorage.getItem("BleSTAPWDDwarf");
  if (data) {
    return data;
  }
}

export function saveConnectionStatusStellariumDB(status: boolean) {
  localStorage.setItem("connectionStatusStellarium", status ? "true" : "false");
}

export function fetchConnectionStatusStellariumDB(): boolean | undefined {
  let status = localStorage.getItem("connectionStatusStellarium");
  if (status) {
    return status === "true";
  }
}

export function saveIPStellariumDB(ip: string) {
  localStorage.setItem("IPStellarium", ip);
}

export function fetchIPStellariumDB(): string | undefined {
  let data = localStorage.getItem("IPStellarium");
  if (data) {
    return data;
  }
}

export function savePortStellariumDB(port: number) {
  localStorage.setItem("portStellarium", port.toString());
}

export function fetchPortStellariumDB(): number | undefined {
  let data = localStorage.getItem("portStellarium");
  if (data) {
    return Number(data);
  }
}

export function saveUrlStellariumDB(url: string) {
  localStorage.setItem("urlStellarium", url);
}

export function fetchUrlStellariumDB(): string | undefined {
  let data = localStorage.getItem("urlStellarium");
  if (data) {
    return data;
  }
}

export function saveObjectListsNamesDb(names: string) {
  localStorage.setItem("objectListsNames", names);
}

export function fetchObjectListsNamesDb(): string[] | undefined {
  let data = localStorage.getItem("objectListsNames");
  if (data) {
    let names = data.split("|");
    names.sort();
    return names;
  }
}

export function saveObjectListsDb(names: string) {
  localStorage.setItem("objectLists", names);
}

export function fetchObjectListsDb() {
  let data = localStorage.getItem("objectLists");
  if (data) {
    return JSON.parse(data);
  }
}

export function saveCurrentObjectListNameDb(name: string) {
  localStorage.setItem("currentObjectListName", name);
}

export function fetchCurrentObjectListNameDb() {
  let data = localStorage.getItem("currentObjectListName");
  if (data) {
    return data;
  }
}

export function saveUserCurrentObjectListNameDb(name: string) {
  localStorage.setItem("currentUserObjectListName", name);
}

export function fetchUserCurrentObjectListNameDb() {
  let data = localStorage.getItem("currentUserObjectListName");
  if (data) {
    return data;
  }
}

export function fetchAstroSettingsDb() {
  let data = localStorage.getItem("astroSettings");
  if (data) {
    let obj = JSON.parse(data);
    [
      "IR",
      "binning",
      "count",
      "exposure",
      "exposureMode",
      "fileFormat",
      "gain",
      "gainMode",
      "qualityPreview",
    ].forEach((field) => {
      if (obj[field] !== undefined) {
        if (/^\d+$/.test(obj[field])) {
          obj[field] = Number(obj[field]);
        }
      }
    });

    return obj;
  }
}

export function saveAstroSettingsDb(key: string, value: string | undefined) {
  let data = localStorage.getItem("astroSettings");
  if (data) {
    let obj = JSON.parse(data);
    if (value === undefined) {
      delete obj[key];
    } else {
      obj[key] = value;
    }
    localStorage.setItem("astroSettings", JSON.stringify(obj));
  } else {
    let obj = { [key]: value };
    localStorage.setItem("astroSettings", JSON.stringify(obj));
  }
}

export function fetchImagingSessionDb() {
  let data = localStorage.getItem("imagingSession");
  if (data) {
    let obj = JSON.parse(data);
    ["startTime", "imagesTaken", "imagesStacked"].forEach((field) => {
      if (obj[field] !== undefined) {
        obj[field] = Number(obj[field]);
      }
    });

    return obj;
  }
}

export function saveImagingSessionDb(key: string, value: string | undefined) {
  let data = localStorage.getItem("imagingSession");
  if (data) {
    let obj = JSON.parse(data);
    if (value === undefined) {
      delete obj[key];
    } else {
      obj[key] = value;
    }
    localStorage.setItem("imagingSession", JSON.stringify(obj));
  } else {
    let obj = { [key]: value };
    localStorage.setItem("imagingSession", JSON.stringify(obj));
  }
}

export function removeImagingSessionDb() {
  localStorage.removeItem("imagingSession");
}

export function deleteConnectionDB(): void {
  [
    "connectionStatus",
    "initialConnectionTime",
    "connectionStatusStellarium",
  ].forEach((item) => localStorage.removeItem(item));
}

export function fetchLoggerStatusDb(): boolean | undefined {
  let data = localStorage.getItem("loggerStatus");
  if (data) {
    return data === "true" ? true : false;
  }
}

export function saveLoggerStatusDb(value: string): void {
  localStorage.setItem("loggerStatus", value);
}

export function fetchLogMessagesDb() {
  let data = localStorage.getItem("logMessages");
  if (data) {
    return JSON.parse(data);
  }
}

export function saveLogMessagesDb(value: { [k: string]: any }): void {
  let data = fetchLogMessagesDb();
  if (data) {
    data.push(value);
    localStorage.setItem("logMessages", JSON.stringify(data));
  } else {
    localStorage.setItem("logMessages", JSON.stringify([value]));
  }
}

export function deleteLogMessagesDb(): void {
  localStorage.removeItem("logMessages");
}
