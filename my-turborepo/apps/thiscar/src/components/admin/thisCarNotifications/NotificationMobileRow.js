"use client";

import React from "react";

export const NotificationMobileRow = ({ index, notification, parentId, showNotificationLogs }) => {
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
                    className="accordion-item "
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
                                    <b>Dealer Name</b>
                                    <div> {notification?.dealerName || "N/A"}</div>
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
                                    Dealer Name
                                </label>
                            </div>
                            <div className="name">
                                <h4> {notification?.dealerName || "N/A"}</h4>
                            </div>
                        </div>

                        <div className="dealer-info">
                            <div className="heading">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    User
                                </label>
                            </div>
                            <div className="">
                                <h4>{notification?.contactName || "N/A"}</h4>
                            </div>

                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    VIN
                                </label>
                            </div>
                            <div className="">
                                <h4
                                    onClick={() =>
                                        showNotificationLogs(
                                            notification?.vin,
                                            notification?.id,
                                            notification.createdAt,
                                            notification.createdBy
                                        )
                                    }
                                    className="cursor-pointer fw-bold purple-text">
                                    {notification?.vin || "N/A"}
                                </h4>
                            </div>
                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Dealer stock#
                                </label>
                            </div>
                            <div className="name">
                                <h4> {notification?.stockId}</h4>
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

                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Attempt
                                </label>
                            </div>
                            <div className="name">
                                <h4>{addSuffix(notification.attempt) || "N/A"}</h4>
                            </div>

                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Status
                                </label>
                            </div>
                            <div className="notification-status">
                                <h4>
                                    <span
                                        className={`status-circle ${getNotificationColorForStatus(
                                            notification?.status,
                                            notification?.isResponseConflicted
                                        )} `}
                                    />
                                    {convertToTitleCase(notification.status) || "N/A"}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
};
