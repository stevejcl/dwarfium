import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useContext, useState, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";

import CmdHostLockDwarf from "@/components/setup/CmdHostLockDwarf";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { saveIPDwarfDB, saveIPConnectDB } from "@/db/db_utils";

import { connectionHandler } from "@/lib/connect_utils";

const DwarfClientID_original = "0000DAF2-0000-1000-8000-00805F9B34FB";
const DwarfClientID_base = "0000DAF2-0000-1000-8000-00805F9B35";

import { DwarfClientID, setDwarfClientID, WebSocketHandler } from "dwarfii_api";

export default function ConnectDwarf() {
  let connectionCtx = useContext(ConnectionContext);
  const [currentDwarfClientID, setCurrentDwarfClientID] =
    useState(DwarfClientID); // Store initial DwarfClientID
  const [isChecked, setIsChecked] = useState(false); // Track checkbox state
  const [randomDwarfClientID, setRandomDwarfClientID] = useState("");

  const originalDwarfClientID = useRef(DwarfClientID_original);

  const [connecting, setConnecting] = useState(false);
  const [slavemode, setSlavemode] = useState(false);
  const [goLive, setGoLive] = useState(false);
  const [errorTxt, setErrorTxt] = useState("");

  useEffect(() => {
    console.log("originalDwarfClientID:" + originalDwarfClientID.current);
    console.log("DwarfClientID:" + DwarfClientID);
    setIsChecked(originalDwarfClientID.current != DwarfClientID);
  }, []);

  async function checkConnection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formIP = formData.get("ip");
    let IPDwarf = formIP?.toString();

    if (IPDwarf == undefined) {
      return;
    }

    setConnecting(true);
    connectionCtx.setIPDwarf(IPDwarf);
    saveIPDwarfDB(IPDwarf);
    console.log(
      "Start connection with " + IPDwarf + " using ClientID: " + DwarfClientID
    );
    console.log("Current ClientID: " + currentDwarfClientID);
    connectionHandler(
      connectionCtx,
      IPDwarf,
      true,
      setConnecting,
      setSlavemode,
      setGoLive,
      setErrorTxt
    );
  }

  function ipHandler(e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.trim();
    if (value === "") return;

    saveIPDwarfDB(value);
    connectionCtx.setIPDwarf(value);
  }

  function renderConnectionStatus() {
    let goLiveMessage = "";
    if (goLive) {
      goLiveMessage = "=> Go Live";
    }
    if (connecting) {
      return <span className="text-warning-connect">{t("pConnecting")}</span>;
    }
    if (connectionCtx.connectionStatus === undefined) {
      return <></>;
    }
    if (connectionCtx.connectionStatus === false) {
      return (
        <span className="text-danger">
          {t("pConnectingFailed")}
          {errorTxt}.
        </span>
      );
    }
    if (connectionCtx.connectionStatusSlave || slavemode) {
      return (
        <span className="text-warning">
          {t("pConnectionSuccessFull")} (Slave Mode) {goLiveMessage}
          {errorTxt}.
        </span>
      );
    }

    return (
      <span className="text-success-connect">
        {t("pConnectionSuccessFull")} {goLiveMessage}
        {errorTxt}
      </span>
    );
  }

  const renderCmdHostLockDwarf = () => {
    // Your logic for rendering CmdHostLockDwarf
    // Example:
    return <CmdHostLockDwarf />;
  };

  function forceDisconnect() {
    if (connectionCtx.IPDwarf === undefined) {
      return;
    }

    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.socketIPDwarf);

    // send command to Force Disconnect
    webSocketHandler.cleanup(true);
    saveIPConnectDB("");
    connectionCtx.setConnectionStatus(false);
  }

  function generateRandomDwarfID() {
    // Generate a random value between 0x00 and 0xFF (255 in decimal)
    const randomValue = Math.floor(Math.random() * 256); // 256 because Math.random() generates 0 to <1

    const randomHex = randomValue.toString(16).padStart(2, "0").toUpperCase();

    return DwarfClientID_base + randomHex;
  }

  function updateDwarfID() {
    const newRandomID = generateRandomDwarfID();
    setRandomDwarfClientID(newRandomID);
    setCurrentDwarfClientID(newRandomID);
    setDwarfClientID(newRandomID);
    console.log("New ClientID generated: " + newRandomID);
  }

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setIsChecked(isChecked);

    forceDisconnect();
    if (isChecked) {
      // If a random ID was already generated, use that. Otherwise, generate a new one
      if (!randomDwarfClientID) {
        updateDwarfID();
      } else {
        setCurrentDwarfClientID(randomDwarfClientID); // Use existing random ID
        setDwarfClientID(randomDwarfClientID);
      }
    } else {
      // Revert to the original DwarfClientID when unchecked
      setCurrentDwarfClientID(originalDwarfClientID.current); // Revert to original
      setDwarfClientID(originalDwarfClientID.current); // Restore original in the backend
    }
  };

  const handleRefresh = (event) => {
    event.preventDefault();

    if (isChecked) {
      forceDisconnect();
      updateDwarfID();
    }
  };

  const handleReset = (event) => {
    event.preventDefault();

    connectionCtx.setTypeIdDwarf(undefined);
    connectionCtx.setTypeNameDwarf(undefined);
  };

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
      <h2>
        {t("pConnectDwarfII", { DwarfType: connectionCtx.typeNameDwarf })}
      </h2>

      <p>
        {t("pConnectDwarfIIContent", {
          DwarfType: connectionCtx.typeNameDwarf,
        })}
      </p>

      <ol>
        <li className="mb-2">
          {t("pConnectDwarfIIContent1", {
            DwarfType: connectionCtx.typeNameDwarf,
          })}
        </li>
        <li className="mb-2">{t("pConnectDwarfIIContent2")}</li>
        <li className="mb-2">
          {t("pConnectDwarfIIContent3", {
            DwarfType: connectionCtx.typeNameDwarf,
          })}
        </li>
        <li className="mb-2">
          {t("pConnectDwarfIIContent4", {
            DwarfType: connectionCtx.typeNameDwarf,
          })}
        </li>
        <li className="mb-2">
          {t("pConnectDwarfIIContent5", {
            DwarfType: connectionCtx.typeNameDwarf,
          })}
        </li>
        <form onSubmit={checkConnection} className="mb-3">
          <div className="row mb-3">
            <div className="col-md-1">
              <label htmlFor="notify" className="form-label">
                {connectionCtx.typeNameDwarf}
              </label>
            </div>
            <div className="col">
              <button className="btn-refresh" onClick={handleReset}>
                <i className="fa fa-refresh" aria-hidden="true"></i>
              </button>{" "}
              {t("pResetDwarfType")}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-1">
              <label htmlFor="notify" className="form-label">
                Specific ID
              </label>
            </div>
            <div className="col">
              <input
                type="checkbox"
                id="notify"
                name="notify"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(e)}
              />{" "}
              <button className="btn-refresh" onClick={handleRefresh}>
                <i className="fa fa-refresh" aria-hidden="true"></i>
              </button>{" "}
              {t("pConnectPrivateID")}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-1">
              <label htmlFor="ip" className="form-label">
                IP
              </label>
            </div>
            <div className="col-lg-2 col-md-10">
              <input
                className="form-control"
                id="ip"
                name="ip"
                placeholder="127.0.0.1"
                required
                defaultValue={connectionCtx.IPDwarf}
                onChange={(e) => ipHandler(e)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-more02 me-3">
            <i className="icon-wifi" /> {t("pConnect")}
          </button>{" "}
          {renderConnectionStatus()}
          {renderCmdHostLockDwarf()}
        </form>
        <li className="mb-4">{t("pConnectDwarfIIContent6")}</li>
      </ol>
    </div>
  );
}
