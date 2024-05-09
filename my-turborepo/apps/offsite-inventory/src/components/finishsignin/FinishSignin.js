"use client";
import React, { useState, useForm, useEffect } from "react";
import "../../contents/scss/login.scss";
import { useRouter } from "next/navigation";
import AppContext from "@/StateManagement/AppContext";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { clientAuth } from "@/services/firebase";
import { FinishSignUpSVG } from "../../contents/svgs/userManagement";
import { appConfig } from "@/appConfig";

// async function getDealerDataByEmail(email) {
//     const response = await fetch(`/api/dealer-login/${email}`);
//     const newData = await response.json();
//     return newData;
// }
function FinishSignin(props, request) {
    const auth = clientAuth;
    //auth.tenantId = appConfig.CONSUMER_TENANT_ID;

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [errors, setErrors] = useState({});
    const [dealerURI, setDealerURI] = useState(null);

    const router = useRouter();

    // useEffect(() => {
    // console.log("useefect");
    if (typeof window !== "undefined" && isSignInWithEmailLink(auth, window.location.href)) {
        console.log("isSignInWithEmailLink");
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem("emailForSignIn");
        //let displayName = window.localStorage.getItem("displayNameForSignIn");
        if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again. For example:
            email = window.prompt("Please provide your email for confirmation");
        }
        // if (!displayName) {
        //     // User opened the link on a different device. To prevent session fixation
        //     // attacks, ask the user to provide the associated email again. For example:
        //     displayName = window.prompt("Please provide display name.");
        // }
        //The client SDK will parse the code from the link for you.

        signInWithEmailLink(auth, email, window.location.href)
            .then(async (result) => {
                console.log("result", result);
                //fetch(`/api/dealer-data?column=escalationEmail&val=${email}`)
                fetch(`/api/dealer-login/${email}`)
                    .then((result) => {
                        setLoading(true);
                        // Check if the response status is OK (status code 200)
                        if (!result.ok) {
                            throw new Error(`Failed to fetch data. Status: ${result.status}`);
                        }

                        return result.json(); // Parse the JSON when the response is OK
                    })
                    .then((dealerData) => {
                        // const dealerData = await response.json();
                        console.log(dealerData);
                        if (dealerData?.status == "error" || dealerData.length == 0) {
                            errors.email = "Dealer inactive or user email not found";
                            setErrors(errors);
                            return;
                        } else if (dealerData.dealerURI == "") {
                            errors.email = "Dealer URI/sub-domain not found";
                            setErrors(errors);
                            return;
                        } else if (dealerData.dealerURI != "" && dealerData.dealerURI != undefined) {
                            console.log(dealerData);
                            setSuccess(true);
                            setLoading(false);
                            window.localStorage.removeItem("emailForSignIn");
                            if (appConfig.SHOW_COMING_SOON == "true") {
                                setDealerURI(dealerData.dealerURI + "?sort=newest&showComingSoonCars=true");
                                window.location.assign(
                                    "/" + dealerData.dealerURI + "?sort=newest&showComingSoonCars=true"
                                );
                            }
                            else
                            {
                                setDealerURI(dealerData.dealerURI + "?sort=newest");
                                window.location.assign(
                                    "/" + dealerData.dealerURI + "?sort=newest"
                                );
                            }
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        // Handle any errors that occurred during the fetch or JSON parsing
                        console.log("Error:", error.message);
                        console.error("Error:", error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                setErrors({ firebaseError: error.message });
            });
    }
    // }, []);

    return (
        <div className="login-auth">
            <div className="form-container">
                <h3>Complete the Sign Up</h3>
                <p className="success">{loading && "Processing..."} &nbsp;</p>
                {success && (
                    <p className="success">
                        Sign In completed successfully!. If not redirected please click{" "}
                        <a href="/`${dealerURI}`">here</a>
                    </p>
                )}
                {errors.firebaseError && <p className="error">{errors.firebaseError}</p>}
                <p className="error">{invalid && "Invalid Sign In link"} &nbsp;</p>
            </div>
        </div>
    );
}

export default FinishSignin;
