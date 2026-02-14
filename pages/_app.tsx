import "../styles/global.scss";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import Layout from "../components/layout/Layout";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

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
    <div className={spaceGrotesk.variable}>
      <Layout data={siteData} about={aboutData}>
        <Component {...restPageProps} />
      </Layout>
    </div>
  );
}
