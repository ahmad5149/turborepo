import { useContext, useEffect, useRef, useState } from "react";
import "../../../../contents/admin/scss/notificationResponse.scss";
import AppContext from "@/StateManagement/AppContext";
import { fetchWidgetSettings } from "../Utilities";
import { GetResponsesCountPerDealer, GetResponsesTableData } from "@/services/notificationsService";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import moment from "moment";

export const NotificationResponseBar = () => {
    const {
        setShowSpecificWidgetSettings,
        responseDealerBar,
        setResponseDealerBar,
        responseDealerTable,
        setResponseDealerTable
    } = useContext(AppContext);
    const [rotate, setRotate] = useState(false);
    // const { data, total, loading, dealer, startDate, endDate, type } = responseDealerBar;
    const { data, total, loading, dealer, startDate, endDate, type } = responseDealerTable;

    const { setWidgetDetailModal } = useContext(AppContext);
    const [currentWidget, setCurrentWidget] = useState({
        title: "",
        description: ""
    });
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "NotificationResponseBar");

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));

        if ((startDate && endDate) || dealer?.value || type?.value) {
            (async () => {
                // setResponseDealerBar((prevState) => ({
                //     ...prevState,
                //     loading: true
                // }));
                // const { total, data } = await GetResponsesCountPerDealer({
                //     startDate,
                //     endDate,
                //     dealer,
                //     type: type?.value
                // });
                // setResponseDealerBar((prevState) => ({
                //     ...prevState,
                //     total: total,
                //     data: data,
                //     loading: false
                // }));

                setResponseDealerTable((prevState) => ({
                    ...prevState,
                    loading: true
                }));
                const { total, data } = await GetResponsesTableData({
                    startDate: moment(startDate).utc().unix(),
                    endDate: moment(endDate).add(1, "days").utc().unix(),
                    dealer,
                    type: type?.value
                });
                setResponseDealerTable((prevState) => ({
                    ...prevState,
                    total: total,
                    data: data,
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

    const renderChart = async () => {
        // const ApexCharts = (await import("apexcharts")).default;
        // const chartElement = chartRef.current;
        // const optionsConfig = {
        //     series: data.series.map((series, index) => ({
        //         name: index === 0 ? "Accepted" : "Declined",
        //         data: series.data
        //     })),
        //     labels: ["Accepted", "Declined"],
        //     chart: {
        //         type: "bar"
        //         // height: 430
        //     },
        //     legend: { show: false },
        //     dataLabels: { enabled: true },
        //     plotOptions: {
        //         bar: {
        //             horizontal: true,
        //             dataLabels: {
        //                 position: "top"
        //             }
        //         }
        //     },
        //     xaxis: {
        //         categories: data.categories
        //     },
        //     colors: ["#50CD89", "#FFC700"]
        // };
        // if (chartInstanceRef.current) {
        //     chartInstanceRef.current.destroy();
        // }
        // chartInstanceRef.current = new ApexCharts(chartElement, optionsConfig);
        // chartInstanceRef.current?.render();
    };

    // useEffect(() => {
    //     if (total) renderChart(data);
    // }, [data]);

    const handleClick = async () => {
        // setResponseDealerBar((prevState) => ({
        //     ...prevState,
        //     loading: true
        // }));
        // setRotate(true);
        // if ((startDate && endDate) || dealer || type) {
        //     const { total, data } = await GetResponsesCountPerDealer({
        //         startDate,
        //         endDate,
        //         dealer,
        //         type: ""
        //     });
        //     setResponseDealerBar((prevState) => ({
        //         ...prevState,
        //         total: total,
        //         data: data,
        //         loading: false
        //     }));
        // }

        // setRotate(false);

        setResponseDealerTable((prevState) => ({
            ...prevState,
            loading: true
        }));
        setRotate(true);
        if ((startDate && endDate) || dealer || type) {
            const { total, data } = await GetResponsesTableData({
                startDate: moment(startDate).utc().unix(),
                endDate: moment(endDate).add(1, "days").utc().unix(),
                dealer,
                type: type?.value
            });
            setResponseDealerTable((prevState) => ({
                ...prevState,
                total: total,
                data: data,
                loading: false
            }));
        }

        setRotate(false);
    };

    const openModal = async () => {
        const settings = await fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "NotificationResponseBar");

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
            label: "DealerResponseBarFilters",
            title: "Notification Response Settings"
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
                        Total: {total} Notifications
                        {startDate && endDate && (
                            <>
                                <strong>{startDate?.toLocaleDateString("en-US")}</strong> to
                                <strong>{endDate?.toLocaleDateString("en-US")}</strong>
                            </>
                        )}
                        {type?.value && type?.label != "All" && <strong className="ms-2">Type: {type.label}</strong>}
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
                            <div
                                id="kt_ecommerce_products_table_wrapper"
                                className="dataTables_wrapper dt-bootstrap4 no-footer notifications"
                                style={{ maxHeight: "300px", overflowY: "auto" }}>
                                <div className="table-responsive">
                                    <table
                                        className="table dataTable align-middle table-row-dashed fs-6 gy-1"
                                        id="kt_ecommerce_products_table">
                                        <thead>
                                            <tr className="text-start text-black-400 fw-bold fs-7 gs-0">
                                                <th className={`cursor-pointer text-start min-w-90px sticky-th`}>
                                                    Dealer
                                                </th>
                                                <th className={`cursor-pointer text-start min-w-90px sticky-th`}>
                                                    Accepted
                                                </th>
                                                <th className={`cursor-pointer text-start min-w-90px sticky-th`}>
                                                    Declined
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="fw-semibold text-gray-600 fs-6">
                                            {data?.map((flattenedNotifications, index) => (
                                                <tr key={index}>
                                                    <td className="text-start pe-0">
                                                        {flattenedNotifications.dealerName}
                                                    </td>
                                                    <td
                                                        className="text-center pe-0"
                                                        style={{ color: "#50CD89" }}>
                                                        {" "}
                                                        {flattenedNotifications.acceptedCount}{" "}
                                                    </td>
                                                    <td
                                                        className="text-center pe-0"
                                                        style={{ color: "#FFC700" }}>
                                                        {" "}
                                                        {flattenedNotifications.declinedCount}{" "}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
