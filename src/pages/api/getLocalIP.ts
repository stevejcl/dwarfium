import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  let localIPs: string[] = [];

  console.log("Start getLocalIPAddress.");

  for (const key in interfaces) {
    const iface = interfaces[key];
    if (Array.isArray(iface)) {
      for (const entry of iface) {
        if (
          (entry.family === "IPv4" || (entry.family as any) === 4) &&
          !entry.internal
        ) {
          localIPs.push(entry.address);
          console.log("getLocalIPAddress found ", entry.address);
        }
      }
    }
  }
  localIPs = localIPs.sort((a, b) => {
    if (a.startsWith("192.") && !b.startsWith("192.")) return -1;
    if (!a.startsWith("192.") && b.startsWith("192.")) return 1;
    if (a === "127.0.0.1") return 1;
    if (b === "127.0.0.1") return -1;
    return a.localeCompare(b);
  });
  console.log("getLocalIPAddress localIPs=", localIPs);
  return localIPs;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API localIP is running");
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  return res.status(200).json({ ips: getLocalIPAddress() });
}
