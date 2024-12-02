/** @type {import('next').NextConfig} */
const nextConfig = {
    // unoptimized - When true, the source image will be served as-is instead of changing quality,
    // size, or format. Defaults to false.
    images: {
        unoptimized: true
    },
  reactStrictMode: true,
  distDir: "dist",
  trailingSlash: true,
};

if (process.env.NEXT_PUBLIC_URL_PROXY_CORS.startsWith("http")) {
  nextConfig.output = 'export';
}
module.exports = nextConfig;