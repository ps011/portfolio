import "../styles/global.scss";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "../lib/theme-context";
import { UIConfigProvider } from "../lib/ui-context";
import { DEFAULT_UI_CONFIG } from "../lib/ui-defaults";
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

  const { siteData, aboutData, uiConfig, ...restPageProps } = pageProps;

  return (
    <ThemeProvider>
      <UIConfigProvider value={uiConfig ?? DEFAULT_UI_CONFIG}>
        <Layout data={siteData} about={aboutData}>
          <Component {...restPageProps} aboutData={aboutData} />
        </Layout>
      </UIConfigProvider>
    </ThemeProvider>
  );
}
