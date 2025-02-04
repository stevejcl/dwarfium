export function getProxyUrl() {
  // don't change if using /api/proxy
  if (
    process.env.NEXT_PUBLIC_URL_PROXY_CORS &&
    process.env.NEXT_PUBLIC_URL_PROXY_CORS.includes("api")
  )
    return process.env.NEXT_PUBLIC_URL_PROXY_CORS;
  else if (typeof window !== "undefined") {
    return (
      `http://${window.location.hostname}:${process.env.NEXT_PUBLIC_PORT_PROXY_CORS}` ||
      process.env.NEXT_PUBLIC_URL_PROXY_CORS
    );
  }
  return (
    process.env.NEXT_PUBLIC_URL_PROXY_CORS ||
    `http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT_PROXY_CORS}`
  );
}

export function getMediaMTXUrl() {
  if (typeof window !== "undefined") {
    return (
      `${window.location.hostname}` ||
      process.env.NEXT_PUBLIC_IP_MEDIAMTX ||
      "localhost"
    );
  }
  return process.env.NEXT_PUBLIC_IP_MEDIAMTX || "localhost"; // Default for server-side
}
