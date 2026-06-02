import "../styles/global.scss";
import "@prasheel/ui/styles.css";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import defaultMessages from "../messages/en.json";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "@prasheel/ui";
import Layout from "../components/layout/Layout";

const themeStorageKeys = {
  themeId: "portfolio-theme",
  darkMode: "portfolio-dark-mode",
};

export default function Portfolio({ Component, pageProps }) {
  const router = useRouter();
  const isAnalyticsEnabled = gtag.isProduction && Boolean(gtag.GA_MEASUREMENT_ID);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const { siteData, aboutData, messages, ...restPageProps } = pageProps;

  return (
    <>
      {isAnalyticsEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('config', '${gtag.GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname + window.location.search,
              });
            `}
          </Script>
        </>
      )}
      <NextIntlClientProvider locale={router.locale ?? "en"} messages={messages ?? defaultMessages}>
        <ThemeProvider
          defaultThemeId="blue"
          defaultDarkMode={false}
          storageKeys={themeStorageKeys}
        >
          <Layout data={siteData} about={aboutData} messages={messages ?? defaultMessages}>
            <Component {...restPageProps} aboutData={aboutData} />
          </Layout>
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}
