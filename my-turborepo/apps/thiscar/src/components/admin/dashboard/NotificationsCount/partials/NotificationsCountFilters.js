import AppContext from "@/StateManagement/AppContext";
import { GetNotificationsCount } from "@/services/notificationsService";
import { memo, useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
export const NotificationsCountFilters = memo(() => {
    const { setShowSpecificWidgetSettings, responseNotificationsCountData, setResponseNotificationsCountData } =
        useContext(AppContext);
    const { count, loading, startDate, endDate } = responseNotificationsCountData;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchResults = () => {
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

            document.body.style.overflow = "auto";
        } else {
            setError("Please select valid dates.");
        }
    };

    return (
        <>
            <div>
                <label
                    className="ms-3 text-start w-100"
                    htmlFor="dateRange">
                    Dates
                </label>
                <DatePicker
                    selectsRange={true}
                    startDate={responseNotificationsCountData?.startDate}
                    endDate={responseNotificationsCountData?.endDate}
                    onChange={(updatedDates) => {
                        let [start, end] = updatedDates;

                        setResponseNotificationsCountData((prevState) => ({
                            ...prevState,
                            startDate: start,
                            endDate: end
                        }));
                        setError("");
                    }}
                    isClearable={true}
                    className=" form-control form-control-solid"
                    placeholderText="Select date range"
                    icon="bi bi-calendar-check"
                />
            </div>
            {!!error?.length && <div className="error">{error}</div>}

            <div
                className="modal-footer"
                style={{ justifyContent: "center" }}>
                <button
                    type="button"
                    className="btn btn-primary custom_btn"
                    onClick={fetchResults}>
                    Find Results
                </button>
            </div>
        </>
    );
});
