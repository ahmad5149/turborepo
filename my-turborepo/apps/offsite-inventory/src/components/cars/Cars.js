"use client";
import React, { useContext, useEffect, useState } from "react";
import SearchSide from "./searchSide";
import SearchMenu from "./searchMenu";
import SearchNav from "./searchNav";
import AppContext from "../../StateManagement/AppContext";
export default function Cars({
    cars,
    allFacets,
    roundToStep,
    roundToCeilStep,
    roundToFloorStep,
    queryParams,
    CheckQueryParams,
    GenerateURL,
    allModels,
    carTileContactInfo,
    packAmount,
    dealerName
}) {
    const {
        minMileage,
        maxMileage,
        minPrice,
        maxPrice,
        minPayment,
        maxPayment,
        minYear,
        maxYear,
        selectedBodyStyles,
        setSelectedBodyStyles,
        searchBarText,
        linkAllCars,
        carListing,
        setCarListing,
        yearValues,
        mileageValues,
        priceValues,
        paymentValues,
        selectedMake,
        selectedModel,
        selectedEngine,
        selectedDoor,
        selectedFuel,
        selectedTransmission,
        availableModels,
        selectedTrain,
        setYearValues,
        setMileageValues,
        setPriceValues,
        setPaymentValues,
        setSelectedMake,
        setSelectedModel,
        setSelectedEngine,
        setSelectedDoor,
        setSelectedFuel,
        setSelectedTransmission,
        setAvailableModels,
        setSelectedTrain,
        selectedInteriorColors,
        setInteriorColors,
        selectedExteriorColors,
        setExteriorColors,
        selectedCylinder,
        setSelectedCylinder,
        setFilterApplied,
        setBodyStyleFilters
    } = useContext(AppContext);
    const allMakes = [];

    allFacets?.make.forEach((make) => {
        allMakes.push({
            label: `${make.value} (${make.count})`,
            value: make.value
        });
    });

    useEffect(() => {
        CheckQueryParams();

        const fetchAndUpdateData = async () => {
            let availableModels = [];

            if (queryParams && !queryParams.q) {
                if (queryParams.make || selectedMake) {
                    const makeComparison = (query, objValue) =>
                        query.toLowerCase() === objValue.toLowerCase() ||
                        query.toLowerCase() === objValue[0].toLowerCase() + objValue.slice(1);

                    if (Array.isArray(queryParams.make)) {
                        const matchingObjects = allMakes.filter((obj) =>
                            queryParams.make.some((query) => makeComparison(query, obj.value))
                        );
                        setSelectedMake(matchingObjects);
                        availableModels = await updateAvailableModelsDropdown(matchingObjects);
                    } else {
                        var matchingObjects;
                        if (queryParams && queryParams.make != undefined) {
                            matchingObjects = allMakes.filter((obj) => makeComparison(queryParams.make, obj.value));
                        } else {
                            matchingObjects = selectedMake;
                        }
                        setSelectedMake(matchingObjects);
                        availableModels = await updateAvailableModelsDropdown(matchingObjects);
                    }
                }

                if (queryParams.model) {
                    const extractedArray = [];

                    if (Array.isArray(queryParams.model)) {
                        availableModels.forEach((obj1) => {
                            obj1.options.forEach((option) => {
                                if (
                                    queryParams.model.some((obj2) => obj2.toLowerCase() === option.value.toLowerCase())
                                ) {
                                    extractedArray.push(option);
                                }
                            });
                        });
                    } else {
                        // Iterate over the first array
                        availableModels.forEach((obj1) => {
                            // Iterate over the 'options' array of each object in array1
                            obj1.options.forEach((option) => {
                                // Check if 'value' matches any 'value' in array2
                                if (queryParams.model.toLowerCase() === option.value.toLowerCase()) {
                                    extractedArray.push(option);
                                }
                            });
                        });
                    }

                    setSelectedModel(extractedArray);
                }
            }
        };

        fetchAndUpdateData();
    }, [allModels]);

    useEffect(() => {
        if (cars != null) {
            setCarListing(cars);
        } else {
            setCarListing(carListing);
        }
    }, [cars, carListing]);

    const updateAvailableModelsDropdown = async (array = selectedMake) => {
        if (array.length == 0) {
            setAvailableModels([]);
        } else {
            const newModelArray = allModels.filter((model) => array.some((make) => make.value === model.label));
            setAvailableModels(newModelArray);
            return newModelArray;
        }
    };

    const AnyFilterSelected = () => {
        const isFilterSelected =
            selectedMake.length > 0 ||
            selectedModel.length > 0 ||
            selectedDoor.length > 0 ||
            selectedCylinder.length > 0 ||
            selectedTransmission.length > 0 ||
            selectedTrain.length > 0 ||
            selectedFuel.length > 0 ||
            selectedInteriorColors.length > 0 ||
            selectedExteriorColors.length > 0 ||
            selectedEngine.length > 0 ||
            selectedBodyStyles.length > 0 ||
            (yearValues[0] != 0 && yearValues[0] != minYear) ||
            (yearValues[1] != 0 && yearValues[1] != maxYear) ||
            (mileageValues[0] != 0 && mileageValues[0] != minMileage) ||
            (mileageValues[1] != 0 && mileageValues[1] != maxMileage) ||
            (priceValues[0] != 0 && priceValues[0] != minPrice) ||
            (priceValues[1] != 0 && priceValues[1] != maxPrice) ||
            (paymentValues[0] != 0 && paymentValues[0] != minPayment) ||
            (paymentValues[1] != 0 && paymentValues[1] != maxPayment);
        return isFilterSelected;
    };
    const ClearAllStates = () => {
        if (searchBarText != "" || linkAllCars != "") {
            setFilterApplied(false);
        }

        setSelectedBodyStyles([]);
        setSelectedCylinder([]);
        setSelectedMake([]);
        setSelectedModel([]);
        setSelectedEngine([]);
        setSelectedDoor([]);
        setSelectedFuel([]);
        setSelectedTransmission([]);
        setAvailableModels([]);
        setSelectedTrain([]);
        setInteriorColors([]);
        setExteriorColors([]);
        setYearValues([minYear, maxYear]);
        setMileageValues([minMileage, maxMileage]);
        setPriceValues([minPrice, maxPrice]);
        setPaymentValues([minPayment, maxPayment]);
    };

    const removeModalClasses = () => {
        // Logic to remove classes from the body
        document.body.classList.remove("modal-open");
    };

    const removeModalBackdrop = () => {
        // Logic to remove modal backdrop
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.remove();
        }
    };
    useEffect(() => {
        // Component mount logic

        // Cleanup logic to be executed when component is unmounted
        return () => {
            // Perform cleanup actions here
            document.body.style.overflow = "auto";
            removeModalClasses();
            removeModalBackdrop();
        };
    }, []); // Empty dependency array means this effect only runs once on mount and unmount

    return (
        <div className="container-fluid srp">
            <div className="col-lg-12 search-menu d-flex pt-4 "></div>
            <SearchNav ClearAllStates={ClearAllStates} />
            <div className="row d-flex justify-content-between pt-lg-5">
                <div className="col-lg-3 large-margins">
                    <SearchSide
                        GenerateURL={GenerateURL}
                        roundToStep={roundToStep}
                        roundToCeilStep={roundToCeilStep}
                        roundToFloorStep={roundToFloorStep}
                        updateAvailableModelsDropdown={updateAvailableModelsDropdown}
                        allMakes={allMakes}
                        carsCount={carListing?.pagination?.total ? carListing.pagination.total.toLocaleString() : 0}
                        minYear={minYear}
                        maxYear={maxYear}
                        yearValues={yearValues}
                        setYearValues={setYearValues}
                        minMileage={minMileage}
                        maxMileage={maxMileage}
                        mileageValues={mileageValues}
                        setMileageValues={setMileageValues}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        priceValues={priceValues}
                        minPayment={minPayment}
                        maxPayment={maxPayment}
                        paymentValues={paymentValues}
                        setPriceValues={setPriceValues}
                        setPaymentValues={setPaymentValues}
                        bodyStyles={selectedBodyStyles}
                        updateBodyStyles={setSelectedBodyStyles}
                        setBodyStyleFilters={setBodyStyleFilters}
                        interiorColors={selectedInteriorColors}
                        exteriorColors={selectedExteriorColors}
                        setInteriorColors={setInteriorColors}
                        setExteriorColors={setExteriorColors}
                        allModels={allModels}
                        availableModels={availableModels}
                        updateAvailableModels={setAvailableModels}
                        allFacets={allFacets}
                        make={selectedMake}
                        updateMake={setSelectedMake}
                        model={selectedModel}
                        updateModel={setSelectedModel}
                        engine={selectedEngine}
                        updateEngine={setSelectedEngine}
                        door={selectedDoor}
                        updateDoor={setSelectedDoor}
                        cylinder={selectedCylinder}
                        updateCylinder={setSelectedCylinder}
                        fuel={selectedFuel}
                        updateFuel={setSelectedFuel}
                        transmission={selectedTransmission}
                        updateTransmission={setSelectedTransmission}
                        train={selectedTrain}
                        updateTrain={setSelectedTrain}
                        AnyFilterSelected={AnyFilterSelected}
                        ClearAllStates={ClearAllStates}
                    />
                </div>
                <div className="col-lg-9">
                    <SearchMenu
                        carTileContactInfo={carTileContactInfo}
                        GenerateURL={GenerateURL}
                        updateAvailableModelsDropdown={updateAvailableModelsDropdown}
                        minYear={minYear}
                        maxYear={maxYear}
                        yearValues={yearValues}
                        setYearValues={setYearValues}
                        minMileage={minMileage}
                        maxMileage={maxMileage}
                        mileageValues={mileageValues}
                        setMileageValues={setMileageValues}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        priceValues={priceValues}
                        minPayment={minPayment}
                        maxPayment={maxPayment}
                        paymentValues={paymentValues}
                        setPriceValues={setPriceValues}
                        setPaymentValues={setPaymentValues}
                        bodyStyles={selectedBodyStyles}
                        updateBodyStyles={setSelectedBodyStyles}
                        interiorColors={selectedInteriorColors}
                        exteriorColors={selectedExteriorColors}
                        setInteriorColors={setInteriorColors}
                        setExteriorColors={setExteriorColors}
                        allModels={allModels}
                        updateAvailableModels={setAvailableModels}
                        availableModels={availableModels}
                        cars={carListing}
                        make={selectedMake}
                        updateMake={setSelectedMake}
                        model={selectedModel}
                        updateModel={setSelectedModel}
                        engine={selectedEngine}
                        updateEngine={setSelectedEngine}
                        door={selectedDoor}
                        updateDoor={setSelectedDoor}
                        cylinder={selectedCylinder}
                        updateCylinder={setSelectedCylinder}
                        fuel={selectedFuel}
                        updateFuel={setSelectedFuel}
                        transmission={selectedTransmission}
                        updateTransmission={setSelectedTransmission}
                        train={selectedTrain}
                        updateTrain={setSelectedTrain}
                        AnyFilterSelected={AnyFilterSelected}
                        ClearAllStates={ClearAllStates}
                        packAmount={packAmount}
                        dealerName={dealerName}
                    />
                </div>
            </div>
        </div>
    );
}
