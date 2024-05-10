import { useContext, useEffect, useRef, useState } from "react";
import "../../../../contents/admin/scss/notificationResponse.scss";
import AppContext from "@/StateManagement/AppContext";
import { fetchWidgetSettings } from "../Utilities";
import { getPriceChangedCars } from "@/services/inventoryService";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";

import moment from "moment";
export const PriceChange = () => {
    const { setShowSpecificWidgetSettings, priceChangeData, setPriceChangeData, setShowSpecificWidgetDetails } =
        useContext(AppContext);
    const [rotate, setRotate] = useState(false);
    const { count, loading, startDate, endDate, upDown, lastChangedDate } = priceChangeData;

    const { setWidgetDetailModal } = useContext(AppContext);
    const [currentWidget, setCurrentWidget] = useState({
        title: "Price Change",
        description: "Price Change Units"
    });
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [priceUpDown, setPriceUpDown] = useState("");

    useEffect(() => {
        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "PriceChange");

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));

        if (startDate && endDate) {
            (async () => {
                setPriceChangeData((prevState) => ({
                    ...prevState,
                    loading: true
                }));

                const counts = await getPriceChangedCars({
                    startDate: moment(startDate).utc().unix(),
                    endDate: moment(endDate).add(1, "days").utc().unix()
                });
                setPriceChangeData((prevState) => ({
                    ...prevState,
                    count: {
                        ...counts
                    },
                    loading: false
                }));
            })();

            setShowSpecificWidgetSettings((prevState) => ({
                ...prevState,
                show: false,
                label: ""
            }));
        }
    }, []);

    const renderChart = async (increase, decrease) => {
        const ApexCharts = (await import("apexcharts")).default;
        const chartElement = await chartRef.current;

        const r = getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-500");
        const s = getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-200");
        const o = getComputedStyle(document.documentElement).getPropertyValue("--bs-primary");
        const i = getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300");
        const j = getComputedStyle(document.documentElement).getPropertyValue("--bs-danger");

        const optionsConfig = {
            series: [
                {
                    data: [increase, decrease],
                    name: "Price Change",
                    margin: { left: 5, right: 5 }
                }
            ],
            chart: {
                fontFamily: "inherit",
                type: "bar",
                toolbar: { show: false },
                events: {
                    legendClick: function (chartContext, seriesIndex, config) {
                        showDetails(seriesIndex);
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    columnWidth: ["30%"],
                    borderRadius: 4,
                    distributed: true
                }
            },
            legend: {
                show: true,
                markers: {
                    onClick: undefined
                }
            },
            dataLabels: { enabled: true },
            stroke: { show: true, width: 2, colors: ["transparent"] },
            colors: [o, j],
            xaxis: {
                categories: ["Increased Detail", "Decreased Detail"],
                axisBorder: { show: true },
                axisTicks: { show: true },
                labels: {
                    show: false,
                    style: { colors: r, fontSize: "14px", paddingBottom: "10px" }
                }
            },
            yaxis: {
                labels: {
                    show: false,
                    style: { colors: r, fontSize: "12px", paddingRight: "10px" }
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
            grid: {
                borderColor: s,
                strokeDashArray: 4,
                yaxis: { lines: { show: true } }
                // padding: { left: -10, right: 5 }
            }
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new ApexCharts(chartElement, optionsConfig);
        chartInstanceRef.current?.render();
    };

    useEffect(() => {
        let chartElement = null;
        const maxAttempts = 10;
        let attempts = 0;

        const checkElementInterval = setInterval(() => {
            chartElement = document.getElementById("kt_charts_widget_price_change");
            attempts++;

            if (chartElement || attempts >= maxAttempts) {
                clearInterval(checkElementInterval);

                if (count?.increase >= 0 && count?.decrease >= 0 && chartElement) {
                    renderChart(count?.increase, count?.decrease);
                }
            }
        }, 500);
        // if (count?.increase >= 0) renderChart(count?.increase, count?.decrease);
    }, [count]);

    const handleClick = async () => {
        setPriceChangeData((prevState) => ({
            ...prevState,
            loading: true
        }));
        setRotate(true);
        if (lastChangedDate?.startDate && lastChangedDate?.endDate) {
            const count = await getPriceChangedCars({
                startDate: moment(lastChangedDate.startDate).utc().unix(),
                endDate: moment(lastChangedDate.endDate).add(1, "days").utc().unix()
            });
            setPriceChangeData((prevState) => ({
                ...prevState,
                count: {
                    ...count
                },
                loading: false
            }));
        }

        setRotate(false);
    };

    const openModal = async () => {
        const settings = await fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "PriceChange");

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
            label: "PriceChange",
            title: "Price Change Units"
        }));
        document.body.style.overflow = "hidden";
    };

    const showDetails = (seriesIndex) => {
        const upDown = seriesIndex == 0 ? "up" : "down";
        setPriceUpDown(upDown);
        setIsPopupOpen(true);
        setPriceChangeData((prevState) => ({
            ...prevState,
            upDown: upDown
        }));
        setShowSpecificWidgetDetails((prevState) => ({
            ...prevState,
            show: true,
            label: "PriceChange",
            title: "Price Change Units",
            upDown: upDown
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
                    </h3>

                    <div className="icon-container">
                        <i
                            onClick={showFilters}
                            className="ki-outline ki-gear fs-2x pe-2"></i>
                        <i
                            onClick={() => !loading && handleClick()}
                            className={`ki-solid ki-arrows-circle fs-1 ${rotate ? "rotate" : ""}`}></i>
                    </div>
                    <span className="text-gray-400 mt-1 fw-semibold fs-6">
                        Total: <strong>{count?.total}</strong> Units changed{" "}
                        <strong>{lastChangedDate?.startDate?.toLocaleDateString("en-US")}</strong> to{" "}
                        <strong>{lastChangedDate?.endDate?.toLocaleDateString("en-US")}</strong>
                    </span>
                </div>

                <div
                    className={`${loading ? "align-loading" : ""} card-body `}
                    style={{ paddingBottom: "0" }}>
                    {loading ? (
                        <div>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div className="d-flex flex-center me-9 mb-5">
                                <div className="pt-0 rounded-xl my-auto pb-2">
                                    <div
                                        id="kt_charts_widget_price_change"
                                        className="mb-n10"
                                        ref={chartRef}></div>
                                </div>
                            </div>
                        </>
                        // <div
                        //     id="kt_charts_widget_2_chart"
                        //     className="mb-n10"
                        //     ref={chartRef}>
                        //     <h3>
                        //         {count.total} - {count.accepted} - {count.declined}
                        //     </h3>
                        // </div>
                    )}
                </div>
            </div>
        </>
    );
};
