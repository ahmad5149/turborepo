"use client";
import React, { useRef } from "react";

import { Formik, ErrorMessage, Field } from "formik";
import { handlePhoneFormat, initialValues, validationSchema } from "./Utilities";
import { Toolbar } from "../common/toolbar/Toolbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { FormikToast } from "../common/formikToast/FormikToast";
import { searchDealer } from "@/services/dealerService";
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth } from "@/components/auth";
const uuid = require("uuid");
import SecondaryDealership from "./SecondaryDealership";
import { SecondaryDealershipMobile } from "./SecondaryDealershipMobile";
import "../../../contents/admin/scss/userAddEdit.scss";

function AddEditUser({ addUser, userData, dealerOptions }) {
    const formRef = useRef();
    const user = useAuth();
    const router = useRouter();
    const [selectedDealer, setSelectedDealer] = useState(
        userData == null ? [] : [{ value: userData?.chromeDealerId, label: userData?.dealerShip }]
    );
    const [selectedMultiDealers, setSelectedMultiDealers] = useState(userData?.secondaryDealers || []);
    const [isInserting, setIsInserting] = useState(userData == null);
    const [loading, setLoading] = useState(false);
    const [dealers, setLDealers] = useState(dealerOptions);
    const [updateUserData, setUpdateUserData] = useState();
    const [alreadySelected, setAlreadySelected] = useState(userData?.chromeDealerId);

    const [hasDuplicateDealer, setHasDuplicateDealer] = useState({ dealerShip: false, secondaryDealerShop: false });
    const [forceLinkEmail, setForceLinkEmail] = useState(false);

    const hasDuplicates = (array) => {
        const seen = new Set();

        for (const obj of array) {
            const objString = JSON.stringify(obj);
            if (seen.has(objString)) {
                return true;
            }
            seen.add(objString);
        }

        return false;
    };
    const checkDuplicateDealers = (id) => {
        return selectedMultiDealers.flat()?.some((dealer) => dealer.value === id);
    };
    useEffect(() => {
        const hasDealer = hasDuplicates(selectedMultiDealers?.flat());

        setHasDuplicateDealer((prevState) => ({
            ...prevState,
            secondaryDealerShop: hasDealer
        }));
        if (hasDealer) toast.error("Secondary Dealer already selected");
    }, [selectedMultiDealers]);

    useEffect(() => {
        const singleDealer = checkDuplicateDealers(alreadySelected || selectedDealer?.[0]?.value);

        setHasDuplicateDealer((prevState) => ({
            ...prevState,
            dealerShip: singleDealer
        }));
        if (singleDealer) toast.error("Single Dealer already selected");
    }, [alreadySelected, selectedMultiDealers, selectedDealer?.[0]?.value]);

    useEffect(() => {
        if (userData != null)
            setUpdateUserData({
                ...userData,
                receiveNotification: userData?.receiveNotification || false,
                escalationNotification: userData?.escalationNotification || false,
                secondaryDealership: userData?.secondaryDealership || [
                    {
                        uuid: "",
                        userId: "",
                        chromeDealerId: null,
                        escalationNotification: false,
                        receiveNotification: false,
                        role: ""
                    }
                ]
            });
    }, [userData]);

    const trimStrings = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === "string") {
                obj[key] = obj[key].trim();
            }
        }
        return obj;
    };

    const handleSubmit = async (data) => {
        const { dealerShip, secondaryDealerShop } = hasDuplicateDealer;

        if (dealerShip || secondaryDealerShop) {
            toast.error("Please remove the duplicate dealers");
            return;
        }
        const user = trimStrings(data);

        const { secondaryDealers, ...values } = user;
        values.forceLinkEmail = forceLinkEmail;
        if (isInserting) {
            values.uuid = uuid.v4();
            values.chromeDealerId = Number(values.chromeDealerId);
            values.createdAt = Math.floor(new Date().getTime() / 1000);
            values.createdBy = user.email;
            values.isDeleted = false;
        } else {
            values.updatedAt = Math.floor(new Date().getTime() / 1000);
            values.updatedBy = user.email;
        }

        if (values.role != "thisCarAdmin" && !values.chromeDealerId) {
            toast.error("Please select a primary dealership");
            return;
        }

        addUser(values, isInserting).then((response) => {
            if (response.status == "OK") {
                Swal.fire({
                    title: `Record ${isInserting ? "saved" : "updated"}  successfully`,
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Okay"
                }).then(async (result) => {
                    router.push("/admin/users?key=" + Math.random().toString(36).substring(2, 7));
                });
            } else {
                if (response.errorCode == "email-already-exists") {
                    // toast.error(
                    //     "The email address is already in use by another account on Firebase. Please check the force link email checkbox to update."
                    // );
                    Swal.fire({
                        title: `Confirm link email`,
                        text: "The email is already on Firebase. Do you want to link it to this user?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, I am sure!",
                        cancelButtonText: "No, cancel it!",
                        closeOnConfirm: false,
                        closeOnCancel: false,
                        dangerMode: true
                    }).then(async (result) => {
                        if (result["isConfirmed"]) {
                            setForceLinkEmail(true);
                            formRef.current.handleSubmit();
                        } else {
                            setForceLinkEmail(false);
                        }
                    });
                } else {
                    toast.error(response.message);
                }
            }
        });
    };

    const handleChangeDealerShip = (value) => {
        setLoading(true);
        if (value) {
            fetchOptions(value).then((dealers) => {
                setLDealers(dealers);
            });
        } else {
            setLDealers(dealerOptions);
        }
        setLoading(false);
    };

    const fetchOptions = async (searchTerm) => {
        return await searchDealer(searchTerm);
    };

    return (
        <>
            <Toolbar pageName={!isInserting ? "Edit User" : "Add User"} />

            <div className="container-xxl">
                <Formik
                    innerRef={formRef}
                    initialValues={updateUserData || initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                    id="kt_ecommerce_add_product_form"
                    className="form d-flex flex-column flex-lg-row fv-plugins-bootstrap5 fv-plugins-framework">
                    {({ handleSubmit, setFieldValue, errors, touched }) => (
                        <form action={(e) => handleSubmit(e)}>
                            <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
                                <div className="d-flex flex-column gap-7 gap-lg-10">
                                    <div className="card card-flush py-4">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <h2>User Form</h2>
                                            </div>
                                        </div>
                                        <div className="card-body pt-0">
                                            <div className=" row mb-2 d-flex flex-wrap gap-5">
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="firstName"
                                                        id="firstName"
                                                        className={`form-control mb-2 ${
                                                            errors?.firstName && touched?.firstName ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="First Name"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="firstName">
                                                        First Name
                                                    </label>
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="firstName">
                                                        First Name
                                                    </label>
                                                    <ErrorMessage
                                                        name="firstName"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="lastName"
                                                        id="lastName"
                                                        className={`form-control mb-2 ${
                                                            errors?.lastName && touched?.lastName ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Last Name"
                                                    />

                                                    <label
                                                        className="ms-3"
                                                        htmlFor="firstName">
                                                        Last Name
                                                    </label>
                                                    <ErrorMessage
                                                        name="lastName"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        className={`form-control mb-2 ${
                                                            errors?.title && touched?.title ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Title"
                                                    />

                                                    <label
                                                        className="ms-3"
                                                        htmlFor="title">
                                                        Title
                                                    </label>

                                                    <ErrorMessage
                                                        name="title"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-2 d-flex flex-wrap gap-5">
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        className={`form-control mb-2 ${
                                                            errors?.email && touched?.email ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Email"
                                                    />

                                                    <label
                                                        className="ms-3"
                                                        htmlFor="email">
                                                        Email
                                                    </label>

                                                    <ErrorMessage
                                                        name="email"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="phone"
                                                        id="phone"
                                                        className={`form-control mb-2 ${
                                                            errors?.phone && touched?.phone ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Phone"
                                                        maxLength="14"
                                                        onChange={(value) =>
                                                            setFieldValue("phone", handlePhoneFormat(value))
                                                        }
                                                    />

                                                    <label
                                                        className="ms-3"
                                                        htmlFor="phone">
                                                        Phone
                                                    </label>

                                                    <ErrorMessage
                                                        name="phone"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <label
                                                        className="ms-3 text-start w-100"
                                                        htmlFor="dealerShip">
                                                        Dealership
                                                    </label>{" "}
                                                    <Select
                                                        name="dealerShip"
                                                        options={dealers}
                                                        isMulti={false}
                                                        isLoading={loading}
                                                        isSearchable
                                                        onInputChange={handleChangeDealerShip}
                                                        value={selectedDealer}
                                                        onChange={(e) => {
                                                            setSelectedDealer(e);
                                                            setAlreadySelected(e.value);
                                                            setFieldValue("chromeDealerId", e.value);
                                                            setFieldValue("dealerShip", e.label);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        name="dealership"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-4 d-flex flex-wrap gap-5">
                                                {/* <div className="col-md-4 form-check form-check-sm form-check-custom form-check-solid">
                                                    <label className="ps-4 form-check form-switch-sm form-check-custom form-check-solid flex-stack">
                                                        <Field
                                                            name="forceLink"
                                                            id="forceLink"
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                        <span className="ms-3 text-gray-700 fs-6 fw-semibold ms-0 me-2">
                                                            Force Link Existing Email
                                                        </span>
                                                    </label>
                                                </div> */}
                                                <div className="col-md-1 form-check form-check-sm form-check-custom form-check-solid">
                                                    <label className="ps-4 form-check form-switch-sm form-check-custom form-check-solid flex-stack">
                                                        <Field
                                                            name="isActive"
                                                            id="isActive"
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                        <span className="ms-3 text-gray-700 fs-6 fw-semibold ms-0 me-2">
                                                            Active
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-check mb-2 form-check-sm form-check-custom form-check-solid">
                                                <div className="card-title">
                                                    <h4 className="fs-4 text-start">Notification permissions</h4>

                                                    <label className="ps-0 mb-3 form-check  form-switch-sm form-check-solid flex-stack">
                                                        <Field
                                                            name="receiveNotification"
                                                            id="receiveNotification"
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                        <span className="ms-3 text-gray-700 fs-6 fw-semibold ms-0 me-2">
                                                            Receive notification
                                                        </span>
                                                    </label>

                                                    <label className="ps-4  form-check  form-switch-sm form-check-custom form-check-solid flex-stack">
                                                        <Field
                                                            name="escalationNotification"
                                                            id="escalationNotification"
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                        <span className="ms-3 text-gray-700 fs-6 fw-semibold ms-0 me-2">
                                                            Escalation notification
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <SecondaryDealership
                                                dealerOptions={dealerOptions}
                                                selectedMultiDealers={selectedMultiDealers}
                                                setSelectedMultiDealers={setSelectedMultiDealers}
                                            />
                                            <SecondaryDealershipMobile
                                                dealerOptions={dealerOptions}
                                                selectedMultiDealers={selectedMultiDealers}
                                                setSelectedMultiDealers={setSelectedMultiDealers}
                                            />

                                            <div className="form-check form-check-sm form-check-custom form-check-solid">
                                                <div className="card-title">
                                                    <h4 className="fs-4 text-start">Set Rights</h4>
                                                    <label className="pb-4 ps-4 form-check form-check-custom form-check-solid">
                                                        <Field
                                                            name="role"
                                                            className="form-check-input"
                                                            type="radio"
                                                            value="thisCarAdmin"
                                                        />
                                                        <span className="ms-3 text-gray-700 fs-6 fw-semibold me-2">
                                                            ThisCar Admin
                                                        </span>
                                                    </label>
                                                    <label className="pb-4 ps-4 form-check form-check-custom form-check-solid">
                                                        <Field
                                                            name="role"
                                                            className="form-check-input"
                                                            type="radio"
                                                            value="dealerManager"
                                                        />
                                                        <span className="ms-3 text-gray-700 fs-6 fw-semibold me-2">
                                                            Dealer Manager
                                                        </span>
                                                    </label>

                                                    <label className="pb-4 ps-4 form-check form-check-custom form-check-solid">
                                                        <Field
                                                            name="role"
                                                            className="form-check-input"
                                                            type="radio"
                                                            value="dealerUser"
                                                        />
                                                        <span className="ms-3 text-gray-700 fs-6 fw-semibold me-2">
                                                            Dealer Contact
                                                        </span>
                                                    </label>
                                                    <ErrorMessage
                                                        name="role"
                                                        component="div"
                                                        className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <FormikToast />

                                <div className="row dealer-form user-buttons add-dealer btn-dealer">
                                    <div className="pull-left col-md-3 col-xl-2 col-12">
                                        <Link
                                            className="btn color-white btn-dealer"
                                            href="/admin/users"
                                            aria-label="Back">
                                            <i className="fa-solid fa-arrow-left"></i> Back
                                        </Link>
                                    </div>
                                    <div className="col-md-3 col-xl-2 col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-theme btn-dealer">
                                            <i className="fa-solid fa-check"></i> {isInserting ? "Save" : "Update"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </>
    );
}

export default AddEditUser;
