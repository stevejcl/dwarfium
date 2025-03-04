////////////////////////////////////////////////////////////////////////
// use same value as NEXT_PUBLIC_PORT_PROXY_CORS in env.production file
// use same value as NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS in env.production file
////////////////////////////////////////////////////////////////////////
const NEXT_PUBLIC_PORT_PROXY_CORS = 8860;
const NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS = 9443;

import express from "express";
const WebSocket = require("ws");
const http = require("http");
const https = require("https");
import fetch from "node-fetch";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
const os = require("os");
import * as forge from "node-forge";

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

const certPath = path.join(".", "DwarfiumCert.pem");
const keyPath = path.join(".", "DwarfiumKey.pem");

function check_certificates() {
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.log(
      "🔒 SSL Certificates not found, use createSSLcert tool to generate and install them..."
    );
    return false;
  } else {
    console.log("🔑 SSL certificate already exists.");
    return {
      key: fs.readFileSync(keyPath, "utf-8"),
      cert: fs.readFileSync(certPath, "utf-8"),
    };
  }
}

const app = express();

app.use(express.json());
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS" }));

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

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on("connection", (clientSocket, req) => {
  const targetUrl = new URL(
    req.url,
    `ws://${req.headers.host}`
  ).searchParams.get("target");

  if (!targetUrl) {
    clientSocket.close(1008, "Missing target parameter");
    return;
  }

  console.log(`WebSocket proxying to target: ${targetUrl}`);

  const targetSocket = new WebSocket(targetUrl);

  clientSocket.on("message", (data) => {
    if (targetSocket.readyState === WebSocket.OPEN) {
      // Check if the received message is a ping
      if (data instanceof Buffer) {
        const message = data.toString();
        if (message === "ping") {
          // If it's a ping, resend it as text
          console.log("Received ping as binary, sending as text...");
          targetSocket.send("ping"); // Send ping back as text
        } else {
          // Otherwise, forward it as is
          console.log(
            "Forwarding message from client to target:",
            data.toString("hex")
          );
          targetSocket.send(data); // Forward data to client
        }
      }
    }
  });

  targetSocket.on("message", (data) => {
    if (clientSocket.readyState === WebSocket.OPEN) {
      if (data instanceof Buffer) {
        const message = data.toString();
        if (message === "pong") {
          // If it's a pong, resend it as text
          console.log("Received pong as binary, sending as text...");
          clientSocket.send("pong"); // Send pong back as text
        } else {
          // Otherwise, forward it as is
          console.log(
            "Forwarding message from target to client:",
            data.toString("hex")
          );
          clientSocket.send(data); // Forward data to client
        }
      }
    }
  });

  clientSocket.on("close", () => targetSocket.close());
  targetSocket.on("close", () => clientSocket.close());

  targetSocket.on("error", (err) => {
    console.error("Target WebSocket error:", err);
    clientSocket.close(1006, "Target WebSocket error");
  });
  clientSocket.on("error", (err) => {
    console.error("Client WebSocket error:", err);
  });
});

// Upgrade HTTP to WebSocket
httpServer.on("upgrade", (req, socket, head) => {
  if (req.headers["upgrade"] !== "websocket") {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
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
      wss.emit("connection", ws, req);
    });
  });
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Proxy is running" });
});

// Run EXE Health Route
app.get("/run-exe-health", async (req, res) => {
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

// Run EXE Route
app.get("/run-exe", async (req, res) => {
  try {
    const externPath = path.resolve("./extern"); // Adjust path if needed
    const exeName = "connect_bluetooth";
    const exePath =
      process.platform === "win32"
        ? path.join(externPath, exeName + ".exe")
        : path.join(externPath, exeName);

    // Extract query parameters
    const ble_psd = req.query.ble_psd || "DWARF_12345678";
    const ble_STA_ssid = req.query.ble_STA_ssid || "";
    const ble_STA_pwd = req.query.ble_STA_pwd || "";

    // Ensure the executable exists
    if (!fs.existsSync(exePath)) {
      return res.status(404).json({ error: "Executable not found" });
    }

    // Run the executable with parameters
    const childProcess = spawn(
      `"${exePath}"`,
      ["--psd", ble_psd, "--ssid", ble_STA_ssid, "--pwd", ble_STA_pwd],
      {
        cwd: externPath,
        shell: true,
      }
    );

    let stdoutData = "";
    let stderrData = "";

    childProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    childProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    childProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: `Process failed: ${stderrData}` });
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
        output: stdoutData.trim(),
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

// Proxy route
app.all("*", async (req, res) => {
  try {
    console.log("Proxy is running");
    const { target } = req.query;
    console.log("target: ", target);
    if (!target) {
      return res.status(400).json({ error: "Target URL is required" });
    }

    // Extract the last target from the query string if it's recursive
    const lastTarget = new URL(target).searchParams.get("target") || target;
    console.log("target: ", lastTarget);

    // Prepare headers, removing problematic ones
    const filteredHeaders = Object.fromEntries(
      Object.entries(req.headers).filter(
        ([key]) => !["host", "transfer-encoding"].includes(key.toLowerCase())
      )
    );

    // Ensure headers only contain strings (this prevents TypeScript errors)
    const sanitizedHeaders: { [key: string]: string } = Object.fromEntries(
      Object.entries(filteredHeaders).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(",") : String(value), // Ensure value is a string
      ])
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
      sanitizedHeaders["Content-Type"] = "application/json";
    }

    interface FetchOptions {
      method: string;
      headers: { [key: string]: string };
      body?: string;
      signal?: AbortSignal; // Ensure signal is part of the type
    }

    const fetchOptions: FetchOptions = {
      signal: req.signal ?? AbortSignal.timeout(90000),
      method: req.method ?? "GET", // Fallback to "GET" if req.method is undefined
      headers: sanitizedHeaders,
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

    if (contentType) {
      res.setHeader("Content-Type", contentType.split(";")[0].trim());
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }

    if (
      contentType?.includes("image") ||
      contentType?.includes("octet-stream")
    ) {
      const buffer = Buffer.from(await response.arrayBuffer()); // ? Convert response to Buffer
      return res.status(response.status).send(buffer); // ? Send binary data
    } else {
      // Check if it contains JSON
      const isJSON = contentType?.includes("application/json");

      const data = isJSON ? await response.json() : await response.text();
      //console.log(data);

      res.status(response.status).send(data);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    const err = error as Error; // Cast error to Error
    res.status(500).json({
      error: "Proxy request failed",
      details: err.message || "An unknown error occurred",
    });
  }
});

httpServer.listen(NEXT_PUBLIC_PORT_PROXY_CORS, "0.0.0.0", () => {
  console.log(
    `Proxy server is running on http://localhost:${NEXT_PUBLIC_PORT_PROXY_CORS}`
  );
});

if (httpsServer) {
  httpsServer.listen(NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS, "0.0.0.0", () => {
    console.log(
      `HTTPS Proxy server is running on https://localhost:${NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS}`
    );
  });
}
