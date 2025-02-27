import { ConnectionContextType } from "@/types";

export async function checkHealth(url, timeout = 1000) {
  const controller = new AbortController();
  const signal = controller.signal;

  // Set timeout to abort the request
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException("Request timed out", "TimeoutError"));
  }, timeout);

  try {
    const response = await fetch(url, { method: "GET", signal });

    clearTimeout(timeoutId); // Clear timeout if request completes

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response type, expected JSON");
    }

    const data = await response.json(); // Parse JSON safely

    if (data.status) {
      console.log(`${url} Service is healthy!`);
      if (data.data) return data.data;
      else return true;
    } else {
      console.warn(`${url} Service is unhealthy:`, data);
    }
    return false;
  } catch (error) {
    console.error(`${url} Health check failed:`, error);
    return false;
  }
}

export function isModeHttps() {
  // don't change if using /api/proxy or Tauri
  const isTauri = typeof window !== "undefined" && "__TAURI__" in window;
  if (
    isTauri ||
    (process.env.NEXT_PUBLIC_URL_PROXY_CORS &&
      process.env.NEXT_PUBLIC_URL_PROXY_CORS.includes("api"))
  ) {
    return false;
  } else if (typeof window !== "undefined") {
    const port = window.location.protocol;
    return port.toLowerCase() === "https:";
  }
  return false;
}

export function getServerUrl() {
  // don't change if using /api/proxy or Tauri
  const isTauri = typeof window !== "undefined" && "__TAURI__" in window;
  if (
    isTauri ||
    (process.env.NEXT_PUBLIC_URL_PROXY_CORS &&
      process.env.NEXT_PUBLIC_URL_PROXY_CORS.includes("api"))
  ) {
    console.debug(`ServerUrl-1 is : "/api"`);
    return "/api";
  } else if (typeof window !== "undefined") {
    const port = window.location.port;
    const server_url = port
      ? `${window.location.protocol}//${window.location.hostname}:${port}`
      : `${window.location.protocol}//${window.location.hostname}`;
    console.debug(`ServerUrl-2 is : ${server_url}`);
    return server_url;
  }
  const server_url = `http://127.0.0.1:8000`;
  console.debug(`ServerUrl-3 is : ${server_url}`);
  return server_url;
}

export function getProxyUrl(connectionCtx: ConnectionContextType) {
  // don't change if using /api/proxy or Tauri
  const isTauri = typeof window !== "undefined" && "__TAURI__" in window;
  if (
    isTauri ||
    (process.env.NEXT_PUBLIC_URL_PROXY_CORS &&
      process.env.NEXT_PUBLIC_URL_PROXY_CORS.includes("api"))
  ) {
    console.debug(`PROXY-1 is : ${process.env.NEXT_PUBLIC_URL_PROXY_CORS}`);
    return process.env.NEXT_PUBLIC_URL_PROXY_CORS;
  } else if (typeof window !== "undefined") {
    let hostname = "";

    // if already defined use it
    if (connectionCtx && connectionCtx.proxyIP)
      hostname = connectionCtx.proxyIP;
    else hostname = window.location.hostname;

    if (hostname) {
      const protocol = window.location.protocol;
      const port =
        protocol.toLowerCase() === "https:"
          ? process.env.NEXT_PUBLIC_PORT_PROXY_CORS_HTTPS
          : process.env.NEXT_PUBLIC_PORT_PROXY_CORS;
      const proxy_url = `${protocol}//${hostname}:${port}`;
      console.debug(`PROXY-2a is : ${proxy_url}`);
      return proxy_url;
    } else {
      console.debug(`PROXY-2b is : ${process.env.NEXT_PUBLIC_URL_PROXY_CORS}`);
      return process.env.NEXT_PUBLIC_URL_PROXY_CORS;
    }
  }
  const proxy_url =
    process.env.NEXT_PUBLIC_URL_PROXY_CORS ||
    `http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT_PROXY_CORS}`;
  console.debug(`PROXY-3 is : ${proxy_url}`);
  return proxy_url;
}

export function getMediaMTXUrl(connectionCtx: ConnectionContextType): string {
  const isTauri = typeof window !== "undefined" && "__TAURI__" in window;
  if (isTauri) {
    return process.env.NEXT_PUBLIC_IP_MEDIAMTX || "localhost";
  } else if (typeof window !== "undefined") {
    let hostname = "";

    // If already defined, use it
    if (connectionCtx?.proxyLocalIP) {
      hostname = connectionCtx.proxyLocalIP;
      console.log("proxyLocalIP:", hostname);
    } else {
      hostname = window.location.hostname;
    }
    console.log("Final getMediaMTXUrl:", hostname);

    return hostname || process.env.NEXT_PUBLIC_IP_MEDIAMTX || "localhost";
  }
  return process.env.NEXT_PUBLIC_IP_MEDIAMTX || "localhost"; // Default for server-side
}

export function getIpServerMTX() {
  if (typeof window !== "undefined" && "__TAURI__" in window) {
    return process.env.NEXT_PUBLIC_IP_MEDIAMTX;
  }
  return "0.0.0.0";
}

export async function checkMediaMtxStreamUrls(
  connectionCtx: ConnectionContextType,
  timeout = 1000
) {
  const url1 = `http://${getIpServerMTX()}:9997/v3/config/paths/get/dwarf_wide`;
  const url2 = `http://${getIpServerMTX()}:9997/v3/config/paths/get/dwarf_tele`;

  const controller = new AbortController();
  const signal = controller.signal;

  // Set timeout to abort the request
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException("Request timed out", "TimeoutError"));
  }, timeout);

  try {
    const proxyUrl1 = `${getProxyUrl(
      connectionCtx
    )}?target=${encodeURIComponent(url1)}`;
    const response1 = await fetch(proxyUrl1, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      signal,
    });

    clearTimeout(timeoutId); // Clear timeout if request completes

    if (!response1.ok) {
      throw new Error(`HTTP error! Status: ${response1.status}`);
    }

    const timeoutId2 = setTimeout(() => {
      controller.abort(new DOMException("Request timed out", "TimeoutError"));
    }, timeout);

    const proxyUrl2 = `${getProxyUrl(
      connectionCtx
    )}?target=${encodeURIComponent(url2)}`;
    const response2 = await fetch(proxyUrl2, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      signal,
    });

    clearTimeout(timeoutId2); // Clear timeout if request completes

    if (!response2.ok) {
      throw new Error(`HTTP error! Status: ${response2.status}`);
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error verifying stream info:", error.message);
    } else {
      console.error("Error verifying stream info:", error);
    }
    return false;
  }
}

export function compareURLsIgnoringPort(url1, url2) {
  try {
    const hostname1 = new URL(url1).hostname;
    const hostname2 = new URL(url2).hostname;
    return hostname1 === hostname2;
  } catch (error) {
    console.error("Invalid URL:", error);
    return false;
  }
}
