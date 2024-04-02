import { useContext } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { IRCut, modeAuto, modeManual } from "dwarfii_api";
import ConnectDwarfII from "@/components/setup/ConnectDwarfII";
import { getExposureNameByIndex, getGainNameByIndex } from "@/lib/data_utils";
import BatteryMeter from "@/components/BatteryMeter";
import { useSetupConnection } from "@/hooks/useSetupConnection";

export default function StatusBar() {
  useSetupConnection();
  let connectionCtx = useContext(ConnectionContext);

  let connection =
    connectionCtx.connectionStatus && !connectionCtx.connectionStatusSlave ? (
      <i className="bi bi-check-circle" style={{ color: "green" }}></i>
    ) : connectionCtx.connectionStatus &&
      connectionCtx.connectionStatusSlave ? (
      <i className="bi bi-check-circle" style={{ color: "orange" }}></i>
    ) : (
      <i className="bi bi-x-circle" style={{ color: "red" }}></i>
    );

  let connectionStellarium = connectionCtx.connectionStatusStellarium ? (
    <i className="bi bi-check-circle" style={{ color: "green" }}></i>
  ) : (
    <i className="bi bi-x-circle" style={{ color: "red" }}></i>
  );

  let goto_progress =
    connectionCtx.astroSettings.status === undefined ? (
      <i></i>
    ) : connectionCtx.astroSettings.status == 1 ? (
      <i className="bi bi-check-circle" style={{ color: "green" }}></i>
    ) : connectionCtx.astroSettings.status == 0 ? (
      <i className="bi bi-check-circle" style={{ color: "orange" }}></i>
    ) : (
      <i className="bi bi-x-circle" style={{ color: "red" }}></i>
    );

  let exposureValue: string | undefined = undefined;
  if (
    connectionCtx.astroSettings.exposureMode !== undefined &&
    connectionCtx.astroSettings.exposureMode == modeAuto
  )
    exposureValue = "Auto";
  else if (
    connectionCtx.astroSettings.exposureMode !== undefined &&
    connectionCtx.astroSettings.exposureMode == modeManual &&
    connectionCtx.astroSettings.exposure !== undefined
  )
    exposureValue = getExposureNameByIndex(
      connectionCtx.astroSettings.exposure
    );

  return (
    <div>
      <div className="row mb ">
        <div className="col-sm align-center">
          <div className="container-connection">
            <span className="con">Dwarf II: {connection}</span>
            <span className="con">Stellarium: {connectionStellarium}</span>
          </div>
          <div className="container-battery">
            {connectionCtx.connectionStatus &&
              connectionCtx.BatteryLevelDwarf !== undefined && (
                <BatteryMeter
                  batteryLevel={connectionCtx.BatteryLevelDwarf ?? null}
                  isCharging={connectionCtx.BatteryStatusDwarf > 0}
                  isFastCharging={connectionCtx.BatteryStatusDwarf == 2}
                />
              )}
          </div>
          <ConnectDwarfII />

          <div className="container-status">
            {connectionCtx.connectionStatus &&
              connectionCtx.availableSizeDwarf !== undefined &&
              connectionCtx.totalSizeDwarf !== undefined && (
                <span className="me-3">
                  <div className="hover-text">
                    <i className="icon-micro-sd" />
                    <span className="tooltip-text" id="top">
                      Sd-Card
                    </span>
                    :{" "}
                    {connectionCtx.availableSizeDwarf.toString() +
                      "/" +
                      connectionCtx.totalSizeDwarf.toString() +
                      "GB - " +
                      (
                        (connectionCtx.availableSizeDwarf /
                          connectionCtx.totalSizeDwarf) *
                        100
                      ).toFixed(2)}
                    %
                  </div>
                </span>
              )}
            {connectionCtx.astroSettings.gain !== undefined && (
              <span className="me-3">
                <div className="hover-text">
                  <i className="icon-bullseye" />
                  <span className="tooltip-text" id="top">
                    Gain
                  </span>
                  : {getGainNameByIndex(connectionCtx.astroSettings.gain)}
                </div>
              </span>
            )}
            {exposureValue !== undefined && (
              <span className="me-3">
                <div className="hover-text">
                  <i className="icon-adjust" />
                  <span className="tooltip-text" id="top">
                    Exposure
                  </span>
                  : {exposureValue}
                </div>
              </span>
            )}
            {connectionCtx.astroSettings.IR !== undefined && (
              <span className="me-3">
                <div className="hover-text">
                  <i className="icon-filter" />
                  <span className="tooltip-text" id="top">
                    IR-Filter
                  </span>
                  : {connectionCtx.astroSettings.IR === IRCut ? "Cut" : "Pass"}
                </div>
              </span>
            )}
            {connectionCtx.astroSettings.binning !== undefined && (
              <span className="me-3">
                <div className="hover-text">
                  <i className="icon-picture" />
                  <span className="tooltip-text" id="top">
                    Binning
                  </span>
                  : {connectionCtx.astroSettings.binning == 0 ? "1x1" : "2x2"}
                </div>
              </span>
            )}
            {connectionCtx.astroSettings.count !== undefined && (
              <span className="me-3">
                <div className="hover-text">
                  <i className="icon-counter-4" />
                  <span className="tooltip-text" id="top">
                    Counter
                  </span>
                  : {connectionCtx.astroSettings.count}
                </div>
              </span>
            )}
            {connectionCtx.astroSettings.quality !== undefined && (
              <span className="me-3">
                <div className="hover-text">
                  <i className="icon-star-empty" />
                  <span className="tooltip-text" id="top">
                    Quality
                  </span>{" "}
                  : {connectionCtx.astroSettings.quality}
                </div>
              </span>
            )}
            {Object.keys(connectionCtx.imagingSession).length > 0 &&
              (connectionCtx.imagingSession.isRecording ||
                connectionCtx.imagingSession.endRecording ||
                connectionCtx.imagingSession.isGoLive) && (
                <>
                  <span className="me-3">
                    Taken: {connectionCtx.imagingSession.imagesTaken}
                  </span>
                  <span className="me-3">
                    Stacked: {connectionCtx.imagingSession.imagesStacked}
                  </span>
                  <span className="me-3">
                    Time: {connectionCtx.imagingSession.sessionElaspsedTime}
                  </span>
                </>
              )}
          </div>
        </div>
      </div>
      <div className="row mb">
        <div className="col-sm align-self-center">
          {connectionCtx.astroSettings.target !== undefined && (
            <span className="me-3">
              Current Target: {connectionCtx.astroSettings.target}{" "}
              {goto_progress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
