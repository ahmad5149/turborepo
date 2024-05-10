"use client";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { handlePhoneNumberFormat } from "./Utilities";
const GeneralManager = () => {
    const { setFieldValue, errors, touched } = useFormikContext();
    return (
        <>
            <div className="row d-flex flex-wrap gap-5 text-start">
                <div className="card-title">
                    <h4>General manager contacts (optional)</h4>
                </div>
            </div>
            <div className="row mb-3 d-flex flex-wrap gap-5">
                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                    <Field
                        type="text"
                        name="managerFirstName"
                        id="managerFirstName"
                        className={`form-control mb-2 ${
                            errors?.managerFirstName && touched?.managerFirstName ? "is-invalid" : ""
                        }`}
                        placeholder="First Name"
                    />
                    <label
                        className="ms-3"
                        htmlFor="managerFirstName">
                        First Name
                    </label>
                    <ErrorMessage
                        name="managerFirstName"
                        component="div"
                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                    />
                </div>
                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                    <Field
                        type="text"
                        name="managerLastName"
                        id="managerLastName"
                        className={`form-control mb-2 ${
                            errors?.managerLastName && touched?.managerLastName ? "is-invalid" : ""
                        }`}
                        placeholder="Last Name"
                    />
                    <label
                        className="ms-3"
                        htmlFor="managerLastName">
                        Last Name
                    </label>
                    <ErrorMessage
                        name="managerLastName"
                        component="div"
                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                    />
                </div>
                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                    <Field
                        type="email"
                        name="managerEmail"
                        id="managerEmail"
                        className={`form-control mb-2 ${
                            errors?.managerEmail && touched?.managerEmail ? "is-invalid" : ""
                        }`}
                        placeholder="Email"
                    />
                    <label
                        className="ms-3"
                        htmlFor="managerEmail">
                        Email
                    </label>
                    <ErrorMessage
                        name="managerEmail"
                        component="div"
                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                    />
                </div>
                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                    <Field
                        type="text"
                        name="managerPhone"
                        id="managerPhone"
                        className={`form-control mb-2 ${
                            errors?.managerPhone && touched?.managerPhone ? "is-invalid" : ""
                        }`}
                        placeholder="Phone"
                        maxLength="14"
                        onChange={(event) => setFieldValue("managerPhone", handlePhoneNumberFormat(event))}
                    />
                    <label
                        className="ms-3"
                        htmlFor="managerPhone">
                        Phone
                    </label>
                    <ErrorMessage
                        name="managerPhone"
                        component="div"
                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                    />
                </div>
            </div>
        </>
    );
};

export default GeneralManager;
