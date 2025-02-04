////////////////////////////////////////////////////////////////////////
// use same value as NEXT_PUBLIC_PORT_PROXY_CORS in env.production file
////////////////////////////////////////////////////////////////////////
const NEXT_PUBLIC_PORT_PROXY_CORS = 8860

import express from "express";
const WebSocket = require("ws");
const { WebSocketServer } = require("ws");
const http = require("http");
import fetch from "node-fetch";
import cors from "cors";

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

const app = express();

app.use(express.json());
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS" }));

// Handle preflight requests
app.options("*", (req, res) => {
    res.sendStatus(200);
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on("connection", (clientSocket, req) => {
    const targetUrl = new URL(req.url, `ws://${req.headers.host}`).searchParams.get("target");

    if (!targetUrl) {
        clientSocket.close(1008, "Missing target parameter");
        return;
    }

    console.log(`WebSocket proxying to target: ${targetUrl}`);

    const targetSocket = new WebSocket(targetUrl);

    clientSocket.on("message", (data) => {
        if (targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.send(data);
        }
    });

    targetSocket.on("message", (data) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(data);
        }
    });

    clientSocket.on("close", () => targetSocket.close());
    targetSocket.on("close", () => clientSocket.close());

    targetSocket.on("error", (err) => console.error("Target WebSocket error:", err));
    clientSocket.on("error", (err) => console.error("Client WebSocket error:", err));
});

// Upgrade HTTP to WebSocket
server.on("upgrade", (req, socket, head) => {
    if (req.headers["upgrade"] !== "websocket") {
        socket.destroy();
        return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
    });
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

        const contentType = response.headers.get("content-type");
        console.log(contentType);
        const isJSON = contentType?.includes("application/json");
        const isBinary = contentType?.includes("application/octet-stream") || response.body;
        const data = isJSON
            ? await response.json()
            : isBinary
            ? Buffer.from(await response.arrayBuffer()) // Convert ArrayBuffer to Buffer
            : await response.text();
        console.log(data);

        res.status(response.status);
        if (isBinary) {
            res. set("Content-Type", contentType);
            res.send(data);
        } else {
            res.send(data);
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

app.listen(NEXT_PUBLIC_PORT_PROXY_CORS, '0.0.0.0', () => {
    console.log(`Proxy server is running on http://localhost:${NEXT_PUBLIC_PORT_PROXY_CORS}`);
});

