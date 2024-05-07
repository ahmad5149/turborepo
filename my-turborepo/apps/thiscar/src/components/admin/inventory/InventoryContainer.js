"use client";
import React, { useState } from "react";
import Inventory from "./Inventory";

function InventoryContainer({ inventory, saveNotification, notification, query, dealerName }) {
    const [currentPage, setCurrentPage] = useState(1);
    return (
        <Inventory
            setCurrentPage={setCurrentPage}
            inventory={inventory}
            saveNotification={saveNotification}
            notification={notification}
            dealerName={dealerName}
            query={query}></Inventory>
    );
}

export default InventoryContainer;
