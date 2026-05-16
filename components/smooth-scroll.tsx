"use client";

import { useRouter } from "next/router";
import { useEffect, useRef, ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const router = useRouter();
  const lenisRef = useRef<InstanceType<typeof import("lenis").default> | null>(null);
  const snapRef = useRef<InstanceType<typeof import("lenis/snap").default> | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    let lenis: InstanceType<typeof import("lenis").default> | null = null;
    let snap: InstanceType<typeof import("lenis/snap").default> | null = null;
    let removeSnaps: Array<() => void> = [];

    const registerSnapTargets = () => {
      removeSnaps.forEach((fn) => fn());
      removeSnaps = [];
      if (!snap) return;
      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      sections.forEach((el) => {
        const unsub = snap!.addElement(el, { align: "start" });
        removeSnaps.push(unsub);
      });
    };

    const init = async () => {
      if (typeof window !== "undefined") window.scrollTo(0, 0);
      const Lenis = (await import("lenis")).default;
      const Snap = (await import("lenis/snap")).default;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 2,
      });
      lenisRef.current = lenis;
      lenis.scrollTo(0, { immediate: true });

      snap = new Snap(lenis, {
        type: "mandatory",
        duration: 0.8,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
      snapRef.current = snap;

      requestAnimationFrame(() => registerSnapTargets());

      function raf(time: number) {
        lenis?.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
      rafRef.current = requestAnimationFrame(raf);
    };
    init();

    const handleRouteChange = () => {
      lenisRef.current?.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => registerSnapTargets());
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      removeSnaps.forEach((fn) => fn());
      snap?.destroy();
      lenis?.destroy();
      snapRef.current = null;
      lenisRef.current = null;
    };
  }, [router.events]);

  return <>{children}</>;
}
