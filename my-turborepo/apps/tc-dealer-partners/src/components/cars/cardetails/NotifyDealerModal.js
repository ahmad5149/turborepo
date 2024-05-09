import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import "../../../contents/scss/notifyDealer.scss";
import "../../../contents/scss/admin/inventory.scss";
import { submitDealer } from "@/app/api/addDealer";
import Swal from "sweetalert2";
import { appConfig } from "@/appConfig";
import sendPurchaseEmail from "../../../app/api/sendPurchaseEmail";
import { PDFViewer, Document, Page, View, Text, pdf } from "@react-pdf/renderer";
import { PDFDocument as PDFLibDocument } from "pdf-lib";
import PDFDocument from "./PDFDocument"; // Import from pdf-lib
import ReactDOMServer from "react-dom/server";

export function NotifyDealerModal({
    closeModal,
    vin,
    dealerStockNumber,
    popupData,
    saveNotification,
    carYear,
    carMake,
    carModel,
    userName,
    requestingDealerName,
    requestingDealerId,
    purchaseAgreement
}) {
    const [type, setType] = useState("purchase");
    const [title, setTitle] = useState(popupData.buyNowPopup.title);
    const [description, setDescription] = useState(popupData.buyNowPopup.description);
    const [isNotifyBtnEnabled, setIsNotifyBtnEnabled] = useState(false);

    useEffect(() => {
        if (description && description != "") {
            var modifiedMessage = description;
            if (modifiedMessage.includes("[YMM Dealer Stock #]")) {
                modifiedMessage = description.replace(
                    /\[YMM Dealer Stock #\]/g,
                    `${carYear} ${carMake} ${carModel} & Dealer Stock ${dealerStockNumber}`
                );
            } else if (modifiedMessage.includes("[YMM & DEALER STOCK #]")) {
                modifiedMessage = description.replace(
                    /\[YMM & DEALER STOCK #\]/g,
                    `${carYear} ${carMake} ${carModel} & Dealer Stock ${dealerStockNumber}`
                );
            } else if (modifiedMessage.includes("[YMM DEALER STOCK #]")) {
                modifiedMessage = description.replace(
                    /\[YMM DEALER STOCK #\]/g,
                    `${carYear} ${carMake} ${carModel} & Dealer Stock ${dealerStockNumber}`
                );
            } else if (modifiedMessage.includes("YMM Dealer Stock #")) {
                modifiedMessage = description.replace(
                    /YMM Dealer Stock #/g,
                    `${carYear} ${carMake} ${carModel} & Dealer Stock ${dealerStockNumber}`
                );
            } else if (modifiedMessage.includes("YMM & DEALER STOCK #")) {
                modifiedMessage = description.replace(
                    /YMM & DEALER STOCK #/g,
                    `${carYear} ${carMake} ${carModel} & Dealer Stock ${dealerStockNumber}`
                );
            } else if (modifiedMessage.includes("YMM DEALER STOCK #")) {
                modifiedMessage = description.replace(
                    /YMM DEALER STOCK #/g,
                    `${carYear} ${carMake} ${carModel} & Dealer Stock ${dealerStockNumber}`
                );
            }
            setDescription(modifiedMessage);
        }
    }, []);

    const generatePDF = () => {
        return <PDFDocument purchaseAgreement={purchaseAgreement} />;
    };

    const handleDealerMessageChange = (event) => {
        setDescription(event.target.value);
    };
    const handleSubmit = async () => {
        setIsNotifyBtnEnabled(true);
        const data = {
            vin: vin,
            type: type,
            description: description,
            dealerStockId: dealerStockNumber,
            userName: userName,
            requestingDealerId: requestingDealerId,
            requestingDealerName: requestingDealerName
        };

        Swal.fire({
            text: "Are you sure you want to purchase this car?",
            icon: "question",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            showConfirmButton: true, // hide the confirm button
            showCloseButton: false,
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                //Convert the PDF to base64 string
                //Start
                const pdfBlob = await pdf(generatePDF(purchaseAgreement)).toBlob();

                const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
                const base64Pdf = pdfBuffer.toString("base64");
                //End
                //Sending Email
                const emailData = {
                    to: appConfig.PURCHASE_CAR_EMAIL,
                    subject: "THISCAR PURCHASE REQUEST",
                    text: description,
                    pdfBuffer: base64Pdf
                };
                //Sending Notification
                await saveNotification(data).then(async (response) => {
                    if (response.status == 200) {
                        var resp = await sendPurchaseEmail(emailData);
                        setType(null);
                        setDescription(null);
                        closeModal();
                        Swal.fire({
                            text: "Notification has been sent successfully!",
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Okay",
                            showConfirmButton: false, // hide the confirm button
                            showCloseButton: false,
                            timer: 3000
                        }).then(async (result) => {
                            setIsNotifyBtnEnabled(false);
                        });
                    } else {
                        setType(null);
                        setDescription(null);
                        closeModal();
                        Swal.fire({
                            text: response.message ?? "Failed to send notification",
                            icon: "error",
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Close",
                            showConfirmButton: false, // hide the confirm button
                            showCloseButton: false,
                            timer: 3000
                        }).then(async (result) => {
                            setIsNotifyBtnEnabled(false);
                        });
                    }
                });
            } else if (result.isDismissed) {
                setIsNotifyBtnEnabled(false);
            }
        });
    };
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    return (
        <div
            className="modal-dialog-sm"
            style={{ display: "flex", zIndex: "1000" }}
            id="notifyDealer-modal">
            {/* <div className="modal-dialog modal-dialog-responsive"> */}
            <div className="notify-modal">
                <div className="notify-modal-content col-lg-12 col-md-12 col-sm-12 col-12">
                    <>
                        <div
                            className="notify-modal-header col-lg-12 col-md-12 col-sm-12 col-12 mt-1 mb-3"
                            style={{ display: "flex" }}>
                            <div className="heading col-lg-9 col-md-9 col-sm-9 col-9 ">
                                <h2>{title}</h2>
                            </div>
                            <div className="close col-lg-3 col-md-3 col-sm-3 col-3 mt-0 text-center">
                                <span onClick={closeModal}>
                                    {/* <span className="close" onClick={closeModal}> */}
                                    &times;
                                </span>
                            </div>
                        </div>
                        <div className="notify-modal-body col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 pb-0 sub_heading ">
                                <p

                                // className="form-control "
                                // rows="3"
                                // value={description}
                                // onChange={(event) => handleDealerMessageChange(event)}
                                // placeholder="Type your message for the dealer here"
                                >
                                    {description}
                                </p>
                            </div>

                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-sm-4 col-4 pb-3 sub_heading button-div flex">
                                    <button
                                        disabled={description == null || description == "" || isNotifyBtnEnabled}
                                        className="btn  back-btn w-100 notify-btn"
                                        onClick={handleSubmit}
                                        type="button">
                                        Confirm Purchase
                                    </button>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-4 pb-3 sub_heading button-div flex">
                                    <button
                                        onClick={closeModal}
                                        className="btn btn-div w-100"
                                        type="button">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
}
