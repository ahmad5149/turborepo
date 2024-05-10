"use client";
import AppContext from "@/StateManagement/AppContext";
import React, { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import "../../../contents/scss/chatButton.scss";
import { ChatButtonSVG } from "../../../contents/svgs/common";

function chatButton({ ChatFlyoutData }) {
    //  const [isChatOpened, setIsChatOpened] = useState(false);
    const { openQoreAI, loadQoreAI, setQoreAIActivated, studioRoute } = useContext(AppContext);
    //  var studioRoute;
    useEffect(() => {
        loadQoreAI();
        setQoreAIActivated(false);
    }, []);

    const handleChatButtonClick = () => {
        //    setIsChatOpened(!isChatOpened);
        openQoreAI();
    };

    return (
        <>
            {ChatFlyoutData?.showChatButton && !studioRoute && (
                <a onClick={handleChatButtonClick}>
                    <div className="d-flex flex-column justify-content-center align-items-center chat-bg-yellow">
                        <ChatButtonSVG />
                        <div className="chat-btn-text">
                            <h1>{ChatFlyoutData?.chatButtonLabel}</h1>
                            {/* <h1>ASK US</h1> */}
                        </div>
                    </div>
                </a>
            )}
        </>
    );
}
export default chatButton;
