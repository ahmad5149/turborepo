"use client";
import "../../contents/scss/searchMenu.scss";
import Select from "react-select";
import { Carousel } from "react-responsive-carousel";
import React, { useState, useContext, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AppContext from "../../StateManagement/AppContext";
import LoadingSpinner from "../../components/common/loader/LoadingSpinner";
import "../../contents/scss/spinner.scss";
import FilterBubbles from "./FilterBubbles";
import Image from "next/image";
import StaticTile from "./StaticTile";
import { sortings, handleSortingChange } from "@/utils/SortingUtil";
import CopyToClipboard from "../common/clipboard/CopyToClipboard";
import CarsNotFound from "./cardetails/CarsNotFound";
import { SearchMenuSVG } from "../../contents/svgs/cars";
import ToggleSwitch from "../common/toggleSwitch/ToggleSwitch";
import Link from "next/link";

const CarouselComponent = ({ data, status }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleDotHover = (index) => {
        setActiveIndex(index);
    };

    const renderCarouselItems = () => {
        return data.slice(0, 5).map((item, index) => (
            <div
                key={index}
                className="position-relative">
                <Image
                    style={{ maxHeight: "180px" }}
                    width={241}
                    height={181}
                    src={item}
                    quality={50}
                    alt={`Image ${index + 1}`}
                    className="img-fluid main-img"
                />
                {(status == "pending" || status == "cancelled" || status == "deposit") && (
                    <Image
                        width={241}
                        height={181}
                        src={"/media/sale-pending-banner.png"}
                        alt="banner-img"
                        className="position-absolute top-0 start-0 w-50 h-75 img-fluid banner"
                    />
                )}
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
                        className="img-fluid main-img"></img>

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
                    {process.env.NEXT_PUBLIC_SHOW_COMING_SOON ? (
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
                <div className="ms-0 row col-md-12 h-100 w-100">
                    {props?.cars?.items?.map((doc, index) => {
                        const item = doc?.document ?? {};
                        const status = item?.updatedAt < twentyFourHoursAgoTimestamp ? "pending" : null;
                        item.status = status != null && status == "deposit" ? "pending" : item.status;
                        return (
                            <React.Fragment key={index}>
                                {item && "textAfterHighlighted" in item && (
                                    <div
                                        key={index}
                                        className="px-2 col-md-4 col-lg-3 mt-3  mb-3 mx-0  width-97">
                                        <div
                                            className="card d-flex flex-column h-100 align-items-start px-4 card-top-padding"
                                            style={{
                                                backgroundColor: item.tileBackgroundColor
                                            }}>
                                            <div className="text-left-align-contact">
                                                <span className="text-white text-left-align mb-0 me-3">
                                                    {item.textBeforeHighlighted}
                                                </span>

                                                <div
                                                    className="first-word mr-2 ml-2"
                                                    data-v-56b45f3e="">
                                                    <span
                                                        className="first-word__text pre-approved"
                                                        data-v-56b45f3e="">
                                                        {item.highlightedText}
                                                    </span>{" "}
                                                    <StaticTile backgroundColor={item.hightlightedTextColor} />
                                                </div>
                                                <span className="text-white text-left-align mb-0 margin-left">
                                                    {item.textAfterHighlighted}
                                                </span>
                                                <h4 className="text-white fw-900 text-left-align-contact mt-3">
                                                    {item.contactNumber}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {item?.year && (
                                    <div
                                        key={index}
                                        className="px-2 col-md-4 col-lg-3 mt-3 mb-3 mx-0 ">
                                        <div className="card card-main h-100 position-relative">
                                            <Link
                                                href={`cars/${item.vin}`}
                                                passHref>
                                                <React.Fragment key="car-details-link">
                                                    {item.numberOfPhotos >= 10 && (
                                                        <CarouselComponent
                                                            data={item?.photoUrls}
                                                            status={item?.status}
                                                        />
                                                    )}
                                                    {/* {item.numberOfPhotos < 10 (
                                                            <div className="position-relative">
                                                                <Image
                                                                    src={item.photoUrls[0]}
                                                                    alt=""
                                                                    width={241}
                                                                    height={181}
                                                                    className="coming-soon-img"
                                                                />
                                                                {item.status == "pending" && (
                                                                    <Image
                                                                        width={241}
                                                                        height={181}
                                                                        src={"/media/sale-pending-banner.png"}
                                                                        alt="banner-img"
                                                                        className="position-absolute top-0 start-0 w-50 h-75 img-fluid banner"
                                                                    />
                                                                )}
                                                            </div>
                                                        )} */}
                                                    {item.numberOfPhotos < 10 && (
                                                        <div className="position-relative">
                                                            <Image
                                                                src={`/media/coming-soon.png`}
                                                                alt=""
                                                                width={241}
                                                                height={181}
                                                                className="coming-soon-img"
                                                            />
                                                            {(item.status == "pending" ||
                                                                item.status == "cancelled" ||
                                                                item.status == "deposit") && (
                                                                <Image
                                                                    width={241}
                                                                    height={181}
                                                                    src={"/media/sale-pending-banner.png"}
                                                                    alt="banner-img"
                                                                    className="position-absolute top-0 start-0 w-50 h-75 img-fluid banner"
                                                                />
                                                            )}
                                                        </div>
                                                        // <div
                                                        //     className="position-relative"
                                                        //     style={{ backgroundColor: "#eaeef2" }}>
                                                        //     <PhotoUrlsNotFoundSVG />

                                                        //     {(item.status == "pending" ||
                                                        //         item.status == "cancelled" ||
                                                        //    item.status == "deposit") && (
                                                        //         <img
                                                        //             src={"../media/sale-pending-banner.png"}
                                                        //             className="position-absolute top-0 start-0 w-50 h-75 img-fluid banner"></img>
                                                        //     )}
                                                        // </div>
                                                    )}
                                                    <div className="card-body px-0 pb-0 card-desk-active">
                                                        <div className="parent">
                                                            <h5 className="text">{`${item.year} ${item.make} ${item.model} ${item.trim}`}</h5>
                                                            <div className="svg-container">
                                                                <SearchMenuSVG />
                                                            </div>
                                                        </div>
                                                        <p className="card-text">
                                                            {item.odometer ? item.odometer.toLocaleString() : 0} miles
                                                        </p>
                                                        <p className="card-text-paragraph">
                                                            ${item?.price ? item?.price?.toLocaleString() : 0}
                                                        </p>
                                                        <div className="card-footer text-muted fs-9 position-absolute w-100">
                                                            {/* {GetDeliveryInfo(item)} */}
                                                            10-day Money-Back Guarantee
                                                        </div>
                                                    </div>

                                                    <div className="card-mob-active">
                                                        <div className="d-flex justify-content-between mt-4 mb-2 px-2 w-100">
                                                            <div className="d-flex flex-column w-75 align-items-start">
                                                                <h3 className="text-left mob-title">{`${item.year} ${item.make} ${item.model} ${item.trim}`}</h3>
                                                                <p className="p-style">
                                                                    {item.odometer ? item.odometer.toLocaleString() : 0}{" "}
                                                                    miles
                                                                </p>
                                                            </div>
                                                            <div className="d-flex flex-column w-50 ">
                                                                <p className="p-style f-30p mb-4 mt-0">
                                                                    ${item.price ? item.price.toLocaleString() : 0}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="card-footer bg-white">
                                                            <p className="mb-0 f-17p">10-day Money-Back Guarantee</p>
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
