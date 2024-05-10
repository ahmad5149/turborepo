"use client";
import { useState, useEffect } from "react";
import AppContext from "./AppContext";
import { sortings } from "@/utils/SortingUtil";

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
    const [showComingSoonCars, setShowComingSoonCars] = useState(true);
    const [notificationId, setNotificationId] = useState(true);
    const [widgets, setWidgets] = useState([]);

    const [widgetDetailModal, setWidgetDetailModal] = useState({
        show: false,
        description: "",
        title: ""
    });
    const [showSpecificWidgetSettings, setShowSpecificWidgetSettings] = useState({
        show: false,
        label: ""
    });
    const [showSpecificWidgetDetails, setShowSpecificWidgetDetails] = useState({
        show: false,
        label: "",
        upDown: ""
    });
    const [responseDealerData, setResponseDealerData] = useState({
        // startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        // endDate: new Date(new Date().setHours(0, 0, 0, 0)),
        startDate: "",
        endDate: "",
        loading: false,
        // count: {
        //     total: 0,
        //     accepted: 0,
        //     declined: 0
        // },
        count: {
            total_records: 0,
            total_accepted: 0,
            total_declined: 0,
            total_expired: 0,
            total_accepted_type_purchase: 0,
            total_declined_type_purchase: 0,
            total_expired_type_purchase: 0
        },
        dealer: {},
        type: {}
    });

    const [responseNotificationsCountData, setResponseNotificationsCountData] = useState({
        startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        endDate: new Date(new Date().setHours(0, 0, 0, 0)),
        loading: false,
        count: {
            total: 0,
            purchase: 0,
            availalbe: 0,
            hold: 0
        },
        dealer: {}
    });

    const [TotalCarsSummary, setTotalCarsSummary] = useState({
        TotalCarsCreated: [0, 0, 0, 0, 0, 0, 0],
        TotalCarsDeleted: [0, 0, 0, 0, 0, 0, 0],
        loading: false,
        selectedOptionIndex: 0,
        // chartCategories: ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"],
        chartCategories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        options: ["last7DaysCars", "last3DaysCars", "last1DayCars"]
    });

    const [responseDealerBar, setResponseDealerBar] = useState({
        startDate: new Date(),
        endDate: new Date(),
        loading: false,
        data: {
            categories: [],
            series: [
                { name: "accepted", data: [] },
                { name: "declined", data: [] }
            ]
        },
        total: 0,
        dealer: {},
        type: {}
    });

    const [responseDealerTable, setResponseDealerTable] = useState({
        startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        endDate: new Date(new Date().setHours(0, 0, 0, 0)),
        loading: false,
        data: [],
        total: 0,
        dealer: {},
        type: {}
    });

    const [inventoryOperationTable, setInventoryOperationTable] = useState({
        loading: false,
        data: [],
        total: 0,
        dealer: {}
    });

    const [hiddenCarData, setHiddenCarData] = useState({
        startDate: "",
        endDate: "",
        loading: false,
        dataInitialized: false,
        count: {
            active: 0,
            hidden: 0,
            totalCars: 0
        }
    });
    const [_24HourHoldData, set_24HourHoldData] = useState({
        startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        endDate: new Date(new Date().setHours(0, 0, 0, 0)),
        loading: false,
        data: [],
        total: 0,
        dealer: {}
    });
    // Get the current date
    const currentDate = new Date();
    // Subtract 7 days from the current date
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    // Set the time to the start of the day (midnight)
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const [priceChangeData, setPriceChangeData] = useState({
        startDate: sevenDaysAgo,
        endDate: new Date(new Date().setHours(0, 0, 0, 0)),
        lastChangedDate: { startDate: sevenDaysAgo, endDate: new Date(new Date().setHours(0, 0, 0, 0)) },
        loading: false,
        upDown: "down",
        count: {
            increased: 0,
            decreased: 0
        }
    });

    const [averageResponseTimeData, setAverageResponseTimeData] = useState({
        startDate: "", //new Date(new Date().setHours(0, 0, 0, 0)),
        endDate: "", //new Date(new Date().setHours(0, 0, 0, 0)),
        loading: false,
        dataInitialized: false,
        count: {
            total: 0,
            available: 0,
            hourhold24: 0,
            purchase: 0,
            thisCar: 0
        },
        dealer: {},
        type: {}
    });

    useEffect(() => {
        const storedWidgets = localStorage.getItem("widgetSettings");
        const fetchWidgets = JSON.parse(storedWidgets)?.widgets;

        setWidgets(fetchWidgets);
    }, []);

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
                setShowComingSoonCars,
                setNotificationId,
                notificationId,
                setWidgets,
                widgets,
                setWidgetDetailModal,
                widgetDetailModal,
                setShowSpecificWidgetSettings,
                showSpecificWidgetSettings,
                setResponseDealerData,
                responseDealerData,
                responseDealerBar,
                setResponseDealerBar,
                hiddenCarData,
                setHiddenCarData,
                responseNotificationsCountData,
                setResponseNotificationsCountData,
                setTotalCarsSummary,
                TotalCarsSummary,
                averageResponseTimeData,
                setAverageResponseTimeData,
                responseDealerTable,
                setResponseDealerTable,
                priceChangeData,
                setPriceChangeData,
                showSpecificWidgetDetails,
                setShowSpecificWidgetDetails,
                _24HourHoldData,
                set_24HourHoldData,
                // setDashboardLoader,
                // dashboardLoader,
                inventoryOperationTable,
                setInventoryOperationTable
            }}>
            {/* {shouldRenderComponent ? <Popup /> : null} */}
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
