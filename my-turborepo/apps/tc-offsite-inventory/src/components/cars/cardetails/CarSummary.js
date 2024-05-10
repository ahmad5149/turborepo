import React from "react";

function CarSummary(props) {
    return (
        <>
            <section>
                <div
                    className="accordion mb-3 mt-3 px-0 accordion-detail-car"
                    id="accordionExample">
                    <div className="accordion-item p-2">
                        <h2
                            className="accordion-header header-car"
                            id="headingOne">
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne-acc"
                                aria-expanded="true"
                                aria-controls="collapseOne">
                                Car Summary
                            </button>
                        </h2>
                        <h1 className="heading-display">Car Summary</h1>
                        <div
                            id="collapseOne-acc"
                            className="accordion-collapse collapse show"
                            aria-labelledby="headingOne">
                            <div className="accordion-body d-flex justify-content-between">
                                <div className="row summary-row gy-4">
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> Make</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p className="data">{props.make}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> Model</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p className="data">{props.model}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> Trim</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p className="data">{props.trim}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> Year</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p className="data">{props.year}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> VIN</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p
                                                style={{
                                                    userSelect: "none",
                                                    msUserSelect: "none",
                                                    WebkitUserSelect: "none",
                                                    MozUserSelect: "none"
                                                }}
                                                className="data">
                                                {props.vin}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> Body Type</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p className="data">{props.bodyStyle}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> MPG</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p className="data">
                                                {props.cityMPG}City / {props.hwyMPG}HWY
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> Interior Color</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p className="data">{props.interiorColor}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 sum-row">
                                        <div className="col-md-5 col-sm-3 col-5">
                                            <p className="label"> Exterior Color</p>
                                        </div>
                                        <div className="col-md-7 col-sm-9 col-7">
                                            <p className="data">{props.extColor}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CarSummary;
