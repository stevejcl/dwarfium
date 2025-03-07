import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import unzipper from "unzipper"; // Install with `npm install unzipper`

interface Config {
  DWARF_IP?: string;
  DWARF_ID?: string;
}

const INSTALL_DIR = path.resolve("./install");
const EXTERN_DIR = path.join(INSTALL_DIR, "extern");
const ZIP_PATH =
  process.platform === "win32"
    ? path.join(INSTALL_DIR, "windows", "extern", "extern.zip")
    : path.join(INSTALL_DIR, "linux", "extern", "extern.zip");
const EXE_NAME = "connect_bluetooth";
const CONFIG_PATH = path.join(EXTERN_DIR, "config.py");

async function ensureUnzipped(): Promise<void> {
  const exePath =
    process.platform === "win32"
      ? path.join(EXTERN_DIR, `${EXE_NAME}.exe`)
      : `./${path.join(EXTERN_DIR, EXE_NAME)}`;

  if (fs.existsSync(EXTERN_DIR) && fs.existsSync(exePath)) {
    return; // ? Already extracted, no need to unzip again
  }

  if (!fs.existsSync(ZIP_PATH)) {
    throw new Error(`Zip file not found: ${ZIP_PATH}`);
  }

  console.log("Extracting extern.zip...");
  await fs
    .createReadStream(ZIP_PATH)
    .pipe(unzipper.Extract({ path: EXTERN_DIR }))
    .promise();
}

function readConfigPy(): Config {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error("config.py not found");
  }

  const content = fs.readFileSync(CONFIG_PATH, "utf-8");

  const dwarfIpMatch = content.match(/DWARF_IP\s*=\s*["']([^"']+)["']/);
  const dwarfIdMatch = content.match(/DWARF_ID\s*=\s*["']([^"']+)["']/);

  return {
    DWARF_IP: dwarfIpMatch ? dwarfIpMatch[1] : undefined,
    DWARF_ID: dwarfIdMatch ? dwarfIdMatch[1] : undefined,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await ensureUnzipped(); // ? Only unzips if necessary

    const {
      ble_psd = "DWARF_12345678",
      ble_STA_ssid = "",
      ble_STA_pwd = "",
    } = req.query;
    const exePath =
      process.platform === "win32"
        ? path.join(EXTERN_DIR, `${EXE_NAME}.exe`)
        : `./${path.join(EXTERN_DIR, EXE_NAME)}`;

    if (!fs.existsSync(exePath)) {
      return res.status(404).json({ error: "Executable not found" });
    }

    console.log("run_exe_path : " + exePath);
    console.log("run_exe_instal_path : " + EXTERN_DIR);
    const childProcess = spawn(
      `"${exePath}"`,
      [
        "--psd",
        ble_psd as string,
        "--ssid",
        ble_STA_ssid as string,
        "--pwd",
        ble_STA_pwd as string,
      ],
      {
        cwd: EXTERN_DIR,
        shell: true,
      }
    );

    let stdoutData = "",
      stderrData = "";
    childProcess.stdout.on(
      "data",
      (data: Buffer) => (stdoutData += data.toString())
    );
    childProcess.stderr.on(
      "data",
      (data: Buffer) => (stderrData += data.toString())
    );

    childProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: `Process failed: ${stderrData}` });
      }

      try {
        const config = readConfigPy(); // ? Read Python config file
        return res.status(200).json({
          dwarfIp: config.DWARF_IP || "",
          dwarfId: config.DWARF_ID || "",
          output: stdoutData,
        });
      } catch (configError) {
        return res.status(500).json({ error: (configError as Error).message });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
