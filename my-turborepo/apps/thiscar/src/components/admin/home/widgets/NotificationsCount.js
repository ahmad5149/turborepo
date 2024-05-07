"use client";
import React, { useEffect, useState, useRef } from "react";

function NotificationsCount({ notificationsData, GetNotificationsCount }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Define state variables
    const [totalNotifications, setTotalNotifications] = useState(notificationsData.total ?? 0);
    const [purchaseCount, setPurchaseCount] = useState(notificationsData.purchaseCount ?? 0);
    const [availableCount, setAvailableCount] = useState(notificationsData.availableCount ?? 0);
    const [holdCount, setHoldCount] = useState(notificationsData.holdCount ?? 0);
    useEffect(() => {
        GetNotificationsCount().then((data) => {
            setTotalNotifications(data.total ?? 0);
            setPurchaseCount(data.purchaseCount ?? 0);
            setAvailableCount(data.availableCount ?? 0);
            setHoldCount(data.holdCount ?? 0);
        });
    }, [GetNotificationsCount]);
    const renderChart = async (notificationsData) => {
        const ApexCharts = (await import("apexcharts")).default;
        const chartElement = chartRef.current;
        const optionsConfig = {
            // series: [notificationsData.purchaseCount, notificationsData.availableCount, notificationsData.holdCount],
            series: [purchaseCount, availableCount, holdCount],
            labels: ["Purchased", "Available", "24 Hours Hold"],
            chart: {
                type: "donut"
            },
            animations: false,
            legend: { show: false },
            dataLabels: { enabled: true },
            plotOptions: {
                pie: {
                    size: 360
                }
            }
        };
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new ApexCharts(chartElement, optionsConfig);
        chartInstanceRef.current?.render();
    };
    useEffect(() => {
        renderChart(purchaseCount, availableCount, holdCount);
    }, [purchaseCount, availableCount, holdCount]);

    return (
        <>
            {/*begin::Card*/}
            <div className="card h-100">
                <div className="card-header pt-7">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label fw-bold text-gray-800">Notifications Today</span>
                        <span className="text-gray-400 mt-1 fw-semibold fs-6">
                            Total: {totalNotifications} Notifications
                        </span>
                    </h3>
                </div>
                {/*begin::Card body*/}
                <div
                    className="card-body "
                    style={{ paddingBottom: "0" }}>
                    {/*begin::Wrapper*/}
                    <div className="d-flex flex-wrap">
                        {/*begin::Chart*/}
                        <div className="d-flex flex-center w-300px me-9 mb-5">
                            <div className="pt-0 rounded-xl my-auto pb-2">
                                <div
                                    className="mb-n10"
                                    ref={chartRef}></div>
                            </div>
                        </div>
                        {/*end::Chart*/}
                        {/*begin::Labels*/}
                        <div className="d-flex flex-column justify-content-center flex-row-fluid pe-11 mb-5">
                            <div className="d-flex fs-6 fw-semibold align-items-center mb-3">
                                <div className="bullet bg-primary me-3"></div>
                                <div className="text-gray-400">Purchased</div>
                                <div className="ms-auto fw-bold text-gray-700">{purchaseCount}</div>
                            </div>

                            <div className="d-flex fs-6 fw-semibold align-items-center mb-3">
                                <div className="bullet bg-success me-3"></div>
                                <div className="text-gray-400">Available</div>
                                <div className="ms-auto fw-bold text-gray-700">{availableCount}</div>
                            </div>

                            <div className="d-flex fs-6 fw-semibold align-items-center">
                                <div className="bullet bg-warning  me-3"></div>
                                <div className="text-gray-400">24 Hours Hold</div>
                                <div className="ms-auto fw-bold text-gray-700">{holdCount}</div>
                            </div>
                        </div>
                        {/*end::Labels*/}
                    </div>
                    {/*end::Wrapper*/}
                </div>
                {/*end::Card body*/}
            </div>
            {/*end::Card*/}
        </>
    );
}

export default NotificationsCount;
