"use client";
import React, { useState, useEffect } from "react";
import "../../contents/scss/login.scss";
import { useRouter } from "next/navigation";
import AppContext from "@/StateManagement/AppContext";
import { sendSignInLinkToEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { clientAuth } from "@/services/firebase";
// import { useAuth } from "@/components/auth";
import { appConfig } from "@/appConfig";
import Link from "next/link";
import { SignUpSVG } from "../../contents/svgs/userManagement";
import { useAuth } from "@/components/auth";
import Swal from "sweetalert2";
function Signin(props) {
    const router = useRouter();
    const auth = clientAuth;
    const user = useAuth();

    //auth.tenantId = appConfig.CONSUMER_TENANT_ID;
    //console.log

    const [loginEmail, setLoginEmail] = useState(null);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    // const [dealerSub, setDealerSub] = useState(null);
    //const [hostname, setHostname] = useState("");

    const handleEmailChange = (e) => {
        //console.log(e.target.value);
        setLoginEmail(e.target.value);
        if (e.target.value.trim() === "") {
            setErrors({ email: "Email is required" });
        } else if (!/\S+@\S+\.\S+/.test(e.target.value.trim())) {
            setErrors({ email: "Invalid email address" });
        } else {
            setErrors({ email: "" });
        }
    };

    //console.log(hostname);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        setErrors({});
        setSuccess(false);
        //const dealerSub = hostname.substring(0, hostname.indexOf("."));

        // const fetchData = async () => {

        // const response = await fetch(`/api/dealer/${dealerSub}`);
        // const resData = await response.json();
        // const dealerConfigData = resData[0];

        if (loginEmail.trim() === "") {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
            errors.email = "Invalid email address";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        // let signInMethods = await fetchSignInMethodsForEmail(auth, email);
        // if (signInMethods.length > 0) {
        //   setErrors({ firebaseError: "Email already exists." });
        //   return;
        // }
        // const currentHostname = typeof window !== "undefined" ? window.location.hostname : "";
        // console.log("in", currentHostname);
        //const dealerSub = currentHostname.substring(0, currentHostname.indexOf("."));
        //const locationArr = window.location.pathname.split("/");
        //const dealerSub = locationArr[1];
        //const response = await fetch(`/api/dealer-data?column=escalationEmail&val=${loginEmail}`);
        const response = await fetch(`/api/dealer-login/${loginEmail}`);
        const dealerData = await response.json();
        console.log("dealerData", dealerData);
        if (dealerData?.status == "error" || dealerData.length == 0) {
            errors.email = "Dealer inactive or user email not found";
            setErrors(errors);
            return;
        } else if (dealerData.dealerURI == "") {
            errors.email = "Dealer URI/sub-domain not found";
            setErrors(errors);
            return;
        }
        if (user && user.email == loginEmail) {
            Swal.fire({
                text: "You are already logged in",
                icon: "success",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Okay"
            }).then(async (result) => {
                if(appConfig.SHOW_COMING_SOON == "true")
                {
                router.push("/" + dealerData.dealerURI + "?sort=newest&showComingSoonCars=true");
                }
                else
                {
                    router.push("/" + dealerData.dealerURI + "?sort=newest");
                }
            });
        } else if (Number(dealerData.chromeDealerId) > 0 && dealerData.dealerURI != "") {
            console.log(dealerData.dealerURI);
            const fullHostName = process.env.NEXT_PUBLIC_OFFSITE_BASE_URL;
            const actionCodeSettings = {
                // URL you want to redirect back to. The domain (www.example.com) for this
                // URL must be in the authorized domains list in the Firebase Console.
                url: fullHostName + "/finish-signin",
                // This must be true.
                handleCodeInApp: true
                //dynamicLinkDomain: "thiscars.page.link"
            };
            //return;
            try {
                await sendSignInLinkToEmail(auth, loginEmail, actionCodeSettings)
                    .then(async (result) => {
                        setSuccess(true);
                        window.localStorage.setItem("emailForSignIn", loginEmail);
                        window.localStorage.setItem("dealerURI", dealerData.dealerURI);
                        // window.localStorage.setItem("displayNameForSignIn", displayName);
                    })
                    .catch((error) => {
                        setErrors({ firebaseError: error.message });
                        console.log(error.message);
                    });
            } catch (error) {
                setErrors({ firebaseError: error.message });
            }
        }
    };

    return (
        <div className="login-auth">
            <div className="form-container">
                <h3>Sign In with Email Link</h3>
                <form onSubmit={handleSubmit}>
                    {errors.firebaseError && <span className="error">{errors.firebaseError} &nbsp;</span>}
                    {success && <p className="success">Login link has been sent to your email! &nbsp;</p>}

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={handleEmailChange}
                        />
                        {errors.email && <span className="error">{errors.email} &nbsp;</span>}
                    </div>
                    <span className="signin-text">Get a login link to your email</span>

                    <button className="btn btn-sm mt-4 login-btn custom_btn">
                        Get Link
                        <SignUpSVG />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signin;
