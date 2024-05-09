import React, { useEffect, useState } from "react";
import "../../../contents/scss/callBackFeature.scss";
import Link from "next/link";

const CallBackFeatureModal = ({ closeModal, vehicleName, images }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [errors, setErrors] = useState({});
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

    // const handleEmailChange = (e) => {
    //   setEmail(e.target.value);
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     email: !e.target.value ? 'Please enter your email' : '',
    //     ...(e.target.value || !isValidEmail(e.target.value)
    //       ? { email: 'Invalid email address : example@THISCar.com' }
    //       : {}),
    //   }));
    // };
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
                setIsChecked(false);
                return;
            }
        }

        setIsSubmitted(true);
        handleSave();
    };

    const handleSave = () => {
        //CTA
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

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div
            className="modal"
            style={{ display: "flex" }}
            id="callBackFeature-modal">
            <div className="callBack-modal">
                <div className="callBack-modal-content col-lg-12 col-md-12 col-sm-12 col-12">
                    {!isSubmitted ? (
                        <>
                            <div
                                className="callBack-modal-header col-lg-12 col-md-12 col-sm-12 col-12 mt-4 mb-3"
                                style={{ display: "flex" }}>
                                <div className="heading col-lg-10 col-md-10 col-sm-10 col-10 ">
                                    <h2>Request a Call Back</h2>
                                </div>
                                <div className="close col-lg-2 col-md-2 col-sm-2 col-2 mt-0">
                                    <span onClick={closeModal}>
                                        {/* <span className="close" onClick={closeModal}> */}
                                        &times;
                                    </span>
                                </div>
                            </div>
                            <div className="callBack-modal-body col-lg-12 col-md-12 col-sm-12 col-12">
                                <form className="callBack_form col-lg-12 col-md-12 col-sm-12 col-12">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                        <div className="row ">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div
                                                    className={`form-floating input-frame ${
                                                        errors.firstName ? "error" : ""
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
                                                    <label htmlFor="firstName">First Name</label>
                                                </div>
                                                {errors.firstName && <div className="error">{errors.firstName}</div>}
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div
                                                    className={`form-floating input-frame ${
                                                        errors.lastName ? "error" : ""
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
                                                    <label htmlFor="lastName">Last Name</label>
                                                </div>
                                                {errors.lastName && <div className="error">{errors.lastName}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div
                                                className={`form-floating input-frame ${
                                                    errors.phoneNumber ? "error" : ""
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
                                                    maxLength="14"
                                                    // onBlur={() => validatePhoneNumber(phoneNumber)}
                                                    onChange={handlePhoneNumberChange}
                                                    required
                                                />
                                                <label htmlFor="phoneNumber">Phone Number</label>
                                            </div>
                                            {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div className={`form-floating input-frame ${errors.email ? "error" : ""}`}>
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
                                                <label htmlFor="email">Email</label>
                                            </div>
                                            {errors.email && <div className="error">{errors.email}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 col-lg-12 col-md-12 col-sm-12 col-12 vehicle-details">
                                        <div className="row">
                                            <div className="col-lg-3 col-md-3 col-sm-3 col-3">
                                                <img
                                                    src={images}
                                                    width={90}
                                                    height={90}
                                                    style={{ borderRadius: "50%", objectFit: "cover" }}
                                                    // src='../media/callbackFeature.png'
                                                />
                                            </div>
                                            <div className="col-lg-9 col-md-9 col-sm-9 col-9 vehicle-heading">
                                                <span className="vehicle-interested">
                                                    <p>Vehicle Interested</p>
                                                </span>
                                                {/* 2022 Jeep Wrangler Unlimited Sport Altitude 4x4 */}
                                                <h5>{vehicleName}</h5>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-1 col-md-1 col-sm-1 col-1 customcheck">
                                            <label className="customcheck">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                                            <label className="customcheck">Please Call me</label>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <button
                                                // className={`btn btn-sm custom_btn mt-3 callBack-btn ${
                                                //   Object.keys(errors).length > 0 || !isFormValid()
                                                //     ? 'disabled-button'
                                                //     : ''
                                                // }`}
                                                // disabled={!isFormValid()}
                                                className="btn btn-sm custom_btn mt-3 callBack-btn custom-btn-fill"
                                                onClick={handleButtonClick}

                                                // style={{ marginLeft: '7px' }}
                                            >
                                                Save
                                                <svg
                                                    width="24"
                                                    height="25"
                                                    viewBox="0 0 24 25"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5 13.0455L9.6875 18.5L20 6.5"
                                                        stroke="#E2E42B"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div className="privacy-policy">
                                                <Link href="/privacy">
                                                    <label htmlFor="privacy policy">
                                                        <a>THIScar's privacy policy</a>
                                                    </label>
                                                </Link>
                                            </div>
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
                                        Request Sent
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
                                    {/* <svg
                    width='60'
                    height='60'
                    viewBox='0 0 80 80'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M30.7695 36.2718L43.7308 49.2332L51.8887 45.1542C52.9051 44.646 54.1213 44.7557 55.0304 45.4375L66.7764 54.247C68.3997 55.4645 68.3713 57.9088 66.7201 59.0882L57.055 65.9918C55.9459 66.784 54.5099 66.957 53.2444 66.4508L30.5788 57.3845C23.9169 54.7198 18.8802 49.0987 16.9599 42.1854L11.7836 23.551C11.3336 21.931 11.9447 20.2026 13.3127 19.2254L30.7695 36.2718ZM30.7695 36.2718L34.874 28.0627C35.3414 27.128 35.2886 26.0173 34.7347 25.1311L27.2623 13.1753M30.7695 36.2718L27.2623 13.1753M27.2623 13.1753C26.3457 11.7086 24.382 11.3188 22.9746 12.3241L13.3127 19.2254L27.2623 13.1753Z'
                      stroke='#2A0A4D'
                      strokeWidth='4'
                      strokeLinejoin='round'
                    />
                  </svg> */}
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
                                    <p>A THIScar personal shopper will be calling to answer your questions.</p>
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
        </div>
    );
};

export default CallBackFeatureModal;
