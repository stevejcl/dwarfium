import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import React, { useEffect, useContext, useState } from "react";
import {
  Dwarfii_Api,
  messageSystemSetHostSlaveMode,
  WebSocketHandler,
} from "dwarfii_api";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { logger } from "@/lib/logger";


export default function CmdHostLockDwarf() {
  const connectionCtx = useContext(ConnectionContext);

  const [isHostLock, setIsHostLock] = useState(false);

  const handleClickLockHost = (event) => {
    event.preventDefault();
    setIsHostLock(!isHostLock); // Toggle the state between true and false

    if (connectionCtx.IPDwarf === undefined) {
      return;
    }

    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.socketIPDwarf);

    const customMessageHandler = (txt_info, result_data) => {
      if (
        result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WS_HOST_SLAVE_MODE
      ) {
        if (result_data.data.mode == isHostLock) {
          console.log("Commande setHostSlaveMod OK");
        } else {
          console.log("Commande setHostSlaveMod KO");
        }
      } else {
        logger("", result_data, connectionCtx);
      }
      logger(txt_info, result_data, connectionCtx);
    };

    // Send Commands : cmdSystemSetHostSlaveMode
    let WS_Packet = messageSystemSetHostSlaveMode(isHostLock ? 1 : 0);
    let txtInfoCommand = "SetHostSlaveMode";

    webSocketHandler.prepare(
      WS_Packet,
      txtInfoCommand,
      [Dwarfii_Api.DwarfCMD.CMD_NOTIFY_WS_HOST_SLAVE_MODE],
      customMessageHandler
    );

    if (!webSocketHandler.run()) {
      console.error(" Can't launch Web Socket Run Action!");
    }
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
        <button
          onClick={handleClickLockHost}
          className="btn btn-more02 me-3 right-align"
        >
              {isHostLock ? t("cUnlockHost") : t("cLockHost")}
        </button>
      );
    }
    return null;
  }

  return <div className="sethostmode-dwarf">{renderHostLock()}</div>;
}
