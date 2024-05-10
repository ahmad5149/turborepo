"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Popup from "reactjs-popup";
import "../../../contents/scss/global_fonts.scss";
import "../../../contents/scss/popUp.scss";
import AppContext from "@/StateManagement/AppContext";
import { PopupCloseSVG, PopupButtonCloseSVG } from "../../../contents/svgs/common";

const PopUp = (props) => {
    const pathname = usePathname();
    const popupRef = useRef(null);
    const [shouldShowPopup, setShouldShowPopup] = useState(false);
    const [closePopup, setPopup] = useState(true);
    const { studioRoute } = useContext(AppContext);

    useEffect(() => {
        const hasPopupDisplayed = document.cookie.includes("popupDisplayed=true");
        const isSessionActive = sessionStorage.getItem("sessionActive") === "true";

        if (!isSessionActive) {
            if (!hasPopupDisplayed) {
                setShouldShowPopup(true);
                document.cookie = "popupDisplayed=true; path=/";
                setPopup(true);
            }
        }

        const handleBeforeUnload = () => {
            sessionStorage.removeItem("sessionActive");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const handleClosePopup = (event) => {
        if (
            event.target.classList.contains("btn-close") ||
            event.target.classList.contains("close_btn_track") ||
            event.target.closest("svg")
        ) {
            setShouldShowPopup(false);
            popupRef.current.close();
            document.body.style.overflow = "auto";
        }
    };
    useEffect(() => {
        const handleTouchMove = (event) => {
            if (shouldShowPopup && closePopup && !studioRoute) {
                event.preventDefault();
            }
        };

        if (shouldShowPopup && popupRef.current && closePopup && !studioRoute) {
            popupRef.current.open();
            // Disable scrolling on the entire page
            document.body.style.overflow = "hidden";
            document.addEventListener("touchmove", handleTouchMove, { passive: false }); //for iphone scrolling disable
        } else {
            // Re-enable scrolling when the popup is closed
            document.body.style.overflow = "auto";
            document.removeEventListener("touchmove", handleTouchMove, { passive: true }); //for iphone scrolling enable
        }

        // Cleanup function to ensure scrolling is re-enabled
        return () => {
            document.body.style.overflow = "auto";
            document.removeEventListener("touchmove", handleTouchMove, { passive: true });
        };
    }, [shouldShowPopup]);

    return (
        shouldShowPopup &&
        closePopup &&
        props.popupHeadlines.showPopUp &&
        !studioRoute && !pathname.includes("submit-response") &&
        (
            <Popup
                ref={popupRef}
                trigger={<div />}
                modal
                closeOnDocumentClick={false}>
                {(close) => (
                    <div className="modal-dialog-popup">
                        <div className="popup-content">
                            <div className="popup-header">
                                <PopupCloseSVG handleClosePopup={handleClosePopup} />
                            </div>
                            <div className="popup-body">
                                <p>
                                    {props.popupHeadlines.firstHeadline}
                                    {/* MEMORIAL DAY SPECIAL! FREE SHIPPING TO OUR HQ LOCATION IN
                TOMBALL TX. */}
                                </p>
                                <p>
                                    {props.popupHeadlines.secondHeadline}

                                    {/* SHIPPING FREE FOR ALL SALES MAY 15-31. */}
                                </p>
                            </div>
                            <div className="popup-footer">
                                <button
                                    className="btn btn-sm custom_btn close_btn_track"
                                    onClick={(event) => handleClosePopup(event)}>
                                    {props.popupHeadlines.closePopUpButtonLabel}
                                    {/* Close */}
                                    <PopupButtonCloseSVG />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        )
    );
};

export default PopUp;
