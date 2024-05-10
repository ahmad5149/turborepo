import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { fetchNotificationLogs } from "@/services/notificationsService";
import { LogsTableData } from "./LogsTableData";
import { ResponseTimeline } from "./ResponseTimeline";
import AppContext from "@/StateManagement/AppContext";

export const NotificationLogs = ({ vinId, setShowLogs,requestedUser,requestedTime }) => {
    const { notificationId } = useContext(AppContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responseTimeline, setResponseTimeline] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetchNotificationLogs(notificationId, vinId).then((res) => {
            setLogs(res);
            setLoading(false);
        });
    }, [vinId]);
    return (
        <div
            className={`modal show modal-lg`}
            id="logsModal"
            style={{ display: "block" }}
            role="dialog">
            <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content">
                    <div className="modal-header">
                        {!!responseTimeline?.length && (
                            <FontAwesomeIcon
                                className="cursor-pointer"
                                onClick={() => {
                                    setLoading(false);
                                    setResponseTimeline([]);
                                }}
                                icon={faArrowLeft}
                            />
                        )}

                        <h3 className="modal-title">{responseTimeline?.length ? "Timeline" : "Notification Logs"}</h3>
                        <button
                            onClick={() => setShowLogs(false)}
                            type="button"
                            className="close closeModal bg-transparent border-0"
                            data-bs-dismiss="modal">
                            <FontAwesomeIcon
                                icon={faXmark}
                                size="lg"
                            />
                        </button>
                    </div>
                    <div className="modal-body modal-style-body notification-log-body" >
                        {!!!responseTimeline?.length && (
                            <LogsTableData
                                logs={logs}
                                loading={loading}
                                setResponseTimeline={setResponseTimeline}
                                setLoading={setLoading}
                            />
                        )}
                        {!!responseTimeline?.length && <ResponseTimeline responseTimeline={responseTimeline} />}
                    </div>
                    <div
                        className="modal-footer notification-log-footer"
                       >
                        {/* Container for headings */}
                        <div className="notification-log-footer-wrap">
                            <span className="notification-log-footer-row">
                                <h6 >Requestor:</h6>
                                <span>{requestedUser}</span>
                            </span>
                            <span className="notification-log-footer-row">
                                <h6 >Request Initiated:</h6>
                                <span>{requestedTime}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
