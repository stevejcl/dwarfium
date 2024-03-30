import { useContext, useEffect, useState } from "react";

import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  saveConnectionStatusDB,
  saveInitialConnectionTimeDB,
  saveConnectionStatusStellariumDB,
} from "@/db/db_utils";
import { firmwareVersion, WebSocketHandler } from "dwarfii_api";
import { ConnectionContextType } from "@/types";

export function useSetupConnection() {
  let connectionCtx = useContext(ConnectionContext);
  const [errorCount, setErrorCount] = useState(0);

  let errorCountMax = 5;

  useEffect(() => {
    let timerDwarf: any = undefined;
    let timerStellarium: any = undefined;

    if (connectionCtx.connectionStatus) {
      timerDwarf = checkDwarfConnection(connectionCtx, timerDwarf, false);

      // continously check connection status
      if (timerDwarf === undefined) {
        console.debug("Start Dwarf connection timer");
        timerDwarf = setInterval(() => {
          checkDwarfConnection(connectionCtx, timerDwarf, true);
        }, 90 * 1000);
      }
    }

    if (connectionCtx.connectionStatusStellarium) {
      timerStellarium = checkStellariumConnection(
        connectionCtx,
        timerStellarium,
        false
      );

      // continously check connection status
      if (timerStellarium === undefined) {
        console.debug("Start Stellarium connection timer");
        timerStellarium = setInterval(() => {
          checkStellariumConnection(connectionCtx, timerStellarium, true);
        }, 90 * 1000);
      }
    }
    return () => {
      if (connectionCtx.connectionStatus === false) {
        console.log("unmount: delete checkDwarfConnection timer");
        clearInterval(timerDwarf);
      }
      if (connectionCtx.connectionStatusStellarium === false) {
        console.log("unmount: delete checkStellariumConnection timer");
        clearInterval(timerStellarium);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function checkDwarfConnection(
    connectionCtx: ConnectionContextType,
    timer: any,
    loop: boolean
  ) {
    if (connectionCtx.IPDwarf === undefined) {
      console.log("Check Dwarf connection no IPDwarf!");
      return timer;
    }
    console.debug("Check Dwarf connection timer");
    // if we can't connect to camera in 2 seconds, reset connection data
    fetch(firmwareVersion(connectionCtx.IPDwarf), {
      signal: AbortSignal.timeout(5000),
      mode: "no-cors",
      method: "POST",
    })
      .then(() => {
        console.log("Dwarf connection ok.", loop ? " (loop)" : "");
        setErrorCount(0);
        if (!connectionCtx.connectionStatus) {
          connectionCtx.setConnectionStatus(true);
          saveConnectionStatusDB(true);
          saveInitialConnectionTimeDB();
        }
      })
      .catch((err) => {
        if (err.name === "AbortError" || err.message == "Failed to fetch") {
          console.log("Dwarf verification connection");

          console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
          const webSocketHandler = connectionCtx.socketIPDwarf
            ? connectionCtx.socketIPDwarf
            : new WebSocketHandler(connectionCtx.IPDwarf);

          if (webSocketHandler.isConnected()) {
            setErrorCount(0);
            console.log("Dwarf connection ok");
          } else {
            console.log("Dwarf connection error");
            // let more time for autoconnect function!
            if (errorCount < errorCountMax) {
              // retry later
              console.log("Dwarf connection error count:", errorCount);
              setErrorCount(errorCount + 1);
            } else {
              if (timer) clearInterval(timer);
              connectionCtx.setConnectionStatus(false);
              saveConnectionStatusDB(false);
              webSocketHandler.close();
            }
          }
        } else {
          console.log("checkDwarfConnection err ???", err.name, err.message);
        }
      });
    return timer;
  }

  function checkStellariumConnection(
    connectionCtx: ConnectionContextType,
    timer: any,
    loop: boolean
  ) {
    if (connectionCtx.IPStellarium === undefined) {
      console.log("Check Stellarium connection no IPStellarium!");
      return timer;
    }

    // if we can't connect to camera in 2 seconds, reset connection data
    let url = `http://${connectionCtx.IPStellarium}:${connectionCtx.portStellarium}`;
    fetch(url, {
      signal: AbortSignal.timeout(2000),
    })
      .then(() => {
        console.log("Stellarium connection ok.", loop ? " (loop)" : "");
        if (!connectionCtx.connectionStatusStellarium) {
          connectionCtx.setConnectionStatusStellarium(true);
          saveConnectionStatusStellariumDB(true);
        }
      })
      .catch((err) => {
        if (
          err.name === "AbortError" ||
          err.message === "Load failed" ||
          err.message === "Failed to fetch"
        ) {
          console.log("Stellarium connection error");
          if (timer) clearInterval(timer);

          connectionCtx.setConnectionStatusStellarium(false);
          saveConnectionStatusStellariumDB(false);
        } else {
          console.log(
            "checkStellariumConnection err >>>",
            err.name,
            err.message
          );
        }
      });
    return timer;
  }
}
