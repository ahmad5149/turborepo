"use client";
import React, { useState, useEffect } from "react";
import "../../contents/scss/login.scss";
import { useRouter } from "next/navigation";
import AppContext from "@/StateManagement/AppContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth, googleAuthProvider, facebookAuthProvider, SignInWithEmailAndPassword } from "@/services/firebase";
import { useAuth } from "@/components/auth";
import { signInWithPopup } from "firebase/auth";
import { appConfig } from "@/appConfig";
import Link from "next/link";
import { SignInSVG } from "../../contents/svgs/userManagement";

function Login(props) {
    const auth = clientAuth;
    auth.tenantId = appConfig.CONSUMER_TENANT_ID;
    const router = useRouter();

    //console.log

    const googleAuth = googleAuthProvider;

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleAuth)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = googleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    // IdP data available using getAdditionalUserInfo(result)

                    // ...
                })
                .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    //const email = error.customData.email;
                    // The AuthCredential type that was used.
                    //const credential = googleAuth.credentialFromError(error);
                    // ...
                });
        } catch (err) {
            console.error(err);
        }
    };

    const facebookAuth = facebookAuthProvider;
    const signInWithFacebook = async () => {
        try {
            await signInWithPopup(auth, facebookAuth)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = facebookAuth.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    // IdP data available using getAdditionalUserInfo(result)

                    // ...
                })
                .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    //const email = error.customData.email;
                    // The AuthCredential type that was used.
                    //const credential = googleAuth.credentialFromError(error);
                    // ...
                    console.log(error);
                });
        } catch (err) {
            console.error(err);
        }
    };
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (e.target.value.trim() === "") {
            setErrors({ email: "Email is required" });
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: "Invalid email address" });
        } else {
            setErrors({ email: "" });
        }
    };

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

        if (email.trim() === "") {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Invalid email address";
        }

        if (password.trim() === "") {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password)
                .then((result) => {
                    //window.localStorage.setItem('emailForSignIn', email);
                    router.push("/");
                    //router.back();
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
                    let errorMessage = "Some error has occured.";
                    switch (error.code) {
                        case "auth/user-not-found":
                            errorMessage = "Email not found.";
                            break;
                        case "auth/wrong-password":
                            errorMessage = "Invalid password.";
                            break;
                        default:
                        // code block
                    }

                    //setFirebaseError(errorMessage);
                    setErrors({ firebaseError: errorMessage });
                    // Handle Errors here.
                    // const errorCode = error.code;
                    // const errorMessage = error.message;
                    // The email of the user's account used.
                    //const email = error.customData.email;
                    // The AuthCredential type that was used.
                    //const credential = googleAuth.credentialFromError(error);
                    // ...
                });
        } catch (err) {
            console.log("err", err.code);
            //setFirebaseError(err.message);
            setErrors({ firebaseError: err.message });
        }
    };
    // Perform login logic here, e.g., send API request to validate credentials
    // Simulating successful login for demonstration

    return (
        <div className="login-auth">
            <div className="form-container">
                <h3>Sign in to your account</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <span className="error">{errors.email} &nbsp;</span>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <span className="error">{errors.password} &nbsp;</span>
                    </div>
                    <div className="remember-forgot">
                        <label className="remember-me">
                            <input type="checkbox" /> <span className="ms-2">Remember me</span>
                        </label>
                        <a
                            href="#"
                            className="forgot-password">
                            Forgot password?
                        </a>
                    </div>
                    <span className="error">{errors.firebaseError} &nbsp;</span>
                    <button
                        type="submit"
                        className="btn btn-sm mt-4 login-btn custom_btn">
                        SignIn
                        <SignInSVG />
                    </button>
                    <div className="d-flex mt-4">
                        <div className="border-top-login"></div>
                        <span className="signin-text">Or sign in with</span>
                        <div className="border-top-login"></div>
                    </div>

                    <div className="d-flex flex-column">
                        <button
                            type="button"
                            className="btn btn-outline-primary mt-4 border-outline-fb"
                            onClick={signInWithFacebook}>
                            <i
                                className="fa fa-facebook"
                                aria-hidden="true"></i>
                            Facebook
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-primary border-outline-fb mt-3"
                            onClick={signInWithGoogle}>
                            <i
                                className="fa fa-google"
                                aria-hidden="true"></i>
                            Google
                        </button>
                        <div className="register">
                            New to ThisCar?&nbsp;
                            <Link
                                className="forgot-password"
                                href={`/signup`}>
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
