import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const INSTALL_DIR = path.resolve("./install");
const EXTERN_DIR = path.join(INSTALL_DIR, "extern");
const ZIP_PATH =
  process.platform === "win32"
    ? path.join(INSTALL_DIR, "windows", "extern", "extern.zip")
    : path.join(INSTALL_DIR, "linux", "extern", "extern.zip");
const EXE_NAME = "connect_bluetooth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const exePath =
    process.platform === "win32"
      ? path.join(EXTERN_DIR, `${EXE_NAME}.exe`)
      : `./${path.join(EXTERN_DIR, EXE_NAME)}`;

  if (fs.existsSync(EXTERN_DIR) && fs.existsSync(exePath)) {
    return res.status(200).json({ status: "Executable found" });
  }

  if (fs.existsSync(ZIP_PATH)) {
    return res.status(200).json({ status: "Zip found" });
  }

  return res.status(404).json({ error: "Executable not found" });
}
