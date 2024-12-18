const fs = require('fs');
const path = require('path');

// Path to the Tauri config file
const tauriConfigPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');

// Read the current package.json version
const packageJson = require('../package.json');
const version = packageJson.version;

// Validate SemVer compliance
const semverRegex = /^[0-9]+\.[0-9]+\.[0-9]+(-[a-z0-9]+(\.[a-z0-9]+)*)?$/i;
if (!semverRegex.test(version)) {
  console.error(`Error: Version "${version}" in package.json is not a valid SemVer string.`);
  process.exit(1);
}

// Read the Tauri config
const config = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));

// Update the version in the Tauri config
config.package.version = version;

// Write the updated config back
fs.writeFileSync(tauriConfigPath, JSON.stringify(config, null, 2));
console.log(`Tauri config updated with version: ${version}`);
