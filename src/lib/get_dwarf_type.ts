import { getDefaultParamsConfig, deviceInfo } from "dwarfii_api";
import { proxyRequest } from "@/lib/proxyClient";
import { getProxyUrl } from "@/lib/get_proxy_url";
// several function to get Dwarf DeviceId
/////////////////////////////////////////

export async function findDeviceInfo(
  IPDwarf: string | undefined
): Promise<[number | undefined, string | undefined]> {
  let [deviceId = undefined, deviceUid = undefined] =
    (await getDeviceInfo(IPDwarf)) || [];

  if (!deviceId) deviceId = await getConfigData(IPDwarf);

  if (!deviceId) deviceId = await getDwarfType(IPDwarf);

  return [deviceId, deviceUid];
}

// eslint-disable-next-line no-unused-vars
const getDeviceInfo = async (IPDwarf: string | undefined) => {
  try {
    // Make the HTTP POST request to the specified URL
    let requestAddr;
    if (IPDwarf) {
      requestAddr = deviceInfo(IPDwarf);
    }

    if (requestAddr) {
      const proxyUrl = `${getProxyUrl()}?target=${encodeURIComponent(
        requestAddr
      )}`;
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Use 'application/json' for JSON
        },
        redirect: "follow",
      });

      // Check if the response has data
      if (response.ok) {
        console.log(`getDeviceInfo: status ${response.status}`);
      }
      if (response.ok && response.status === 200) {
        const result = await response.json();

        if (result && result.data) {
          const id = result.data.deviceId;
          const uid = result.data.deviceName
            .replace("DWARF3_", "")
            .replace("DWARF_", "");

          if (id) {
            return [id, uid];
          } else {
            console.error("getDeviceInfo : No data found in the response.");
            return undefined;
          }
        } else {
          console.error("getDeviceInfo : No data found in the response.");
          return undefined;
        }
      } else {
        console.error("getDeviceInfo : Error during the request.");
        return undefined;
      }
    } else {
      console.error("Invalid request for getDeviceInfo.");
      return undefined;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getDeviceInfo:", error.message);
    } else {
      console.error("Error getDeviceInfo:", error);
    }
    return undefined;
  }
};

// eslint-disable-next-line no-unused-vars
const getDeviceInfoProxyRequest = async (IPDwarf: string | undefined) => {
  try {
    // Make the HTTP POST request to the specified URL
    let requestAddr;
    if (IPDwarf) {
      requestAddr = deviceInfo(IPDwarf);
    }

    if (requestAddr) {
      const response = await proxyRequest(requestAddr, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Use 'application/json' for JSON
        },
        redirect: "follow",
      });

      console.debug("Response from proxy:", response);
      const id = response.data.deviceId;

      if (id) {
        return id;
      } else {
        console.error("getDeviceInfo : No data found in the response.");
        return undefined;
      }
    } else {
      console.error("Invalid request for getDeviceInfo.");
      return undefined;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getDeviceInfo:", error.message);
    } else {
      console.error("Error getDeviceInfo:", error);
    }
    return undefined;
  }
};

const getConfigData = async (IPDwarf: string | undefined) => {
  try {
    // Make the HTTP GET request to the specified URL
    let requestAddr;
    if (IPDwarf) {
      requestAddr = getDefaultParamsConfig(IPDwarf);
    }

    if (requestAddr) {
      const proxyUrl = `${getProxyUrl()}?target=${encodeURIComponent(
        requestAddr
      )}`;
      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      });

      // Check if the response has data
      if (response.ok) {
        console.log(`getConfigData: status ${response.status}`);
      }
      if (response.ok && response.status === 200) {
        const result = await response.json();

        if (result && result.data) {
          const id = result.data.id;

          if (id) {
            return id;
          } else {
            console.error("getConfigData : No data found in the response.");
            return undefined;
          }
        } else {
          console.error("getConfigData : No data found in the response.");
          return undefined;
        }
      } else {
        console.error("getConfigData : Error during the request.");
        return undefined;
      }
    } else {
      console.error("Invalid request for getConfigData.");
      return undefined;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getConfigData:", error.message);
    } else {
      console.error("Error getConfigData:", error);
    }
    return undefined;
  }
};

const getDwarfType = async (IPDwarf: string | undefined) => {
  let folderResponse;
  const dwarfIIUrl = `http://${IPDwarf}/sdcard/DWARF_II/Astronomy/`;
  const dwarf3Url = `http://${IPDwarf}/DWARF3/Astronomy/`;

  try {
    // First attempt to fetch Dwarf II
    let proxyUrl = `${getProxyUrl()}?target=${encodeURIComponent(dwarfIIUrl)}`;
    folderResponse = await fetch(proxyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });

    if (folderResponse.ok) {
      // Dwarf II found
      console.log("Detected device type: Dwarf II");
      return 1;
    } else {
      // If not OK, try Dwarf 3
      proxyUrl = `${getProxyUrl()}?target=${encodeURIComponent(dwarf3Url)}`;
      folderResponse = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      });

      if (folderResponse.ok) {
        // Dwarf 3 found
        console.log("Detected device type: Dwarf 3");
        return 2;
      } else {
        console.error(
          "Error fetching folder from both Dwarf II and Dwarf 3:",
          folderResponse.statusText
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error checking dwarf info:", error.message);
    } else {
      console.error("Error checking dwarf info:", error);
    }
  }
  return undefined;
};

export async function checkMediaMtxStreamWithUpdate(
  IPDwarf: string | undefined
) {
  if ((await verifyMediaMtxStreamUrls(IPDwarf)) === false) {
    if (await editMediaMtxStreamD3(IPDwarf, "dwarf_wide"))
      if (await editMediaMtxStreamD3(IPDwarf, "dwarf_tele")) return true;
      else return false;
    else return false;
  } else {
    console.log("Streams are already OK");
  }
}

async function verifyMediaMtxStreamUrls(inputIP: string | undefined) {
  const ipServerMTX = "0.0.0.0";
  const url1 = `http://${ipServerMTX}:9997/v3/config/paths/get/dwarf_wide`;
  const url2 = `http://${ipServerMTX}:9997/v3/config/paths/get/dwarf_tele`;

  try {
    const proxyUrl1 = `${getProxyUrl()}?target=${encodeURIComponent(url1)}`;
    const response1 = await fetch(proxyUrl1, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });

    if (!response1.ok) {
      throw new Error(`HTTP error! Status: ${response1.status}`);
    }

    const proxyUrl2 = `${getProxyUrl()}?target=${encodeURIComponent(url2)}`;
    const response2 = await fetch(proxyUrl2, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });

    if (!response2.ok) {
      throw new Error(`HTTP error! Status: ${response2.status}`);
    }

    const result1 = await response1.json();
    console.log(result1);
    const result2 = await response2.json();
    console.log(result2);
    let result = true;

    try {
      const channelWideUrl = new URL(result1.source);
      result = result && channelWideUrl.hostname === inputIP;
    } catch (error) {
      console.error("Invalid URL format:", result1.source);
      return false;
    }
    try {
      const channelTeleUrl = new URL(result2.source);
      result = result && channelTeleUrl.hostname === inputIP;
    } catch (error) {
      console.error("Invalid URL format:", result2.source);
      return false;
    }

    if (result) {
      console.log(`The source in MediaMTX are well configured`);
      return true;
    } else {
      console.log(`Need to configure the source in MediaMTX`);
      return false;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error verifying stream info:", error.message);
    } else {
      console.error("Error verifying stream info:", error);
    }
    return false;
  }
}

const editMediaMtxStreamD3 = async (
  IPDwarf: string | undefined,
  name: string | undefined
) => {
  const ipServerMTX = "0.0.0.0";
  const url = `http://${ipServerMTX}:9997/v3/config/paths/replace/${name}`;
  let data;
  if (name == "dwarf_wide") {
    data = {
      source: `rtsp://${IPDwarf}:554/ch1/stream0`,
      sourceOnDemand: true,
      sourceOnDemandCloseAfter: "10s",
      record: false,
    };
  }
  if (name == "dwarf_tele") {
    data = {
      source: `rtsp://${IPDwarf}:554/ch0/stream0`,
      sourceOnDemand: true,
      sourceOnDemandCloseAfter: "10s",
      record: false,
    };
  }
  try {
    const proxyUrl = `${getProxyUrl()}?target=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(data);
    console.log(JSON.stringify(data));
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Check the response structure
    if (response.status === 200) {
      console.log("editMediaMtxStreamD3 Success:");
      return true;
    } else {
      console.error("Failed:", response.status);
      return false;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error editing stream info:", error.message);
    } else {
      console.error("Error editing stream info:", error);
    }
    return false;
  }
};
