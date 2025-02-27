import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const INSTALL_DIR = path.resolve("./install");
const EXE_NAME = "stellarium_auto_config";
const EXE_FULL_NAME =
  process.platform === "win32" ? `${EXE_NAME}.exe` : `${EXE_NAME}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const exePath =
    process.platform === "win32"
      ? path.join(INSTALL_DIR, "windows", EXE_FULL_NAME)
      : `./${path.join(INSTALL_DIR, "linux", EXE_FULL_NAME)}`;

  if (fs.existsSync(INSTALL_DIR) && fs.existsSync(exePath)) {
    const urlExe = "/api/stellarium-config-exe";
    return res.status(200).json({ status: "Executable found", data: urlExe });
  }

  return res.status(404).json({ error: "Executable not found" });
}
