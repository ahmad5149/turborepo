import AppContext from "@/StateManagement/AppContext";
import { memo, useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { GetVehicleSummary } from "@/services/carService";
import "react-datepicker/dist/react-datepicker.css";

export const InventoryOperationsReportFilters = memo(() => {
    const { hiddenCarData, setHiddenCarData, setShowSpecificWidgetSettings } = useContext(AppContext);
    const [error, setError] = useState("");
    const fetchResults = () => {
        const { startDate, endDate } = hiddenCarData;
        if (startDate && !endDate) {
            setError("Please select valid dates.");
        } else {
            let utcStartInSeconds = "";
            let utcEndInSeconds = "";
            (async () => {
                setHiddenCarData((prevState) => ({
                    ...prevState,
                    loading: true
                }));
                // setLoading(true);
                if (startDate && endDate) {
                    var selectedStartDate = new Date(startDate);
                    selectedStartDate.setHours(0, 0, 0, 0);

                    var selectedEndDate = new Date(endDate);
                    selectedEndDate.setHours(23, 59, 59, 999);

                    utcStartInSeconds = Math.floor(selectedStartDate.getTime() / 1000);
                    utcEndInSeconds = Math.floor(selectedEndDate.getTime() / 1000);
                }
                const res = await GetVehicleSummary(utcStartInSeconds, utcEndInSeconds);
                setHiddenCarData((prevState) => ({
                    ...prevState,
                    count: {
                        ...res
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
                    startDate={hiddenCarData?.startDate}
                    endDate={hiddenCarData?.endDate}
                    onChange={(updatedDates) => {
                        let [start, end] = updatedDates;

                        setHiddenCarData((prevState) => ({
                            ...prevState,
                            startDate: start,
                            endDate: end
                        }));
                        setError("");
                    }}
                    isClearable={hiddenCarData?.startDate || hiddenCarData?.endDate} // Conditionally set isClearable based on startDate and endDate
                    className="ms-2 form-control form-control-solid"
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
