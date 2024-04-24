import { useContext, useState } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { connectionHandler } from "@/lib/connect_utils";

function sleep(ms) {
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

        setConnecting(true);
        setErrorTxt("");

        connectionHandler(
            connectionCtx,
            connectionCtx.IPDwarf,
            false,
            setConnecting,
            setSlavemode,
            setGoLive,
            setErrorTxt
        );
    }

    function renderConnectionStatus() {
        let goLiveMessage = "";
        if (goLive) {
            goLiveMessage = "=> Go Live";
        }
        if (connecting) {
            return (
                <span className="text-warning-connect">Connecting...</span>
            );
        }
        if (connectionCtx.connectionStatus === undefined) {
            return null;
        }
        if (connectionCtx.connectionStatus === false) {
            return (
                <span className="text-danger-connect">Connection failed {errorTxt}.</span>
            );
        }
        if (connectionCtx.connectionStatusSlave || slavemode) {
            return (
                <span className="text-warning-connect">Connection successful (Slave Mode) {goLiveMessage} {errorTxt}.</span>
            );
        }

        return (
            <span className="text-success-connect">Connection successful. {goLiveMessage} {errorTxt}</span>
        );
    }

    return (
        <div className="connect-dwarf">
            {renderConnectionStatus()}{" "}
            <button className="btn btn-more02" onClick={checkConnection}>
                Connect
            </button>
        </div>
    );
}
