import ConnectDwarfSTA from "@/components/setup/ConnectDwarfSTA";
import ConnectDwarf from "@/components/setup/ConnectDwarf";
import ConnectStellarium from "@/components/setup/ConnectStellarium";
import SetLocation from "@/components/setup/SetLocation";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import StatusBar from "@/components/shared/StatusBar";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";

export default function SetupScope() {
  useSetupConnection();
  useLoadIntialValues();

  return (
    <div>
      <StatusBar />
      <h2>First Steps</h2>
      <p>
        Use the Dwarf II mobile app from Dwarf Labs to take dark frames, focus
        the scope, and calibrate goto.
      </p>
      <hr></hr>
      <SetLocation />
      <hr />
      <ConnectDwarfSTA />
      <hr />
      <ConnectDwarf />
      <hr />
      <ConnectStellarium />
    </div>
  );
}
