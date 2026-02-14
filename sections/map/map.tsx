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

const ComposableMapComponent = ComposableMap as React.ComponentType<{
  projection?: string;
  projectionConfig?: { center: [number, number]; scale: number };
  children?: React.ReactNode;
}>;

const Map = ({ countriesVisited }: { countriesVisited: string[] }) => {
  return (
    <Section id="map" container heading="How much of the World I've seen so far?">
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
              center: [0, 40],
              scale: 130,
            }}
          >
            <Geographies geography="https://res.cloudinary.com/designu/raw/upload/v1681593003/data/geo.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <g key={geo.rsmKey}>
                    <title>{geo.properties.name}</title>
                    <Geography
                      geography={geo}
                      stroke="#000000"
                      style={{
                        default: {
                          fill: countriesVisited.includes(geo.id)
                            ? "#e76b53"
                            : "#f4f6f4",
                        },
                        hover: {
                          fill: countriesVisited.includes(geo.id)
                            ? "#e76b53"
                            : "#bde0c2",
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
