import React, { useEffect } from "react";

const DwarfiumMosaicPlanner: React.FC = () => {
  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = false; // Voorkom dat scripts tegelijk laden
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error: ${src}`));
        document.body.appendChild(script);
      });
    };

    // Laad de scripts in de juiste volgorde
    loadScript("https://code.jquery.com/jquery-1.12.1.min.js")
      .then(() => loadScript("/mosaic/aladin.js"))
      .then(() => loadScript("https://www.gstatic.com/charts/loader.js"))
      .then(() => loadScript("/mosaic/DwarfiumMosaicEngine.js"))
      .then(() => loadScript("/mosaic/inline.js")) // inline.js pas als laatste!
      .catch((err) => console.error("Error loading scripts:", err));
  }, []);

  // Event-handlers (deze gaan ervan uit dat de globale functies beschikbaar zijn)
  const handleViewTarget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (window as any).ViewTarget && (window as any).ViewTarget();
  };

  const handleViewImage = (
    e: React.FormEvent<HTMLFormElement>,
    mode: number
  ) => {
    e.preventDefault();
    (window as any).ViewImage && (window as any).ViewImage(mode);
  };

  const handleSelectChange = (mode: number) => {
    (window as any).ViewImage && (window as any).ViewImage(mode);
  };

  const handleFilterChanged = () => {
    (window as any).filterChanged && (window as any).filterChanged();
  };

  const handleFilterTimeChanged = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (window as any).filterTimeChanged && (window as any).filterTimeChanged();
  };

  // Nieuwe download-functie: haalt data uit <p id="aladin-div-text">, filtert de header en de rijnummers eruit en downloadt als JSON.
  const handleDownload = () => {
    const p = document.getElementById("aladin-div-text");
    if (!p) {
      console.error("Element met id 'aladin-div-text' niet gevonden.");
      return;
    }

    const text = p.innerText.trim();
    if (!text) {
      console.error("Geen data gevonden in 'aladin-div-text'.");
      return;
    }

    // 1) Splits de tekst in rijen op basis van newlines
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      console.error("Niet genoeg rijen om kolomnamen en data te verwerken.");
      return;
    }

    // 2) De eerste regel zijn de kolomnamen (bijv. "A B C D")
    const columns = lines[0].split(/\s+/);
    // Verwijder de eerste regel uit de array
    lines.shift();

    // 3) Verwerk elke rij in een object
    const rows: Array<Record<string, any>> = [];

    for (const line of lines) {
      // Splits de regel op whitespace
      const tokens = line.split(/\s+/);
      // De eerste token is het rijnummer
      const rowNumber = tokens.shift(); // bijv. "1", "2", ...

      // We verwachten voor elke kolom 2 tokens (dus columns.length * 2)
      if (tokens.length !== columns.length * 2) {
        console.warn(
          `Rij "${rowNumber}" heeft niet het juiste aantal waardes (verwacht: ${
            columns.length * 2
          }, gekregen: ${tokens.length}).`
        );
        continue; // of throw Error(...)
      }

      // Bouw een object voor deze rij
      const rowData: Record<string, any> = { rowNumber };

      // Voor elke kolom pakken we 2 tokens (bijv. ["01:39:54.18", "43°28'07,50"])
      for (let i = 0; i < columns.length; i++) {
        const colName = columns[i];
        const index = i * 2;
        // Sla ze bijvoorbeeld op als array:
        rowData[colName] = [tokens[index], tokens[index + 1]];
        // Wil je liever een object, kan dat ook:
        // rowData[colName] = { part1: tokens[index], part2: tokens[index + 1] };
      }

      rows.push(rowData);
    }

    // 4) Bouw het uiteindelijke JSON-object op
    const output = {
      columns, // ["A", "B", "C", "D", ...]
      rows, // [{ rowNumber: "1", A: [...], B: [...], ... }, ...]
    };

    // 5) Converteer naar JSON-string met mooie inspringing
    const json = JSON.stringify(output, null, 2);

    // 6) Download als JSON
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="allDiv" className="all_div">
      <div className="new-layout">
        {/* Panel voor observatie-instellingen (1) */}
        <div className="panel panel-left">
          <h2>Observatie-instellingen</h2>

          <form
            className="field"
            title="Enter target name or coordinates, click info icon for more info."
            onSubmit={handleViewTarget}
          >
            <label htmlFor="target">Target:</label>
            <div className="input-with-icon">
              <input type="text" id="target" className="input-text" />
              <button
                type="button"
                className="btn-icon"
                onClick={() => alert((window as any).target_info_text)}
              >
                <img src="/images/information-outline.png" alt="Info" />
              </button>
            </div>
          </form>

          <form className="field" title="Select telescope service.">
            <label htmlFor="current-telescope-service">Service:</label>
            <select
              id="current-telescope-service"
              className="input-select"
              onChange={() => handleSelectChange(1)}
            >
              {/* Opties invullen */}
            </select>
          </form>

          <form className="field" title="Select telescope.">
            <label htmlFor="current-telescope">Telescope:</label>
            <select
              id="current-telescope"
              className="input-select"
              onChange={() => handleSelectChange(2)}
            >
              {/* Opties invullen */}
            </select>
          </form>

          <form
            className="field"
            title="Select grid type: telescope field of view, mosaic grid of separate mosaic panels."
          >
            <label htmlFor="grid_type">View:</label>
            <select
              id="grid_type"
              className="input-select"
              onChange={() => handleSelectChange(0)}
            >
              <option value="fov">FoV</option>
              <option value="mosaic">Mosaic grid</option>
            </select>
          </form>

          <form
            className="field"
            title="Select mosaic overlap, een aanbevolen waarde is 20% overlap."
            onSubmit={(e) => handleViewImage(e, 0)}
          >
            <label htmlFor="overlap_percentage">Mosaic overlap (%):</label>
            <input
              type="number"
              id="overlap_percentage"
              className="input-number"
              min="1"
              max="100"
            />
          </form>

          <form
            className="field"
            title="Select mosaic grid size."
            onSubmit={(e) => handleViewImage(e, 0)}
          >
            <label>Grid size (x, y):</label>
            <div className="grid-size">
              <input
                type="number"
                id="size_x"
                className="input-small"
                min="1"
                max="10"
              />
              <input
                type="number"
                id="size_y"
                className="input-small"
                min="1"
                max="10"
              />
            </div>
          </form>

          <form
            className="field"
            title="Select date for target visibility view."
            onSubmit={(e) => handleViewImage(e, 0)}
          >
            <label htmlFor="view_date">Date (YYYY-MM-DD):</label>
            <input type="text" id="view_date" className="input-text" />
          </form>
        </div>

        {/* Panel voor catalogus-instellingen (2) */}
        <div className="panel panel-right">
          <h2>Catalogus-instellingen</h2>

          <div className="field">
            <label htmlFor="catalog-selection">Catalog:</label>
            <form title="Select catalog.">
              <select
                id="catalog-selection"
                className="input-select"
                onChange={handleFilterChanged}
              >
                {/* Opties invullen */}
              </select>
            </form>
          </div>

          <div className="field">
            <label>Object:</label>
            <div id="catalogDiv" className="catalog-display"></div>
          </div>

          <form
            className="field"
            title="Show only catalog objects that are higher than selected altitude."
          >
            <label htmlFor="catalogFilterDegrees">Altitude:</label>
            <select
              id="catalogFilterDegrees"
              className="input-select"
              onChange={handleFilterChanged}
            >
              <option value="all">All</option>
              <option value="0">0°</option>
              <option value="10">10°</option>
              <option value="20">20°</option>
              <option value="30">30°</option>
              <option value="40">40°</option>
              <option value="50">50°</option>
              <option value="60">60°</option>
              <option value="70">70°</option>
              <option value="80">80°</option>
            </select>
          </form>

          <form
            className="field"
            title="Show only catalog objects that are visible at selected time. Time format is HH:MM."
            onSubmit={handleFilterTimeChanged}
          >
            <label htmlFor="catalogFilterTime">Time:</label>
            <input
              type="text"
              id="catalogFilterTime"
              size={5}
              className="input-text"
            />
          </form>

          <div className="field">
            <label htmlFor="catalogFilterMoon">Moon:</label>
            <form title="Show only catalog objects that are further away from the moon than selected angle.">
              <select
                id="catalogFilterMoon"
                className="input-select"
                onChange={handleFilterChanged}
              >
                <option value="all">All</option>
                <option value="45">45°</option>
                <option value="90">90°</option>
                <option value="135">135°</option>
              </select>
            </form>
          </div>

          <form
            className="field"
            title="If selected, reposition image framing by moving the image using the mouse."
            onSubmit={(e) => handleViewImage(e, 0)}
          >
            <label htmlFor="repositionCheckbox">Reposition:</label>
            <div className="checkbox-area">
              <input type="checkbox" id="repositionCheckbox" />
            </div>
          </form>

          <div className="button-area">
            <button
              title="Refresh current view."
              onClick={() =>
                (window as any).ViewImage && (window as any).ViewImage(0)
              }
              className="btn-refresh-mosaic"
            >
              Refresh
            </button>
            <button
              title="Download data as JSON"
              onClick={handleDownload}
              className="btn-download"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      <div>
        <p id="startup_info_text"></p>
      </div>
      <div>
        <p id="error_text"></p>
      </div>
      <div id="DivLoadPanels"></div>
      <br />
      <br />
    </div>
  );
};

export default DwarfiumMosaicPlanner;
