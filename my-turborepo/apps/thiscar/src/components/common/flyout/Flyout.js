"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "../../../contents/scss/flyout.scss";
import "../../../contents/scss/global_fonts.scss";
import { appConfig } from "../../../appConfig";
import { useContext } from "react";
import AppContext from "@/StateManagement/AppContext";
import {
    FlyoutCloseSmallSVG,
    FlyoutCloseMediumSVG,
    FlyoutCloseSVG,
    FlyoutRightArrowSVG,
    FlyoutBodySVG
} from "../../../contents/svgs/common";

function Flyout({ FlyoutData }) {
    const pathname = usePathname();
    const [isFlyoutOpened, setIsFlyoutOpened] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const dealerId = appConfig.DEALER_ID;
    const url = `https://www.routeone.net/digital-retail-ui/?dealerId=${dealerId}`;
    const { studioRoute } = useContext(AppContext);

    const openFlyout = () => {
        setIsFlyoutOpened(true);
    };
    const closeFlyout = () => {
        setIsFlyoutOpened(false);
    };
    const handleBackdropClick = (event) => {
        event.stopPropagation();
    };

    const handleFinancingInfo = () => {
        setIsFlyoutOpened(false);
        window.open(url, "_blank");
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth);
            //  studioRoute = window.location.pathname.includes("/studio/");

            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    return (
        <>
            {!isFlyoutOpened && FlyoutData.showFlyout && !studioRoute  && !pathname.includes("submit-response") &&(
                <button
                    type="button"
                    className="btn-flyout"
                    onClick={openFlyout}>
                    <h1> {FlyoutData.flyoutOpeningButton}</h1>
                    {/* APPLY FOR FINANCING  */}
                </button>
            )}

            {isFlyoutOpened && (
                <div
                    className="modal"
                    style={{ display: "block" }}
                    id="flyout-modal-dialog">
                    <div
                        className="modal-dialog modal-dialog-flyout modal-md"
                        onClick={handleBackdropClick}>
                        <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="modal-header col-lg-12 col-md-12 col-sm-12 col-12">
                                {windowWidth <= 575 && (
                                    <div className="row">
                                        <div className="col-4">
                                            <FlyoutCloseMediumSVG />
                                        </div>

                                        <div className="col-6">
                                            <h4>
                                                {FlyoutData?.flyoutHeading}
                                                {/* APPLY FOR FINANCING */}
                                            </h4>
                                        </div>
                                        <div className="col-2">
                                            <FlyoutCloseSmallSVG closeFlyout={closeFlyout} />
                                        </div>
                                    </div>
                                )}

                                {windowWidth >= 576 && (
                                    <div className="row">
                                        <div className="col-lg-9 col-md-9 col-sm-9">
                                            <h4>{FlyoutData?.flyoutHeading}</h4>
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-sm-3">
                                            <FlyoutCloseSVG closeFlyout={closeFlyout} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {window.innerWidth >= 576 && (
                                        <div
                                            className="col-lg-2 col-md-2 col-sm-2 col-2"
                                            style={{ display: "flex", justifyContent: "center" }}>
                                            <FlyoutBodySVG />
                                        </div>
                                    )}
                                    <div className="col-lg-10 col-md-10 col-sm-10 col-10">
                                        <p>{FlyoutData.flyoutBodyText}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-sm custom_btn"
                                    onClick={handleFinancingInfo}>
                                    {FlyoutData?.flyoutBodyButtonText}
                                    {/* Get Started */}
                                    <FlyoutRightArrowSVG />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Flyout;
