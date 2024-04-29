import { useState, useContext } from "react";

import GotoStellarium from "@/components/GotoStellarium";
import GotoLists from "@/components/GotoLists";
import GotoUserLists from "@/components/GotoUserLists";
import StatusBar from "@/components/shared/StatusBar";
import CalibrationDwarf from "@/components/shared/CalibrationDwarf";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";
import { ConnectionContext } from "@/stores/ConnectionContext";

import ResizablePIP from "@/components/ResizablePIP";
import DwarfCameras from "@/components/DwarfCameras";

export default function Goto() {
  const [gotoType, setGotoType] = useState("lists");
  useSetupConnection();
  useLoadIntialValues();
  let connectionCtx = useContext(ConnectionContext);

  return (
    <section className="daily-horp d-inline-block w-100">
      <div className="container">
        <br />
        <br />
        <br />
              <br />
              <br />
        <StatusBar />
        <hr></hr>
        <CalibrationDwarf />
        <hr />
        <ul className=" nav nav-tabs mb-2">
          <li
            className={`nav-item nav-link ${
              gotoType === "lists" ? "active" : ""
            }`}
            onClick={() => setGotoType("lists")}
          >
            Lists
          </li>
          <li
            className={`nav-item nav-link ${
              gotoType === "userLists" ? "active" : ""
            }`}
            onClick={() => setGotoType("userLists")}
          >
            Custom Lists
          </li>
          <li
            className={`nav-item nav-link ${
              gotoType === "stellarium" ? "active" : ""
            }`}
            onClick={() => setGotoType("stellarium")}
          >
            Stellarium
          </li>
        </ul>
        <hr />
        {connectionCtx.connectionStatus && connectionCtx.PiPView && (
          <div className="float-right-align">
            <ResizablePIP
              width={320}
              height={180}
              minConstraints={[320, 180]}
              maxConstraints={[1280, 720]}
            >
              <DwarfCameras
                showWideangle={false}
                useRawPreviewURL={false}
                showControls={false}
              />
            </ResizablePIP>
          </div>
        )}
        {gotoType === "lists" && <GotoLists />}
        {gotoType === "stellarium" && <GotoStellarium />}
        {gotoType === "userLists" && <GotoUserLists />}
        <br />
        <br />
        <br />
        <br />
      </div>
    </section>
  );
}
