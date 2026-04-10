"use client";

import React, { memo, useRef, useState, useEffect, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Section from "../../components/tailwind/section";

const ComposableMapComponent = ComposableMap as React.ComponentType<{
  projection?: string;
  projectionConfig?: { center: [number, number]; scale: number };
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}>;

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  name: string;
  visited: boolean;
}

const Map = ({ countriesVisited }: { countriesVisited: string[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["-0.2 1", "0.15 1"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], prefersReduced ? [1, 1] : [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], prefersReduced ? [1, 1] : [0, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [4, 0]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    name: "",
    visited: false,
  });

  const [mapColors, setMapColors] = useState({
    visited: "#3b82f6",
    unvisited: "#f8fafc",
    unvisitedHover: "#e2e8f0",
    ocean: "#bae6fd",
  });

  useEffect(() => {
    const updateColors = () => {
      const style = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains("dark");
      setMapColors({
        visited: style.getPropertyValue("--main").trim(),
        // Neutral land so it reads clearly against the ocean in both modes
        unvisited: isDark ? "#cbd5e1" : "#f8fafc",
        unvisitedHover: isDark ? "#e2e8f0" : "#e2e8f0",
        // Ocean stays water-blue regardless of palette theme
        ocean: isDark ? "#0c4a6e" : "#bae6fd",
      });
    };
    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, name: string, visited: boolean) => {
      setTooltip({ visible: true, x: e.clientX, y: e.clientY, name, visited });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <Section id="map" container>
      <motion.div
        ref={sectionRef}
        style={{ opacity, scale, filter: filterBlur }}
      >
        {/* Header row */}
        <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold text-foreground">
            How much of the World I&apos;ve seen?
          </h3>
          <span className="inline-flex shrink-0 items-center rounded-base border-2 border-border bg-main px-3 py-1.5 text-sm font-bold text-main-foreground shadow-[2px_2px_0px_0px_#000000]">
            {countriesVisited.length}{" "}
            {countriesVisited.length === 1 ? "country" : "countries"}
          </span>
        </div>

        {/* Map */}
        <div
          className="overflow-hidden rounded-base border-2 border-border shadow-shadow"
          style={{ backgroundColor: mapColors.ocean }}
        >
          <ComposableMapComponent
            projection="geoMercator"
            projectionConfig={{ center: [20, 40], scale: 140 }}
            width={800}
            height={330}
            style={{ width: "100%", height: "30%", display: "block" }}
          >
            <Geographies geography="https://res.cloudinary.com/designu/raw/upload/v1681593003/data/geo.json">
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = countriesVisited.includes(geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      stroke="#000000"
                      strokeWidth={0.5}
                      onMouseMove={(e) =>
                        handleMouseMove(
                          e as unknown as React.MouseEvent,
                          geo.properties.name,
                          isVisited,
                        )
                      }
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: isVisited ? mapColors.visited : mapColors.unvisited,
                          outline: "none",
                        },
                        hover: {
                          fill: isVisited ? mapColors.visited : mapColors.unvisitedHover,
                          outline: "none",
                          cursor: "default",
                        },
                        pressed: {
                          fill: isVisited ? mapColors.visited : mapColors.unvisitedHover,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMapComponent>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="block h-3.5 w-5 rounded-sm border-2 border-border bg-main shadow-[1px_1px_0px_0px_#000000]" />
            <span className="text-sm font-medium text-foreground">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="block h-3.5 w-5 rounded-sm border-2 border-border shadow-[1px_1px_0px_0px_#000000]"
              style={{ backgroundColor: mapColors.unvisited }}
            />
            <span className="text-sm font-medium text-foreground">
              Not yet
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="pointer-events-none fixed z-50 rounded-base border-2 border-border bg-main px-2.5 py-1 text-xs font-bold text-main-foreground shadow-[2px_2px_0px_0px_#000000]"
          style={{ left: tooltip.x + 14, top: tooltip.y - 40 }}
        >
          {tooltip.name}
          {tooltip.visited && (
            <span className="ml-1.5 opacity-80">✓</span>
          )}
        </div>
      )}
    </Section>
  );
};

export default memo(Map);
export { Map };
