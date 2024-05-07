"use client";
import React from "react";
import "../../contents/scss/card.scss";
import { appConfig } from "../../appConfig";

function Card(props) {
    const applyForJob = (item) => {
        if (item != null) {
            const recipient = appConfig.HR_EMAIL;
            const subject = `Job Tile: ${item?.title}`;
            const body = `Job description: ${item?.description}`;

            window.open(`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        }
    };

    return (
        <>
            {props?.jobInformation?.jobList?.map((item, index) => (
                <div
                    className="col-lg-4"
                    key={index}>
                    <div className="card card_career">
                        <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>

                            <p className="card_p card-text">{item.description}</p>
                            <span className="d-flex justify-content-start align-items-start">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M16 14.6666C16.7364 14.6666 17.3333 14.0697 17.3333 13.3333C17.3333 12.5969 16.7364 12 16 12C15.2636 12 14.6667 12.5969 14.6667 13.3333C14.6667 14.0697 15.2636 14.6666 16 14.6666ZM16 17.3333C18.2091 17.3333 20 15.5425 20 13.3333C20 11.1242 18.2091 9.33331 16 9.33331C13.7909 9.33331 12 11.1242 12 13.3333C12 15.5425 13.7909 17.3333 16 17.3333Z"
                                        fill="black"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M16.0017 24.8021C9.9275 18.6991 8.83982 14.1439 9.54496 11.3234C10.2793 8.38594 13.1281 6.66667 16.0017 6.66667C18.8753 6.66667 21.7239 8.38593 22.4583 11.3234C23.1634 14.1439 22.0756 18.6991 16.0017 24.8021ZM6.95791 10.6766C8.0569 6.28072 12.2083 4 16.0017 4C19.7951 4 23.9464 6.28073 25.0453 10.6766C26.1393 15.0526 24.0374 20.8548 16.9212 27.6322C16.4063 28.1226 15.5971 28.1226 15.0821 27.6322C7.96574 20.8548 5.8639 15.0526 6.95791 10.6766Z"
                                        fill="black"
                                    />
                                </svg>
                                <span>
                                    <p>{item.address?.name}</p>
                                </span>
                            </span>
                            <div className="d-flex align-items-end mt-4">
                                {/* <button className="btn btn-outline-primary border-purple border-purple-hover btn-sm"> */}
                                <button
                                    className="btn border-purple btn-sm"
                                    onClick={() => applyForJob(item)}>
                                    Apply
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
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Card;
