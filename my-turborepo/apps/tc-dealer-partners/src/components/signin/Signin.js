"use client";
import React, { useState, useEffect } from "react";
import "../../contents/scss/login.scss";
import { useRouter } from "next/navigation";
import { sendSignInLinkToEmail, signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/services/firebase";
import { appConfig } from "@/appConfig";
import { SignUpSVG } from "../../contents/svgs/userManagement";
import { useAuth } from "@/components/auth";
import Swal from "sweetalert2";

function Signin() {
    const router = useRouter();
    const auth = clientAuth;
    const user = useAuth();

    const [loginEmail, setLoginEmail] = useState(null);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordForm, setPasswordForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userLogin = async () => {
            if (!user) return;
            if (user) {
                let refreshedToken;
                const idTokenResult = await user?.getIdTokenResult();
                const tokenExpirationTime = idTokenResult?.expirationTime;
                const expirationTimeMillis = Date.parse(tokenExpirationTime);
                const currentTime = Date.now(); // Convert to seconds

                if (expirationTimeMillis < currentTime) {
                    refreshedToken = await user?.getIdToken(true);
                }
                const token = refreshedToken ?? (await user.getIdToken());
                if (token) {
                    await fetch(`/api/dealer-login/${user?.email}`).then(async (result) => {
                        if (result.ok) {
                            const dealerData = await result.json();
                            if (dealerData.dealerURI != "" && dealerData.dealerURI != undefined) {
                                await fetch(`/api/auth`, {
                                    method: "POST",
                                    body: JSON.stringify({
                                        refreshedToken,
                                        dealerURI: dealerData.dealerURI
                                    })
                                });
                            }
                        }
                    });
                }
                await fetch(`/api/auth`, { method: "POST", body: JSON.stringify({ token }) });
                if(appConfig.SHOW_COMING_SOON == "true")
                {
                    router.push("/cars?sort=mmr&showComingSoonCars=true");
                }
                else
                {
                    router.push("/cars?sort=mmr");
                }   
            }
            return user;
        };
        userLogin();
    }, [user]);

    const handleEmailChange = (e) => {
        setLoginEmail(e.target.value);
        if (e.target.value.trim() === "") {
            setErrors({ email: "Email is required" });
        } else if (!/\S+@\S+\.\S+/.test(e.target.value.trim())) {
            setErrors({ email: "Invalid email address" });
        } else {
            setErrors({ email: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (passwordForm) {
            const password = e.currentTarget.password.value;
            const email = e.currentTarget.email.value;
            signInWithEmailAndPassword(clientAuth, email, password)
                .then(async ({ user }) => {
                    fetch(`/api/dealer-login/${email}`)
                        .then((result) => {
                            if (!result.ok) {
                                setErrors({ email: "Your account is not authorized" });
                                return;
                            }
                            return result.json();
                        })
                        .then(async (dealerData) => {
                            if (dealerData?.status == "error" || dealerData.length == 0) {
                                errors.email = "Dealer inactive or user email not found";
                                setErrors(errors);
                                setLoading(false);
                                return;
                            } else if (dealerData.dealerURI == "") {
                                errors.email = "Dealer registration not complete";
                                setErrors(errors);
                                setLoading(false);
                                return;
                            } else if (dealerData.dealerURI != "" && dealerData.dealerURI != undefined) {
                                window.localStorage.clear();

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
                                }
                            }
                        });

                    return;
                })
                .catch(() => {
                    setErrors({ email: "Invalid email and/or password!" });
                    setLoading(false);
                });
            return;
        }

        const errors = {};
        setErrors({});
        setSuccess(false);

        if (loginEmail.trim() === "") {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
            errors.email = "Invalid email address";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const response = await fetch(`/api/dealer-login/${loginEmail}`);
        const dealerData = await response.json();

        setLoading(false);

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
                    router.push("/cars?sort=newest&showComingSoonCars=true");
                }
                else
                {
                    router.push("/cars?sort=newest");
                }
            });
        } else if (Number(dealerData.chromeDealerId) > 0 && dealerData.dealerURI != "") {
            const fullHostName = process.env.NEXT_PUBLIC_OFFSITE_BASE_URL;
            const actionCodeSettings = {
                url: fullHostName + "/finish-signin",
                handleCodeInApp: true
            };

            try {
                await sendSignInLinkToEmail(auth, loginEmail, actionCodeSettings)
                    .then(async (result) => {
                        setSuccess(true);
                        window.localStorage.clear();
                        window.localStorage.setItem("emailForSignIn", loginEmail);
                        window.localStorage.setItem("dealerURI", dealerData.dealerURI);
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
                <h3>Sign In with {passwordForm ? "Password" : "Email Link"}</h3>
                <div
                    style={{
                        margin: "-1rem 0 0 0",
                        padding: 0,
                        textAlign: "left",
                        fontWeight: "lighter",
                        color: "slategray"
                    }}>
                    Want to sign-in with a password?{" "}
                    <button
                        onClick={() => setPasswordForm(!passwordForm)}
                        className="btn-link btn">
                        Click Here
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <fieldset disabled={loading}>
                        {errors.firebaseError && <span className="error">{errors.firebaseError} &nbsp;</span>}
                        {success && <p className="success">Login link has been sent to your email! &nbsp;</p>}
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                defaultValue={loginEmail}
                                onChange={handleEmailChange}
                                required
                                style={{
                                    borderRadius: "25px",
                                    border: "thin solid #2A0A4D",
                                    padding: "10px 10px 10px 19px"
                                }}
                                name="email"
                            />
                        </div>
                        {passwordForm && (
                            <div className="form-group">
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                />
                            </div>
                        )}
                            {errors.email && <span className="error-span">{errors.email} &nbsp;</span>}
                        <button className="btn btn-sm mt-4 login-btn custom_btn">
                            {passwordForm
                                ? loading
                                    ? "Authenticating..."
                                    : "Sign in"
                                : success
                                ? "Login link has been emailed to you!"
                                : "Get Link"}
                            <SignUpSVG />
                        </button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Signin;
