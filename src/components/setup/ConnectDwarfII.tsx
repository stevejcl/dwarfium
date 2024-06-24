import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useContext, useState } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { connectionHandler } from "@/lib/connect_utils";
import { fetchIPDwarfDB } from "@/db/db_utils";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ConnectDwarfII() {
  const connectionCtx = useContext(ConnectionContext);

  const [connecting, setConnecting] = useState(false);
  const [slavemode, setSlavemode] = useState(false);
  const [goLive, setGoLive] = useState(false);
  const [errorTxt, setErrorTxt] = useState("");

  async function checkConnection() {
    await sleep(100);

    let IPDwarf = connectionCtx.IPDwarf;
    if (IPDwarf === undefined || !IPDwarf) IPDwarf = fetchIPDwarfDB();
    setConnecting(true);
    setErrorTxt("");
    connectionHandler(
      connectionCtx,
      IPDwarf,
      false,
      setConnecting,
      setSlavemode,
      setGoLive,
      setErrorTxt
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
  function renderConnectionStatus() {
    let goLiveMessage = "";
    if (goLive) {
      goLiveMessage = "=> Go Live";
    }
    if (connecting) {
      return <span className="text-warning-connect">{t("pConnecting")}</span>;
    }
    if (connectionCtx.connectionStatus === undefined) {
      return null;
    }
    if (connectionCtx.connectionStatus === false) {
      return (
        <span className="text-danger-connect">
          {t("pConnectingFailed")} {errorTxt}.
        </span>
      );
    }
    if (connectionCtx.connectionStatusSlave || slavemode) {
      return (
        <span className="text-warning-connect">
          {t("pConnectionSuccessFull")} (Slave Mode) {goLiveMessage} {errorTxt}.
        </span>
      );
    }

    return (
      <span className="text-success-connect">
        {t("pConnectionSuccessFull")}. {goLiveMessage} {errorTxt}
      </span>
    );
  }

  return (
    <div className="connect-dwarf">
      <div className="connect-dwarf-status">{renderConnectionStatus()}{" "}
          <button className="btn btn-more02" onClick={checkConnection}>
        {t("pConnect")}
          </button></div>
          <div className="connect-stellarium">
              <button className="btn btn-more02">Stellarium
          </button></div>
      </div>

  );
}
