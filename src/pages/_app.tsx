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
import { useEffect, useRef } from "react";

import Layout from "@/components/shared/Layout";
import { ConnectionContextProvider } from "@/stores/ConnectionContext";

export default function App({ Component, pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const sidecarName1 = useRef("");
  const sidecarName2 = useRef("");

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    const isTauri = '__TAURI__' in window;

    if (isTauri) {
      const setSidecarName = async () => {
        try {
          const { platform } = await import('@tauri-apps/api/os'); // Dynamic import
          const os = await platform(); // Await the result of the platform function

          switch (os) {
            case "win32":
              sidecarName1.current = "../dist/DwarfiumProxy";
              sidecarName2.current = "../dist/mediamtx";
              break;
            case "linux":
              sidecarName1.current = "../dist/DwarfiumProxy";
              sidecarName2.current = "../dist/mediamtx";
              break;
            case "darwin": // Correct platform name for macOS
              sidecarName1.current = "../dist/DwarfiumProxy";
              sidecarName2.current = "../dist/mediamtx";
              break;
            default:
              console.error("Unsupported OS");
              return;
          }

          console.log("Sidecar1 set to:", sidecarName1.current);
          console.log("Sidecar2 set to:", sidecarName2.current);

          const { Command } = await import('@tauri-apps/api/shell'); // Dynamic import for `Command`
          const command1 = Command.sidecar(sidecarName1.current);
          command1
            .execute()
            .then(() => console.log("Sidecar1 started successfully"))
            .catch((err) => console.error("Error starting sidecar1:", err));
          const command2 = Command.sidecar(sidecarName2.current, ["_up_/dist/mediamtx.yml"]);
          command2
            .execute()
            .then(() => console.log("Sidecar2 started successfully"))
            .catch((err) => console.error("Error starting sidecar2:", err));
        } catch (error) {
          console.error("Error determining platform:", error);
        }
      };

      // Call the async function
      setSidecarName();
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
