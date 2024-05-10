"use client";
import React, { useEffect, useContext } from "react";
import AppContext from "@/StateManagement/AppContext";
import "../../contents/scss/howItWorksPersonalShopper.scss";
import bg from "../../../public/media/footer_new_bg.png";
import { FooterNewBgPath } from "../common/defaultImage/DefaultPaths";
import { SanityImageURL } from "@/sanity/Sanity";
import { HowItWorksArrowSVG } from "../../contents/svgs/howItWorks";

const HowItWorksPersonalShopper = (props) => {
    const { openQoreAI, loadQoreAI, setQoreAIActivated } = useContext(AppContext);

    useEffect(() => {
        loadQoreAI();
        setQoreAIActivated(false);
    }, []);
    return (
        <div className="footer_work">
            <div
                className="bg-image-footer"
                style={{
                    backgroundImage: `url(${
                        props.personalShopper.personalShopperImage
                            ? SanityImageURL(props.personalShopper.personalShopperImage, FooterNewBgPath)
                            : bg.src
                    })`
                }}>
                <button
                    onClick={() => {
                        openQoreAI();
                    }}
                    className="btn btn-sm custom_btn  d-flex justify-content-center">
                    {props.personalShopper.buttonLabel}
                    <HowItWorksArrowSVG />
                </button>
            </div>
        </div>
    );
};

export default HowItWorksPersonalShopper;
