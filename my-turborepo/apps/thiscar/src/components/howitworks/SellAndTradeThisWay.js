import React from "react";
import "../../contents/scss/sellAndTradeThisWay.scss";
import Link from "next/link";
import { HowItWorksArrowSVG } from "../../contents/svgs/howItWorks";

const SellAndTradeThisWay = ({ details }) => {
    return (
        <div className="sell  py-4">
            <div className="">
                <div className="row mt-5">
                    <div className="col-lg-5 px-0 d-flex align-items-center">
                        <div className="left_banner ">
                            <div className="px-sm-0">
                                <h2>{details.mainHeading}</h2>
                                <div className="border_bottom"></div>
                                <p className="pt-3">{details.mainSubtext}</p>
                                <Link
                                    href={"/sell-trade"}
                                    passHref>
                                    <button className="btn btn-sm custom_btn float-start">
                                        {details.buttonLabel}
                                        <HowItWorksArrowSVG />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 px-0">
                        <div className="right_banner">
                            <div className="py-3">
                                <h2>{details.heading1}</h2>
                                <p>{details.subtext1}</p>
                            </div>
                            <div className="py-3">
                                <h2>{details.heading2}</h2>
                                <p>{details.subtext2}</p>
                            </div>
                            <div className="py-3">
                                <h2>{details.heading3}</h2>
                                <p>{details.subtext3}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellAndTradeThisWay;
