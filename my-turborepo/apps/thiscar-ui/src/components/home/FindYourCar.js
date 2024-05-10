"use client";
import { useState, useContext, useEffect } from "react";
import "../../contents/scss/findYourCar.scss";
import Link from "next/link";
import AppContext from "../../StateManagement/AppContext";
import { KbbModal } from "../cars/cardetails/CarDetailsOptions";
import { appConfig } from "../../appConfig";
import { FindYourCarSVG } from "../../contents/svgs/home";

const FindYourCar = ({ findYourCar }) => {
    const dealerId = appConfig.DEALER_ID;
    const url = `https://www.routeone.net/digital-retail-ui/?dealerId=${dealerId}`;
    const [inputValue, setInputValue] = useState("");

    const handleFinancingInfo = () => {
        window.open(url, "_blank");
    };
    useEffect(() => {
        loadQoreAI();
        setQoreAIActivated(false);
    }, []);

    const { openQoreAI, loadQoreAI, setQoreAIActivated, setLinkAllCars } = useContext(AppContext);
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const submitForm = () => {
        if (inputValue != null && inputValue != "") {
            setLinkAllCars(inputValue);
        }
    };

    return (
        <div className="container-fluid query-bg">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-4 px-4 my-5 d-flex flex-column justify-content-between section_border_right align-items-center">
                    <h3 className="sub_heading">{findYourCar.wantToKnow.heading}</h3>
                    <p className="query_text">
                        <b>{findYourCar.wantToKnow.subText}</b>
                    </p>
                    <button
                        data-bs-toggle="modal"
                        data-bs-target="#kbbModal"
                        className="mt-4 mt-md-5 btn btn-sm custom_btn">
                        <span>{findYourCar.shopByKeywordPlaceholder}</span>
                        <FindYourCarSVG />
                    </button>
                    <hr className="query_hr" />

                    <KbbModal />
                </div>
                <div className="col-12 col-lg-4 px-4 my-lg-5 d-flex flex-column justify-content-between align-items-center section_border_right ">
                    <h2 className="sub_heading">{findYourCar.shopAround.heading}</h2>
                    <p className="query_text">
                        <b>{findYourCar.shopAround.subText}</b>
                    </p>
                    <button
                        className="mt-4 mt-md-5 btn btn-sm custom_btn"
                        onClick={handleFinancingInfo}>
                        <span>{findYourCar.bodyStylePlaceholder}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="currentColor"
                            className="bi bi-arrow-right-short"
                            viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"></path>
                        </svg>
                    </button>

                    {/*Below commented mentioned code might be helpful in future */}
                    {/* <div className="wrapper ">
                        <form
                            action="/cars"
                            className="body-style">
                            <input
                                placeholder={findYourCar.bodyStylePlaceholder}
                                className="ps-lg-4"
                                value={inputValue}
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        submitForm();
                                    }
                                }}
                            />

                            <Link
                                href={`/cars`}
                                className="link">
                                <button
                                    className="btn btn-sm input_btn"
                                    onClick={submitForm}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        fill="currentColor"
                                        className="bi bi-arrow-right-short"
                                        viewBox="0 0 16 16">
                                        <path
                                            fillRule="evenodd"
                                            d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                                        />
                                    </svg>
                                </button>
                            </Link>
                        </form>
                    </div> */}

                    <hr className="query_hr" />
                </div>

                <div className="col-12 col-lg-4 px-4 py-5 d-flex flex-column justify-content-between align-items-center section-border-medium inner-bg">
                    <h2 className="sub_heading">{findYourCar.needHelp.heading}</h2>
                    <p className="query_text">
                        <b>{findYourCar.needHelp.subText}</b>
                    </p>
                    <Link
                        href={`/cars`}
                        className="link">
                        <button
                            //onClick={openQoreAI}
                            className="mt-4 mt-md-5 btn btn-sm custom_btn">
                            <span>{findYourCar.meetExpertPlaceholder}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="currentColor"
                                className="bi bi-arrow-right-short"
                                viewBox="0 0 16 16">
                                <path
                                    fillRule="evenodd"
                                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"></path>
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FindYourCar;
