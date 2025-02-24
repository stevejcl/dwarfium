export default function handler(req, res) {
  // Check if the method is GET
  if (req.method === "GET") {
    return res.status(200).json({ status: "Proxy is running" });
  }

  // Handle non-GET requests
  return res.status(405).json({ error: "Method Not Allowed" });
}
