const CORS_PROXY = "https://proxy.pogofuerth.de/";

export const fetchWithCorsProxy = async (url) => {
  try {
    const response = await fetch(CORS_PROXY + url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const responseData = await response.text();
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
