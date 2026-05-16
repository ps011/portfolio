"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface BlogHeroProps {
  src: string;
  alt: string;
}

const BlogHero = ({ src, alt }: BlogHeroProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0%", "0%"] : ["-12%", "12%"],
  );

  return (
    <div
      ref={ref}
      className="mx-auto mb-8 max-w-5xl overflow-hidden rounded-base border-3 border-border shadow-shadow"
    >
      <div className="relative aspect-[16/9] w-full">
        <motion.div className="absolute inset-x-0 -inset-y-[12%]" style={{ y }}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BlogHero;
