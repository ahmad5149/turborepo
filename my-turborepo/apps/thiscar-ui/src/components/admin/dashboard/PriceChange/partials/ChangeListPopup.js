import AppContext from "@/StateManagement/AppContext";
import { memo, useContext, useState, useEffect } from "react";
import { getVehiclePriceData } from "@/services/inventoryService";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import { debounce } from "lodash";
import moment from "moment";

export const ChangeListPopup = memo(() => {
    const [vehiclesData, setVehiclesData] = useState([]);
    const [vehiclesCount, setVehiclesCount] = useState(0);
    const [dataLoading, setDataLoading] = useState(false);
    const [perPage, setPerPage] = useState(1);
    const [lastPage, setLastPage] = useState(false);
    const { showSpecificWidgetDetails, setShowSpecificWidgetDetails, priceChangeData } = useContext(AppContext);
    const { upDown, lastChangedDate } = priceChangeData;

    const closeModal = () => {
        setShowSpecificWidgetDetails((prevState) => ({
            ...prevState,
            show: false,
            label: "",
            title: ""
        }));
        document.body.style.overflow = "auto";
    };

    const fetchVehiclePriceDataOnscroll = async () => {
        setDataLoading(true);

        const { hits, page } = await getVehiclePriceData({
            startDate: moment(lastChangedDate?.startDate).utc().unix(),
            endDate: moment(lastChangedDate?.endDate).add(1, "days").utc().unix(),
            upDown: upDown,
            page: perPage + 1
        });

        if (!hits.length) setLastPage(true);
        setPerPage(page);
        setDataLoading(false);
        setVehiclesData((prevData) => {
            return [...prevData, ...hits];
        });
    };

    useEffect(() => {
        const fetchVehiclePriceData = async () => {
            setDataLoading(true);
            const { hits, page, found } = await getVehiclePriceData({
                startDate: moment(lastChangedDate?.startDate).utc().unix(),
                endDate: moment(lastChangedDate?.endDate).add(1, "days").utc().unix(),
                upDown: upDown,
                page: perPage
            });
            setDataLoading(false);
            setVehiclesData(hits);
            setVehiclesCount(found);
        };

        fetchVehiclePriceData();
    }, [lastChangedDate?.startDate, lastChangedDate?.endDate]);

    const handleInfiniteScroll = async () => {
        const container = document.getElementById("price-change-modal");
        const { scrollTop, clientHeight, scrollHeight } = container;

        if (scrollTop + clientHeight >= scrollHeight - 100 && !dataLoading) {
            try {
                if (!lastPage && !dataLoading) fetchVehiclePriceDataOnscroll();
            } catch (error) {
                console.error("Error in searchNotifications:", error.message);
            }
        }
    };

    const debouncedHandleInfiniteScroll = debounce(handleInfiniteScroll, 500);

    useEffect(() => {
        window.addEventListener("wheel", debouncedHandleInfiniteScroll);

        return () => {
            window.removeEventListener("wheel", debouncedHandleInfiniteScroll);
        };
    }, [debouncedHandleInfiniteScroll]);

    return (
        <>
            {showSpecificWidgetDetails.show && (
                <div
                    className="overlay"
                    onClick={closeModal}></div>
            )}
            <div
                className={`modal fade ${showSpecificWidgetDetails.show ? "show" : ""}`}
                id="notification-response-message-modal"
                tabIndex="-1"
                aria-labelledby="notification-response-message-modal"
                style={{ display: showSpecificWidgetDetails.show ? "block" : "none" }}
                aria-hidden={!showSpecificWidgetDetails.show}>
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{showSpecificWidgetDetails?.title}</h5>
                            <button
                                type="button"
                                className="btn-close closeModal"
                                aria-label="Close"
                                onClick={() => {
                                    closeModal();
                                }}></button>
                        </div>

                        <div
                            id="price-change-modal"
                            className="modal-body pb-0"
                            style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>
                            {/* {children} */}
                            <div className="card-body pt-0">
                                <div
                                    id="kt_ecommerce_products_table_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4 no-footer">
                                    <span className="text-black-400 mt-1 fw-semibold fs-6">
                                        Total: <strong>{vehiclesCount}</strong> Units price{" "}
                                        {upDown == "up" ? "increased" : "decreased"}{" "}
                                        <strong>{lastChangedDate?.startDate?.toLocaleDateString("en-US")}</strong> to{" "}
                                        <strong>{lastChangedDate?.endDate?.toLocaleDateString("en-US")}</strong>
                                    </span>
                                    <div className="table-responsive">
                                        <table
                                            className="table dataTable align-middle table-row-dashed fs-6 gy-1"
                                            id="kt_ecommerce_products_table">
                                            <thead>
                                                <tr className="text-start text-black-400 fw-bold fs-7 gs-0">
                                                    <th className={`cursor-pointer text-start min-w-90px `}>VIN</th>
                                                    <th className={`cursor-pointer text-start min-w-90px `}>Milage</th>

                                                    <th className={`cursor-pointer text-start min-w-40px `}>
                                                        Current Price
                                                    </th>
                                                    <th className={`cursor-pointer text-start min-w-60px`}>
                                                        Last Price
                                                    </th>
                                                    <th className={`cursor-pointer text-start min-w-40px `}>Dealer</th>
                                                    <th className={`cursor-pointer text-start min-w-40px `}>
                                                        Transmission
                                                    </th>

                                                    <th className={`cursor-pointer text-start min-w-60px`}>
                                                        Updated At
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="fw-semibold text-gray-600 fs-6">
                                                {!dataLoading && vehiclesData?.length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan="4"
                                                            className={`text-start`}>
                                                            No records found...
                                                        </td>
                                                    </tr>
                                                )}

                                                {vehiclesData?.map((row, index) => {
                                                    const date = new Date(
                                                        row?.document?.priceUpdateAt?._seconds * 1000
                                                    );
                                                    const priceUpdateAt = date.toLocaleDateString("en-US");
                                                    return (
                                                        <tr key={index}>
                                                            <td className="text-start pe-0">{row?.document?.vin}</td>
                                                            <td className="text-start pe-0">
                                                                {row.document.odometer?.toLocaleString()}
                                                            </td>

                                                            <td className="text-start pe-0">{row?.document?.price}</td>
                                                            <td className="text-start pe-0">
                                                                {row?.document?.oldPrice}
                                                            </td>
                                                            <td className="text-start pe-0">
                                                                {row.document.dealerName ?? "N/A"}
                                                            </td>
                                                            <td className="text-start pe-0">
                                                                {row.document.transmission}
                                                            </td>

                                                            <td className="text-start pe-0">{priceUpdateAt}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {dataLoading && (
                                        <div className="admin-loading">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});
