import AppContext from "@/StateManagement/AppContext";
import { GetAverageResponseTimeByDealer } from "../../../../../services/notificationsService";
import { memo, useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AverageResponseTime = memo(() => {
    const { setShowSpecificWidgetSettings, averageResponseTimeData, setAverageResponseTimeData } =
        useContext(AppContext);

    const { startDate, endDate, dealer } = averageResponseTimeData;
    let utcStartInSeconds = "";
    let utcEndInSeconds = "";
    const [error, setError] = useState("");
    const fetchResults = () => {
        if (startDate && !endDate) {
            setError("Please select valid dates.");
        } else {
            (async () => {
                setAverageResponseTimeData((prevState) => ({
                    ...prevState,
                    loading: true
                }));
                if (startDate && endDate) {
                    var selectedStartDate = new Date(startDate);
                    selectedStartDate.setHours(0, 0, 0, 0);

                    var selectedEndDate = new Date(endDate);
                    selectedEndDate.setHours(23, 59, 59, 999);

                    utcStartInSeconds = Math.floor(selectedStartDate.getTime() / 1000);
                    utcEndInSeconds = Math.floor(selectedEndDate.getTime() / 1000);
                }
                const counts = await GetAverageResponseTimeByDealer({
                    startDate: utcStartInSeconds, //moment(startDate).utc().unix(),
                    endDate: utcEndInSeconds, //moment(endDate).add(1, "days").utc().unix(),
                    dealer: dealer != null ? dealer : ""
                });
                //    console.log("🚀 ~ counts:", counts);
                setAverageResponseTimeData((prevState) => ({
                    ...prevState,
                    count: {
                        ...counts
                    },
                    loading: false,
                    dataInitialized: true
                }));
            })();

            setShowSpecificWidgetSettings((prevState) => ({
                ...prevState,
                show: false,
                label: ""
            }));

            document.body.style.overflow = "auto";
        }
    };

    return (
        <>
            <div className="pb-8">
                <label
                    className="ms-3 text-start w-100"
                    htmlFor="dateRange">
                    Date
                </label>
                <DatePicker
                    selectsRange={true}
                    startDate={averageResponseTimeData?.startDate}
                    endDate={averageResponseTimeData?.endDate}
                    onChange={(updatedDates) => {
                        let [start, end] = updatedDates;

                        setAverageResponseTimeData((prevState) => ({
                            ...prevState,
                            startDate: start,
                            endDate: end
                        }));
                        setError("");
                    }}
                    isClearable={averageResponseTimeData?.startDate || averageResponseTimeData?.endDate} //{true}
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

export { AverageResponseTime };
