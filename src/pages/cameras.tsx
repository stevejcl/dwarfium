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

  useSetupConnection();
  useLoadIntialValues();
  let connectionCtx = useContext(ConnectionContext);

  const [showWideangle, setShowWideangle] = useState(false);
  const [useRawPreviewURL, setUseRawPreviewURL] = useState(false);

  let notConnected =
    connectionCtx.connectionStatus === undefined ||
    connectionCtx.connectionStatus === false;
  let noCoordinates =
    connectionCtx.latitude === undefined ||
    connectionCtx.longitude === undefined;
  let hasErrors = notConnected || noCoordinates;

  if (hasErrors) {
    return (
      <>
        {" "}
        <section className="daily-horp d-inline-block w-100">
          <div className="container">
            {""}
            <br />
            <br />
            <br />
            <br />
            <Head>
              <title>{t("cCameraTitle")}</title>
            </Head>
            <StatusBar />
            <hr></hr>
            <h1>{t("cCameraTitle")}</h1>

            {notConnected && (
              <p className="text-danger">{t("cCameraConnection")}</p>
            )}

            {noCoordinates && (
              <p className="text-danger">{t("cCameraLocation")}</p>
            )}
          </div>
          {""}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </section>
      </>
    );
  }

  return (
    <>
      {" "}
      <section className="daily-horp-userlist d-inline-block w-100">
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
              <main className="col">
                <DwarfCameras
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
      <style jsx>{`
        select {
          margin-right: 10px;
          width: 200px; /* Set width to match dropdown */
        }
        .dropdown-wrapper {
          width: auto; /* Set width to match dropdown */
        }
      `}</style>
    </>
  );
}
