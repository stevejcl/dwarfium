import { ConnectionContextType } from "@/types";

export async function checkHealth(url, timeout = 5000, externalSignal) {
  const timeoutSignal = AbortSignal.timeout(timeout);

  const combinedSignal = AbortSignal.any([timeoutSignal, externalSignal]);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: combinedSignal,
    });

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
      return data.data ?? true;
    } else {
      console.warn(`${url} Service is unhealthy:`, data);
      return false;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (timeoutSignal.aborted) {
        console.log(
          `checkHealth ${url} Operation timed out after ${timeout} ms`
        );
      } else if (externalSignal.aborted) {
        console.log(`Request aborted: ${url}`);
      } else {
        console.error("Error:", error);
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
    return false;
  }
}

export function isModeHttps() {
  // don't change if using Tauri
  const isTauri = typeof window !== "undefined" && "__TAURI__" in window;
  if (isTauri) {
    return false;
  } else if (typeof window !== "undefined") {
    const port = window.location.protocol;
    return port.toLowerCase() === "https:";
  }
  return false;
}

export function getServerIp() {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "";
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
  // don't change if using Tauri
  const isTauri = typeof window !== "undefined" && "__TAURI__" in window;
  if (isTauri) {
    console.debug(`PROXY-1 is : ${process.env.NEXT_PUBLIC_URL_PROXY_CORS}`);
    return process.env.NEXT_PUBLIC_URL_PROXY_CORS;
    // don't change if using api/proxy and not using an external Proxy
  } else if (
    process.env.NEXT_PUBLIC_URL_PROXY_CORS &&
    process.env.NEXT_PUBLIC_URL_PROXY_CORS.includes("api") &&
    connectionCtx &&
    !connectionCtx.proxyIP
  ) {
    console.debug(`PROXY-1 is : ${process.env.NEXT_PUBLIC_URL_PROXY_CORS}`);
    return process.env.NEXT_PUBLIC_URL_PROXY_CORS;
  } else if (typeof window !== "undefined") {
    let hostname = "";

    // if already defined use it
    if (connectionCtx && connectionCtx.proxyInLan && connectionCtx.proxyLocalIP)
      hostname = connectionCtx.proxyLocalIP;
    else if (connectionCtx && connectionCtx.proxyIP)
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
  timeout = 5000,
  externalSignal: AbortSignal
) {
  const url1 = `http://${getIpServerMTX()}:9997/v3/config/paths/get/dwarf_wide`;
  const url2 = `http://${getIpServerMTX()}:9997/v3/config/paths/get/dwarf_tele`;

  const timeoutSignal1 = AbortSignal.timeout(timeout);
  const timeoutSignal2 = AbortSignal.timeout(timeout);

  const combinedSignal = AbortSignal.any([
    timeoutSignal1,
    timeoutSignal2,
    externalSignal,
  ]);

  try {
    const proxyUrl1 = `${getProxyUrl(
      connectionCtx
    )}?target=${encodeURIComponent(url1)}`;
    const proxyUrl2 = `${getProxyUrl(
      connectionCtx
    )}?target=${encodeURIComponent(url2)}`;

    const [response1, response2] = await Promise.all([
      fetch(proxyUrl1, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        signal: combinedSignal,
      }),
      fetch(proxyUrl2, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        signal: combinedSignal,
      }),
    ]);

    if (!response1.ok) {
      throw new Error(`HTTP error! Status: ${response1.status}`);
    }

    if (!response2.ok) {
      throw new Error(`HTTP error! Status: ${response2.status}`);
    }

    return true; // Both requests were successful
  } catch (error) {
    if (error instanceof Error) {
      if (timeoutSignal1.aborted || timeoutSignal2.aborted) {
        console.log(
          `checkMediaMtxStreamUrls Operation timed out after ${timeout} ms`
        );
      } else if (externalSignal.aborted) {
        console.log(`Media Mtx Request aborted`);
      } else {
        console.error("Error:", error);
      }
    } else {
      console.error("Error verifying stream info:", error);
    }
    return false; // An error occurred, return false
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

export const isLocalIp = (url) => {
  const islocalIp = /(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.16\.|100\.)/;
  console.log(`isLocalIp $(url): `, islocalIp.test(url));

  return islocalIp.test(url);
};

export function getTransfomProxyImageUrl(
  imageUrl,
  proxyUrl: string | undefined = undefined,
  connectionCtx: ConnectionContextType,
  forceHttps: boolean = false
) {
  if (connectionCtx && !connectionCtx.useHttps && connectionCtx.proxyInLan) {
    console.log("getTransfomProxyImageUrl - Local Lan.");
    return imageUrl;
  } else if (
    connectionCtx &&
    connectionCtx.useHttps &&
    forceHttps &&
    connectionCtx.proxyInLan
  ) {
    console.log("getTransfomProxyImageUrl - Local Lan Force Https.");
    return imageUrl.replace("http:", "https:");
  } else {
    if (!proxyUrl) proxyUrl = getProxyUrl(connectionCtx);
    return `${proxyUrl}?target=${encodeURIComponent(imageUrl)}`;
  }
}
