const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

const DIST_DIR = path.resolve("dist");
const DEPLOY_DIR = path.resolve("Dwarfium");

// Clean up any previous deployment directory
if (fs.existsSync(DEPLOY_DIR)) {
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}

// Copy application build to the deployment directory (cross-platform)
console.log("Copying application build...");
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

const copyFilesRecursively = (src, dest) => {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyFilesRecursively(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

copyFilesRecursively(DIST_DIR, DEPLOY_DIR);

// Function to create a directory inside DEPLOY_DIR
function createDir(baseDir, dirName) {
  const dirPath = path.join(baseDir, dirName);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // recursive: true allows nested directories
    console.log(`Directory created: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
}

createDir(DEPLOY_DIR, "extern")

// Copy tools to the deployment directory
const platform = process.platform; // 'win32', 'linux', 'darwin'
const tools = {
  win32: [
    { src: "./install/windows/stellarium_auto_config.exe", dest: "stellarium_auto_config.exe" },
    { src: "./src-tauri/bin/DwarfiumProxy-x86_64-pc-windows-msvc.exe", dest: "DwarfiumProxy.exe" },
    { src: "./src-tauri/bin/mediamtx-x86_64-pc-windows-msvc.exe", dest: "mediamtx.exe" },
    { src: "./install/config/mediamtx.yml", dest: "mediamtx.yml" },
    { src: "./install/start_dwarfium.py", dest: "start_dwarfium.py" },
    { src: "./install/windows/extern/extern.zip", dest: "./extern" },
    { src: "./install/extern/config.ini", dest: "./extern/config.ini" },
    { src: "./install/extern/config.py", dest: "./extern/config.py" }
  ],
  linux: [
    { src: "./install/linux/stellarium_auto_config", dest: "stellarium_auto_config" },
    { src: "./src-tauri/bin/DwarfiumProxy-x86_64-unknown-linux-gnu", dest: "DwarfiumProxy" },
    { src: "./src-tauri/bin/mediamtx-x86_64-unknown-linux-gnu", dest: "mediamtx" },
    { src: "./install/config/mediamtx.yml", dest: "mediamtx.yml" },
    { src: "./install/start_dwarfium.py", dest: "start_dwarfium.py" },
    { src: "./install/extern/config.ini", dest: "./extern/config.ini" },
    { src: "./install/extern/config.py", dest: "./extern/config.py" }
  ],
  darwin: [
    { src: "./src-tauri/bin/DwarfiumProxy-x86_64-apple-darwin", dest: "DwarfiumProxy" },
    { src: "./src-tauri/bin/mediamtx-x86_64-apple-darwin", dest: "mediamtx" },
    { src: "./install/config/mediamtx.yml", dest: "mediamtx.yml" },
    { src: "./install/start_dwarfium.py", dest: "start_dwarfium.py" },
    { src: "./install/extern/config.ini", dest: "./extern/config.ini" },
    { src: "./install/extern/config.py", dest: "./extern/config.py" }
  ]
}[platform] || [];

console.log("Copying tools...");
tools.forEach(({ src, dest }) => {
  const destPath = path.join(DEPLOY_DIR, dest);
  if (!fs.existsSync(src)) {
    console.log(`Source file {src} does not exist.`);
  }
  // Check if the file is a ZIP file
  else if (src.endsWith(".zip")) {
    // Unzip the file to the destination path
    fs.createReadStream(src)
      .pipe(unzipper.Extract({ path: destPath }))
      .on("close", () => {
        console.log(`Unzipped ${src} to ${destPath}`);
      });
  } else {  
    fs.copyFileSync(src, destPath);
    fs.chmodSync(destPath, 0o755); // Ensure executable permissions
    console.log('File copied successfully.');
  }
});

// Copy configuration file
console.log("Copying configuration...");
const launcherScriptWindows = `
@echo off
rem Start MediaMTX minimized
start "" /Min mediamtx.exe mediamtx.yml

rem Start DwarfiumProxy minimized
start "" /Min DwarfiumProxy.exe

rem Check if Python is installed
where python >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python to run the HTTP server.
    pause
    exit /b
)

rem Start Python HTTP server minimized
start "" /Min python start_dwarfium.py

echo All tools and server have been started.
pause
`;

const launcherScriptLinuxMac = `
#!/bin/bash

# Ensure script exits on error
set -e

# Start MediaMTX
nohup ./mediamtx mediamtx.yml > mediamtx.log 2>&1 &

# Start DwarfiumProxy
nohup ./DwarfiumProxy > DwarfiumProxy.log 2>&1 &

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python3 to run the HTTP server."
    exit 1
fi

# Start Python HTTP server
nohup python3 start_dwarfium.py > server.log 2>&1 &

echo "All tools and server have been started."
`;

if (platform == "win32")
    fs.writeFileSync(path.join(DEPLOY_DIR, "launch-server&tools.bat"), launcherScriptWindows, { mode: 0o755 });
else
    fs.writeFileSync(path.join(DEPLOY_DIR, "launch-server&tools.sh"), launcherScriptLinuxMac, { mode: 0o755 });
