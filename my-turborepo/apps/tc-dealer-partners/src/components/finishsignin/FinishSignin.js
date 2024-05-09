"use client";
import React, { useState, useForm, useEffect } from "react";
import "../../contents/scss/login.scss";
import { useRouter } from "next/navigation";
import { appConfig } from "@/appConfig";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { clientAuth } from "@/services/firebase";

import Link from "next/link";

function FinishSignin(props, request) {
    const auth = clientAuth;

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [errors, setErrors] = useState({});

    const router = useRouter();

    useEffect(() => {
        if (!window) return;
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem("emailForSignIn");

            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = window.prompt("Please provide your email for confirmation");
            }

            signInWithEmailLink(auth, email, window.location.href)
                .then(async ({ user }) => {
                    fetch(`/api/dealer-login/${email}`)
                        .then((result) => {
                            setLoading(true);
                            // Check if the response status is OK (status code 200)
                            if (!result.ok) {
                                throw new Error(`Failed to fetch data. Status: ${result.status}`);
                            }

                            return result.json(); // Parse the JSON when the response is OK
                        })
                        .then(async (dealerData) => {
                            // const dealerData = await response.json();

                            if (dealerData?.status == "error" || dealerData.length == 0) {
                                errors.email = "Dealer inactive or user email not found";
                                setErrors(errors);
                                return;
                            } else if (dealerData.dealerURI == "") {
                                errors.email = "Dealer URI/sub-domain not found";
                                setErrors(errors);
                                return;
                            } else if (dealerData.dealerURI != "" && dealerData.dealerURI != undefined) {
                                setSuccess(true);
                                setLoading(false);
                                window.localStorage.removeItem("emailForSignIn");

                                const token = await user.getIdToken();
                                await fetch(`/api/auth`, {
                                    method: "POST",
                                    body: JSON.stringify({
                                        token,
                                        dealerURI: dealerData.dealerURI
                                    })
                                });

                                if(appConfig.SHOW_COMING_SOON == "true")
                                {
                                    router.push("/cars?sort=mmr&showComingSoonCars=true");
                                }
                                else
                                {
                                    router.push("/cars?sort=mmr");
                                }                            }
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
    }, []);

    return (
        <div className="login-auth">
            <div className="form-container">
                <h3>Complete the Sign Up</h3>
                <p className="success">{loading && "Processing..."} &nbsp;</p>
                {success && (
                    <p className="success">
                        Sign In completed successfully!. If not redirected please <Link href="/cars">click here</Link>
                    </p>
                )}
                {errors.firebaseError && <p className="error">{`Sign-in Link Expired!`}</p>}
                {errors.firebaseError && <Link href={"/"}>Click here to Sign-in</Link>}
                <p className="error">{invalid && "Invalid Sign In link"} &nbsp;</p>
            </div>
        </div>
    );
}

export default FinishSignin;
