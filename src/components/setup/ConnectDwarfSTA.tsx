/// <reference types="web-bluetooth" />
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useContext, useState } from "react";
import type { FormEvent } from "react";
import { getProxyUrl } from "@/lib/get_proxy_url";

import {
  Dwarfii_Api,
  messageGetconfig,
  messageWifiSTA,
  analyzePacketBle,
} from "dwarfii_api";
import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  saveIPDwarfDB,
  saveBlePWDDwarfDB,
  saveBleSTASSIDDwarfDB,
  saveBleSTAPWDDwarfDB,
} from "@/db/db_utils";

export default function ConnectDwarfSTA() {
  let connectionCtx = useContext(ConnectionContext);

  const [connecting, setConnecting] = useState(false);
  const [findDwarfBluetooth, setFindDwarfBluetooth] = useState(false);
  const [etatBluetooth, setEtatBluetooth] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | undefined>(
    undefined
  );
  const [errorTxt, setErrorTxt] = useState("");
  const [BluetoothPWD, setBluetoothPWD] = useState<string>(
    connectionCtx.BlePWDDwarf || "DWARF_12345678"
  );
  const [Wifi_SSID, setWifi_SSID] = useState<string>(
    connectionCtx.BleSTASSIDDwarf || ""
  );
  const [Wifi_PWD, setWifi_PWD] = useState<string>(
    connectionCtx.BleSTAPWDDwarf || ""
  );
  const [useDirectBluetooth, setUseDirectBluetooth] = useState(false);

  const handleInputPWDChange = (event) => {
    setBluetoothPWD(event.target.value);
  };
  const handleInputSSIDChange = (event) => {
    setWifi_SSID(event.target.value);
  };
  const handleInputWifiPWDChange = (event) => {
    setWifi_PWD(event.target.value);
  };

  let IsFirstStepOK = false;
  let configValue;
  let deviceDwarf;
  let deviceDwarfID;
  let deviceDwarfName;
  let characteristicDwarf;

  async function checkConnection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    IsFirstStepOK = false;
    console.debug("Get BluetoothPWD:", BluetoothPWD);
    console.debug("Get Wifi_SSID:", Wifi_SSID);
    console.debug("Get Wifi_PWD:", Wifi_PWD);
    console.debug("saved DB BluetoothSTA_SSID:", connectionCtx.BleSTASSIDDwarf);
    console.debug("saved DB BluetoothSTA_PWD:", connectionCtx.BleSTAPWDDwarf);
    connectionCtx.setTypeIdDwarf(undefined);
    connectionCtx.setTypeNameDwarf("Dwarf");

    try {
      // Connecting
      setConnecting(true);
      setFindDwarfBluetooth(false);
      setEtatBluetooth(false);

      if (deviceDwarf) {
        // disconnect Bluetooth
        console.debug("disconnect already connected device");
        actionDisconnect();
      }

      const Dwarf_Characteristic_String =
        "00009999-0000-1000-8000-00805f9b34fb";
      const DwarfII_ID_String = "0000daf2-0000-1000-8000-00805f9b34fb";
      const Dwarf3_ID_String = "0000daf3-0000-1000-8000-00805f9b34fb";

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "DWARF" },
          { services: [DwarfII_ID_String, Dwarf3_ID_String] },
        ],
        optionalServices: [DwarfII_ID_String, Dwarf3_ID_String],
      });

      if (device) {
        deviceDwarf = device;
        // Add the new class
        setFindDwarfBluetooth(true);
        setErrorTxt(deviceDwarf.name);
        console.debug("Got device:", deviceDwarf.name);
        console.debug("id:", deviceDwarf.id);
        deviceDwarf.addEventListener("gattserverdisconnected", onDisconnected);

        if (!deviceDwarf.gatt) throw new Error("Can't get bluetooth gatt ");
        else console.debug("gatt:", deviceDwarf.gatt);

        const server = await deviceDwarf.gatt.connect();
        if (!server) throw new Error("Can't get gatt bluetooth service");
        else console.debug("Got bluetooth connected");

        let service;
        try {
          service = await server.getPrimaryService(DwarfII_ID_String);
          deviceDwarfID = 1;
          deviceDwarfName = "Dwarf II";
        } catch (error) {
          // If the first service isn't found, try the second one
          service = await server.getPrimaryService(Dwarf3_ID_String);
          deviceDwarfID = 2;
          deviceDwarfName = "Dwarf3";
        }

        console.log(
          "########## Bluetooth connected to " + deviceDwarfName + " ##########"
        );

        if (!service) throw new Error("Can't get bluetooth service");
        else console.debug("Got bluetooth service");

        const characteristic = await service.getCharacteristic(
          Dwarf_Characteristic_String
        );
        if (!characteristic)
          throw new Error("Can't get bluetooth characteristic");

        characteristicDwarf = characteristic;
        console.debug("Got characteristic:", characteristicDwarf.uuid);
        console.debug("Got characteristic:", characteristicDwarf.service);
        console.debug(characteristicDwarf);
        setEtatBluetooth(true);

        characteristicDwarf.addEventListener(
          "characteristicvaluechanged",
          handleValueChanged
        );
        await characteristicDwarf.startNotifications();

        const data_test = await characteristicDwarf.readValue();
        console.debug("Got detail characteristic:", data_test);
        console.debug(data_test);

        // get Wifi
        let bufferGetConfig = messageGetconfig(BluetoothPWD);

        await characteristicDwarf.writeValue(bufferGetConfig);
      }
    } catch (error) {
      // Add the new class
      setErrorTxt("Error, Retry...");
      console.error(error);
      setConnecting(false);
      setConnectionStatus(false);
    }
  }

  async function handleValueChanged(event) {
    try {
      let value = event.target.value;
      console.log("########## New Value Received ##########");
      console.debug("Value changed:", value);
      console.debug("IsFirstStepOK:", IsFirstStepOK);
      console.debug("##########");

      let bufferReadConfig;
      configValue = "";

      if (value) {
        // Convert the received value to a buffer
        bufferReadConfig = new Uint8Array(value.buffer);
        console.log("Buffer:", bufferReadConfig);

        // check buffer and get configValue
        if (bufferReadConfig.length > 0) {
          // analyse data, will be empty if length < 12
          configValue = analyzePacketBle(bufferReadConfig, false);
          console.log("Read:", configValue);
        }
      }
      if (!IsFirstStepOK && configValue) {
        let result_data = JSON.parse(configValue);

        if (result_data.cmd === undefined || result_data.cmd != 1) {
          console.log("Ignore Frame Received: cmd=", result_data.cmd);
        } else if (result_data.code && result_data.code != 0) {
          setErrorTxt(
            "Error get Config:" +
              result_data.code +
              " (" +
              Dwarfii_Api.DwarfBleErrorCode[result_data.code] +
              ")"
          );
          setConnecting(false);
          setConnectionStatus(false);
          actionDisconnect();
        } else if (result_data.state == 0 && Wifi_SSID && Wifi_PWD) {
          setErrorTxt("Load WiFi configuration...");
          IsFirstStepOK = true;
          let bufferSetWifiSta = messageWifiSTA(
            1,
            BluetoothPWD,
            Wifi_SSID,
            Wifi_PWD
          );
          await characteristicDwarf.writeValue(bufferSetWifiSta);
        } else if (result_data.state != 2) {
          setErrorTxt(
            "Error WiFi configuration not Completed! Restart it and Use the mobile App."
          );
          setConnecting(false);
          setConnectionStatus(false);
          actionDisconnect();
        } else if (result_data.wifiMode != 2) {
          setErrorTxt(
            "Error STA MODE not Configured! Restart it and Use the mobile App."
          );
          setConnecting(false);
          setConnectionStatus(false);
          actionDisconnect();
        } else if (
          (result_data.ip == "192.168.88.1" ||
            result_data.ssid.startsWith("DWARF3_")) &&
          Wifi_SSID &&
          Wifi_PWD
        ) {
          setErrorTxt("Load WiFi configuration...");
          IsFirstStepOK = true;
          let bufferSetWifiSta = messageWifiSTA(
            0,
            BluetoothPWD,
            Wifi_SSID,
            Wifi_PWD
          );
          await characteristicDwarf.writeValue(bufferSetWifiSta);
        } else if (
          result_data.ssid &&
          result_data.psd &&
          connectionCtx.BleSTASSIDDwarf &&
          connectionCtx.BleSTAPWDDwarf
        ) {
          setErrorTxt("Load WiFi configuration...");
          IsFirstStepOK = true;
          let bufferSetWifiSta = messageWifiSTA(
            0,
            BluetoothPWD,
            connectionCtx.BleSTASSIDDwarf,
            connectionCtx.BleSTAPWDDwarf
          );
          await characteristicDwarf.writeValue(bufferSetWifiSta);
        } else {
          IsFirstStepOK = true;
          let bufferSetWifiSta = messageWifiSTA(
            0,
            BluetoothPWD,
            result_data.ssid,
            result_data.psd
          );
          await characteristicDwarf.writeValue(bufferSetWifiSta);
        }
      } else if (IsFirstStepOK && configValue) {
        IsFirstStepOK = false;
        let result_data = JSON.parse(configValue);

        if (result_data.cmd === undefined || result_data.cmd != 3) {
          console.log("Ignore Frame Received: cmd=", result_data.cmd);
        } else if (result_data.code && result_data.code != 0) {
          setErrorTxt(
            "Error set WifiSTA:" +
              result_data.code +
              " (" +
              Dwarfii_Api.DwarfBleErrorCode[result_data.code] +
              ")"
          );
          setConnecting(false);
          setConnectionStatus(false);
          actionDisconnect();
        } else {
          console.log("Connected with IP: ", result_data.ip);
          setErrorTxt(" IP: " + result_data.ip);

          if (connectionCtx.IPDwarf != result_data.ip) {
            if (connectionCtx.socketIPDwarf) {
              connectionCtx.socketIPDwarf.close();
            }
          }
          connectionCtx.setIPDwarf(result_data.ip);
          saveIPDwarfDB(result_data.ip);
          connectionCtx.setBlePWDDwarf(BluetoothPWD);
          saveBlePWDDwarfDB(BluetoothPWD);
          connectionCtx.setBleSTASSIDDwarf(result_data.ssid);
          saveBleSTASSIDDwarfDB(result_data.ssid);
          connectionCtx.setBleSTAPWDDwarf(result_data.psd);
          saveBleSTAPWDDwarfDB(result_data.psd);

          connectionCtx.setTypeIdDwarf(deviceDwarfID);
          connectionCtx.setTypeNameDwarf(deviceDwarfName);

          setConnecting(false);
          setConnectionStatus(true);
          await characteristicDwarf.stopNotifications();
          characteristicDwarf.removeEventListener(
            "characteristicvaluechanged",
            handleValueChanged
          );
        }
      }
    } catch (error) {
      setErrorTxt("Error, Retry...");
      console.error(error);
      setConnecting(false);
      setConnectionStatus(false);
      actionDisconnect();
    }
  }

  function onDisconnected() {
    console.log("> Bluetooth Device disconnected");
    setConnectionStatus(false);
  }

  async function actionDisconnect() {
    try {
      // disconnect Bluetooth
      if (characteristicDwarf) {
        await characteristicDwarf.stopNotifications();
        characteristicDwarf.removeEventListener(
          "characteristicvaluechanged",
          handleValueChanged
        );
      }
      if (deviceDwarf) {
        deviceDwarf.removeEventListener(
          "gattserverdisconnected",
          onDisconnected
        );
        if (deviceDwarf.gatt) await deviceDwarf.gatt.disconnect();
      }
    } catch (error) {
      console.error(error);
    }
  }

  function renderConnectionStatus() {
    if (connecting) {
      return <span>{t("pConnecting")}</span>;
    }
    if (connectionStatus === undefined) {
      return <></>;
    }
    if (connectionStatus === false) {
      return (
        <span className="text-danger-connect">
          {t("pConnectingFailed")} {errorTxt}
        </span>
      );
    }
    if (findDwarfBluetooth && !connectionStatus) {
      return (
        <span className="text-warning-connect">
          Found Dwarf device
          {errorTxt}.
        </span>
      );
    }
    if (etatBluetooth && !connectionStatus) {
      return (
        <span className="text-warning-connect">
          Connected to Dwarf Device
          {errorTxt}.
        </span>
      );
    }

    return (
      <span className="text-success-connect">
        {t("pConnectionSuccessFull")}
        {errorTxt}
      </span>
    );
  }
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    const isTauri = "__TAURI__" in window;

    if (!isTauri) {
      setUseDirectBluetooth(true);
    }
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
    setBluetoothPWD(connectionCtx.BlePWDDwarf || "DWARF_12345678");
    setWifi_SSID(connectionCtx.BleSTASSIDDwarf || "");
    setWifi_PWD(connectionCtx.BleSTAPWDDwarf || "");
  }, []);

  const runExecutable = async () => {
    // Get the Bluetooth password from the input field
    const pwd_data = encodeURIComponent(BluetoothPWD);
    const ssid_data = encodeURIComponent(Wifi_SSID);
    const wifipwd_data = encodeURIComponent(Wifi_PWD);

    const requestAddr = `http://localhost:8000/run-exe?ble_psd=${pwd_data}&ble_STA_ssid=${ssid_data}&ble_STA_pwd=${wifipwd_data}`;
    const proxyUrl = `${getProxyUrl()}?target=${encodeURIComponent(
      requestAddr
    )}`;
    const response = await fetch(proxyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Use 'application/json' for JSON
      },
      signal: AbortSignal.timeout(120000),
      redirect: "follow",
    });

    // Check if the response has data
    if (response.ok) {
      console.log(`runExecutable: status ${response.status}`);
      if (response.ok && response.status === 200) {
        console.log(`runExecutable: waitdata`);
        const result = await response.json();
        console.log(`runExecutable: getdata ${JSON.stringify(result)}`);

        if (result.error) console.error(`runExecutable: ${result.error}`);

        if (result && result.dwarfIp) {
          console.log(`runExecutable: data ${result.dwarfId}`);
          if (result.dwarfIp && result.dwarfIp != "None") {
            if (result.dwarfId == "1") {
              deviceDwarfID = result.dwarfId;
              deviceDwarfName = "Dwarf II";
            } else if (result.dwarfId == "2") {
              deviceDwarfID = 2;
              deviceDwarfName = "Dwarf3";
            }
            console.log("Connected with IP: ", result.dwarfIp);
            setErrorTxt(" IP: " + result.dwarfIp);

            if (connectionCtx.IPDwarf != result.dwarfIp) {
              if (connectionCtx.socketIPDwarf) {
                connectionCtx.socketIPDwarf.close();
              }
            }
            connectionCtx.setIPDwarf(result.dwarfIp);
            saveIPDwarfDB(result.dwarfIp);
            connectionCtx.setBlePWDDwarf(BluetoothPWD);
            saveBlePWDDwarfDB(BluetoothPWD);
            connectionCtx.setBleSTASSIDDwarf(Wifi_SSID);
            saveBleSTASSIDDwarfDB(Wifi_SSID);
            connectionCtx.setBleSTAPWDDwarf(Wifi_PWD);
            saveBleSTAPWDDwarfDB(Wifi_PWD);
            connectionCtx.setTypeIdDwarf(deviceDwarfID);
            connectionCtx.setTypeNameDwarf(deviceDwarfName);
            setConnecting(false);
            setConnectionStatus(true);
          }
        }
      }
    } else console.error(`runExecutable: ${JSON.stringify(response)}`);
  };

  return (
    <div>
      <h2>{t("pEnableSTA", { DwarfType: connectionCtx.typeNameDwarf })}</h2>

      <p>
        {t("pEnableSTAContent", { DwarfType: connectionCtx.typeNameDwarf })}
      </p>

      <ol>
        <li className="mb-2">
          {t("pEnableSTAContent1", { DwarfType: connectionCtx.typeNameDwarf })}
          <br />
        </li>
        <li>
          {t("pEnableSTAContent2", { DwarfType: connectionCtx.typeNameDwarf })}
        </li>
        <li className="mb-2">
          {t("pEnableSTAContent3", { DwarfType: connectionCtx.typeNameDwarf })}
        </li>
        <br />
        <form onSubmit={checkConnection} className="mb-3">
          <div className="row mb-3">
            <div className="row mb-3">
              <div className="col-md-2 text-end">
                <label htmlFor="pwd" className="form-label">
                  {t("pBluetoothPWD")}
                </label>
              </div>
              <div className="col-lg-2 col-md-10">
                <input
                  className="form-control"
                  id="pwd"
                  name="pwd"
                  placeholder="DWARF_12345678"
                  required
                  defaultValue={connectionCtx.BlePWDDwarf}
                  value={BluetoothPWD}
                  onChange={handleInputPWDChange}
                />
              </div>
              <div className="col-md-2 text-end">
                <label htmlFor="pwd" className="form-label">
                  {t("pSTA_SSID_Wifi")}
                </label>
              </div>
              <div className="col-lg-2 col-md-10">
                <input
                  className="form-control"
                  id="ssid"
                  name="ssid"
                  placeholder=""
                  required
                  defaultValue={connectionCtx.BleSTASSIDDwarf}
                  value={Wifi_SSID}
                  onChange={handleInputSSIDChange}
                />
              </div>
              <div className="col-md-2 text-end">
                <label htmlFor="pwd" className="form-label">
                  {t("pSTA_PWD_Wifi")}
                </label>
              </div>
              <div className="col-lg-2 col-md-10">
                <input
                  className="form-control"
                  id="wifipwd"
                  name="wifipwd"
                  type="password"
                  placeholder=""
                  required
                  defaultValue={connectionCtx.BleSTAPWDDwarf}
                  value={Wifi_PWD}
                  onChange={handleInputWifiPWDChange}
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-more02 me-3">
            <i className="icon-bluetooth" /> {t("pConnectWeb")}
          </button>
          {useDirectBluetooth == true && (
            <button
              className="btn btn-more02 me-6"
              onClick={(e) => {
                runExecutable();
                e.preventDefault(); // Prevents any unintended form submission
              }}
            >
              <i className="icon-bluetooth" />
              {t("pDirectBluetooth")}
            </button>
          )}{" "}
          {renderConnectionStatus()}
        </form>
      </ol>
    </div>
  );
}
