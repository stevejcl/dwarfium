import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";
import StatusBar from "@/components/shared/StatusBar";

export default function AstroPhoto() {
  useSetupConnection();
  useLoadIntialValues();
  const connectionCtx = useContext(ConnectionContext);

  const [notification] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [progress, setProgress] = useState(0);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Record<string, any>>({});

  const fetchSessions = async () => {
    if (connectionCtx.IPDwarf === undefined) {
      return;
    }

    try {
      const response = await fetch(
        `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/`
      );
      const data = await response.text();
      const folderRegex =
        /href="([^"]*?)\/"[^>]*?>([^<]+)<\/a>\s+(\d{2}-[a-zA-Z]{3}-\d{4} \d{2}:\d{2})/gi;
      let matches;
      let sessionList: Session[] = [];
      while ((matches = folderRegex.exec(data)) !== null) {
        const folderName = matches[1];
        const folderDate = matches[3];
        if (!/dwarf_dark|solving_failed/i.test(folderName)) {
          sessionList.push({ name: folderName, date: folderDate });
        }
      }
      if (sessionList.length > 0) {
        setSessions(sessionList);
        sessionList.forEach((session) => fetchSessionInfo(session.name));
      }
    } catch (error: any) {
      console.error(
        "An error occurred while fetching sessions:",
        error.message
      );
      setSessions([]);
    }
  };

  const fetchSessionInfo = async (sessionName: string) => {
    try {
      const response = await fetch(
        `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${sessionName}/shotsInfo.json`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch session info: ${response.statusText}`);
      }
      const data = await response.json();
      setSessionInfo((prevState) => ({
        ...prevState,
        [sessionName]: data,
      }));
    } catch (error: any) {
      console.error(
        "An error occurred while fetching session info:",
        error.message
      );
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [connectionCtx.IPDwarf]);

  const getSessionData = async (sessionName: string) => {
    setDownloadClicked(true);
    try {
      if ("showDirectoryPicker" in window) {
        const selectedFolder = await (window as any).showDirectoryPicker();
        const sessionFolderHandle = await selectedFolder.getDirectoryHandle(
          sessionName,
          { create: true }
        );
        const folderResponse = await fetch(
          `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${sessionName}`
        );
        const folderData = await folderResponse.text();
        if (folderData !== null) {
          const fitsFilesMatch = folderData.match(/href="([^"]*\.fits)"/g);
          if (fitsFilesMatch !== null) {
            const fitsFiles = fitsFilesMatch.map((match) =>
              match.substring(6, match.length - 1)
            );
            const totalFiles = fitsFiles.length;
            let downloadedFiles = 0;
            for (const fitsFile of fitsFiles) {
              const fileResponse = await fetch(
                `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${sessionName}/${fitsFile}`
              );
              const fileBlob = await fileResponse.blob();
              const fileHandle = await sessionFolderHandle.getFileHandle(
                fitsFile,
                {
                  create: true,
                }
              );
              const writable = await fileHandle.createWritable();
              await writable.write(fileBlob);
              await writable.close();
              downloadedFiles++;
              setProgress(Math.floor((downloadedFiles / totalFiles) * 100));
            }
            console.log("Files downloaded successfully.");
          } else {
            console.log("No Files found.");
          }
        }
      } else {
        console.error(
          "File System Access API is not supported in this browser."
        );
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.error("User aborted the operation.");
      } else {
        console.error("An error occurred:", error.message);
      }
    } finally {
      setDownloadClicked(false);
    }
  };

  const getTarget = (sessionName: string) => {
    const sessionData = sessionInfo[sessionName];
    if (sessionData && sessionData.target) {
      return sessionData.target;
    } else {
      return sessionName;
    }
  };

  const getShootingInfo = (sessionName: string) => {
    return sessionInfo[sessionName] ? (
      <span>
        Shots Stacked: {sessionInfo[sessionName].shotsStacked}, Shots Taken:{" "}
        {sessionInfo[sessionName].shotsTaken}
      </span>
    ) : (
      <span>No shooting info available</span>
    );
  };

  const getAdditionalInfo = (sessionName: string) => {
    return sessionInfo[sessionName] ? (
      <span>
        DEC: {sessionInfo[sessionName].DEC}, RA: {sessionInfo[sessionName].RA},
        Binning: {sessionInfo[sessionName].binning}, Exp:{" "}
        {sessionInfo[sessionName].exp}, Format:{" "}
        {sessionInfo[sessionName].format}, Gain: {sessionInfo[sessionName].gain}
        , IR: {sessionInfo[sessionName].ir}
      </span>
    ) : (
      <span>No additional info available</span>
    );
  };

  return (
    <>
      <section className="daily-horp d-inline-block w-100">
        <div className="container">
          <br />
          <br />
          <br />
          <br />
          <Head>
            <title>Session Data</title>
          </Head>
          <StatusBar />
          <div className="container-image-session">
            {notification && <div className="notification">{notification}</div>}
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Target</th>
                  <th>Date</th>
                  <th>Shooting Info</th>
                  <th>Additional Info</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                    <tr className="active-row" key={index}>
                    <td>
                            <img className="thumblarge"
                        src={`http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${session.name}/stacked_thumbnail.jpg`}
                        alt="Thumbnail"
                      />
                    </td>
                    <td className="session-name">{getTarget(session.name)}</td>
                    <td>{session.date}</td>
                    <td>{getShootingInfo(session.name)}</td>
                    <td>{getAdditionalInfo(session.name)}</td>
                    <td>
                      <button
                        className="btn btn-more02"
                        onClick={() => getSessionData(session.name)}
                        disabled={downloadClicked}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {downloadClicked && (
              <div className="progress-overlay">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="progress-text">{progress}%</span>
              </div>
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

        </div>
          </section>
         
    </>
  );
}

interface Session {
  name: string;
  date: string;
}
