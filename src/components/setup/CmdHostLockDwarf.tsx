import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import React, { useEffect, useContext, useState } from "react";
import {
  Dwarfii_Api,
  messageSystemSetMasterLock,
  WebSocketHandler,
} from "dwarfii_api";
import { saveIPConnectDB } from "@/db/db_utils";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { logger } from "@/lib/logger";

export default function CmdHostLockDwarf() {
  const connectionCtx = useContext(ConnectionContext);

  const [isHostLock, setIsHostLock] = useState(true);

  const handleClickLockHost = (event) => {
    event.preventDefault();
    let currentMode = isHostLock;
    setIsHostLock(!isHostLock); // Toggle the state between true and false

    if (connectionCtx.IPDwarf === undefined) {
      return;
    }

    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.socketIPDwarf);

    const customMessageHandler = (txt_info, result_data) => {
      if (result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_SYSTEM_SET_MASTERLOCK) {
        if (result_data.data.mode != currentMode) {
          console.log("Command setHostSlaveMod OK");
        } else {
          console.log("Command setHostSlaveMod KO");
        }
      } else {
        logger("", result_data, connectionCtx);
      }
      logger(txt_info, result_data, connectionCtx);
    };

    // Send Commands : cmdSystemSetHostSlaveMode
    let WS_Packet = messageSystemSetMasterLock(!currentMode);
    let txtInfoCommand = "SetHostSlaveMode";

    webSocketHandler.prepare(
      WS_Packet,
      txtInfoCommand,
      [Dwarfii_Api.DwarfCMD.CMD_SYSTEM_SET_MASTERLOCK],
      customMessageHandler
    );

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
  };

  const handleClickDisconnect = (event) => {
    event.preventDefault();

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

  function renderHostLock() {
    if (
      connectionCtx.connectionStatus === true &&
      !connectionCtx.connectionStatusSlave
    ) {
      return (
        <div>
          <button
            onClick={handleClickLockHost}
            className="btn btn-more02 me-3 right-align"
          >
            {isHostLock ? t("cUnlockHost") : t("cLockHost")}
          </button>
          <button
            onClick={handleClickDisconnect}
            className="btn btn-more02 me-3 right-align"
          >
            {t("pDisconnect")}
          </button>
        </div>
      );
    }
    if (
      connectionCtx.connectionStatus === true &&
      connectionCtx.connectionStatusSlave == true
    ) {
      return (
        <div>
          <button
            onClick={handleClickDisconnect}
            className="btn btn-more02 me-3 right-align"
          >
            {t("pDisconnect")}
          </button>
        </div>
      );
    }
    return null;
  }

  return <div className="sethostmode-dwarf">{renderHostLock()}</div>;
}
