/// <reference types="web-bluetooth" />
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useContext, useState } from "react";
import type { FormEvent } from "react";

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

  let IsFirstStepOK = false;
  let configValue;
  let deviceDwarf;
  let characteristicDwarf;
  let BluetoothPWD;

  async function checkConnection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    IsFirstStepOK = false;
    const formData = new FormData(e.currentTarget);
    const formBluetoothPWD = formData.get("pwd");
    BluetoothPWD = formBluetoothPWD?.toString();
    console.debug("Get BluetoothPWD:", BluetoothPWD);
    console.debug("saved DB BluetoothSTA_SSID:", connectionCtx.BleSTASSIDDwarf);
    console.debug("saved DB BluetoothSTA_PWD:", connectionCtx.BleSTAPWDDwarf);

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
        } catch (error) {
          // If the first service isn't found, try the second one
          service = await server.getPrimaryService(Dwarf3_ID_String);
        }

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

      if (!IsFirstStepOK && value.byteLength) {
        let bufferReadConfig = new Uint8Array(value.buffer);
        console.log("Buffer:", bufferReadConfig);
        configValue = analyzePacketBle(bufferReadConfig, false);
        console.log("Read:", configValue);
        let result_data = JSON.parse(configValue);

        // check if Config Frame received
        if (result_data.cmd === undefined || result_data.cmd != 1) {
          // Ignore Frame
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
          // disconnect Bluetooth
          actionDisconnect();
        }
        // check StaMod Not Configured but config saved in memory
        else if (
          result_data.state == 0 &&
          connectionCtx.BleSTASSIDDwarf !== undefined &&
          connectionCtx.BleSTASSIDDwarf &&
          connectionCtx.BleSTAPWDDwarf !== undefined &&
          connectionCtx.BleSTAPWDDwarf
        ) {
          setErrorTxt("Load WiFi configuration...");
          IsFirstStepOK = true;
          let bufferSetWifiSta = messageWifiSTA(
            1,
            BluetoothPWD,
            connectionCtx.BleSTASSIDDwarf,
            connectionCtx.BleSTAPWDDwarf
          );
          await characteristicDwarf.writeValue(bufferSetWifiSta);
        }
        // check StaMod Configured
        else if (result_data.state != 2) {
          setErrorTxt(
            "Error WiFi configuration not Completed! Restart it and Use the mobile App."
          );
          setConnecting(false);
          setConnectionStatus(false);
          // disconnect Bluetooth
          actionDisconnect();
        } else if (result_data.wifiMode != 2) {
          setErrorTxt(
            "Error STA MODE not Configured! Restart it and Use the mobile App."
          );
          setConnecting(false);
          setConnectionStatus(false);
          // disconnect Bluetooth
          actionDisconnect();
        }
        // set WifiSTA
        else {
          IsFirstStepOK = true;
          let bufferSetWifiSta = messageWifiSTA(
            1,
            BluetoothPWD,
            result_data.ssid,
            result_data.psd
          );
          await characteristicDwarf.writeValue(bufferSetWifiSta);
        }
      } else if (IsFirstStepOK && value.byteLength) {
        IsFirstStepOK = false;
        let bufferReadResult = new Uint8Array(value.buffer);
        console.log("Buffer:", bufferReadResult);
        configValue = analyzePacketBle(bufferReadResult, false);
        console.log("Read:", configValue);
        let result_data = JSON.parse(configValue);

        // check if STA Frame received
        if (result_data.cmd === undefined || result_data.cmd != 3) {
          // Ignore Frame
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
          // disconnect Bluetooth
          actionDisconnect();
        } else {
          console.log("Connected with IP: ", result_data.ip);
          setErrorTxt(" IP: " + result_data.ip);
          // force disconnect if new IP
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
      // Add the new class
      setErrorTxt("Error, Retry...");
      console.error(error);
      setConnecting(false);
      setConnectionStatus(false);
      // disconnect Bluetooth
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
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

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
              <div className="col-md-2">
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
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-more02 me-3">
            <i className="icon-bluetooth" /> {t("pConnect")}
          </button>{" "}
          {renderConnectionStatus()}
        </form>
      </ol>
    </div>
  );
}
