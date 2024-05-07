"use client";

import React from "react";
import moment from "moment-timezone";

export const NotificationMobileRow = ({ index, notification, parentId }) => {
    const convertToTitleCase = (inputString) => {
        if (inputString === "24hourhold") {
            return "24hr hold";
        }
        return inputString?.charAt(0)?.toUpperCase() + inputString?.slice(1)?.toLowerCase();
    };

    const getNotificationColorForType = (value) => {
        if (value != null) {
            value = value.replace(/\s/g, ""); // Removes spaces - 24 hour hold

            switch (value.toLowerCase()) {
                case "available":
                    return "type-available";
                case "24hourhold" || "24 hour hold": {
                    return "type-hour-hold";
                }
                case "purchase":
                    return "type-purchase";
                default:
                    return "type-default";
            }
        } else {
            return "type-default";
        }
    };

    function addSuffix(number) {
        if (number === undefined || number === null) {
            return "N/A";
        }

        const suffixes = ["th", "st", "nd", "rd"];
        const remainderTen = number % 10;
        const remainderHundred = number % 100;

        return number + suffixes[remainderTen <= 3 && remainderHundred !== 11 ? remainderTen : 0];
    }

    const convertDateToLocalTime = (date) => {
        if (!date) return null;
        const utcDate = moment.utc(date, "MMM D, YYYY, h:mm:ss A");
        const localDate = utcDate.local();
        const formattedDateTime = localDate.format("MMM D, YYYY, h:mm A");
        return formattedDateTime;
    };
    const getNotificationColorForStatus = (status, conflictedStatus = false) => {
        if (conflictedStatus === true) {
            return "status-conflicted"; // Apply a specific class for conflicted status
        }

        if (status != null) {
            switch (status.toLowerCase()) {
                case "accepted":
                    return "status-accepted";
                case "submitted":
                    return "status-submitted";
                case "expired":
                    return "status-expired";
                case "declined":
                    return "status-declined";
                default:
                    return "status-default";
            }
        } else {
            return "status-default";
        }
    };

    return (
        <tr key={index}>
            <td className="text-start pe-0">
                <div
                    className="accordion-item"
                    key={index}>
                    <h2
                        className="accordion-header"
                        id={`heading-${index}`}>
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${index}`}
                            aria-expanded="true"
                            aria-controls={`collapse-${index}`}>
                            <div>
                                <div>
                                    <b> Requesting Dealer</b>
                                    <div> {notification?.requestingDealerName || "N/A"}</div>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div
                        id={`collapse-${index}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`heading-${index}`}
                        data-bs-parent={parentId}>
                        <div>
                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Requesting Dealer
                                </label>
                            </div>
                            <div className="name">
                                <h4> {notification?.requestingDealerName || "N/A"}</h4>
                            </div>
                        </div>

                        <div className="dealer-info">
                            <div className="heading">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Inventory Owner
                                </label>
                            </div>
                            <div className="">
                                <h4>{notification?.dealerName || "N/A"}</h4>
                            </div>
                            <div className="heading">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    User
                                </label>
                            </div>
                            <div className="">
                                <h4>{notification?.userName || "N/A"}</h4>
                            </div>

                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    VIN
                                </label>
                            </div>
                            <div>
                                <h4 className="cursor-pointer fw-bold purple-text">{notification?.vin || "N/A"}</h4>
                            </div>
                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Dealer stock#
                                </label>
                            </div>
                            <div className="name">
                                <h4> {notification?.dealerStockId}</h4>
                            </div>

                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Type
                                </label>
                            </div>
                            <div className="notification-type">
                                <h4
                                    className={`py-1 px-3 d-inline fw-bold oval ${getNotificationColorForType(
                                        notification.type
                                    )}`}>
                                    {convertToTitleCase(notification.type) || "N/A"}
                                </h4>
                            </div>
                            <div className="heading mt-4">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Status
                                </label>
                            </div>
                            <div className="name">
                                <h4>
                                    {" "}
                                    {notification?.offsiteStatus === "saleConfirmed" ? (
                                        <p>Sale Confirmed</p>
                                    ) : notification?.offsiteStatus === "vehicleUnavailable" ? (
                                        <p>No Sale</p>
                                    ) : (
                                        "N/A"
                                    )}
                                </h4>
                            </div>
                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Sent Date
                                </label>
                            </div>
                            <div className="name">
                                <h4> {notification?.createdAt || "N/A"}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
};
