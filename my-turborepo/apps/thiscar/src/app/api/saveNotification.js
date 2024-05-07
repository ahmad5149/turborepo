"use server";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../services/firebase-admin";
import { getPusherInstance } from "@/utils/pusher/server";
import { NextResponse } from "next/server";
import { storage } from "@/services/firebase-admin";
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

export async function saveNotification({ createdBy, vin, type, description, contactName, pdfBuffer }) {
    try {
        const notification = db.collection("notification");
        const inventory = db.collection("inventory");
        const dealers = db.collection("dealers");
        const users = db.collection("users");
        const secondaryDealership = db.collectionGroup("secondaryDealership");

        //   Check if notification already exist
        const notificationSnapshot = await notification.where("vin", "==", vin).get(); //Get all records with the same VIN

        /* ********* Only send notification again :
         ****** if type is not same
         ****** if dealer decline but they don't sell the car and we(THIScar) sell it the next day,
         ****** if the notification is expired then allow to send again
         ****** if the notification is accepted but later if customer declined then allow to send again
         */
        if (!notificationSnapshot.empty) {
            for (const doc of notificationSnapshot.docs) {
                const notificationData = doc.data();
                if (
                    notificationData.type === type &&
                    notificationData.status.toLowerCase() !== "expired" &&
                    notificationData.status.toLowerCase() !== "declined" &&
                    notificationData.status.toLowerCase() !== "accepted"
                ) {
                    throw new Error("Notification already in process of same type"); //throw error if same type
                }
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
        const primaryUserSnapshot = await users
            .where("chromeDealerId", "==", inventoryData.dealerId)
            .where("receiveNotification", "==", true)
            .get();

        const secondaryUserSnapshot = await secondaryDealership
            .where("chromeDealerId", "==", inventoryData.dealerId)
            .where("receiveNotification", "==", true)
            .get();

        if (primaryUserSnapshot.empty && secondaryUserSnapshot.empty) {
            throw new Error(`Dealer users does not exist against ${vin}`);
        }
        // const dealerContacts = await dealers.doc(dealerSnapshot.docs[0].id).collection("contacts").get();
        // const dealerContactsData = dealerContacts.docs.map((doc) => doc.data());
        // if (dealerContactsData.length <= 0) {
        //     throw new Error(`Dealer contacts does not exist against ${vin}`);
        // }
        const normalizedNotificationData = {
            uuid: uuid.v4(),
            contactId: "",
            contactName: contactName,
            dealerId: dealerData.chromeDealerId,
            dealerName: dealerData.name,
            stockId:
                inventoryData && inventoryData.dealerStockId != null && inventoryData.dealerStockId != ""
                    ? inventoryData.dealerStockId
                    : "",
            status: "",
            type,
            dateOfAttempt: null,
            responseDate: null,
            responseMessage: "",
            vin,
            answerVia: "",
            createdBy,
            createdAt: FieldValue.serverTimestamp(),
            attempt: 0,
            description,
            isResponseConflicted: false
        };

        if (type == "purchase") {
            const formData = new FormData();
            formData.append("file", pdfBuffer);

            const id = normalizedNotificationData.uuid;
            const extension = "pdf";
            const uploadFileName = `PurchaseAgreement/THIScarNotification/${id}.${extension}`;
            formData.append("fileName", uploadFileName);

            const response = await uploadPDF(formData);

            const res = await response.json();
        }

        const result = await notification.add(normalizedNotificationData);

        return { status: 200, message: result.id };
    } catch (error) {
        console.log("Error sending notification:", error.message);
        console.error("Error sending notification:", error.message);
        return { status: 500, message: error.message };
    }
}

async function uploadPDF(formData, method) {
    const file = formData.get("file");
    const uploadFileName = formData.get("fileName");
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    try {
        const buffer = Buffer.from(file, "base64");

        const blob = storage.file(uploadFileName);

        await blob.save(buffer, {
            metadata: {
                contentType: "application/pdf"
            }
        });
        // this is to ensure the photo is public and available for download.
        await blob.makePublic();

        const pdfUrl = blob.publicUrl();
        return NextResponse.json({ Message: "Success", publicUrl: pdfUrl, status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}
