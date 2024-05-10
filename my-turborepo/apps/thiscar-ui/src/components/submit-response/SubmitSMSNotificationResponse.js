"use client";
import { useEffect, useState } from "react";
import "../../contents/scss/submitNotificationResponse.scss";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

function SubmitSMSNotificationResponse({
    notificationId,
    notificationLogId,
    attempt,
    responseValue,
    via,
    type,
    headings
}) {
    const [showSMSNotificationResponse, setShowSMSNotificationResponse] = useState(false);
    const router = useRouter();
    const [responseSubmitted, setResponseSubmitted] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false); // State to track button disable/enable
    const [lastClickedButton, setLastClickedButton] = useState(null);

    const baseURL = process.env.NEXT_PUBLIC_SUBMIT_RESPONSE_URL; //FIREBASE_NOTIFICATION_RESPONSE;
    const url = `${baseURL}?notificationId=${notificationId}&notificationLogId=${notificationLogId}&attempt=${attempt}&via=${via}`;

    useEffect(() => {
        const sendNotification = async () => {
            setShowSMSNotificationResponse(true);
            setResponseSubmitted(false);
            setButtonsDisabled(false);
        };

        sendNotification();
    }, [responseValue, url, router]);

    return (
        <div
            className="form-container-wrapper"
            style={{ overflowY: "auto", maxHeight: "87vh" }}>
            <div
                className="form-container"
                style={{ width: "80%", marginLeft: "auto", marginRight: "auto", paddingTop: 25 }}>
                <h3
                    className="mt-5"
                    style={{ fontSize: "1.6rem", textAlign: "center" }}>
                    {headings.submitResponseHeading}
                </h3>
                <p
                    className="mt-5"
                    style={{ fontSize: "1rem", textAlign: "center", width: "100%" }}>
                    <b>{headings.submitResponseSubHeading}</b>{" "}
                </p>
                {showSMSNotificationResponse && (
                    <SMSNotificationResponse
                        closeModal={() => setShowSMSNotificationResponse(false)}
                        responseValue={responseValue}
                        url={url}
                        router={router}
                        type={type}
                        setResponseSubmitted={setResponseSubmitted}
                        responseSubmitted={responseSubmitted}
                        setButtonsDisabled={setButtonsDisabled}
                        buttonsDisabled={buttonsDisabled}
                        lastClickedButton={lastClickedButton}
                        setLastClickedButton={setLastClickedButton}
                    />
                )}
            </div>
        </div>
    );
}

export default SubmitSMSNotificationResponse;

export function SMSNotificationResponse({
    closeModal,
    responseValue,
    url,
    router,
    type,
    setResponseSubmitted,
    responseSubmitted,
    setButtonsDisabled,
    buttonsDisabled,
    lastClickedButton,
    setLastClickedButton
}) {
    const [textareaValue, setTextareaValue] = useState("");
    const [error, setError] = useState(false);
    const [acceptResponseLoading, setAcceptLoading] = useState(false);
    const [rejectResponseLoading, setRejectLoading] = useState(false);
    //  const [lastClickedButton, setLastClickedButton] = useState(null); // State to track the last clicked button

    let buttonTextYes = "Accept";
    let buttonTextNo = "Reject";

    switch (type) {
        case "available":
            buttonTextYes = "Is Available";
            buttonTextNo = "Not Available";
            break;

        case "24hourhold":
            buttonTextYes = "Hold Confirmed";
            buttonTextNo = "No Hold";
            break;

        case "purchase":
            buttonTextYes = "Sale Confirmed";
            buttonTextNo = "No Sale";
            break;

        default:
            break;
    }

    // const buttonTextYes =
    //     type === "available"
    //         ? "Is Available"
    //         : type === "24hourhold"
    //         ? "24 Hour Hold"
    //         : type === "purchase"
    //         ? "Purchase"
    //         : "Submit";

    // Define the button text based on the 'type' prop for No
    // const buttonTextNo =
    //     type === "available"
    //         ? "Not Available"
    //         : type === "24hourhold"
    //         ? "Not 24 Hour Hold"
    //         : type === "purchase"
    //         ? "Not Purchase"
    //         : "Submit";

    const handleTextareaChange = (event) => {
        setTextareaValue(event.target.value);
    };

    const handleSubmit = async (responseType) => {
        if (buttonsDisabled) {
            // If buttons are already disabled, do nothing
            return;
        }

        let loadingStateSetter, buttonText;

        if (responseType === "yes") {
            loadingStateSetter = setAcceptLoading;
            buttonText = "Accept";
        } else {
            loadingStateSetter = setRejectLoading;
            buttonText = "Reject";
        }

        loadingStateSetter(true);
        setLastClickedButton(responseType);
        setButtonsDisabled(true); // Disable both buttons after one is clicked
        setError(false);

        try {
            if (responseType === "no" && !textareaValue.trim()) {
                // If rejecting and textarea is empty, show error
                setError(true);
                return;
            }

            const body = JSON.stringify({ type: responseType, response: textareaValue ? textareaValue : "N/A" });

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            });

            if (response.status === 200) {

                Swal.fire({
                    title: "Thank You! Response captured successfully",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Okay",
                    showConfirmButton: false,
                    customClass: {
                        popup: "custom-alert"
                    },
                    timer: 6000
                }).then(() => {
                    // Enable both buttons after Swal is closed
                    setButtonsDisabled(false);
                    setLastClickedButton(null);
                    setTextareaValue("");
                    setError(false);
                    setResponseSubmitted(true);
                });
            } else {
                Swal.fire({
                    title: "Failed to capture response!",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Close",
                    showConfirmButton: false,
                    customClass: {
                        popup: "custom-alert"
                    },
                    timer: 6000
                }).then(() => {
                    // Enable both buttons after Swal is closed
                    setButtonsDisabled(false);
                    setLastClickedButton(null);
                });
            }
        } catch (error) {
            console.log("There was a problem with the fetch operation:", error);
            setError(true);
            Swal.fire({
                title: "Failed to capture response!",
                icon: "error",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Close",
                showConfirmButton: false,
                customClass: {
                    popup: "custom-alert"
                },
                timer: 6000
            }).then(() => {
                // Enable both buttons after Swal is closed
                setButtonsDisabled(false);
                setLastClickedButton(null);
            });
        } finally {
            loadingStateSetter(false);

            // Reset state regardless of success or failure
            setButtonsDisabled(false);
            setLastClickedButton(null);

            // If there was an error, set the error state to true
            if (error) {
                setError(true);
            }
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    return (
        <div className="notification-response mt-5">
            <div className="form-container">
                <div className="d-flex align-items-center mt-4">
                    <textarea
                        type="text"
                        placeholder="Enter details..."
                        value={textareaValue}
                        onChange={handleTextareaChange}
                        rows={3}
                    />
                </div>
                {error && (
                    <div
                        className="error-message"
                        style={{ color: "red" }}>
                        <span>*Please provide specific details. </span>
                        <br />
                        <span>*Also, indicate availability later if applicable</span>
                    </div>
                )}
                <div className="d-flex justify-content-center mt-3">
                    <div
                        className="d-flex justify-content-center flex-column flex-md-row"
                        style={{ width: "100%" }}>
                        <div className="mx-3 mt-2 mb-3">
                            <button
                                type="button"
                                className="custom_btn accept_btn cursor-pointer"
                                onClick={() => handleSubmit("yes")}
                                disabled={buttonsDisabled}>
                                {acceptResponseLoading ? "Submitting..." : buttonTextYes}
                            </button>
                        </div>
                        <div className="mx-3 mt-2">
                            <button
                                type="button"
                                className="custom_btn reject_btn cursor-pointer"
                                onClick={() => handleSubmit("no")}
                                disabled={buttonsDisabled}>
                                {rejectResponseLoading ? "Submitting..." : buttonTextNo}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
