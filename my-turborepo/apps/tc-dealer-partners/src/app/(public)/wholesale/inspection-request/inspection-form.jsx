"use client";
import { RequestInspectionAction } from "../actions/requestInspection";
import { DecodeVIN } from "@/actions/vinDecode";
import { useAuth } from "@/components/auth";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton({ label, loading }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            className="btn btn-primary">
            {pending ? loading : label}
        </button>
    );
}

export default function InspectionForm({ dealer }) {
    const user = useAuth();
    const [decodeState, decodeAction] = useFormState(DecodeVIN);
    const [reportState, reportAction] = useFormState(RequestInspectionAction);
    const [miles, setMiles] = useState({});
    const [reserve, setReserve] = useState({});
    const [vins, setVins] = useState([{ vin: "" }]);

    if (decodeState && !decodeState.error) {
        const vehicles = decodeState.decodedVins;
        const errors = decodeState.errorVins;
        return (
            <div className="body-text">
                <div className="mb-4">
                    <h5
                        style={{ fontFamily: "Avenir-Light", color: "#222222" }}
                        className="card-text">
                        VINS Included {vehicles.length}
                    </h5>
                    {errors && errors.length > 0 && (
                        <div className="d-flex flex-column gap-2">
                            {errors.map((e) => (
                                <div className="alert alert-danger w-100 w-md-25">
                                    {e.vin} - {e.error}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <form
                    action={reportAction}
                    className="mw-50">
                    <input
                        value={user.email}
                        name="user"
                        type="hidden"
                    />
                    <input
                        value={dealer.name}
                        name="dealer"
                        type="hidden"
                    />
                    <input
                        value={dealer.dealerURI}
                        name="dealerURI"
                        type="hidden"
                    />
                    <input
                        value={dealer.id}
                        name="dealerId"
                        type="hidden"
                    />

                    <ul className="list-group list-group-flush m-0 p-0">
                        {vehicles.map((v, i) => (
                            <li
                                key={v.vin}
                                style={{ backgroundColor: i % 2 ? "#fdfbfb" : "white" }}
                                className="list-group-item">
                                <div className="mb-3 d-flex flex-column flex-md-row gap-4">
                                    <div>
                                        <label htmlFor={`vin-${i}`}>VIN</label>
                                        <input
                                            value={v.vin}
                                            name={`vin-${i}`}
                                            type="text"
                                            readOnly={true}
                                            className="form-control-plaintext"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 d-flex flex-column flex-md-row gap-4">
                                    <div>
                                        <label htmlFor={`year-${i}`}>Year</label>
                                        <input
                                            className="form-control-plaintext"
                                            value={v.ModelYear}
                                            name={`year-${i}`}
                                            type="text"
                                            readOnly={true}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`make-${i}`}>Make</label>
                                        <input
                                            className="form-control-plaintext"
                                            value={v.Make}
                                            name={`make-${i}`}
                                            type="text"
                                            readOnly={true}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`model-${i}`}>Model</label>
                                        <input
                                            className={v.Model ? "form-control-plaintext" : "form-control"}
                                            defaultValue={v.Model}
                                            name={`model-${i}`}
                                            type="text"
                                            readOnly={v.Model ? true : false}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3 d-flex flex-column flex-md-row gap-2">
                                    <div>
                                        <label
                                            htmlFor={`miles-${i}`}
                                            className={`form-label ${
                                                reportState?.errors &&
                                                reportState?.errors[v.vin]?.miles &&
                                                "text-danger"
                                            }`}>
                                            Miles
                                        </label>
                                        <input
                                            className={`form-control ${
                                                reportState?.errors && reportState?.errors[v.vin]?.miles && "is-invalid"
                                            }`}
                                            type="text"
                                            name={`miles-${i}`}
                                            value={miles[`miles-${i}`]}
                                            onChange={(e) =>
                                                setMiles({
                                                    ...miles,
                                                    [`miles-${i}`]:
                                                        e.target.value.length > 0
                                                            ? parseInt(
                                                                  e.target.value.replace(/\D/g, "")
                                                              ).toLocaleString()
                                                            : miles[`miles-${i}`]
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`reserve-${i}`}
                                            className={`form-label ${
                                                reportState?.errors &&
                                                reportState?.errors[v.vin]?.reserve &&
                                                "text-danger"
                                            }`}>
                                            Reserve
                                        </label>
                                        <input
                                            className={`form-control ${
                                                reportState?.errors &&
                                                reportState?.errors[v.vin]?.reserve &&
                                                "is-invalid"
                                            }`}
                                            type="text"
                                            name={`reserve-${i}`}
                                            value={reserve[`reserve-${i}`]}
                                            onChange={(e) =>
                                                e.target.value.length > 0
                                                    ? setReserve({
                                                          [`reserve-${i}`]: parseInt(
                                                              e.target.value.replace(/\D/g, "")
                                                          ).toLocaleString()
                                                      })
                                                    : reserve[`reserve-${i}`]
                                            }
                                        />
                                    </div>
                                    <div
                                        className="d-flex flex-column"
                                        style={{ flexGrow: 1 }}>
                                        <label
                                            htmlFor={`comments-${i}`}
                                            className="form-label">
                                            Comments
                                        </label>
                                        <input
                                            placeholder="e.g., Will take calls for offers/trades"
                                            name={`comments-${i}`}
                                            id="comments"
                                            className="form-control"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="px-3">
                        <SubmitButton
                            label="Submit"
                            loading={"Submitting"}
                        />
                    </div>
                </form>
            </div>
        );
    }

    return (
        <form action={decodeAction}>
            {decodeState && decodeState.error ? <div className="alert alert-danger">{decodeState.error}</div> : null}
            {vins.map((v, i) => (
                <div
                    key={i}
                    className="form-group">
                    <label
                        htmlFor={`vin`}
                        className="form-label">
                        VIN
                    </label>
                    <input
                        onChange={(e) => console.log(e.target.value)}
                        className="form-control"
                        name={`vin`}
                        defaultValue={v.vin}
                    />
                </div>
            ))}

            <div className="mt-4 d-flex gap-2">
                <button
                    onClick={() => setVins([...vins, { vin: "" }])}
                    type="button"
                    className="btn btn-dark">
                    Add Another
                </button>

                <SubmitButton
                    label="Continue"
                    loading={"Decoding..."}
                />
            </div>
        </form>
    );
}
