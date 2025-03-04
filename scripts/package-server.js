const { execSync } = require("child_process");
const os = require("os");

const platform = os.platform(); // 'win32', 'linux', 'darwin'
const arch = os.arch(); // 'x64', 'arm64'

const targets = {
  win32: "node16-win-x64",
  linux: "node16-linux-x64",
  darwin: "node16-macos-x64"
};

const outputPaths = {
  win32: "./install/windows/DwarfiumProxy.exe",
  linux: "./install/linux/DwarfiumProxy",
  darwin: "./install/macos/DwarfiumProxy"
};

const outputPathsCert = {
  win32: "./install/windows/createSSLcert.exe",
  linux: "./install/linux/createSSLcert",
  darwin: "./install/macos/createSSLcert"
};

const target = targets[platform];
const outputPath = outputPaths[platform];
const outputPathCert = outputPathsCert[platform];

if (!target || !outputPath) {
  console.error(`Unsupported platform: ${platform}`);
  process.exit(1);
}

console.log(`Building Proxy server for ${platform}-${arch}`);
execSync(`pkg server/server.js --targets ${target} -o ${outputPath}`, { stdio: "inherit" });
execSync(`pkg server/createSSLcert.js --targets ${target} -o ${outputPathCert}`, { stdio: "inherit" });
