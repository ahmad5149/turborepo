"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { fetchWidgetSettings } from "../Utilities";
import AppContext from "@/StateManagement/AppContext";
import "../../../../contents/scss/admin/hiddenCarSummary.scss";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "react-datepicker/dist/react-datepicker.css";
import { GetAverageResponseTimeByDealer } from "../../../../services/notificationsService";
import Select from "react-select";

import { searchDealer } from "@/services/dealerService";

function AverageResponseTimeForHoldAndPurchase({ dealerOptions }) {
    const { setShowSpecificWidgetSettings, averageResponseTimeData, setAverageResponseTimeData } =
        useContext(AppContext);
    const [rotate, setRotate] = useState(false);
    const { count, loading, startDate, endDate, dealer, type } = averageResponseTimeData;
    const { setWidgetDetailModal } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    const [currentWidget, setCurrentWidget] = useState({
        title: "",
        description: ""
    });
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [dealers, setDealers] = useState(dealerOptions);
    const [selectedDealer, setSelectedDealer] = useState(dealer?.value ? [dealer] : []);

    function parseTimeString(timeString) {
        // Split the string by space to separate hours, minutes, and seconds
        const [hoursStr, minutesStr, secondsStr] = timeString.split(" ");

        // Extract numerical values from the strings
        const hours = parseInt(hoursStr.replace("h", ""), 10); // Remove 'h' and parse as integer
        const minutes = parseInt(minutesStr.replace("m", ""), 10); // Remove 'm' and parse as integer
        const seconds = parseInt(secondsStr.replace("s", ""), 10); // Remove 's' and parse as integer
        return { hours, minutes, seconds };
    }
    const initChart = async (chartData) => {
        // const availableTime = parseTimeString(chartData.available);
        // const hourhold24Time = parseTimeString(chartData.hourhold24);
        // const purchaseTime = parseTimeString(chartData.purchase);
        // const thisCarTime = parseTimeString(chartData.thisCar);
        const element = document.getElementById("kt_charts_widget_4");
        if (!element) {
            console.error("Element with ID 'kt_charts_widget_4' not found.");
            return;
        }

        const chartWrapperWidth = element.offsetParent.offsetWidth;
        const chartWrapperHeight = element.offsetParent.offsetHeight;

        try {
            const ApexCharts = await import("apexcharts");

            const borderColor = getComputedStyle(document.documentElement).getPropertyValue("--bs-border-dashed-color");

            const options = {
                series: [
                    {
                        // data: [
                        //     availableTime.hours + availableTime.minutes + availableTime.seconds,
                        //     hourhold24Time.hours + hourhold24Time.minutes + hourhold24Time.seconds,
                        //     purchaseTime.hours + purchaseTime.minutes + purchaseTime.seconds,
                        //     thisCarTime.hours + purchaseTime.minutes + purchaseTime.seconds
                        // ],
                        show: false,
                        data: [chartData?.available, chartData?.hourhold24, chartData?.purchase, chartData?.thisCar]
                    }
                ],
                chart: {
                    type: "line",
                    height: 240, //300, //chartWrapperHeight - 240, // Set dynamically
                    width: chartWrapperWidth - 80,
                    toolbar: {
                        show: false //true
                    }
                },
                stroke: {
                    width: 4, // Specifies the width of the line
                    curve: "smooth" // Specifies the curve of the line
                },
                markers: {
                    size: 6, // Specifies the size of data points
                    colors: ["#3E97FF"], // Specifies the color of data points
                    hover: {
                        size: 10 // Specifies the size of data points on hover
                    }
                },
                fill: {
                    colors: ["#3E97FF", "#REREIO"], // Specifies the color to fill under the line
                    type: "solid" // Specifies the type of fill (solid, gradient, etc.)
                },
                // tooltip: {
                //     enabled: true, // Enable tooltip
                //     followCursor: true,
                //     //   enabledOnSeries: undefined, // Enable tooltip on specific series, if needed
                //     shared: false, // Disable shared tooltip, show only one tooltip at a time
                //     legend: {
                //         show: false
                //     }
                // },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: false, //true,
                        distributed: true,
                        barHeight: 50 //20
                    }
                },
                dataLabels: {
                    enabled: true
                    // position: "top",
                    // offsetX: 0,
                    // offsetY: 30, // Adjust this value to position the labels properly
                    // style: {
                    //     colors: ["#333"], // Color of the data labels
                    //     fontSize: "12px", // Font size of the data labels
                    //     fontWeight: "bold", // Font weight of the data labels
                    //     offsetX: 0,
                    //     offsetY: -80
                    // }
                },

                // legend: {
                //     show: true
                // },
                legend: {
                    show: false //true
                    // position: "End", // Change legend position to top
                    // markers: {
                    //     width: 12,
                    //     height: 12,
                    //     radius: 3
                    // },
                    // style: {
                    // colors: ["#333"],
                    // fontSize: "17px"
                    // }
                },
                //   colors: ["#3E97FF", "#F1416C", "#50CD89", "#FFCC00"],
                xaxis: {
                    categories: ["Avail.", "24Hour", "Purchase", "24hr-Purc."],
                    labels: {
                        show: true, //false, // Hide horizontal number labels
                        formatter: function (val) {
                            return val;
                        },
                        style: {
                            colors: getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-400"),
                            fontSize: "13px",
                            fontWeight: "600",
                            align: "left",
                            marginBottom: "40px"
                        }
                    },
                    axisBorder: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        //labels set to false
                        show: false,
                        style: {
                            colors: getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-800"),
                            fontSize: "17px",
                            fontWeight: "600"
                        }
                        // offsetY: -10, //2,
                        //  align: "right" //"left"
                    }
                },
                grid: {
                    borderColor: borderColor,
                    xaxis: {
                        lines: {
                            show: false //true
                        }
                    },
                    yaxis: {
                        lines: {
                            show: false
                        }
                    }
                    // strokeDashArray: 4
                }
            };
            // const maxHoldPurc = Math.max(chartData.thisCar); // Find the maximum value of "Hold-Purc."
            // const scaleFactor = chartData.thisCar / maxHoldPurc; // Calculate the scaling factor

            // // Adjust the height of the bars for "Avail.", "24hour", and "Purchase" categories
            // options.plotOptions.bar.barHeight *= scaleFactor;
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            if (element) {
                chartInstanceRef.current = new ApexCharts.default(element, options);
                await chartInstanceRef.current.render();
                // chartInstanceRef?.current?.render();
            }

            // Dynamically adjust width on window resize
            window.addEventListener("resize", async () => {
                const newChartWrapperWidth = element?.offsetParent?.offsetWidth;
                const newChartWrapperHeight = element?.offsetParent?.offsetHeight;
                if (chartInstanceRef.current) {
                    try {
                        await chartInstanceRef?.current?.updateOptions({
                            chart: {
                                height: 240, //300, //newChartWrapperHeight - 240,
                                width: newChartWrapperWidth - 120
                            }
                        });
                    } catch (error) {
                        console.error("Error updating chart options:", error);
                    }
                }
            });
        } catch (error) {
            console.error("Error loading ApexCharts:", error);
        }
    };

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
                    averageResponseTimeData &&
                    averageResponseTimeData.dataInitialized &&
                    document.getElementById("kt_charts_widget_4")
                ) {
                    clearInterval(checkElementInterval);
                    initChart(averageResponseTimeData.count);
                }
            }, 500); // Check every 500 milliseconds
        };

        delayedChartInitialization();

        return () => {
            clearInterval(checkElementInterval); // Clear interval to avoid memory leaks
        };
    }, [averageResponseTimeData.count]);

    useEffect(() => {
        // renderChart();

        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find(
            (widget) => widget.label === "AverageResponseTimeHoldPurchase"
        );

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));

        (async () => {
            setAverageResponseTimeData((prevState) => ({
                ...prevState,
                loading: true
            }));
            let avgCounts;
            let utcStartInSeconds = "";
            let utcEndInSeconds = "";
            if ((averageResponseTimeData.startDate && averageResponseTimeData.endDate) || (dealer.value && dealer)) {
                var selectedStartDate = new Date(averageResponseTimeData.startDate);
                selectedStartDate.setHours(0, 0, 0, 0);

                var selectedEndDate = new Date(averageResponseTimeData.endDate);
                selectedEndDate.setHours(23, 59, 59, 999);

                utcStartInSeconds = Math.floor(selectedStartDate.getTime() / 1000);
                utcEndInSeconds = Math.floor(selectedEndDate.getTime() / 1000);
                avgCounts = await GetAverageResponseTimeByDealer({
                    startDate: utcStartInSeconds,
                    endDate: utcEndInSeconds,
                    dealer: dealer || "" //dealer != null || dealer === undefined ? dealer : ""
                });
            } else {
                avgCounts = await GetAverageResponseTimeByDealer({
                    startDate: utcStartInSeconds != null ? utcStartInSeconds : "",
                    endDate: utcEndInSeconds != null ? utcEndInSeconds : "",
                    dealer: dealer != null ? dealer : ""
                });
            }
            setAverageResponseTimeData((prevState) => ({
                ...prevState,
                count: {
                    ...avgCounts
                },
                // count: {
                //     total: 0,
                //     available: avgCounts.available || "N/A",
                //     hourhold24: avgCounts.hourhold24 || "N/A",
                //     purchase: avgCounts.purchase || "N/A",
                //     thisCar: avgCounts.thisCar || "N/A"
                // },

                loading: false,
                dataInitialized: true
            }));

            let chartElement = null;
            const maxAttempts = 10; // Maximum number of attempts to check for element existence
            let attempts = 0;

            const checkElementInterval = setInterval(() => {
                chartElement = document.getElementById("kt_charts_widget_4");
                attempts++;

                if (chartElement || attempts >= maxAttempts) {
                    clearInterval(checkElementInterval);

                    if (avgCounts && chartElement) {
                        initChart(avgCounts);
                    }
                }
            }, 500); // Check every 500 milliseconds
            if (avgCounts && document.getElementById("kt_charts_widget_5")) {
                initChart(avgCounts);
            }
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
        setAverageResponseTimeData((prevState) => ({
            ...prevState,
            loading: false,
            dataInitialized: true
        }));
        setRotate(true);
        const { startDate, endDate } = averageResponseTimeData;
        if (startDate && endDate) {
            var selectedStartDate = new Date(startDate);
            selectedStartDate.setHours(0, 0, 0, 0);

            var selectedEndDate = new Date(endDate);
            selectedEndDate.setHours(23, 59, 59, 999);

            utcStartInSeconds = Math.floor(selectedStartDate.getTime() / 1000);
            utcEndInSeconds = Math.floor(selectedEndDate.getTime() / 1000);
        }
        const resultedAvg = await GetAverageResponseTimeByDealer({
            startDate: utcStartInSeconds,
            endDate: utcEndInSeconds,
            dealer: dealer != null ? dealer : ""
        });
        setAverageResponseTimeData((prevState) => ({
            ...prevState,
            count: {
                ...resultedAvg
            },
            // count: {
            //     total: 0,
            //     available: resultedAvg.available || "N/A",
            //     hourhold24: resultedAvg.hourhold24 || "N/A",
            //     purchase: resultedAvg.purchase || "N/A",
            //     thisCar: resultedAvg.thisCar || "N/A"
            // },

            dealer: dealer != null ? dealer : "",
            loading: false,
            dataInitialized: true
        }));
        setRotate(false);
    };

    const openModal = async () => {
        const settings = await fetchWidgetSettings();
        const { description, title } = settings?.widgets.find(
            (widget) => widget.label === "AverageResponseTimeHoldPurchase"
        );

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
            label: "AverageResponseTimeHoldPurchase",
            title: "Average Response  Time - Hold Purchase"
        }));
        document.body.style.overflow = "hidden";
    };

    const handleChangeDealerShip = (value) => {
        try {
            setIsLoading(true);
            if (value) {
                searchDealer(value).then((dealers) => {
                    setDealers(dealers);
                });
            } else {
                setDealers(dealerOptions);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching dealer data:", error);
        }
    };
    const fetchResultOfDealerShip = async (e) => {
        let utcStartInSeconds = "";
        let utcEndInSeconds = "";
        // if (!e) {
        // If no dealer is selected, fetch data based on the selected date range or get all data
        // Check if both startDate and endDate are present
        if (averageResponseTimeData.startDate && averageResponseTimeData.endDate) {
            let selectedStartDate = new Date(averageResponseTimeData.startDate);
            selectedStartDate.setHours(0, 0, 0, 0);

            let selectedEndDate = new Date(averageResponseTimeData.endDate);
            selectedEndDate.setHours(23, 59, 59, 999);

            utcStartInSeconds = Math.floor(selectedStartDate.getTime() / 1000);
            utcEndInSeconds = Math.floor(selectedEndDate.getTime() / 1000);
        }

        setSelectedDealer([e]);
        // console.log(selectedDealer);
        setAverageResponseTimeData((prevState) => ({
            ...prevState,
            dealer: e
            // dataInitialized: true
        }));

        (async () => {
            setAverageResponseTimeData((prevState) => ({
                ...prevState,
                loading: true
                //  dealer: e
                //         dataInitialized: true
            }));
            var avgResponseTime = await GetAverageResponseTimeByDealer(
                {
                    startDate: utcStartInSeconds != null ? utcStartInSeconds : "",
                    endDate: utcEndInSeconds != null ? utcEndInSeconds : "",
                    dealer: e
                }
                // startDate: moment(startDate).utc().unix(),
                // endDate: moment(endDate).add(1, "days").utc().unix(),
            );
            //   console.log(avgResponseTime);
            //     console.log(avgResponseTime.available);

            setAverageResponseTimeData((prevState) => ({
                ...prevState,
                count: {
                    total: 0,
                    available: avgResponseTime.available || 0,
                    hourhold24: avgResponseTime.hourhold24 || 0,
                    purchase: avgResponseTime.purchase || 0,
                    thisCar: avgResponseTime.thisCar || 0
                },
                loading: false,
                dataInitialized: true,
                dealer: e
            }));

            initChart(averageResponseTimeData.count);
        })();
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
                            {/* Total: {loading ? 0 : averageResponseTimeData.count} Notifications */}
                            Date:{" "}
                            {startDate && (
                                <>
                                    <strong>{startDate?.toLocaleDateString("en-US")}</strong> to{" "}
                                </>
                            )}
                            {endDate && <strong>{endDate?.toLocaleDateString("en-US")}</strong>}
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
                    className="d-flex px-10 pt-5 flex-wrap"
                    style={{ gap: "42px" }}>
                    <div className="mt-2">
                        <Select
                            styles={{ width: "200px" }}
                            name="dealer"
                            options={dealers}
                            isClearable={true}
                            isMulti={false}
                            isLoading={isLoading}
                            className="response-dealer-select"
                            placeholder={"Select dealer..."}
                            isSearchable
                            onInputChange={handleChangeDealerShip}
                            value={selectedDealer}
                            onChange={(e) => {
                                fetchResultOfDealerShip(e);
                            }}
                        />
                    </div>
                </div>
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
                            <p>*all values are in minutes</p>
                            <div
                                id="kt_charts_widget_4"
                                className="min-h-auto"></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AverageResponseTimeForHoldAndPurchase;
