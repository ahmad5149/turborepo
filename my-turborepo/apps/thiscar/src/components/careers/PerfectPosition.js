import React from "react";
import "../../contents/scss/perfectPosition.scss";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { CareersImage } from "../common/defaultImage/DefaultPaths";
import { SanityImage } from "@/sanity/SanityImage";

function PerfectPosition(props) {
    return (
        <div className="bg-grey-career">
            <SanityImage
                src={props.perfectPosition.image}
                defaultImage={GetDefaultImagePath(CareersImage)}
                alt=""
                height={1250}
                width={500}
                className="image"></SanityImage>
            <div className="bg-career">
                <h2>{props.perfectPosition.heading}</h2>
                <p>{props.perfectPosition.subtext}</p>
            </div>
        </div>
    );
}

export default PerfectPosition;
