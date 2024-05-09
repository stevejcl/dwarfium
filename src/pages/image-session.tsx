import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";
import StatusBar from "@/components/shared/StatusBar";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export default function AstroPhoto() {
  useSetupConnection();
  useLoadIntialValues();
  const connectionCtx = useContext(ConnectionContext);

  const [notification] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [progress, setProgress] = useState(0);
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Record<string, any>>({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<string>("");
  const [thumbnailExists, setThumbnailExists] = useState<boolean[]>([]);

  const fetchThumbnailExists = async (sessionName: string) => {
    const thumbnailUrl = `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${sessionName}/stacked_thumbnail.jpg`;

    try {
      const response = await fetch(thumbnailUrl);
      console.log(`Response status for ${sessionName}: ${response.status}`);

      if (response.status === 200) {
        console.log(`Thumbnail exists for session ${sessionName}: true`);
        return true;
      } else if (response.status === 404) {
        console.log(`Thumbnail exists for session ${sessionName}: false`);
        return false;
      } else {
        console.error(
          "Unexpected status code while checking thumbnail existence:",
          response.status
        );
        return false;
      }
    } catch (error) {
      console.error("Error checking thumbnail existence:", error);
      return false;
    }
  };

  useEffect(() => {
    const loadThumbnailExists = async (sessionName: string, index: number) => {
      console.log(`Loading thumbnail existence for session: ${sessionName}`);
      const exists = await fetchThumbnailExists(sessionName);
      console.log(`Thumbnail exists for session ${sessionName}: ${exists}`);
      setThumbnailExists((prevState) => {
        const newState = [...prevState];
        newState[index] = exists;
        return newState;
      });
    };

    sessions.forEach((session, index) => {
      loadThumbnailExists(session.name, index);
    });
  }, [sessions, connectionCtx.IPDwarf]);

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
          try {
            await fetch(
              `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${folderName}/shotsInfo.json`
            );
            sessionList.push({ name: folderName, date: folderDate });
          } catch (error) {
            console.log(
              `shotsInfo.json not found in session folder ${folderName}`
            );
          }
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
        `http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${sessionName}/shotsInfo.json`,
        { mode: "no-cors" }
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
      console.log(
        "An error occurred while fetching session info:",
        error.message
      );
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [connectionCtx.IPDwarf]);

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
        {t("pImageSessionShotsStacked")}:{" "}
        {sessionInfo[sessionName].shotsStacked}, {t("pImageSessionShotsTaken")}:{" "}
        {sessionInfo[sessionName].shotsTaken}
      </span>
    ) : (
      <span>{t("pImageSessionNoShootingInfo")}</span>
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
      <span>{t("pImageSessionNoAdditionalInfo")}</span>
    );
  };

  const sortByProperty = (prop: string) => {
    let sortedSessions = [...sessions];
    sortedSessions.sort((a, b) => {
      if (prop === "date") {
        const [dayA, monthA, yearA, timeA] = a[prop].split(/[-\s:]/);
        const [dayB, monthB, yearB, timeB] = b[prop].split(/[-\s:]/);

        const months = {
          JAN: 1,
          FEB: 2,
          MAR: 3,
          APR: 4,
          MAY: 5,
          JUN: 6,
          JUL: 7,
          AUG: 8,
          SEP: 9,
          OCT: 10,
          NOV: 11,
          DEC: 12,
        };

        if (parseInt(yearA) !== parseInt(yearB))
          return sortOrder === "asc"
            ? parseInt(yearA) - parseInt(yearB)
            : parseInt(yearB) - parseInt(yearA);
        if (months[monthA] !== months[monthB])
          return sortOrder === "asc"
            ? months[monthA] - months[monthB]
            : months[monthB] - months[monthA];
        if (parseInt(dayA) !== parseInt(dayB))
          return sortOrder === "asc"
            ? parseInt(dayA) - parseInt(dayB)
            : parseInt(dayB) - parseInt(dayA);

        const [hourA, minuteA] = timeA.split(":");
        const [hourB, minuteB] = timeB.split(":");
        if (parseInt(hourA) !== parseInt(hourB))
          return sortOrder === "asc"
            ? parseInt(hourA) - parseInt(hourB)
            : parseInt(hourB) - parseInt(hourA);
        return sortOrder === "asc"
          ? parseInt(minuteA) - parseInt(minuteB)
          : parseInt(minuteB) - parseInt(minuteA);
      } else {
        if (sortOrder === "asc") {
          return a[prop] > b[prop] ? 1 : -1;
        } else {
          return a[prop] < b[prop] ? 1 : -1;
        }
      }
    });

    setSessions(sortedSessions);
    setSortBy(prop);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
            <title>{t("pImageSessionData")}</title>
          </Head>
          <StatusBar />
          <hr></hr>
          <div className="container-image-session">
            {notification && <div className="notification">{notification}</div>}
            <p>{t("pImageSessionSortTable")} </p>
            <div className="table-responsive">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>{t("pImageSessionPreview")}</th>
                    <th onClick={() => sortByProperty("name")}>
                      {t("pImageSessionTarget")}{" "}
                      {sortBy === "name" && (
                        <span className="sorting">
                          {sortOrder === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th onClick={() => sortByProperty("date")}>
                      {t("pImageSessionDate")}{" "}
                      {sortBy === "date" && (
                        <span className="sorting">
                          {sortOrder === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                    <th>{t("pImageSessionShootingInfo")}</th>
                    <th>{t("pImageSessionAdditionalInfo")}</th>
                    <th>{t("pImageSessionAction")}</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (
                    <tr className="active-row" key={index}>
                      <td>
                        {thumbnailExists[index] === true ? (
                          <img
                            className="thumblarge"
                            src={`http://${connectionCtx.IPDwarf}/sdcard/DWARF_II/Astronomy/${session.name}/stacked_thumbnail.jpg`}
                            alt="Thumbnail"
                          />
                        ) : thumbnailExists[index] === false ||
                          thumbnailExists[index] === undefined ? (
                          <img
                            className="thumblarge"
                            src="/images/404.jpg"
                            alt="Thumbnail Not Available"
                          />
                        ) : (
                          <div>{t("pImageSessionLoading")}</div>
                        )}
                      </td>
                      <td className="session-name">
                        {getTarget(session.name)}
                      </td>
                      <td>{session.date}</td>
                      <td>{getShootingInfo(session.name)}</td>
                      <td>{getAdditionalInfo(session.name)}</td>
                      <td colSpan={2} className="centered-cell">
                        <button
                          className="btn btn-more02"
                          onClick={() => getSessionData(session.name)}
                          disabled={downloadClicked}
                        >
                          {t("pImageSessionDownload")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
