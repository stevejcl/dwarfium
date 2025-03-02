import React, { useState, useEffect, useRef } from "react";
import SettingsTabPage from "./Settings"; // Importeer de Settings pagina-component
import OverviewSessionTab from "./OverviewSessionTab"; // Importeer de Settings pagina-component
import ResultSessionTab from "./ResultSessionTab"; // Importeer de Settings pagina-component
import SessionForm from "./SessionForm"; // Importeer de Settings pagina-component

const CONFIG_DEFAULT = "Default";

const App: React.FC = () => {
  // Configuratie–states
  const [configs, setConfigs] = useState<string[]>([CONFIG_DEFAULT]);
  const [currentConfig, setCurrentConfig] = useState<string>(CONFIG_DEFAULT);
  const [isMultiple, setIsMultiple] = useState<boolean>(false);
  const [newConfig, setNewConfig] = useState<string>("");

  // States voor Bluetooth en Scheduler
  const [bluetoothConnected, setBluetoothConnected] = useState<boolean>(false);
  const [schedulerRunning, setSchedulerRunning] = useState<boolean>(false);
  const schedulerIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Log–state
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);
  // Helper: Voeg een logregel toe
  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  // Laad configuraties (bijvoorbeeld vanuit localStorage)
  const loadConfiguration = () => {
    const storedConfigs = localStorage.getItem("configs");
    if (storedConfigs) {
      setConfigs(JSON.parse(storedConfigs));
    } else {
      setConfigs([CONFIG_DEFAULT]);
    }
  };

  // Sla configuraties op in localStorage
  const saveConfiguration = (configs: string[]) => {
    localStorage.setItem("configs", JSON.stringify(configs));
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  // Voeg een nieuwe configuratie toe
  const addConfig = () => {
    const trimmed = newConfig.trim();
    if (!trimmed) {
      alert("Configuration name cannot be empty.");
      return;
    }
    if (configs.includes(trimmed)) {
      addLog(`Configuration '${trimmed}' selected.`);
      setCurrentConfig(trimmed);
    } else {
      const newConfigs = [...configs, trimmed];
      setConfigs(newConfigs);
      saveConfiguration(newConfigs);
      setCurrentConfig(trimmed);
      addLog(`New configuration '${trimmed}' created.`);
    }
    setNewConfig("");
  };

  // Wijziging in de huidige configuratie
  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setCurrentConfig(selected);
    addLog(`Configuration '${selected}' selected.`);
  };

  // Simuleer een Bluetooth-verbinding (bijv. een API-call)
  const startBluetooth = () => {
    addLog("Starting Bluetooth connection...");
    setTimeout(() => {
      setBluetoothConnected(true);
      addLog("Bluetooth connected successfully.");
    }, 2000);
  };

  // Sla de Bluetooth-connectie over
  const skipBluetooth = () => {
    addLog("Bluetooth connection skipped.");
    setBluetoothConnected(false);
  };

  // Start de scheduler (simuleert verbinding en periodieke taken)
  const startScheduler = () => {
    if (!bluetoothConnected) {
      addLog("Please connect via Bluetooth first.");
      return;
    }
    if (!schedulerRunning) {
      setSchedulerRunning(true);
      addLog("Scheduler is starting...");
      setTimeout(() => {
        addLog("Connected to the Dwarf.");
        schedulerIntervalRef.current = setInterval(() => {
          addLog("Checking and executing commands...");
        }, 10000);
      }, 1000);
    }
  };

  // Stop de scheduler en de interval
  const stopScheduler = () => {
    if (schedulerRunning && schedulerIntervalRef.current) {
      clearInterval(schedulerIntervalRef.current);
      schedulerIntervalRef.current = null;
      setSchedulerRunning(false);
      addLog("Scheduler is stopping...");
    }
  };

  // Simuleer het wisselen van de hoststatus
  const runUnsetLockDevice = () => {
    addLog("Toggling device host status...");
    setTimeout(() => {
      addLog("Device host status toggled.");
    }, 1000);
  };

  // Simuleer EQ Solving
  const startEQSolving = () => {
    addLog("Starting EQ Solving process...");
    setTimeout(() => {
      addLog("EQ Solving process completed.");
    }, 2000);
  };

  // Simuleer Polar Position
  const startPolarPosition = () => {
    addLog("Starting Polar Positioning...");
    setTimeout(() => {
      addLog("Polar Positioning completed.");
    }, 2000);
  };

  return (
    <Tabs>
      <Tab label="Main">
        {/* Main-tab */}
        <div className="section">
          <h2>Configuration</h2>
        </div>
        <div className="config-section">
          <label>
            <input
              type="checkbox"
              checked={isMultiple}
              onChange={(e) => setIsMultiple(e.target.checked)}
            />{" "}
            Multiple
          </label>
          {isMultiple && (
            <div className="config-controls">
              <label>Current Config:</label>
              <select value={currentConfig} onChange={handleConfigChange}>
                {configs.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label>New Config:</label>
              <input
                type="text"
                value={newConfig}
                onChange={(e) => setNewConfig(e.target.value)}
              />

              <button onClick={addConfig}>Add Config</button>
            </div>
          )}
        </div>
        <br />
        <div className="section">
          <h2>Bluetooth Connection</h2>
          <div className="button-group">
            <button onClick={startBluetooth}>Yes</button>
            <button onClick={skipBluetooth}>No</button>
          </div>
        </div>

        <div className="section">
          <h2>Scheduler</h2>
          <div className="button-group">
            <button
              onClick={startScheduler}
              disabled={!bluetoothConnected || schedulerRunning}
            >
              Start Scheduler
            </button>
            <button onClick={stopScheduler} disabled={!schedulerRunning}>
              Stop Scheduler
            </button>
            <button onClick={runUnsetLockDevice} disabled={!schedulerRunning}>
              Unset Device as Host
            </button>
            <button onClick={startEQSolving} disabled={!schedulerRunning}>
              EQ Solving
            </button>
            <button onClick={startPolarPosition} disabled={!schedulerRunning}>
              Polar Position
            </button>
          </div>
        </div>

        <div className="log-area">
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
          <div ref={logEndRef} />{" "}
          {/* Dit zorgt ervoor dat de laatste log altijd in beeld is */}
        </div>
      </Tab>
      <Tab label="Settings">
        <SettingsTabPage />
      </Tab>
      <Tab label="Session Overview">
        <OverviewSessionTab />
      </Tab>
      <Tab label="Results Session">
        <ResultSessionTab />
      </Tab>
      <Tab label="Create Session">
        <SessionForm />
      </Tab>
    </Tabs>
  );
};
// Eenvoudige Tabs–componenten
interface TabsProps {
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = React.Children.toArray(children) as React.ReactElement[];
  return (
    <div className="tabs">
      <div className="tab-labels">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={activeTab === idx ? "active" : ""}
            onClick={() => setActiveTab(idx)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeTab]}</div>
    </div>
  );
};

interface TabProps {
  label: string;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className="tab">{children}</div>;
};

export default App;
