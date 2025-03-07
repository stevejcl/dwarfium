import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";

import StatusBar from "@/components/shared/StatusBar";
import DwarfCameras from "@/components/DwarfCameras";
import ImagingMenu from "@/components/imaging/ImagingMenu";
import OBSWebSocket from "obs-websocket-js";
export default function AstroPhoto() {
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

  let connectionCtx = useContext(ConnectionContext);
  useSetupConnection();
  useLoadIntialValues();

  const [exchangeCamerasStatus, setExchangeCamerasStatus] = useState(false);
  const [showWideangle, setShowWideangle] = useState(false);
  const [useRawPreviewURL, setUseRawPreviewURL] = useState(false);

  let notConnected =
    connectionCtx.connectionStatus === undefined ||
    connectionCtx.connectionStatus === false;
  let noCoordinates =
    connectionCtx.latitude === undefined ||
    connectionCtx.longitude === undefined;
  let hasErrors = notConnected || noCoordinates;
  const [obs, setObs] = useState<OBSWebSocket | null>(null);
  const [obsError, setObsError] = useState<string | null>(null);
  const [isObsConnected, setIsObsConnected] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  useEffect(() => {
    const obsInstance = new OBSWebSocket();
    setObs(obsInstance);

    const checkConnection = async () => {
      try {
        await obsInstance.connect("ws://localhost:4455", "ZesqL9dGu2Uv3XlE");
        setIsObsConnected(true);
        setObsError(null);
        console.log("Verbonden met OBS WebSocket!");
      } catch (error: any) {
        console.warn("OBS WebSocket niet beschikbaar:", error.message);
        setIsObsConnected(false);
        setObsError(
          "OBS WebSocket niet gevonden. Start OBS en controleer WebSocket-instellingen."
        );
      }
    };

    checkConnection(); // Probeer te verbinden

    obsInstance.on("ConnectionClosed", () => {
      setIsObsConnected(false);
      setObsError("OBS WebSocket is gesloten.");
    });

    return () => {
      obsInstance.disconnect().catch(() => {}); // Voorkom fouten bij disconnect
    };
  }, []);

  const toggleStreaming = async () => {
    if (!obs) {
      setObsError("OBS WebSocket is niet verbonden.");
      return;
    }

    try {
      // Controleer eerst of OBS verbonden is
      const status = await obs.call("GetStreamStatus");

      if (!isStreaming && !status.outputActive) {
        // Start de stream
        await obs.call("StartStream");
        console.log("Stream gestart!");
        setIsStreaming(true);
      } else if (isStreaming && status.outputActive) {
        // Stop de stream
        await obs.call("StopStream");
        console.log("Stream gestopt!");
        setIsStreaming(false);
      } else {
        console.warn("Geen actie nodig, streamstatus is al correct.");
      }
    } catch (error: any) {
      console.error("Fout bij streamen:", error);
      setObsError(
        "Fout bij starten of stoppen van de stream. Controleer de console."
      );
    }
  };

  if (hasErrors) {
    return (
      <>
        {" "}
        <section className="d-inline-block w-100">
          <div className="container">
            <br />
            <br />
            <br />
            <br />
            <Head>
              <title>{t("cCameraTitle")}</title>
            </Head>
            <StatusBar />
            <hr />
            <h1>{t("cCameraTitle")}</h1>

            {notConnected && (
              <p className="text-danger">
                {t("cCameraConnection", {
                  DwarfType: connectionCtx.typeNameDwarf,
                })}
              </p>
            )}

            {noCoordinates && (
              <p className="text-danger">{t("cCameraLocation")}</p>
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {" "}
      <section className="d-inline-block w-100">
        <div className="container">
          <br />
          <br />
          <br />
          <br />
          <Head>
            <title>{t("cCameraTitle")}</title>
          </Head>
          <StatusBar />
          <hr></hr>
          <div className="container">
            <div className="row px-0">
              <div className="live-stream-container">
                <button
                  onClick={toggleStreaming}
                  disabled={!isObsConnected}
                  className={isStreaming ? "stop-button" : "start-button"}
                >
                  {isStreaming ? "Stop Stream" : "Start Stream"}
                </button>
              </div>
              {obsError && <p className="text-danger">{obsError}</p>}

              <main className="col">
                <DwarfCameras
                  setExchangeCamerasStatus={setExchangeCamerasStatus}
                  showWideangle={showWideangle}
                  useRawPreviewURL={useRawPreviewURL}
                  showControls={true}
                />

                <br />
                <br />
                <br />
                <br />
              </main>

              <div className="dropdown-wrapper px-0">
                <br />
                <br />
                <ImagingMenu
                  exchangeCamerasStatus={exchangeCamerasStatus}
                  setShowWideangle={setShowWideangle}
                  setUseRawPreviewURL={setUseRawPreviewURL}
                />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
