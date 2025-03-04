/// <reference types="web-bluetooth" />
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useContext, useState, useRef } from "react";
import type { ChangeEvent } from "react";
import type { FormEvent } from "react";
import {
  getProxyUrl,
  getServerIp,
  getServerUrl,
  checkHealth,
  isModeHttps,
  isLocalIp,
  checkMediaMtxStreamUrls,
  compareURLsIgnoringPort,
} from "@/lib/get_proxy_url";
import axios from "axios";
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
  saveProxyIPDB,
  saveProxyLocalIPDB,
} from "@/db/db_utils";

export default function ConnectDwarfSTA() {
  let connectionCtx = useContext(ConnectionContext);

  const [showHelp, setShowHelp] = useState(false);
  const [onTauri, setOnTauri] = useState(false);
  const [savedProxyUrl, setSavedProxyUrl] = useState<string | undefined>("");
  const [proxyIpValue, setProxyIpValue] = useState("");
  const [proxyLocalIpValue, setProxyLocalIpValue] = useState("");
  const [proxyLocalIPs, setProxyLocalIPs] = useState<string[]>([]);
  const [isCustomInput, setIsCustomInput] = useState(false);
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
  const [stateProxy, setStateProxy] = useState(false);
  const [stateBluetoothProxy, setStateBluetoothProxy] = useState(false);
  const [stateBluetoothServer, setStateBluetoothServer] = useState(false);
  const [stateMediaMtx, setStateMediaMtx] = useState(false);
  const [isProxyOnServer, setIsProxyOnServer] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(""); // Debounced value

  const handleInputPWDChange = (event) => {
    setBluetoothPWD(event.target.value);
  };
  const handleInputSSIDChange = (event) => {
    setWifi_SSID(event.target.value);
  };
  const handleInputWifiPWDChange = (event) => {
    setWifi_PWD(event.target.value);
  };
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(proxyIpValue); // Update debounced value after delay
    }, 1500);

    return () => {
      clearTimeout(handler); // Clear timeout on cleanup
    };
  }, [proxyIpValue]);

  let IsFirstStepOK = false;
  let configValue;
  let deviceDwarf;
  let deviceDwarfID;
  let deviceDwarfName;
  let characteristicDwarf;

  function button_progress() {
    document.body.style.cursor = "progress";
    const button1 = document.getElementById("btnWeb");
    if (button1) button1.classList.add("button-loading");

    const button2 = document.getElementById("btnDirect");
    if (button2) button2.classList.add("button-loading");
  }

  function button_default() {
    document.body.style.cursor = "default";
    const button1 = document.getElementById("btnWeb");
    if (button1) button1.classList.remove("button-loading");

    const button2 = document.getElementById("btnDirect");
    if (button2) button2.classList.remove("button-loading");
  }

  async function checkConnection(e: FormEvent<HTMLFormElement>) {
    button_progress();
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
    } finally {
      button_default();
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
    } finally {
      button_default();
    }
  }

  function onDisconnected() {
    console.log("> Bluetooth Device disconnected");
    setConnectionStatus(false);
    button_default();
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
    } finally {
      button_default();
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
    setBluetoothPWD(connectionCtx.BlePWDDwarf || "DWARF_12345678");
    setWifi_SSID(connectionCtx.BleSTASSIDDwarf || "");
    setWifi_PWD(connectionCtx.BleSTAPWDDwarf || "");
  }, []);

  useEffect(() => {
    const isTauri = "__TAURI__" in window;
    console.log("Effect triggered, aborting previous request if exists...");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort the previous request
    }
    abortControllerRef.current = new AbortController(); // Create a new one
    const signal = abortControllerRef.current.signal;

    // Test Proxy
    const getProxyLocalIP = async (proxyUrl, signal) => {
      if (!proxyUrl) {
        setProxyLocalIPs([]);
        return;
      }
      // Fetch local IPs from the backend
      const urlProxyRequest = proxyUrl?.includes("api")
        ? "/api/getLocalIP"
        : proxyUrl + "/getLocalIP";
      try {
        const response = await axios.get(urlProxyRequest, { signal });
        const ipList = response.data.ips;
        setProxyLocalIPs(ipList);
        if (
          connectionCtx?.proxyLocalIP &&
          !ipList.includes(connectionCtx.proxyLocalIP)
        )
          ipList.push(connectionCtx.proxyLocalIP);
        // If there's a saved IP in context, use it (even if it's not in the list)
        if (connectionCtx?.proxyLocalIP) {
          setProxyLocalIpValue(connectionCtx.proxyLocalIP);
        } else {
          setProxyLocalIpValue(ipList[0]); // Default to first available IP
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (signal.aborted) {
            console.log("Request aborted: getProxyLocalIP");
          } else {
            console.error("Error fetching local IPs: ", error);
          }
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
    };

    const checkProxyStatus = async (signal: AbortSignal) => {
      let proxyUrl = getProxyUrl(connectionCtx);
      setSavedProxyUrl(proxyUrl);

      let serverUrl = getServerUrl();
      let isHttps = isModeHttps();
      connectionCtx.setUseHttps(isHttps);

      try {
        setStateMediaMtx(
          await checkMediaMtxStreamUrls(connectionCtx, 3000, signal)
        );

        if (connectionCtx.proxyIP) setProxyIpValue(connectionCtx.proxyIP);

        if (proxyUrl && proxyUrl.includes("api")) {
          // Run health checks in parallel, passing the signal
          const [statusProxy, statusBluetoothServer] = await Promise.all([
            checkHealth("/api/health", 3000, signal),
            checkHealth("/api/run-exe-health", 3000, signal),
          ]);

          setIsProxyOnServer(true);
          setStateProxy(statusProxy);

          if (statusProxy) {
            const serverIp = getServerIp();
            if (serverIp) connectionCtx.setProxyInLan(isLocalIp(serverIp));
            await getProxyLocalIP(proxyUrl, signal);
          }

          if (statusProxy && statusBluetoothServer) {
            setStateBluetoothProxy(true);
            setStateBluetoothServer(true);
            setUseDirectBluetooth(true);
            connectionCtx.setUseDirectBluetoothServer(true);
          } else {
            setStateBluetoothProxy(false);
            setStateBluetoothServer(false);
            setUseDirectBluetooth(false);
            connectionCtx.setUseDirectBluetoothServer(false);
          }
        } else {
          let sameProxyServer = compareURLsIgnoringPort(proxyUrl, serverUrl);

          // Run health checks in parallel, passing the signal
          const [statusProxy, statusBluetoothProxy, statusBluetoothServer] =
            await Promise.all([
              checkHealth(proxyUrl + "/health", 3000, signal),
              checkHealth(proxyUrl + "/run-exe-health", 3000, signal),
              checkHealth(serverUrl + "/run-exe-health", 3000, signal),
            ]);

          setIsProxyOnServer(sameProxyServer);
          setStateProxy(statusProxy);

          if (statusProxy) {
            if (connectionCtx?.proxyIP && connectionCtx?.proxyLocalIP) {
              const proxyLocalUrl = proxyUrl?.replace(
                connectionCtx.proxyIP,
                connectionCtx.proxyLocalIP
              );
              let statusLocalProxy = await checkHealth(
                proxyLocalUrl + "/health",
                3000,
                signal
              );
              connectionCtx.setProxyInLan(statusLocalProxy);
            }
            await getProxyLocalIP(proxyUrl, signal);
          }

          setStateBluetoothServer(false);
          setStateBluetoothProxy(false);
          setUseDirectBluetooth(false);

          if (statusProxy && statusBluetoothProxy) {
            setStateBluetoothProxy(true);
            setUseDirectBluetooth(true);
          }
          if (statusBluetoothServer) {
            setStateBluetoothServer(true);
            setUseDirectBluetooth(true);
          }

          connectionCtx.setUseDirectBluetoothServer(
            sameProxyServer
              ? statusBluetoothServer
              : statusBluetoothServer && !statusBluetoothProxy
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (signal.aborted) {
            console.log("checkProxyStatus aborted due to new request.");
          } else {
            console.error("Error in checkProxyStatus:", error);
          }
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
    };

    if (isTauri) {
      setOnTauri(true);
      connectionCtx?.setProxyInLan(true);
    } else {
      checkProxyStatus(signal);
    }
    return () => {
      console.log("Cleanup: Aborting previous checkProxyStatus call");
      abortControllerRef.current?.abort();
    };
  }, [connectionCtx.proxyIP]);

  // Handle checkbox change
  const handleCheckboxBleServerChange = (event) => {
    const isChecked = event.target.checked;
    connectionCtx.setUseDirectBluetoothServer(isChecked);
  };

  const refreshProxyLocalIP = async (proxyIP) => {
    if (!proxyIP) {
      setProxyLocalIPs([]);
      return;
    }
    console.log("refreshProxyLocalIP");

    // Fetch local IPs from the backend
    const protocol = connectionCtx.useHttps ? "https:" : "http:";
    const port = connectionCtx.useHttps
      ? process.env.NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS
      : process.env.NEXT_PUBLIC_PORT_PROXY_CORS;
    const urlProxyRequest = `${protocol}//${proxyIP}:${port}/getLocalIP`;
    console.log("refreshProxyLocalIP", urlProxyRequest);
    axios
      .get(urlProxyRequest)
      .then((response) => {
        const ipList = response.data.ips;
        console.log("refreshProxyLocalIP", ipList);
        setProxyLocalIPs(ipList);
        if (
          connectionCtx?.proxyLocalIP &&
          !ipList.includes(connectionCtx.proxyLocalIP)
        )
          ipList.push(connectionCtx.proxyLocalIP);
        // If there's a saved IP in context, use it (even if it's not in the list)
        if (connectionCtx?.proxyLocalIP) {
          setProxyLocalIpValue(connectionCtx.proxyLocalIP);
        } else {
          setProxyLocalIpValue(ipList[0]); // Default to first available IP
        }
      })
      .catch((error) => console.error("Error fetching local IPs:", error));
  };

  function isValidIP(ip) {
    if (typeof ip !== "string") return false;

    // Regular expression for IPv4
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;

    // Regular expression for IPv6
    const ipv6Regex =
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9]))$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  // Trigger logic when the debounced value changes
  useEffect(() => {
    if (debouncedValue !== "") {
      if (isValidIP(debouncedValue)) {
        setProxyLocalIPs([]);
        setProxyLocalIpValue("");
        refreshProxyLocalIP(debouncedValue);
      }
    }
  }, [debouncedValue]);

  function ipHandler(e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.trim();
    if (value === "") return;
    console.log("ipHandler");
    setProxyIpValue(value);
  }

  function ChangeProxy() {
    connectionCtx.setProxyIP(proxyIpValue);
    connectionCtx.setProxyLocalIP(proxyLocalIpValue);
    saveProxyIPDB(proxyIpValue);
    saveProxyLocalIPDB(proxyLocalIpValue);
  }

  function ResetProxy() {
    setProxyIpValue("");
    connectionCtx.setProxyIP("");
    saveProxyIPDB(proxyIpValue);
    setProxyLocalIpValue("");
    connectionCtx.setProxyLocalIP("");
    saveProxyLocalIPDB(proxyLocalIpValue);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Add the custom IP to the list if it's not empty and doesn't already exist
      if (
        proxyLocalIpValue &&
        isValidIP(proxyLocalIpValue) &&
        !proxyLocalIPs.includes(proxyLocalIpValue)
      ) {
        setProxyLocalIPs([...proxyLocalIPs, proxyLocalIpValue]);
      }
      setIsCustomInput(false); // Close the input field when Enter is pressed
    }
  };

  const runExecutable = async () => {
    button_progress();
    // Get the Bluetooth password from the input field
    const pwd_data = encodeURIComponent(BluetoothPWD);
    const ssid_data = encodeURIComponent(Wifi_SSID);
    const wifipwd_data = encodeURIComponent(Wifi_PWD);
    const requestCmd = `/run-exe?ble_psd=${pwd_data}&ble_STA_ssid=${ssid_data}&ble_STA_pwd=${wifipwd_data}`;
    let proxyUrl = savedProxyUrl;
    let directProxyUrl = "";
    console.log("savedProxyUrl:", proxyUrl);

    if (!proxyUrl) {
      console.error("runExecutable proxyUrl empty");
      button_default();
      setConnecting(false);
      setConnectionStatus(false);
      return;
    } else if (proxyUrl?.includes("api")) {
      proxyUrl = "/api" + requestCmd;
    } else {
      const requestAddr = getServerUrl() + requestCmd;
      proxyUrl = `${savedProxyUrl}?target=${encodeURIComponent(requestAddr)}`;
      console.log("proxyUrl:", proxyUrl);
      //direct proxy request
      directProxyUrl = `${savedProxyUrl}${requestCmd}`;
      console.log("directProxyUrl:", directProxyUrl);

      if (!connectionCtx.useDirectBluetoothServer) proxyUrl = directProxyUrl;
      console.log("Call Bluetooth Url:", proxyUrl);
    }

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
    button_default();
  };

  return (
    <div>
      {!onTauri && (
        <>
          <h2>{t("pServerStatus")}</h2>

          <p>{t("pServerStatusContent")}</p>
          <p>
            {t("pServerStatusContent1")}
            <br />
            {t("pServerStatusContent2")}
          </p>
          <div className="row mb-3">
            {stateProxy == true && (
              <div className="col-lg-10 col-md-10">
                <i
                  className="bi bi-check-circle"
                  style={{ color: "green" }}
                ></i>
                {savedProxyUrl && savedProxyUrl.includes("api") && (
                  <span> {t("pProxyRunningLocally")}</span>
                )}
                {isProxyOnServer &&
                  savedProxyUrl &&
                  !savedProxyUrl.includes("api") && (
                    <span>
                      {" "}
                      {t("pProxyRunningOnServer")} {savedProxyUrl}
                    </span>
                  )}
                {!isProxyOnServer &&
                  savedProxyUrl &&
                  !savedProxyUrl.includes("api") && (
                    <span>
                      {" "}
                      {t("pProxyRunning")} {savedProxyUrl}
                    </span>
                  )}
              </div>
            )}
            {stateProxy == false && (
              <div className="col-lg-10 col-md-10">
                <i className="bi bi-x-circle" style={{ color: "red" }}></i>
                <span>
                  {" "}
                  {t("pProxyNotRunning")} {savedProxyUrl}
                </span>
              </div>
            )}
            {stateMediaMtx == true && (
              <div className="row mb-3">
                <div className="col-lg-10 col-md-10">
                  <i
                    className="bi bi-check-circle"
                    style={{ color: "green" }}
                  ></i>
                  <span> {t("pMediaMtxRunning")}</span>
                </div>
              </div>
            )}
            {stateMediaMtx == false && (
              <div className="row mb-3">
                <div className="col-lg-10 col-md-10">
                  <i className="bi bi-x-circle" style={{ color: "red" }}></i>
                  <span> {t("pMediaMtxNotRunning")}</span>
                </div>
              </div>
            )}
            {!isProxyOnServer && stateBluetoothProxy == true && (
              <div className="row mb-3">
                <div className="col-lg-10 col-md-10">
                  <i
                    className="bi bi-check-circle"
                    style={{ color: "green" }}
                  ></i>
                  <span> {t("pDirecBluetoothProxyAvailable")}</span>
                </div>
              </div>
            )}
            {!isProxyOnServer && stateBluetoothProxy == false && (
              <div className="row mb-3">
                <div className="col-lg-10 col-md-10">
                  <i className="bi bi-x-circle" style={{ color: "red" }}></i>
                  <span>{t("pDirecBluetoothProxyNotAvailable")}</span>
                </div>
              </div>
            )}
            {!isProxyOnServer && stateBluetoothServer == true && (
              <div className="row mb-3">
                <div className="col-lg-10 col-md-10">
                  <i
                    className="bi bi-check-circle"
                    style={{ color: "green" }}
                  ></i>
                  <span> {t("pDirecBluetoothServerAvailable")}</span>
                </div>
              </div>
            )}
            {!isProxyOnServer && stateBluetoothServer == false && (
              <div className="row mb-3">
                <div className="col-lg-10 col-md-10">
                  <i className="bi bi-x-circle" style={{ color: "red" }}></i>
                  <span> {t("pDirecBluetoothServerNotAvailable")}</span>
                </div>
              </div>
            )}
            {isProxyOnServer &&
              (stateBluetoothProxy || stateBluetoothServer) && (
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-10">
                    <i
                      className="bi bi-check-circle"
                      style={{ color: "green" }}
                    ></i>
                    <span> {t("pDirecBluetoothServerAvailable")}</span>
                  </div>
                </div>
              )}
            {isProxyOnServer &&
              stateBluetoothProxy == false &&
              stateBluetoothServer == false && (
                <div className="row mb-3">
                  <div className="col-lg-10 col-md-10">
                    <i className="bi bi-x-circle" style={{ color: "red" }}></i>
                    <span> {t("pDirecBluetoothServerNotAvailable")}</span>
                  </div>
                </div>
              )}
            {savedProxyUrl && (
              <>
                <p>{t("pServerStatusContent3")}</p>
                <div className="row mb-3">
                  {/* Proxy IP Label */}
                  <div className="col-md-2 text-end">
                    <label htmlFor="proxyIp" className="form-label">
                      {t("pProxyIP")}
                    </label>
                  </div>

                  {/* Proxy IP Input */}
                  <div className="col-lg-2 col-md-10">
                    <input
                      className="form-control"
                      id="proxyIp"
                      name="proxyIp"
                      placeholder="127.0.0.1"
                      value={proxyIpValue}
                      onChange={(e) => ipHandler(e)}
                    />
                  </div>

                  {/* Proxy IP Status Icon */}
                  <div className="col-auto">
                    {proxyIpValue === connectionCtx.proxyIP ? (
                      <i
                        className="bi bi-check-circle text-success"
                        title={t("cProxyIPSaved")}
                      ></i>
                    ) : (
                      <i
                        className="bi bi-exclamation-triangle text-warning"
                        title={t("cProxyIPNotSaved")}
                      ></i>
                    )}
                  </div>

                  {/* Local IP Label */}
                  <div className="col-md-2 text-end">
                    <label htmlFor="proxyLocalIp">{t("pProxyLocalIP")}</label>
                  </div>

                  {/* Local IP Dropdown */}
                  <div className="col-lg-2 col-md-10">
                    <select
                      className="form-control"
                      id="proxyLocalIp"
                      name="proxyLocalIp"
                      value={isCustomInput ? "custom" : proxyLocalIpValue}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsCustomInput(true);
                          setProxyLocalIpValue(""); // Allow manual input
                        } else {
                          setIsCustomInput(false);
                          setProxyLocalIpValue(e.target.value);
                        }
                      }}
                    >
                      {proxyLocalIPs.map((ip) => (
                        <option key={ip} value={ip}>
                          {ip}
                        </option>
                      ))}
                      <option value="custom">Enter Manually</option>
                    </select>
                    {isCustomInput && (
                      <input
                        className="form-control mt-2"
                        type="text"
                        placeholder="Enter custom IP"
                        onChange={(e) => setProxyLocalIpValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    )}{" "}
                  </div>

                  {/* Local IP Status Icon */}
                  <div className="col-auto">
                    {proxyLocalIpValue === connectionCtx.proxyLocalIP ? (
                      <i
                        className="bi bi-check-circle text-success"
                        title="IP is saved in context"
                      ></i>
                    ) : (
                      <i
                        className="bi bi-exclamation-triangle text-warning"
                        title="IP is not saved in context"
                      ></i>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          {savedProxyUrl && (
            <div>
              <button
                id="btnChangeProxy"
                className="btn btn-more02 me-3"
                onClick={(e) => {
                  ChangeProxy();
                  e.preventDefault(); // Prevents any unintended form submission
                }}
              >
                {t("pValidChangeProxy")}
              </button>
              <button
                id="btnResetProxy"
                className="btn btn-more02 me-6"
                onClick={(e) => {
                  ResetProxy();
                  e.preventDefault(); // Prevents any unintended form submission
                }}
              >
                {t("pValidResetProxy")}
              </button>
            </div>
          )}
          <hr />
        </>
      )}
      <h2>{t("pEnableSTA", { DwarfType: connectionCtx.typeNameDwarf })}</h2>

      <p>
        {t("pEnableSTAContent", { DwarfType: connectionCtx.typeNameDwarf })}
      </p>

      <div
        title={showHelp ? t("pHideHelp") : t("pShowHelp")}
        className={`help-msg nav-link me-2`}
        onClick={() => setShowHelp((prev) => !prev)}
      >
        <i className="bi bi-info-square"></i>
      </div>
      {showHelp && (
        <ol>
          <li className="mb-2">
            {t("pEnableSTAContent1", {
              DwarfType: connectionCtx.typeNameDwarf,
            })}
            <br />
          </li>
          <li>
            {t("pEnableSTAContent2", {
              DwarfType: connectionCtx.typeNameDwarf,
            })}
          </li>
          <li className="mb-2">
            {t("pEnableSTAContent3", {
              DwarfType: connectionCtx.typeNameDwarf,
            })}
          </li>
        </ol>
      )}
      <br />
      <form onSubmit={checkConnection} className="mb-3">
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
              value={BluetoothPWD}
              onChange={handleInputPWDChange}
            />
          </div>
          <div className="col-md-2 text-end">
            <label htmlFor="ssid" className="form-label">
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
              value={Wifi_SSID}
              onChange={handleInputSSIDChange}
            />
          </div>
          <div className="col-md-2 text-end">
            <label htmlFor="wifipwd" className="form-label">
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
              value={Wifi_PWD}
              onChange={handleInputWifiPWDChange}
            />
          </div>
        </div>
        {useDirectBluetooth == true &&
          !isProxyOnServer &&
          stateBluetoothProxy &&
          stateBluetoothServer && (
            <div className="row mb-3">
              <div className="col-lg-2 col-md-10">
                <div>
                  <input
                    type="checkbox"
                    id="server"
                    name="server"
                    checked={connectionCtx.useDirectBluetoothServer}
                    onChange={(e) => handleCheckboxBleServerChange(e)}
                  />{" "}
                  {t("pDirecBluetoothOnServer")}
                </div>
              </div>
            </div>
          )}
        <button id="btnWeb" type="submit" className="btn btn-more02 me-3">
          <i className="icon-bluetooth" /> {t("pConnectWeb")}
        </button>
        {useDirectBluetooth == true && (
          <button
            id="btnDirect"
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
    </div>
  );
}
