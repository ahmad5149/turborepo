"use client";
import { experimental_useOptimistic, useContext, useEffect, useState } from "react";
import Cars from "./Cars";
import AppContext from "../../StateManagement/AppContext";
import { GetAllCars, SearchCars, FilterListing, GetMakes, GetAllFacets } from "@/services/carService";
import LoadingSpinner from "../../components/common/loader/LoadingSpinner";
import "../../contents/scss/spinner.scss";
import { sortings, sortMapping } from "@/utils/SortingUtil";
import "../../contents/scss/404.scss";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ErrorFetchingCars from "./ErrorFetchingCars";
import { GetModels } from "@/services/carService";
import { element } from "prop-types";
import BodyStyles from "@/utils/constants/BodyStyles";

export default function SRP({ allFacets, contactDetails, queryParams }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [updatedAllFacets, setUpdatedAllFacets] = useState(allFacets);

    const {
        selectedBodyStyles,
        linkAllCars,
        searchBarText,
        setSearchBarText,
        carListing,
        filterApplied,
        setFilterApplied,
        bodyStyleFilters,
        yearValues,
        mileageValues,
        priceValues,
        sortDropDown,
        setLinkAllCars,
        minYear,
        setMinYear,
        maxYear,
        setMaxYear,
        minMileage,
        setMinMileage,
        maxMileage,
        minPrice,
        maxPrice,
        setDataLoaded,
        selectedMake,
        selectedModel,
        selectedTrain,
        selectedTransmission,
        selectedFuel,
        selectedDoor,
        selectedExteriorColors,
        selectedInteriorColors,
        selectedCylinder,
        selectedEngine,
        setMaxPrice,
        setMinPrice,
        setMaxMileage,
        setPriceValues,
        setMileageValues,
        setYearValues,
        setSortDropDown,
        setSelectedDoor,
        setSelectedCylinder,
        setSelectedFuel,
        setSelectedTransmission,
        setSelectedTrain,
        setInteriorColors,
        setExteriorColors,
        setSelectedEngine,
        setSelectedBodyStyles,
        orderAscending,
        showComingSoonCars,
        setShowComingSoonCars
    } = useContext(AppContext);
    let pagination;
    let carsInfo;
    let contactListIndex = 0;
    const [carsData, setCarsData] = useState(null);
    let carsURL = "";
    const [undefinedCount, setUndefinedCount] = useState(0);
    const LOADING_TIMEOUT = 30000; // Set a timeout of 30 seconds (adjust as needed)
    const [loadingTimeoutReached, setLoadingTimeoutReached] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoadingTimeoutReached(true);
        }, LOADING_TIMEOUT);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const [allModels, setAllModels] = useState([]);

    useEffect(() => {
        const fetchModelData = async () => {
            try {
                const modelsData = await GetModels();
                setAllModels(modelsData);
            } catch (error) {
                console.error("Error fetching models:", error);
            }
        };
        fetchModelData(); // Call the async function
    }, []); // Add dependencies if needed

    //get the updated facets after coming soon toggle(true/false)
    useEffect(() => {
        const fetchFacetsData = async () => {
            try {
                const updatedFacets = await GetAllFacets(showComingSoonCars);

                // Update the count of makes in the allFacets object
                if (updatedFacets && updatedFacets.make) {
                    const updatedMakes = updatedFacets.make.map((make) => {
                        const existingMake = updatedAllFacets.make.find((existing) => existing.value === make.value);
                        if (existingMake) {
                            return {
                                ...existingMake,
                                count: make.count
                            };
                        } else {
                            return make;
                        }
                    });
                    const updatedFacetsData = {
                        ...updatedAllFacets,
                        make: updatedMakes
                    };
                    // Update the state with the new allFacets object
                    setUpdatedAllFacets(updatedFacetsData);
                }
            } catch (error) {
                console.error("Error fetching models:", error);
            }
        };
        fetchFacetsData(); // Call the async function
    }, [showComingSoonCars]);

    const setParamFromArray = (arrayName, array, params) => {
        params.delete(arrayName);

        if (array.length > 0) {
            params.delete(arrayName);

            if (arrayName == "make" || arrayName == "model") {
                array.forEach((element) => params.append(arrayName, element.value));
            } else {
                array.forEach((element) => params.append(arrayName, element));
            }

            if (arrayName === "bodystyle") {
                if (queryParams && !queryParams.q && queryParams.bodystyle) {
                    const updatedBodyStyles = array.map((value) => value.toLowerCase()); // Convert to lowercase
                    const matchingObjects = BodyStyles.filter((obj) => updatedBodyStyles.includes(obj.toLowerCase())); // Convert to lowercase

                    // Check if the new values differ from the current state
                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedBodyStyles)) {
                        setSelectedBodyStyles(matchingObjects);
                    }
                }
            }

            if (arrayName === "train") {
                if (queryParams && !queryParams.q && queryParams.train) {
                    const updatedTrain = array.map((value) => value.toLowerCase());
                    const matchingObjects = allFacets?.driveType.filter((obj) =>
                        updatedTrain.includes(obj.toLowerCase())
                    );

                    // Check if the new styles differ from the current state
                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedTrain)) {
                        setSelectedTrain(matchingObjects);
                    }
                }
            }

            if (arrayName === "engine") {
                if (queryParams && !queryParams.q && queryParams.engine) {
                    const updatedEngine = array.map((value) => value.toLowerCase());
                    const matchingObjects = allFacets?.engines.filter((obj) =>
                        updatedEngine.includes(obj.toLowerCase())
                    );

                    // Check if the new values differ from the current state
                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedEngine)) {
                        setSelectedEngine(matchingObjects);
                    }
                }
            }
            if (arrayName === "cylinder") {
                if (queryParams && !queryParams.q && queryParams.cylinder) {
                    const updatedCylinder = array.map((value) => value.toLowerCase());
                    const matchingObjects = allFacets?.cylinders.filter((obj) =>
                        updatedCylinder.includes(obj.toLowerCase())
                    );

                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedCylinder)) {
                        setSelectedCylinder(matchingObjects);
                    }
                }
            }
            if (arrayName === "transmission") {
                if (queryParams && !queryParams.q && queryParams.transmission) {
                    const updatedTransmission = array.map((value) => value.toLowerCase());
                    const matchingObjects = allFacets?.transmission.filter((obj) =>
                        updatedTransmission.includes(obj.toLowerCase())
                    );

                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedTransmission)) {
                        setSelectedTransmission(matchingObjects);
                    }
                }
            }
            if (arrayName === "incolor") {
                if (queryParams && !queryParams.q && queryParams.incolor) {
                    const updatedInColor = array.map((value) => value.toLowerCase());
                    const matchingObjects = allFacets?.inColor.filter((obj) =>
                        updatedInColor.includes(obj.toLowerCase())
                    );

                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedInteriorColors)) {
                        setInteriorColors(matchingObjects);
                    }
                }
            }
            if (arrayName === "excolor") {
                if (queryParams && !queryParams.q && queryParams.excolor) {
                    const updatedExColor = array.map((value) => value.toLowerCase());
                    const matchingObjects = allFacets?.exColor.filter((obj) =>
                        updatedExColor.includes(obj.toLowerCase())
                    );

                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedExteriorColors)) {
                        setExteriorColors(matchingObjects);
                    }
                }
            }
            if (arrayName === "fuel") {
                if (queryParams && !queryParams.q && queryParams.fuel) {
                    const updatedFuelType = array.map((value) => value.toLowerCase());
                    const matchingObjects = allFacets?.fuelType.filter((obj) =>
                        updatedFuelType.includes(obj.toLowerCase())
                    );

                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedFuel)) {
                        setSelectedFuel(matchingObjects);
                    }
                }
            }
            if (arrayName === "doors") {
                if (queryParams && !queryParams.q && queryParams.doors) {
                    const updatedDoors = array.map((value) => value);
                    const matchingObjects = allFacets?.doors.filter((obj) => updatedDoors.includes(obj));

                    if (JSON.stringify(matchingObjects) !== JSON.stringify(selectedDoor)) {
                        setSelectedDoor(matchingObjects);
                    }
                }
            }
        }
    };

    const setParamFromRange = (arrayName, array, min, max, params) => {
        params.delete(arrayName);

        if ((array[0] && array[0] != min) || (array[1] && array[1] != max)) {
            params.append(arrayName, array[0]);
            params.append(arrayName, array[1]);
        }

        if (arrayName === "price" && queryParams && !queryParams.q && queryParams.price) {
            if (array[0] < min || array[1] > max) {
                params.delete("price");
                setPriceValues([min, max]);
            }
        }

        if (arrayName === "year" && queryParams && !queryParams.q && queryParams.year) {
            if (
                array[0] < min ||
                array[1] > max
                //||
                // array[0]?.toString().length !== 4 ||
                // array[1]?.toString().length !== 4
            ) {
                params.delete("year");
                setYearValues([min, max]);
            }
        }
        if (arrayName === "mileage" && queryParams && !queryParams.q && queryParams.mileage) {
            let newMax = roundToCeilStep(max, 1000);
            let newMin = roundToFloorStep(min, 100);

            if (array[0] < newMin || array[1] > newMax) {
                params.delete("mileage");
                setMileageValues([newMin, newMax]);

                // setMileageValues([0, max]);
            }
        }
    };

    const setUrlParams = () => {
        const params = new URLSearchParams(searchParams);
        if (searchBarText && params) {
            params.set("q", searchBarText);
            params.delete("bodystyle");
            params.delete("cylinder");
            params.delete("make");
            params.delete("model");
            params.delete("transmission");
            params.delete("train");
            params.delete("engine");
            params.delete("incolor");
            params.delete("excolor");
            params.delete("incolor");
            params.delete("fuel");
            params.delete("doors");
            params.delete("price");
            params.delete("mileage");
            params.delete("year");
        } else {
            if (params) {
                params.delete("q");
            }
            setParamFromArray("bodystyle", selectedBodyStyles, params);
            setParamFromArray("cylinder", selectedCylinder, params);
            setParamFromArray("make", selectedMake, params);
            setParamFromArray("model", selectedModel, params);
            setParamFromArray("transmission", selectedTransmission, params);
            setParamFromArray("train", selectedTrain, params);
            setParamFromArray("engine", selectedEngine, params);
            setParamFromArray("excolor", selectedExteriorColors, params);
            setParamFromArray("incolor", selectedInteriorColors, params);
            setParamFromArray("fuel", selectedFuel, params);
            setParamFromArray("doors", selectedDoor, params);
            setParamFromRange("price", priceValues, minPrice, maxPrice, params);
            setParamFromRange("mileage", mileageValues, minMileage, maxMileage, params);
            setParamFromRange("year", yearValues, minYear, maxYear, params);
        }
        if (sortDropDown && params) {
            params.set("sort", sortDropDown.value);
        }
        var path = "";
        if (params) {
            params.set("showComingSoonCars", showComingSoonCars);
            path = pathname + "?" + params.toString()?.replace(/\+/g, "%20");
        }
        carsURL = path;
        //router.push(path, { scroll: false });
        window.history.replaceState({}, "", path);
    };

    const GenerateURL = () => {
        return window.location.href;
    };

    const applySorting = (query, sortDropDown) => {
        if (sortDropDown?.value === null || sortDropDown?.value === undefined) {
            //optional in case default values are not set
            query.orderBy = "createdAt";
            query.orderAsc = false;
        }
        if (sortDropDown?.value && sortMapping[sortDropDown.value]) {
            const { orderBy, orderAsc } = sortMapping[sortDropDown.value];
            query.orderBy = orderBy;
            query.orderAsc = orderAsc;
        }
    };

    const formatURL = (url) => {
        const queryString = url.toString()?.replace(/%20/g, " ");
        const splittedURL = queryString.split("?");
        if (splittedURL.length >= 2) {
            return splittedURL[1];
        } else {
            return splittedURL;
        }
    };
    const fetchData = async () => {
        let appliedFilters = "";
        let sortParam;

        if (
            filterApplied ||
            queryParams.bodystyle ||
            queryParams.doors ||
            queryParams.cylinder ||
            queryParams.fuel ||
            queryParams.engine ||
            queryParams.train ||
            queryParams.transmission ||
            queryParams.incolor ||
            queryParams.excolor ||
            queryParams.price ||
            queryParams.year ||
            queryParams.mileage ||
            queryParams.make ||
            queryParams.model
        ) {
            if (
                (selectedBodyStyles.length == 0 &&
                    yearValues[0] == 0 &&
                    yearValues[1] == 0 &&
                    mileageValues[0] == 0 &&
                    mileageValues[1] == 0 &&
                    priceValues[0] == 0 &&
                    priceValues[1] == 0) ||
                (queryParams.q && !filterApplied)
            ) {
                setFilterApplied(false);
            }
            setSearchBarText("");
            setLinkAllCars("");
            setUndefinedCount(0);

            const url = carsURL;

            const splittedURL = formatURL(url);
            if (splittedURL) {
                sortParam = getSortParamsFromURL(splittedURL);
                appliedFilters = removeSortParamFromQueryString(splittedURL);

                if (appliedFilters != null || appliedFilters != "") {
                    appliedFilters += "&";
                }
                appliedFilters += "orderBy=" + sortParam?.orderBy + "&" + "orderAsc=" + sortParam?.orderAsc;
            }

            let data = await FilterListing(appliedFilters, 20, showComingSoonCars);
            if (data != null) {
                carsInfo = data?.items;
                pagination = data.pagination;

                //logic to add static tiles in SRP
                let carsRes = data.items;

                for (let i = 0; i < 3; i++) {
                    if (carsRes.length >= 8 * i + 5) {
                        const updatedCars = [
                            ...carsRes.slice(0, 8 * i + 5),
                            { document: contactDetails.contactList[contactListIndex] },
                            carsRes[8 * i + 5],
                            ...carsRes.slice(8 * i + 5 + 1)
                        ];
                        contactListIndex++;

                        carsRes = updatedCars;
                    }
                }

                data.items = carsRes;
                setCarsData(data);
            } else {
                console.log("data not found");
            }
        }
    };

    const SetStateFromParams = (array, filterName, setState) => {
        if (array) {
            if (typeof array == "object") {
                let newStateValues = [];
                array.forEach((element) => {
                    newStateValues.push(element);
                    // if (/^[\d.]+$/.test(element)) {
                    //     const num = parseFloat(element);
                    //     console.log(typeof num);
                    //     filterName == "engine" ? newStateValues.push(element) : newStateValues.push(num);
                    //     // Conversion successful
                    // } else {
                    //     // Conversion failed
                    //     newStateValues.push(element);
                    // }
                });

                setState(newStateValues);
            }
            // } else if (/^[\d.]+$/.test(array)) {
            //     const num = parseFloat(array);
            //     console.log(typeof num);
            //     filterName == "engine" ? setState([array]) : setState([num]);
            //     console.log(typeof filterName);
            //     // Conversion successful
            // }
            else {
                //     Conversion failed
                setState([array]);
            }
        }
    };

    const getSortParamsFromURL = (url) => {
        if (typeof url === "string") {
            const params = new URLSearchParams(url);
            const sortParam = params?.get("sort");

            const sortParams = {
                orderBy: "", // Initialize orderBy
                orderAsc: true // Initialize orderAsc
            };

            if (sortParam) {
                if (sortParam === "priceHigh") {
                    sortParams.orderBy = "price";
                    sortParams.orderAsc = false;
                } else if (sortParam === "newest") {
                    sortParams.orderBy = "createdAt";
                    sortParams.orderAsc = false;
                } else if (sortParam === "priceLow") {
                    sortParams.orderBy = "price";
                    sortParams.orderAsc = true;
                } else if (sortParam === "milesLow") {
                    sortParams.orderBy = "mileage";
                    sortParams.orderAsc = true;
                } else if (sortParam === "newModel") {
                    sortParams.orderBy = "year";
                    sortParams.orderAsc = false;
                }
            }

            return sortParams;
        }
    };

    function removeSortParamFromQueryString(queryString) {
        if (typeof queryString === "string") {
            const url = new URLSearchParams(queryString);
            url.delete("sort");
            return url.toString();
        }
    }

    const SetRangeStateFromParams = (values, filterName, stateValues, setState) => {
        if (values) {
            if (values && isNaN(values[0]) && isNaN(values[1])) {
                const [min, max] = values.map(parseFloat);

                if (isNaN(min) || isNaN(max)) {
                    setState([min, max]);
                }
            } else {
                if (typeof values == "object") {
                    let min = values[0];
                    let max = values[1];
                    let newValues = stateValues;
                    if (/^[\d.]+$/.test(min)) {
                        const num = parseFloat(min);
                        newValues[0] = num;
                    }
                    if (/^[\d.]+$/.test(max)) {
                        const num = parseFloat(max);
                        newValues[1] = num;
                    }
                    setState(newValues);
                }
                // else if (/^[\d.]+$/.test(values)) {
                //     const num = parseFloat(values);
                //     // Conversion successful
                //     setState([num, stateValues[1]]);
                // }
            }
        }
    };

    useEffect(() => {
        if (
            queryParams.bodystyle ||
            queryParams.doors ||
            queryParams.cylinder ||
            queryParams.fuel ||
            queryParams.engine ||
            queryParams.train ||
            queryParams.transmission ||
            queryParams.incolor ||
            queryParams.excolor ||
            queryParams.price ||
            queryParams.year ||
            queryParams.mileage ||
            queryParams.make ||
            queryParams.model
        ) {
            SetStateFromParams(queryParams.bodystyle, "bodystyle", setSelectedBodyStyles);
            SetStateFromParams(queryParams.doors, "doors", setSelectedDoor);
            SetStateFromParams(queryParams.cylinder, "cylinder", setSelectedCylinder);
            SetStateFromParams(queryParams.fuel, "fuel", setSelectedFuel);
            SetStateFromParams(queryParams.engine, "engine", setSelectedEngine);
            SetStateFromParams(queryParams.train, "train", setSelectedTrain);
            SetStateFromParams(queryParams.transmission, "transmission", setSelectedTransmission);
            SetStateFromParams(queryParams.incolor, "incolor", setInteriorColors);
            SetStateFromParams(queryParams.excolor, "excolor", setExteriorColors);
            SetRangeStateFromParams(queryParams.price, "price", priceValues, setPriceValues);
            SetRangeStateFromParams(queryParams.year, "year", yearValues, setYearValues);
            SetRangeStateFromParams(queryParams.mileage, "mileage", mileageValues, setMileageValues);
        }
        let newMaxPrice = roundToCeilStep(maxPrice, step);
        let newMaxYear = maxYear;
        let newMaxMileage = roundToCeilStep(maxMileage, 1000); //maxMileage;
        let newMinPrice = roundToFloorStep(minPrice, step);
        let newMinYear = minYear;
        let newMinMileage = minMileage;
        roundToFloorStep(minMileage, 1);

        if (allFacets.price) {
            newMinPrice = roundToFloorStep(allFacets.price[0], step);
            newMaxPrice = roundToCeilStep(allFacets.price[1], step);
            setMinPrice(newMinPrice);
            setMaxPrice(newMaxPrice);
        }
        if (allFacets.year) {
            newMinYear = allFacets.year[0];
            newMaxYear = allFacets.year[1];
            setMinYear(newMinYear);
            setMaxYear(newMaxYear);
        }
        if (allFacets.mileage) {
            newMinMileage = roundToFloorStep(allFacets.mileage[0], step);
            newMaxMileage = roundToCeilStep(allFacets.mileage[1], step);

            setMinMileage(newMinMileage);
            setMaxMileage(newMaxMileage);
        }

        if ((!priceValues[0] || priceValues[0] === minPrice) && (!priceValues[1] || priceValues[1] === maxPrice)) {
            setPriceValues([newMinPrice, newMaxPrice]);
        } else if (!priceValues[0] || priceValues[0] === minPrice) {
            setPriceValues([newMinPrice, priceValues[1]]);
        } else if (!priceValues[1] || priceValues[1] === maxPrice) {
            setPriceValues([priceValues[0], newMaxPrice]);
        }
        if (
            (!mileageValues[0] || mileageValues[0] === minMileage) &&
            (!mileageValues[1] || mileageValues[1] === maxMileage)
        ) {
            setMileageValues([newMinMileage, newMaxMileage]);
        } else if (!mileageValues[0] || roundToFloorStep(mileageValues[0] === minMileage)) {
            setMileageValues([newMinMileage, mileageValues[1]]);
        } else if (!mileageValues[1] || roundToCeilStep(mileageValues[1] === maxMileage)) {
            setMileageValues([roundToFloorStep(mileageValues[0], 1), newMaxMileage]);
        }

        if ((!yearValues[0] || yearValues[0] == minYear) && (!yearValues[1] || yearValues[1] == maxYear)) {
            setYearValues([newMinYear, newMaxYear]);
        } else if (!yearValues[0] || yearValues[0] == minYear) {
            setYearValues([newMinYear, yearValues[1]]);
        } else if (!yearValues[1] || yearValues[1] == maxYear) {
            setYearValues([yearValues[0], newMaxYear]);
        }
    }, []);
    // }, [minPrice, maxPrice, minMileage, maxMileage, maxYear, minYear]);

    const step = 1000;
    const roundToStep = (value, steps = 1000) => {
        if (value > 0) {
            value = Math.round(value / steps) * steps;
            return value;
        } else {
            return value;
        }
    };
    const roundToFloorStep = (value, steps = 1000) => {
        if (value > 0) {
            value = Math.floor(value / steps) * steps;
            return value;
        } else {
            return value;
        }
    };
    const roundToCeilStep = (value, steps = 1000) => {
        if (value > 0) {
            value = Math.ceil(value / steps) * steps;
            return value;
        } else {
            return value;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (linkAllCars != null && linkAllCars !== "") {
                const query = {
                    q: linkAllCars,
                    page: 1,
                    perPage: 20
                    // orderBy: "year",
                    // orderAsc: false
                };
                applySorting(query, sortDropDown);
                setUndefinedCount(0);
                const data = await SearchCars(query, showComingSoonCars);
                if (data != null) {
                    carsInfo = data.items;
                    pagination = data.pagination;
                    setCarsData(data);

                    //logic to add static tiles in SRP
                    let carsRes = data.items;

                    for (let i = 0; i < 3; i++) {
                        if (carsRes.length >= 8 * i + 5) {
                            const updatedCars = [
                                ...carsRes.slice(0, 8 * i + 5),
                                { document: contactDetails.contactList[contactListIndex] },
                                carsRes[8 * i + 5],
                                ...carsRes.slice(8 * i + 5 + 1)
                            ];
                            contactListIndex++;

                            carsRes = updatedCars;
                        }
                    }

                    data.items = carsRes;
                    setCarsData(data);

                    setSearchBarText(linkAllCars);
                }
            } else if (
                !filterApplied &&
                !queryParams.bodystyle &&
                !queryParams.doors &&
                !queryParams.cylinder &&
                !queryParams.fuel &&
                !queryParams.engine &&
                !queryParams.train &&
                !queryParams.transmission &&
                !queryParams.incolor &&
                !queryParams.excolor &&
                !queryParams.price &&
                !queryParams.year &&
                !queryParams.mileage &&
                !queryParams.make &&
                !queryParams.model
            ) {
                let query = {
                    page: 1,
                    perPage: 21,
                    orderBy: sortDropDown.value,
                    orderAsc: orderAscending
                };

                applySorting(query, sortDropDown);
                setUndefinedCount(0);
                let data = await GetAllCars(query, showComingSoonCars);
                if (data != null) {
                    data.items = data.items ?? data.hits;
                    carsInfo = data.items;
                    pagination = data.pagination;

                    //logic to add static tiles in SRP
                    let carsRes = data.items;

                    for (let i = 0; i < 3; i++) {
                        if (contactListIndex >= contactDetails.contactList.length) {
                            contactListIndex = 0;
                        }
                        if (carsRes.length >= 8 * i + 5) {
                            const updatedCars = [
                                ...carsRes.slice(0, 8 * i + 5),
                                { document: contactDetails.contactList[contactListIndex] },
                                carsRes[8 * i + 5],
                                ...carsRes.slice(8 * i + 5 + 1)
                            ];
                            contactListIndex++;

                            carsRes = updatedCars;
                        }
                    }

                    data.items = carsRes;
                    setCarsData(data);
                }
            }
        };

        fetchData();
    }, [linkAllCars, sortDropDown, showComingSoonCars]);

    useEffect(() => {
        setUrlParams();
        if (
            filterApplied ||
            queryParams.bodystyle ||
            queryParams.doors ||
            queryParams.cylinder ||
            queryParams.fuel ||
            queryParams.engine ||
            queryParams.train ||
            queryParams.transmission ||
            queryParams.incolor ||
            queryParams.excolor ||
            queryParams.price ||
            queryParams.year ||
            queryParams.mileage ||
            queryParams.make ||
            queryParams.model
        ) {
            fetchData();
        }
    }, [
        filterApplied,
        selectedBodyStyles,
        yearValues,
        mileageValues,
        priceValues,
        sortDropDown,
        selectedMake,
        selectedModel,
        selectedTrain,
        selectedTransmission,
        selectedFuel,
        selectedDoor,
        selectedExteriorColors,
        selectedInteriorColors,
        selectedCylinder,
        selectedEngine,
        showComingSoonCars
    ]);

    useEffect(() => {
        setUrlParams();
        let dataRead = true;
        const handleScroll = async () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 500) {
                setDataLoaded(false);
                if (searchBarText == "" && !filterApplied) {
                    if (pagination == null && carsData) {
                        pagination = carsData.pagination;
                        carsInfo = carsData.items;
                    }
                    if (pagination && dataRead) {
                        let query = {
                            q: null,
                            page: pagination.page + 1,
                            perPage: 21
                        };

                        applySorting(query, sortDropDown);
                        dataRead = false;
                        const data = await GetAllCars(query, showComingSoonCars);
                        if (data != null) {
                            let updatedCarsData = [...carsInfo, ...data.items];

                            //logic to add static tiles in SRP
                            let carsRes = updatedCarsData;
                            for (
                                let i = 3 * data.pagination.page - 3 - undefinedCount;
                                i < 3 * data.pagination.page;
                                i++
                            ) {
                                if (updatedCarsData.length >= 8 * i + 3) {
                                    if (contactListIndex >= contactDetails.contactList.length) {
                                        contactListIndex = 0;
                                    }

                                    const updatedCars = [
                                        ...carsRes.slice(0, 8 * i + 5),
                                        { document: contactDetails.contactList[contactListIndex] },
                                        carsRes[8 * i + 5],
                                        ...carsRes.slice(8 * i + 5 + 1)
                                    ];
                                    if (updatedCars[updatedCars.length - 1] == undefined) {
                                        carsRes = updatedCars.slice(0, updatedCars.length - 1);
                                    } else {
                                        carsRes = updatedCars;
                                    }
                                    contactListIndex++;
                                }
                            }

                            if (carsRes.length < 8 * (3 * data.pagination.page - 1) + 5) {
                                setUndefinedCount(1);
                            } else {
                                setUndefinedCount(0);
                            }

                            updatedCarsData = carsRes;

                            dataRead = true;
                            carsInfo = updatedCarsData;
                            pagination = data.pagination;
                            data.items = updatedCarsData;
                            setCarsData(data);
                        }
                    }
                    setDataLoaded(true);
                } else if (filterApplied) {
                    let queryParams = "";
                    let sortParam;
                    let appliedFilters = "";

                    if (pagination == null && carListing != null) {
                        pagination = carListing.pagination;
                        carsInfo = carListing.items;
                    }
                    if (pagination && dataRead) {
                        let query = {
                            page: pagination.page + 1,
                            perPage: 20
                        };

                        //applySorting(query, sortDropDown);
                        dataRead = false;

                        queryParams = "page=" + query.page + "&" + "perPage=20";

                        const url = carsURL;
                        const splittedURL = formatURL(url);
                        if (splittedURL) {
                            sortParam = getSortParamsFromURL(splittedURL);
                            appliedFilters = removeSortParamFromQueryString(splittedURL);
                            if (appliedFilters != null || appliedFilters != "") {
                                appliedFilters += "&";
                            }
                            appliedFilters += "orderBy=" + sortParam?.orderBy + "&" + "orderAsc=" + sortParam?.orderAsc;
                        }
                        if (appliedFilters != "") {
                            queryParams += "&";
                        }
                        queryParams += appliedFilters;
                        const data = await FilterListing(queryParams, 20, showComingSoonCars);
                        if (data != null) {
                            let updatedCarsData = [...carsInfo, ...data.items];

                            //logic to add static tiles in SRP
                            let carsRes = updatedCarsData;
                            for (
                                let i = 3 * data.pagination.page - 3 - undefinedCount;
                                i < 3 * data.pagination.page;
                                i++
                            ) {
                                if (updatedCarsData.length >= 8 * i + 3) {
                                    if (contactListIndex >= contactDetails.contactList.length) {
                                        contactListIndex = 0;
                                    }
                                    const updatedCars = [
                                        ...carsRes.slice(0, 8 * i + 5),
                                        { document: contactDetails.contactList[contactListIndex] },
                                        carsRes[8 * i + 5],
                                        ...carsRes.slice(8 * i + 5 + 1)
                                    ];

                                    if (updatedCars[updatedCars.length - 1] == undefined) {
                                        carsRes = updatedCars.slice(0, updatedCars.length - 1);
                                    } else {
                                        carsRes = updatedCars;
                                    }
                                    contactListIndex++;
                                }
                            }

                            if (carsRes.length < 8 * (3 * data.pagination.page - 1) + 5) {
                                setUndefinedCount(1);
                            } else {
                                setUndefinedCount(0);
                            }
                            updatedCarsData = carsRes;

                            dataRead = true;
                            carsInfo = updatedCarsData;
                            pagination = data.pagination;
                            data.items = updatedCarsData;
                            setCarsData(data);
                        } else {
                            console.log("data not found");
                        }
                    }
                    setDataLoaded(true);
                } else {
                    if (pagination == null && carListing != null) {
                        pagination = carListing.pagination;
                        carsInfo = carListing.items;
                    }
                    if (pagination && dataRead) {
                        let query = {
                            q: searchBarText,
                            page: pagination.page + 1,
                            perPage: 20
                        };

                        applySorting(query, sortDropDown);
                        dataRead = false;
                        const data = await SearchCars(query, showComingSoonCars);
                        if (data != null) {
                            let updatedCarsData = [...carsInfo, ...data.items];

                            //logic to add static tiles in SRP
                            let carsRes = updatedCarsData;
                            for (
                                let i = 3 * data.pagination.page - 3 - undefinedCount;
                                i < 3 * data.pagination.page;
                                i++
                            ) {
                                if (updatedCarsData.length >= 8 * i + 3) {
                                    if (contactListIndex >= contactDetails.contactList.length) {
                                        contactListIndex = 0;
                                    }
                                    const updatedCars = [
                                        ...carsRes.slice(0, 8 * i + 5),
                                        { document: contactDetails.contactList[contactListIndex] },
                                        carsRes[8 * i + 5],
                                        ...carsRes.slice(8 * i + 5 + 1)
                                    ];

                                    if (updatedCars[updatedCars.length - 1] == undefined) {
                                        carsRes = updatedCars.slice(0, updatedCars.length - 1);
                                    } else {
                                        carsRes = updatedCars;
                                    }
                                    contactListIndex++;
                                }
                            }

                            if (carsRes.length < 8 * (3 * data.pagination.page - 1) + 5) {
                                setUndefinedCount(1);
                            } else {
                                setUndefinedCount(0);
                            }

                            updatedCarsData = carsRes;

                            dataRead = true;
                            carsInfo = updatedCarsData;
                            pagination = data.pagination;
                            data.items = updatedCarsData;
                            setCarsData(data);
                        }
                    }
                    setDataLoaded(true);
                }
                // Perform any action you want when the page is fully scrolled down
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [searchBarText, carListing, pagination, filterApplied, bodyStyleFilters, sortDropDown, undefinedCount]);

    const CheckQueryParams = () => {
        if (queryParams) {
            if (queryParams.sort) {
                const filterValue = sortings.filter((value) => value?.value == queryParams.sort);
                if (filterValue && filterValue.length > 0) {
                    setSortDropDown(filterValue[0]);
                }
            }
            if (queryParams.showComingSoonCars) {
                setShowComingSoonCars(showComingSoonCars);
            }
            if (queryParams.q) {
                const searchText = queryParams.q;
                setSearchBarText(searchText);
                setLinkAllCars(searchText);
            } else if (
                queryParams.bodystyle ||
                queryParams.doors ||
                queryParams.cylinder ||
                queryParams.fuel ||
                queryParams.engine ||
                queryParams.train ||
                queryParams.transmission ||
                queryParams.incolor ||
                queryParams.excolor ||
                queryParams.price ||
                queryParams.year ||
                queryParams.mileage ||
                queryParams.make ||
                queryParams.model
            ) {
                setFilterApplied(true);
                setUrlParams();
                SetStateFromParams(queryParams.bodystyle, "bodystyle", setSelectedBodyStyles);
                SetStateFromParams(queryParams.doors, "doors", setSelectedDoor);
                SetStateFromParams(queryParams.cylinder, "cylinder", setSelectedCylinder);
                SetStateFromParams(queryParams.fuel, "fuel", setSelectedFuel);
                SetStateFromParams(queryParams.engine, "engine", setSelectedEngine);
                SetStateFromParams(queryParams.train, "train", setSelectedTrain);
                SetStateFromParams(queryParams.transmission, "transmission", setSelectedTransmission);
                SetStateFromParams(queryParams.incolor, "incolor", setInteriorColors);
                SetStateFromParams(queryParams.excolor, "excolor", setExteriorColors);
                SetRangeStateFromParams(queryParams.price, "price", priceValues, setPriceValues);
                SetRangeStateFromParams(queryParams.year, "year", yearValues, setYearValues);
                SetRangeStateFromParams(queryParams.mileage, "mileage", mileageValues, setMileageValues);
                fetchData();
            }
        }
    };
    if (loadingTimeoutReached && carsData === null) {
        // If the timeout is reached and carsData is still null, stop showing the loader
        return (
            <div className="loading-spinner-center-align">
                <ErrorFetchingCars Message="No Cars Found!" />
            </div>
        );
    } else if (carsData === null) {
        return (
            <div className="loading-spinner-center-align">
                <LoadingSpinner />
            </div>
        ); // Show a loading state while data is being fetched
    }
    return (
        <>
            <Cars
                cars={carsData}
                allFacets={updatedAllFacets}
                //allFacets={allFacets}
                roundToStep={roundToStep}
                roundToCeilStep={roundToCeilStep}
                roundToFloorStep={roundToFloorStep}
                queryParams={queryParams}
                CheckQueryParams={CheckQueryParams}
                GenerateURL={GenerateURL}
                allModels={allModels}
            />
        </>
    );
}
