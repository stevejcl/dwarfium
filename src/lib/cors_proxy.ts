const CORS_PROXY = "https://proxy.pogofuerth.de/";

export const fetchWithCorsProxy = async (url) => {
  try {
    const response = await fetch(CORS_PROXY + url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    // Parse the response as text
    const responseData = await response.text();
    // Return the parsed XML data
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
