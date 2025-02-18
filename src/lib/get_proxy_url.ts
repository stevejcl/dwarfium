export function getProxyUrl() {
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
    const proxy_url =
      `http://${window.location.hostname}:${process.env.NEXT_PUBLIC_PORT_PROXY_CORS}` ||
      process.env.NEXT_PUBLIC_URL_PROXY_CORS;
    console.debug(`PROXY-2 is : ${proxy_url}`);
    return proxy_url;
  }
  const proxy_url =
    process.env.NEXT_PUBLIC_URL_PROXY_CORS ||
    `http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT_PROXY_CORS}`;
  console.debug(`PROXY-3 is : ${proxy_url}`);
  return proxy_url;
}

export function getMediaMTXUrl() {
  const isTauri = typeof window !== "undefined" && "__TAURI__" in window;
  if (isTauri) {
    return process.env.NEXT_PUBLIC_IP_MEDIAMTX;
  } else if (typeof window !== "undefined") {
    return (
      `${window.location.hostname}` ||
      process.env.NEXT_PUBLIC_IP_MEDIAMTX ||
      "localhost"
    );
  }
  return process.env.NEXT_PUBLIC_IP_MEDIAMTX || "localhost"; // Default for server-side
}

export function getIpServerMTX() {
  if (typeof window !== "undefined" && "__TAURI__" in window) {
    return process.env.NEXT_PUBLIC_IP_MEDIAMTX;
  }
  return "0.0.0.0";
}
