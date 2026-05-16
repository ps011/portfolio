"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface SectionProps {
    children: React.ReactNode;
    id: string;
    background?: "primary" | "secondary";
    container?: boolean;
    heading?: string;
}

const Section = ({ children, id, background, container, heading }: SectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0%", "0%"] : ["-12%", "12%"],
  );

  const inner = (
    <>
      {heading && (
        <h3 className="my-4 text-left text-2xl font-bold text-foreground">
          {heading}
        </h3>
      )}
      {children}
    </>
  );

  return (
    <section
      ref={ref}
      id={id}
      className={[
        "relative flex min-h-[calc(100svh-74px)] w-full scroll-mt-[74px] flex-col justify-center overflow-hidden border-b-2 border-border p-4 md:min-h-[calc(100svh-106px)] md:scroll-mt-[106px] md:p-8",
        background === "primary" ? "bg-secondary-background" : "bg-background",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-1/4 opacity-40 dark:opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          y: bgY,
        }}
      />

      <div className="relative z-10 w-full">
        {container ? (
          <div className="container mx-auto w-full">{inner}</div>
        ) : (
          inner
        )}
      </div>
    </section>
  );
};

export default Section;
