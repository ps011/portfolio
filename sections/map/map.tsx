import React, {memo} from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import { Tooltip } from "@mantine/core";
import Section from "../../components/tailwind/section";

// Type assertion to fix React 19 compatibility
const ComposableMapComponent = ComposableMap as React.ComponentType<any>;

export const Map = ({countriesVisited}) => {
    return (
        <Section id="map" background="primary" container={false}>
            <div className="container">
                <h3 className="text-center my-4 text-2xl text-tertiary-900 dark:text-white">How much of the World I&apos;ve seen so
                    far?</h3>
                <div className="my-8 rounded bg-transparent md:w-4/5 mx-auto">
                    <ComposableMapComponent projection="geoMercator" projectionConfig={{
                        center: [0, 40],
                        scale: 130,
                    }}>
                        <Geographies
                            geography="https://res.cloudinary.com/designu/raw/upload/v1681593003/data/geo.json">
                            {({geographies}) =>
                                geographies.map((geo) => (
                                    <Tooltip key={geo.rsmKey + "-tooltip"} label={geo.properties.name} withArrow>
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            stroke="#000000"
                                            style={{
                                                default: {
                                                    fill: countriesVisited.includes(geo.id) ? "var(--theme-primary-500)" : "var(--theme-tertiary-100)",
                                                },
                                                hover: {
                                                    fill: countriesVisited.includes(geo.id) ? "var(--theme-primary-600)" : "var(--theme-tertiary-300)",
                                                },
                                            }}
                                        />
                                    </Tooltip>
                                ))
                            }
                        </Geographies>
                    </ComposableMapComponent>
                </div>
            </div>
        </Section>
    );
};

export default memo(Map);
