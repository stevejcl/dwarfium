const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

const DIST_DIR = path.resolve("dist");
const DEPLOY_DIR = path.resolve("DwarfiumServer");

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

// Copy tools to the deployment directory
const platform = process.platform; // 'win32', 'linux', 'darwin'
const tools = {
  win32: [
    { src: "./install/start_dwarfium.py", dest: "start_dwarfium.py" },
  ],
  linux: [
    { src: "./install/start_dwarfium.py", dest: "start_dwarfium.py" },
  ],
  darwin: [
    { src: "./install/start_dwarfium.py", dest: "start_dwarfium.py" },
  ]
}[platform] || [];

console.log("Copying tools...");
tools.forEach(({ src, dest }) => {
  const destPath = path.join(DEPLOY_DIR, dest);
  // Check if the file is a ZIP file
  if (src.endsWith(".zip")) {
    // Unzip the file to the destination path
    fs.createReadStream(src)
      .pipe(unzipper.Extract({ path: destPath }))
      .on("close", () => {
        console.log(`Unzipped ${src} to ${destPath}`);
      });
  } else {  
    fs.copyFileSync(src, destPath);
    fs.chmodSync(destPath, 0o755); // Ensure executable permissions
  }
});

// Copy configuration file
console.log("Copying configuration...");
const launcherScriptWindows = `
@echo off

rem Check if Python is installed
where python >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python to run the HTTP server.
    pause
    exit /b
)

rem Start Python HTTP server minimized
start "" /Min python start_dwarfium.py

echo Dwarfium Server has been started.
pause
`;

const launcherScriptLinuxMac = `
#!/bin/bash

# Ensure script exits on error
set -e

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python3 to run the HTTP server."
    exit 1
fi

# Start Python HTTP server
nohup python3 start_dwarfium.py > server.log 2>&1 &

echo "Dwarfium Server have been started."
`;

if (platform == "win32")
    fs.writeFileSync(path.join(DEPLOY_DIR, "launch-server.bat"), launcherScriptWindows, { mode: 0o755 });
else
    fs.writeFileSync(path.join(DEPLOY_DIR, "launch-server.sh"), launcherScriptLinuxMac, { mode: 0o755 });
