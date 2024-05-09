"use client";
import "../../contents/scss/searchMenu.scss";
import Select from "react-select";
import { Carousel } from "react-responsive-carousel";
import React, { useState, useContext, useEffect, useTransition } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AppContext from "../../StateManagement/AppContext";
import LoadingSpinner from "../../components/common/loader/LoadingSpinner";
import "../../contents/scss/spinner.scss";
import FilterBubbles from "./FilterBubbles";
import Image from "next/image";

import { sortings, handleSortingChange } from "@/utils/SortingUtil";
import CopyToClipboard from "../common/clipboard/CopyToClipboard";
import CarsNotFound from "./cardetails/CarsNotFound";
import { SearchMenuGreySVG } from "../../contents/svgs/cars";
import ToggleSwitch from "../common/toggleSwitch/ToggleSwitch";
import Link from "next/link";
import { appConfig } from "@/appConfig";
import { useAuth } from "../auth";
import { downloadInventory } from "@/actions/downloadInventory";

const CarouselComponent = ({ data, status }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleDotHover = (index) => {
        setActiveIndex(index);
    };

    const renderCarouselItems = () => {
        return data?.slice(0, 5).map((item, index) => (
            <div
                key={index}
                className="position-relative"
                style={{ overflow: "hidden", borderTopRightRadius: "4px", borderTopLeftRadius: "4px", width: "100%" }}>
                <Image
                    width={241}
                    height={181}
                    src={item}
                    quality={50}
                    alt={`Image ${index + 1}`}
                    className="img-fluid main-img w-100"
                />
                {/* {(status == "pending" || status == "cancelled" || status == "deposit") && (
                    <Image
                        width={241}
                        height={181}
                        src={"/media/sale-pending-banner.png"}
                        alt="banner-img"
                        className="position-absolute top-0 start-0 w-50 h-75 img-fluid banner"
                    />
                )} */}
                <p className="legend">{item.caption}</p>
            </div>
        ));
    };

    return (
        <div
            className="my-carousel-container"
            onMouseLeave={() => handleDotHover(0)}>
            <Carousel
                selectedItem={activeIndex}
                centerMode={false}
                centerSlidePercentage="100"
                showThumbs={false}
                dynamicHeight={true}
                showArrows={false}
                showStatus={false}
                preventMovementUntilSwipeScrollTolerance={true}
                swipeScrollTolerance={50}
                renderIndicator={(onClickHandler, isSelected, index, label) => {
                    const defStyle = {
                        marginLeft: 20,
                        color: "white",
                        cursor: "pointer"
                    };
                    const style = isSelected ? { ...defStyle, opacity: 1 } : { ...defStyle };
                    return (
                        <li
                            className="dot"
                            style={style}
                            value={index}
                            key={index}
                            tabIndex={0}
                            onMouseEnter={() => handleDotHover(index)}
                            aria-label={`${label} ${index + 1}`}></li>
                    );
                }}>
                {renderCarouselItems()}

                <div className="container-bg position-relative">
                    <img
                        src={`${data ? data[0] : "/media/Vehicle-3.png"}`}
                        className="img-fluid mahin-img"></img>

                    {(status == "pending" || status == "cancelled" || status == "deposit") && (
                        <Image
                            width={241}
                            height={181}
                            src={"/media/sale-pending-banner.png"}
                            alt="banner-img"
                            className="position-absolute top-0 start-0 w-50 h-75 img-fluid banner"
                        />
                    )}
                    <h1>+{data ? data.length - 5 : 0}</h1>
                </div>
            </Carousel>
        </div>
    );
};

const CustomStyle = {
    menu: (base) => ({
        ...base,
        zIndex: "2 !important"
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            "&:hover": {
                border: "1px solid transparent !important",
                backgroundColor: isSelected ? "#2A0A4D" : "#f2e8fc"
            },
            "&:active": {
                border: "1px solid #53119b !important"
            },
            cursor: "pointer",
            backgroundColor: isSelected ? "#2A0A4D" : "white",
            textAlign: "left"
        };
    },
    placeholder: (provided) => ({
        ...provided,
        textAlign: "left" // Aligns the placeholder text to the left
    }),
    control: (provided) => ({
        ...provided,
        border: "1px solid #2a0a4d !important",
        // height: 34px;
        borderRadius: "21px !important",
        fontSize: "12px !important",
        color: "#5c666f !important",
        textAlign: "left !important",
        fontWeight: "400 !important",
        minHeight: "34px",
        width: "240px",
        boxShadow: "none",

        "&:focus": {
            boxShadow: "none",
            textAlign: "left !important",
            borderColor: "#2a0a4d",
            outline: "0"
        }
    })
};

function SearchMenu(props) {
    const user = useAuth();
    const [isPending, startTransition] = useTransition();

    const {
        sortDropDown,
        setSortDropDown,
        dataLoaded,
        setFeatureItemVisible,
        showComingSoonCars,
        setShowComingSoonCars
    } = useContext(AppContext);

    useEffect(() => {
        setFeatureItemVisible(-1);
    }, []);

    const twentyFourHoursAgoTimestamp = Date.now() - 24 * 60 * 60 * 1000;

    return (
        <div className="bg-grey-search mt-2 mt-lg-0">
            <FilterBubbles
                updateAvailableModelsDropdown={props.updateAvailableModelsDropdown}
                ClearAllStates={props.ClearAllStates}
                AnyFilterSelected={props.AnyFilterSelected}
                allMakes={props.allMakes}
                minYear={props.minYear}
                maxYear={props.maxYear}
                yearValues={props.yearValues}
                setYearValues={props.setYearValues}
                minMileage={props.minMileage}
                maxMileage={props.maxMileage}
                mileageValues={props.mileageValues}
                setMileageValues={props.setMileageValues}
                minPrice={props.minPrice}
                maxPrice={props.maxPrice}
                priceValues={props.priceValues}
                minPayment={props.minPayment}
                maxPayment={props.maxPayment}
                paymentValues={props.paymentValues}
                setPriceValues={props.setPriceValues}
                setPaymentValues={props.setPaymentValues}
                bodyStyles={props.bodyStyles}
                updateBodyStyles={props.updateBodyStyles}
                interiorColors={props.interiorColors}
                exteriorColors={props.exteriorColors}
                setInteriorColors={props.setInteriorColors}
                setExteriorColors={props.setExteriorColors}
                allModels={props.allModels}
                availableModels={props.availableModels}
                updateAvailableModels={props.updateAvailableModels}
                filterValues={props.filterValues}
                allFacets={props.allFacets}
                make={props.make}
                updateMake={props.updateMake}
                model={props.model}
                updateModel={props.updateModel}
                engine={props.engine}
                updateEngine={props.updateEngine}
                door={props.door}
                updateDoor={props.updateDoor}
                cylinder={props.cylinder}
                updateCylinder={props.updateCylinder}
                fuel={props.fuel}
                updateFuel={props.updateFuel}
                transmission={props.transmission}
                updateTransmission={props.updateTransmission}
                train={props.train}
                updateTrain={props.updateTrain}
            />

            <div className="d-flex justify-content-between align-items-end mt-lg-3 pt-2 ps-2 pt-lg-0 margin-card-search card-serach">
                <div>
                    <span>
                        {props?.cars?.pagination?.total ? props.cars.pagination.total.toLocaleString() : 0} cars found
                    </span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    {appConfig.SHOW_COMING_SOON == "true" ? (
                        <ToggleSwitch
                            label={"Coming Soon"}
                            state={showComingSoonCars}
                            handleChange={() => setShowComingSoonCars(!showComingSoonCars)}
                        />
                    ) : null}
                    <CopyToClipboard
                        isMobile={false}
                        GenerateURL={props.GenerateURL}
                        fillColor={"rgb(83, 17, 155)"}
                    />
                    {user && user?.email.includes("thiscar.com") && (
                        <button
                            disabled={isPending}
                            className="btn"
                            onClick={() => {
                                startTransition(async () => {
                                    const downloadInvForUser = downloadInventory.bind(null, user?.email);
                                    await downloadInvForUser();
                                });
                            }}>
                            {isPending ? (
                                <>
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                                            opacity=".25"
                                        />
                                        <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                                            <animateTransform
                                                attributeName="transform"
                                                type="rotate"
                                                dur="0.75s"
                                                values="0 12 12;360 12 12"
                                                repeatCount="indefinite"
                                            />
                                        </path>
                                    </svg>{" "}
                                    Emailing
                                </>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    style={{ width: 24, height: 24 }}>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                    />
                                </svg>
                            )}
                        </button>
                    )}

                    <Select
                        options={sortings}
                        isSearchable={false}
                        value={sortDropDown !== "year" ? sortDropDown : sortings[2]}
                        placeholder="Select Sorting"
                        styles={CustomStyle}
                        className="mobile-d-ser"
                        onChange={(selectedOption) => handleSortingChange(selectedOption, setSortDropDown)}
                    />
                </div>
            </div>
            {props?.cars != null && props?.cars?.items?.length == 0 && (
                <CarsNotFound ErrorMessage="Nothing was found for your query" />
            )}

            {props?.cars != null && props?.cars?.items?.length > 0 && (
                <div className="ms-0 row col-md-12 h-100">
                    {props?.cars?.items?.map((doc, index) => {
                        const item = doc?.document ?? {};
                        item.status = item?.updatedAt < twentyFourHoursAgoTimestamp ? "pending" : null;
                        item.status = item.status == "deposit" ? "pending" : item.status;
                        return (
                            <React.Fragment key={index}>
                                {item?.year && (
                                    <div
                                        key={index}
                                        className="px-2 col-md-4 col-lg-3 mt-3 mb-3 mx-0 ">
                                        <div className="card card-main h-100 position-relative">
                                            <Link
                                                href={`/cars/${item.vin}`}
                                                passHref>
                                                <React.Fragment key="car-details-link">
                                                    {item.photoUrls && item.photoUrls.length >= 10 && (
                                                        <CarouselComponent
                                                            data={item?.photoUrls}
                                                            status={item?.status}
                                                        />
                                                    )}

                                                    {(!item.photoUrls || item.photoUrls.length < 10) && (
                                                        <div className="position-relative">
                                                            <Image
                                                                src={`/media/coming-soon.png`}
                                                                alt=""
                                                                width={241}
                                                                height={181}
                                                                className="coming-soon-img"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="card-body px-0">
                                                        <div className="parent">
                                                            <h5 className="text">{`${item.year} ${item.make} ${item.model} ${item.trim}`}</h5>
                                                            <div className="svg-container">
                                                                {/* <SearchMenuSVG /> */}
                                                                <SearchMenuGreySVG />
                                                            </div>
                                                        </div>
                                                        <p className="card-text">
                                                            {item.odometer ? item.odometer.toLocaleString() : 0} miles
                                                        </p>
                                                        <p className="card-text-paragraph">
                                                            {/* pricing */}
                                                            {sortDropDown.value == "nada" && (
                                                                <>
                                                                    <br />
                                                                    <span className="fs-6">
                                                                        <strong>NADA:</strong>{" "}
                                                                        {item.nada > 0
                                                                            ? `$${item.nada?.toLocaleString()}`
                                                                            : "No Data"}
                                                                    </span>
                                                                </>
                                                            )}
                                                            {sortDropDown.value != "nada" && (
                                                                <>
                                                                    <br />
                                                                    <span className="fs-6">
                                                                        <strong>MMR:</strong>{" "}
                                                                        {item.mmr
                                                                            ? `$${item.mmr?.toLocaleString()}`
                                                                            : "No Data"}{" "}
                                                                    </span>
                                                                    <br />

                                                                    <span className="fs-6">
                                                                        <strong>Auction Fees:</strong>{" "}
                                                                        {item.mmr > 0
                                                                            ? `$${item.mmrBuyFee?.toLocaleString()}`
                                                                            : "N/A"}
                                                                    </span>
                                                                    <br />
                                                                    <span className="fs-6">
                                                                        <strong>Auction Total:</strong>{" "}
                                                                        {item.mmr > 0
                                                                            ? `$${(
                                                                                  item.mmr + item.mmrBuyFee
                                                                              )?.toLocaleString()}`
                                                                            : "N/A"}
                                                                    </span>
                                                                </>
                                                            )}

                                                            <br />

                                                            <br />
                                                            <span className="text-success fs-6">
                                                                <strong>
                                                                    THIScar Price:{" "}
                                                                    {user && `$${item.dealerPrice.toLocaleString()}`}
                                                                </strong>
                                                            </span>
                                                        </p>
                                                        <div
                                                            className={`card-footer  fs-9 position-absolute w-100 ${
                                                                Math.sign(item.mmrEquity) > 0
                                                                    ? "text-success"
                                                                    : "text-body-tertiary"
                                                            }`}>
                                                            {/* {GetDeliveryInfo(item)} */}
                                                            {sortDropDown.value === "nada"
                                                                ? `Equity $${(
                                                                      item.nada -
                                                                      item.price +
                                                                      400
                                                                  ).toLocaleString()}`
                                                                : `Equity: $${
                                                                      item.mmrEquity
                                                                          ? (item.mmrEquity + 400).toLocaleString()
                                                                          : 400
                                                                  }`}
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {!dataLoaded && (
                        <div className="loading-spinner-center-align-srp">
                            <LoadingSpinner />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchMenu;
