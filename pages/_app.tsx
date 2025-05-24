import "../styles/global.scss";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import { MantineProvider } from '@mantine/core';
import { theme } from '../styles/theme';

const isProduction = process.env.NODE_ENV === "production";
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (isProduction) gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <MantineProvider theme={theme}>
      {/* <NormalizeCSS /> */}
      {/* <GlobalStyles /> */}
      <Component {...pageProps} />
    </MantineProvider>
  );
}
