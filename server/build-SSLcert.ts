import * as esbuild from "esbuild";

(async () => {
  // Get the major version of Node.js (e.g., "16" from "v16.14.0")
  const nodeVersion = process.version.split(".")[0].slice(1);

  // Set the target version string, e.g., "node16"
  const targetVersion = `node${nodeVersion}`;

  // Use esbuild to bundle and compile the TypeScript file
  await esbuild.build({
    entryPoints: ["./server/createSSLcert.ts"],
    bundle: true,
    platform: "node", // Targeting Node.js environment
    target: [targetVersion], // Dynamically set target version
    outfile: "./server/createSSLcert.js",
    plugins: [],
  });
})();
