import { useContext, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import CmdHostLockDwarf from "@/components/setup/CmdHostLockDwarf";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { saveIPDwarfDB } from "@/db/db_utils";

import { connectionHandler } from "@/lib/connect_utils";

export default function ConnectDwarf() {
  let connectionCtx = useContext(ConnectionContext);

  const [connecting, setConnecting] = useState(false);
  const [slavemode, setSlavemode] = useState(false);
  const [goLive, setGoLive] = useState(false);
  const [errorTxt, setErrorTxt] = useState("");

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
      return <span className="text-warning-connect">Connecting...</span>;
    }
    if (connectionCtx.connectionStatus === undefined) {
      return <></>;
    }
    if (connectionCtx.connectionStatus === false) {
      return <span className="text-danger">Connection failed{errorTxt}.</span>;
    }
    if (connectionCtx.connectionStatusSlave || slavemode) {
      return (
        <span className="text-warning">
          Connection successful (Slave Mode) {goLiveMessage}
          {errorTxt}.
        </span>
      );
    }

    return (
      <span className="text-success-connect">
        Connection successfull. {goLiveMessage}
        {errorTxt}
      </span>
    );
  }

  const renderCmdHostLockDwarf = () => {
    // Your logic for rendering CmdHostLockDwarf
    // Example:
    return <CmdHostLockDwarf />;
  };

  return (
    <div>
      <h2>Connect to Dwarf II</h2>

      <p>
        In order for this site to connect to the Dwarf II, both the Dwarf II and
        the website must use the same wifi network.
      </p>

      <ol>
        <li className="mb-2">
          After rebooting, you must first connect to the DwarfII via Bluetooth.
        </li>
        <li className="mb-2">
          Then connect to it with the wifi connect button. Then no need to use
          the app to Calibrate, make Goto and Imaging Session from this website.
        </li>
        <li className="mb-2">
          Visit this site on a device that is connected to the same wifi network
          as the Dwarf II.
        </li>
        <li className="mb-2">
          Enter in IP for the Dwarf II. If you are using Dwarf wifi, the IP is
          192.168.88.1. If you are using STA mode, use the IP for your wifi
          network.
        </li>
        <li className="mb-2">
          Click Connect. This site will try to connect to Dwarf II.
        </li>
        <form onSubmit={checkConnection} className="mb-3">
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
                defaultValue={connectionCtx.IPDwarf}
                onChange={(e) => ipHandler(e)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-more02 me-3">
            <i className="icon-wifi" /> Connect
          </button>{" "}
          {renderConnectionStatus()}
          {renderCmdHostLockDwarf()}
        </form>
        <li className="mb-4">
          If you see the message: =&gt; Go Live, you have an Imaging Session
          completed, go to the Camera Page and Click on Live button.
        </li>
      </ol>
    </div>
  );
}
