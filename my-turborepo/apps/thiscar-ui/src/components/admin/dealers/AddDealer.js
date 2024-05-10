"use client";
import { Formik, ErrorMessage, Field } from "formik";
import Select, { components } from "react-select";
import { Toolbar } from "../common/toolbar/Toolbar";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const uuid = require("uuid");
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomStyle, handleChromeId, handlePhoneNumberFormat, initialValues, validationSchema } from "./Utilities";
import DealershipOwner from "./DealershipOwner";
import GeneralManager from "./GeneralManager";
import UploadLogo from "./UploadLogo";
import { FormikToast } from "../common/formikToast/FormikToast";
import Swal from "sweetalert2";
import { checkDealerEscalation } from "../../../services/dealerService";
import "../../../contents/admin/scss/addDealer.scss";

function AddDealer({ dealer, submitDealer, makes }) {
    const router = useRouter();
    const [IsImgAllowed, setIsImgAllowed] = useState(false);
    const [image, setImageFile] = useState(null);
    const [logo, setLogo] = useState(dealer?.logo);
    const [imageName, setImageName] = useState("");
    const [isInserting, setIsInserting] = useState(dealer == null);
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    const handleSubmit = async (values, actions) => {
        if (isInserting) {
            values.uuid = uuid.v4();
            values.isDeleted = false;
            values.chromeDealerId = Number(values.chromeDealerId);
            values.chromeExportId = Number(values.chromeExportId);
            // values.contacts.forEach((element) => {
            //     element.correlationId = uuid.v4();
            //     element.isDeleted = false;
            // });
        }
        // else {
        //     values.contacts.forEach((element) => {
        //         if (!element.correlationId) element.correlationId = uuid.v4();
        //     });
        // }
        if (imageName && image) {
            values.logo = await uploadImageToStorage(values.name);
        }

        Swal.fire({
            allowOutsideClick: false,
            html: `
                <div style="text-align: center;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div style="margin-top: 10px;">Loading...</div>
                </div>`,
            showConfirmButton: false,
            showCancelButton: false
        });

        const response = await submitDealer(values, isInserting);

        if (response.status == "OK") {
            Swal.fire({
                title: `Record ${isInserting ? "saved" : "updated"}  successfully`,
                icon: "success",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Okay"
            }).then(async (result) => {
                setTimeout(delayedRouterPush, 7000);
            });
        } else {
            console.log(response.message);
            toast.error("something went wrong. please try again");
        }
    };

    const delayedRouterPush = () => {
        router.push("/admin/dealers?key" + Math.random().toString(36).substring(2, 7));
    };

    const uploadImageToStorage = async (name) => {
        if (imageName && image) {
            const formData = new FormData();
            formData.append("file", image);
            // const parts = image.type.split("/");
            // const extension = parts[parts.length - 1];

            const currentDate = new Date()
                .toISOString()
                .replace(/:/g, "-")
                .replace(/\.\d{3}/, "");
            name = (name.includes(" ") ? name.replace(/ /g, "-") : name).toLowerCase() + "_" + currentDate;

            const parts = image.type.split("/");
            const extension = parts[parts.length - 1];

            const uploadFileName = `dealer-logo/${name}.${extension}`;

            formData.append("fileName", uploadFileName);
            const response = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData
            });

            const res = await response.json();

            if (res.status === 201) {
                return res.publicUrl;
            }
        }
        return "";
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                // Set the data URL as the source for the img tag
                setLogo(event.target.result);
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
        }

        if (file?.type && validImageTypes.includes(file?.type)) {
            setIsImgAllowed(false);
            setImageFile(file);
            setImageName(file.name);
            return;
        }
        setIsImgAllowed(true);
        // if (file) {
        //   setIsImgAllowed(false);
        //   const reader = new FileReader();
        //   //   const image = await file.arrayBuffer();
        //   //   setImageFile(image);
        //   reader.onload = function (event) {
        //     const base64String = event.target.result.split(",")[1];
        //     console.log("Base64 String:", base64String);
        //     setImageFile(event.target.result);
        //     setImageName(file.name);
        //   };
        //   reader.readAsDataURL(file);
        // }
    };

    const addDefaultSrc = (ev) => {
        ev.target.src = "/media/maker-icons/generic.png";
    };

    const ValueContainer = ({ children, ...props }) => {
        let [values, input] = children;
        if (props.selectProps) {
            const length = props.selectProps.value?.length;
            if (Array.isArray(values)) {
                values = "select make";
                if (length && length > 0) {
                    values = props.selectProps.value.map((obj) => `${obj.value}`).join(", ");
                }
            }
            return (
                <components.ValueContainer {...props}>
                    {values}
                    {input}
                </components.ValueContainer>
            );
        } else {
            return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
        }
    };

    const doesEscalationExist = async () => {
        if (isInserting) {
            return true;
        }
        const escalationExists = await checkDealerEscalation(dealer.chromeDealerId);
        if (!escalationExists) {
            Swal.fire({
                title: `No escalation contact exists for this dealer`,
                icon: "error",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Okay"
            });
        }
        return escalationExists;
    };

    return (
        <>
            <Toolbar pageName="Add Dealer Form" />
            <div className="container-xxl">
                <Formik
                    initialValues={dealer || initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    id="kt_ecommerce_add_product_form"
                    className=" form d-flex flex-column flex-lg-row fv-plugins-bootstrap5 fv-plugins-framework">
                    {({ handleSubmit, setFieldValue, values, errors, touched }) => (
                        <form
                            action={(e) => handleSubmit(e)}
                            className="dealer-form">
                            <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
                                <div className="d-flex flex-column gap-7 gap-lg-10">
                                    <div className="card card-flush py-4">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <h2>Dealer Form</h2>
                                            </div>
                                        </div>
                                        <div className="card-body pt-0">
                                            <div className="row mb-2">
                                                <div className="col-12 form-floating">
                                                    <Field
                                                        type="text"
                                                        name="website"
                                                        id="website"
                                                        className={`form-control mb-2 ${
                                                            errors?.website && touched?.website ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Dealer’s Web Address"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="website">
                                                        Dealer’s Web Address
                                                    </label>
                                                    <ErrorMessage
                                                        name="website"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <div className=" row mb-2 d-flex flex-wrap gap-2">
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        className={`form-control mb-2 ${
                                                            errors?.name && touched?.name ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Dealer Name"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="website">
                                                        Dealer Name
                                                    </label>

                                                    <ErrorMessage
                                                        name="name"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="phone"
                                                        id="phone"
                                                        className={`form-control ${
                                                            errors?.phone && touched?.phone ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Dealer Phone"
                                                        maxLength="14"
                                                        // onChange={handlePhoneNumberChange}
                                                        onChange={(value) =>
                                                            setFieldValue("phone", handlePhoneNumberFormat(value))
                                                        }
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="phone">
                                                        Dealer Phone
                                                    </label>
                                                    <ErrorMessage
                                                        name="phone"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="chromeDealerId"
                                                        id="chromeDealerId"
                                                        className={`form-control ${
                                                            errors?.chromeDealerId && touched?.chromeDealerId
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        placeholder="Dealer ChromeId"
                                                        maxLength="20"
                                                        onChange={(value) =>
                                                            setFieldValue("chromeDealerId", handleChromeId(value))
                                                        }
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="chromeDealerId">
                                                        Dealer ChromeId
                                                    </label>
                                                    <ErrorMessage
                                                        name="chromeDealerId"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="chromeExportId"
                                                        id="chromeExportId"
                                                        className={`form-control ${
                                                            errors?.chromeExportId && touched?.chromeExportId
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        placeholder="Dealer ExportId"
                                                        maxLength="20"
                                                        onChange={(value) =>
                                                            setFieldValue("chromeExportId", handleChromeId(value))
                                                        }
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="chromeExportId">
                                                        Dealer ExportId
                                                    </label>
                                                    <ErrorMessage
                                                        name="chromeExportId"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className=" row mb-2 d-flex flex-wrap gap-2">
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="email"
                                                        name="crmEmail"
                                                        id="crmEmail"
                                                        className={`form-control mb-2 ${
                                                            errors?.crmEmail && touched?.crmEmail ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="CRM Email"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="crmEmail">
                                                        CRM Email Address
                                                    </label>

                                                    <ErrorMessage
                                                        name="crmEmail"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="tradeToolURL"
                                                        id="tradeToolURL"
                                                        className={`form-control ${
                                                            errors?.tradeToolURL && touched?.tradeToolURL
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        placeholder="Trade Tool (Url)"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="tradeToolURL">
                                                        Trade Tool (Url)
                                                    </label>
                                                    <ErrorMessage
                                                        name="tradeToolURL"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="prequelURL"
                                                        id="prequelURL"
                                                        className={`form-control ${
                                                            errors?.prequelURL && touched?.prequelURL
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        placeholder="Prequel (Url)"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="prequelURL">
                                                        Prequel (Url)
                                                    </label>
                                                    <ErrorMessage
                                                        name="prequelURL"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-2 d-flex flex-wrap gap-2">
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="address"
                                                        id="address"
                                                        className={`form-control mb-2 ${
                                                            errors?.address && touched?.address ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Dealer Address"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="address">
                                                        Dealer Address
                                                    </label>
                                                    <ErrorMessage
                                                        name="address"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="city"
                                                        id="city"
                                                        className={`form-control mb-2 ${
                                                            errors?.city && touched?.city ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="City"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="city">
                                                        City
                                                    </label>
                                                    <ErrorMessage
                                                        name="city"
                                                        component="div"
                                                        className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="text-start form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="state"
                                                        id="state"
                                                        className={`form-control mb-2 ${
                                                            errors?.state && touched?.state ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="State"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="state">
                                                        State
                                                    </label>
                                                    <ErrorMessage
                                                        name="state"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating fv-row w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="text"
                                                        name="dealerZipCode"
                                                        id="dealerZipCode"
                                                        className={`form-control mb-2 ${
                                                            errors?.dealerZipCode && touched?.dealerZipCode
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        placeholder="Zip code"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="dealerZipCode">
                                                        Zip code
                                                    </label>
                                                    <ErrorMessage
                                                        name="dealerZipCode"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-3 d-flex flex-wrap gap-5">
                                                <div className="form-floating col-3 px-4 mt-3 w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="number"
                                                        name="packAmount"
                                                        id="packAmount"
                                                        placeholder="Pack $$ amount"
                                                        className={`form-control ${
                                                            errors?.packAmount && touched?.packAmount
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="packAmount">
                                                        Pack $$ amount
                                                    </label>
                                                    <ErrorMessage
                                                        name="packAmount"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="form-floating col-3 px-4 mt-3 w-100 flex-md-root fv-plugins-icon-container">
                                                    <Field
                                                        type="number"
                                                        name="retailMarkup"
                                                        id="retailMarkup"
                                                        placeholder="Retail Markup"
                                                        className={`form-control ${
                                                            errors?.retailMarkup && touched?.retailMarkup
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="retailMarkup">
                                                        Retail Markup
                                                    </label>
                                                    <ErrorMessage
                                                        name="retailMarkup"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="col-1 d-flex align-items-center justify-content-left w-100 flex-md-root fv-plugins-icon-container">
                                                    <label className="form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack">
                                                        <span className="form-check-label text-gray-700 fs-6 fw-semibold ms-0 me-2">
                                                            Active
                                                        </span>
                                                        <Field
                                                            name="isActive"
                                                            id="isActive"
                                                            className={`form-check-input ${
                                                                errors?.isActive && touched?.isActive
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            type="checkbox"
                                                            onChange={async (e) => {
                                                                const check = e.target.checked;
                                                                if (e.target.checked) {
                                                                    const escalationExists =
                                                                        await doesEscalationExist();
                                                                    if (!escalationExists) {
                                                                        return;
                                                                    }
                                                                }
                                                                setFieldValue("isActive", check);
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="row mb-3 d-flex flex-wrap gap-5">
                                                <div
                                                    className="col-3 px-4 d-flex row 
                                                    w-100 flex-md-root fv-plugins-icon-container">
                                                    <label className="form-label mb-0 text-start">OEM</label>
                                                    <Select
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        name="colors"
                                                        value={values.oem}
                                                        onChange={(selectedOptions) => {
                                                            const makesValue = [];
                                                            if (selectedOptions && selectedOptions.length > 0) {
                                                                selectedOptions.forEach((element) => {
                                                                    const make = {};
                                                                    make.value = element.value;
                                                                    makesValue.push(make);
                                                                });
                                                            }
                                                            setFieldValue("oem", makesValue);
                                                        }}
                                                        options={makes}
                                                        className={`basic-multi-select pe-0 ${
                                                            errors?.oem && touched?.oem ? "is-invalid" : ""
                                                        }`}
                                                        classNamePrefix="select"
                                                        styles={CustomStyle}
                                                        formatOptionLabel={(make) => (
                                                            <div className="make-dropdown">
                                                                {
                                                                    <img
                                                                        src={`/media/maker-icons/${(make.value.includes(
                                                                            " "
                                                                        )
                                                                            ? make.value.replace(/ /g, "-")
                                                                            : make.value
                                                                        ).toLowerCase()}.png`}
                                                                        width={25}
                                                                        height={25}
                                                                        className="me-2"
                                                                        onError={addDefaultSrc}
                                                                        alt="car-image"
                                                                    />
                                                                }
                                                                {make.value}
                                                            </div>
                                                        )}
                                                    />

                                                    <ErrorMessage
                                                        name="oem"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                                <div className="col-3 px-4 d-flex row w-100 flex-md-root fv-plugins-icon-container">
                                                    <label className="form-label mb-0 text-start">Offsite OEM</label>
                                                    <Select
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        name="colors"
                                                        value={values.offsiteOem}
                                                        onChange={(selectedOptions) => {
                                                            const makesValue = [];
                                                            if (selectedOptions && selectedOptions.length > 0) {
                                                                selectedOptions.forEach((element) => {
                                                                    const make = {};
                                                                    make.value = element.value;
                                                                    makesValue.push(make);
                                                                });
                                                            }
                                                            setFieldValue("offsiteOem", makesValue);
                                                        }}
                                                        options={makes}
                                                        className={`basic-multi-select pe-0 ${
                                                            errors?.offsiteOem && touched?.offsiteOem
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        classNamePrefix="select"
                                                        styles={CustomStyle}
                                                        formatOptionLabel={(make) => (
                                                            <div className="make-dropdown">
                                                                {
                                                                    <img
                                                                        src={`/media/maker-icons/${(make.value.includes(
                                                                            " "
                                                                        )
                                                                            ? make.value.replace(/ /g, "-")
                                                                            : make.value
                                                                        ).toLowerCase()}.png`}
                                                                        width={25}
                                                                        height={25}
                                                                        className="me-2"
                                                                        onError={addDefaultSrc}
                                                                        alt="car-image"
                                                                    />
                                                                }
                                                                {make.value}
                                                            </div>
                                                        )}
                                                        components={{ ValueContainer }}
                                                    />

                                                    <ErrorMessage
                                                        name="offsite-oem"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>

                                            <DealershipOwner />

                                            <GeneralManager />
                                            <div className="row mb-2 d-flex flex-wrap gap-2 ">
                                                <div className="col-2">
                                                    <label className="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                                        <Field
                                                            name="alwaysAvailable"
                                                            id="alwaysAvailable"
                                                            className="form-check-input"
                                                            type="checkbox"
                                                        />
                                                        <span className="form-check-label text-gray-700 fs-6 fw-semibold ms-0 ms-3">
                                                            Always available
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <UploadLogo
                                                IsImgAllowed={IsImgAllowed}
                                                handleImageChange={handleImageChange}
                                            />
                                            {logo && (
                                                <div className="text-start mb-2">
                                                    <img
                                                        src={logo}
                                                        alt="Dealer logo image"
                                                        width={100} // Set the fixed width
                                                        height={80} // Set the fixed height
                                                    />
                                                </div>
                                            )}

                                            <div className="row mb-2">
                                                <div className="form-floating col-12">
                                                    <Field
                                                        type="text"
                                                        name="notes"
                                                        id="notes"
                                                        className={`form-control mb-2 ${
                                                            errors?.notes && touched?.notes ? "is-invalid" : ""
                                                        }`}
                                                        placeholder="Notes"
                                                    />
                                                    <label
                                                        className="ms-3"
                                                        htmlFor="notes">
                                                        Notes
                                                    </label>
                                                    <ErrorMessage
                                                        name="notes"
                                                        component="div"
                                                        className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <FormikToast />
                                </div>
                                <div className="row add-dealer">
                                    <div className="col-12 col-md-2 col-lg-2 mb-2">
                                        <div className="pull-left">
                                            <Link
                                                className="btn color-white btn-dealer"
                                                // href="/admin/dealers"
                                                href={`/admin/dealers?key=${Math.random()
                                                    .toString(36)
                                                    .substring(2, 7)}`}
                                                aria-label="Back">
                                                <i className="fa-solid fa-arrow-left"></i> Back
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4 col-lg-4 mb-2 add-btn">
                                        <button
                                            type="submit"
                                            className="btn btn-theme btn-dealer">
                                            <i className="fa-solid fa-check"></i> {isInserting ? "Add" : "Update"}
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
export default AddDealer;
