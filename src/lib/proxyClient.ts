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
  {
    // Use Next.js API proxy
    try {
      let proxyUrl;
      if (process.env.NEXT_PUBLIC_URL_PROXY_CORS) {
        if (process.env.NEXT_PUBLIC_URL_PROXY_CORS.startsWith("/")) {
          proxyUrl = `${
            process.env.NEXT_PUBLIC_URL_PROXY_CORS
          }?target=${encodeURIComponent(target)}`;
          console.log("Proxy URL:", proxyUrl);
        } else {
          proxyUrl = `${
            process.env.NEXT_PUBLIC_URL_PROXY_CORS
          }?target=${encodeURIComponent(target)}`;
          console.log("Proxy URL:", proxyUrl);
        }
      } else { // direct access
        proxyUrl = `${target}`;
        console.log("Proxy URL:", proxyUrl);
      }
      const response = await fetch(proxyUrl, {
        method,
        headers,
        body: body && typeof body === "object" ? JSON.stringify(body) : body,
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
