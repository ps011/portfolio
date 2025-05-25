import React, {memo} from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import { Tooltip } from "@mantine/core";
import Section from "../../components/tailwind/section";

export const Map = ({countriesVisited}) => {
    return (
        <Section id="map" background="primary" container={false}>
            <div className="container">
                <h3 className="text-center my-4 text-2xl text-neutralGray-900 dark:text-white">How much of the World I&apos;ve seen so
                    far?</h3>
                <div className="my-8 rounded bg-transparent md:w-4/5 mx-auto">
                    <ComposableMap projection="geoMercator" projectionConfig={{
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
                                                    fill: countriesVisited.includes(geo.id) ? "#e76b53" : "#f4f6f4",
                                                },
                                                hover: {
                                                    fill: countriesVisited.includes(geo.id) ? "#e76b53" : "#bde0c2",
                                                },
                                            }}
                                        />
                                    </Tooltip>
                                ))
                            }
                        </Geographies>
                    </ComposableMap>
                </div>
            </div>
        </Section>
    );
};

export default memo(Map);
