import React, { useState, useEffect } from "react";

// Kolomdefinities, zoals in de oorspronkelijke code
const columnsOK = [
  "Description",
  "Dwarf",
  "Starting",
  "Ending",
  "Calibration",
  "Goto",
  "Target",
  "RA",
  "Dec",
  "Lens",
  "exposure",
  "gain",
  "IR",
  "count",
];
const columnsKO = [
  "Description",
  "Dwarf",
  "Starting",
  "Ending",
  "Message",
  "Calibration",
  "Goto",
  "Target",
  "RA",
  "Dec",
  "Lens",
  "exposure",
  "gain",
  "IR",
  "count",
];

interface CSVData {
  [key: string]: string;
}

interface CSVResult {
  okData: CSVData[];
  errorData: CSVData[];
}

/**
 * Simuleer het ophalen van observatiebestanden.
 * In een echte toepassing haal je deze data via een API of backend.
 */
const getObservationFiles = async (): Promise<string[]> => {
  // Dummy data: een paar voorbeeld-bestandsnamen
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["observation1.csv", "observation2.csv"]);
    }, 500);
  });
};

/**
 * Simuleer het laden van CSV‑data op basis van een bestandsnaam.
 * De data wordt hier als JSON-structuur teruggegeven.
 */
const loadCSVData = async (filename: string): Promise<CSVResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dummy data: in de praktijk vervang je dit met de echte CSV‑data
      const dummyOkData: CSVData[] = [
        {
          Description: "Observation A",
          Dwarf: "D1",
          Starting: "12:00",
          Ending: "12:30",
          Calibration: "Done",
          Goto: "Solar",
          Target: "Mars",
          RA: "10h",
          Dec: "20°",
          Lens: "Tele",
          exposure: "5s",
          gain: "10",
          IR: "VIS",
          count: "1",
        },
      ];
      const dummyErrorData: CSVData[] = [
        {
          Description: "Observation B",
          Dwarf: "D2",
          Starting: "13:00",
          Ending: "13:30",
          Message: "Error: Timeout",
          Calibration: "",
          Goto: "",
          Target: "",
          RA: "",
          Dec: "",
          Lens: "",
          exposure: "",
          gain: "",
          IR: "",
          count: "",
        },
      ];
      resolve({ okData: dummyOkData, errorData: dummyErrorData });
    }, 500);
  });
};

/**
 * In de oorspronkelijke code wordt ook een analyse van JSON-bestanden gedaan.
 * Hier simuleren we deze functie; in een echte toepassing voer je hier de
 * benodigde verwerking uit.
 */
const analyzeFiles = async (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 500));
};

const ResultSessionTab: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [okData, setOkData] = useState<CSVData[]>([]);
  const [errorData, setErrorData] = useState<CSVData[]>([]);

  // Laadt de lijst met observatiebestanden en de data van het eerste bestand
  const refreshObservationList = async () => {
    await analyzeFiles();
    const obsFiles = await getObservationFiles();
    setFiles(obsFiles);
    if (obsFiles.length > 0) {
      setSelectedFile(obsFiles[0]);
      const { okData, errorData } = await loadCSVData(obsFiles[0]);
      setOkData(okData);
      setErrorData(errorData);
    } else {
      setSelectedFile("");
      setOkData([]);
      setErrorData([]);
    }
  };

  useEffect(() => {
    refreshObservationList();
  }, []);

  // Bij het wisselen van het geselecteerde bestand laden we de bijbehorende CSV-data
  const onFileSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const file = e.target.value;
    setSelectedFile(file);
    const { okData, errorData } = await loadCSVData(file);
    setOkData(okData);
    setErrorData(errorData);
  };

  return (
    <div className="result-session-tab">
      <div className="top-bar">
        <label htmlFor="file-select">Select Observation File:</label>
        <select id="file-select" value={selectedFile} onChange={onFileSelect}>
          {files.map((file, idx) => (
            <option key={idx} value={file}>
              {file}
            </option>
          ))}
        </select>
        <button onClick={refreshObservationList}>Update Results</button>
      </div>
      <div className="tables">
        <div className="table-container">
          <h3>Sessions OK</h3>
          <table>
            <thead>
              <tr>
                {columnsOK.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {okData.map((row, idx) => (
                <tr key={idx}>
                  {columnsOK.map((col, j) => (
                    <td key={j}>{row[col] || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-container">
          <h3>Error Sessions</h3>
          <table>
            <thead>
              <tr>
                {columnsKO.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {errorData.map((row, idx) => (
                <tr key={idx}>
                  {columnsKO.map((col, j) => (
                    <td key={j}>{row[col] || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultSessionTab;
