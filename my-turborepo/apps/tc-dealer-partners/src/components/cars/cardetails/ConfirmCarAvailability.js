"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import "../../../contents/scss/carDetails.scss";
import { appConfig } from "@/appConfig";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import verifyRecaptchaWithEmail from "../../../app/api/verifyRecaptchaWithEmail";
import React, { useEffect, useState } from "react";
import "../../../contents/scss/confirmAvailability.scss";
import { GetCarsByStockId } from "../../../services/carService";
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
import { generateADFXMLString } from "../../../utils/helpers/generateADFXMLString";
import { last } from "lodash";

const ConfirmAvailability = ({ closeModal, vehicleName, stockNo, confirmAvailability, crmEmail }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [completed, setCompleted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            firstName: !e.target.value ? "Please enter your first name" : ""
        }));
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            lastName: !e.target.value ? "Please enter your last name" : ""
        }));
    };

    const handlePhoneNumberChange = (e) => {
        const rawPhoneNumber = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
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

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            email: !e.target.value ? "Please enter your email" : "",
            ...(e.target.value.trim() && !isValidEmail(e.target.value)
                ? { email: "Invalid email address: example@THISCar.com" }
                : {})
        }));
    };
    const isValidEmail = (value) => {
        const emailRegex = /\S+@\S+\.\S+\S/; //   /\S+@\S+\.com/;
        return emailRegex.test(value);
        //   if (!emailRegex.test(value)) {
        //     return false;
        //   } else {
        //     return true;
        //   }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            const currErrors = {};
            if (!firstName.trim()) {
                currErrors.firstName = "Please enter your first name";
            }
            if (!lastName.trim()) {
                currErrors.lastName = "Please enter your last name";
            }

            if (!phoneNumber) {
                currErrors.phoneNumber = "Please enter your phone number";
            } else if (!isValidPhone(phoneNumber)) {
                currErrors.phoneNumber = "Please enter valid phone number in format 1-123-456-7890";
            }

            if (!email) {
                currErrors.email = "Please enter your email";
            } else if (!isValidEmail(email)) {
                currErrors.email = "Invalid email address : example@THISCar.com";
            }

            if (Object.keys(currErrors).length > 0) {
                setErrors(currErrors);
                //  setIsChecked(false);
                return;
            }
        }

        setIsSubmitted(true);
        handleSave();
    };

    const handleSave = async () => {
        //CTA
        window.grecaptcha.ready(() => {
            window.grecaptcha
                .execute(appConfig.RECAPTCHA_SITE_KEY, { action: "submit" })
                .then(async (token) => {
                    /* send data to the server */

                    const data = {
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: phoneNumber,
                        email: email,
                        stockNumber: stockNo,
                        recaptchaResponse: token
                    };
                    await SubmitHeroLeadInformation(data).then((response) => {
                        if (response.status == 200) {
                            //   setCompleted(true);
                        } else if (response.status == 500) {
                        } else {
                        }
                    });
                })
                .catch((error) => {});
        });
    };
    const isWithinPrevious3Days = (date) => {
        const currentDate = new Date();
        const previous3Days = new Date(currentDate);
        previous3Days.setDate(currentDate.getDate() - 3);

        return date > previous3Days && date < currentDate;
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
    const GenerateHeroAdfLead = (carData, formData) => {
        const prospect = new Prospect(null, null, ProspectStatus.New); // Initialize with the New status
        const adfLead = new AdfLead(null, prospect, null, null, null); // Replace null with other properties as needed
        setUpVehiclesProp(adfLead, carData?.document);
        adfLead.Customer = new Customer();
        adfLead.Customer.Contact = new Contact();

        if (formData.email != null && formData.email != "") {
            adfLead.Customer.Contact.Email = new Email();
            adfLead.Customer.Contact.Email.Value = formData.email;
        }

        if (formData.phoneNumber != null && formData.phoneNumber != "") {
            const phone = new Phone();
            phone.Value = formData.phoneNumber;
            adfLead.Customer.Contact.PhoneNumbers = [phone];
        }

        if (
            formData.firstName != null &&
            formData.firstName != "" &&
            formData.lastName != null &&
            formData.lastName != ""
        ) {
            const fullName = formData.firstName + formData.lastName;
            const customerName = new Name();
            customerName.NamePart = NamePartType.Full;
            customerName.Type = NameType.Individual;
            customerName.Value = fullName;

            adfLead.Customer.Contact.Names = [customerName];
        }
        return adfLead;
    };
    const SubmitHeroLeadInformation = async (data) => {
        var carData = await GetActiveCarsByStockNumber(data);
        var adfLead = GenerateHeroAdfLead(carData, data);
        const adfXMLString = generateADFXMLString(adfLead, window.location.href);
        const emailData = {
            to: crmEmail,
            subject: "Confirm Availability ",
            text: adfXMLString
        };

        try {
            return await verifyRecaptchaWithEmail(data.recaptchaResponse, emailData);
            // Continue with your logic here
        } catch (err) {
            return { status: 500, message: err.message };
            // Handle the error here
        }
    };
    const handleModalClose = () => {
        closeModal();
    };

    const isFormValid = () => {
        return (
            firstName.trim() !== "" &&
            lastName.trim() !== "" &&
            phoneNumber.trim() !== "" &&
            isValidPhone(phoneNumber) &&
            email.trim() !== "" &&
            isValidEmail(email)
        );
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div
            className="modal-dialog-md"
            style={{ display: "flex" }}
            id="confirmAvailability-modal">
            {/* <div className="modal-dialog modal-dialog-responsive"> */}
            <div className="availability-modal">
                <div className="availability-modal-content col-lg-12 col-md-12 col-sm-12 col-12">
                    {!isSubmitted ? (
                        <>
                            <div
                                className="availability-modal-header col-lg-12 col-md-12 col-sm-12 col-12 mt-1 mb-3"
                                style={{ display: "flex" }}>
                                <div className="heading col-lg-10 col-md-10 col-sm-10 col-10 ">
                                    <h2>{confirmAvailability.popUpHeading}</h2>
                                </div>
                                <div className="close col-lg-2 col-md-2 col-sm-2 col-2 mt-0">
                                    <span onClick={closeModal}>
                                        {/* <span className="close" onClick={closeModal}> */}
                                        &times;
                                    </span>
                                </div>
                            </div>
                            <div className="availability-modal-body col-lg-12 col-md-12 col-sm-12 col-12">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-0">
                                    <p>
                                        {/* In today's market, vehicles sell incredibly fast.Sometimes, this happens before
                                        the vehicle can be removed from our website. */}
                                        {confirmAvailability.popUpText1}
                                    </p>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-0">
                                    <p>
                                        {/* Please provide your contact information, and we will have a member of our team
                                        confirm that this vehicle is still available for purchase. */}
                                        {confirmAvailability.popUpText2}
                                    </p>
                                </div>
                                <form className="availability_form col-lg-12 col-md-12 col-sm-12 col-12">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                        <div className="row ">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div
                                                    className={`form-floating input-frame ${
                                                        errors.firstName ? "error-availability" : ""
                                                    }`}>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="firstName"
                                                        placeholder="First Name"
                                                        name="firstName"
                                                        value={firstName}
                                                        aria-describedby="firstName"
                                                        onChange={handleFirstNameChange}
                                                        required
                                                        // onChange={(e) => setFirstName(e.target.value)}
                                                    />
                                                    <label for="firstName">First Name</label>
                                                </div>
                                                {errors.firstName && (
                                                    <div className="error-availability">{errors.firstName}</div>
                                                )}
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div
                                                    className={`form-floating input-frame ${
                                                        errors.lastName ? "error-availability" : ""
                                                    }`}>
                                                    {" "}
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="lastName"
                                                        placeholder="Last Name"
                                                        name="lastName"
                                                        value={lastName}
                                                        onChange={handleLastNameChange}
                                                        required
                                                    />
                                                    <label for="lastName">Last Name</label>
                                                </div>
                                                {errors.lastName && (
                                                    <div className="error-availability">{errors.lastName}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div
                                                className={`form-floating input-frame ${
                                                    errors.phoneNumber ? "error-availability" : ""
                                                }`}>
                                                {" "}
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
                                                    required
                                                />
                                                <label for="phoneNumber">Mobile Number</label>
                                            </div>
                                            {errors.phoneNumber && (
                                                <div className="error-availability">{errors.phoneNumber}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div
                                                className={`form-floating input-frame ${
                                                    errors.email ? "error-availability" : ""
                                                }`}>
                                                {" "}
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Email"
                                                    name="email"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                    required
                                                />
                                                <label for="email">Email</label>
                                            </div>
                                            {errors.email && <div className="error-availability">{errors.email}</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <button
                                                disabled={crmEmail && crmEmail != "" ? false : true}
                                                // className={`btn btn-sm custom_btn mt-3 availability-btn ${
                                                //   Object.keys(errors).length > 0 || !isFormValid()
                                                //     ? 'disabled-button'
                                                //     : ''
                                                // }`}
                                                // disabled={!isFormValid()}
                                                className="btn btn-sm custom_btn mt-3 availability-btn custom-btn-fill"
                                                onClick={handleButtonClick}

                                                // style={{ marginLeft: '7px' }}
                                            >
                                                {/* Save */}
                                                {confirmAvailability.buttonText}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="col-lg-12 col-md-12 col-sm-12 col-12 confirmation-message">
                            <div
                                className="col-lg-12 col-md-12 col-sm-12 col-12 mt-4 mb-4"
                                style={{ display: "flex" }}>
                                <div className="col-lg-10 col-md-10 col-sm-10 col-10 ">
                                    <h3
                                        style={{
                                            textAlign: "left",
                                            marginLeft: "6px",
                                            color: "#2A0A4D"
                                        }}>
                                        {confirmAvailability.confirmationHeading}
                                    </h3>
                                </div>
                                <div className="close col-lg-2 col-md-2 col-sm-2 col-2 mt-0">
                                    <span onClick={handleModalClose}>
                                        {/* <span className="close" onClick={closeModal}> */}
                                        &times;
                                    </span>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-lg-2 col-md-3 col-sm-3 col-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="60"
                                        height="60"
                                        viewBox="0 0 80 80">
                                        <g transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)">
                                            <path
                                                d="M163 654 c-74 -53 -75 -56 -37 -194 34 -125 59 -174 104 -210 46 -36
                           307 -142 332 -134 9 3 44 25 78 50 83 61 81 76 -15 148 -41 31 -81 56 -90 56
                          -9 0 -33 -9 -54 -19 l-38 -20 -56 57 -56 57 19 35 c11 19 19 43 20 53 0 18
                          -76 146 -95 159 -22 16 -52 6 -112 -38z m131 -56 l38 -62 -21 -43 c-11 -24
                          -21 -49 -21 -56 0 -15 131 -147 147 -147 7 0 28 9 48 20 20 11 40 20 46 20 13
                          0 129 -89 129 -98 -1 -4 -25 -24 -55 -45 l-54 -37 -128 51 c-70 28 -138 57
                          -150 65 -44 28 -74 83 -107 198 l-34 117 52 39 c28 21 56 39 61 39 6 1 27 -27
                          49 -61z"
                                                fill="#2A0A4D"
                                                stroke="#2A0A4D"
                                                strokeWidth="4"
                                                strokeLinejoin="round"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <div className="mt-1 col-lg-10 col-md-9 col-sm-9 col-9 ">
                                    <p>{confirmAvailability.confirmationMessage}</p>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                    <button
                                        className="btn btn-sm custom_btn mt-3"
                                        onClick={handleModalClose}>
                                        Close
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 25"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 7.5L17 17.5"
                                                stroke="#E2E42B"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M7 17.5L17 7.5"
                                                stroke="#E2E42B"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <div className="save-button"> */}
                    {/* <button
            disabled={!isChecked}
            onClick={handleButtonClick}
            style={{ marginLeft: '10px' }}
            className={!isChecked ? 'disabled-button' : ''}
          >
            Save {isChecked}
          </button> */}
                    {/* </div> */}
                </div>
            </div>
            {/* </div> */}
        </div>
    );
};

export default ConfirmAvailability;
