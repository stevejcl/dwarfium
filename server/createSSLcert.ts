////////////////////////////////////////////////////////////////////////////
// Create Self SIGNED SSL certificates to use with Dwarfium Server and Proxy
////////////////////////////////////////////////////////////////////////////

import { exec } from "child_process";
import * as https from "https";
const fs = require("fs");
const path = require("path");
const os = require("os");
import * as forge from "node-forge";

const INSTALL_DIR = process.argv[2] || "./";

if (!fs.existsSync(INSTALL_DIR)) {
  fs.mkdirSync(INSTALL_DIR, { recursive: true });
}

function getLocalIPAddress(): string[] {
  const interfaces = os.networkInterfaces();
  let localIPs: string[] = [];

  for (const key in interfaces) {
    const iface = interfaces[key];

    if (Array.isArray(iface)) {
      for (const entry of iface) {
        if (entry.family === "IPv4" && !entry.internal) {
          localIPs.push(entry.address);
        }
      }
    }
  }

  // Sort the IPs: 192.x.x.x first, others next, 127.0.0.1 last
  localIPs = localIPs.sort((a, b) => {
    if (a.startsWith("192.") && !b.startsWith("192.")) return -1; // 192.x first
    if (!a.startsWith("192.") && b.startsWith("192.")) return 1;
    if (a === "127.0.0.1") return 1; // 127.0.0.1 always last
    if (b === "127.0.0.1") return -1;
    return a.localeCompare(b); // Otherwise, sort numerically
  });

  return localIPs;
}

// Get External IPv4 Address
async function getExternalIPv4(): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get("https://api.ipify.org/?format=json", (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data).ip);
          } catch (error) {
            reject("Error parsing external IP response");
          }
        });
      })
      .on("error", (err) => {
        reject("Error fetching external IP: " + err.message);
      });
  });
}

const certPath = path.join(INSTALL_DIR, "DwarfiumCert.pem");
const keyPath = path.join(INSTALL_DIR, "DwarfiumKey.pem");

console.log(
  "Create Self SIGNED SSL certificates to use with Dwarfium Server and Proxy"
);

async function ensureSSLCertificates(): Promise<{ key: string; cert: string }> {
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.log("🔒 Generating SSL certificate with node-forge...");
    // Create RSA keys using node-forge
    const pki = forge.pki;
    const keys = pki.rsa.generateKeyPair(4096);
    const cert = pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01";

    const validityDays = 365;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * (validityDays ?? 1)
    );

    // Set subject and issuer (self-signed)
    const attrs = [{ name: "commonName", value: "Dwarfium" }];
    console.log("Certificate attributes:", attrs);

    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    // Fetch all IPs
    const localIPs = getLocalIPAddress();
    const externalIP = await getExternalIPv4();
    const allIPs = [...localIPs, externalIP].filter(Boolean);

    console.log("All IPs:", allIPs);

    const altNames = [
      { type: 2, value: "localhost" }, // DNS name
      { type: 7, ip: "127.0.0.1" }, // Localhost IP
      ...allIPs.map((ip) => ({ type: 7, ip })), // Other IPs
    ];

    console.log("altNames:", altNames);
    const extensions = [
      {
        name: "subjectAltName",
        altNames: altNames,
      },
    ];
    console.log("Extensions:", extensions);

    cert.setExtensions(extensions);
    console.log("setExtensions");

    // Check certificate before signing
    console.log("Certificate before signing:", cert);

    // Sign the certificate with the private key
    cert.sign(keys.privateKey);

    console.log("Certificate after signing:", cert);

    // Check the private key and certificate before converting to PEM
    console.log("Private Key:", keys.privateKey);
    console.log("Certificate PEM before writing:", pki.certificateToPem(cert));

    // PEM encode the certificate and private key
    const pemCert = pki.certificateToPem(cert);
    console.log("certificateToPem:");
    const pemKey = pki.privateKeyToPem(keys.privateKey);
    console.log("privateKeyToPem");

    // Save the generated certificate and key
    fs.writeFileSync(certPath, pemCert);
    fs.writeFileSync(keyPath, pemKey);

    console.log("✅ Certificate generated with node-forge!");

    return {
      key: pemKey,
      cert: pemCert,
    };
  } else {
    console.log("🔑 SSL certificate already exists.");
    return {
      key: fs.readFileSync(keyPath, "utf-8"),
      cert: fs.readFileSync(certPath, "utf-8"),
    };
  }
}

// Create The certicats if SSL certificates exist
ensureSSLCertificates()
  .then((httpsOptions) => {
    console.log("SSL Certificates loaded successfully:", httpsOptions);

    // Installation Procedure
    console.log("Creating Installation Procedure Script...");
    const launcherScriptWindows = `
        @echo on

        powershell -Command "& { Get-ChildItem -Path Cert:\\CurrentUser\\Root\\ | Where-Object {$_.Subject -like '*Dwarfium*'} | ForEach-Object { Remove-Item -Path $_.PSPath -Force }}"
        powershell -Command "& Import-Certificate -FilePath 'DwarfiumCert.pem' -CertStoreLocation Cert:\\CurrentUser\\Root"
        echo Dwarfium Certicates has been Installed, You need to restart your browser, to take effect.
        pause

        echo Dwarfium Certicates has been Installed, You need to restart your browser, to take effect.
        pause
    `;

    const launcherScriptLinuxMac = `
        #!/bin/bash

        # Ensure script exits on error
        set -e

        CERT_PATH="./DwarfiumCert.pem"

        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo cp "$CERT_PATH" /usr/local/share/ca-certificates/
            sudo update-ca-certificates
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "$CERT_PATH"
        
        fi

        echo Dwarfium Certicates has been Installed, You need to restart your browser, to take effect.
    `;

    const platform = process.platform;
    let scriptPath;

    if (platform == "win32") {
      scriptPath = path.join(INSTALL_DIR, "install_SSL_certificates.bat");
      fs.writeFileSync(
        path.join(INSTALL_DIR, "install_SSL_certificates.bat"),
        launcherScriptWindows,
        { mode: 0o755 }
      );
    } else {
      scriptPath = path.join(INSTALL_DIR, "install_SSL_certificates.sh");
      fs.writeFileSync(
        path.join(INSTALL_DIR, "install_SSL_certificates.sh"),
        launcherScriptLinuxMac,
        { mode: 0o755 }
      );
    }

    console.log("The install script has been created");

    console.log("Starting the install script...");

    if (platform === "win32") {
      exec(`start /D "${INSTALL_DIR}" install_SSL_certificates.bat`);
    } else {
      exec(`chmod +x "${scriptPath}" && bash "${scriptPath}"`);
    }
  })
  .catch((error) => {
    console.error("Error loading SSL Certificates:", error);
  });
