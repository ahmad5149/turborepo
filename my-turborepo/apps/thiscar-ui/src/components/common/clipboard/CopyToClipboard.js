"use-client";
import React from "react";
import copy from "clipboard-copy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../contents/scss/clipBoard.scss";
import { CopyToClipboardSVG } from "../../../contents/svgs/common";

const CopyToClipboard = ({ GenerateURL, fillColor = "", isMobile = true }) => {
    const message = "Link copied to clipboard!";
    const notify = () => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000, // milliseconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "custom-toast" // Add a custom class to the toast
        });
    };

    const handleCopyClick = () => {
        const url = GenerateURL();
        copy(url)
            .then(() => {
                notify();
                //alert("Text copied to clipboard");
            })
            .catch((err) => {
                console.error("Copy to clipboard failed:", err);
            });
    };

    return (
        <div className="d-flex">
            <ToastContainer
                toastClassName="custom-toast"
                bodyClassName="custom-toast-body"
                progressClassName="custom-toast-progress"
            />
            <button
                className={`btn-chng ${isMobile ? "share-btn-mobile" : "share-btn-desktop"}`}
                onClick={handleCopyClick}>
                <CopyToClipboardSVG fillColor={fillColor} />
            </button>
        </div>
    );
};

export default CopyToClipboard;
