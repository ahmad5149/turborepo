"use client";
import React, { useState, useForm } from "react";
import "../../contents/scss/register.scss";
import { useRouter } from "next/navigation";
import AppContext from "@/StateManagement/AppContext";
import { createUserWithEmailAndPassword, isSignInWithEmailLink, updateProfile } from "firebase/auth";
import { clientAuth } from "@/services/firebase";
import { useAuth } from "@/components/auth";
import { signInWithPopup } from "firebase/auth";
import { appConfig } from "@/appConfig";
import Link from "next/link";
import { FinishSignUpSVG } from "../../contents/svgs/userManagement";

function FinishSignup(props) {
    const auth = clientAuth;
    auth.tenantId = appConfig.CONSUMER_TENANT_ID;

    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value.trim() === "") {
            setErrors({ password: "Password is required" });
        } else if (e.target.value.length < 6) {
            setErrors({ password: "Password must be at least 6 characters" });
        } else {
            setErrors({ password: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (password.trim() === "") {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        if (isSignInWithEmailLink(auth, window.location.href)) {
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            let email = window.localStorage.getItem("emailForSignIn");
            let displayName = window.localStorage.getItem("displayNameForSignIn");
            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = window.prompt("Please provide your email for confirmation");
            }
            if (!displayName) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                displayName = window.prompt("Please provide display name.");
            }
            // The client SDK will parse the code from the link for you.
            try {
                await createUserWithEmailAndPassword(auth, email, password)
                    .then(async (result) => {
                        //window.localStorage.setItem('emailForSignIn', usernam
                        await updateProfile(auth.currentUser, {
                            displayName: displayName
                        })
                            .then(() => {
                                auth.signOut();
                                console.log("profile updated");
                                // router.push({
                                //   pathname: "/login",
                                //   query: { registered: true },
                                // });
                                setSuccess(true);

                                // ...
                            })
                            .catch((error) => {
                                setErrors({ firebaseError: error.message });
                                console.log("profile error", error);
                                // ...
                            });
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        // const credential = googleAuthProvider.credentialFromResult(result);
                        // const token = credential.accessToken;
                        // // The signed-in user info.
                        // const user = result.user;
                        // // IdP data available using getAdditionalUserInfo(result)

                        // console.log(credential, token, user)
                        // ...
                    })
                    .catch((error) => {
                        console.log(error.code);
                        // Handle Errors here.
                        let errorMessage = "Some error has occured.";
                        switch (error.code) {
                            case "auth/email-already-in-use":
                                errorMessage = "Email already in use.";
                                break;
                            default:
                            // code block
                        }
                        //const errorCode = errors.code;
                        //const errorMessage = errors.message;
                        // The email of the user's account used.
                        //const email = errors.customData.email;
                        // The AuthCredential type that was used.
                        //const credential = googleAuth.credentialFromError(error);
                        // ...
                        setErrors({ firebaseError: errorMessage });
                    });
            } catch (error) {
                setErrors({ firebaseError: error.message });
                console.error(error);
            }
        }
    };

    return (
        <div className="login-auth">
            <div className="form-container">
                <h3>Complete the Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <p className="success">{success && "Sign Up completed successfully!"} &nbsp;</p>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <span className="error">{errors.password || errors.firebaseError} &nbsp;</span>
                    </div>
                    <button className="btn btn-sm mt-4 login-btn custom_btn">
                        Complete Sign Up
                        <FinishSignUpSVG />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FinishSignup;
