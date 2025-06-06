import "../styles/global.scss";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import { MantineProvider } from "@mantine/core";
import { theme } from "../styles/theme";
import Layout from "../components/layout/Layout";

const isProduction = process.env.NODE_ENV === "production";

export default function Portfolio({ Component, pageProps }) {
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

  const { siteData, aboutData, ...restPageProps } = pageProps;

  return (
    <MantineProvider theme={theme}>
      <Layout 
        data={siteData}
        about={aboutData}
      >
        <Component {...restPageProps} />
      </Layout>
    </MantineProvider>
  );
}
