const fs = require("fs");
const path = require("path");

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

// Copy tools to the deployment directory
const platform = process.platform; // 'win32', 'linux', 'darwin'
const tools = {
  win32: [
    { src: "./dist/DwarfiumProxy-x86_64-pc-windows-msvc.exe", dest: "DwarfiumProxy.exe" },
    { src: "./dist/mediamtx-x86_64-pc-windows-msvc.exe", dest: "mediamtx.exe" }
  ],
  linux: [
    { src: "./dist/DwarfiumProxy-x86_64-unknown-linux-gnu", dest: "DwarfiumProxy" },
    { src: "./dist/mediamtx-x86_64-unknown-linux-gnu", dest: "mediamtx" }
  ],
  darwin: [
    { src: "./dist/DwarfiumProxy-x86_64-apple-darwin", dest: "DwarfiumProxy" },
    { src: "./dist/mediamtx-x86_64-apple-darwin", dest: "mediamtx" }
  ]
}[platform] || [];

console.log("Copying tools...");
tools.forEach(({ src, dest }) => {
  const destPath = path.join(DEPLOY_DIR, dest);
  fs.copyFileSync(src, destPath);
  fs.chmodSync(destPath, 0o755); // Ensure executable permissions
});

// Copy configuration file
console.log("Copying configuration...");
const launcherScriptWindows = `
@echo off
rem Start MediaMTX minimized
start /Min mediamtx.exe mediamtx.yml

rem Start DwarfiumProxy minimized
start /Min DwarfiumProxy.exe

rem Check if Python is installed
where python >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python to run the HTTP server.
    pause
    exit /b
)

rem Start Python HTTP server minimized
start /Min python -m http.server 8000 --bind 127.0.0.1

echo All tools and server have been started.
pause
`;

const launcherScriptLinuxMac = `
#!/bin/bash

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
nohup python3 -m http.server 8000 --bind 0.0.0.0 > httpserver.log 2>&1 &

echo "All tools and server have been started."
`;

if (platform == "win32")
    fs.writeFileSync(path.join(DEPLOY_DIR, "launch-tools.bat"), launcherScriptWindows, { mode: 0o755 });
else
    fs.writeFileSync(path.join(DEPLOY_DIR, "launch-tools.sh"), launcherScriptLinuxMac, { mode: 0o755 });
