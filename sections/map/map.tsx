import React, {memo} from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import {Tooltip} from "react-tooltip";
import Section from "../../components/tailwind/section";

export const Map = ({countriesVisited}) => {

    return (
        <Section id="map" background="primary" container={false}>
            <div className="tw-container">
                <h3 className="tw-text-center tw-my-4 tw-text-2xl tw-text-white">How much of the World I&apos;ve seen so
                    far?</h3>
                <div className="tw-my-8 tw-rounded tw-bg-blue-300 md:tw-w-4/5 tw-mx-auto">
                    <ComposableMap projection="geoMercator" projectionConfig={{
                        center: [0, 40],
                        scale: 130,
                    }}>
                        <Geographies
                            geography="https://res.cloudinary.com/designu/raw/upload/v1681593003/data/geo.json">
                            {({geographies}) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        stroke="#000000"
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={geo.properties.name}
                                        style={{
                                            default: {
                                                fill: countriesVisited.includes(geo.id) ? "#e76b53" : "#f4f6f4",
                                            },
                                            hover: {
                                                fill: countriesVisited.includes(geo.id) ? "#e76b53" : "#bde0c2",
                                            },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>
                    </ComposableMap>
                    <Tooltip id="my-tooltip"></Tooltip>
                </div>
            </div>
        </Section>
    );
};

export default memo(Map);
