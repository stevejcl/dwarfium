import { useContext } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { modeAuto, modeManual } from "dwarfii_api";
import ConnectDwarfII from "@/components/setup/ConnectDwarfII";
import {
  getExposureNameByIndex,
  getGainNameByIndex,
  getIRNameByIndex,
} from "@/lib/data_utils";
import {
  getWideExposureNameByIndex,
  getWideGainNameByIndex,
} from "@/lib/data_wide_utils";
import { telephotoCamera, wideangleCamera } from "@/lib/dwarf_utils";
import BatteryMeter from "@/components/BatteryMeter";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

export default function StatusBar() {
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);
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

  let astroWide: string | undefined = undefined;
  if (
    connectionCtx.currentAstroCamera !== undefined &&
    connectionCtx.currentAstroCamera == wideangleCamera
  ) {
    astroWide = "WIDE";
  }

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
      connectionCtx.astroSettings.exposure,
      connectionCtx.typeIdDwarf
    );

  let wideExposureValue: string | undefined = undefined;
  if (
    connectionCtx.astroSettings.wideExposureMode !== undefined &&
    connectionCtx.astroSettings.wideExposureMode == modeAuto
  )
    wideExposureValue = "Auto";
  else if (
    connectionCtx.astroSettings.wideExposureMode !== undefined &&
    connectionCtx.astroSettings.wideExposureMode == modeManual &&
    connectionCtx.astroSettings.wideExposure !== undefined
  )
    wideExposureValue = getWideExposureNameByIndex(
      connectionCtx.astroSettings.wideExposure,
      connectionCtx.typeIdDwarf
    );

  return (
    <div>
      <div className="row mb ">
        <div className="container-status-bar1">
          <div className="container-connection">
            <span className="con">
              {connectionCtx.typeNameDwarf}
              {connectionCtx.typeUidDwarf
                ? ` [${connectionCtx.typeUidDwarf}]`
                : ""}
              : {connection}
            </span>
            <span className="con">Stellarium: {connectionStellarium}</span>
          </div>
          <ConnectDwarfII />
          <div className="container-temp-batt">
            {connectionCtx.connectionStatus && (
              <div className="d-block d-md-none w-100">
                <br />
              </div>
            )}
            <div className="temperature-info">
              {connectionCtx.connectionStatus &&
                connectionCtx.statusTemperatureDwarf !== undefined && (
                  <span>
                    <i className="bi bi-thermometer"></i>
                    {connectionCtx.statusTemperatureDwarf}°C -{" "}
                    {connectionCtx.statusTemperatureDwarf / 5 + 32}°F
                  </span>
                )}
            </div>
            <div
              className={`container-battery 
                ${
                  connectionCtx.statusTemperatureDwarf === undefined &&
                  connectionCtx.typeUidDwarf === ""
                    ? "no_temp_uid"
                    : ""
                }
                ${
                  connectionCtx.typeUidDwarf === "" &&
                  !(connectionCtx.statusTemperatureDwarf === undefined)
                    ? "no_uid"
                    : ""
                }
                ${
                  connectionCtx.statusTemperatureDwarf === undefined &&
                  !(connectionCtx.typeUidDwarf === "")
                    ? "no_temp"
                    : ""
                }
              `}
            >
              {connectionCtx.connectionStatus &&
                connectionCtx.BatteryLevelDwarf !== undefined && (
                  <BatteryMeter
                    batteryLevel={connectionCtx.BatteryLevelDwarf ?? null}
                    isCharging={connectionCtx.BatteryStatusDwarf > 0}
                    isFastCharging={connectionCtx.BatteryStatusDwarf == 2}
                  />
                )}
            </div>
          </div>
        </div>

        <div className="col-12 align-center">
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
            {astroWide !== undefined && (
              <span className="me-3">
                <div className="hover-text">
                  <span className="tooltip-text" id="top">
                    Camera
                  </span>
                  {astroWide}
                </div>
              </span>
            )}
            {connectionCtx.currentAstroCamera == telephotoCamera &&
              connectionCtx.astroSettings.gain !== undefined && (
                <span className="me-3">
                  <div className="hover-text">
                    <i className="icon-bullseye" />
                    <span className="tooltip-text" id="top">
                      Gain
                    </span>
                    :{" "}
                    {getGainNameByIndex(
                      connectionCtx.astroSettings.gain,
                      connectionCtx.typeIdDwarf
                    )}
                  </div>
                </span>
              )}
            {connectionCtx.currentAstroCamera == telephotoCamera &&
              exposureValue !== undefined && (
                <span className="me-3">
                  <div className="hover-text">
                    <i className="icon-adjust" />
                    <span className="tooltip-text" id="top">
                      {t("cStatusBarExposure")}
                    </span>
                    : {exposureValue}
                  </div>
                </span>
              )}
            {connectionCtx.currentAstroCamera == wideangleCamera &&
              connectionCtx.astroSettings.wideGain !== undefined && (
                <span className="me-3">
                  <div className="hover-text">
                    <i className="icon-bullseye" />
                    <span className="tooltip-text" id="top">
                      Gain
                    </span>
                    :{" "}
                    {getWideGainNameByIndex(
                      connectionCtx.astroSettings.wideGain,
                      connectionCtx.typeIdDwarf
                    )}
                  </div>
                </span>
              )}
            {connectionCtx.currentAstroCamera == wideangleCamera &&
              wideExposureValue !== undefined && (
                <span className="me-3">
                  <div className="hover-text">
                    <i className="icon-adjust" />
                    <span className="tooltip-text" id="top">
                      {t("cStatusBarExposure")}
                    </span>
                    : {wideExposureValue}
                  </div>
                </span>
              )}
            {connectionCtx.currentAstroCamera == telephotoCamera &&
              connectionCtx.astroSettings.IR !== undefined && (
                <span className="me-3">
                  <div className="hover-text">
                    <i className="icon-filter" />
                    <span className="tooltip-text" id="top">
                      {t("cStatusBarIRFilter")}
                    </span>
                    :{" "}
                    {getIRNameByIndex(
                      connectionCtx.astroSettings.IR,
                      connectionCtx.typeIdDwarf
                    )}
                  </div>
                </span>
              )}
            {connectionCtx.currentAstroCamera == telephotoCamera &&
              connectionCtx.astroSettings.binning !== undefined && (
                <span className="me-3">
                  <div className="hover-text">
                    <i className="icon-picture" />
                    <span className="tooltip-text" id="top">
                      {t("cStatusBarBinning")}
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
                    {t("cStatusBarCounter")}
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
                    {t("cStatusBarQuality")}
                  </span>{" "}
                  : {connectionCtx.astroSettings.quality}
                </div>
              </span>
            )}
            {connectionCtx.astroSettings.AiEnhance == 1 && (
              <span className="me-3">
                <div className="hover-text">AI</div>
              </span>
            )}
            {Object.keys(connectionCtx.imagingSession).length > 0 &&
              (connectionCtx.imagingSession.isRecording ||
                connectionCtx.imagingSession.endRecording ||
                connectionCtx.imagingSession.isGoLive) && (
                <>
                  <span className="me-3">
                    {t("cStatusBarTaken")}{" "}
                    {connectionCtx.imagingSession.imagesTaken}
                  </span>
                  <span className="me-3">
                    {t("cStatusBarStacked")}{" "}
                    {connectionCtx.imagingSession.imagesStacked}
                  </span>
                  <span className="me-3">
                    {t("cStatusBarTime")}{" "}
                    {connectionCtx.imagingSession.sessionElaspsedTime}
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
              {t("cStatusBarCurTarget")} {connectionCtx.astroSettings.target}{" "}
              {goto_progress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
