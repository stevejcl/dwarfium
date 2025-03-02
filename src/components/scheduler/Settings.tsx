/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

// Definitie van de configuratievelden
export type SettingsData = {
  address: string;
  longitude: string;
  latitude: string;
  timezone: string;
  ble_psd: string;
  ble_sta_ssid: string;
  ble_sta_pwd: string;
  stellarium_ip: string;
  stellarium_port: string;
  exposure: string;
  gain: string;
  ircut: string;
  binning: string;
  count: string;
};

// Standaardwaarden
const defaultSettings: SettingsData = {
  address: "",
  longitude: "",
  latitude: "",
  timezone: "",
  ble_psd: "",
  ble_sta_ssid: "",
  ble_sta_pwd: "",
  stellarium_ip: "",
  stellarium_port: "",
  exposure: "",
  gain: "",
  ircut: "",
  binning: "",
  count: "",
};

// Definieer de volgorde en type velden (tekstvelden en help-teksten)
const SETTINGS_FIELDS: Array<[string, keyof SettingsData | string]> = [
  ["Your Address", "address"],
  ["Help", "Find longitude and lattitude in Google Map by CTRL + Right Click"],
  ["Longitude", "longitude"],
  ["Latitude", "latitude"],
  [
    "Help",
    "The timezone value can be found here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones",
  ],
  ["Timezone", "timezone"],
  ["BLE PSD", "ble_psd"],
  ["BLE STA SSID", "ble_sta_ssid"],
  ["BLE STA Password", "ble_sta_pwd"],
  [
    "Help",
    "Use to Connect to Stellarium, leave blank if you are using default config",
  ],
  ["Stellarium IP", "stellarium_ip"],
  ["Stellarium Port", "stellarium_port"],
  [
    "Help",
    "The following values are the default values used in the Create Session Tabs",
  ],
  ["Exposure", "exposure"],
  ["Gain", "gain"],
  [
    "Help IR Cut",
    "For D2 0: IR Cut 1: IR Pass  -  For D3 0: VIS  1: ASTRO 2: DUAL BAND.",
  ],
  ["IR Cut", "ircut"],
  ["Help Binning", "0: 4k 1: 2k"],
  ["Binning", "binning"],
  ["Count", "count"],
];

// Functie om configuratie te laden vanuit localStorage
function loadConfig(): SettingsData {
  const stored = localStorage.getItem("settingsConfig");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing settings:", error);
    }
  }
  return defaultSettings;
}

// Functie om de configuratie op te slaan in localStorage
function saveConfig(config: SettingsData) {
  localStorage.setItem("settingsConfig", JSON.stringify(config));
}

// Functie om een hyperlink te openen
function openLink(url: string) {
  window.open(url, "_blank");
}

// Functie om via Nominatim latitude en longitude op te halen
async function getLatLongAndTimezone(
  address: string,
  agent = 1
): Promise<{ latitude: number; longitude: number; timezone: string } | null> {
  try {
    // We gebruiken hier Nominatim. Voor agent 1 gebruiken we Nominatim,
    // voor een eventuele fallback kun je later een andere API integreren.
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await response.json();
    if (!data || data.length === 0) {
      return null;
    }
    const location = data[0];
    const latitude = parseFloat(location.lat);
    const longitude = parseFloat(location.lon);
    // Voor de timezone kun je een extra API-aanroep doen.
    // Hier gebruiken we als stub "UTC" (vervang dit eventueel door een echte lookup).
    const timezone = "UTC";
    return { latitude, longitude, timezone };
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
}

const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  // Laad de configuratie bij het opstarten
  useEffect(() => {
    const loaded = loadConfig();
    setSettings(loaded);
  }, []);

  // Functie om de locatiegegevens op te halen en de velden bij te werken
  const findLocation = async () => {
    try {
      const result = await getLatLongAndTimezone(settings.address);
      if (result) {
        setSettings((prev) => ({
          ...prev,
          latitude: result.latitude.toString(),
          longitude: result.longitude.toString(),
          timezone: result.timezone,
        }));
      } else {
        alert("Can't find your location data!");
      }
    } catch (error) {
      console.error("Error in findLocation:", error);
      alert("Can't find your location data!");
    }
  };

  // Bijwerken van een veld
  const updateField = (key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Opslaan van de instellingen
  const saveSettings = () => {
    saveConfig(settings);
    alert("Configuration saved successfully!");
  };
  return (
    <div className="settings-tab">
      <button className="location-btn" onClick={findLocation}>
        Find your location data from your address or enter them manually
      </button>
      <div className="settings-container">
        {SETTINGS_FIELDS.map(([label, keyOrText], idx) => {
          // Als het label niet "Help" bevat, dan tonen we een invoerveld
          if (!label.includes("Help")) {
            const key = keyOrText as keyof SettingsData;
            return (
              <div className="settings-row" key={idx}>
                <label className="settings-label">{label}</label>
                <input
                  className="settings-input"
                  type="text"
                  value={settings[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                />
              </div>
            );
          } else {
            // Bij een help-veld: controleer of er een URL in de tekst voorkomt
            const text = keyOrText as string;
            const urlIndex = text.indexOf("http");
            if (urlIndex !== -1) {
              const linkText = text.substring(0, urlIndex).trim();
              const url = text.substring(urlIndex).trim();
              return (
                <div className="settings-row" key={idx}>
                  <label className="settings-help">
                    {linkText}{" "}
                    <span className="link" onClick={() => openLink(url)}>
                      {url}
                    </span>
                  </label>
                </div>
              );
            } else {
              return (
                <div className="settings-row" key={idx}>
                  <label className="settings-help">{text}</label>
                </div>
              );
            }
          }
        })}
      </div>
      <button className="save-btn" onClick={saveSettings}>
        Save
      </button>
    </div>
  );
};

export default SettingsTab;
