// SessionForm.tsx
import React, { useState, useEffect } from "react";

// Simuleer de beschikbare opties (normaal haal je deze uit een API of constants)
const allowed_exposures = [{ name: "1s" }, { name: "2s" }, { name: "5s" }];
const allowed_gains = [{ name: "Low" }, { name: "Medium" }, { name: "High" }];
const allowed_exposuresD3 = [{ name: "D3Exp1" }, { name: "D3Exp2" }];
const allowed_gainsD3 = [{ name: "D3Gain1" }, { name: "D3Gain2" }];
const allowed_wide_exposuresD3 = [{ name: "WideExp1" }, { name: "WideExp2" }];
const allowed_wide_gainsD3 = [{ name: "WideGain1" }, { name: "WideGain2" }];

const ircut_options: { [key: string]: string } = {
  "D2 - IRCut": "0",
  "D2 - IRPass": "1",
  "D3 - VIS Filter": "0",
  "D3 - Astro Filter": "1",
  "D3 - DUAL Band": "2",
};

const solar_system_objects = [
  "",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Sun",
];

const SessionForm: React.FC = () => {
  // Formulier‑velden (settings_vars)
  const [deviceType, setDeviceType] = useState<string>("Dwarf II");
  const [exposureOptions, setExposureOptions] = useState<string[]>([]);
  const [gainOptions, setGainOptions] = useState<string[]>([]);
  const [ircutOptions, setIrcutOptions] = useState<string[]>([]);

  const [exposure, setExposure] = useState<string>("");
  const [gain, setGain] = useState<string>("");
  const [ircut, setIrcut] = useState<string>("");

  const [cameraType, setCameraType] = useState<string>("Tele Camera");

  const [description, setDescription] = useState<string>("");
  const [maxRetries, setMaxRetries] = useState<string>("3");
  const [waitBefore, setWaitBefore] = useState<string>("10");
  const [waitAfter, setWaitAfter] = useState<string>("10");

  // Target en coördinaten
  const [targetType, setTargetType] = useState<"solar" | "manual" | "none">(
    "manual"
  );
  const [targetSolar, setTargetSolar] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [raCoord, setRaCoord] = useState<string>("");
  const [decCoord, setDecCoord] = useState<string>("");

  const [waitAfterTarget, setWaitAfterTarget] = useState<string>("10");
  const [count, setCount] = useState<string>("10");
  const [waitAfterCamera, setWaitAfterCamera] = useState<string>("10");

  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // YYYY-MM-DD
  const [time, setTime] = useState<string>(
    new Date().toTimeString().split(" ")[0]
  ); // HH:MM:SS

  // Actie checkboxen
  const [eqSolving, setEqSolving] = useState<boolean>(false);
  const [autoFocus, setAutoFocus] = useState<boolean>(false);
  const [infiniteFocus, setInfiniteFocus] = useState<boolean>(false);
  const [calibration, setCalibration] = useState<boolean>(false);

  // Voor CSV‑import en JSON‑preview
  const [jsonPreview, setJsonPreview] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // UUID counter
  const [uuidCounter, setUuidCounter] = useState<number>(1);

  // Update de exposure-, gain- en filteropties wanneer deviceType verandert
  useEffect(() => {
    if (deviceType === "Dwarf II") {
      setExposureOptions([...allowed_exposures.map((e) => e.name)].reverse());
      setGainOptions(allowed_gains.map((g) => g.name));
      setIrcutOptions(["D2 - IRCut", "D2 - IRPass"]);
      setCameraType("Tele Camera");
    } else if (deviceType === "Dwarf 3 Tele Lens") {
      setExposureOptions([...allowed_exposuresD3.map((e) => e.name)].reverse());
      setGainOptions(allowed_gainsD3.map((g) => g.name));
      setIrcutOptions([
        "D3 - VIS Filter",
        "D3 - Astro Filter",
        "D3 - DUAL Band",
      ]);
      setCameraType("Tele Camera");
    } else if (deviceType === "Dwarf 3 Wide Lens") {
      setExposureOptions(
        [...allowed_wide_exposuresD3.map((e) => e.name)].reverse()
      );
      setGainOptions(allowed_wide_gainsD3.map((g) => g.name));
      setIrcutOptions([]);
      setCameraType("Wide-Angle Camera");
    } else {
      setExposureOptions([]);
      setGainOptions([]);
      setIrcutOptions([]);
    }
    // Reset de velden als de huidige waarde niet in de nieuwe opties staat
    if (!exposureOptions.includes(exposure)) setExposure("");
    if (!gainOptions.includes(gain)) setGain("");
    if (!ircutOptions.includes(ircut)) setIrcut("");
  }, [deviceType]);

  // Helperfuncties
  const getExposureTime = (exposureString: string): number => {
    if (!exposureString) return 0;
    if (exposureString.includes("/")) {
      const parts = exposureString.split("/");
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (den !== 0) return num / den;
      }
      return 0;
    } else {
      const val = parseFloat(exposureString);
      return isNaN(val) ? 0 : val;
    }
  };

  const convertRaToHourDecimal = (raStr: string): number => {
    // Verwijder 'h', 'r', ' en "'
    const cleaned = raStr.replace(/[hr"']/g, " ").trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length < 3) return 0;
    const h = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    return h + m / 60 + s / 3600;
  };

  const convertDecToDegrees = (decStr: string): number => {
    const cleaned = decStr.replace(/[^\d\.\s-]/g, "").trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length < 3) return 0;
    const d = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    return d < 0 ? d - m / 60 - s / 3600 : d + m / 60 + s / 3600;
  };

  const checkInteger = (value: string): number => {
    let num = parseInt(value);
    if (isNaN(num) || num < 0) return 0;
    if (num > 999) return 999;
    return num;
  };

  const calculateEndTime = (): { endDate: string; endTime: string } | null => {
    try {
      const exposureSeconds = getExposureTime(exposure);
      const countVal = checkInteger(count);
      if (countVal === 0) return null;

      let waitTime = 0;
      if (eqSolving) {
        waitTime += 60 + parseInt(waitBefore) + parseInt(waitAfter);
      }
      if (autoFocus) {
        waitTime += 10 + parseInt(waitBefore) + parseInt(waitAfter);
      }
      if (infiniteFocus) {
        waitTime += 5 + parseInt(waitBefore) + parseInt(waitAfter);
      }
      if (calibration) {
        waitTime += 10 + 60 + parseInt(waitBefore) + parseInt(waitAfter);
      }
      if (targetType === "solar" || targetType === "manual") {
        waitTime += 30 + parseInt(waitAfterTarget);
      }
      waitTime += 15 + parseInt(waitAfterCamera);

      const startDateTime = new Date(`${date}T${time}`);
      const totalExposureTime = waitTime + (exposureSeconds + 1) * countVal;
      const endDateTime = new Date(
        startDateTime.getTime() + totalExposureTime * 1000
      );
      return {
        endDate: endDateTime.toISOString().split("T")[0],
        endTime: endDateTime.toTimeString().split(" ")[0],
      };
    } catch (error) {
      alert("Error calculating end time: " + error);
      return null;
    }
  };

  const generateJsonPreview = (): any => {
    const currentUuid = uuidCounter.toString().padStart(5, "0");
    const data = {
      command: {
        id_command: {
          uuid: currentUuid,
          description,
          date,
          time,
          process: "wait",
          max_retries: parseInt(maxRetries),
          result: false,
          message: "",
          nb_try: 1,
        },
        eq_solving: {
          do_action: eqSolving,
          wait_before: parseInt(waitBefore),
          wait_after: parseInt(waitAfter),
        },
        auto_focus: {
          do_action: autoFocus,
          wait_before: parseInt(waitBefore),
          wait_after: parseInt(waitAfter),
        },
        infinite_focus: {
          do_action: infiniteFocus,
          wait_before: parseInt(waitBefore),
          wait_after: parseInt(waitAfter),
        },
        calibration: {
          do_action: calibration,
          wait_before: parseInt(waitBefore),
          wait_after: parseInt(waitAfter),
        },
        goto_solar: {
          do_action: targetType === "solar",
          target: targetSolar,
          wait_after: parseInt(waitAfterTarget),
        },
        goto_manual: {
          do_action: targetType === "manual",
          target,
          ra_coord: raCoord ? parseFloat(raCoord) : 0,
          dec_coord: decCoord ? parseFloat(decCoord) : 0,
          wait_after: parseInt(waitAfterTarget),
        },
        setup_camera: {
          do_action: cameraType === "Tele Camera" && checkInteger(count) !== 0,
          exposure,
          gain,
          binning: "0",
          IRCut: ircut_options[ircut] || "",
          count: checkInteger(count),
          wait_after: parseInt(waitAfterCamera),
        },
        setup_wide_camera: {
          do_action:
            cameraType === "Wide-Angle Camera" && checkInteger(count) !== 0,
          exposure,
          gain,
          count: checkInteger(count),
          wait_after: parseInt(waitAfterCamera),
        },
      },
    };
    setUuidCounter(uuidCounter + 1);
    return data;
  };

  const downloadJson = (jsonData: any) => {
    const targetValue =
      targetType === "manual" ? target : targetSolar || description;
    const filename = `${date}-${time.replace(/:/g, "-")}-${targetValue}.json`;
    const blob = new Blob([JSON.stringify(jsonData, null, 4)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const saveToJson = () => {
    if (!description || !date || !time || !maxRetries) {
      alert("Please fill all required fields");
      return;
    }
    if (checkInteger(count) === 0) {
      if (
        !window.confirm(
          "Count value is 0, so no imaging will take place. Proceed?"
        )
      )
        return;
    }
    const jsonData = generateJsonPreview();
    downloadJson(jsonData);
    const end = calculateEndTime();
    if (end) {
      setDate(end.endDate);
      setTime(end.endTime);
    }
    alert("Data saved successfully!");
  };

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        try {
          // Eenvoudige CSV-parsing: splits op newline en komma
          const rows = text
            .split("\n")
            .map((row) => row.split(",").map((cell) => cell.trim()));
          const header = rows[0];
          let previewArray: any[] = [];
          let currentDatetime = new Date();
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < header.length) continue;
            let descriptionVal = "";
            let targetVal = "";
            let raVal = "";
            let decVal = "";
            if (
              header.includes("Pane") &&
              header.includes("RA") &&
              header.includes("DEC")
            ) {
              descriptionVal = `Observation of Mosaic ${
                row[header.indexOf("Pane")]
              }`;
              targetVal = `Mosaic ${row[header.indexOf("Pane")]}`;
              raVal = row[header.indexOf("RA")];
              decVal = row[header.indexOf("DEC")];
            } else if (
              header.includes("Catalogue Entry") &&
              header.includes("Right Ascension") &&
              header.includes("Declination")
            ) {
              descriptionVal = `Mosaic of ${
                row[header.indexOf("Catalogue Entry")]
              }`;
              targetVal = row[header.indexOf("Catalogue Entry")];
              raVal = row[header.indexOf("Right Ascension")];
              decVal = row[header.indexOf("Declination")];
            } else {
              alert("Unrecognized CSV format");
              return;
            }
            const raHour = convertRaToHourDecimal(raVal);
            const decDeg = convertDecToDegrees(decVal);
            setDescription(descriptionVal);
            setTarget(targetVal);
            setRaCoord(raHour.toString());
            setDecCoord(decDeg.toString());
            setDate(currentDatetime.toISOString().split("T")[0]);
            setTime(currentDatetime.toTimeString().split(" ")[0]);
            if (!maxRetries) setMaxRetries("3");
            if (!count) setCount("10");
            if (!waitBefore) setWaitBefore("10");
            if (!waitAfter) setWaitAfter("10");
            if (!waitAfterTarget) setWaitAfterTarget("10");
            if (!waitAfterCamera) setWaitAfterCamera("10");
            setTargetType("manual");
            const previewJson = generateJsonPreview();
            previewArray.push(previewJson);
            const end = calculateEndTime();
            if (end) {
              currentDatetime = new Date(`${end.endDate}T${end.endTime}`);
            }
          }
          setJsonPreview(previewArray);
          setShowPreview(true);
        } catch (error) {
          alert("Error parsing CSV: " + error);
        }
      }
    };
    reader.readAsText(file);
  };

  const confirmCsvImport = () => {
    jsonPreview.forEach((jsonData) => downloadJson(jsonData));
    alert("CSV imported and JSON files generated successfully!");
    setShowPreview(false);
  };

  return (
    <div className="session-form">
      <h2>Create Session</h2>
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Max Retries</label>
        <input
          type="number"
          value={maxRetries}
          onChange={(e) => setMaxRetries(e.target.value)}
        />
      </div>
      <div className="form-group actions">
        <label className="form-title">ACTIONS</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={autoFocus}
              onChange={(e) => setAutoFocus(e.target.checked)}
            />
            Auto Focus
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={infiniteFocus}
              onChange={(e) => setInfiniteFocus(e.target.checked)}
            />
            Infinite Focus
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={eqSolving}
              onChange={(e) => setEqSolving(e.target.checked)}
            />
            EQ Solving
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={calibration}
              onChange={(e) => setCalibration(e.target.checked)}
            />
            Calibration
          </label>
        </div>
      </div>
      <div className="form-group">
        <label>Wait Before (s)</label>
        <input
          type="number"
          value={waitBefore}
          onChange={(e) => setWaitBefore(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Wait After (s)</label>
        <input
          type="number"
          value={waitAfter}
          onChange={(e) => setWaitAfter(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Target Type</label>
        <div>
          <label>
            <input
              type="radio"
              name="targetType"
              value="solar"
              checked={targetType === "solar"}
              onChange={() => setTargetType("solar")}
            />
            Solar System
          </label>
          <label>
            <input
              type="radio"
              name="targetType"
              value="manual"
              checked={targetType === "manual"}
              onChange={() => setTargetType("manual")}
            />
            Manual
          </label>
          <label>
            <input
              type="radio"
              name="targetType"
              value="none"
              checked={targetType === "none"}
              onChange={() => setTargetType("none")}
            />
            None
          </label>
        </div>
      </div>
      {targetType === "solar" && (
        <div className="form-group">
          <label>Solar System Object</label>
          <select
            value={targetSolar}
            onChange={(e) => setTargetSolar(e.target.value)}
          >
            {solar_system_objects.map((obj, idx) => (
              <option key={idx} value={obj}>
                {obj}
              </option>
            ))}
          </select>
        </div>
      )}
      {targetType === "manual" && (
        <>
          <div className="form-group">
            <label>Manual Target</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>RA (dec or HH:mm:ss.s)</label>
            <input
              type="text"
              value={raCoord}
              onChange={(e) => setRaCoord(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Dec (dec or ±DD:mm:ss.s)</label>
            <input
              type="text"
              value={decCoord}
              onChange={(e) => setDecCoord(e.target.value)}
            />
          </div>
        </>
      )}
      <div className="form-group">
        <label>Wait After Goto (s)</label>
        <input
          type="number"
          value={waitAfterTarget}
          onChange={(e) => setWaitAfterTarget(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Imaging Count (0 Not Do)</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Wait After Session (s)</label>
        <input
          type="number"
          value={waitAfterCamera}
          onChange={(e) => setWaitAfterCamera(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Date (YYYY-MM-DD)</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Time (HH:MM:SS)</label>
        <input
          type="time"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      {/* moet aparte kolom worden  */}
      <div className="form-group">
        <label>Device Type</label>
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
        >
          <option value="Dwarf II">Dwarf II</option>
          <option value="Dwarf 3 Tele Lens">Dwarf 3 Tele Lens</option>
          <option value="Dwarf 3 Wide Lens">Dwarf 3 Wide Lens</option>
        </select>
      </div>
      <div className="form-group">
        <label>Exposure</label>
        <select value={exposure} onChange={(e) => setExposure(e.target.value)}>
          <option value="">Select Exposure</option>
          {exposureOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Gain</label>
        <select value={gain} onChange={(e) => setGain(e.target.value)}>
          <option value="">Select Gain</option>
          {gainOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Filter</label>
        <select value={ircut} onChange={(e) => setIrcut(e.target.value)}>
          <option value="">Select Filter</option>
          {ircutOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      {/* einde aparte kolom  */}

      <div className="form-group">
        <button className="primary-button" onClick={saveToJson}>
          Save
        </button>
      </div>

      <div className="form-group">
        <label className="form-title">Import Telescopius Mosaic CSV</label>
        <input
          type="file"
          accept=".csv"
          className="file-input"
          onChange={handleCsvImport}
        />
      </div>
      {showPreview && (
        <div className="modal">
          <div className="modal-content">
            <h3>JSON Preview</h3>
            <pre>{JSON.stringify(jsonPreview, null, 2)}</pre>
            <button onClick={confirmCsvImport}>Confirm</button>
            <button onClick={() => setShowPreview(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionForm;
