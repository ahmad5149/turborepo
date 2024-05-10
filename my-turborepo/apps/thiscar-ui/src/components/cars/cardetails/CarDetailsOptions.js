"use client";
import React from "react";
import phoneNumber from "../../../utils/helpers/PhoneNumbers";
import { CarDetailsCallSVG } from "../../../contents/svgs/carDetails";

function CarDetailsOptions(props) {
    return (
        <>
            <div className="col-12">
                <section>
                    <div className="col-lg-12 ms-0 px-0">
                        <div className="d-flex bg-white justify-content-evenly p-4 my-3 border-radius-25 mobile-dir-list">
                            <a
                                className="tab-deatil"
                                href={`tel:${phoneNumber}`}>
                                <CarDetailsCallSVG />
                                <p className="text-white">Click to Call</p>
                            </a>
                            <div
                                className="tab-deatil"
                                data-bs-toggle="modal"
                                data-bs-target="#vehicleHistoryModal">
                                <img src="/media/VehicleHistoryReport.png" />
                                <p className="text-white">Vehicle history report</p>
                            </div>
                            <div
                                data-bs-toggle="modal"
                                data-bs-target="#kbbModal"
                                className="tab-deatil bg-card-yellow-shadow">
                                <img src="/media/handbro.png" />
                                <p className="text-grey">Value My Trade</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div
                    className="modal customModal"
                    id="origWindowModal"
                    role="dialog">
                    <div className="modal-dialog modal-dialog-responsive">
                        <div className="modal-content">
                            <div className="modal-header buttonContainer">
                                <button
                                    type="button"
                                    className="btn-close  btn-modal-cls closeButton"
                                    data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body modal-style-body">
                                <iframe
                                    src={props.origWindowDetails}
                                    frameBorder="0"
                                    height="100%"
                                    width="100%"
                                    allowFullScreen=""
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="modal customModal"
                    id="vehicleHistoryModal"
                    role="dialog">
                    <div className="modal-dialog modal-dialog-responsive">
                        <div className="modal-content">
                            <div className="modal-header buttonContainer">
                                <button
                                    type="button"
                                    className="btn-close  btn-modal-cls closeButton mb-2"
                                    data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body modal-style-body">
                                <iframe
                                    srcDoc={props.vehicleAccident}
                                    frameBorder="0"
                                    height="100%"
                                    width="100%"
                                    allowFullScreen=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <KbbModal />
            </div>
        </>
    );
}

export default CarDetailsOptions;

export function SellModal() {
    return (
        <div
            className="modal customModal"
            id="sellModal"
            role="dialog">
            <div className="modal-dialog modal-dialog-responsive">
                <div className="modal-content">
                    <div className="modal-header buttonContainer">
                        <button
                            type="button"
                            className="btn-close  btn-modal-cls closeButton mb-2"
                            data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body modal-style-body">
                        <iframe
                            src="https://mobile.tradeinvalet.com/TradeInValet/LandingPage?EncryptDealerId=M746Fx2MeN+9BGA6gDgfzQ==&SalesStaffId=0&IsFirsTime=True"
                            height="100%"
                            width="100%"
                            allowFullScreen=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function KbbModal() {
    return (
        <div
            className="modal customModal"
            id="kbbModal"
            role="dialog">
            <div className="modal-dialog modal-dialog-responsive">
                <div className="modal-content">
                    <div className="modal-header buttonContainer">
                        <button
                            type="button"
                            className="btn-close  btn-modal-cls closeButton mb-2"
                            data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body modal-style-body">
                        <iframe
                            src="https://mobile.tradeinvalet.com/TradeInValet/LandingPage?DealerId=3063&SalesStaffId=0&IsFirsTime=True"
                            height="100%"
                            width="100%"
                            allowFullScreen=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
