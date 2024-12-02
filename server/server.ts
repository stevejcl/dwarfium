import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.NEXT_PUBLIC_PORT_PROXY_CORS || "8001";

app.use(express.json());
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS" }));

// Handle preflight requests
app.options("*", (req, res) => {
    res.sendStatus(200);
});

// Proxy route
app.all("*", async (req, res) => {
    try {
        console.log("Proxy is running");
        const { target } = req.query;
        if (!target) {
            return res.status(400).json({ error: "Target URL is required" });
        }
        console.log(target);

        // Filter and sanitize headers
        const sanitizedHeaders = Object.fromEntries(
            Object.entries(req.headers).filter(
                ([key]) => !["host", "transfer-encoding"].includes(key.toLowerCase())
            ).map(([key, value]) => [
                key,
                Array.isArray(value) ? value.join(",") : value ?? "",
            ])
        );

        const hasBody = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.body;
        const fetchOptions = {
            method: req.method,
            headers: sanitizedHeaders,
            body: hasBody ? JSON.stringify(req.body) : undefined,
        };

        const response = await fetch(target, fetchOptions);


        const contentType = response.headers.get("content-type");
        const isJSON = contentType?.includes("application/json");
        const isBinary = contentType?.includes("application/octet-stream") || response.body;
        const data = isJSON
            ? await response.json()
            : isBinary
            ? Buffer.from(await response.arrayBuffer()) // Convert ArrayBuffer to Buffer
            : await response.text();

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

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});

