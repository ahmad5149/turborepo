"use client";
import React, { useState } from "react";
import { FieldArray, Field, useFormikContext } from "formik";
import Select from "react-select";
import { searchDealer } from "@/services/dealerService";
const uuid = require("uuid");

export function SecondaryDealershipMobile({ selectedMultiDealers, setSelectedMultiDealers, dealerOptions }) {
    const { values, setFieldValue } = useFormikContext();
    const [dealers, setDealers] = useState(dealerOptions);
    const [dealerLoading, setDealerLoading] = useState(false);

    const handleChangeMultiDealerShip = (value, index) => {
        setDealerLoading({ ...dealerLoading, [index]: true });
        if (value) {
            searchDealer(value).then((dealers) => {
                setDealers(dealers);
            });
        } else {
            setDealers(dealerOptions);
        }
        setDealerLoading({ ...dealerLoading, [index]: false });
    };
    const handleChangeMultiDealerShipOnchange = (value, index) => {
        const updatedSelectedMultiDealers = [...selectedMultiDealers];
        updatedSelectedMultiDealers[index] = value;
        setSelectedMultiDealers(updatedSelectedMultiDealers);
        setFieldValue(`secondaryDealership[${index}].chromeDealerId`, value.value);
        setFieldValue(`secondaryDealership[${index}].uuid`, uuid.v4());
    };

    return (
        <div className="s-dealership-mobile">
            <FieldArray name="secondaryDealership">
                {({ remove, push }) => (
                    <>
                        {values?.secondaryDealership?.length > 0 &&
                            values.secondaryDealership.map((attr, index) => (
                                <div
                                    className="row align-items-center"
                                    key={index}>
                                    <div className="col-md-4 fv-row fv-plugins-icon-container pb-5">
                                        <div className="col-md-4 fv-row fv-plugins-icon-container">
                                            <h4 className="fs-4 text-start">Secondary dealership</h4>
                                        </div>
                                        <div className="d-flex align-items-center dealership-selection">
                                            <Select
                                                name={`secondaryDealership[${index}].chromeDealerId`}
                                                options={dealers}
                                                closeMenuOnSelect={true}
                                                isLoading={dealerLoading?.[index]}
                                                isSearchable
                                                onInputChange={(e) => {
                                                    handleChangeMultiDealerShip(e, index);
                                                }}
                                                value={selectedMultiDealers?.[index] || []}
                                                onChange={(value) => {
                                                    handleChangeMultiDealerShipOnchange(value, index);
                                                }}
                                            />
                                            <div className="col-md-1 fv-row fv-plugins-icon-container text-start">
                                                <span
                                                    className="ps-5"
                                                    role="button"
                                                    onClick={() => {
                                                        let updatedArray = [...selectedMultiDealers];
                                                        updatedArray.splice(index, 1);
                                                        setSelectedMultiDealers(updatedArray);
                                                        remove(index);
                                                    }}>
                                                    <i class="ki-duotone ki-basket fs-2x">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                        <span className="path3"></span>
                                                        <span className="path4"></span>
                                                    </i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-check mb-2 form-check-sm form-check-custom form-check-solid">
                                            <div className="card-title">
                                                <div className="col-md-3">
                                                    <h4 className="fs-4 text-start">Notification permissions</h4>
                                                </div>
                                                <label className="ps-0 mb-3 form-check  form-switch-sm form-check-solid flex-stack">
                                                    <Field
                                                        name={`secondaryDealership[${index}].receiveNotification`}
                                                        id={`secondaryDealership[${index}].receiveNotification`}
                                                        className="form-check-input"
                                                        type="checkbox"
                                                    />
                                                    <span className="ms-3 text-gray-700 fs-6 fw-semibold ms-0 me-2">
                                                        Receive notification
                                                    </span>
                                                </label>

                                                <label className="ps-4  form-check  form-switch-sm form-check-custom form-check-solid flex-stack">
                                                    <Field
                                                        name={`secondaryDealership[${index}].escalationNotification`}
                                                        id={`secondaryDealership[${index}].escalationNotification`}
                                                        className="form-check-input"
                                                        type="checkbox"
                                                    />
                                                    <span className="ms-3 text-gray-700 fs-6 fw-semibold ms-0 me-2">
                                                        Escalation notification
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-check form-check-sm form-check-custom form-check-solid">
                                            <div className="card-title">
                                                <div className="col-md-4">
                                                    <h4 className="fs-4 text-start">Set rights</h4>
                                                </div>
                                                <label className="pb-4 ps-4 form-check form-check-custom form-check-solid">
                                                    <Field
                                                        name={`secondaryDealership[${index}].role`}
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
                                                        name={`secondaryDealership[${index}].role`}
                                                        className="form-check-input"
                                                        type="radio"
                                                        value="dealerUser"
                                                    />
                                                    <span className="ms-3 text-gray-700 fs-6 fw-semibold me-2">
                                                        Dealer Contact
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        <button
                            type="button"
                            className="btn btn-contact color-white"
                            onClick={() =>
                                push({
                                    uuid: "",
                                    userId: "",
                                    chromeDealerId: null,
                                    escalationNotification: false,
                                    receiveNotification: false,
                                    role: ""
                                })
                            }>
                            <i class="ki-duotone ki-plus-circle text-info fs-2qx">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                            Add dealership
                        </button>
                    </>
                )}
            </FieldArray>
        </div>
    );
}
