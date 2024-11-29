import { useContext, useEffect, useRef } from "react";

import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  saveConnectionStatusDB,
  saveInitialConnectionTimeDB,
  saveConnectionStatusStellariumDB,
  fetchInitialConnectionTimeDB,
  saveIPConnectDB,
  fetchIPConnectDB,
  saveIPCheckTimerDB,
  fetchIPCheckTimerDB,
  saveLastCheckTimerDB,
  fetchLastCheckTimerDB,
} from "@/db/db_utils";
import { firmwareVersion, WebSocketHandler } from "dwarfii_api";
import { ConnectionContextType } from "@/types";

export function useSetupConnection() {
  let connectionCtx = useContext(ConnectionContext);
  let errorCount = useRef(0);
  let errorCountStellarium = useRef(0);
  console.debug("Start Dwarf useSetupConnection", connectionCtx.IPDwarf);

  let errorCountMax = 5;

  useEffect(() => {
    let timerDwarf: any = undefined;
    let timerStellarium: any = undefined;
    let IPConnectDB = fetchIPConnectDB();
    console.debug("Start Dwarf useSetupConnection IPConnectDB:", IPConnectDB);

    if (connectionCtx.connectionStatus && IPConnectDB) {
      // check if other timers have been started or not (
      let initialConnectionTime = fetchInitialConnectionTimeDB();
      let IPCheckTimer = fetchIPCheckTimerDB();
      let LastCheckTimer = fetchLastCheckTimerDB();

      console.debug(
        "Start Dwarf useSetupConnection initialConnectionTime:",
        initialConnectionTime
      );
      console.debug(
        "Start Dwarf useSetupConnection IPCheckTimer:",
        IPCheckTimer
      );
      console.debug(
        "Start Dwarf useSetupConnection LastCheckTimer:",
        LastCheckTimer
      );

      if (
        IPCheckTimer === undefined ||
        !IPCheckTimer ||
        IPConnectDB != IPCheckTimer ||
        LastCheckTimer === undefined ||
        (initialConnectionTime &&
          LastCheckTimer &&
          (LastCheckTimer > initialConnectionTime + 100 * 1000 ||
            LastCheckTimer < initialConnectionTime))
      ) {
        // No Other Time has been started, New IP, The lastcheck is too old
        console.debug("Start Dwarf useSetupConnection  : start timer");
        saveIPCheckTimerDB(IPConnectDB);
        saveLastCheckTimerDB();

        timerDwarf = checkDwarfConnection(connectionCtx, timerDwarf, false);

        // continously check connection status
        if (timerDwarf === undefined) {
          console.debug("Start Dwarf connection timer");
          timerDwarf = setInterval(() => {
            checkDwarfConnection(connectionCtx, timerDwarf, true);
          }, 90 * 1000);
        }
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
    // Check if connection has not been force stopped
    let IPConnectDB = fetchIPConnectDB();

    if (IPConnectDB === undefined || !IPConnectDB) {
      console.log("Check Dwarf connection no IPConnectDB!");
      saveIPCheckTimerDB("");
      if (timer) clearInterval(timer);
      return undefined;
    }
    if (connectionCtx.IPDwarf === undefined) {
      console.log("Check Dwarf connection no IPDwarf!");
      saveIPCheckTimerDB("");
      if (timer) clearInterval(timer);
      return undefined;
    }
    if (connectionCtx.IPDwarf != IPConnectDB) {
      console.log("Check Dwarf connection change IP!");
      saveIPCheckTimerDB("");
      if (timer) clearInterval(timer);
      return undefined;
    }

    console.debug("Check Dwarf connection timer", connectionCtx.IPDwarf);
    // if we can't connect to camera in 2 seconds, reset connection data
    const url = firmwareVersion(connectionCtx.IPDwarf);
    const proxyUrl = `${
      process.env.NEXT_PUBLIC_URL_PROXY_CORS
    }?target=${encodeURIComponent(url)}`;
    fetch(proxyUrl, {
      signal: AbortSignal.timeout(5000),
      mode: "no-cors",
      method: "POST",
    })
      .then(() => {
        console.log("Dwarf connection ok.", loop ? " (loop)" : "");
        errorCount.current = 0;
        if (!connectionCtx.connectionStatus) {
          connectionCtx.setConnectionStatus(true);
          saveConnectionStatusDB(true);
          saveInitialConnectionTimeDB();
          saveIPCheckTimerDB(IPConnectDB);
          saveLastCheckTimerDB();
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
            errorCount.current = 0;
            saveIPCheckTimerDB(IPConnectDB);
            saveLastCheckTimerDB();
            connectionCtx.setConnectionStatus(true);
            console.log("Dwarf connection ok");
          } else {
            console.log("Dwarf connection error");
            // let more time for autoconnect function!
            if (errorCount.current < errorCountMax) {
              // retry later
              console.log("Dwarf connection error count:", errorCount.current);
              errorCount.current += 1;
            } else {
              if (timer) clearInterval(timer);
              connectionCtx.setConnectionStatus(false);
              saveConnectionStatusDB(false);
              webSocketHandler.close();
              saveIPConnectDB("");
              saveIPCheckTimerDB("");
            }
          }
        } else {
          console.log("checkDwarfConnection err ???", err.name, err.message);
          console.log("Dwarf verification connection");

          console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
          const webSocketHandler = connectionCtx.socketIPDwarf
            ? connectionCtx.socketIPDwarf
            : new WebSocketHandler(connectionCtx.IPDwarf);

          if (webSocketHandler.isConnected()) {
            errorCount.current = 0;
            saveIPCheckTimerDB(IPConnectDB);
            saveLastCheckTimerDB();
            connectionCtx.setConnectionStatus(true);
            console.log("Dwarf connection ok");
          } else {
            console.log("Dwarf connection error");
            // let more time for autoconnect function!
            if (errorCount.current < errorCountMax) {
              // retry later
              console.log("Dwarf connection error count:", errorCount);
              errorCount.current += 1;
            } else {
              if (timer) clearInterval(timer);
              connectionCtx.setConnectionStatus(false);
              saveConnectionStatusDB(false);
              webSocketHandler.close();
              saveIPConnectDB("");
              saveIPCheckTimerDB("");
            }
          }
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
          errorCountStellarium.current = 0;
        }
      })
      .catch((err) => {
        if (
          err.name === "AbortError" ||
          err.message === "Load failed" ||
          err.message === "Failed to fetch"
        ) {
          console.log("Stellarium connection error");
          // let more time for autoconnect function!
          if (errorCountStellarium.current < errorCountMax) {
            // retry later
            console.log(
              "Stellarium connection error count:",
              errorCount.current
            );
            errorCount.current += 1;
          } else {
            if (timer) clearInterval(timer);
            connectionCtx.setConnectionStatusStellarium(false);
            saveConnectionStatusStellariumDB(false);
          }
        } else {
          console.log(
            "checkStellariumConnection err >>>",
            err.name,
            err.message
          );
          // let more time for autoconnect function!
          if (errorCountStellarium.current < errorCountMax) {
            // retry later
            console.log(
              "Stellarium connection error count:",
              errorCount.current
            );
            errorCount.current += 1;
          } else {
            if (timer) clearInterval(timer);

            connectionCtx.setConnectionStatusStellarium(false);
            saveConnectionStatusStellariumDB(false);
          }
        }
      });
    return timer;
  }
}
