import { useContext, useEffect, useRef, useState } from "react";
import "../../../../contents/admin/scss/notificationResponse.scss";
import AppContext from "@/StateManagement/AppContext";
import { fetchWidgetSettings } from "../Utilities";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import Select from "react-select";
import { searchDealer } from "@/services/dealerService";
import moment from "moment";
import { useAuth } from "../../../../components/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NotificationResponseByDealer = ({ dealerOptions }) => {
    const { setShowSpecificWidgetSettings, responseDealerData, setResponseDealerData } = useContext(AppContext);
    const currentUser = useAuth();
    const [rotate, setRotate] = useState(false);
    const [dealers, setDealers] = useState(dealerOptions);
    const { count, loading, dealer, startDate, endDate } = responseDealerData;
    const [selectedDealer, setSelectedDealer] = useState(dealer?.value ? [dealer] : []);
    const { setWidgetDetailModal } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [currentWidget, setCurrentWidget] = useState({
        title: "",
        description: ""
    });
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find(
            (widget) => widget.label === "NotificationResponseByDealer"
        );

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));

        (async () => {
            setResponseDealerData((prevState) => ({
                ...prevState,
                loading: true
            }));

            const response = await fetch(`/api/notifications-response`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${currentUser?.getIdToken()}`
                },
                body: JSON.stringify({
                    startDate: moment(startDate).utc().unix(),
                    endDate: moment(endDate).add(1, "days").utc().unix(),
                    dealer
                })
            });
            if (!response.ok) {
                toast.error(`HTTP error! Status: ${response.status}`);
            }
            const counts = await response.json();

            setResponseDealerData((prevState) => ({
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
    }, []);

    const renderChart = async () => {
        const ApexCharts = (await import("apexcharts")).default;
        const chartElement = chartRef.current;
        const optionsConfig = {
            series: [count?.accepted, count?.declined],
            labels: ["Accepted", "Declined"],
            chart: {
                type: "pie"
            },
            animations: false,
            legend: { show: false },
            dataLabels: { enabled: true },
            plotOptions: {
                pie: {
                    size: 360
                }
            },
            colors: ["#50CD89", "#FFC700"]
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
            chartElement = document.getElementById("kt_charts_widget_response_dealer");
            attempts++;

            if (chartElement || attempts >= maxAttempts) {
                clearInterval(checkElementInterval);

                if (count?.total && chartElement) {
                    renderChart(count?.accepted, count?.declined);
                }
            }
        }, 500);

        // if (count?.total) renderChart(count?.accepted, count?.declined);
    }, [count]);

    const handleClick = async () => {
        setResponseDealerData((prevState) => ({
            ...prevState,
            loading: true
        }));
        setRotate(true);

        const response = await fetch(`/api/notifications-response`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${currentUser?.getIdToken()}`
            },
            body: JSON.stringify({
                startDate: moment(startDate).utc().unix(),
                endDate: moment(endDate).add(1, "days").utc().unix(),
                dealer
            })
        });
        if (!response.ok) {
            toast.error(`HTTP error! Status: ${response.status}`);
        }
        const counts = await response.json();

        setResponseDealerData((prevState) => ({
            ...prevState,
            count: {
                ...counts
            },
            loading: false
        }));

        setRotate(false);
    };

    const openModal = async () => {
        const settings = await fetchWidgetSettings();
        const { description, title } = settings?.widgets.find(
            (widget) => widget.label === "NotificationResponseByDealer"
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
            label: "NotificationResponseByDealer",
            title: "Notification Response Settings"
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

    const fetchResultOfDealerShip = (e) => {
        setSelectedDealer([e]);
        setResponseDealerData((prevState) => ({
            ...prevState,
            dealer: e
        }));

        (async () => {
            setResponseDealerData((prevState) => ({
                ...prevState,
                loading: true
            }));

            const response = await fetch(`/api/notifications-response`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${currentUser?.getIdToken()}`
                },
                body: JSON.stringify({
                    startDate: moment(startDate).utc().unix(),
                    endDate: moment(endDate).add(1, "days").utc().unix(),
                    dealer: e
                })
            });
            if (!response.ok) {
                toast.error(`HTTP error! Status: ${response.status}`);
            }
            const counts = await response.json();

            setResponseDealerData((prevState) => ({
                ...prevState,
                count: {
                    ...counts
                },
                loading: false
            }));
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
                        Total: {count?.total} Notifications{" "}
                        {startDate && (
                            <>
                                <strong>{startDate?.toLocaleDateString("en-US")}</strong> to{" "}
                            </>
                        )}
                        {endDate && <strong>{endDate?.toLocaleDateString("en-US")}</strong>}
                    </span>
                </div>
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
                    <div className="d-flex flex-column justify-content-center flex-row-fluid mb-5">
                        <div className="d-flex fs-6 fw-semibold align-items-center mb-3">
                            <div className="bullet bg-success me-3"></div>
                            <div className="text-gray-400">Accepted</div>
                            <div className="ms-auto fw-bold text-gray-700">{count?.accepted}</div>
                        </div>

                        <div className="d-flex fs-6 fw-semibold align-items-center">
                            <div className="bullet bg-warning  me-3"></div>
                            <div className="text-gray-400">Declined</div>
                            <div className="ms-auto fw-bold text-gray-700">{count?.declined}</div>
                        </div>
                    </div>
                </div>
                <div
                    className={`${loading ? "align-loading" : ""} card-body d-block pt-0 pb-4`}
                    style={{ paddingBottom: "0" }}>
                    {loading ? (
                        <div>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div className="pt-0 rounded-xl my-auto pb-2 text-center">
                                <div className="d-flex justify-content-center">
                                    <div style={{ width: "240px" }}>
                                        <div
                                            className={`${count.total && count?.total === 0 ? "zero-count" : ""}`}
                                            ref={chartRef}>
                                            <div
                                                id="kt_charts_widget_response_dealer"
                                                className="min-h-auto"></div>
                                        </div>
                                    </div>
                                </div>
                                {count?.total === 0 && (
                                    <img
                                        className="zero-count"
                                        src="./media/no-data-found.png"
                                    />
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
