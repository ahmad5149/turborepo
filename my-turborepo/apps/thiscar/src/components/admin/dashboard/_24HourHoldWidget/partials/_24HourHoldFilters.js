import { memo, useContext, useState } from "react";
import AppContext from "@/StateManagement/AppContext";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { searchDealer } from "@/services/dealerService";
import { Get_24HourHoldData } from "@/services/notificationsService";

import moment from "moment";

export const _24HourHoldFilters = memo(({ dealerOptions }) => {
    const { _24HourHoldData, set_24HourHoldData, setShowSpecificWidgetSettings } = useContext(AppContext);
    const { startDate, endDate, dealer } = _24HourHoldData;
    const [selectedDealer, setSelectedDealer] = useState(dealer?.value ? [dealer] : []);
    const [isLoading, setIsLoading] = useState(false);
    const [dealers, setDealers] = useState(dealerOptions);
    const [error, setError] = useState("");
    const fetchResults = () => {
        if (!startDate || !endDate) {
            setError("Please select valid dates.");
        } else {
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
                    data: data,
                    total: total,
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
    const handleChangeDealerShip = (value) => {
        try {
            setIsLoading(true);
            if (value) {
                searchDealer(value).then((dealers) => {
                    setDealers(dealers);
                });
            } else {
                setDealers(dealerOptions);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching dealer data:", error);
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
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(updatedDates) => {
                        let [start, end] = updatedDates;
                        set_24HourHoldData((prevState) => ({
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
            <div>
                <label
                    className="ms-3 text-start w-100"
                    htmlFor="dealer">
                    Dealer
                </label>
                <Select
                    name="dealer"
                    options={dealers}
                    isClearable={true}
                    isMulti={false}
                    isLoading={isLoading}
                    isSearchable
                    onInputChange={handleChangeDealerShip}
                    value={selectedDealer}
                    onChange={(e) => {
                        setSelectedDealer([e]);
                        set_24HourHoldData((prevState) => ({
                            ...prevState,
                            dealer: e
                        }));
                    }}
                />
            </div>
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
