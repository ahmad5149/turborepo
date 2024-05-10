import React from "react";
import "../../contents/scss/moneyBackGuarantee.scss";
import { CarDeskPath, CarIconPath, IconMoneyBackPath, SmilePath } from "../common/defaultImage/DefaultPaths";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { SanityImage } from "@/sanity/SanityImage";

function MoneyBackGuarantee({ moneyBackGuarantee }) {
    return (
        <div className="money_back">
            <div className="row container-fluid mx-0 px-0">
                <div className="col-lg-6 col-sm-12 left ps-0">
                    <div className="card-counter">
                        <div className="image-counter">
                            <SanityImage
                                src={moneyBackGuarantee.moneyBackGuaranteeIcon}
                                style={{
                                    maxWidth: "130px",
                                    maxHeight: "150px"
                                }}
                                width={130}
                                height={150}
                                defaultImage={GetDefaultImagePath(IconMoneyBackPath)}
                                alt=""
                            />
                        </div>
                        <div className="text_section">
                            {" "}
                            <h1>{moneyBackGuarantee.moneyBackGuaranteeHeading}</h1>
                            <p>{moneyBackGuarantee.moneyBackGuaranteeAfterTestOwn}</p>
                            <span>
                                <p>{moneyBackGuarantee.buyBackGuarantee}</p>
                            </span>{" "}
                        </div>
                    </div>

                    <div className="card-counter2">
                        <div className="image-counter">
                            {" "}
                            <SanityImage
                                src={moneyBackGuarantee.peaceOfMindIcon}
                                style={{
                                    maxWidth: "125px",
                                    maxHeight: "140px"
                                }}
                                width={125}
                                height={140}
                                defaultImage={GetDefaultImagePath(SmilePath)}
                                alt=""
                            />
                        </div>
                        <div className="text_section">
                            {" "}
                            <h1>{moneyBackGuarantee.peaceOfMindHeading}</h1>
                            <p>{moneyBackGuarantee.peaceOfMindInspectedCar}</p>
                        </div>
                    </div>
                    <div className="card-counter3">
                        <div className="image-counter selection-image">
                            {" "}
                            <SanityImage
                                src={moneyBackGuarantee.selectionIcon}
                                defaultImage={GetDefaultImagePath(CarIconPath)}
                                alt=""
                                width={120}
                                height={130}
                            />
                        </div>
                        <div className="text_section">
                            {" "}
                            <h1>{moneyBackGuarantee.selectionHeading}</h1>
                            <p>{moneyBackGuarantee.selectionNationwideVehicles}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-sm-12 right px-0">
                    <SanityImage
                        // className='w-100 h-100'
                        src={moneyBackGuarantee.moneyBackGuaranteeImg}
                        defaultImage={GetDefaultImagePath(CarDeskPath)}
                        alt=""
                        style={{
                            maxWidth: "750px",
                            maxHeight: "950px"
                        }}
                        width={750}
                        height={950}
                    />
                </div>
            </div>
        </div>
    );
}

export default MoneyBackGuarantee;
