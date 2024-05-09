"use client";
import React, { useState, useEffect, useContext } from "react";
import Slider from "react-slider";
import Select, { components } from "react-select";
import "../../contents/scss/searchSide.scss";
import * as Colors from "@/utils/helpers/ColorCodes";
import AppContext from "../../StateManagement/AppContext";
import FilterBubbles from "./FilterBubbles";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sortings, handleSortingChange } from "@/utils/SortingUtil";
import CopyToClipboard from "../common/clipboard/CopyToClipboard";
import ToggleSwitch from "../common/toggleSwitch/ToggleSwitch";
import {
    ConvertibleSVG,
    CoupeSVG,
    ElectricSVG,
    HatchBackSVG,
    SUVSVG,
    SedanSVG,
    TruckSVG,
    VanSVG,
    WagonSVG,
    ColorWheelSVG,
    ManualSVG,
    AutomaticSVG
} from "./FilterSVGs";

const CustomStyle = {
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: data.color,
            color: "#fff",
            padding: "0px !important",
            margin: "0px !important"
        };
    },
    multiValueContainer: (styles) => {
        return {
            ...styles,
            padding: "0px !important",
            paddingLeft: "0px",
            margin: "0px !important"
        };
    },
    multiValueRemove: (base) => ({
        ...base,
        display: "none"
    }),
    option: (base) => ({
        ...base,
        borderRadius: "25px",
        border: "1px solid #cfcfd4",
        backgroundColor: "transparent !important",
        fontSize: "11px !important",
        textAlign: "left !important",
        padding: "12px",
        marginTop: "5px",
        cursor: "pointer",
        "&:hover": {
            border: "1px solid transparent !important",
            backgroundColor: "#f2e8fc !important"
        },
        "&:active": {
            border: "1px solid #53119b !important"
        }
    }),
    group: (base) => ({
        ...base,
        fontSize: "14px !important",
        textAlign: "left !important"
    }),
    menu: (base) => ({
        ...base,
        padding: "12px !important",
        zIndex: "20"
    }),
    menuList: (base) => ({
        ...base,
        padding: "0px !important",
        backgroundColor: "white",
        "::-webkit-scrollbar": {
            width: "4px",
            height: "0px"
        },
        "::-webkit-scrollbar-track": {
            background: "#f1f1f1"
        },
        "::-webkit-scrollbar-thumb": {
            background: "#C2C2CF"
        }
    }),
    groupHeading: (base) => ({
        ...base,
        fontSize: "14px",
        color: "black"
    }),
    selectContainer: (base) => ({
        ...base,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }),
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
        minWidth: "100%",
        boxShadow: "none",
        touchAction: "manipulation",
        "&:focus": {
            boxShadow: "none",
            textAlign: "left !important",
            borderColor: "#2a0a4d",
            outline: "0"
        },
        "@media (max-width: 575px)": {
            fontSize: "16px !important"
        }
    }),
    container: (provided) => ({
        ...provided,
        width: "100%"
    })
};

const ClearFilters = ({ updateState, value }) => {
    return (
        <a
            className="clear-all"
            onClick={() => updateState(value)}>
            Clear
        </a>
    );
};

const ValueContainer = ({ children, ...props }) => {
    let [values, input] = children;

    const length = props.selectProps.value.length;

    if (Array.isArray(values)) {
        values = "select make";
        if (length && length > 0) {
            values = props.selectProps.value.map((obj) => obj.label.split(" ").slice(0, -1).join(" ")).join(", ");
        }
    }
    return (
        <components.ValueContainer {...props}>
            {values}
            {input}
        </components.ValueContainer>
    );
};

const ExtractNameAndCount = ({ carString }) => {
    // Regular expression to match the car name and count with brackets
    const regex = /^(.+?)\s*\((\d+)\)$/;

    // Executing the regular expression on the input string
    const match = carString.match(regex);
    let carName = "";
    let carCount = "";

    if (match) {
        // Extracting the name and count (including brackets) from the matched groups
        carName = match[1];
        carCount = `(${match[2]})`;
    }

    return (
        <>
            <span className="ms-1">{carName}</span>
            <span className="ms-1 color-txt-grey">{carCount}</span>
        </>
    );
};

const RenderColorButtons = ({ values, state, updateState, handleSelection }) => {
    return (
        <div className="row">
            {values?.map((value, index) => (
                <div
                    key={index}
                    className={`col-3 ps-1 pe-1 pb-2`}
                    onClick={(e) => {
                        handleSelection(state, updateState, value);
                        e.stopPropagation();
                    }}>
                    <div
                        className={`d-flex flex-column justify-content-start contain-color-div ${
                            state.includes(value) ? "selected" : ""
                        }  ${screen == "Mobile" ? "mx-2 mb-3" : ""}`}>
                        {value !== "Other" && (
                            <div
                                className="color-div"
                                style={{
                                    color: Colors.ReturnColorCode(Colors, value)
                                        ? Colors.ReturnColorCode(Colors, value)
                                        : "black",
                                    backgroundColor: Colors.ReturnColorCode(Colors, value)
                                        ? Colors.ReturnColorCode(Colors, value)
                                        : "black"
                                }}></div>
                        )}

                        {value == "Other" && <ColorWheelSVG />}
                        <p>{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const RenderColorFilter = ({
    screen,
    interiorColorValues,
    exteriorColorValues,
    exteriorColors,
    setExteriorColors,
    interiorColors,
    setInteriorColors,
    handleSelection
}) => {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabClick = (tabNumber) => {
        if (currentTab !== tabNumber) {
            setCurrentTab(tabNumber);
        }
    };
    const options = ["Exterior", "Interior"];

    return (
        <>
            <ul className="nav color-tab nav-tabs">
                {options.map((value, index) => (
                    <li
                        className="nav-item"
                        key={index}>
                        <button
                            className={`nav-link color-nav ${currentTab === index ? "active" : ""}`}
                            onClick={() => setCurrentTab(index)}>
                            {value}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="tab-content mt-3">
                {options.map(
                    (value, index) =>
                        currentTab == index && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTabClick(index);
                                }}
                                key={index}>
                                <RenderColorButtons
                                    values={currentTab == 0 ? exteriorColorValues : interiorColorValues}
                                    state={currentTab == 0 ? exteriorColors : interiorColors}
                                    updateState={currentTab == 0 ? setExteriorColors : setInteriorColors}
                                    handleSelection={handleSelection}></RenderColorButtons>
                            </div>
                        )
                )}
            </div>
        </>
    );
};

const RenderMakeAndModelDropdowns = (props) => {
    const addDefaultSrc = (ev) => {
        ev.target.src = "/media/maker-icons/generic.png";
    };
    return (
        <>
            <div className="border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                    <p className="text-side my-auto">Make</p>
                    {props.make.length > 0 && (
                        <>
                            <p className="text-side my-auto selected-count">{`(${props.make.length} selected)`}</p>
                            <ClearFilters
                                updateState={(value) => {
                                    props.updateMake([]);
                                    props.updateAvailableModels([]);
                                    props.updateModel([]);
                                }}
                                value={[]}></ClearFilters>
                        </>
                    )}
                </div>
                <div className="dropdown-update mb-3 mt-2">
                    <Select
                        isMulti
                        options={props.makes}
                        isClearable={false}
                        value={props.make}
                        className={"mb-2 inline-input-editor"}
                        placeholder={"Select Make"}
                        styles={CustomStyle}
                        components={{ ValueContainer }}
                        onChange={(event) => {
                            if (event) {
                                props.updateAvailableModelsDropdown(event);
                            } else {
                                props.updateAvailableModels([]);
                            }
                            props.ApplyFilter();
                            return props.updateMake(event);
                        }}
                        formatOptionLabel={(make) => (
                            <div className="make-dropdown">
                                {props.make.every((item) => item.label != make.label) && (
                                    <img
                                        src={`/media/maker-icons/${(make.value.includes(" ")
                                            ? make.value?.replace(/ /g, "-")
                                            : make.value
                                        ).toLowerCase()}.png`}
                                        width={25}
                                        height={25}
                                        onError={addDefaultSrc}
                                        alt="car-image"
                                    />
                                )}
                                <ExtractNameAndCount carString={make.label} />
                            </div>
                        )}></Select>
                </div>
            </div>
            <div className="border-bottom mt-2">
                <div className="d-flex align-items-center justify-content-between">
                    <p className="text-side my-auto">Model</p>
                    {props.model.length > 0 && (
                        <>
                            <p className="text-side my-auto selected-count">{`(${props.model.length} selected)`}</p>
                            <ClearFilters
                                updateState={props.updateModel}
                                value={[]}></ClearFilters>
                        </>
                    )}
                </div>
                <div className="dropdown-update mb-3 mt-2">
                    <Select
                        isMulti
                        isClearable={false}
                        className="mb-2 font-3 inline-input-editor"
                        value={props.model}
                        options={props.availableModels}
                        styles={CustomStyle}
                        components={{ ValueContainer }}
                        placeholder="Select Model"
                        onChange={(event) => {
                            props.ApplyFilter();
                            return props.updateModel(event);
                        }}
                        formatOptionLabel={(model) => (
                            <div className="make-dropdown">
                                <ExtractNameAndCount carString={model.label} />
                            </div>
                        )}></Select>
                </div>
            </div>
        </>
    );
};

const RenderButtonFilters = ({ values, stateValues, updateState, filterType = null, handleSelection }) => {
    const renderValues = (value) => {
        let updatedvalue = value;
        if (filterType == "cylinder") {
            updatedvalue = value.split(" ")[0];
        } else if (filterType == "driveType") {
            let driveTrain = value.split(" ");
            if (driveTrain.length == 3) {
                if (driveTrain[0] == "Four") {
                    updatedvalue = "4" + driveTrain[1][0] + driveTrain[2][0];
                } else {
                    updatedvalue = driveTrain[0][0] + driveTrain[1][0] + driveTrain[2][0];
                }
            } else if (driveTrain.length == 1) {
                updatedvalue = value;
            }
        } else if (filterType == "engine") {
            if (value != "Other") {
                updatedvalue = value + "L";
            }
        }
        return updatedvalue;
    };

    return (
        <>
            {values != null && (
                <div className="d-flex my-3  justify-content-between flex-wrap">
                    {values.map((value, index) => (
                        <button
                            key={index}
                            className={`btn tag-drive ${
                                stateValues?.toString().includes(value?.toString()) ? "active" : ""
                            } ${filterType == "Transmission" ? "transmission-btn d-flex" : ""}`}
                            onClick={() => {
                                return handleSelection(stateValues, updateState, value);
                            }}>
                            {filterType === "Transmission" &&
                                (value === "Automatic" ? <AutomaticSVG /> : value === "Manual" ? <ManualSVG /> : null)}
                            {renderValues(value)}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

const RenderRangeFilter = ({
    filterName,
    minValue,
    maxValue,
    stateValues,
    updateState,
    ApplyFilter,
    steps,
    roundToStep,
    roundToCeilStep,
    roundToFloorStep
}) => {
    //console.log("RenderRangeFilter", stateValues);
    const { minYear, maxYear, minMileage, maxMileage, minPrice, maxPrice, minPayment, maxPayment } =
        useContext(AppContext);
    const [hoverValue, setHoverValue] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [lowerRangeValue, setLowerRangeValue] = useState(stateValues[0]);
    const [higherRangeValue, setHigherRangeValue] = useState(stateValues[1]);

    useEffect(() => {
        if (stateValues[0] == minYear && stateValues[1] == maxYear) {
            setLowerRangeValue(minYear);
            setHigherRangeValue(maxYear);
        } else if (stateValues[0] == minPrice && stateValues[1] == maxPrice) {
            setLowerRangeValue(minPrice);
            setHigherRangeValue(maxPrice);
        } else if (stateValues[0] == minPayment && stateValues[1] == maxPayment) {
            setLowerRangeValue(minPayment);
            setHigherRangeValue(maxPayment);
        } else if (stateValues[0] == minMileage && stateValues[1] == maxMileage) {
            setLowerRangeValue(minMileage);
            setHigherRangeValue(maxMileage);
        } else {
            setLowerRangeValue(stateValues[0]);
            setHigherRangeValue(stateValues[1]);
        }
    }, [stateValues]);

    const handleSliderChange = (newValue) => {
        setIsDragging(false);
        const adjustedValues = newValue.map((v) => Math.round(v / steps) * steps);

        // Ensure both values stay within the range
        // adjustedValues[0] = Math.max(minValue, Math.min(adjustedValues[0], maxValue));
        // adjustedValues[1] = Math.max(minValue, Math.min(adjustedValues[1], maxValue));

        setLowerRangeValue(adjustedValues[0]);
        setHigherRangeValue(adjustedValues[1]);

        updateState(adjustedValues);
        ApplyFilter();
    };

    const handleTooltip = (value) => {
        if (filterName.toLowerCase() === "price" || filterName.toLowerCase() === "mileage") {
            value = roundToStep(value, 1000); // Round the value first
        } else if (filterName.toLowerCase() === "payment") {
            value = roundToStep(value, 100); // Round the value first
        }
        const displayValue =
            (filterName.toLowerCase() === "price" ? "$" : "") + (hoverValue !== null || isDragging ? value : "");
        return (
            <div
                className={`slider-tooltip ${
                    isDragging || (hoverValue !== null && hoverValue === value) ? "visible" : ""
                }`}>
                {(filterName.toLowerCase() === "price" || filterName.toLowerCase() === "payment") &&
                (hoverValue !== null || isDragging)
                    ? "$" + value
                    : (filterName.toLowerCase() !== "price" || filterName.toLowerCase() === "payment") &&
                        (hoverValue !== null || isDragging)
                      ? value
                      : null}
            </div>
        );
    };

    return (
        <>
            <div className="d-flex my-3 justify-content-between flex-wrap">
                <div className="input-wrapper">
                    {(filterName == "Price" || filterName == "Payment") && <span className="dollar-icon">$</span>}
                    <input
                        type="number"
                        min={minValue}
                        className="input-modal-div"
                        step={steps}
                        value={lowerRangeValue}
                        max={stateValues[1]}
                        onChange={(event) => {
                            setLowerRangeValue(event.target.value);
                        }}
                        onBlur={() => {
                            if (lowerRangeValue < minValue) {
                                const newStartPrice = [...stateValues];
                                newStartPrice[0] = minValue;
                                if (filterName.toLowerCase() == "year") {
                                    setLowerRangeValue(roundToFloorStep(minValue, 1));
                                } else if (filterName.toLowerCase() == "payment") {
                                    setLowerRangeValue(roundToFloorStep(minValue, 100));
                                } else {
                                    setLowerRangeValue(roundToFloorStep(minValue, 1000));
                                }
                                updateState(newStartPrice);
                            } else if (lowerRangeValue <= stateValues[1]) {
                                const newStartPrice = [...stateValues];
                                if (filterName.toLowerCase() == "year") {
                                    setLowerRangeValue(roundToFloorStep(lowerRangeValue, 1));
                                    newStartPrice[0] = roundToFloorStep(lowerRangeValue, 1);
                                } else if (filterName.toLowerCase() == "payment") {
                                    setLowerRangeValue(roundToFloorStep(lowerRangeValue, 100));
                                    newStartPrice[0] = roundToFloorStep(lowerRangeValue, 100);
                                } else {
                                    setLowerRangeValue(roundToFloorStep(lowerRangeValue, 1000));
                                    newStartPrice[0] = roundToFloorStep(lowerRangeValue, 1000);
                                }

                                updateState(newStartPrice);
                            } else {
                                if (filterName.toLowerCase() == "year") {
                                    setLowerRangeValue(roundToFloorStep(minValue, 1));
                                } else if (filterName.toLowerCase() == "payment") {
                                    setLowerRangeValue(roundToFloorStep(minValue, 100));
                                } else {
                                    setLowerRangeValue(roundToFloorStep(minValue, 1000));
                                }
                                const newEndPrice = [...stateValues];
                                newEndPrice[0] = minValue;
                                updateState([...newEndPrice]);
                            }
                            ApplyFilter();
                        }}></input>
                </div>
                <div className="input-wrapper">
                    {(filterName == "Price" || filterName == "Payment") && <span className="dollar-icon">$</span>}
                    <input
                        type="number"
                        max={maxValue}
                        step={steps}
                        value={higherRangeValue}
                        className="input-modal-div"
                        min={stateValues[0]}
                        onChange={(event) => {
                            setHigherRangeValue(event.target.value);
                        }}
                        onBlur={() => {
                            if (higherRangeValue > maxValue) {
                                const newEndPrice = [...stateValues];
                                newEndPrice[1] = maxValue;
                                setHigherRangeValue(roundToCeilStep(maxValue, 1));

                                updateState(newEndPrice);
                            } else if (higherRangeValue >= stateValues[0]) {
                                const newEndPrice = [...stateValues];
                                setHigherRangeValue(roundToCeilStep(higherRangeValue, 1));
                                newEndPrice[1] = roundToCeilStep(higherRangeValue, 1);

                                updateState(newEndPrice);
                            } else {
                                setHigherRangeValue(roundToCeilStep(maxValue, 1));

                                const newEndPrice = [...stateValues];
                                newEndPrice[1] = maxValue;
                                updateState([...newEndPrice]);
                            }
                            ApplyFilter();
                        }}></input>
                </div>
            </div>

            <div className="slider-container">
                <Slider
                    value={stateValues}
                    min={minValue}
                    max={maxValue}
                    pearling={true}
                    steps={steps}
                    onAfterChange={handleSliderChange}
                    onChange={() => setIsDragging(true)}
                    renderThumb={(props, state) => {
                        const { key, ...restProps } = props;
                        const prop = { ...restProps };
                        return (
                            <div
                                key={key}
                                {...prop}
                                onMouseEnter={() => setHoverValue(state.valueNow)}
                                onMouseLeave={() => setHoverValue(null)}>
                                {handleTooltip(state.valueNow)}
                            </div>
                        );
                    }}></Slider>
            </div>
        </>
    );
};

const RenderFilters = (props) => {
    const [showEngineArea, setShowEngineArea] = useState(false);
    const [showBodyArea, setShowBodyArea] = useState(false);
    const [showTransmissionArea, setShowTransmissionArea] = useState(false);
    const [showTrainArea, setShowTrainArea] = useState(false);
    const [showDoorArea, setShowDoorArea] = useState(false);
    const [showCylinderArea, setShowCylinderArea] = useState(false);
    const [showColorArea, setShowColorArea] = useState(false);
    const [showFuelArea, setShowFuelArea] = useState(false);
    const [showPriceArea, setShowPriceArea] = useState(false);
    const [showMileageArea, setShowMileageArea] = useState(false);
    const [showPaymentArea, setShowPaymentArea] = useState(false);
    const [showYearArea, setShowYearArea] = useState(false);

    const { filterApplied, setFilterApplied, setSearchBarText, setLinkAllCars, setSortDropDown } =
        useContext(AppContext);

    const [engineCount, setEngineCount] = useState(0);
    const [bodyStyleCount, setBodyStyleCount] = useState(0);
    const [isYearChange, setIsYearChange] = useState(false);
    const [isMileageChange, setIsMileageChange] = useState(false);
    const [isPriceChange, setIsPriceChange] = useState(false);
    const [isPaymentChange, setIsPaymentChange] = useState(false);
    const [driveTrainCount, setDriveTrainCount] = useState(0);
    const [cylinderCount, setCylinderCount] = useState(0);
    const [transmissionCount, setTransmissionCount] = useState(0);
    const [colorCount, setColorCount] = useState(0);
    const [fuelTypeCount, setFuelTypeCount] = useState(0);
    const [doorCount, setDoorCount] = useState(0);

    useEffect(() => {
        if (props.make && props.make.length > 0) {
            props.updateAvailableModelsDropdown(props.make);
        }
    }, [props.make]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.engine.length > 0) {
            // Update your component state with the new count
            setEngineCount(props.engine.length);
        } else {
            setEngineCount(0);
        }
    }, [props.engine]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.bodyStyles.length > 0) {
            // Update your component state with the new count
            setBodyStyleCount(props.bodyStyles.length);
        } else {
            setBodyStyleCount(0);
        }
    }, [props.bodyStyles]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.yearValues[0] != props.minYear || props.yearValues[1] != props.maxYear) {
            // Update your component state with the new count
            setIsYearChange(true);
        } else {
            setIsYearChange(false);
        }
    }, [props.yearValues[0], props.yearValues[1]]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.mileageValues[0] != props.minMileage || props.mileageValues[1] != props.maxMileage) {
            // Update your component state with the new count
            setIsMileageChange(true);
        } else {
            setIsMileageChange(false);
        }
    }, [props.mileageValues[0], props.mileageValues[1]]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.priceValues[0] != props.minPrice || props.priceValues[1] != props.maxPrice) {
            // Update your component state with the new count
            setIsPriceChange(true);
        } else {
            setIsPriceChange(false);
        }
    }, [props.priceValues[0], props.priceValues[1]]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.paymentValues[0] != props.minPayment || props.paymentValues[1] != props.maxPayment) {
            // Update your component state with the new count
            setIsPaymentChange(true);
        } else {
            setIsPaymentChange(false);
        }
    }, [props.paymentValues[0], props.paymentValues[1]]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.train.length > 0) {
            // Update your component state with the new count
            setDriveTrainCount(props.train.length);
        } else {
            setDriveTrainCount(0);
        }
    }, [props.train]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.interiorColors.length > 0 || props.exteriorColors.length > 0) {
            // Update your component state with the new count
            setColorCount(props.interiorColors.length + props.exteriorColors.length);
        } else {
            setColorCount(0);
        }
    }, [props.interiorColors, props.exteriorColors]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.cylinder.length > 0) {
            // Update your component state with the new count
            setCylinderCount(props.cylinder.length);
        } else {
            setCylinderCount(0);
        }
    }, [props.cylinder]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.transmission.length > 0) {
            // Update your component state with the new count
            setTransmissionCount(props.transmission.length);
        } else {
            setTransmissionCount(0);
        }
    }, [props.transmission]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.fuel.length > 0) {
            // Update your component state with the new count
            setFuelTypeCount(props.fuel.length);
        } else {
            setFuelTypeCount(0);
        }
    }, [props.fuel]);

    useEffect(() => {
        // Wait for the props.engine state to update
        if (props.door.length > 0) {
            // Update your component state with the new count
            setDoorCount(props.door.length);
        } else {
            setDoorCount(0);
        }
    }, [props.door]);

    const ClearBodyStyleStates = () => {
        props.setBodyStyleFilters([]);
        props.updateBodyStyles([]);
    };

    const ClearYearStates = () => {
        props.setYearValues([props.minYear, props.maxYear]);
    };
    const ClearMileageStates = () => {
        props.setMileageValues([props.minMileage, props.maxMileage]);
    };
    const ClearPriceStates = () => {
        props.setPriceValues([props.minPrice, props.maxPrice]);
    };
    const ClearPaymentStates = () => {
        props.setPaymentValues([props.minPayment, props.maxPayment]);
        //setPrice([props.minPrice, props.maxPrice]);
    };

    const handleSelection = async (stateValues = null, handleState = null, selectedValue = null) => {
        setSearchBarText("");
        setLinkAllCars("");

        if (!filterApplied) {
            setFilterApplied(true);
        }
        if (stateValues.includes(selectedValue)) {
            handleState(stateValues.filter((item) => item !== selectedValue));
        } else {
            const newArray = stateValues.concat(selectedValue);
            handleState(newArray);
        }
    };
    let interiorColorValues = props?.allFacets?.inColor;
    let exteriorColorValues = props?.allFacets?.exColor;
    let driveTypeValues = props?.allFacets?.driveType;

    useEffect(() => {
        const RelocateOtherOption = (array) => {
            if (Array.isArray(array)) {
                let otherIndex = array.indexOf("Other");
                // If 'Other' element is found, remove it from the array and push it to the end
                if (otherIndex !== -1) {
                    let otherElement = array.splice(otherIndex, 1); // Remove the 'Other' element
                    array.push(otherElement[0]); // Push the 'Other' element to the end
                }
            }
        };

        RelocateOtherOption(interiorColorValues);
        RelocateOtherOption(exteriorColorValues);
        RelocateOtherOption(driveTypeValues);
    }, []);

    const ApplyFilter = () => {
        if (!filterApplied) {
            setFilterApplied(true);
            setSearchBarText("");
            setLinkAllCars("");
        }
    };
    return (
        <div className="col-lg-12 ">
            <RenderMakeAndModelDropdowns
                make={props.make}
                model={props.model}
                availableModels={props.availableModels}
                updateMake={props.updateMake}
                updateAvailableModels={props.updateAvailableModels}
                updateModel={props.updateModel}
                updateAvailableModelsDropdown={props.updateAvailableModelsDropdown}
                ApplyFilter={ApplyFilter}
                makes={props.allMakes}
            />
            {/* {process.env.NODE_ENV === "production" ? null : (
        <div
          className="mt-2 accordion accordion-faq-side border-bottom"
          id="payment-area"
        >
          <div className="accordion-item">
            <p className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                onClick={(e) => {
                  if (e.target.tagName === "A") {
                    props.setPaymentValues([
                      props.minPayment,
                      props.maxPayment,
                    ]);
                  } else {
                    setShowPaymentArea(!showPaymentArea);
                  }
                }}
              >
                Payment
                <a className="clear-all" onClick={() => ClearPaymentStates()}>
                  {props.paymentValues[0] != props.minPayment ||
                  props.paymentValues[1] != props.maxPayment
                    ? "Clear"
                    : ""}
                </a>
                <FontAwesomeIcon
                  icon={showPaymentArea ? faAngleUp : faAngleDown}
                />
              </button>
            </p>
            <div
              className={`accordion-collapse collapse ${
                showPaymentArea ? "show" : ""
              }`}
            >
              <RenderRangeFilter
                filterName="Payment"
                steps={100}
                stateValues={props.paymentValues}
                minValue={props.minPayment}
                maxValue={props.maxPayment}
                ApplyFilter={ApplyFilter}
                roundToStep={props.roundToStep}
                roundToCeilStep={props.roundToCeilStep}
                roundToFloorStep={props.roundToFloorStep}
                updateState={props.setPaymentValues}
              ></RenderRangeFilter>
            </div>
          </div>
        </div>
      )} */}

            <div className="mt-2 accordion accordion-faq-side border-bottom ">
                <div className="accordion-item ">
                    <p className="accordion-header">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            onClick={(e) => {
                                if (e.target.tagName === "A") {
                                    props.updateBodyStyles([]);
                                } else {
                                    setShowBodyArea(!showBodyArea);
                                }
                            }}>
                            Body Style{" "}
                            {props.bodyStyles?.length > 0 && (
                                <span className="ms-1 selected-count">{`(${props.bodyStyles?.length} selected)`}</span>
                            )}
                            <a
                                className="clear-all"
                                onClick={() => ClearBodyStyleStates()}>
                                {props.bodyStyles?.length > 0 ? "Clear" : ""}
                            </a>
                            <FontAwesomeIcon icon={showBodyArea ? faAngleUp : faAngleDown} />
                        </button>
                    </p>
                    <div
                        className={`accordion-collapse collapse accordion-content ${showBodyArea ? "show" : ""} ${
                            props.screen == "mobile" ? "body-acc" : ""
                        }`}>
                        <div className={`${props.screen == "desktop" ? "col-12 row" : ""} d-flex body-types`}>
                            <div className={`${props.screen == "desktop" ? "col-6" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles?.includes("Sedan") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        return handleSelection(props.bodyStyles, props.updateBodyStyles, "Sedan");
                                    }}>
                                    <SedanSVG />
                                    <p className="selected-color mb-0">Sedan</p>
                                </div>
                            </div>
                            <div className={`${props.screen == "desktop" ? "col-6" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles?.includes("SUV") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        if (!props.bodyStyles.includes("SUV")) {
                                            let newArray = props.bodyStyles.concat("SUV");
                                            if (!newArray.includes("Hatchback")) {
                                                newArray = newArray.concat("Hatchback");
                                            }
                                            if (!newArray.includes("Wagon")) {
                                                newArray = newArray.concat("Wagon");
                                            }
                                            props.updateBodyStyles(newArray);
                                            setFilterApplied(true);
                                        } else {
                                            props.updateBodyStyles(props.bodyStyles.filter((item) => item !== "SUV"));
                                        }
                                    }}>
                                    <SUVSVG />
                                    <p className="mb-0 selected-color">SUVs</p>
                                </div>
                            </div>
                            <div className={`${props.screen == "desktop" ? "col-6" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles.includes("Truck") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        return handleSelection(props.bodyStyles, props.updateBodyStyles, "Truck");
                                    }}>
                                    <TruckSVG />
                                    <p className="selected-color mb-0">Trucks</p>
                                </div>
                            </div>
                            <div className={`${props.screen == "desktop" ? "col-6" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles.includes("Van") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        return handleSelection(props.bodyStyles, props.updateBodyStyles, "Van");
                                    }}>
                                    <VanSVG />
                                    <p className="selected-color mb-0">Van</p>
                                </div>
                            </div>
                            <div className={`${props.screen == "desktop" ? "col-6" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles.includes("Convertible") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        return handleSelection(props.bodyStyles, props.updateBodyStyles, "Convertible");
                                    }}>
                                    <ConvertibleSVG />
                                    <p className="mb-0 selected-color">Convertible</p>
                                </div>
                            </div>
                            <div className={`${props.screen == "desktop" ? "col-6" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles.includes("Coupe") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        return handleSelection(props.bodyStyles, props.updateBodyStyles, "Coupe");
                                    }}>
                                    <CoupeSVG />
                                    <p className="mb-0 selected-color">Coupe</p>
                                </div>
                            </div>
                            <div className={`${props.screen == "desktop" ? "col-6" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles?.includes("Hatchback") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        if (!props.bodyStyles.includes("Hatchback")) {
                                            let newArray = props.bodyStyles.concat("Hatchback");
                                            if (!newArray.includes("SUV")) {
                                                newArray = newArray.concat("SUV");
                                            }
                                            if (!newArray.includes("Wagon")) {
                                                newArray = newArray.concat("Wagon");
                                            }
                                            props.updateBodyStyles(newArray);
                                            setFilterApplied(true);
                                        } else {
                                            props.updateBodyStyles(
                                                props.bodyStyles.filter((item) => item !== "Hatchback")
                                            );
                                        }
                                    }}>
                                    <HatchBackSVG />
                                    <p className="mb-0 selected-color">HatchBack</p>
                                </div>
                            </div>
                            <div className={`${props.screen == "desktop" ? "col-6" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles?.includes("Wagon") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        if (!props.bodyStyles.includes("Wagon")) {
                                            let newArray = props.bodyStyles.concat("Wagon");
                                            if (!newArray.includes("SUV")) {
                                                newArray = newArray.concat("SUV");
                                            }
                                            if (!newArray.includes("Hatchback")) {
                                                newArray = newArray.concat("Hatchback");
                                            }
                                            props.updateBodyStyles(newArray);
                                            setFilterApplied(true);
                                        } else {
                                            props.updateBodyStyles(props.bodyStyles.filter((item) => item !== "Wagon"));
                                        }
                                    }}>
                                    <WagonSVG />
                                    <p className="mb-0 selected-color">Wagon</p>
                                </div>
                            </div>
                            <div className={`${props.screen == "desktop" ? "col-12" : ""}`}>
                                <div
                                    className={`position-relative mt-2 body-style ${
                                        props.bodyStyles?.includes("Electric") ? "selected-border" : ""
                                    }`}
                                    onClick={() => {
                                        return handleSelection(props.bodyStyles, props.updateBodyStyles, "Electric");
                                    }}>
                                    <ElectricSVG />
                                    <p className="mb-0 selected-color">Electric</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-2 accordion accordion-faq-side border-bottom">
                <div className="accordion-item">
                    <p className="accordion-header">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            onClick={(e) => {
                                if (e.target.tagName === "A") {
                                    props.setYearValues([props.minYear, props.maxYear]);
                                } else {
                                    setShowYearArea(!showYearArea);
                                }
                            }}>
                            Year
                            <a
                                className="clear-all"
                                onClick={() => ClearYearStates()}>
                                {props.yearValues[0] != props.minYear || props.yearValues[1] != props.maxYear
                                    ? "Clear"
                                    : ""}
                            </a>
                            <FontAwesomeIcon icon={showYearArea ? faAngleUp : faAngleDown} />
                        </button>
                    </p>
                    <div className={`accordion-collapse collapse ${showYearArea ? "show" : ""}`}>
                        <RenderRangeFilter
                            filterName="Year"
                            steps={1}
                            stateValues={props.yearValues}
                            minValue={props.minYear}
                            maxValue={props.maxYear}
                            ApplyFilter={ApplyFilter}
                            roundToStep={props.roundToStep}
                            roundToCeilStep={props.roundToCeilStep}
                            roundToFloorStep={props.roundToFloorStep}
                            updateState={props.setYearValues}></RenderRangeFilter>
                    </div>
                </div>
            </div>

            <div className="mt-2 accordion accordion-faq-side border-bottom">
                <div className="accordion-item">
                    <p className="accordion-header">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            onClick={(e) => {
                                if (e.target.tagName === "A") {
                                    props.setMileageValues([props.minMileage, props.maxMileage]);
                                } else {
                                    setShowMileageArea(!showMileageArea);
                                }
                            }}>
                            Mileage
                            <a
                                className="clear-all"
                                onClick={() => ClearMileageStates()}>
                                {props.mileageValues[0] != props.minMileage ||
                                props.mileageValues[1] != props.maxMileage
                                    ? "Clear"
                                    : ""}
                            </a>
                            <FontAwesomeIcon icon={showMileageArea ? faAngleUp : faAngleDown} />
                        </button>
                    </p>
                    <div className={`accordion-collapse collapse ${showMileageArea ? "show" : ""}`}>
                        <RenderRangeFilter
                            filterName="Mileage"
                            steps={1000}
                            stateValues={props.mileageValues}
                            minValue={props.minMileage}
                            maxValue={props.maxMileage}
                            ApplyFilter={ApplyFilter}
                            roundToStep={props.roundToStep}
                            roundToCeilStep={props.roundToCeilStep}
                            roundToFloorStep={props.roundToFloorStep}
                            updateState={props.setMileageValues}></RenderRangeFilter>
                    </div>
                </div>
            </div>
            <div
                className="mt-2 accordion accordion-faq-side border-bottom"
                id="price-area">
                <div className="accordion-item">
                    <p className="accordion-header">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            onClick={(e) => {
                                if (e.target.tagName === "A") {
                                    props.setPriceValues([props.minPrice, props.maxPrice]);
                                } else {
                                    setShowPriceArea(!showPriceArea);
                                }
                            }}>
                            Price
                            <a
                                className="clear-all"
                                onClick={() => ClearPriceStates()}>
                                {props.priceValues[0] != props.minPrice || props.priceValues[1] != props.maxPrice
                                    ? "Clear"
                                    : ""}
                            </a>
                            <FontAwesomeIcon icon={showPriceArea ? faAngleUp : faAngleDown} />
                        </button>
                    </p>
                    <div className={`accordion-collapse collapse ${showPriceArea ? "show" : ""}`}>
                        <RenderRangeFilter
                            filterName="Price"
                            steps={1000}
                            stateValues={props.priceValues}
                            minValue={props.minPrice}
                            maxValue={props.maxPrice}
                            ApplyFilter={ApplyFilter}
                            roundToStep={props.roundToStep}
                            roundToCeilStep={props.roundToCeilStep}
                            roundToFloorStep={props.roundToFloorStep}
                            updateState={props.setPriceValues}></RenderRangeFilter>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="accordion accordion-faq-side border-bottom">
                    <div className="accordion-item">
                        <p className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                onClick={(e) => {
                                    if (e.target.tagName === "A") {
                                        props.updateTrain([]);
                                    } else {
                                        setShowTrainArea(!showTrainArea);
                                    }
                                }}>
                                Drive Train{" "}
                                {props.train.length > 0 && (
                                    <span className="ms-1 selected-count">{`(${props.train.length} selected)`}</span>
                                )}
                                <a className="clear-all">{props.train.length > 0 ? "Clear" : ""}</a>
                                <FontAwesomeIcon icon={showTrainArea ? faAngleUp : faAngleDown} />
                            </button>
                        </p>
                        <div className={`accordion-collapse collapse ${showTrainArea ? "show" : ""}`}>
                            <RenderButtonFilters
                                values={driveTypeValues}
                                stateValues={props.train}
                                updateState={props.updateTrain}
                                filterType="driveType"
                                handleSelection={handleSelection}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 accordion accordion-faq-side border-bottom">
                <div className="accordion-item">
                    <p className="accordion-header">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            onClick={(e) => {
                                if (e.target.tagName === "A") {
                                    props.updateEngine([]);
                                } else {
                                    setShowEngineArea(!showEngineArea);
                                }
                            }}>
                            Engine{" "}
                            {props.engine.length > 0 && (
                                <span className="ms-1 selected-count">{`(${props.engine.length} selected)`}</span>
                            )}
                            <a className="clear-all">{props.engine.length > 0 ? "Clear" : ""}</a>
                            <FontAwesomeIcon icon={showEngineArea ? faAngleUp : faAngleDown} />
                        </button>
                    </p>
                    <div className={`accordion-collapse collapse ${showEngineArea ? "show" : ""}`}>
                        <RenderButtonFilters
                            values={props.allFacets?.engines}
                            stateValues={props.engine}
                            updateState={props.updateEngine}
                            filterType="engine"
                            handleSelection={handleSelection}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="accordion accordion-faq-side border-bottom">
                    <div className="accordion-item">
                        <p className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                onClick={(e) => {
                                    if (e.target.tagName === "A") {
                                        props.updateCylinder([]);
                                    } else {
                                        setShowCylinderArea(!showCylinderArea);
                                    }
                                }}>
                                Cylinders{" "}
                                {props.cylinder.length > 0 && (
                                    <span className="ms-1 selected-count">{`(${props.cylinder.length} selected)`}</span>
                                )}
                                <a className="clear-all">{props.cylinder.length > 0 ? "Clear" : ""}</a>
                                <FontAwesomeIcon icon={showCylinderArea ? faAngleUp : faAngleDown} />
                            </button>
                        </p>
                        <div className={`accordion-collapse collapse ${showCylinderArea ? "show" : ""}`}>
                            <RenderButtonFilters
                                values={props.allFacets?.cylinders}
                                stateValues={props.cylinder}
                                updateState={props.updateCylinder}
                                filterType="cylinder"
                                handleSelection={handleSelection}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="accordion accordion-faq-side border-bottom">
                    <div className="accordion-item">
                        <p className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                onClick={(e) => {
                                    if (e.target.tagName === "A") {
                                        props.updateTransmission([]);
                                    } else {
                                        setShowTransmissionArea(!showTransmissionArea);
                                    }
                                }}>
                                Transmission{" "}
                                {props.transmission.length > 0 && (
                                    <span className="ms-1 selected-count">{`(${props.transmission.length} selected)`}</span>
                                )}
                                <a className="clear-all">{props.transmission.length > 0 ? "Clear" : ""}</a>
                                <FontAwesomeIcon icon={showTransmissionArea ? faAngleUp : faAngleDown} />
                            </button>
                        </p>
                        <div className={`accordion-collapse collapse ${showTransmissionArea ? "show" : ""}`}>
                            <RenderButtonFilters
                                values={props.allFacets?.transmission}
                                stateValues={props.transmission}
                                updateState={props.updateTransmission}
                                filterType="Transmission"
                                handleSelection={handleSelection}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className=" mt-3">
                <div className="accordion accordion-faq-side border-bottom">
                    <div className="accordion-item">
                        <p className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                onClick={(e) => {
                                    if (e.target.tagName === "A") {
                                        props.setInteriorColors([]);
                                        props.setExteriorColors([]);
                                    } else {
                                        setShowColorArea(!showColorArea);
                                    }
                                }}>
                                Color{" "}
                                {(props.interiorColors.length > 0 || props.exteriorColors.length > 0) && (
                                    <span className="ms-1 selected-count">{`(${
                                        props.interiorColors.length + props.exteriorColors.length
                                    } selected)`}</span>
                                )}
                                <a className="clear-all">
                                    {props.interiorColors.length > 0 || props.exteriorColors.length > 0 ? "Clear" : ""}
                                </a>
                                <FontAwesomeIcon icon={showColorArea ? faAngleUp : faAngleDown} />
                            </button>
                        </p>
                        <div className={`accordion-collapse collapse ${showColorArea ? "show" : ""}`}>
                            <RenderColorFilter
                                screen={"Desktop"}
                                interiorColorValues={interiorColorValues}
                                exteriorColorValues={exteriorColorValues}
                                exteriorColors={props.exteriorColors}
                                setExteriorColors={props.setExteriorColors}
                                interiorColors={props.interiorColors}
                                setInteriorColors={props.setInteriorColors}
                                handleSelection={handleSelection}></RenderColorFilter>
                        </div>
                    </div>
                </div>
            </div>

            <div className=" mt-3">
                <div className="accordion accordion-faq-side border-bottom">
                    <div className="accordion-item">
                        <p className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                onClick={(e) => {
                                    if (e.target.tagName === "A") {
                                        props.updateFuel([]);
                                    } else {
                                        setShowFuelArea(!showFuelArea);
                                    }
                                }}>
                                Fuel Type{" "}
                                {props.fuel.length > 0 && (
                                    <span className="ms-1 selected-count">{`(${props.fuel.length} selected)`}</span>
                                )}
                                <a className="clear-all">{props.fuel.length > 0 ? "Clear" : ""}</a>
                                <FontAwesomeIcon icon={showFuelArea ? faAngleUp : faAngleDown} />
                            </button>
                        </p>
                        <div className={`accordion-collapse collapse ${showFuelArea ? "show" : ""}`}>
                            <RenderButtonFilters
                                values={props.allFacets?.fuelType}
                                stateValues={props.fuel}
                                updateState={props.updateFuel}
                                handleSelection={handleSelection}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="accordion accordion-faq-side border-bottom">
                    <div className="accordion-item">
                        <p className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                onClick={(e) => {
                                    if (e.target.tagName === "A") {
                                        props.updateDoor([]);
                                    } else {
                                        setShowDoorArea(!showDoorArea);
                                    }
                                }}>
                                Doors{" "}
                                {props.door.length > 0 && (
                                    <span className="ms-1 selected-count">{`(${props.door.length} selected)`}</span>
                                )}
                                <a className="clear-all">{props.door.length > 0 ? "Clear" : ""}</a>
                                <FontAwesomeIcon icon={showDoorArea ? faAngleUp : faAngleDown} />
                            </button>
                        </p>
                        <div className={`accordion-collapse collapse ${showDoorArea ? "show" : ""}`}>
                            <RenderButtonFilters
                                values={props.allFacets?.doors}
                                stateValues={props.door}
                                updateState={props.updateDoor}
                                handleSelection={handleSelection}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SearchSide = (props) => {
    const { setSortDropDown, showComingSoonCars, setShowComingSoonCars } = useContext(AppContext);
    return (
        <div className="container-fluid bg-light-greay-side-search">
            <div className="row mobile-d-ser tablet-d-ser">
                {props.yearValues?.length > 0 && (
                    <RenderFilters
                        {...props}
                        screen="desktop"
                    />
                )}
            </div>
            {/* -------------------modal filter--------------- */}

            <div className="modal-filter-sm">
                <div className="tab-only">
                    <div className="d-flex flex-row-reverse justify-content-between">
                        <div className="d-flex">
                            {process.env.NEXT_PUBLIC_SHOW_COMING_SOON ? (
                                <ToggleSwitch
                                    label={"Coming Soon"}
                                    state={showComingSoonCars}
                                    handleChange={() => setShowComingSoonCars(!showComingSoonCars)}
                                />
                            ) : null}

                            <span
                                className="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#sortModal">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.88268 4.07615C6.25636 4.23093 6.5 4.59557 6.5 5.00003V19.5C6.5 20.0523 6.05228 20.5 5.5 20.5C4.94772 20.5 4.5 20.0523 4.5 19.5V7.41424L3.20711 8.70714C2.81658 9.09766 2.18342 9.09766 1.79289 8.70714C1.40237 8.31661 1.40237 7.68345 1.79289 7.29292L4.79289 4.29292C5.07889 4.00692 5.50901 3.92137 5.88268 4.07615Z"
                                        fill="#53119B"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.79289 4.29289C5.18342 3.90237 5.81658 3.90237 6.20711 4.29289L9.20711 7.29289C9.59763 7.68342 9.59763 8.31658 9.20711 8.70711C8.81658 9.09763 8.18342 9.09763 7.79289 8.70711L4.79289 5.70711C4.40237 5.31658 4.40237 4.68342 4.79289 4.29289Z"
                                        fill="#53119B"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11 7C11 6.44772 11.4477 6 12 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H12C11.4477 8 11 7.55228 11 7Z"
                                        fill="#53119B"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11 11C11 10.4477 11.4477 10 12 10H19C19.5523 10 20 10.4477 20 11C20 11.5523 19.5523 12 19 12H12C11.4477 12 11 11.5523 11 11Z"
                                        fill="#53119B"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11 15C11 14.4477 11.4477 14 12 14H17C17.5523 14 18 14.4477 18 15C18 15.5523 17.5523 16 17 16H12C11.4477 16 11 15.5523 11 15Z"
                                        fill="#53119B"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11 19C11 18.4477 11.4477 18 12 18H14C14.5523 18 15 18.4477 15 19C15 19.5523 14.5523 20 14 20H12C11.4477 20 11 19.5523 11 19Z"
                                        fill="#53119B"
                                    />
                                </svg>

                                <span className="bt-sp">Sort</span>
                            </span>
                            <CopyToClipboard
                                GenerateURL={props.GenerateURL}
                                fillColor={"rgb(83, 17, 155)"}
                            />
                            <span
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal">
                                <svg
                                    width="14"
                                    height="19"
                                    viewBox="0 0 17 19"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        id="Icon (Stroke)"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0 1C0 0.447715 0.447715 0 1 0H16C16.5523 0 17 0.447715 17 1V3.53846C17 3.78289 16.9105 4.01885 16.7483 4.20177L11.375 10.264V16.2308C11.375 16.6595 11.1017 17.0405 10.6956 17.178L6.9456 18.4472C6.64035 18.5505 6.30402 18.5004 6.04216 18.3126C5.7803 18.1248 5.625 17.8223 5.625 17.5V10.264L0.251653 4.20177C0.0895225 4.01885 0 3.78289 0 3.53846V1ZM2 2V3.15907L7.37335 9.22131C7.53548 9.40422 7.625 9.64019 7.625 9.88461V16.1058L9.375 15.5135V9.88461C9.375 9.64019 9.46452 9.40422 9.62665 9.22131L15 3.15907V2H2Z"
                                        fill="#53119B"
                                    />
                                </svg>
                                <span className="bt-sp"> Filter</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                            <div className="modal-header col-12 row text-center">
                                <button
                                    type="button"
                                    className="btn btn-transparent m-0 hov-dash col-4 text-start"
                                    data-bs-dismiss="modal"
                                    aria-label="Back">
                                    <svg
                                        width="7"
                                        height="10"
                                        viewBox="0 0 7 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5.5 1L1.5 5L5.5 9"
                                            stroke="#53119B"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="ms-2">
                                        <a
                                            className="title-span spa-a"
                                            href="#">
                                            Back
                                        </a>
                                    </span>{" "}
                                </button>
                                <h6
                                    className="modal-title title-span col-4"
                                    id="exampleModalLabel">
                                    Filter
                                </h6>

                                <h6
                                    className="modal-title title-span spa-a col-4 text-end"
                                    id="exampleModalLabel"
                                    onClick={() => {
                                        props.ClearAllStates();
                                    }}>
                                    {props.AnyFilterSelected() && "Clear All"}
                                </h6>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        {props.AnyFilterSelected() && (
                                            <div className="mb-3 pb-3 bubble-div-mob">
                                                <FilterBubbles
                                                    updateAvailableModelsDropdown={props.updateAvailableModelsDropdown}
                                                    ClearAllStates={props.ClearAllStates}
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
                                                    allFacets={props.allFacets}
                                                    make={props.make}
                                                    updateMake={props.updateMake}
                                                    model={props.model}
                                                    updateModel={props.updateModel}
                                                    engine={props.engine}
                                                    updateEngine={props.updateEngine}
                                                    door={props.door}
                                                    updateDoor={props.updateDoor}
                                                    fuel={props.fuel}
                                                    updateFuel={props.updateFuel}
                                                    transmission={props.transmission}
                                                    updateTransmission={props.updateTransmission}
                                                    train={props.train}
                                                    updateTrain={props.updateTrain}
                                                    AnyFilterSelected={props.AnyFilterSelected}
                                                    cylinder={props.cylinder}
                                                    updateCylinder={props.updateCylinder}
                                                />
                                            </div>
                                        )}
                                        {props.yearValues?.length > 0 && (
                                            <RenderFilters
                                                {...props}
                                                screen="mobile"
                                            />
                                        )}
                                        <div
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal"
                                            className="btn custom_btn mt-3">
                                            View Results ({props.carsCount})
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ----------------------------Modal filter------------- */}

            {/* modal sort start */}
            <div
                className="modal fade"
                id="sortModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="new-modal">
                    <div className="modal-dialog sort-dialog">
                        <div className="modal-content">
                            <div className="modal-header border-bottom-none-sort">
                                <h5
                                    className="modal-title"
                                    id="exampleModalLabel">
                                    Sort By
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center">
                                <div className="d-flex justify-content-center flex-column">
                                    {sortings.map((sortingOption, index) => (
                                        <div
                                            key={index}
                                            className="border-button-sort"
                                            data-bs-dismiss="modal"
                                            onClick={() => {
                                                handleSortingChange(sortingOption, setSortDropDown);
                                            }}>
                                            {sortingOption.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* modal sort End */}
        </div>
    );
};

export default SearchSide;
