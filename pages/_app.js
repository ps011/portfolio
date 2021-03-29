/* eslint-disable */
import '../styles/argon.scss'
import '../styles/global.scss'
import '../styles/vendor/font-awesome/css/font-awesome.min.css'
import '../styles/vendor/nucleo/css/nucleo.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react'
export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      offset: 50,
    });
  }, []);
  return <Component {...pageProps} />
}