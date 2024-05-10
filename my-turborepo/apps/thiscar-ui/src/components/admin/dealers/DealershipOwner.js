"use client";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { handlePhoneNumberFormat } from "./Utilities";

const DealershipOwner = () => {
    const { setFieldValue, errors, touched } = useFormikContext();

    return (
        <>
            <div className="row d-flex flex-wrap gap-5 text-start">
                <div className="card-title">
                    <h4>Dealership owner contacts</h4>
                </div>
            </div>
            <div className="row mb-3 d-flex flex-wrap gap-5">
                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                    <Field
                        type="text"
                        name="ownerFirstName"
                        id="ownerFirstName"
                        className={`form-control mb-2 ${
                            errors?.ownerFirstName && touched?.ownerFirstName ? "is-invalid" : ""
                        }`}
                        placeholder="First Name"
                    />
                    <label
                        className="ms-3"
                        htmlFor="ownerFirstName">
                        First Name
                    </label>
                    <ErrorMessage
                        name="ownerFirstName"
                        component="div"
                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                    />
                </div>
                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                    <Field
                        type="text"
                        name="ownerLastName"
                        id="ownerLastName"
                        className={`form-control mb-2 ${
                            errors?.ownerLastName && touched?.ownerLastName ? "is-invalid" : ""
                        }`}
                        placeholder="Last Name"
                    />
                    <label
                        className="ms-3"
                        htmlFor="ownerLastName">
                        Last Name
                    </label>
                    <ErrorMessage
                        name="ownerLastName"
                        component="div"
                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                    />
                </div>
                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                    <Field
                        type="text"
                        name="ownerEmail"
                        id="ownerEmail"
                        className={`form-control mb-2 ${errors?.ownerEmail && touched?.ownerEmail ? "is-invalid" : ""}`}
                        placeholder="Email"
                    />
                    <label
                        className="ms-3"
                        htmlFor="ownerEmail">
                        Email
                    </label>
                    <ErrorMessage
                        name="ownerEmail"
                        component="div"
                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                    />
                </div>
                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                    <Field
                        type="text"
                        name="ownerPhone"
                        id="ownerPhone"
                        placeholder="Phone"
                        className={`form-control mb-2 ${errors?.ownerPhone && touched?.ownerPhone ? "is-invalid" : ""}`}
                        maxLength="14"
                        onChange={(event) => setFieldValue("ownerPhone", handlePhoneNumberFormat(event))}
                    />
                    <label
                        className="ms-3"
                        htmlFor="ownerPhone">
                        Phone
                    </label>
                    <ErrorMessage
                        name="ownerPhone"
                        component="div"
                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                    />
                </div>
            </div>
        </>
    );
};

export default DealershipOwner;
