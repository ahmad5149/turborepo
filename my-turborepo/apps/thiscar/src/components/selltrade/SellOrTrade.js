"use client";
import React from "react";
import "../../contents/scss/sellOrTrade.scss";
import { SellTradeImagePath } from "../common/defaultImage/DefaultPaths";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { SanityImage } from "@/sanity/SanityImage";
import { KbbModal, SellModal } from "../cars/cardetails/CarDetailsOptions";
import { SellOrTradeSVG } from "../../contents/svgs/sellTrade";

function SellOrTrade(props) {
    return (
        <div className="parent-div-color">
            <div className="container me-0 sell-car">
                <div className="row">
                    <div className="col-lg-6 left">
                        <h2>{props.sellOrTrade.heading}</h2>
                        <div className="border_bottom"></div>
                        <p>{props.sellOrTrade.subText1}</p>
                        <p className="pt-2">{props.sellOrTrade.subText2}</p>
                        <button
                            className="btn btn-sm custom_btn mt-4"
                            data-bs-toggle="modal"
                            data-bs-target="#sellModal">
                            {props.sellOrTrade.buttonLabel}
                            <SellOrTradeSVG />
                        </button>
                        <button
                            className="btn btn-sm custom_btn mt-4"
                            data-bs-toggle="modal"
                            data-bs-target="#kbbModal">
                            {props.sellOrTrade.buttonLabel2}
                            <SellOrTradeSVG />
                        </button>
                        <SellModal />
                        <KbbModal />
                    </div>
                    <div className="col-lg-6 right">
                        <div className="bg-color">
                            <SanityImage
                                src={props.sellOrTrade.image}
                                height={420}
                                width={1180}
                                defaultImage={GetDefaultImagePath(SellTradeImagePath)}
                                alt=""
                                className="image"></SanityImage>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellOrTrade;
