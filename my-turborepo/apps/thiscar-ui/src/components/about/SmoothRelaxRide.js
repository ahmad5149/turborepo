import React from "react";
import "../../contents/scss/smoothRelaxRide.scss";
import { RelaxImagePath } from "../common/defaultImage/DefaultPaths";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { SanityImage } from "@/sanity/SanityImage";
import Link from "next/link";
import { SmoothRelaxRideSVG } from "../../contents/svgs/about";

const SmoothRelaxRide = (props) => {
    return (
        <>
            <div className="container my-5 aboutSmoothRelaxRide">
                <div className="row">
                    <div className="col-sm-6 happinees_guaranteed">
                        <SanityImage
                            src={props.smoothRelaxRide.image}
                            defaultImage={GetDefaultImagePath(RelaxImagePath)}
                            alt=""
                            className="image-demensions"
                            width={1200}
                            height={800}
                        />
                    </div>
                    <div className="col-sm-6 my-4 my-sm-0 my-md-4 paragraph-padding">
                        <h2 className="text-start">{props.smoothRelaxRide.heading}</h2>
                        <p className="">{props.smoothRelaxRide.description}</p>
                        <Link
                            href={`/cars`}
                            className="link">
                            <button className="btn btn-sm custom_btn float-start btn-width-about">
                                Get Started
                                <SmoothRelaxRideSVG />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SmoothRelaxRide;
