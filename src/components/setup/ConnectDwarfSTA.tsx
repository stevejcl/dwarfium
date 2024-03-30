/// <reference types="web-bluetooth" />
import { useContext, useState } from "react";
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
  let deviceDwarfII;
  let characteristicDwarfII;
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

      if (deviceDwarfII) {
        // disconnect Bluetooth
        console.debug("disconnect already connected device");
        actionDisconnect();
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "DWARF" },
          { services: ["0000daf2-0000-1000-8000-00805f9b34fb"] },
        ],
        optionalServices: ["0000daf2-0000-1000-8000-00805f9b34fb"],
      });

      if (device) {
        deviceDwarfII = device;
        // Add the new class
        setFindDwarfBluetooth(true);
        setErrorTxt(deviceDwarfII.name);
        console.debug("Got device:", deviceDwarfII.name);
        console.debug("id:", deviceDwarfII.id);
        deviceDwarfII.addEventListener(
          "gattserverdisconnected",
          onDisconnected
        );

        if (!deviceDwarfII.gatt) throw new Error("Can't get bluetooth gatt ");
        else console.debug("gatt:", deviceDwarfII.gatt);

        const server = await deviceDwarfII.gatt.connect();
        if (!server) throw new Error("Can't get gatt bluetooth service");
        else console.debug("Got bluetooth connected");

        const service = await server.getPrimaryService(
          "0000daf2-0000-1000-8000-00805f9b34fb"
        );
        if (!service) throw new Error("Can't get bluetooth service");
        else console.debug("Got bluetooth service");

        const characteristic = await service.getCharacteristic(
          "00009999-0000-1000-8000-00805f9b34fb"
        );
        if (!characteristic)
          throw new Error("Can't get bluetooth characteristic");

        characteristicDwarfII = characteristic;
        console.debug("Got characteristic:", characteristicDwarfII.uuid);
        console.debug("Got characteristic:", characteristicDwarfII.service);
        console.debug(characteristicDwarfII);
        setEtatBluetooth(true);

        characteristicDwarfII.addEventListener(
          "characteristicvaluechanged",
          handleValueChanged
        );
        await characteristicDwarfII.startNotifications();

        const data_test = await characteristicDwarfII.readValue();
        console.debug("Got detail characteristic:", data_test);
        console.debug(data_test);

        // get Wifi
        let bufferGetConfig = messageGetconfig(BluetoothPWD);

        await characteristicDwarfII.writeValue(bufferGetConfig);
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
          await characteristicDwarfII.writeValue(bufferSetWifiSta);
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
          await characteristicDwarfII.writeValue(bufferSetWifiSta);
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
          await characteristicDwarfII.stopNotifications();
          characteristicDwarfII.removeEventListener(
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
      if (characteristicDwarfII) {
        await characteristicDwarfII.stopNotifications();
        characteristicDwarfII.removeEventListener(
          "characteristicvaluechanged",
          handleValueChanged
        );
      }
      if (deviceDwarfII) {
        deviceDwarfII.removeEventListener(
          "gattserverdisconnected",
          onDisconnected
        );
        if (deviceDwarfII.gatt) await deviceDwarfII.gatt.disconnect();
      }
    } catch (error) {
      console.error(error);
    }
  }

  function renderConnectionStatus() {
    if (connecting) {
      return <span>Connecting...</span>;
    }
    if (connectionStatus === undefined) {
      return <></>;
    }
    if (connectionStatus === false) {
      return (
        <span className="text-danger-connect">
          Connection failed {errorTxt}.
        </span>
      );
    }
    if (findDwarfBluetooth && !connectionStatus) {
      return (
        <span className="text-warning-connect">
          Found Dwarf II
          {errorTxt}.
        </span>
      );
    }
    if (etatBluetooth && !connectionStatus) {
      return (
        <span className="text-warning-connect">
          Connected to Dwarf II
          {errorTxt}.
        </span>
      );
    }

    return (
      <span className="text-success-connect">
        Connection successful.
        {errorTxt}
      </span>
    );
  }

  return (
    <div>
      <h2>Enable STA Mode on Dwarf II</h2>

      <p>
        In order for this site to connect to the Dwarf II, the Dwarf II must
        have the STA mode configured and on.
      </p>

      <ol>
        <li className="mb-2">
          When using for the first time, you need the DwarfLab mobile app to
          establish the connection, then without restarting the dwarf, connect
          to it via the Connect Bluetooth button. The configuration will then be
          saved.
          <br />
        </li>
        <li className="mb-2">
          Then, for the next starts of the Dwarf, you can connect directly to it
          via Bluetooth, without using the mobile application.
        </li>
        <li className="mb-2">
          Click Connect. This site will try to connect via Bluetooth to Dwarf
          II.
        </li>
        <form onSubmit={checkConnection} className="mb-3">
          <div className="row mb-3">
            <div className="row mb-3">
              <div className="col-md-2">
                <label htmlFor="pwd" className="form-label">
                  Bluetooth PASSWORD
                </label>
              </div>
              <div className="col-md-2">
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
            <i className="icon-bluetooth" /> Connect
          </button>{" "}
          {renderConnectionStatus()}
        </form>
      </ol>
    </div>
  );
}
