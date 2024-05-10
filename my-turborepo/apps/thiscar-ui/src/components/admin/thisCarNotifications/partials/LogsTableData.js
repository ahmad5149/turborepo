"use client";
import AppContext from "@/StateManagement/AppContext";
import { fetchNotificationLogsRes } from "@/services/notificationsService";
import { memo, useContext } from "react";
import { toast } from "react-toastify";

export const LogsTableData = memo(({ logs, loading, setResponseTimeline, setLoading }) => {
    const { notificationId } = useContext(AppContext);
    function formatTimestamp(timestamp) {
        if (timestamp) {
            const milliseconds = timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;
            const date = new Date(milliseconds);
            const formattedDate = date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true
            });
            return formattedDate;
        } else {
            return "N/A";
        }
    }

    function addSuffix(number) {
        if (number === undefined || number === null) {
            return "N/A";
        }

        const suffixes = ["th", "st", "nd", "rd"];
        const remainderTen = number % 10;
        const remainderHundred = number % 100;

        return number + suffixes[remainderTen <= 3 && remainderHundred !== 11 ? remainderTen : 0];
    }
    const fetchResponse = (logId, name) => {
        setLoading(true);
        fetchNotificationLogsRes(notificationId, logId).then((res) => {
            if (!res.length) {
                toast.error(`${name} didn't submit any response`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        textAlign: "left"
                    }
                });
                setLoading(false);
            }
            setResponseTimeline(res);
        });
    };
    if (loading) return <p>Loading...</p>;
    return (
        <table
            className="table dataTable align-middle table-row-dashed fs-6 gy-0 notification-logs-table"
            id="kt_ecommerce_products_table">
            <thead>
                <tr className="text-start text-black-400 fw-bold fs-7 gs-0">
                    <th className={`text-start min-w-40px ps-0`}>Contact Name</th>
                    <th className={`text-start min-w-90px ps-0`}>Attempt</th>
                    <th className={`text-start min-w-60px ps-0`}>Date Of Attempt</th>
                    <th className={`text-start min-w-70px ps-0`}>Response Date</th>
                    <th className={`text-start min-w-90px ps-0`}>Response Message</th>
                    <th className={`text-start min-w-30px ps-0`}>Status</th>
                </tr>
            </thead>

            <tbody className="fw-semibold text-gray-600 fs-6">
                {!loading && logs?.length === 0 && (
                    <tr>
                        <td colSpan="12">No records found...</td>
                    </tr>
                )}

                {loading && (
                    <tr>
                        <td colSpan="12">Loading...</td>
                    </tr>
                )}

                {logs?.map((log, index) => (
                    <tr key={index}>
                        <td
                            className="cursor-pointer text-start pe-0"
                            onClick={() => fetchResponse(log.id, log?.contactName)}>
                            <u> {log?.contactName || "N/A"}</u>
                        </td>
                        <td className="text-start pe-0">{addSuffix(log?.attempt) || "N/A"}</td>
                        <td className="text-start pe-0">
                            {(log?.dateOfAttempt && formatTimestamp(log?.dateOfAttempt)) || "N/A"}
                        </td>
                        <td className="text-start pe-0">
                            {(log?.responseDate && formatTimestamp(log?.responseDate)) || "N/A"}
                        </td>

                        <td className="text-start pe-0">{log?.responseMessage || "N/A"}</td>
                        <td className="text-start pe-0 notification-status">
                            <span className={`status-circle `} />
                            <span> {log.status || "N/A"}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
});
