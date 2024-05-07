"use client";
import React, { Suspense, useEffect, useState } from "react";
import { getCreatedAtCars, getDeletedAtCars } from "../../../../services/inventoryService";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import { useAuth } from "../../../../components/auth";
const LazyLoadedCarsAddedAndRemovedSummary = React.lazy(() => import("./CarsAddedAndRemovedSummary"));

function CarsAddedAndRemovedSummaryWrapper() {
    const [loading, setLoading] = useState(true); // Initially set loading to true
    const [createdAtCarsTotalCount, setCreatedAtCarsTotalCount] = useState(null); // Set initial state to null
    const [deletedTimeCarsTotalCount, setDeletedTimeCarsTotalCount] = useState(null); // Set initial state to null
    const currentUser = useAuth();
    useEffect(() => {
        // Load data asynchronously
        fetchData();
    }, []);

    const fetchData = async () => {
        // Simulate async API calls
        var now = new Date();
        // try {
        //     const createdAtCarsData = await getCreatedAtCars(7);
        //     setCreatedAtCarsTotalCount(createdAtCarsData);
        // } catch (error) {
        //     setCreatedAtCarsTotalCount([0, 0, 0, 0, 0, 0, 0]);
        // }
        // try {
        //     const deletedTimeCarsData = await getDeletedAtCars(7);
        //     setDeletedTimeCarsTotalCount(deletedTimeCarsData);
        // } catch (error) {
        //     setDeletedTimeCarsTotalCount([0, 0, 0, 0, 0, 0, 0]);
        //     console.log("Error getting cdeletedAtCars:", error);
        // }

        const response = await fetch(`/api/car-summary`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${currentUser?.getIdToken()}`
            },
            body: ""
        });
        if (!response.ok) {
            setCreatedAtCarsTotalCount([0, 0, 0, 0, 0, 0, 0]);
            setDeletedTimeCarsTotalCount([0, 0, 0, 0, 0, 0, 0]);
            toast.error(`HTTP error! Status: ${response.status}`);
        }

        const { createdAtCarsData, deletedTimeCarsData } = await response.json();
        setCreatedAtCarsTotalCount(createdAtCarsData);
        setDeletedTimeCarsTotalCount(deletedTimeCarsData);
        setLoading(false); // Set loading to false after fetching real data
    };

    return (
        <Suspense>
            {/* <Suspense fallback={<LoadingSpinner />}>     for spinner after data loading */}
            {/* Display loader until loading becomes false */}
            {loading ? (
                <div className="admin-loading">
                    {" "}
                    <LoadingSpinner />{" "}
                </div>
            ) : (
                <LazyLoadedCarsAddedAndRemovedSummary
                    loading={loading}
                    setLoading={setLoading}
                    createdAtCarsTotalCount={createdAtCarsTotalCount}
                    deletedTimeCarsTotalCount={deletedTimeCarsTotalCount}
                />
            )}
        </Suspense>
    );
}

export default CarsAddedAndRemovedSummaryWrapper;
