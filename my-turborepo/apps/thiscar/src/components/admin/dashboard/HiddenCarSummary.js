"use client";
import { useState, useEffect, useRef } from "react";
import "../../../contents/scss/admin/hiddenCarSummary.scss";
import { GetFilteredHiddenCarsCount, GetTotalCarsCount } from "../../../services/carService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function HiddenCarSummary({ carSummary }) {
    const datePickerRef = useRef(null);
    const [totalCars, setTotalCars] = useState(carSummary.pagination.total);
    const [hiddenCars, setHiddenCars] = useState(carSummary.hiddenCars);

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const handleChange = async (selectedDates, dateStr, instance) => {
        let cars;
        // Handle the date change event here
        if (selectedDates && selectedDates.length == 2) {
            cars = await GetFilteredHiddenCarsCount(selectedDates[0], selectedDates[1]);
        } else if (selectedDates && selectedDates.length == 1) {
            cars = await GetFilteredHiddenCarsCount(selectedDates[0], "");
        }
        setHiddenCars(cars.hiddenCars);
    };

    const handleDateChange = async () => {};
    useEffect(() => {
        const fetchData = async () => {
            let cars;
            if (dateRange[0] != null && dateRange[1] != null) {
                cars = await GetFilteredHiddenCarsCount(dateRange[0], dateRange[1]);
                // setTotalCars(cars.pagination.out_of - cars.hiddenCars);
                setHiddenCars(cars.hiddenCars);
            } else if (dateRange[0] != null && dateRange[1] == null) {
                cars = await GetFilteredHiddenCarsCount(dateRange[0], "");
                // setTotalCars(cars.pagination.out_of - cars.hiddenCars);
                setHiddenCars(cars.hiddenCars);
            } else if (dateRange[0] == null && dateRange[1] == null) {
                cars = await GetTotalCarsCount();
                setTotalCars(cars.pagination.total);
                setHiddenCars(cars.hiddenCars);
            }
            // Do something with the cars data
        };

        fetchData();
    }, [dateRange]);
    useEffect(() => {
        loadGoogleCharts();

        // Cleanup function
        return () => {
            // Remove the Google Charts script from the DOM when component unmounts
            const script = document.querySelector('script[src="https://www.gstatic.com/charts/loader.js"]');
            if (script) {
                document.head.removeChild(script);
            }
        };
    }, [hiddenCars]);

    useEffect(() => {
        loadGoogleCharts();

        // Cleanup function
        return () => {
            // Remove the Google Charts script from the DOM when component unmounts
            const script = document.querySelector('script[src="https://www.gstatic.com/charts/loader.js"]');
            if (script) {
                document.head.removeChild(script);
            }
        };
    }, []);

    const loadGoogleCharts = () => {
        // Check if google.visualization is available (already loaded)
        if (window.google && window.google.visualization) {
            drawChart();
        } else {
            // Load Google Charts library
            const script = document.createElement("script");
            script.src = "https://www.gstatic.com/charts/loader.js";
            script.onload = () => {
                google.charts.load("current", { packages: ["corechart", "bar", "line"] });
                google.charts.setOnLoadCallback(drawChart);
            };
            document.head.appendChild(script);
        }
    };

    const drawChart = () => {
        const data = google.visualization.arrayToDataTable([
            ["Cars", "Count"],
            ["Active", totalCars],
            ["Hidden", hiddenCars]
        ]);

        const options = {
            title: "Hidden Cars Summary",
            colors: ["#90EE90", "#f6aa33"]
        };

        const chart = new google.visualization.PieChart(document.getElementById("kt_docs_google_chart_pie"));
        chart.draw(data, options);
    };
    return (
        <>
            <div className="card h-100">
                <div className="card-body d-flex align-items-end pt-0">
                    <div className="d-flex align-items-center flex-wrap">
                        <div className="w-100 summary-header d-flex justify-content-between">
                            <h3 className="d-flex card-title align-items-start flex-column">
                                <span className="card-label fw-bold text-gray-800">Vehicle Summary</span>
                                <span className="text-gray-400 mt-1 fw-semibold fs-6">
                                    Total: {totalCars + hiddenCars} cars
                                </span>
                            </h3>

                            <div className="card-toolbar">
                                <div className="d-flex me-4">
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => {
                                            setDateRange(update);
                                            handleDateChange();
                                        }}
                                        isClearable={true}
                                        className="ms-2 form-control form-control-solid"
                                        placeholderText="Select date range"
                                        icon="bi bi-calendar-check"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex me-7 me-xxl-10">
                            <div
                                id="kt_docs_google_chart_pie"
                                style={{ width: "400px", height: "300px" }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HiddenCarSummary;
