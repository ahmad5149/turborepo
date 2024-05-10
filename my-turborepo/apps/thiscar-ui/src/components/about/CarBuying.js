"use client";
import React, { useState } from "react";
import "../../contents/scss/carBuying.scss";
import { CarBuyingTile1SVG, CarBuyingTile2SVG, CarBuyingTile3SVG } from "../../contents/svgs/about";

const CarBuying = (props) => {
    const [selectedStep, setSelectedStep] = useState(1);

    return (
        <div className="slider_section mt-5">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-4 col-lg-5  offset-xl-1 col-sm-12 padding-right">
                        <div className="left">
                            <h2>{props.onlineCarBuying.heading}</h2>
                            <p>{props.onlineCarBuying.subText}</p>
                            <ul className="nav nav-pills">
                                <li
                                    className={selectedStep === 1 ? "active" : ""}
                                    onClick={() => setSelectedStep(1)}>
                                    <a data-toggle="pill">Simpler</a>
                                </li>
                                <span className="separator"></span>
                                <li
                                    className={selectedStep === 2 ? "active" : ""}
                                    onClick={() => setSelectedStep(2)}>
                                    <a data-toggle="pill">Faster</a>
                                </li>
                                <span className="separator"></span>
                                <li
                                    className={selectedStep === 3 ? "active" : ""}
                                    onClick={() => setSelectedStep(3)}>
                                    <a data-toggle="pill">Smarter</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-7  col-lg-7 col-sm-12 right desktop-display-slider">
                        <div
                            id="home"
                            className={`tab-pane fade ${selectedStep === 1 && "in active"}`}>
                            <div className="bg_slider">
                                <h2 className="mobile-heading">Simpler</h2>
                                <p>{props.onlineCarBuying.tiles.tile1}</p>
                                <span className="svg-class">
                                    <CarBuyingTile1SVG />
                                </span>
                            </div>
                        </div>
                        <div
                            id="menu1"
                            className={`tab-pane fade ${selectedStep === 2 && "in active"}`}>
                            <div className="bg_slider">
                                <h2 className="mobile-heading">Faster</h2>
                                <p>{props.onlineCarBuying.tiles.tile2}</p>
                                <span className="svg-class">
                                    <CarBuyingTile2SVG />
                                </span>
                            </div>
                        </div>
                        <div
                            id="menu2"
                            className={`tab-pane fade ${selectedStep === 3 && "in active"}`}>
                            <div className="bg_slider">
                                <h2 className="mobile-heading">Smarter</h2>
                                <p>{props.onlineCarBuying.tiles.tile3}</p>
                                <span className=" svg-class">
                                    <CarBuyingTile3SVG />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarBuying;
