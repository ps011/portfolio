"use client";

import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { motion } from "framer-motion";
import Section from "../../components/tailwind/section";
import { Card } from "@/components/ui/card";
import { useUIConfig } from "../../lib/ui-context";

const ComposableMapComponent = ComposableMap as React.ComponentType<{
  projection?: string;
  projectionConfig?: { center: [number, number]; scale: number };
  children?: React.ReactNode;
}>;

const Map = ({ countriesVisited }: { countriesVisited: string[] }) => {
  const ui = useUIConfig();

  return (
    <Section id="map" container heading={ui.map.heading}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
      >
        <Card className="my-8 overflow-hidden border-2 border-border bg-background p-4 shadow-shadow md:mx-auto">
          <ComposableMapComponent
            projection="geoMercator"
            projectionConfig={{
              center: ui.map.projectionCenter as [number, number],
              scale: ui.map.projectionScale,
            }}
          >
            <Geographies geography={ui.map.geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <g key={geo.rsmKey}>
                    <title>{geo.properties.name}</title>
                    <Geography
                      geography={geo}
                      stroke={ui.map.borderColor}
                      style={{
                        default: {
                          fill: countriesVisited.includes(geo.id)
                            ? ui.map.visitedColor
                            : ui.map.unvisitedColor,
                        },
                        hover: {
                          fill: countriesVisited.includes(geo.id)
                            ? ui.map.hoverVisitedColor
                            : ui.map.hoverUnvisitedColor,
                        },
                      }}
                    />
                  </g>
                ))
              }
            </Geographies>
          </ComposableMapComponent>
        </Card>
      </motion.div>
    </Section>
  );
};

export default memo(Map);
export { Map };
