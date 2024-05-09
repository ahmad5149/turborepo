"use client";
import React, { useState, useEffect } from "react";

import "../../../contents/scss/supportBanner.scss";
import { GetCarsByStockId } from "@/services/carService";
import { appConfig } from "@/appConfig";
import verifyRecaptchaWithEmail from "../../../app/api/verifyRecaptchaWithEmail";
import { generateADFXMLString } from "../../../utils/helpers/generateADFXMLString";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Prospect,
    AdfLead,
    Vehicle,
    VehicleStatus,
    VehicleInterest,
    Customer,
    Contact,
    Email,
    Phone,
    Name,
    NamePartType,
    NameType,
    ProspectStatus
} from "../../../models/support/SupportModel";

function QuestionSection(props) {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [stockNumber, setStockNumber] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [submit, setSubmit] = useState("QUESTION");
    const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false);

    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            fullName: !e.target.value ? "Please enter full name" : ""
        }));
    };

    const handleStockNumberChange = (e) => {
        setStockNumber(e.target.value);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            message: !e.target.value ? "Please enter your message" : ""
        }));
    };

    const handlePhoneNumberChange = (e) => {
        const rawPhoneNumber = e.target.value?.replace(/\D/g, ""); // Remove non-digit characters
        const formattedPhoneNumber = formatPhoneNumber(rawPhoneNumber);

        setPhoneNumber(formattedPhoneNumber);
        setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumber: !formattedPhoneNumber ? "Please enter your phone number" : "",
            ...(formattedPhoneNumber && !isValidPhone(formattedPhoneNumber)
                ? {
                      phone: "Please enter a valid US phone number in format 1-(123)-456-7890"
                  }
                : {})
        }));
    };

    const formatPhoneNumber = (value) => {
        const phoneNumberRegex = /^(\d{0,3})(\d{0,3})(\d{0,4})$/; //Regular Expression
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
        const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
        return phoneNumberRegex.test(value);
    };

    const handleEmailAddressChange = (e) => {
        setEmailAddress(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            emailAddress: !e.target.value ? "Please enter your email" : "",
            ...(e.target.value.trim() && !isValidEmailAddress(e.target.value)
                ? { emailAddress: "Invalid email address: example@THISCar.com" }
                : {})
        }));
    };
    const isValidEmailAddress = (value) => {
        const emailRegex = /\S+@\S+\.\S+\S/; //   /\S+@\S+\.com/;
        return emailRegex.test(value);
    };

    useEffect(() => {
        setSubmit(() => {
            if (completed) return "RESET";
            if (processing) return "PROCESSING";
            return "QUESTION";
        });
    }, [processing, completed]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            const currErrors = {};
            if (!fullName.trim()) {
                currErrors.fullName = "Please enter full name";
            }

            if (!phoneNumber) {
                currErrors.phoneNumber = "Please enter your phone number";
            } else if (!isValidPhone(phoneNumber)) {
                currErrors.phoneNumber = "Please enter valid phone number in format 123-456-7890";
            }

            if (!emailAddress) {
                currErrors.emailAddress = "Please enter your email";
            } else if (!isValidEmailAddress(emailAddress)) {
                currErrors.emailAddress = "Invalid email address";
            }
            if (!message.trim()) {
                currErrors.message = "Please your your message";
            }

            if (Object.keys(currErrors).length > 0) {
                setErrors(currErrors);
                return;
            }
        } else {
            setIsSubmitBtnDisabled(true);
            toast.info("Submitting Question...", {
                autoClose: false // Set to false to keep the loading toast until the response is received
            });
        }

        handleSave();
    };

    const SubmitHeroLeadInformation = async (data) => {
        var carData = await GetActiveCarsByStockNumber(data);
        var adfLead = GenerateHeroAdfLead(carData, data);
        const adfXMLString = generateADFXMLString(adfLead, window.location.href);
        const emailData = {
            to: process.env.NEXT_PUBLIC_LEAD_CONTACT_EMAIL,
            subject: "THISCar client hero lead form",
            text: adfXMLString
        };

        try {
            return await verifyRecaptchaWithEmail(data.recaptchaResponse, emailData);
            // Continue with your logic here
        } catch (err) {
            return { status: 500, message: err.message };
            console.error(err);
            // Handle the error here
        }
    };

    const GetActiveCarsByStockNumber = async (data) => {
        var carData = null;
        if (data && data.stockNumber) {
            const query = {
                q: data.stockNumber,
                page: 1,
                perPage: 20
            };
            var result = await GetCarsByStockId(query);

            for (const car of result?.items) {
                const providedDate = new Date(car.document.updatedAt);
                const isWithin3Days = isWithinPrevious3Days(providedDate);
                if (isWithin3Days) {
                    carData = car;
                    break;
                }
            }
        }
        return carData;
    };

    const isWithinPrevious3Days = (date) => {
        const currentDate = new Date();
        const previous3Days = new Date(currentDate);
        previous3Days.setDate(currentDate.getDate() - 3);

        return date > previous3Days && date < currentDate;
    };

    const GenerateHeroAdfLead = (carData, formData) => {
        const prospect = new Prospect(null, null, ProspectStatus.New); // Initialize with the New status
        const adfLead = new AdfLead(null, prospect, null, null, null); // Replace null with other properties as needed
        setUpVehiclesProp(adfLead, carData?.document);
        adfLead.Customer = new Customer();
        adfLead.Customer.Contact = new Contact();

        if (formData.message != null && formData.message != "") {
            adfLead.Customer.Comments = formData.message;
        }

        if (formData.emailAddress != null && formData.emailAddress != "") {
            adfLead.Customer.Contact.Email = new Email();
            adfLead.Customer.Contact.Email.Value = formData.emailAddress;
        }

        if (formData.phoneNumber != null && formData.phoneNumber != "") {
            const phone = new Phone();
            phone.Value = formData.phoneNumber;
            adfLead.Customer.Contact.PhoneNumbers = [phone];
        }

        const customerName = new Name();
        customerName.NamePart = NamePartType.Full;
        customerName.Type = NameType.Individual;
        customerName.Value = formData.fullName;

        adfLead.Customer.Contact.Names = [customerName];

        return adfLead;
    };

    const setUpVehiclesProp = (adfLead, car) => {
        if (!car) return;

        const vehicle = new Vehicle(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            VehicleInterest.Buy,
            car?.make,
            car?.model,
            null,
            null,
            null,
            null,
            VehicleStatus.Used,
            car?.stockId,
            null,
            null,
            car?.vin,
            car?.year
        );

        // Set the Vehicles property as an array with one vehicle
        adfLead.Vehicles = [vehicle];
    };

    const handleSave = async () => {
        if (completed) {
            setCompleted(false);
            // setName("");
            // setEmail("");
        } else {
            setProcessing(true);

            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(appConfig.RECAPTCHA_SITE_KEY, { action: "submit" })
                    .then(async (token) => {
                        /* send data to the server */

                        const data = {
                            fullName: fullName,
                            phoneNumber: phoneNumber,
                            emailAddress: emailAddress,
                            stockNumber: stockNumber,
                            message: message,
                            recaptchaResponse: token
                        };
                        SubmitHeroLeadInformation(data).then((response) => {
                            if (response.status == 200) {
                                setCompleted(true);
                                if (response.status == 200) {
                                    setIsSubmitted(true);

                                    setFullName("");
                                    setSubmitError("");
                                    setPhoneNumber("");
                                    setEmailAddress("");
                                    setStockNumber("");
                                    setMessage("");
                                } else {
                                    setSubmitError("Failed to submit, please try again.");
                                }
                                toast.dismiss();
                                setIsSubmitBtnDisabled(false);
                                setCompleted(false);
                                setTimeout(() => {
                                    setIsSubmitted(false);
                                }, 2000); // Adjust the delay as needed (1 second in this example)
                            } else if (response.status == 500) {
                                setSubmitError(response.detail);
                                toast.dismiss();
                                setIsSubmitBtnDisabled(false);
                                setCompleted(false);
                                setTimeout(() => {
                                    setIsSubmitted(false);
                                }, 2000); // Adjust the delay as needed (1 second in this example)
                            } else {
                                throw new Error(response.statusText);
                                toast.dismiss();
                                setIsSubmitBtnDisabled(false);
                                setCompleted(false);
                                setTimeout(() => {
                                    setIsSubmitted(false);
                                }, 2000); // Adjust the delay as needed (1 second in this example)
                            }
                        });
                        // submitContactQuestion(data).then((response) => {
                        //     console.log("then", response);
                        //     if (response.status == 200) {
                        //         setCompleted(true);
                        //         console.log("response-q", response);
                        //         if (response.status == 200) {
                        //             setIsSubmitted(true);

                        //             setFullName("");
                        //             setSubmitError("");
                        //             setPhoneNumber("");
                        //             setEmailAddress("");
                        //             setStockNumber("");
                        //             setMessage("");
                        //         } else {
                        //             setSubmitError("Failed to submit, please try again.");
                        //         }
                        //     } else if (response.status == 403) {
                        //         setSubmitError(response.detail);
                        //     } else {
                        //         throw new Error(response.statusText);
                        //     }
                        // });

                        /* End of the sending data */
                    })
                    .catch((error) => {
                        setSubmitError(error.message);
                    });
                setProcessing(false);
            });
        }
    };

    const isFormValid = () => {
        return (
            fullName.trim() !== "" &&
            phoneNumber.trim() !== "" &&
            message.trim() !== "" &&
            isValidPhone(phoneNumber) &&
            emailAddress.trim() !== "" &&
            isValidEmailAddress(emailAddress)
        );
    };

    return (
        <div className="col-lg-4 col-md-12 col-sm-12 support_left px-3">
            <ToastContainer />

            <div>
                <h2>{props.questionSection.heading}</h2>
                {/* <h2>{splitText(props.questionSection.heading)}</h2> */}
                <p>
                    {props.questionSection.description}
                    <br />
                    EmailAddress: {props.questionSection.email}
                    <br />
                    Call: {props.questionSection.phoneNumber}
                </p>
                {submitError && <div className="error-field">{submitError}</div>}
                {isSubmitted && <div className="success">Question submitted successfully!</div>}
                <form className="support_form">
                    <div className="mt-3">
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmailAddress1"
                            placeholder="Full Name"
                            onChange={handleFullNameChange}
                            aria-describedby="emailHelp"
                            value={fullName}
                        />
                    </div>
                    {errors.fullName && <div className="error-field">{errors.fullName}</div>}
                    <div className="mt-3">
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmailAddress1"
                            placeholder="EmailAddress"
                            onChange={handleEmailAddressChange}
                            aria-describedby="emailHelp"
                            value={emailAddress}
                        />
                    </div>
                    {errors.emailAddress && <div className="error-field">{errors.emailAddress}</div>}
                    <div className="mt-3">
                        <input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            placeholder="phone Number"
                            name="phoneNumber"
                            value={phoneNumber}
                            // pattern="[0-9]{0,11}"
                            maxLength="12"
                            // onBlur={() => validatePhoneNumber(phoneNumber)}
                            onChange={handlePhoneNumberChange}
                        />
                    </div>
                    {errors.phoneNumber && <div className="error-field">{errors.phoneNumber}</div>}
                    <div className="mt-3">
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmailAddress1"
                            placeholder="Stock Number (Optional)"
                            aria-describedby="emailHelp"
                            onChange={handleStockNumberChange}
                            value={stockNumber}
                        />
                    </div>
                    <div className="mt-3">
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="3"
                            placeholder="How Can We Help?"
                            onChange={handleMessageChange}
                            value={message}
                        />
                    </div>
                    {errors.message && <div className="error-field">{errors.message}</div>}
                    <div className="sp-btn">
                        <button
                            disabled={isSubmitBtnDisabled}
                            className="btn btn-sm custom_btn mt-3 hover_btn"
                            type="button"
                            onClick={handleSubmit}>
                            {props.questionSection.buttonLabel}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="currentColor"
                                className="bi bi-arrow-right-short"
                                viewBox="0 0 16 16">
                                <path
                                    fillRule="evenodd"
                                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                                />
                            </svg>
                        </button>
                    </div>
                    <p>
                        {props.questionSection.subText}{" "}
                        <a
                            href={props.questionSection.termOfService.link}
                            className="terms_policy_color">
                            {props.questionSection.termOfService.linkText}
                        </a>{" "}
                        and{" "}
                        <a
                            href={props.questionSection.privacyPolicy.link}
                            className="terms_policy_color">
                            {props.questionSection.privacyPolicy.linkText}
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default QuestionSection;
