import "../styles/global.scss";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import defaultMessages from "../messages/en.json";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "@prasheel/ui";
import Layout from "../components/layout/Layout";

const isProduction = process.env.NODE_ENV === "production";
const THEME_STORAGE_KEYS = {
  themeId: "portfolio-theme",
  darkMode: "portfolio-dark-mode",
};

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

  const { siteData, aboutData, messages, ...restPageProps } = pageProps;

  return (
    <NextIntlClientProvider locale={router.locale} messages={messages ?? defaultMessages}>
      <ThemeProvider storageKeys={THEME_STORAGE_KEYS}>
        <Layout data={siteData} about={aboutData}>
          <Component {...restPageProps} aboutData={aboutData} />
        </Layout>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
