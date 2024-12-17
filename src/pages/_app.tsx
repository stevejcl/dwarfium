import { wrapper } from "@/components/asteroids/api/store";
import { Provider } from "react-redux";
import "@/styles/globals.css";
import "@/styles/bootstrap.min.css";
import "@/styles/font-awesome.min.css";
import "@/styles/style.min.css";
import "@/styles/all.min.css";
import "@/styles/navbar.css";
import "@/styles/modal.css";
import "@/styles/sliding-pane.css";
import "@/styles/moonphase.css";
import "@/styles/weather.css";
import "@/styles/astrocalendar.css";
import "@/styles/clouds.css";
import "@/styles/Calendar.css";
import "@/styles/asteroids.css";
import "@/styles/image-editor.css";
import "@/styles/witsensordata.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import "@/fontello/css/custom-focus.css";

import type { AppProps } from "next/app";
import { useEffect } from "react";

import Layout from "@/components/shared/Layout";
import { ConnectionContextProvider } from "@/stores/ConnectionContext";

export default function App({ Component, pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    const isTauri = "__TAURI__" in window;

    if (isTauri) {
      let proxyCommand, mediaMtxCommand;
      const startSidecars = async () => {
        try {
          const { Command } = await import("@tauri-apps/api/shell"); // Dynamic import for `Command`
          const { path } = await import("@tauri-apps/api");

          // Build the full path to the configuration file

          const configFile = await path.join(
            await path.resourceDir(),
            "mediamtx.yml"
          );

          // Start the first sidecar
          proxyCommand = Command.sidecar("bin/DwarfiumProxy");
          await proxyCommand.spawn(); // Spawn the first sidecar
          console.log("DwarfiumProxy started successfully.");

          // Start the second sidecar with the config file as an argument
          mediaMtxCommand = Command.sidecar("bin/mediamtx", [configFile]);
          await mediaMtxCommand.spawn(); // Spawn the second sidecar
          console.log(
            "mediamtx started successfully with config file:",
            configFile
          );
        } catch (error) {
          console.error("Failed to start sidecars:", error);
        }
      };

      // Call the async function
      startSidecars();
    }
  }, []);

  return (
    <ConnectionContextProvider>
      <Provider store={store}>
        <Layout>
          <Component {...props.pageProps} />
        </Layout>
      </Provider>
    </ConnectionContextProvider>
  );
}
