const os = require("os");
const fs = require("fs").promises;
const path = require("path");

const platform = os.platform(); // 'win32', 'linux', 'darwin'
const arch = os.arch(); // 'x64', 'arm64', 'arm'

const filesToCopy = {
  win32: [
    {
      source: "./install/windows/DwarfiumProxy.exe",
      destination: `./dist/DwarfiumProxy-x86_64-pc-windows-msvc.exe`
    },
    {
      source: "./install/windows/mediamtx.exe",
      destination: `./dist/mediamtx-x86_64-pc-windows-msvc.exe`
    }
  ],
  linux: [
    ...(arch === "x64"
      ? [
          {
            source: "./install/linux/DwarfiumProxy",
            destination: `./dist/DwarfiumProxy-x86_64-unknown-linux-gnu`
          },
          {
            source: "./install/linux/mediamtx",
            destination: `./dist/mediamtx-x86_64-unknown-linux-gnu`
          }
        ]
      : arch === "arm64"
      ? [
          {
            source: "./install/linux/DwarfiumProxy",
            destination: `./dist/DwarfiumProxy-aarch64-unknown-linux-gnu`
          },
          {
            source: "./install/linux/mediamtx",
            destination: `./dist/mediamtx-aarch64-unknown-linux-gnu`
          }
        ]
      : arch === "arm"
      ? [
          {
            source: "./install/linux/DwarfiumProxy",
            destination: `./dist/DwarfiumProxy-armv7-unknown-linux-gnueabihf`
          },
          {
            source: "./install/linux/mediamtx",
            destination: `./dist/mediamtx-armv7-unknown-linux-gnueabihf`
          }
        ]
      : [])
  ],
  darwin: [
    ...(arch === "x64"
      ? [
          {
            source: "./install/macos/DwarfiumProxy",
            destination: `./dist/DwarfiumProxy-x86_64-apple-darwin`
          },
          {
            source: "./install/macos/mediamtx",
            destination: `./dist/mediamtx-x86_64-apple-darwin`
          }
        ]
      : arch === "arm64"
      ? [
          {
            source: "./install/macos/DwarfiumProxy",
            destination: `./dist/DwarfiumProxy-aarch64-apple-darwin`
          },
          {
            source: "./install/macos/mediamtx",
            destination: `./dist/mediamtx-aarch64-apple-darwin`
          }
        ]
      : [])
  ]
};

// Check if platform and architecture are supported
const files = filesToCopy[platform];
if (!files || files.length === 0) {
  console.error(`Unsupported platform/architecture: ${platform}-${arch}`);
  process.exit(1);
}

// Function to copy files
async function copyFiles() {
  for (const { source, destination } of files) {
    try {
      console.log(`Copying ${source} to ${destination}`);
      await fs.copyFile(source, destination);
      console.log(`Successfully copied ${source} to ${destination}`);
    } catch (err) {
      console.error(`Failed to copy ${source} to ${destination}: ${err.message}`);
    }
  }
}

// Function to copy the config file
async function copyConfigFile() {
  const source = "./install/config/mediamtx.yml";
  const destination = "./dist/mediamtx.yml";

  try {
    console.log(`Copying ${source} to ${destination}`);
    await fs.copyFile(source, destination);
    console.log(`Successfully copied ${source} to ${destination}`);
  } catch (err) {
    console.error(`Failed to copy ${source} to ${destination}: ${err.message}`);
  }
}

// Start copying
copyFiles();

// Copy config file
copyConfigFile();