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
