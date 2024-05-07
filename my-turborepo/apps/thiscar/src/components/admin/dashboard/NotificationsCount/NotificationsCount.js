import { useContext, useEffect, useRef, useState } from "react";
import "../../../../contents/admin/scss/notificationResponse.scss";
import AppContext from "@/StateManagement/AppContext";
import { fetchWidgetSettings } from "../Utilities";
import { GetNotificationsCount } from "@/services/notificationsService";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import moment from "moment";

export const NotificationsCount = () => {
    const { setShowSpecificWidgetSettings, responseNotificationsCountData, setResponseNotificationsCountData } =
        useContext(AppContext);
    const [rotate, setRotate] = useState(false);
    const { count, loading, startDate, endDate } = responseNotificationsCountData;

    const { setWidgetDetailModal } = useContext(AppContext);
    const [currentWidget, setCurrentWidget] = useState({
        title: "Notifications Sent",
        description: "ThisCar Notifications Sent"
    });
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "NotificationsCount");

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));

        if (startDate && endDate) {
            (async () => {
                setResponseNotificationsCountData((prevState) => ({
                    ...prevState,
                    loading: true
                }));
                const counts = await GetNotificationsCount({
                    startDate: moment(startDate).utc().unix(),
                    endDate: moment(endDate).add(1, "days").utc().unix()
                });
                setResponseNotificationsCountData((prevState) => ({
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

    const renderChart = async (purchase, available, hold) => {
        const ApexCharts = (await import("apexcharts")).default;
        const chartElement = chartRef.current;
        const optionsConfig = {
            series: [purchase, available, hold],
            labels: ["Purchased", "Available", "24 Hours Hold"],
            chart: {
                type: "donut"
            },
            animations: false,
            legend: { show: false },
            dataLabels: { enabled: true },
            plotOptions: {
                pie: {
                    size: 360
                }
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
            chartElement = document.getElementById("kt_charts_widget_notifications_sent");
            attempts++;
            if (chartElement || attempts >= maxAttempts) {
                clearInterval(checkElementInterval);
                if ((count?.purchase || count?.available || count?.hold) && chartElement) {
                    renderChart(count?.purchase, count?.available, count?.hold);
                }
            }
        }, 500);
        // if (count?.total) renderChart(count?.accepted, count?.declined);

        //renderChart(count?.purchase, count?.available, count?.hold);
    }, [count]);

    const handleClick = async () => {
        setResponseNotificationsCountData((prevState) => ({
            ...prevState,
            loading: true
        }));
        setRotate(true);
        if (startDate && endDate) {
            const count = await GetNotificationsCount({
                startDate: moment(startDate).utc().unix(),
                endDate: moment(endDate).add(1, "days").utc().unix()
            });
            setResponseNotificationsCountData((prevState) => ({
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
        const { description, title } = settings?.widgets.find((widget) => widget.label === "NotificationsCount");

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
            label: "NotificationsCount",
            title: "Notifications Sent"
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
                        Total: {count?.total} Notifications from{" "}
                        <strong>{startDate?.toLocaleDateString("en-US")}</strong> to{" "}
                        <strong>{endDate?.toLocaleDateString("en-US")}</strong>
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
                                        id="kt_charts_widget_notifications_sent"
                                        className="mb-n10"
                                        ref={chartRef}></div>
                                </div>
                            </div>

                            <div className="d-flex flex-column justify-content-center flex-row-fluid pe-11 mb-5">
                                <div className="d-flex fs-6 fw-semibold align-items-center mb-3">
                                    <div className="bullet bg-primary me-3"></div>
                                    <div className="text-gray-400">Purchased</div>
                                    <div className="ms-auto fw-bold text-gray-700">{count?.purchase}</div>
                                </div>

                                <div className="d-flex fs-6 fw-semibold align-items-center mb-3">
                                    <div className="bullet bg-success me-3"></div>
                                    <div className="text-gray-400">Available</div>
                                    <div className="ms-auto fw-bold text-gray-700">{count?.available}</div>
                                </div>

                                <div className="d-flex fs-6 fw-semibold align-items-center">
                                    <div className="bullet bg-warning  me-3"></div>
                                    <div className="text-gray-400">24 Hours Hold</div>
                                    <div className="ms-auto fw-bold text-gray-700">{count?.hold}</div>
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
