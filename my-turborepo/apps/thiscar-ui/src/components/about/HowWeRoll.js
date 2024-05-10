import React from "react";
import "../../contents/scss/howWeRoll.scss";
import { ThisBgPath } from "../common/defaultImage/DefaultPaths";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { SanityImage } from "@/sanity/SanityImage";

const HowWeRoll = ({ details }) => {
    return (
        <>
            <div className="container-fluid thisRoll">
                <div className="container-xl px-4">
                    <div className="row py-5">
                        <div className="col-lg-6 mb-5 mb-lg-0 howRoll">
                            <h2>
                                <span className="this-img">
                                    <SanityImage
                                        src={details.headingImg}
                                        defaultImage={GetDefaultImagePath(ThisBgPath)}
                                        alt=""
                                        className="img-dimensions"
                                        width={100}
                                        height={40}
                                    />{" "}
                                    <span>{details.imageText}</span>
                                </span>{" "}
                                {details.mainHeading}
                            </h2>
                        </div>
                        <div className="col-lg-6 ps-5 howRollDetail">
                            <h2 className="text-start">{details.heading1}</h2>
                            <p className="text-start">{details.subtext1}</p>
                            <h2 className="text-start">{details.heading2}</h2>
                            <p className="text-start">{details.subtext2}</p>
                            <h2 className="text-start">{details.heading3}</h2>
                            <p className="text-start">{details.subtext3}</p>
                            <h2 className="text-start">{details.heading4}</h2>
                            <p className="text-start">{details.subtext4}</p>
                            <h2 className="text-start">{details.heading5}</h2>
                            <p className="text-start">{details.subtext5}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HowWeRoll;
