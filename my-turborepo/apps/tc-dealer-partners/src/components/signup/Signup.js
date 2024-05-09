"use client";
import React, { useState, useForm } from "react";
import "../../contents/scss/login.scss";
import { useRouter } from "next/navigation";
import AppContext from "@/StateManagement/AppContext";
import { sendSignInLinkToEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { clientAuth } from "@/services/firebase";
// import { useAuth } from "@/components/auth";
import { appConfig } from "@/appConfig";
import Link from "next/link";
import { SignUpSVG } from "../../contents/svgs/userManagement";

function Signup(props) {
    const auth = clientAuth;
    auth.tenantId = appConfig.CONSUMER_TENANT_ID;
    //console.log

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const handleDisplayNameChange = (e) => {
        setDisplayName(e.target.value);
        if (e.target.value.trim() === "") {
            setErrors({ displayName: "Display Name is required" });
        } else {
            setErrors({ displayName: "" });
        }
    };
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
    const handlePhoneChange = (e) => {
        const rawPhoneNumber = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
        const formattedPhoneNumber = formatPhoneNumber(rawPhoneNumber);
        setPhone(formattedPhoneNumber);
        setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: !formattedPhoneNumber ? "Please enter your phone number" : "",
            ...(formattedPhoneNumber && !isValidPhone(formattedPhoneNumber)
                ? {
                      phone: "Please enter a valid US phone number in format 1-(123)-456-7890"
                  }
                : {})
        }));
        if (rawPhoneNumber.trim() === "") {
            setErrors({
                phone: !formattedPhoneNumber ? "Please enter your phone number" : "",
                ...(formattedPhoneNumber && !isValidPhone(formattedPhoneNumber)
                    ? {
                          phone: "Please enter a valid US phone number in format 1-(123)-456-7890"
                      }
                    : {})
            });
        } else {
            setErrors({ phone: "" });
        }
    };
    const formatPhoneNumber = (value) => {
        const phoneNumberRegex = /^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})$/; //Regular Expression
        const groups = value.match(phoneNumberRegex);

        if (groups) {
            let formattedPhoneNumber = "";
            if (groups[1]) {
                formattedPhoneNumber += groups[1];
            }
            if (groups[2]) {
                formattedPhoneNumber += `-${groups[2]}`;
            }
            if (groups[3]) {
                formattedPhoneNumber += `-${groups[3]}`;
            }
            if (groups[4]) {
                formattedPhoneNumber += `-${groups[4]}`;
            }
            return formattedPhoneNumber;
        } else {
            return value;
        }
    };

    const isValidPhone = (value) => {
        const phoneNumberRegex = /^1-\d{3}-\d{3}-\d{4}$/;
        return phoneNumberRegex.test(value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        if (displayName.trim() === "") {
            errors.displayName = "Display Name is required";
        }

        if (phone.trim() === "") {
            errors.phone = "Phone is required";
        }

        if (email.trim() === "") {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Invalid email address";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        let signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
            //setFirebaseError("Email already exists.");
            setErrors({ firebaseError: "Email already exists." });
            return;
        }

        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: appConfig.BASE_URL + "/finish-signup",
            // This must be true.
            handleCodeInApp: true
            //dynamicLinkDomain: "thiscars.page.link"
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings)
                .then(async (result) => {
                    //window.localStorage.setItem('emailForSignIn', username);
                    setSuccess(true);
                    window.localStorage.setItem("emailForSignIn", email);
                    window.localStorage.setItem("displayNameForSignIn", displayName);
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

                    setErrors({ firebaseError: errorMessage });
                    console.log(error.message);
                    //const errorCode = errors.code;
                    //const errorMessage = errors.message;
                    // The email of the user's account used.
                    //const email = errors.customData.email;
                    // The AuthCredential type that was used.
                    //const credential = googleAuth.credentialFromError(error);
                    // ...
                    console.log(error);
                });
        } catch (error) {
            setErrors({ firebaseError: error.message });

            console.error(error);
        }
    };

    return (
        <div className="login-auth">
            <div className="form-container">
                <h3>Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <p className="success">{success && "A link to complete signup has been sent to email!"} &nbsp;</p>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={displayName}
                            onChange={handleDisplayNameChange}
                        />
                        <span className="error">{errors.displayName} &nbsp;</span>
                    </div>
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
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            maxLength="14"
                            onChange={handlePhoneChange}
                        />
                        <span className="error">{errors.firebaseError || errors.phone} &nbsp;</span>
                    </div>
                    {/* <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>
                    <div className="remember-forgot">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                value={termsConditions}
                                onChange={handleTermsConditions}
                            />{" "}
                            <span className="ms-2">
                                I agree to the <a href="#">Terms and Conditions</a>
                            </span>
                        </label>
                    </div>
                    <div className="form-group">
                        {errors.termsConditions && <p className="error">{errors.termsConditions}</p>}
                    </div> */}

                    <button className="btn btn-sm mt-4 login-btn custom_btn">
                        Sign Up
                        <SignUpSVG />
                    </button>

                    {/* <div className="d-flex mt-4"> 
           <div className="border-top-login"></div><span className='signin-text'>Or sign in with</span>
            <div className="border-top-login"></div>
            </div>

          <div className="d-flex flex-column">
          <button className="btn btn-outline-primary mt-4 border-outline-fb"><i className="fa fa-facebook" aria-hidden="true"></i>Facebook</button>
            <button className="btn btn-outline-primary border-outline-fb mt-3"><i className="fa fa-google" aria-hidden="true"></i>Google</button>
          </div> */}
                    <div className="login">
                        Joined us before?&nbsp;
                        <Link
                            className="forgot-password"
                            href={`/login`}>
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
