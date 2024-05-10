import AppContext from "@/StateManagement/AppContext";
import moment from "moment";
import { memo, useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../../../components/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DealerResponseFilters = memo(() => {
    const { responseDealerData, setResponseDealerData, setShowSpecificWidgetSettings } = useContext(AppContext);
    const { startDate, endDate, dealer } = responseDealerData;

    const currentUser = useAuth();
    const [error, setError] = useState("");

    const fetchResults = () => {
        if (startDate && !endDate) {
            setError("Please select valid dates.");
        } else {
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
                    startDate={responseDealerData?.startDate}
                    endDate={responseDealerData?.endDate}
                    onChange={(updatedDates) => {
                        let [start, end] = updatedDates;

                        setResponseDealerData((prevState) => ({
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
