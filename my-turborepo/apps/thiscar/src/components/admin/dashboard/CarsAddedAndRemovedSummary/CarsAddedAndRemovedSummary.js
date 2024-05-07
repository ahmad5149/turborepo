"use client";
import React, { Suspense, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getCreatedAtCars, getDeletedAtCars } from "../../../../services/inventoryService";
import "../../../../contents/scss/spinner.scss";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import { fetchWidgetSettings } from "../Utilities";
import AppContext from "../../../../StateManagement/AppContext";
// import Dropdown from "../NotificationResponse/partials/CarsAddedAndRemoved";
import { WidgetSettingsPopup } from "../WidgetSettingsPopup";
import Dropdown from "./partials/CarsAddedAndRemoved";
import { useAuth } from "../../../../components/auth";

// function CarsAddedAndRemovedSummary({ loading, setLoading, createdAtCarsTotalCount, deletedTimeCarsTotalCount }) {
function CarsAddedAndRemovedSummary() {
    // if (createdAtCarsTotalCount?.length === 0 || !createdAtCarsTotalCount) {
    //     createdAtCarsTotalCount = [0, 0, 0, 0, 0, 0, 0];
    // }
    // if (deletedTimeCarsTotalCount?.length === 0 || !deletedTimeCarsTotalCount) {
    //     deletedTimeCarsTotalCount = [0, 0, 0, 0, 0, 0, 0];
    // }

    const chartRef = useRef(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const options = ["last7DaysCars", "last3DaysCars", "last1DayCars"];
    const chartInstanceRef = useRef(null);
    const [chartCategories, setChartCategories] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]); // Default categories for last 7 days
    let [createdAtCarsCount, setCreatedAtCarsCount] = useState([0, 0, 0, 0, 0, 0, 0]);
    let [deletedTimeCarsCount, setDeletedTimeCarsCount] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loadingDropdown, setLoadingDropdown] = useState(false); // State to track loading status for dropdown
    const [serviceCalled, setServiceCalled] = useState(false); // Flag to track whether service has been called
    const [TotalCarsCreated, setTotalCarsCreated] = useState(); //[0, 0, 0, 0, 0, 0, 0]);
    const [TotalCarsDeleted, setTotalCarsDeleted] = useState(); //[0, 0, 0, 0, 0, 0, 0]);
    const [loading, setLoading] = useState(true);
    const currentUser = useAuth();
    const [currentWidget, setCurrentWidget] = useState({
        title: "Cars Summary -",
        description: "Cars Added and Removed"
    });
    const { setWidgetDetailModal } = useContext(AppContext);

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = usePathname();
    const routerNav = useRouter();

    const fetchLatestData = async () => {
        setLoading(true);
        var now = new Date();
        try {
            // let createdAtCarsData = await getCreatedAtCars(7);
            // let deletedTimeCarsData = await getDeletedAtCars(7);
            const response = await fetch(`/api/car-summary`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${currentUser?.getIdToken()}`
                },
                body: ""
            });
            if (!response.ok) {
                toast.error(`HTTP error! Status: ${response.status}`);
            }

            const { createdAtCarsData, deletedTimeCarsData } = await response.json();

            // Update state only after both asynchronous calls have completed successfully
            setCreatedAtCarsCount(createdAtCarsData);
            setTotalCarsCreated(createdAtCarsData);

            setDeletedTimeCarsCount(deletedTimeCarsData); // Update deleted count
            setTotalCarsDeleted(deletedTimeCarsData);
        } catch (error) {
            // Handle errors
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestData();
    }, []);

    useEffect(() => {
        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find(
            (widget) =>
                widget.label === "CarsAddedAndRemovedSummaryWrapper" || widget.label === "CarsAddedAndRemovedSummary"
        );

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));
        // setTotalCarsSummary((prevTotalCarsSummary) => ({
        //     ...prevTotalCarsSummary,
        //     TotalCarsCreated: createdAtCarsTotalCount,
        //     TotalCarsDeleted: createdAtCarsTotalCount
        //     //     selectedOptionIndex: newSelectedOptionIndex,
        //     //    chartCategories: newChartCategories
        // }));
    }, []);

    useEffect(() => {
        //        setCreatedAtCarsCount(createdAtCarsCount); // Set initial created cars count
        //       setDeletedTimeCarsCount(deletedTimeCarsCount); // Set initial deleted cars count
        setLoading(true);
        const defaultEndDate = new Date(); // Current date
        const defaultStartDate = new Date(defaultEndDate);
        defaultStartDate.setDate(defaultEndDate.getDate() - 6); // Set start date to 7 days ago
        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);

        // Initialize chart categories starting from the last day and continuing backward
        let categories = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(defaultEndDate); // Start from defaultEndDate
            date.setDate(date.getDate() - i); // Go back by i days
            return date.toLocaleDateString("en-US", { weekday: "short" }); // Get the day of the week
        });
        setChartCategories(categories);
        categories = categories.reverse();
    }, []);

    // useEffect(() => {
    //     if (!loading && !serviceCalled) {
    //         setServiceCalled(true);
    //         renderChart(chartCategories);
    //     }
    // }, [loading, serviceCalled]);

    useEffect(() => {
        if (TotalCarsCreated && TotalCarsCreated?.length > 0 && TotalCarsDeleted && TotalCarsDeleted?.length > 0) {
            //  setLoading(false); // Set loading to false when data is available
        }
        if (TotalCarsCreated && TotalCarsDeleted) renderChart(chartCategories);
    }, [chartCategories, createdAtCarsCount, deletedTimeCarsCount]);

    const renderChart = async (categories) => {
        const ApexCharts = (await import("apexcharts")).default;

        const chartElement = chartRef.current;
        const height = 280;
        const r = getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-500");
        const s = getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-200");
        const o = getComputedStyle(document.documentElement).getPropertyValue("--bs-primary");
        const i = getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300");

        const optionsConfig = {
            series: [
                {
                    data: createdAtCarsCount,
                    name: "Cars  Added",
                    margin: { left: 5, right: 5 }
                },
                {
                    data: deletedTimeCarsCount,
                    name: "Cars Removed"
                }
            ],
            chart: {
                fontFamily: "inherit",
                type: "bar",
                // height: height,
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: ["50%"],
                    borderRadius: 4
                }
            },
            legend: { show: false },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ["transparent"] },
            xaxis: {
                categories: categories,
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: {
                    show: true,
                    style: { colors: r, fontSize: "14px", paddingBottom: "10px" }
                }
            },
            yaxis: {
                labels: {
                    show: true,
                    style: { colors: r, fontSize: "12px", paddingRight: "10px" },
                    offsetX: -7
                }
            },
            fill: { type: "solid" },
            states: {
                normal: { filter: { type: "none", value: 0 } },
                hover: { filter: { type: "none", value: 0 } },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: { type: "none", value: 0 }
                }
            },
            tooltip: {
                style: { fontSize: "12px", margin: "3px" },
                y: {
                    formatter: function (val) {
                        return val;
                    }
                }
            },
            colors: [o, i],
            grid: {
                borderColor: s,
                strokeDashArray: 4,
                yaxis: { lines: { show: true } },
                padding: { left: -10, right: 5 }
            }
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new ApexCharts(chartElement, optionsConfig);
        chartInstanceRef.current?.render();
    };
    const handleDropdownChange = async (event) => {
        setLoadingDropdown(true);
        try {
            let newValue = event.target.value.trim().toLowerCase();
            setSelectedOptionIndex(options.indexOf(newValue));

            let noOfDays = getNumberOfDays(newValue);

            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - noOfDays + 1);
            // if (noOfDays === 1) startDate.setDate(endDate.getDate() - noOfDays);

            setStartDate(startDate);
            setEndDate(endDate);

            let createdAtData = [...TotalCarsCreated]; // Make a copy to avoid mutating state directly
            let deletedTimeData = [...TotalCarsDeleted]; // Make a copy to avoid mutating state directly

            if (noOfDays !== 7) {
                const startIndex = 7 - noOfDays;
                createdAtData = createdAtData.slice(startIndex);
                deletedTimeData = deletedTimeData.slice(startIndex);
            }

            setCreatedAtCarsCount(createdAtData);
            setDeletedTimeCarsCount(deletedTimeData);

            params.set("noOfDays", noOfDays);
            routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });

            let categories = Array.from({ length: noOfDays ?? 7 }, (_, i) => {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                return date.toLocaleDateString("en-US", { weekday: "short" });
            });
            //  categories = categories.reverse();

            setChartCategories(categories);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingDropdown(false);
        }
    };

    const getNumberOfDays = (option) => {
        const daysMapping = {
            last7dayscars: 7,
            last3dayscars: 3,
            last1daycars: 1
        };
        return daysMapping[option] || 7;
    };
    const openModal = async () => {
        const settings = await fetchWidgetSettings();

        if (settings) {
            const { description, title } = settings.widgets.find((widget) => {
                return widget.label === "CarsAddedAndRemovedSummaryWrapper";
            }) || { description: "", title: "" }; // Set default values if widget is not found

            setWidgetDetailModal((prevState) => ({
                ...prevState,
                show: true,
                description,
                title
            }));
            document.body.style.overflow = "hidden";
        } else {
            console.log("Widget settings not found");
        }
    };

    // const showFilters = () => {
    //     console.log("called");
    //     setShowSpecificWidgetSettings((prevState) => ({
    //         ...prevState,
    //         show: true,
    //         label: "CarsAddedAndRemovedSummaryWrapper"
    //     }));

    //     document.body.style.overflow = "hidden";
    // };

    return (
        <div className="card h-100 w-100">
            <div className="card-header pt-7 align-items-center">
                <h3 className="card-title align-items-start flex-column">
                    <span className="d-flex gap-2 card-label fw-bold text-gray-800">
                        {currentWidget.title}
                        <i
                            onClick={openModal}
                            className="ki-solid ki-information fs-1"></i>
                    </span>

                    {/* <span className="text-gray-400 mt-1 fw-semibold fs-6">Total: 0 Notifications</span> */}
                    <span className="text-gray-400 mt-1 fw-semibold fs-6">
                        {startDate?.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                        })}{" "}
                        -{" "}
                        {endDate?.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                        })}
                        , {endDate?.getFullYear()}
                    </span>
                </h3>
                <div className="icon-container">
                    {/* <i
                        //   onClick={showFilters}
                        className="ki-outline ki-gear fs-2x pe-2"></i> */}
                    {/* {!loading && <LoadingSpinner />} */}
                    <i
                        onClick={() => !loading && fetchLatestData()}
                        className={`ki-solid ki-arrows-circle fs-1 ${loading ? "rotate" : ""}`}>
                        {/* className={`ki-solid ki-arrows-circle fs-1 ${"rotate" ? "rotate" : ""}`} */}
                    </i>
                </div>
            </div>
            <div></div>
            <div className="row g-xl-8">
                {/* <div className=""> */}{" "}
                {loading ? (
                    <div
                        className={`${loading ? "align-loading admin-loading" : ""} card-body `}
                        style={{ marginTop: "46px" }}>
                        {/* // className="admin-loading" // style={{ marginBottom: "0px" }}>  */}
                        <LoadingSpinner />{" "}
                    </div>
                ) : (
                    <>
                        <div className="w-100 card-body p-1 d-flex justify-content-between flex-column overflow-hidden">
                            <div className="position-relative flex-grow-1">
                                <div className="d-flex flex-stack flex-grow-1 px-9 pt-9 pb-3">
                                    <div className="d-flex flex-column text-start">
                                        {/* <Dropdown
                                            options={options}
                                            selectedOptionIndex={selectedOptionIndex}
                                            onChange={handleDropdownChange}
                                        /> */}
                                        {/* <span className="fw-bolder text-gray-800 fs-2">Cars Summary</span> */}
                                        {/* <h3 className="d-flex card-title align-items-start flex-column">
                                            <span className="card-label fw-bold text-gray-800">Cars Summary</span>
                                        </h3> */}
                                        {/* <span className="text-gray-400 fw-semibold fs-6">
                                            <span className="text-gray-400 fw-semibold fs-6">
                                                {startDate?.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })}{" "}
                                                -{" "}
                                                {endDate?.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric"
                                                })}
                                                , {endDate?.getFullYear()}
                                            </span>
                                        </span> */}
                                    </div>
                                    <div className="d-flex flex-column text-end">
                                        <select
                                            className="form-select"
                                            value={options[selectedOptionIndex]}
                                            onChange={handleDropdownChange}>
                                            {options.map((option, index) => (
                                                <option
                                                    key={index}
                                                    value={option}>
                                                    {option === "last7DaysCars"
                                                        ? "Last 7 days"
                                                        : option === "last3DaysCars"
                                                        ? "Last 3 days"
                                                        : "Last 1 day"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="d-inline-flex justify-content-center text-center h-100">
                                {/* {loadingDropdown && (
                                <div className="admin-loading">
                                    <LoadingSpinner />
                                    </div>
                                )} */}
                            </div>
                            <div
                                id="kt_charts_widget_2_chart"
                                className="mb-n10"
                                ref={chartRef}></div>
                        </div>
                    </>
                )}
                {/* </div> */}
            </div>
        </div>
    );
}

export default CarsAddedAndRemovedSummary;
