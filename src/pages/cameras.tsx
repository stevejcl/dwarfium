import { useContext, useState, useEffect } from "react";
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

  const [showWideangle, setShowWideangle] = useState(true);
  const [useRawPreviewURL, setUseRawPreviewURL] = useState(false);
  const [notification, setNotification] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [getSessionDataDisabled, setGetSessionDataDisabled] = useState(true);
  const [progress, setProgress] = useState(0);

  let notConnected =
    connectionCtx.connectionStatus === undefined ||
    connectionCtx.connectionStatus === false;
  let noCoordinates =
    connectionCtx.latitude === undefined ||
    connectionCtx.longitude === undefined;
  let hasErrors = notConnected || noCoordinates;

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch(
          `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/`
        );
        const data = await response.text();
        const folderRegex =
          /href="([^"]*?)\/"[^>]*?>([^<]+)<\/a>\s+(\d{2}-[a-zA-Z]{3}-\d{4} \d{2}:\d{2})/g;
        let matches;
        let sessionList = [];
        while ((matches = folderRegex.exec(data)) !== null) {
          sessionList.push({ name: matches[1], date: matches[3] });
        }
        setSessions(sessionList);
      } catch (error) {
        console.error(
          "An error occurred while fetching sessions:",
          error.message
        );
        setSessions([]);
      }
    }
    fetchSessions();
  }, [connectionCtx.IPDwarf]);

  const getSessionData = async () => {
    if (!selectedSession) {
      console.error("No session selected.");
      return;
    }

    try {
      const selectedFolder = await window.showDirectoryPicker();
      const sessionFolderHandle = await selectedFolder.getDirectoryHandle(
        selectedSession,
        { create: true }
      ); // Create folder with session name
      const folderResponse = await fetch(
        `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${selectedSession}`
      );
      const folderData = await folderResponse.text();
      const fitsFiles = folderData
        .match(/href="([^"]*\.fits)"/g)
        .map((match) => match.substring(6, match.length - 1));
      const totalFiles = fitsFiles.length;
      let downloadedFiles = 0;

      for (const fitsFile of fitsFiles) {
        const fileResponse = await fetch(
          `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${selectedSession}/${fitsFile}`
        );
        const fileBlob = await fileResponse.blob();
        const fileHandle = await sessionFolderHandle.getFileHandle(fitsFile, {
          create: true,
        }); // Save file in session folder
        const writable = await fileHandle.createWritable();
        await writable.write(fileBlob);
        await writable.close();
        downloadedFiles++;
        setProgress(Math.floor((downloadedFiles / totalFiles) * 100)); // Round down to the nearest integer
      }
      console.log("Files downloaded successfully.");
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("User aborted the operation.");
      } else {
        console.error("An error occurred:", error.message);
      }
    }
  };

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
    setGetSessionDataDisabled(false);
    setProgress(0); // Reset progress when selecting a new session
  };

  if (hasErrors) {
    return (
      <>
        <Head>
          <title>Astro Photos</title>
        </Head>
        <StatusBar />

        <h1>Astro Photos</h1>

        {notConnected && (
          <p className="text-danger">You must connect to Dwarf II.</p>
        )}

        {noCoordinates && (
          <p className="text-danger">You must set your location.</p>
        )}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Astro Photos</title>
      </Head>
      <StatusBar />
      <div className="container">
        <div className="row px-0">
          <main className="col">
            <br />
            <DwarfCameras
              showWideangle={showWideangle}
              useRawPreviewURL={useRawPreviewURL}
            />
          </main>

          <div className="dropdown-wrapper px-0">
            <ImagingMenu
              setShowWideangle={setShowWideangle}
              setUseRawPreviewURL={setUseRawPreviewURL}
            />
          </div>
        </div>
      </div>
      <div className="bottom-container">
        {notification && <div className="notification">{notification}</div>}
        <select value={selectedSession} onChange={handleSessionChange}>
          <option value="">Select a session...</option>
          {sessions.map((session, index) => (
            <option key={index} value={session.name}>
              {session.name} - {session.date}
            </option>
          ))}
        </select>
        <button onClick={getSessionData} disabled={getSessionDataDisabled}>
          Get Session Data
        </button>
        <div className="progress-container">
          <div className="progress" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{progress}%</span>
        </div>
      </div>
      <style jsx>{`
        .bottom-container {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .notification {
          background-color: #ffcccc;
          color: #ff0000;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        select {
          margin-right: 10px;
          width: 200px; /* Set width to match dropdown */
        }
        .dropdown-wrapper {
          width: auto; /* Set width to match dropdown */
        }
        .progress-container {
          position: relative;
          margin-top: 10px;
          width: 200px; /* Set width to match dropdown */
          height: 20px;
          background-color: #ccc;
          border-radius: 10px;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background-color: #4caf50 !important;
          transition: width 0.5s ease;
        }
        .progress-text {
          position: absolute;
          top: 50%;
          right: 5px;
          transform: translateY(-50%);
          color: white;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}
