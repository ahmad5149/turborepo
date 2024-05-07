import AppContext from "@/StateManagement/AppContext";
import { GetResponsesTableData } from "@/services/notificationsService";
import { memo, useContext, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { searchDealer } from "@/services/dealerService";
import moment from "moment";

const types = [
    { value: "All", label: "All" },
    { value: "available", label: "Available" },
    { value: "purchase", label: "Purchase" },
    { value: "24hourhold", label: "24hr Hold" }
];

export const DealerResponseBarFilters = memo(({ dealerOptions }) => {
    const { setShowSpecificWidgetSettings, responseDealerTable, setResponseDealerTable } = useContext(AppContext);
    // const { startDate, endDate, dealer, type } = responseDealerBar;
    const { startDate, endDate, dealer, type } = responseDealerTable;
    const [selectedDealer, setSelectedDealer] = useState(dealer?.value ? [dealer] : []);
    const [selectedType, setSelectedType] = useState(type?.value ? type : types[0]);
    const [dealers, setDealers] = useState(dealerOptions);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchResults = () => {
        if (startDate && !endDate) {
            setError("Please select valid dates.");
        } else {
            (async () => {
                // setResponseDealerBar((prevState) => ({
                //     ...prevState,
                //     loading: true
                // }));
                // const { total, data } = await GetResponsesCountPerDealer({
                //     startDate,
                //     endDate,
                //     dealer,
                //     type: selectedType?.value
                // });
                // setResponseDealerBar((prevState) => ({
                //     ...prevState,
                //     data: data,
                //     total: total,
                //     loading: false
                // }));

                setResponseDealerTable((prevState) => ({
                    ...prevState,
                    loading: true
                }));
                const { total, data } = await GetResponsesTableData({
                    startDate: moment(startDate).utc().unix(),
                    endDate: moment(endDate).add(1, "days").utc().unix(),
                    dealer,
                    type: selectedType?.value
                });
                setResponseDealerTable((prevState) => ({
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
            // }
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
            <div>
                <label
                    className="ms-3 text-start w-100"
                    htmlFor="dateRange">
                    Date
                </label>
                <DatePicker
                    selectsRange={true}
                    startDate={responseDealerTable?.startDate}
                    endDate={responseDealerTable?.endDate}
                    onChange={(updatedDates) => {
                        let [start, end] = updatedDates;

                        setResponseDealerTable((prevState) => ({
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
                        setResponseDealerTable((prevState) => ({
                            ...prevState,
                            dealer: e
                        }));
                    }}
                />
            </div>
            <div className="my-2">
                <label
                    className="ms-3 text-start w-100"
                    htmlFor="type">
                    Type
                </label>
                <Select
                    name="type"
                    options={types}
                    isClearable={false}
                    isMulti={false}
                    isLoading={isLoading}
                    isSearchable={false}
                    // onInputChange={handleChangeDealerShip}
                    value={selectedType}
                    onChange={(e) => {
                        setSelectedType(e);
                        setResponseDealerTable((prevState) => ({
                            ...prevState,
                            type: e
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
