"use client";
import React, { useState, useEffect } from "react";
import "../../../contents/admin/scss/login.scss";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithMicrosoft, signInWithPopup, OAuthProvider } from "firebase/auth";
import { clientAuth, app } from "../../../services/firebase";
import { manageUserSettings } from "../../../app/api/widgetSettings";
import { appConfig } from "../../../appConfig";
import firebase from "firebase/app";
function Login(props) {
    const auth = clientAuth;
    //auth.tenantId = appConfig.ADMIN_TENANT_ID;
    const router = useRouter();

    //console.log

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
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
                .then(async (userCred) => {
                    if (!userCred) {
                        return;
                    }
                    //window.localStorage.setItem('emailForSignIn', email);
                    //router.push("/admin");

                    fetch("/api/login", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${await userCred.user.getIdToken()}`
                        }
                    }).then((response) => {
                        if (response.status === 200) {
                            window.location.assign("/admin");
                            //router.push("/admin");
                        }
                    });
                })
                .catch((error) => {
                    console.log("error", error);
                    console.log("error-code", error.code);
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
                });
        } catch (err) {
            console.log("err", err.code);
            //setFirebaseError(err.message);
            setErrors({ firebaseError: err.message });
        }
        setLoading(false);
    };

    const provider = new OAuthProvider("microsoft.com");
    provider.setCustomParameters({
        login_hint: "jdoe@thiscar.com",
        tenant: "07b5d794-fcf9-4181-b426-7c055c7de0f8"
    });
    provider.addScope("user.read");
    const signInWithMicrosoft = () =>
        signInWithPopup(auth, provider)
            .then(async (userCred) => {
                if (!userCred) {
                    return;
                }
                 var email = userCred?.user?.email ?? userCred?.user?.providerData[0]?.email;
                const settings = await manageUserSettings({ email: email, uid: userCred?.user?.uid });
                localStorage.setItem("widgetSettings", JSON.stringify(settings));

                fetch("/api/login", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${await userCred.user.getIdToken()}`
                    }
                }).then((response) => {
                    if (response.status === 200) {
                        window.location.assign("/admin");
                        //router.push("/admin");
                    }
                });
            })
            .catch((error) => {
                console.log("error", error.message);
                console.log("error-code", error.code);
                let errorMessage = "Some error has occured.";
                switch (error.code) {
                    case "auth/user-not-found":
                        errorMessage = "Email not found.";
                        break;
                    case "auth/wrong-password":
                        errorMessage = "Invalid password.";
                        break;
                    default:
                        errorMessage = error.message;
                }
                //setFirebaseError(errorMessage);
                setErrors({ firebaseError: errorMessage });
            });
    // const useAuth = () => useContext(AuthContext);

    return (
        <div className="login-auth">
            <div className="form-container">
                {loading && <p className="text-center">Loading...</p>}
                <h3>Sign In</h3>
                {/* <form onSubmit={handleSubmit}>
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
                    <span className="error">{errors.firebaseError} &nbsp;</span>
                    <button
                        type="submit"
                        className="btn btn-primary">
                        Sign In
                    </button>
                    
                </form> */}
                <div className="d-flex mt-4">
                    <span className="error">{errors.firebaseError} &nbsp;</span>
                    <div className="border-top-login"></div>
                    <span className="signin-text">Sign in with</span>
                    <div className="border-top-login"></div>
                </div>

                <div className="d-flex flex-column">
                    <button
                        type="button"
                        className="btn btn-outline-primary border-outline-fb mt-3"
                        onClick={signInWithMicrosoft}>
                        <i class="bi bi-microsoft"></i>
                        Microsoft
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
