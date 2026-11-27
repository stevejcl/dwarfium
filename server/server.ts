////////////////////////////////////////////////////////////////////////
// use same value as NEXT_PUBLIC_PORT_PROXY_CORS in env.production file
// use same value as NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS in env.production file
////////////////////////////////////////////////////////////////////////
const NEXT_PUBLIC_PORT_PROXY_CORS = Number(
  process.env.DWARFIUM_PROXY_PORT ?? 8860,
);
const NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS = Number(
  process.env.DWARFIUM_PROXY_HTTPS_PORT ?? 9443,
);
const USE_CLIENT_CERTIFICATE = false; // if need set USE_CLIENT_CERTIFICATE to true

import express from "express";
const WebSocket = require("ws");
const http = require("http");
const https = require("https");
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { Agent, fetch, type RequestInit } from "undici";
import {
  buildBleCommandArguments,
  getBleDeviceNames,
  parseBleHelperOutput,
} from "./ble-helper";
const os = require("os");

// Function to check if body is a valid JSON string
function isJSONString(body) {
  if (typeof body !== "string") {
    return false;
  }
  try {
    JSON.parse(body);
    return true;
  } catch (e) {
    return false;
  }
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

function check_certificates() {
  const basePath = "."; // Current directory
  const caPath = path.join(basePath, "CADwarfiumCert.pem"); // Your Root CA

  // Match the standalone web server's supported certificate names. Older
  // installations use the Server-prefixed pair, and must start HTTPS on both
  // ports or browsers will block camera/proxy requests as mixed content.
  const pair = [
    ["DwarfiumCert.pem", "DwarfiumKey.pem"],
    ["DwarfiumServerCert.pem", "DwarfiumServerKey.pem"],
  ].find(
    ([cert, key]) =>
      fs.existsSync(path.join(basePath, cert)) &&
      fs.existsSync(path.join(basePath, key)),
  );

  if (pair) {
    const certPath = path.join(basePath, pair[0]);
    const keyPath = path.join(basePath, pair[1]);
    console.log(`✅ Using certificate: ${certPath}`);
    return {
      key: fs.readFileSync(keyPath, "utf-8"),
      cert: fs.readFileSync(certPath, "utf-8"),
      requestCert: USE_CLIENT_CERTIFICATE,
      rejectUnauthorized: USE_CLIENT_CERTIFICATE,
      ca: fs.existsSync(caPath) ? fs.readFileSync(caPath, "utf-8") : undefined,
    };
  }

  console.warn(
    "🔒 SSL Certificates not found, use createSSLcert tool to generate and install them...",
  );
  return false;
}

const app = express();

app.use(express.json());
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS" }));

if (USE_CLIENT_CERTIFICATE) {
  // Middleware to check if a client certificate was provided
  app.use((req, res, next) => {
    const cert = req.socket.getPeerCertificate();
    if (!req.client.authorized) {
      return res
        .status(401)
        .send("Unauthorized: Invalid or missing certificate");
    }
    console.log(`Client connected: ${cert.subject.CN}`);
    next();
  });
}

// Handle preflight requests
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// Create HTTP server
const httpServer = http.createServer(app);

const httpsOptions = check_certificates();

// Create HTTPS server if certificates are presents
const httpsServer = httpsOptions
  ? https.createServer(httpsOptions, app)
  : false;

const httpsDispatcher = httpsOptions
  ? new Agent({
      connect: {
        ca: httpsOptions.ca,
        rejectUnauthorized: false,
      },
    })
  : undefined;

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on("connection", (clientSocket, req) => {
  try {
    const urlParams = new URL(req.url, `ws://${req.headers.host}`).searchParams;
    const targetUrl = urlParams.get("target");
    const authToken = urlParams.get("token");

    if (!targetUrl) {
      clientSocket.close(3008, "Missing target parameter");
      return;
    }

    console.log(`WebSocket proxying to target: ${targetUrl}`);

    const targetSocket = new WebSocket(targetUrl, { handshakeTimeout: 10000 });
    const pendingFrames: { data: Buffer; binary: boolean }[] = [];
    let pendingBytes = 0;

    targetSocket.on("open", () => {
      if (clientSocket.readyState !== WebSocket.OPEN) {
        targetSocket.close();
        return;
      }

      // If a token is provided, send it to the target server
      if (authToken) {
        targetSocket.send(authToken);
      }
      for (const frame of pendingFrames)
        targetSocket.send(frame.data, { binary: frame.binary });
      pendingFrames.length = 0;
      pendingBytes = 0;
    });

    clientSocket.on("message", (data: Buffer, isBinary: boolean) => {
      if (targetSocket.readyState === WebSocket.OPEN) {
        targetSocket.send(data, { binary: isBinary });
      } else if (targetSocket.readyState === WebSocket.CONNECTING) {
        // The browser is already open while the telescope handshake is pending.
        // Retain the initial status request in order, with a bounded queue.
        if (
          pendingFrames.length >= 64 ||
          pendingBytes + data.length > 1024 * 1024
        ) {
          pendingFrames.length = 0;
          pendingBytes = 0;
          clientSocket.close(1013, "Upstream queue limit reached");
          targetSocket.terminate();
          return;
        }
        pendingFrames.push({ data, binary: isBinary });
        pendingBytes += data.length;
      }
    });

    targetSocket.on("message", (data: Buffer, isBinary: boolean) => {
      if (clientSocket.readyState === WebSocket.OPEN)
        clientSocket.send(data, { binary: isBinary });
    });

    clientSocket.on("close", () => {
      pendingFrames.length = 0;
      pendingBytes = 0;
      try {
        if (targetSocket.readyState === WebSocket.CONNECTING)
          targetSocket.terminate();
        else targetSocket.close(1000, "Normal closure");
      } catch (error: any) {
        console.error("Proxy WebSocket Close error:", error);
      }
    });

    targetSocket.on("close", () => {
      try {
        clientSocket.close(1000, "Normal closure");
      } catch (error: any) {
        console.error("Proxy WebSocket Close error:", error);
      }
    });

    targetSocket.on("error", (err) => {
      try {
        console.error("Target WebSocket error:", err);
        clientSocket.close(3000, "Target WebSocket error");
      } catch (error: any) {
        console.error("Proxy WebSocket error:", error);
      }
    });
    clientSocket.on("error", (err) => {
      try {
        console.error("Client WebSocket error:", err);
        clientSocket.close(3000, "Client WebSocket error");
      } catch (error: any) {
        console.error("Proxy WebSocket error:", error);
      }
    });
  } catch (error: any) {
    console.error("Proxy WebSocket error:", error);
  }
});

// Upgrade HTTP to WebSocket
httpServer.on("upgrade", (req, socket, head) => {
  if (req.headers["upgrade"] !== "websocket") {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    try {
      wss.emit("connection", ws, req);
    } catch (error: any) {
      console.error("Proxy Upgrade http error:", error);
      const err = error as Error; // Cast error to Error
      console.error(
        "Client WebSocket details:",
        err.message || "An unknown error occurred",
      );
    }
  });
});

if (httpsServer) {
  // Upgrade HTTPS to WebSocket
  httpsServer.on("upgrade", (req, socket, head) => {
    if (req.headers["upgrade"] !== "websocket") {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      try {
        wss.emit("connection", ws, req);
      } catch (error: any) {
        console.error("Proxy Upgrade https error:", error);
        const err = error as Error; // Cast error to Error
        console.error(
          "Client WebSocket details:",
          err.message || "An unknown error occurred",
        );
      }
    });
  });
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Proxy is running" });
});

// Run BLE Health Route
app.get("/run-ble-health", async (req, res) => {
  const externPath = path.resolve("./extern"); // Adjust path if needed
  const exeName = "connect_bluetooth";
  const exePath =
    process.platform === "win32"
      ? path.join(externPath, exeName + ".exe")
      : path.join(externPath, exeName);

  // Ensure the executable exists
  if (!fs.existsSync(exePath)) {
    return res.status(404).json({ error: "Executable not found" });
  } else {
    return res.status(200).json({ status: "Executable found" });
  }
});

// Run BLE Route
app.post("/run-ble", async (req, res) => {
  try {
    let clientIp = req.ip.replace(/^::ffff:/, ""); // Normalize IPv6-mapped IPv4 addresses
    if (clientIp === "::1") clientIp = "127.0.0.1";
    console.log(`Received request from IP: ${clientIp}`);
    const externPath = path.resolve("./extern"); // Adjust path if needed
    const exeName = "connect_bluetooth";
    const exePath =
      process.platform === "win32"
        ? path.join(externPath, exeName + ".exe")
        : path.join(externPath, exeName);

    // Extract parameters from the request body
    const {
      ble_psd = "DWARF_12345678",
      ble_STA_ssid = "",
      ble_STA_pwd = "",
      auto_select = "0",
    } = req.body;

    // Ensure the executable exists
    if (!fs.existsSync(exePath)) {
      return res.status(404).json({ error: "Executable not found" });
    }

    // This HTTP route is always non-interactive. Local requests must use the
    // same command mode as remote requests; otherwise the hidden packaged
    // helper waits for its desktop UI and the browser appears to do nothing.
    const command_line = buildBleCommandArguments({
      blePassword: ble_psd,
      wifiSsid: ble_STA_ssid,
      wifiPassword: ble_STA_pwd,
      selectedDevice: auto_select,
    });

    // Run the executable with parameters
    const childProcess = spawn(exePath, command_line, {
      cwd: externPath,
      shell: false,
      windowsHide: true,
    });

    let stdoutData = "";
    let stderrData = "";
    let responseSent = false;

    childProcess.on("error", (error) => {
      if (responseSent) return;
      responseSent = true;
      res
        .status(500)
        .json({ error: `Bluetooth helper failed to start: ${error.message}` });
    });

    childProcess.stdout.on("data", (data) => {
      stdoutData += data.toString().trim();
      console.log("Received:", stdoutData);
    });

    childProcess.stderr.on("data", (data) => {
      const text = data.toString().trim();
      console.info("Info:", text);
      stderrData += `${text}\n`;
    });

    childProcess.on("close", async (code) => {
      if (responseSent) return;
      responseSent = true;
      if (code !== 0) {
        return res.status(500).json({ error: `Process failed: ${stderrData}` });
      }

      const jsonResult = parseBleHelperOutput(stderrData);
      console.log("Final jsonResult:", JSON.stringify(jsonResult, null, 2));

      if (jsonResult) {
        if (
          jsonResult?.step === "1" &&
          (jsonResult.dwarf_devices ?? []).length === 0
        ) {
          return res
            .status(204)
            .json({ message: "No devices found", action: "restart_scan" });
        }
        if (
          jsonResult?.step === "3" &&
          Array.isArray(jsonResult.dwarf_devices) &&
          jsonResult.dwarf_devices.length > 1
        ) {
          const deviceNames = getBleDeviceNames(jsonResult.dwarf_devices);
          return res.status(202).json({
            message: "Multiple devices found, user selection needed",
            devices: deviceNames,
          });
        }
        if (jsonResult?.step === "4") {
          if (jsonResult.is_connected) {
            return res.status(200).json({
              dwarfIp: jsonResult.ip_address,
              dwarfId: jsonResult.device_dwarf_id,
              details: jsonResult,
            });
          } else {
            return res.status(401).json({
              dwarfIp: jsonResult.ip_address,
              dwarfId: jsonResult.device_dwarf_id,
              details: jsonResult,
            });
          }
        }
        return res.status(500).json({
          error: "Unexpected error, retrying...",
          details: jsonResult,
        });
      }

      // Read DWARF_IP from config.py (Simple Read Instead of Execution)
      const configPath = path.join(externPath, "config.py");
      if (!fs.existsSync(configPath)) {
        return res.status(404).json({ error: "config.py not found" });
      }

      // Extract DWARF_IP and DWARF_ID manually (Assuming `config.py` follows `KEY = VALUE` format)
      const configContent = fs.readFileSync(configPath, "utf8");
      const dwarfIpMatch = configContent.match(/DWARF_IP\s*=\s*["'](.+?)["']/);
      const dwarfIdMatch = configContent.match(/DWARF_ID\s*=\s*["'](.+?)["']/);

      return res.status(200).json({
        dwarfIp: dwarfIpMatch ? dwarfIpMatch[1] : "",
        dwarfId: dwarfIdMatch ? dwarfIdMatch[1] : "",
        details: stderrData.trim(),
      });
    });
  } catch (error) {
    console.error("Error executing EXE:", error);
    const err = error as Error;
    res.status(500).json({ error: err.message || "An unknown error occurred" });
  }
});

// Run Stellarium config Health Route
app.get("/stellarium-config-health", async (req, res) => {
  const INSTALL_DIR = path.resolve(".");
  const EXE_NAME = "stellarium_auto_config";
  const EXE_FULL_NAME =
    process.platform === "win32" ? `${EXE_NAME}.exe` : `${EXE_NAME}`;

  const exePath = path.join(INSTALL_DIR, EXE_FULL_NAME);

  if (fs.existsSync(exePath)) {
    const urlExe = "/stellarium-config-exe";
    return res.status(200).json({ status: "Executable found", data: urlExe });
  }

  return res.status(404).json({ error: "Executable not found" });
});

// Run Stellarium config Exe Route
app.get("/stellarium-config-exe", async (req, res) => {
  const INSTALL_DIR = path.resolve(".");
  const EXE_NAME = "stellarium_auto_config";
  const EXE_FULL_NAME =
    process.platform === "win32" ? `${EXE_NAME}.exe` : `${EXE_NAME}`;

  const exePath = path.join(INSTALL_DIR, EXE_FULL_NAME);

  if (!fs.existsSync(exePath)) {
    return res.status(404).json({ error: "Executable not found" });
  }

  try {
    const childProcess = spawn(`"${exePath}"`, [], {
      cwd: INSTALL_DIR,
      shell: process.platform !== "win32",
    });

    let stdoutData = "",
      stderrData = "";

    childProcess.stdout.on("data", (data: Buffer) => {
      stdoutData += data.toString();
    });

    childProcess.stderr.on("data", (data: Buffer) => {
      stderrData += data.toString();
    });

    childProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Process exited successfully:", stdoutData);
        return res
          .status(200)
          .json({ message: "Process completed", output: stdoutData });
      } else {
        console.error("Process exited with error:", stderrData);
        return res
          .status(500)
          .json({ error: "Process failed", details: stderrData });
      }
    });

    childProcess.on("error", (err) => {
      console.error("Error starting the executable:", err);
      res.status(500).json({ error: "Executable failed to start" });
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/getLocalIP", async (req, res) => {
  res.status(200).json({ ips: getLocalIPAddress() });
});

app.use((req, res, next) => {
  console.debug(`📥 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy route
app.all("*", async (req, res) => {
  const controller = new AbortController();
  const disconnect = () => controller.abort();
  res.once("close", disconnect);
  const timeout = 90000; // 90 seconds timeout

  // Set up the timeout manually
  const timeoutSignal = setTimeout(() => {
    controller.abort(); // Abort the request after timeout
  }, timeout);

  try {
    console.log("Proxy is running");
    const { target } = req.query;
    console.log("target: ", target);
    console.log("originalUrl: ", req.originalUrl);
    if (!target) {
      // Log the full query object to see all parameters
      console.log("Request error:", req.originalUrl);
      return res.status(400).json({ error: "Target URL is required" });
    }

    // Extract the last target from the query string if it's recursive
    const lastTarget = new URL(target).searchParams.get("target") || target;
    console.log("target: ", lastTarget);
    const urlLastTarget = new URL(target);
    console.log("target port: ", urlLastTarget.port);
    const dispatcher =
      urlLastTarget.protocol === "https:" ? httpsDispatcher : undefined;

    // Prepare headers, removing problematic ones
    const filteredHeaders = Object.fromEntries(
      Object.entries(req.headers).filter(
        ([key]) =>
          ![
            "host",
            "connection",
            "content-length",
            "content-type",
            "transfer-encoding",
          ].includes(key.toLowerCase()),
      ),
    );

    // Ensure headers only contain strings (this prevents TypeScript errors)
    const sanitizedHeaders: { [key: string]: string } = Object.fromEntries(
      Object.entries(filteredHeaders).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(",") : String(value), // Ensure value is a string
      ]),
    );

    // Validate if the body is valid for the method
    const isBodyValid =
      ["PUT", "DELETE", "PATCH"].includes(req.method || "") ||
      (req.method === "POST" &&
        req.body && // Ensure `req.body` exists
        typeof req.body === "object" && // Check it's an object
        Object.keys(req.body).length > 0); // Confirm it's not empty

    // Only include body if valid
    if (isBodyValid) {
      // Ensure proper content type
      sanitizedHeaders["content-type"] = "application/json";
    }

    const fetchOptions: RequestInit = {
      // The outbound request owns its timeout. An incoming request's signal can
      // be cancelled as soon as its body finishes in packaged Node runtimes.
      // That must not abort the independent request to the telescope.
      signal: controller.signal,
      method: req.method ?? "GET", // Fallback to "GET" if req.method is undefined
      headers: sanitizedHeaders,
      ...(dispatcher ? { dispatcher } : {}),
    };
    console.log(fetchOptions.signal);
    console.log(fetchOptions);

    // Include the body only if valid
    if (isBodyValid) {
      const finalBody = isJSONString(req.body)
        ? req.body
        : JSON.stringify(req.body);
      fetchOptions.body = finalBody;
    }
    const response = await fetch(lastTarget, fetchOptions);
    console.log(response);

    let contentType = response.headers.get("content-type");
    console.log(contentType);

    if (typeof contentType === "string" && contentType.includes("multipart")) {
      // Cancel the timeout signal for multipart
      clearTimeout(timeoutSignal);
      res.setHeader("Content-Type", contentType);
    } else if (contentType) {
      res.setHeader("Content-Type", contentType.split(";")[0].trim());
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }

    // Handle multipart streaming (if applicable)
    if (typeof contentType === "string" && contentType.includes("multipart")) {
      if (response.body) {
        res.status(response.status);
        res.setHeader("Cache-Control", "no-store");
        await pipeline(
          Readable.from(response.body as unknown as AsyncIterable<Uint8Array>),
          res,
        );
        return;
      } else {
        // Handle the case where response.body is null or undefined
        return res
          .status(500)
          .send("Error: Multipart response body is missing.");
      }
    } else if (
      contentType?.includes("image") ||
      contentType?.includes("octet-stream")
    ) {
      const buffer = Buffer.from(await response.arrayBuffer()); // ? Convert response to Buffer
      return res.status(response.status).send(buffer); // ? Send binary data
    } else {
      // Firmware JSON contains uint64 parameter IDs. Parsing and serializing
      // here rounds them before the client can decode them losslessly.
      res.status(response.status).send(await response.text());
    }
  } catch (error: any) {
    if (res.destroyed) return;
    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "Error: Proxy request timed out",
        details: "Timeout error occurred",
      });
    }
    console.error("Proxy error:", error);
    const code = error?.cause?.code ?? error?.code;
    if (code === "EHOSTUNREACH" || code === "ENETUNREACH") {
      return res.status(502).json({
        error: "Proxy upstream network unreachable",
        code,
        platform: process.platform,
      });
    }
    const err = error as Error; // Cast error to Error
    return res.status(500).json({
      error: "Proxy request failed",
      details: err.message || "An unknown error occurred",
    });
  } finally {
    res.off("close", disconnect);
    clearTimeout(timeoutSignal);
  }
});

httpServer.listen(NEXT_PUBLIC_PORT_PROXY_CORS, "0.0.0.0", () => {
  console.log(
    `Proxy server is running on http://localhost:${NEXT_PUBLIC_PORT_PROXY_CORS}`,
  );
});

if (httpsServer) {
  httpsServer.listen(NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS, "0.0.0.0", () => {
    console.log(
      `HTTPS Proxy server is running on https://localhost:${NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS}`,
    );
  });
}
