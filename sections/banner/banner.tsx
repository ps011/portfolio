"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("banner");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: grid moves at 50% speed
  const bgY = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [0, 150]);
  // Text fades out and shifts up as you scroll past
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], prefersReduced ? [1, 1] : [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], prefersReduced ? [0, 0] : [0, -50]);

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
      timeoutRef.current = setTimeout(tick, delta);
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
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      id="banner"
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden border-b-2 border-border py-16 md:py-24"
      style={{
        backgroundColor: "var(--banner-bg)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Parallax grid background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--banner-grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--banner-grid) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          y: bgY,
        }}
      />

      {/* Text content with scroll-linked fade */}
      <motion.div
        className="container relative z-10 flex flex-col items-center justify-center gap-6 text-center md:gap-8"
        style={{ opacity: textOpacity, y: textY }}
      >
        <motion.div
          className="flex flex-col items-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h1
            className="text-2xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl"
            aria-label={`${t("greeting")} ${texts[0]}`}
          >
            {t("greeting")}{" "}
            <span className="relative inline-block" aria-hidden="true">
              <span
                className="relative z-10 inline-block border-2 border-border bg-main px-2 py-0.5 text-main-foreground shadow-shadow md:px-3 md:py-1"
                style={{ boxShadow: "2px 2px 0px 0px #000000" }}
              >
                <span
                  id="typewrite"
                  className="text-main-foreground"
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
      </motion.div>
    </motion.section>
  );
};

export default Banner;
