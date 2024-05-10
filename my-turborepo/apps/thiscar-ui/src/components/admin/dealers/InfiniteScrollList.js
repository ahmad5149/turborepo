"use client";
// InfiniteScrollList.js
import React, { useState, useEffect } from "react";
import { db } from "../../../services/firebase-admin";

const InfiniteScrollList = () => {
    const [data, setData] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            setLoading(true);

            let query = db.collection("dealers");

            if (lastVisible) {
                query = query.startAfter(lastVisible);
            }

            const snapshot = await query.limit(10).get();

            const newData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setData((prevData) => [...prevData, ...newData]);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        } catch (error) {
            console.log(error.message);
            console.error("Error fetching documents: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []); // Initial load

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
            fetchDocuments();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("wheel", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleScroll);
        };
    }, [handleScroll]);

    return (
        <div>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>{/* Render your list items here */}</li>
                ))}
            </ul>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default InfiniteScrollList;
