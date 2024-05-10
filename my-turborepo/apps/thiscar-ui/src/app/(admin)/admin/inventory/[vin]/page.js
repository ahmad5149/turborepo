import React from "react";
import EditInventory from "../../../../../components/admin/inventory/EditInventory";
import { db } from "../../../../../services/firebase-admin";
import { updateInventory, deletePhoto, uploadUnprocessedImages } from "../../../../../services/inventoryService";

const getCarData = async (vin) => {
    try {
        const collectionRef = db.collection("inventory");
        const querySnapshot = await collectionRef.doc(vin).get();

        if (!querySnapshot.exists) {
            console.log("No matching documents.");
            return null;
        }

        // Assuming there is only one document with the given VIN
        const carData = querySnapshot.data();
        const carHistory = await db
            .collection("inventoryHistory")
            .where("vin", "==", vin)
            .orderBy("createdAt", "desc")
            .limit(500)
            .select("price", "createdAt", "dealerPrice")
            .get();

        if (!carHistory.empty) {
            carData.history = carHistory.docs.map((d) => ({
                ...d.data(),
                createdAt: d.get("createdAt").toDate().toLocaleString("en-US", { timeZone: "America/Chicago" })
            }));
        }
        return JSON.parse(JSON.stringify(carData));
    } catch (error) {
        console.log(error.message);
        console.error("Error getting documents: ", error);
        return "null";
    }
};

async function InventoryDetails({ params }) {
    if (!params.vin || typeof params.vin !== "string") {
        return <p>No vin found</p>;
    } else {
        const carData = await getCarData(params.vin);
        if (carData !== null) {
            return (
                <div className="text-center">
                    <EditInventory
                        updateInventory={updateInventory}
                        carData={carData}
                        deletePhoto={deletePhoto}
                        uploadUnprocessedImages={uploadUnprocessedImages}></EditInventory>
                </div>
            );
        } else {
            return <p>Could not find car with this vin</p>;
        }
    }
}

export default InventoryDetails;
