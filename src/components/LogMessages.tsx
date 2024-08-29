import { useContext, useEffect, useState } from "react";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";
import { deleteLogMessagesDb, saveLoggerStatusDb } from "@/db/db_utils";
import DebugMessageItem from "./LogMessageItem";

export default function DebugMessages() {
  useLoadIntialValues();
  let connectionCtx = useContext(ConnectionContext);
  let [messages, setMessages] = useState(connectionCtx.logger);

  // React context cannot update state between different browser tabs.
  // Use local storage events instead of React context to show new messages
  // whenever messages are added to local storage.
  // https://dev.to/cassiolacerda/how-to-syncing-react-state-across-multiple-tabs-with-usestate-hook-4bdm
  useEffect(() => {
    const onStorageUpdate = (e: any) => {
      const { key, newValue } = e;
      if (key === "logMessages") {
        setMessages(JSON.parse(newValue));
      }
    };

    window.addEventListener("storage", onStorageUpdate);
    return () => {
      window.removeEventListener("storage", onStorageUpdate);
    };
  }, []);

  function deleteHandler() {
    connectionCtx.setLogger(undefined);
    deleteLogMessagesDb();
    setMessages(undefined);
  }

  function toggleLogger() {
    if (connectionCtx.loggerStatus) {
      saveLoggerStatusDb("false");
    } else {
      saveLoggerStatusDb("true");
    }

    connectionCtx.setLoggerStatus((prev) => !prev);
  }

  let displayMessages = messages?.length ? messages : connectionCtx.logger;

  return (
    <div>
      <h1>Message Log</h1>
      <p>
        If turn on the logger, this app will save and display all the messages
        sent between this app and Dwarf device. The messages are ordered from
        oldest to newest.
      </p>
      <div className="mb-3">
        Log status: {connectionCtx.loggerStatus ? "on" : "off"}
        {connectionCtx.loggerStatus && (
          <span>, {displayMessages?.length || 0} messages</span>
        )}
      </div>
      {!connectionCtx.loggerStatus && (
        <button className="btn btn-primary" onClick={toggleLogger}>
          Turn on logger
        </button>
      )}
      {connectionCtx.loggerStatus && (
        <>
          <button className="btn btn-primary me-3" onClick={toggleLogger}>
            Turn off logger
          </button>
          <button className="btn btn-primary" onClick={deleteHandler}>
            Delete all messages
          </button>
        </>
      )}
      {connectionCtx.loggerStatus &&
        displayMessages &&
        displayMessages.map((m, i) => <DebugMessageItem key={i} message={m} />)}
    </div>
  );
}
