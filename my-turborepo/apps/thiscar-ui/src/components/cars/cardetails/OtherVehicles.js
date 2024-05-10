"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GetDeliveryInfo } from "@/utils/helpers/carDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { OtherVehiclesScribbleSVG, OtherVehiclesModalSVG } from "../../../contents/svgs/carDetails";

function OtherVehicles({ similarCars, legalPopupData }) {
    const headingOtherCars = "Other Vehicles You May Like";
    if (similarCars) {
        similarCars.items.forEach((item, index) => {
            if (!item.document.photoUrls || item.document.photoUrls.length < 10) {
                // If photoUrls don't exist or have less than 10 items, remove this item from the array
                similarCars.items.splice(index, 1);
            }
        });
    }
    const numCardsToShow = Math.min(5, similarCars.items.length);

    const [shouldRenderSlider, setShouldRenderSlider] = useState(false);
    useEffect(() => {
        setShouldRenderSlider(true);
    }, []);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const renderCarCards = () => {
        if (shouldRenderSlider) {
            const Slider = require("react-slick").default;
            require("slick-carousel/slick/slick.css");
            require("slick-carousel/slick/slick-theme.css");

            const settings = {
                slidesToShow: 5,
                slidesToScroll: 1,
                infinite: false,
                responsive: [
                    {
                        breakpoint: 1025,
                        settings: {
                            slidesToShow: 2.7
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2.6
                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            slidesToShow: 1.4
                        }
                    }
                ]
            };

            return (
                <Slider {...settings}>
                    {shuffleArray(similarCars.items)
                        .slice(0, numCardsToShow)
                        .map((car, index) => (
                            <CarCard
                                key={index}
                                car={car.document}
                            />
                        ))}
                </Slider>
            );
        }

        return null;
    };

    return (
        <>
            <section>
                <div className="row mx-0 row-card-main mt-3 justify-content-center break-line pb-2">
                    <h2>{headingOtherCars}</h2>
                </div>

                {numCardsToShow > 0 && numCardsToShow && (
                    <div className="row mx-0 row-card-main justify-content-center">{renderCarCards()}</div>
                )}
            </section>
            <div>
                <div
                    className="modal fade legalMumboJumboModal"
                    id="legalMumboJumboModal"
                    tabIndex="-1"
                    aria-labelledby="legalMumboJumboModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popup modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="mb-0">{legalPopupData.popUpHeading} </h3>
                                <button
                                    type="button"
                                    className="close closeModal"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        size="lg"
                                    />
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>{legalPopupData.popUpText}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    data-bs-dismiss="modal"
                                    className="btn btn-lg mt-2 custom_btn">
                                    {legalPopupData.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function CarCard({ car }) {
    const odoMeter = "miles";
    const currencyType = "$";

    const handleSimilarCars = () => {
        window.open(`/cars/${car.vin}`, "_blank");
    };

    const handleCardClick = (event) => {
        const targetClassList = event.target.classList;
        if (!targetClassList.contains("svg-update")) {
            handleSimilarCars();
        }
    };

    return (
        <div className="col-md">
            <div
                className="card card-main handleSimilarCars"
                onClick={handleCardClick}>
                {car.photoUrls && car.photoUrls.length >= 10 && (
                    <Image
                        src={car.photoUrls[0]}
                        alt="Car Image"
                        width={240}
                        height={170}
                        className="card-img-top img"
                    />
                )}
                {/* {(!car.thumbnails || car.thumbnails.length < 10) && (
                    <Image
                        src={`/media/coming-soon.png`}
                        alt=""
                        width={924}
                        height={693}
                        className="coming-soon-img"
                    />
                )} */}
                <div className="card-body d-flex flex-column justify-content-between px-0 pb-0">
                    <div className="card-text-container">
                        <div className="parent">
                            <h5 className="text">{`${car.year} ${car.make} ${car.model} ${car.trim}`}</h5>
                            <div className="svg-container">
                                <OtherVehiclesScribbleSVG />
                            </div>
                        </div>
                        <p className="card-text">
                            {car.odometer.toLocaleString()} {odoMeter}
                        </p>
                        <p className="card-text-paragraph">
                            {currencyType}
                            {car.price.toLocaleString() + " "}
                        </p>
                        <span>
                            <OtherVehiclesModalSVG />
                        </span>
                    </div>
                    <div className="card-footer text-muted fs-9">{GetDeliveryInfo(car)}</div>
                </div>
            </div>
        </div>
    );
}

export default OtherVehicles;
