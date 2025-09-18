import "@/styles/globals.css";
import "@/styles/custom-scrollbar.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store"; // проверь путь
import RouteLoadingWrapper from "@/layouts/RouteLoadingWrapper";
import CenterLoadingBar from "@/components/CentralLoadingBar";
import TopNotice from "@/components/TopNotice";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/xn7gYHE41ni1AdIRggOxSuXd.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/xn7gYHE41ni1AdIRggqxSuXd.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/xn7gYHE41ni1AdIRggexSg.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="MyWebSite" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CenterLoadingBar />
          <RouteLoadingWrapper>
            <Component {...pageProps} />
            <TopNotice />
          </RouteLoadingWrapper>{" "}
        </PersistGate>
      </Provider>
    </>
  );
}
