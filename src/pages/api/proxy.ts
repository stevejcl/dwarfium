import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

// Type for the response from the proxy
type ProxyResponse = {
  error?: string;
  details?: string;
};

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProxyResponse | string>
) {
  try {
    console.log("API is running");
    const { target } = req.query;
    console.debug("query :", req.query);
    //console.debug("headers :", req.headers);
    console.debug("method :", req.method);
    console.debug("body :", req.body);

    if (!target || typeof target !== "string") {
      return res.status(400).json({ error: "Target URL is required" });
    }

    // Extract the last target from the query string if it's recursive
    const lastTarget = new URL(target).searchParams.get("target") || target;
    console.debug("target: ", lastTarget);

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
        Array.isArray(value) ? value.join(",") : value ?? "", // Join arrays, or use empty string for undefined
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

    // Prepare the fetchOptions
    const fetchOptions: FetchOptions = {
      signal: AbortSignal.timeout(30000),
      method: req.method ?? "GET", // Fallback to "GET" if req.method is undefined
      headers: sanitizedHeaders,
    };

    // Include the body only if valid
    if (isBodyValid) {
      const finalBody = isJSONString(req.body)
        ? req.body
        : JSON.stringify(req.body);
      fetchOptions.body = finalBody;
    }

    // Make the fetch request with timeout signal
    const response = await fetch(lastTarget, fetchOptions);
    //console.debug("response:", response);

    // Handle the response and return it to the client
    const contentType = response.headers.get("content-type");
    console.debug("contentType:", contentType);
    res.setHeader("Content-Type", contentType || "application/octet-stream");

    if (contentType?.includes("image")) {
      if (!response.body) {
        return res.status(500).json({ error: "Failed to fetch image data" });
      }

      // Convert the ReadableStream to a Node.js stream
      const stream = Readable.fromWeb(response.body as any);

      // Pipe the image stream to the response
      stream.pipe(res);
    } else {
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
      res.status(response.status).send(data);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Proxy error:", error);
    res
      .status(500)
      .json({ error: "Proxy request failed", details: errorMessage });
  }
}
