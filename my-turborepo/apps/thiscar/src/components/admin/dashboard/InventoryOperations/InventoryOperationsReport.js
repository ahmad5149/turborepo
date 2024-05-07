"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { fetchWidgetSettings } from "../Utilities";
import AppContext from "@/StateManagement/AppContext";
import "../../../../contents/scss/admin/inventoryOperationsReport.scss";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import { IORWidget } from "@/services/inventoryService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function InventoryOperationsReport() {
    const { setShowSpecificWidgetSettings, inventoryOperationTable, setInventoryOperationTable, setDashboardLoader } =
        useContext(AppContext);
    const [rotate, setRotate] = useState(false);
    const { data, total, loading, dealer, type } = inventoryOperationTable;
    const { setWidgetDetailModal } = useContext(AppContext);
    const [currentWidget, setCurrentWidget] = useState({
        title: "",
        description: ""
    });
    useEffect(() => {
        // renderChart();
        const settings = fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "InventoryOperationsReport");

        setCurrentWidget((prevState) => ({
            ...prevState,
            title,
            description
        }));

        (async () => {
            setInventoryOperationTable((prevState) => ({
                ...prevState,
                loading: true
            }));
            const inventoryOperationsResult = await IORWidget();

            setInventoryOperationTable((prevState) => ({
                ...prevState,
                data: [...inventoryOperationsResult],
                total: inventoryOperationsResult?.length,
                loading: false
            }));
        })();

        setShowSpecificWidgetSettings((prevState) => ({
            ...prevState,
            show: false,
            label: ""
        }));
    }, []);

    const handleClick = async () => {
        // setLoading(true);

        setInventoryOperationTable((prevState) => ({
            ...prevState,
            loading: true
        }));
        setRotate(true);
        const inventoryOperationsResult = await IORWidget();

        setInventoryOperationTable((prevState) => ({
            ...prevState,
            data: [...inventoryOperationsResult],
            total: inventoryOperationsResult?.length,
            loading: false
        }));
        setRotate(false);
    };

    const openModal = async () => {
        const settings = await fetchWidgetSettings();
        const { description, title } = settings?.widgets.find((widget) => widget.label === "InventoryOperationsReport");

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
            label: "InventoryOperationsReport",
            title: "Inventory Operation Report"
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
                            Total: {inventoryOperationTable.total} records
                        </span>
                    </h3>
                    <div className="icon-container">
                        {/* <i
                            // onClick={showFilters}
                            className="ki-outline ki-gear fs-2x pe-2"></i> */}
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
                            id="kt_ecommerce_products_table_wrapper"
                            className="dataTables_wrapper dt-bootstrap4 no-footer notifications"
                            style={{ maxHeight: "300px", overflowY: "auto" }}>
                            <div
                                className="table-responsive"
                                style={{ maxHeight: "300px" }}>
                                <table
                                    className="table dataTable align-middle table-row-dashed fs-6 gy-1"
                                    id="kt_ecommerce_products_table">
                                    <thead className="sticky-header">
                                        <tr className="text-start text-black-400 fw-bold fs-7 gs-0">
                                            <th className={`cursor-pointer text-start min-w-150px sticky-th`}>
                                                Dealer
                                            </th>
                                            <th className={`cursor-pointer text-start min-w-150px sticky-th`}>
                                                Total Unit Received
                                            </th>
                                            <th className={`cursor-pointer text-start min-w-150px sticky-th`}>
                                                # Live on THIScar
                                            </th>
                                            <th className={`cursor-pointer text-startmin-w-150px sticky-th`}>
                                                # in "processing" w/Spyne
                                            </th>
                                            <th className={`cursor-pointer text-start min-w-150px sticky-th`}>
                                                # Without Enough Pics
                                            </th>
                                            <th className={`cursor-pointer text-start min-w-150px sticky-th`}>
                                                # With no Price
                                            </th>
                                            <th className={`cursor-pointer text-start min-w-150px sticky-th`}>
                                                # With too Many Miles
                                            </th>
                                            <th className={`cursor-pointer text-start min-w-150px sticky-th`}>
                                                # With Price too Low
                                            </th>
                                            <th className={`cursor-pointer text-start min-w-130px sticky-th`}>Delta</th>
                                        </tr>
                                    </thead>

                                    <tbody className="fw-semibold text-gray-600 fs-6">
                                        {data?.map((IORrecord, index) => (
                                            <tr key={index}>
                                                <td className="text-start pe-0">
                                                    {IORrecord.name?.replace(/^"(.*)"$/, "$1")}
                                                </td>
                                                <td className="text-center pe-0"> {IORrecord.TotalUnitsReceived} </td>
                                                <td className="text-center pe-0"> {IORrecord.LiveonTHIScar} </td>
                                                <td className="text-center pe-0">{IORrecord.ProcessingWithSpyne}</td>
                                                <td className="text-center pe-0"> {IORrecord.WITHOUTENOUGHPICS} </td>
                                                <td className="text-center pe-0"> {IORrecord.WITHNOPRICE} </td>
                                                <td className="text-center pe-0">{IORrecord.WITHTOOMANYMILES}</td>
                                                <td className="text-center pe-0"> {IORrecord.WITHTOOLOWPRICE} </td>
                                                <td className="text-center pe-0">
                                                    {" "}
                                                    {IORrecord.TotalUnitsReceived - IORrecord.LiveonTHIScar}{" "}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default InventoryOperationsReport;
