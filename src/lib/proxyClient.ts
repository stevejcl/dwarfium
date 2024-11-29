const isTauri = process.env.NEXT_PUBLIC_IS_TAURI === "true";

export async function proxyRequest(
  target: string,
  {
    method = "GET",
    headers = {},
    body = null,
    redirect = "follow",
  }: {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, any> | string | null;
    redirect?: "follow" | "manual" | "error" | undefined;
  }
): Promise<any> {
  if (isTauri) {
    // Use Tauri's Rust backend
    //try {
    //  const response = await invoke("proxy_request", {
    //    target,
    //    method,
    //    headers,
    //    body,
    //  });
    //  return response;
    //} catch (error) {
    //  console.error("Tauri Proxy error:", error);
    //  throw error;
    //}
  } else {
    // Use Next.js API proxy
    try {
      const proxyUrl = `${
        process.env.NEXT_PUBLIC_URL_PROXY_CORS
      }?target=${encodeURIComponent(target)}`;
      console.log("Proxy URL:", proxyUrl);
      const response = await fetch(proxyUrl, {
        method,
        headers,
        body: body && typeof body === "object" ? JSON.stringify(body) : body,
        credentials: "include", // Use credentials if required
        redirect,
      });

      console.log("Response Status:", response.status);
      const contentType = response.headers.get("content-type");
      console.debug("Response Content-Type:", contentType);
      const isJSON = contentType?.includes("application/json");
      const data = isJSON ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}: ${data}`
        );
      }

      return data;
    } catch (error) {
      console.error("Proxy error:", error);
      throw error; // Let the caller handle the error
    }
  }
}
