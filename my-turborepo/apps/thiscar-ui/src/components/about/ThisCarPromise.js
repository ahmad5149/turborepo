import React from "react";
import "../../contents/scss/thisCarPromise.scss";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { PromisePath } from "../common/defaultImage/DefaultPaths";
import { SanityImage } from "@/sanity/SanityImage";

const ThisCarPromise = (props) => {
    return (
        <>
            <div className="container mt-5 pt-sm-5 thisCarPromise text-center">
                <p>{props.thisCarPromise.title}</p>
                <h2>{props.thisCarPromise.heading1}</h2>
                <h2>{props.thisCarPromise.heading2}</h2>
                <h2>{props.thisCarPromise.heading3}</h2>
                <div className="text-start">
                    <SanityImage
                        src={props.thisCarPromise.image}
                        defaultImage={GetDefaultImagePath(PromisePath)}
                        alt=""
                        sizes="100vw"
                        style={{
                            width: "100%",
                            height: "auto"
                        }}
                        width={1000}
                        height={600}
                    />
                </div>
            </div>
        </>
    );
};

export default ThisCarPromise;
