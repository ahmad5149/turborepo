import { useContext, useEffect, useState } from "react";
import AppContext from "@/StateManagement/AppContext";
import { fetchWidgetSettings } from "../Utilities";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import { Get_24HourHoldData } from "@/services/notificationsService";
import moment from "moment";

export const _24HourHoldWidget = () => {
    const { setWidgetDetailModal, setShowSpecificWidgetSettings, _24HourHoldData, set_24HourHoldData } =
        useContext(AppContext);
    const { total, data, loading, dealer, startDate, endDate } = _24HourHoldData;
    const [rotate, setRotate] = useState(false);

    const [currentWidget, setCurrentWidget] = useState({
        title: "",
        description: ""
    });
    useEffect(() => {
        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "_24HourHoldWidget");

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));

        if ((startDate && endDate) || dealer?.value) {
            (async () => {
                set_24HourHoldData((prevState) => ({
                    ...prevState,
                    loading: true
                }));
                const { total, data } = await Get_24HourHoldData({
                    startDate: moment(startDate).utc().unix(),
                    endDate: moment(endDate).add(1, "days").utc().unix(),
                    dealer
                });
                set_24HourHoldData((prevState) => ({
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
    const showFilters = () => {
        setShowSpecificWidgetSettings((prevState) => ({
            ...prevState,
            show: true,
            label: "_24HourHoldWidget",
            title: "Dealer Hold Analysis Settings"
        }));
        document.body.style.overflow = "hidden";
    };
    const openModal = async () => {
        const settings = await fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "_24HourHoldWidget");

        setWidgetDetailModal((prevState) => ({
            ...prevState,
            show: true,
            description,
            title
        }));
        document.body.style.overflow = "hidden";
    };
    const handleClick = async () => {
        set_24HourHoldData((prevState) => ({
            ...prevState,
            loading: true
        }));
        setRotate(true);
        if ((startDate && endDate) || dealer) {
            const { total, data } = await Get_24HourHoldData({
                startDate: moment(startDate).utc().unix(),
                endDate: moment(endDate).add(1, "days").utc().unix(),
                dealer
            });
            set_24HourHoldData((prevState) => ({
                ...prevState,
                total: total,
                data: data,
                loading: false
            }));
        }
        setRotate(false);
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
                        Total: {total} Dealers &nbsp;
                        {startDate && endDate && (
                            <>
                                <strong>{startDate?.toLocaleDateString("en-US")}</strong> to&nbsp;
                                <strong>{endDate?.toLocaleDateString("en-US")}</strong>
                            </>
                        )}
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
                                                <th className={`cursor-pointer text-start min-w-70px sticky-th`}>
                                                    Hold
                                                </th>
                                                <th className={`cursor-pointer text-start min-w-70px sticky-th`}>
                                                    Expired
                                                </th>
                                                <th className={`cursor-pointer text-start min-w-70px sticky-th`}>
                                                    Purchased
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="fw-semibold text-gray-600 fs-6">
                                            {data?.map((obj, index) => (
                                                <tr key={index}>
                                                    <td className="text-start pe-0">{obj.dealerName}</td>
                                                    <td
                                                        className="text-center pe-0"
                                                        style={{ color: "#50CD89" }}>
                                                        {" "}
                                                        {obj.holdUnit}{" "}
                                                    </td>
                                                    <td
                                                        className="text-center pe-0"
                                                        style={{ color: "#FFC700" }}>
                                                        {" "}
                                                        {obj.releaseUnit}{" "}
                                                    </td>
                                                    <td
                                                        className="text-center pe-0"
                                                        style={{ color: "#FFC700" }}>
                                                        {" "}
                                                        {obj.buyUnit}{" "}
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
