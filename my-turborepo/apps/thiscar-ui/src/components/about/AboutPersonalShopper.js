"use client";
import React, { useEffect, useContext } from "react";
import AppContext from "@/StateManagement/AppContext";
import "../../contents/scss/aboutPersonalShopper.scss";
import { AboutPersonalShopperSVG } from "../../contents/svgs/about";

function AboutPersonalShopper({ aboutPersonalShopper }) {
    const { openQoreAI, loadQoreAI, setQoreAIActivated } = useContext(AppContext);

    useEffect(() => {
        loadQoreAI();
        setQoreAIActivated(false);
    }, []);

    return (
        <>
            <div className="container text-center">
                <div className="row my-1">
                    <div className="col-lg-7 col-sm-6 col-md-6 m-auto aboutPersonalShopper ">
                        <h2>{aboutPersonalShopper.personalShopperSpecialization}</h2>
                        <button
                            className="btn btn-sm mt-4 shopper-btn custom_btn"
                            onClick={openQoreAI}>
                            {aboutPersonalShopper.knowAboutYourShopper}
                            <AboutPersonalShopperSVG />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AboutPersonalShopper;
