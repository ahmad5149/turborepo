import * as Colors from "../../utils/helpers/ColorCodes";
import { ColorWheelSVG } from "./FilterSVGs";

const BubbleComponents = ({ stateValues, updateState, filterType = null }) => {
    const renderValues = (value) => {
        let updatedvalue = value;
        if (filterType == "cylinder") {
            updatedvalue = typeof value === 'string' && value.includes(" ") ? value.split(" ")[0] : value;
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

    const RemoveItem = (value) => {
        updateState(stateValues.filter((item) => item !== value));
    };

    return stateValues.map((currentItem, index) => (
        <span
            className="ms-1 span-item mt-2"
            onClick={() => RemoveItem(currentItem)}
            key={index}>
            {renderValues(currentItem)}
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 13L13 3"
                    stroke="#ABAEBC"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M3 3L13 13"
                    stroke="#ABAEBC"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        </span>
    ));
};

function FilterBubbles(props) {
    const RemoveModel = (value) => {
        props.updateModel(props.model.filter((item) => item.value !== value.value));
    };

    const RemoveMake = (value) => {
        const updatedMake = props.make.filter((item) => item.value !== value.value);
        props.updateMake(updatedMake);
        props.updateAvailableModelsDropdown(updatedMake);

        const matchedModel = props.allModels.find((obj) => obj.label === value.value);
        props.updateModel(
            props.model.filter((item) => {
                return !matchedModel.options.some((secondItem) => secondItem.label === item.label);
            })
        );
    };

    const RemoveColor = (value, stateValues, updateState) => {
        updateState(stateValues.filter((item) => item !== value));
    };

    return (
        <div className="bubbles ps-2 ps-lg-0">
            {props.AnyFilterSelected() && (
                <span
                    className="ms-1 span-item mt-2"
                    onClick={() => {
                        props.ClearAllStates();
                        if (props.ClearMobileFilters) {
                            props.ClearMobileFilters();
                        }
                    }}>
                    Clear All
                </span>
            )}

            {props?.make.map((currentItem, index) => (
                <span
                    className="ms-1 span-item mt-2"
                    onClick={() => RemoveMake(currentItem)}
                    key={index}>
                    {currentItem?.value}
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 13L13 3"
                            stroke="#ABAEBC"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M3 3L13 13"
                            stroke="#ABAEBC"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
            ))}

            {props?.model.map((currentItem, index) => (
                <span
                    className="ms-1 span-item mt-2"
                    onClick={() => RemoveModel(currentItem)}
                    key={index}>
                    {currentItem?.value}
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 13L13 3"
                            stroke="#ABAEBC"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M3 3L13 13"
                            stroke="#ABAEBC"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
            ))}

            {props.yearValues[0] &&
                props.yearValues[1] &&
                (props.yearValues[0] != props.minYear || props.yearValues[1] != props.maxYear) && (
                    <span
                        className="ms-1 span-item mt-2"
                        onClick={() => props.setYearValues([props.minYear, props.maxYear])}>
                        {`${props.yearValues[0]} - ${props.yearValues[1]}`}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 13L13 3"
                                stroke="#ABAEBC"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M3 3L13 13"
                                stroke="#ABAEBC"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                )}

            {props.mileageValues[0] !== undefined &&
                props.mileageValues[1] !== undefined &&
                (props.mileageValues[0] != props.minMileage || props.mileageValues[1] != props.maxMileage) && (
                    <span
                        className="ms-1 span-item mt-2"
                        onClick={() => props.setMileageValues([props.minMileage, props.maxMileage])}>
                        {`${props.mileageValues[0].toLocaleString()} - ${props.mileageValues[1].toLocaleString()}`}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 13L13 3"
                                stroke="#ABAEBC"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M3 3L13 13"
                                stroke="#ABAEBC"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                )}

            {props.priceValues[0] &&
                props.priceValues[1] &&
                (props.priceValues[0] != props.minPrice || props.priceValues[1] != props.maxPrice) && (
                    <span
                        className="ms-1 span-item mt-2"
                        onClick={() => props.setPriceValues([props.minPrice, props.maxPrice])}>
                        {`$${props.priceValues[0].toLocaleString()} - $${props.priceValues[1].toLocaleString()}`}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 13L13 3"
                                stroke="#ABAEBC"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M3 3L13 13"
                                stroke="#ABAEBC"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                )}

         {props.paymentValues != null && props.paymentValues[0] &&
                props.paymentValues[1] &&
                (props.paymentValues[0] != props.minPayment || props.paymentValues[1] != props.maxPayment) && (
                    <span
                        className="ms-1 span-item mt-2"
                        onClick={() => props.setPaymentValues([props.minPayment, props.maxPayment])}>
                        {`$${props.paymentValues[0].toLocaleString()} - $${props.paymentValues[1].toLocaleString()}`}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 13L13 3"
                                stroke="#ABAEBC"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M3 3L13 13"
                                stroke="#ABAEBC"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                )}    

            {props.bodyStyles && (
                <BubbleComponents
                    stateValues={props.bodyStyles}
                    updateState={props.updateBodyStyles}
                    filterType="bodyStyles"></BubbleComponents>
            )}
            {props.cylinder && (
                <BubbleComponents
                    stateValues={props.cylinder}
                    updateState={props.updateCylinder}
                    filterType="cylinder"></BubbleComponents>
            )}
            {props.door && (
                <BubbleComponents
                    stateValues={props.door}
                    updateState={props.updateDoor}></BubbleComponents>
            )}

            {props.transmission && (
                <BubbleComponents
                    stateValues={props.transmission}
                    updateState={props.updateTransmission}></BubbleComponents>
            )}

            {props?.interiorColors.map((currentItem, index) => (
                <span
                    className="ms-1 span-item mt-2"
                    onClick={() => RemoveColor(currentItem, props.interiorColors, props.setInteriorColors)}
                    key={index}>
                    {currentItem != "Other" && (
                        <span
                            className="div-shade-color me-2"
                            style={{
                                backgroundColor: Colors.ReturnColorCode(Colors, currentItem)
                                    ? Colors.ReturnColorCode(Colors, currentItem)
                                    : "black"
                            }}>
                            <span className="vis-hid">xd</span>
                        </span>
                    )}
                    {currentItem == "Other" && (
                        <div className="div-other-color me-2">
                            <ColorWheelSVG />
                        </div>
                    )}
                    {`Int-${currentItem}`}

                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 13L13 3"
                            stroke="#ABAEBC"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M3 3L13 13"
                            stroke="#ABAEBC"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
            ))}

            {props?.exteriorColors.map((currentItem, index) => (
                <span
                    className="ms-1 span-item mt-2"
                    onClick={() => RemoveColor(currentItem, props.exteriorColors, props.setExteriorColors)}
                    key={index}>
                    {currentItem != "Other" && (
                        <span
                            className="div-shade-color  me-2"
                            style={{
                                backgroundColor: Colors.ReturnColorCode(Colors, currentItem)
                                    ? Colors.ReturnColorCode(Colors, currentItem)
                                    : "black"
                            }}>
                            <span className="vis-hid">xd</span>
                        </span>
                    )}
                    {currentItem == "Other" && (
                        <div className="div-other-color me-2">
                            <ColorWheelSVG />
                        </div>
                    )}
                    {`Ext-${currentItem}`}

                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 13L13 3"
                            stroke="#ABAEBC"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M3 3L13 13"
                            stroke="#ABAEBC"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
            ))}

            {props.fuel && (
                <BubbleComponents
                    stateValues={props.fuel}
                    updateState={props.updateFuel}></BubbleComponents>
            )}

            {props.train && (
                <BubbleComponents
                    stateValues={props.train}
                    updateState={props.updateTrain}
                    filterType="driveType"></BubbleComponents>
            )}

            {props.engine && (
                <BubbleComponents
                    stateValues={props.engine}
                    updateState={props.updateEngine}
                    filterType="engine"></BubbleComponents>
            )}
        </div>
    );
}

export default FilterBubbles;
