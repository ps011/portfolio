/* eslint-disable */
import '../styles/argon.scss'
import '../styles/global.scss'
import '../styles/vendor/font-awesome/css/font-awesome.min.css'
import '../styles/vendor/nucleo/css/nucleo.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
const isProduction = process.env.NODE_ENV === "production";
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      offset: 50,
    });
    const handleRouteChange = (url) => {
      /* invoke analytics function only for production */
      if (isProduction) gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return <Component {...pageProps} />
}