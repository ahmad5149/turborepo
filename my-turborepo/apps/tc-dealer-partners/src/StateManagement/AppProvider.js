"use client";
import { useState, useEffect } from "react";
import AppContext from "./AppContext";
import { sortings } from "@/utils/SortingUtil";
import { appConfig } from "@/appConfig";

const AppProvider = ({ children, routes }) => {
    const [registeredRoute, setRegisteredRoute] = useState(false);
    const [isHamburgerMenuOpen, setHamburgerMenuOpen] = useState(true);
    const [searchBarText, setSearchBarText] = useState("");
    const [selectedBodyStyles, setSelectedBodyStyles] = useState([]);
    const [linkAllCars, setLinkAllCars] = useState("");
    const [carListing, setCarListing] = useState(null);
    let [selectedMake, setSelectedMake] = useState([]);
    let [selectedModel, setSelectedModel] = useState([]);
    let [selectedEngine, setSelectedEngine] = useState([]);
    let [selectedDoor, setSelectedDoor] = useState([]);
    let [selectedCylinder, setSelectedCylinder] = useState([]);
    let [selectedFuel, setSelectedFuel] = useState([]);
    let [selectedTransmission, setSelectedTransmission] = useState([]);
    const [availableModels, setAvailableModels] = useState([]);
    let [selectedTrain, setSelectedTrain] = useState([]);
    const [selectedInteriorColors, setInteriorColors] = useState([]);
    const [selectedExteriorColors, setExteriorColors] = useState([]);
    const [filterApplied, setFilterApplied] = useState(false);
    const [bodyStyleFilters, setBodyStyleFilters] = useState("");
    const [sortDropDown, setSortDropDown] = useState(sortings[0]);
    const [orderAscending, setOrderAscending] = useState(false);
    const [minYear, setMinYear] = useState(2012);
    const [maxYear, setMaxYear] = useState(new Date().getFullYear() + 1);
    const [minMileage, setMinMileage] = useState(5);
    const [maxMileage, setMaxMileage] = useState(124895);
    const [minPrice, setMinPrice] = useState(7000); //10401
    const [maxPrice, setMaxPrice] = useState(600500);
    const [minPayment, setMinPayment] = useState(200);
    const [maxPayment, setMaxPayment] = useState(5000);
    const [yearValues, setYearValues] = useState([minYear, maxYear]);
    const [mileageValues, setMileageValues] = useState([minMileage, maxMileage]);
    const [priceValues, setPriceValues] = useState([minPrice, maxPrice]);
    const [paymentValues, setPaymentValues] = useState([minPayment, maxPayment]);
    const [dataLoaded, setDataLoaded] = useState(true);
    const [studioRoute, setStudioRoute] = useState(false);
    const [featureItemVisible, setFeatureItemVisible] = useState(-1);
    const [showComingSoonCars, setShowComingSoonCars] = useState(appConfig.SHOW_COMING_SOON || true);

    useEffect(() => {
        const handleRouteChange = () => {
            const { pathname } = window.location;

            // Check if the current route is registered
            if (pathname.includes("/cars/")) {
                if (!pathname.includes("studio")) {
                    setRegisteredRoute(true);
                }
            } else {
                if (!pathname.includes("studio")) {
                    setRegisteredRoute(routes.includes(pathname));
                }
            }
            if (pathname.includes("studio")) {
                setStudioRoute(true);
            }
        };

        handleRouteChange(); // Initial call to handle current pathname

        window.addEventListener("popstate", handleRouteChange);

        return () => {
            window.removeEventListener("popstate", handleRouteChange);
        };
    }, [routes]);

    const [qoreAIActivated, setQoreAIActivated] = useState(false);
    const openQoreAI = () => {
        if (window.QoreAI) {
            window.QoreAI.openChat();
        }
    };

    const loadQoreAI = () => {
        return null;
        // if (!qoreAIActivated) {
        //     const script = document.createElement("script");
        //     script.src = "https://app.qoreai.com/cs/qoreai.js";
        //     script.setAttribute("data-integrator-id", "de1fbc94bb784bdc888727e5f8729047");
        //     script.id = "_kzsc";
        //     document.body.appendChild(script);
        //     script.onload = () => {
        //         setQoreAIActivated(true);
        //         const interval = setInterval(() => {
        //             const qoreaiElement = document.querySelector('img[src="https://app.qoreai.com/chat_icon.svg"]');
        //             if (qoreaiElement) {
        //                 qoreaiElement.style.display = "none";
        //                 clearInterval(interval);
        //             }
        //         }, 60);
        //     };
        // }
    };

    return (
        <AppContext.Provider
            value={{
                openQoreAI,
                loadQoreAI,
                setQoreAIActivated,
                qoreAIActivated,
                registeredRoute,
                isHamburgerMenuOpen,
                setHamburgerMenuOpen,
                searchBarText,
                setSearchBarText,
                carListing,
                setCarListing,
                linkAllCars,
                setLinkAllCars,
                selectedBodyStyles,
                setSelectedBodyStyles,
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
                filterApplied,
                setFilterApplied,
                bodyStyleFilters,
                setBodyStyleFilters,
                sortDropDown,
                setSortDropDown,
                setOrderAscending,
                orderAscending,
                minYear,
                setMinYear,
                maxYear,
                setMaxYear,
                minMileage,
                setMinMileage,
                maxMileage,
                setMaxMileage,
                minPrice,
                setMinPrice,
                maxPrice,
                setMaxPrice,
                minPayment,
                setMinPayment,
                maxPayment,
                setMaxPayment,
                dataLoaded,
                setDataLoaded,
                selectedCylinder,
                setSelectedCylinder,
                studioRoute,
                featureItemVisible,
                setFeatureItemVisible,
                showComingSoonCars,
                setShowComingSoonCars
                // openModal,
                // setOpenModal,
            }}>
            {/* {shouldRenderComponent ? <Popup /> : null} */}
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
