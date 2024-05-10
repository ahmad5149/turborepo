"use client";
import React, { useEffect, useContext } from "react";
import AppContext from "@/StateManagement/AppContext";
import "../../../contents/scss/supportBanner.scss";

function ChatSection(props) {
    const { openQoreAI, loadQoreAI, setQoreAIActivated } = useContext(AppContext);

    useEffect(() => {
        loadQoreAI();
        setQoreAIActivated(false);
    }, []);
    return (
        <div className="col-lg-3 col-md-12 col-sm-12 support_right px-3">
            <div className="card bg-yellow-card">
                <h2>{props.chatSection.heading}</h2>

                <p className="mb-4">{props.chatSection.description}</p>
                <p className="mt-2 mb-2">
                    <span className="me-2">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4 7L10.0245 12.2714C11.1556 13.2611 12.8444 13.2611 13.9755 12.2714L20 7"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <rect
                                x="3"
                                y="6"
                                width="18"
                                height="13"
                                rx="2"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    {props.chatSection.email}
                </p>
                <p className="mt-1 mb-3">
                    <span className="me-2">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.55076 4.99441L7.70276 5.52441L8.55076 4.99441L6.91172 2.37196C6.30061 1.39419 4.99151 1.1343 4.05325 1.80449L4.63449 2.61822L4.05325 1.80449L2.32092 3.04187C1.43722 3.67308 1.04255 4.78951 1.33321 5.83586C2.80514 11.1348 6.66568 15.4433 11.7719 17.4858L13.1768 18.0477C14.0863 18.4115 15.1184 18.2872 15.9154 17.7179L17.4696 16.6078C18.5704 15.8215 18.5893 14.192 17.5071 13.3803L15.0944 11.5708L14.4944 12.3708L15.0944 11.5708C14.4884 11.1163 13.6776 11.0432 13 11.382L11.8421 11.9609C11.4571 12.1534 10.9922 12.0779 10.6878 11.7736L8.22641 9.3122C7.92205 9.00784 7.8466 8.54287 8.03909 8.15788L8.64361 6.94884C8.9552 6.32566 8.92002 5.58524 8.55076 4.99441Z"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    {props.chatSection.phoneNumber}
                </p>
                <div className="sp-btn-right">
                    <button
                        className="btn btn-sm custom_btn custom_fill mt-3 hover_btn"
                        onClick={openQoreAI}>
                        {props.chatSection.buttonLabel}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.8666 4C10.3605 4 8.41366 4.56795 6.9764 5.54676C5.53192 6.53049 4.672 7.88257 4.27294 9.31439C3.87748 10.7333 3.93516 12.2218 4.29544 13.529C4.58343 14.5739 5.07972 15.5548 5.75013 16.3087L4.98181 18.397C4.50238 19.7001 5.89821 20.899 7.11402 20.2284L10.0371 18.6161C11.0064 18.8201 12.952 19.0925 15.2599 18.6373C19.1674 17.8666 21.2075 14.1612 20.983 10.7723C20.8689 9.05071 20.1754 7.34119 18.8005 6.06184C17.4193 4.77653 15.4313 4 12.8666 4Z"
                                stroke="#E2E42B"
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                </div>
                <p className="mt-5">{props.chatSection.subText}</p>
            </div>
        </div>
    );
}

export default ChatSection;
