/* eslint react/no-unescaped-entities: 0 */

import { useContext, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  saveConnectionStatusStellariumDB,
  saveIPStellariumDB,
  savePortStellariumDB,
  saveUrlStellariumDB,
} from "@/db/db_utils";

export default function ConnectStellarium() {
  let connectionCtx = useContext(ConnectionContext);

  const [connecting, setConnecting] = useState(false);

  function checkConnection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formIP = formData.get("ip");
    const formPort = formData.get("port");

    if (formIP && formPort) {
      setConnecting(true);
      let url = `http://${formIP}:${formPort}`;

      connectionCtx.setIPStellarium(formIP.toString());
      connectionCtx.setPortStellarium(Number(formPort));
      connectionCtx.setUrlStellarium(url);

      saveIPStellariumDB(formIP.toString());
      savePortStellariumDB(Number(formPort));
      saveUrlStellariumDB(url);

      fetch(url, { signal: AbortSignal.timeout(2000) })
        .then(() => {
          setConnecting(false);
          connectionCtx.setConnectionStatusStellarium(true);
          saveConnectionStatusStellariumDB(true);
        })
        .catch((err) => {
          console.log("Stellarium connection error:", err);
          setConnecting(false);
          connectionCtx.setConnectionStatusStellarium(false);
          saveConnectionStatusStellariumDB(false);
        });
    }
  }

  function renderConnectionStatus() {
    if (connecting) {
      return <span>Connecting...</span>;
    }
    if (connectionCtx.connectionStatusStellarium === undefined) {
      return <></>;
    }
    if (connectionCtx.connectionStatusStellarium === false) {
      return <span className="text-danger-connect">Connection failed.</span>;
    }

    return <span className="text-success-connect">Connection successful.</span>;
  }

  return (
    <div>
      <h2>Connect to Stellarium</h2>
      <p>
        In order to use Stellarium, we need to setup up the Remote Control
        plugin.
      </p>

      <ol>
        <li className="mb-2">Start Stellarium desktop app.</li>
        <li className="mb-2">
          The beginning of this{" "}
          <Link href="https://www.youtube.com/watch?v=v2gROUlPRhw">
            Youtube video
          </Link>{" "}
          demonstrates setting up Stellarium's Remote Control plugin (0 to
          1:40); skip the part about NINA. Click "Enable CORS for the following
          origin" and enter in "*".
        </li>
        <li className="mb-2">
          Enter in IP and port for the Remote Control plugin, and click
          "Connect". This site will try to connect to Stellarium.
        </li>
      </ol>

      <form onSubmit={checkConnection}>
        <div className="row mb-3">
          <div className="col-md-1">
            <label htmlFor="ip" className="form-label">
              IP
            </label>
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              id="ip"
              name="ip"
              placeholder="127.00.00.00"
              required
              defaultValue={connectionCtx.IPStellarium}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-1">
            <label htmlFor="port" className="form-label">
              Port
            </label>
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              id="port"
              name="port"
              placeholder="8000"
              required
              defaultValue={connectionCtx.portStellarium}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-more02 me-3">
          <i className=" icon-connectdevelop" /> Connect
        </button>{" "}
        {renderConnectionStatus()}
      </form>
    </div>
  );
}
