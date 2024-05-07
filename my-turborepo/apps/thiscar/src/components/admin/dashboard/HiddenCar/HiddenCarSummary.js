"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { fetchWidgetSettings } from "../Utilities";
import AppContext from "@/StateManagement/AppContext";
import "../../../../contents/scss/admin/hiddenCarSummary.scss";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import { GetFilteredHiddenCarsCount, GetTotalCarsCount, GetVehicleSummary } from "../../../../services/carService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function HiddenCarSummary() {
    const { setShowSpecificWidgetSettings, hiddenCarData, setHiddenCarData } = useContext(AppContext);
    const [rotate, setRotate] = useState(false);
    const { count, loading, startDate, endDate } = hiddenCarData;
    const { setWidgetDetailModal } = useContext(AppContext);
    const [currentWidget, setCurrentWidget] = useState({
        title: "",
        description: ""
    });
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const initChart = (chartData) => {
        const element = document.getElementById("kt_charts_widget_5");
        const chartWrapperWidth = element.offsetParent.offsetWidth;

        import("apexcharts").then((ApexCharts) => {
            const borderColor = getComputedStyle(document.documentElement).getPropertyValue("--bs-border-dashed-color");

            const options = {
                series: [
                    {
                        data: [chartData?.active + chartData?.hidden, chartData?.active, chartData?.hidden],
                        show: false
                    }
                ],
                chart: {
                    type: "bar",
                    height: 200,
                    width: chartWrapperWidth - 75, // Set the width dynamically
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true,
                        distributed: true,
                        barHeight: 20
                    }
                },
                dataLabels: {
                    enabled: true
                },
                legend: {
                    show: true
                },
                colors: ["#3E97FF", "#F1416C", "#50CD89"],
                xaxis: {
                    categories: ["Total", "Active", "Hidden"],
                    labels: {
                        show: false, // Hide horizontal number labels
                        formatter: function (val) {
                            return val;
                        },
                        style: {
                            colors: getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-400"),
                            fontSize: "14px",
                            fontWeight: "600",
                            align: "left"
                        }
                    },
                    axisBorder: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-800"),
                            fontSize: "14px",
                            fontWeight: "600"
                        },
                        offsetY: 2,
                        align: "left"
                    }
                },
                grid: {
                    borderColor: borderColor,
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                    yaxis: {
                        lines: {
                            show: false
                        }
                    },
                    strokeDashArray: 4
                }
            };

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            chartInstanceRef.current = new ApexCharts.default(element, options);
            chartInstanceRef.current.render();

            // Dynamically adjust width on window resize
            window.addEventListener("resize", async () => {
                const newChartWrapperWidth = element?.offsetParent?.offsetWidth;
                if (chartInstanceRef && chartInstanceRef?.current && newChartWrapperWidth) {
                    await chartInstanceRef?.current?.updateOptions({
                        chart: {
                            width: newChartWrapperWidth - 80
                        }
                    });
                }
            });
        });
    };

    // useEffect(() => {
    //     if (
    //         chartInstanceRef.current &&
    //         hiddenCarData &&
    //         hiddenCarData.dataInitialized &&
    //         document.getElementById("kt_charts_widget_5")
    //     ) {
    //         initChart(hiddenCarData.count);
    //     }
    // }, [hiddenCarData.count]);
    useEffect(() => {
        let checkElementInterval;
        const delayedChartInitialization = () => {
            const maxAttempts = 10; // Maximum number of attempts to check for element existence
            let attempts = 0;

            checkElementInterval = setInterval(() => {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(checkElementInterval);
                    console.error("Chart element not found.");
                    return;
                }
                if (
                    chartInstanceRef.current &&
                    hiddenCarData &&
                    hiddenCarData.dataInitialized &&
                    document.getElementById("kt_charts_widget_5")
                ) {
                    clearInterval(checkElementInterval);
                    initChart(hiddenCarData.count);
                }
            }, 500); // Check every 500 milliseconds
        };

        delayedChartInitialization();

        return () => {
            clearInterval(checkElementInterval); // Clear interval to avoid memory leaks
        };
    }, [hiddenCarData.count]);

    useEffect(() => {
        // renderChart();
        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "HiddenCarSummary");

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));

        (async () => {
            setHiddenCarData((prevState) => ({
                ...prevState,
                loading: true
            }));
            let counts;
            if (hiddenCarData.startDate && hiddenCarData.endDate) {
                let utcStartInSeconds = "";
                let utcEndInSeconds = "";
                var selectedStartDate = new Date(hiddenCarData.startDate);
                selectedStartDate.setHours(0, 0, 0, 0);

                var selectedEndDate = new Date(hiddenCarData.endDate);
                selectedEndDate.setHours(23, 59, 59, 999);

                utcStartInSeconds = Math.floor(selectedStartDate.getTime() / 1000);
                utcEndInSeconds = Math.floor(selectedEndDate.getTime() / 1000);

                counts = await GetVehicleSummary(utcStartInSeconds, utcEndInSeconds);
            } else {
                counts = await GetVehicleSummary("", "");
            }
            setHiddenCarData((prevState) => ({
                ...prevState,
                count: {
                    ...counts
                },
                loading: false
            }));

            let chartElement = null;
            const maxAttempts = 10; // Maximum number of attempts to check for element existence
            let attempts = 0;

            const checkElementInterval = setInterval(() => {
                chartElement = document.getElementById("kt_charts_widget_5");
                attempts++;

                if (chartElement || attempts >= maxAttempts) {
                    clearInterval(checkElementInterval);

                    if (counts && chartElement) {
                        initChart(counts);
                    }
                }
            }, 500); // Check every 500 milliseconds
            // if (counts && document.getElementById("kt_charts_widget_5")) {
            //     initChart(counts);
            // }
        })();

        setShowSpecificWidgetSettings((prevState) => ({
            ...prevState,
            show: false,
            label: ""
        }));
    }, []);

    const handleClick = async () => {
        // setLoading(true);
        let utcStartInSeconds = "";
        let utcEndInSeconds = "";
        setHiddenCarData((prevState) => ({
            ...prevState,
            loading: false
        }));
        setRotate(true);
        const { startDate, endDate } = hiddenCarData;
        if (startDate && endDate) {
            var selectedStartDate = new Date(startDate);
            selectedStartDate.setHours(0, 0, 0, 0);

            var selectedEndDate = new Date(endDate);
            selectedEndDate.setHours(23, 59, 59, 999);

            utcStartInSeconds = Math.floor(selectedStartDate.getTime() / 1000);
            utcEndInSeconds = Math.floor(selectedEndDate.getTime() / 1000);
        }
        const res = await GetVehicleSummary(utcStartInSeconds, utcEndInSeconds);
        setHiddenCarData((prevState) => ({
            ...prevState,
            count: {
                ...res
            },
            loading: false
        }));
        setRotate(false);
    };

    const openModal = async () => {
        const settings = await fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "HiddenCarSummary");

        setWidgetDetailModal((prevState) => ({
            ...prevState,
            show: true,
            description,
            title
        }));
        document.body.style.overflow = "hidden";
    };

    const showFilters = () => {
        setShowSpecificWidgetSettings((prevState) => ({
            ...prevState,
            show: true,
            label: "HiddenCarSummary",
            title: "Vehicle Summary Settings"
        }));
        document.body.style.overflow = "hidden";
    };

    return (
        <>
            <div className="card h-100">
                <div className="card-header pt-7 align-items-center">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="d-flex gap-2 card-label fw-bold text-gray-800">
                            {currentWidget.title}
                            <i
                                onClick={openModal}
                                className="ki-solid ki-information fs-1"></i>
                        </span>

                        <span className="text-gray-400 mt-1 fw-semibold fs-6">
                            Total: {loading ? 0 : hiddenCarData.count.totalCars} Cars
                        </span>
                    </h3>
                    <div className="icon-container">
                        <i
                            onClick={showFilters}
                            className="ki-outline ki-gear fs-2x pe-2"></i>
                        <i
                            onClick={() => !loading && handleClick()}
                            className={`ki-solid ki-arrows-circle fs-1 ${rotate ? "rotate" : ""}`}></i>
                    </div>
                </div>
                <div></div>
                <div
                    className={`${loading ? "align-loading" : ""} card-body `}
                    style={{ paddingBottom: "0" }}>
                    {loading ? (
                        <div>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div
                            className=""
                            ref={chartRef}
                            style={{ paddingBottom: "40px" }}>
                            <div
                                id="kt_charts_widget_5"
                                className="min-h-auto"></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default HiddenCarSummary;
