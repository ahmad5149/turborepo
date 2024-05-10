"use client";
import { ErrorMessage, Field } from "formik";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const UploadLogo = ({ IsImgAllowed, handleImageChange }) => {
    const handleLogoChange = (e) => {
        Swal.fire({
            title: "Are you sure you want make changes in logo?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then(async (result) => {
            if (result.isConfirmed) {
                handleImageChange(e);
            }
        });
    };
    return (
        <div>
            <label className="d-block">
                <div>
                    <span className=" text-gray-700 fs-6 fw-semibold ms-0 me-2 float-start">Logo</span>

                    <div className="fv-row mb-2">
                        <Field
                            type="file"
                            id="file"
                            name="file"
                            value={undefined}
                            className="invisible"
                            onChange={handleLogoChange}
                        />

                        <div
                            className="dropzone dz-clickable"
                            id="kt_ecommerce_add_product_media">
                            <div className="dz-message needsclick">
                                <i className="ki-duotone ki-file-up text-primary fs-3x">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                </i>
                                <div className="ms-4">
                                    <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                                        Drop files here or click to upload.
                                    </h3>
                                    <span className="fs-7 fw-semibold text-gray-400">
                                        Supported image formats: jpeg, png, gif
                                    </span>
                                </div>
                            </div>
                        </div>
                        {IsImgAllowed && (
                            <div className="text-start pt-2 text-danger">
                                Please upload a valid image file (JPEG, PNG, GIF, JPG)
                            </div>
                        )}
                    </div>
                </div>
                <br />
                <ErrorMessage
                    name="file"
                    component="div"
                />
            </label>
        </div>
    );
};

export default UploadLogo;
