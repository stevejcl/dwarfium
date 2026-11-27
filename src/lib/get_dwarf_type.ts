import { ConnectionContextType } from "@/types";
import { deviceInfo, normalizeCurrentDeviceInfo } from "@/services/dwarf";
import { getProxyUrl } from "@/lib/get_proxy_url";
import { ensureDevicePreviewPaths } from "@/services/dwarf/previewPaths";

/** Device identity must come from successful current deviceInfo discovery.
 * Media folder existence and old parameter configurations cannot identify the
 * connected hardware; unavailable discovery leaves the model unknown.
 */
export async function findDeviceInfo(
  IPDwarf: string | undefined,
  connectionCtx: ConnectionContextType,
  onError?: (message: string) => void,
): Promise<[number | undefined, string | undefined]> {
  if (!IPDwarf) return [undefined, undefined];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  let stage: "network" | "identity" = "network";
  try {
    const requestAddr = deviceInfo(IPDwarf);
    const response = await fetch(
      `${getProxyUrl(connectionCtx)}?target=${encodeURIComponent(requestAddr)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        redirect: "follow",
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      if (response.status === 502) {
        // Only recognize our structured network diagnostic; never expose
        // arbitrary upstream response bodies in the connection dialog.
        const diagnostic = await response
          .text()
          .then((body) => JSON.parse(body))
          .catch(() => null);
        if (
          diagnostic?.error === "Proxy upstream network unreachable" &&
          (diagnostic.code === "EHOSTUNREACH" ||
            diagnostic.code === "ENETUNREACH")
        ) {
          const macHint =
            diagnostic.platform === "darwin"
              ? " On macOS, check Privacy & Security > Local Network for Dwarfium, quit and restart the app, or try launching Dwarfium directly from Terminal."
              : "";
          throw new Error(
            `The discovery proxy is running but cannot reach the telescope at ${IPDwarf}:8082 (${diagnostic.code}). Check the network connection and any VPN or network filters.${macHint}`,
          );
        }
      }
      throw new Error(
        `The discovery proxy returned HTTP ${response.status}. Check the proxy service and telescope address ${IPDwarf}.`,
      );
    }
    stage = "identity";
    const device = normalizeCurrentDeviceInfo(await response.text());
    // Retain the optional discovery-name suffix for existing UI identifiers;
    // it is never evidence of the model, firmware, or protocol identity.
    const uid =
      device.deviceName?.replace(/^DWARF(?:_?MINI|_?II|3)?_/i, "") || undefined;
    return [device.hardwareId, uid];
  } catch (error) {
    const detail = controller.signal.aborted
      ? `Device identification timed out for ${IPDwarf}. Check that the proxy can reach the telescope on port 8082.`
      : stage === "network" && error instanceof TypeError
        ? `Cannot reach device discovery for ${IPDwarf}. Check that the configured proxy is running and reachable; BLE discovery alone does not establish a network connection.`
        : error instanceof Error
          ? error.message
          : "Device identification failed.";
    console.error("DWARF device discovery unavailable:", detail);
    onError?.(detail);
    return [undefined, undefined];
  } finally {
    clearTimeout(timeout);
  }
}

/** Setup and Fleet configure the same per-device paths. Never retarget a
 * singleton path that another telescope's preview may still be reading. */
export async function checkMediaMtxStreamWithUpdate(
  IPDwarf: string | undefined,
  connectionCtx: ConnectionContextType,
) {
  try {
    await ensureDevicePreviewPaths({ ...connectionCtx, IPDwarf });
    return true;
  } catch (error) {
    console.warn("MediaMTX device preview unavailable:", error);
    return false;
  }
}
