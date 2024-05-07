"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleUp,
  faAngleDown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
// import { GetUserLocations, GetDeliveryEstimates,getDistanceInfo } from "@/services/carService";
import { GetUserLocations,getDistanceInfo } from "@/services/carService";
import {
  DeliveryEstimateCarSVG,
  DeliveryEstimateLocationSVG,
  DeliveryEstimateTimeSVG,
  DeliveryEstimateSearchSVG,
  DeliveryEstimateAmountSVG,
} from "../../../contents/svgs/carDetails";

function DeliveryEstimates({ popupData, vin,dealerZipCode }) {
  const defaultlocation = "THIScar Delivery Center, Tomball, TX";
  const defaultZip = "77375";
  const [currentLocation, setCurrentLocation] = useState(defaultlocation);
  const [defaultZipCode, setDefaultZipCode] = useState(defaultZip);
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [minDays, setMinDays] = useState(0);
  const [maxDays, setMaxDays] = useState(0);
  const [price, setPrice] = useState(0);
  const modalRef = useRef(null);

  const UpdateDeliveryEstimates = async (zip = {}) => {
    let shippingResponse;
    // const response = await GetDeliveryEstimates(vin, zip);
    if(dealerZipCode && dealerZipCode != "" && zip && zip != "")
    {
    shippingResponse = await getDistanceInfo(dealerZipCode,zip);
    }
    setMinDays(shippingResponse?.DeliveryEstimateInDays?.start);
    setMaxDays(shippingResponse?.DeliveryEstimateInDays?.end);
    setPrice(shippingResponse?.DeliveryCostInDollars);
  };

  useEffect(() => {
    if (vin) {
      UpdateDeliveryEstimates(defaultZipCode);
    }
  }, []);

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  let popUpData = popupData?.deliveryPopUp;

  const UpdateLocations = async (event) => {
    let data = await GetUserLocations(event.target.value);

    setAvailableLocations(data);
  };

  return (
    <>
      <section>
        <div className="delivery-estimates d-flex justify-content-start bg-white">
          <div className="col-md-12 row">
            <div className="col-2 col-sm-1 pe-0 van-logo">
              {" "}
              <DeliveryEstimateCarSVG />
            </div>
            <div className="col-9 col-sm-11">
              <h4>Delivery Estimates</h4>
            </div>
            <div className="col-md-12 d-flex">
              <div className="col-xl-1 spaceDiv"></div>
              <div className="col-xl-11 col-md-12 estimate-content ">
                <div className="estimate-text d-flex align-items-center">
                  <div>
                    <DeliveryEstimateLocationSVG />
                  </div>
                  <div>
                    <span className="simple-text">Your city:to </span>
                    <span
                      className="current-loc"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowDropdown(!showDropdown);
                      }}
                    >
                      {currentLocation}
                    </span>
                  </div>
                  <div className="ms-1">
                    <span className="dropdown">
                      <FontAwesomeIcon
                        icon={showDropdown ? faAngleUp : faAngleDown}
                        onClick={(event) => {
                          event.stopPropagation();
                          setShowDropdown(!showDropdown);
                        }}
                      />
                      {showDropdown && (
                        <div
                          ref={modalRef}
                          className="dropdown-menu p-3 menu-delivery show"
                        >
                          <h6 className="mb-3 mt-2">Delivered To</h6>
                          <div className="input-group mb-3 group-in d-flex align-items-center">
                            <span
                              className="input-group-text border-none bor-input"
                              id="basic-addon1"
                            >
                              <span>
                                <DeliveryEstimateSearchSVG />
                              </span>
                            </span>
                            <input
                              type="text"
                              className="form-control border-none form-none"
                              placeholder="Enter Zip"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              onChange={UpdateLocations}
                            />
                          </div>
                          <ul className="in-ul">
                            <li
                              className={
                                currentLocation == defaultlocation
                                  ? "selected"
                                  : ""
                              }
                              onClick={() => {
                                setCurrentLocation(defaultlocation);
                                setShowDropdown(false);
                                UpdateDeliveryEstimates(defaultZipCode);
                              }}
                            >
                              {defaultlocation}
                            </li>
                            {availableLocations?.map((value, index) => (
                              <li
                                key={index}
                                className={
                                  currentLocation ==
                                  `${value.city}, ${value.state}`
                                    ? "selected"
                                    : ""
                                }
                                onClick={() => {
                                  setCurrentLocation(
                                    `${value.city}, ${value.state}`
                                  );
                                  setShowDropdown(false);
                                  UpdateDeliveryEstimates(value.zip);
                                }}
                              >
                                {value.city}, {value.state}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
                <p>
                  <DeliveryEstimateTimeSVG />
                  Delivery Estimate: {minDays ?? 0}–{maxDays ?? 0} Days
                </p>
                <p>
                  <DeliveryEstimateAmountSVG />
                  Delivery: {price ? "$" + price.toLocaleString() : "..."}
                </p>
                <p>
                  <span data-bs-toggle="modal" data-bs-target="#deliveryModal">
                    <b>
                      More About Delivery Estimates{" "}
                      <FontAwesomeIcon
                        className="delivery-arrow-icon"
                        icon={faAngleRight}
                      />
                    </b>
                  </span>{" "}
                </p>
              </div>

              {/* <div className="paragraph-container">
<p className="paragraph">This is a sample paragraph.</p>
<span className="arrow">&#8594;</span>
</div> */}
            </div>
          </div>
        </div>
      </section>
      <div className="modal car-page-modal" id="deliveryModal" role="dialog">
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {popUpData?.popUpHeading}
                {/* Touchless Delivery Process */}
              </h3>
              <button
                type="button"
                className="close closeModal"
                data-bs-dismiss="modal"
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            <div className="modal-body modal-style-body">
              <ol className="steps">
                {popUpData?.deliverySteps?.map(
                  (
                    item,
                    index // Use the slice method to show only five FAQs
                  ) => (
                    <React.Fragment key={index}>
                      <li>
                        <p>{`${++index}. ${item?.deliverySteps}`}</p>
                      </li>
                    </React.Fragment>
                  )
                )}
              </ol>
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-lg mt-2 custom_btn detail-btn"
              >
                {popUpData?.buttonText}
                {/* Got it */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeliveryEstimates;
