import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
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

  try {
    const exePath =
      process.platform === "win32"
        ? path.join(INSTALL_DIR, "windows", EXE_FULL_NAME)
        : path.join(INSTALL_DIR, "linux", EXE_FULL_NAME);

    if (!fs.existsSync(exePath)) {
      return res.status(404).json({ error: "Executable not found" });
    }

    const childProcess = spawn(exePath, [], {
      cwd: INSTALL_DIR,
      shell: process.platform !== "win32",
    });

    let stdoutData = "",
      stderrData = "";

    childProcess.stdout.on("data", (data: Buffer) => {
      stdoutData += data.toString();
    });

    childProcess.stderr.on("data", (data: Buffer) => {
      stderrData += data.toString();
    });

    childProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Process exited successfully:", stdoutData);
        return res.json({ message: "Process completed", output: stdoutData });
      } else {
        console.error("Process exited with error:", stderrData);
        return res
          .status(500)
          .json({ error: "Process failed", details: stderrData });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
