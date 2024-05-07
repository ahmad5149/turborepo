"use client";
import { useEffect, useState } from "react";
import "../../contents/scss/submitNotificationResponse.scss";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

function SubmitNotificationResponse({ notificationId, notificationLogId, attempt, responseValue, via, headings }) {
    const [showNotificationResponse, setShowNotificationResponse] = useState(false);
    const router = useRouter();
    const baseURL = process.env.NEXT_PUBLIC_SUBMIT_RESPONSE_URL; //FIREBASE_NOTIFICATION_RESPONSE;
    // const url ="https://us-central1-development-390801.cloudfunctions.net/notificationProcessing?notificationId=pVokR8NlTVPwXJfEWAgK&notificationLogId=YK2wphCifq91ONK4LE2O&attempt=1&via=EMAIL";
    // const baseURL = "https://localhost:3000/admin/notifications/submitNotificationResponse";
    const url = `${baseURL}?notificationId=${notificationId}&notificationLogId=${notificationLogId}&attempt=${attempt}&via=${via}`;

    useEffect(() => {
        const sendNotification = async () => {
            // console.log("Response:", responseValue);

            if (responseValue?.toLowerCase() === "yes" || responseValue?.toLowerCase() === "no") {
                setShowNotificationResponse(true);
            }
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
                {showNotificationResponse && (
                    <NotificationResponse
                        closeModal={() => setShowNotificationResponse(false)}
                        responseValue={responseValue}
                        url={url}
                        router={router}
                    />
                )}
            </div>
        </div>
    );
}

export default SubmitNotificationResponse;

export function NotificationResponse({ closeModal, responseValue, url, router }) {
    const [textareaValue, setTextareaValue] = useState("");
    const [error, setError] = useState(false); // State to track empty textarea error
    const [loading, setLoading] = useState(false);

    const handleTextareaChange = (event) => {
        setTextareaValue(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true); // Set loading to true when the submit button is clicked
        setError(false);
        try {
            // const body = JSON.stringify({ type: "No", response: "No response!" });
            //   const body = JSON.stringify({ type: "No", response: textareaValue });
            if (responseValue.toLowerCase() === "no" && !textareaValue.trim()) {
                setError(true);
                setLoading(false);
                // If responseValue is "No" and text field is empty, prevent submission
                return;
            }
            const body = JSON.stringify({
                type: responseValue.toLowerCase(),
                response: textareaValue ? textareaValue : "N/A"
            });
            const response = await fetch(url, {
                method: "POST",
                // mode: "no-cors",
                headers: {
                    "Content-Type": "application/json" // Specify the content type
                },
                body: body
            });

            if (response.status === 200) {

                // Show success message
                Swal.fire({
                    title: "Thank You! Response captured successfully",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Okay",
                    showConfirmButton: false,
                    customClass: {
                        popup: "custom-alert" // Apply the custom class here
                    },
                    timer: 6000
                }).then(() => {
                    //   window.location.href = "/";

                    // Redirect to home page
                    router.push("/");
                });
            } else {
                // Handle failure
                Swal.fire({
                    title: "Failed to capture response!",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Close",
                    showConfirmButton: false,
                    customClass: {
                        popup: "custom-alert" // Apply the custom class here
                    },
                    timer: 6000
                }).then(() => {
                    //  window.location.href = "/";

                    // Redirect to home page
                    router.push("/");
                });
            }
        } catch (error) {
            console.log("There was a problem with the fetch operation:", error);
            Swal.fire({
                title: "Failed to send notification!",
                icon: "error",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Close",
                showConfirmButton: false,
                customClass: {
                    popup: "custom-alert" // Apply the custom class here
                },
                timer: 6000
            }).then(() => {
                //  window.location.href = "/";

                // Redirect to home page
                router.push("/");
            });
            // }
        } finally {
            setLoading(false); // Reset loading state after the fetch operation is completed
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
                    <button
                        type="button"
                        className={"custom_btn mt-3 cursor-pointer"}
                        // className={`custom_btn mt-3 cursor-pointer ${!textareaValue.trim() ? "disabled" : ""}`}
                        onClick={handleSubmit}
                        disabled={loading}
                        //   disabled={!textareaValue.trim()}
                    >
                        {loading ? "Submitting..." : "Submit"}
                        {/* Submit */}
                    </button>
                </div>
            </div>
        </div>
    );
}
