import React from "react";
import "../../contents/scss/buyThisWay.scss";
import { WorkCarPath } from "../common/defaultImage/DefaultPaths";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { SanityImage } from "@/sanity/SanityImage";
import Link from "next/link";
import { HowItWorksArrowSVG } from "../../contents/svgs/howItWorks";

function BuyThisWay({ buyThisWay }) {
    return (
        <>
            <div className="How_it_works_banner text-center">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 px-0">
                            <div className="work-banner">
                                <h2>How THIS Works</h2>
                                <a
                                    className="btn btn-sm custom_btn"
                                    target="_blank"
                                    href="https://www.youtube.com/watch?v=1PxojGdJxRQ&t=2s">
                                    {buyThisWay.aboutUsVideo}
                                    <HowItWorksArrowSVG />
                                </a>
                                <SanityImage
                                    className=""
                                    src={buyThisWay.image}
                                    defaultImage={GetDefaultImagePath(WorkCarPath)}
                                    alt=""
                                    sizes="100vw"
                                    style={{
                                        width: "100%",
                                        height: "auto"
                                    }}
                                    width={1000}
                                    height={800}
                                />
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6 col-sm-12 offset-xl-1 right-side">
                            <div
                                className="left_banner
        ">
                                <div className="px-sm-0 pt-sm-5">
                                    <h2>{buyThisWay.heading}</h2>
                                    <p>{buyThisWay.subtext}</p>
                                    <Link
                                        href={"/cars"}
                                        className="nav-anchor"
                                        passHref>
                                        <button className="btn btn-sm custom_btn">
                                            Find your car
                                            <HowItWorksArrowSVG />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BuyThisWay;
