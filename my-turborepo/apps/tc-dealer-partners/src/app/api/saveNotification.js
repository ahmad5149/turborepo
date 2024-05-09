"use server";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@/services/firebase-admin";
import { getPusherInstance } from "@/utils/pusher/server";
const pusherServer = getPusherInstance();
const uuid = require("uuid");

function getCurrentDateTimeFormatted() {
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true
    };

    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString("en-US", options);

    return formattedDateTime;
}

export async function saveNotification({
    vin,
    type,
    description,
    dealerStockId,
    userName,
    requestingDealerId,
    requestingDealerName,
    email
}) {
    try {
        const notification = db.collection("offsiteNotification");
        const inventory = db.collection("inventory");
        const dealers = db.collection("dealers");

        // Check if notification already exist
        const notificationSnapshot = await notification.where("vin", "==", vin).get();
        if (!notificationSnapshot.empty) {
            const notificationData = notificationSnapshot.docs[0].data();
            if (notificationData.status == null || notificationData.status == "submitted") {
                throw new Error("Notification already in process");
            }
        }

        // Check vehicle exists in inventory
        const inventorySnapshot = await inventory.where("vin", "==", vin).get();
        if (inventorySnapshot.empty) {
            throw new Error(`Vehicle is not in our inventory: ${vin}`);
        }
        const inventoryData = inventorySnapshot.docs[0].data();

        // Check dealer exists
        const dealerSnapshot = await dealers.where("chromeDealerId", "==", inventoryData.dealerId).get();
        if (dealerSnapshot.empty) {
            throw new Error(`Dealer does not exist against ${vin}`);
        }
        const dealerData = dealerSnapshot.docs[0].data();
        const createDate = FieldValue.serverTimestamp();

        const normalizedNotificationData = {
            uuid: uuid.v4(),
            contactId: 0,
            contactName: null,
            dealerId: dealerData.chromeDealerId,
            dealerName: dealerData.name,
            dealerStockId: dealerStockId,
            type: type,
            stockId: inventoryData.stockId,
            status: "submitted",
            vin,
            createdBy: null,
            createdAt: createDate,
            description,
            userName: userName,
            requestingDealerId: requestingDealerId,
            requestingDealerName: requestingDealerName,
            email: email
        };

        const result = await notification.add(normalizedNotificationData);
        const channel = process.env.NEXT_PUBLIC_ENVIRONMENT ?? "dev";

        await pusherServer.trigger("offsite-notification", channel, {
            uuid: normalizedNotificationData.uuid,
            dealerName: normalizedNotificationData.dealerName,
            userName,
            vin,
            dealerStockId,
            type,
            createdAt: getCurrentDateTimeFormatted(),
            requestingDealerName,
            email,
            notificationId: result.id ?? ""
        });

        console.log(`Notification saved: ${result.id}`);
        return { status: 200, message: result.id };
    } catch (error) {
        console.log("Error sending notification:", error.message);
        console.error("Error sending notification:", error.message);
        return { status: 500, message: error.message };
    }
}
