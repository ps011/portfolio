import React, {memo} from "react";
import {
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";
import {Tooltip} from "react-tooltip";

export const Map = ({countriesVisited}) => {

    return (
        <section className="text-center pb-0 bg-primary pt-4 ">
            <h3 className="text-center my-4 display-3 text-white">How much of the World I've seen so far?</h3>
            <div className="mx-auto my-2 container rounded" style={{background: "#92B4F2FF"}}>
                <ComposableMap projection="geoMercator">
                    <Geographies geography="https://res.cloudinary.com/designu/raw/upload/v1681593003/data/geo.json">
                        {({geographies}) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    stroke="#000000"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={geo.properties.name}
                                    style={{
                                        background: "#92b4f2",
                                        default: {
                                            fill: countriesVisited.includes(geo.id) ? "#e76b53" : "#f4f6f4"
                                        },
                                        hover: {
                                            fill: countriesVisited.includes(geo.id) ? "#e76b53" : "#bde0c2"
                                        }
                                    }}
                                />
                            ))
                        }
                    </Geographies>
                </ComposableMap>
                <Tooltip id="my-tooltip"></Tooltip>
            </div>
            <div className="">
                <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <polygon style={{fill: "#f4f5f7"}} points="2560 0 2560 100 0 100" />
                </svg>
            </div>
        </section>
    );
};

export default memo(Map);
