import { useState } from "react";

import GotoStellarium from "@/components/GotoStellarium";
import GotoLists from "@/components/GotoLists";
import GotoUserLists from "@/components/GotoUserLists";
import StatusBar from "@/components/shared/StatusBar";
import CalibrationDwarf from "@/components/shared/CalibrationDwarf";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";

export default function Goto() {
  const [gotoType, setGotoType] = useState("lists");
  useSetupConnection();
  useLoadIntialValues();

  return (
    <div>
      <StatusBar />
      <hr></hr>
      <CalibrationDwarf />
      <hr />
      <ul className="nav nav-tabs mb-2">
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
      {gotoType === "lists" && <GotoLists />}
      {gotoType === "stellarium" && <GotoStellarium />}
      {gotoType === "userLists" && <GotoUserLists />}
    </div>
  );
}
