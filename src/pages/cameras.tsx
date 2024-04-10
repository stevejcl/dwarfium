import { useContext, useState } from "react";
import Head from "next/head";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";

import StatusBar from "@/components/shared/StatusBar";
import DwarfCameras from "@/components/DwarfCameras";
import ImagingMenu from "@/components/imaging/ImagingMenu";

export default function AstroPhoto() {
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
              <title>Astro Photos</title>
            </Head>
            <StatusBar />
            <hr></hr>
            <h1>Astro Photos</h1>

            {notConnected && (
              <p className="text-danger">You must connect to Dwarf II.</p>
            )}

            {noCoordinates && (
              <p className="text-danger">You must set your location.</p>
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
            <title>Astro Photos</title>
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
