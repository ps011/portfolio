"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerProps {
  illustration: string;
  texts: string[];
  ctaLabel: string;
  ctaUrl: string;
  downloadable: boolean;
}

const Banner = ({
  texts,
  ctaLabel,
  ctaUrl,
  downloadable,
}: BannerProps) => {
  useEffect(() => {
    let toRotate: string | null;
    let el: HTMLElement | null;
    let loopNum: number;
    let period: string | null;
    let txt: string;
    let isDeleting: boolean;
    const tick = () => {
      if (!el || !toRotate) return;
      const i = loopNum % (JSON.parse(toRotate) as string[]).length;
      const fullTxt = (JSON.parse(toRotate) as string[])[i];
      if (isDeleting) {
        txt = fullTxt.substring(0, txt.length - 1);
      } else {
        txt = fullTxt.substring(0, txt.length + 1);
      }
      el.innerHTML = `<span>${txt}</span>`;
      let delta = 200 - Math.random() * 100;
      if (isDeleting) {
        delta /= 2;
      }
      if (!isDeleting && txt === fullTxt) {
        delta = parseInt(period || "2000", 10);
        isDeleting = true;
      } else if (isDeleting && txt === "") {
        isDeleting = false;
        loopNum += 1;
        delta = 500;
      }
      setTimeout(() => {
        tick();
      }, delta);
    };
    const TxtType = (
      elL: HTMLElement,
      toRotateL: string,
      periodL: string | null,
    ) => {
      toRotate = toRotateL;
      el = elL;
      loopNum = 0;
      period = periodL;
      txt = "";
      tick();
      isDeleting = false;
    };
    const elements = document.querySelectorAll<HTMLElement>("#typewrite");
    elements.forEach((currentEl) => {
      const dataType = currentEl.getAttribute("data-type");
      const dataPeriod = currentEl.getAttribute("data-period");
      if (dataType) {
        TxtType(currentEl, dataType, dataPeriod);
      }
    });
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML =
      "#typewrite > span { border-right: 0.08em solid currentColor; }";
    document.body.appendChild(css);
    return () => {
      document.body.removeChild(css);
    };
  }, []);

  return (
    <motion.section
      id="banner"
      className="flex min-h-[80vh] flex-col items-center justify-center overflow-x-hidden border-b-2 border-black py-16 md:py-24"
      style={{
        backgroundColor: "#E0EDFE",
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center md:min-h-[80vh] md:gap-8">
        <motion.div
          className="flex flex-col items-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h1 className="font-heading text-2xl font-bold leading-tight text-black md:text-4xl lg:text-5xl">
            Hi, I&apos;m{" "}
            <span className="relative inline-block">
              <span
                className="relative z-10 inline-block border-2 border-black bg-[#BEE3F8] px-2 py-0.5 md:px-3 md:py-1"
                style={{ boxShadow: "2px 2px 0px 0px #000" }}
              >
                <span
                  id="typewrite"
                  className="text-black"
                  data-period="2000"
                  data-type={JSON.stringify(texts)}
                />
              </span>
            </span>
          </h1>
        </motion.div>

        <motion.div
          className="mt-2 md:mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {ctaLabel && (
            <Button variant="default" size="lg" asChild>
              <Link
                href={ctaUrl}
                download={downloadable}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                {ctaLabel}
                <ArrowUpRight className="size-4 shrink-0" aria-hidden />
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Banner;
