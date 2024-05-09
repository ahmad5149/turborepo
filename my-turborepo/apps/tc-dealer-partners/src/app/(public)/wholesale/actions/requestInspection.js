"use server";

import { db } from "@/services/firebase-admin";
import { redirect } from "next/navigation";
import { resend } from "@/services/email";
import * as fastcsv from "fast-csv";

export async function RequestInspectionAction(prevState, formData) {
    const inspectionRequest = Object.fromEntries(formData);

    const vehicles = [];
    const errors = {};

    let index = 0;

    while (inspectionRequest[`vin-${index}`]) {
        if (!inspectionRequest[`miles-${index}`] || inspectionRequest[`miles-${index}`]?.length <= 1) {
            errors[inspectionRequest[`vin-${index}`]] = {
                ...errors[inspectionRequest[`vin-${index}`]],
                miles: "Please provide current miles"
            };
        }

        if (
            !inspectionRequest[`reserve-${index}`] ||
            parseInt(inspectionRequest[`reserve-${index}`].replace(/,/g, "")) < 2
        ) {
            errors[inspectionRequest[`vin-${index}`]] = {
                ...errors[inspectionRequest[`vin-${index}`]],
                reserve: "Please provide a valid reserve price"
            };
        }

        if (inspectionRequest.dealer.length <= 1 || inspectionRequest.user.length <= 1) {
            errors.dealers = "Please contact THIScar for assitance";
        }

        vehicles.push({
            vin: inspectionRequest[`vin-${index}`],
            year: inspectionRequest[`year-${index}`],
            make: inspectionRequest[`make-${index}`],
            model: inspectionRequest[`model-${index}`],
            miles: inspectionRequest[`miles-${index}`],
            reserve: inspectionRequest[`reserve-${index}`],
            comments: inspectionRequest[`comments-${index}`],
            status: "inspection_requested",
            dealer: inspectionRequest.dealer,
            dealerURI: inspectionRequest.dealerURI,
            createdAt: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })
        });

        index++;
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    const batch = db.batch();

    for (const v of vehicles) {
        const vRef = db.collection("inspectionRequests").doc();
        batch.set(vRef, { ...v, status: "inspection_requested", createdAt: new Date(), updatedAt: new Date() });
    }

    try {
        await batch.commit();

        const wholesaleContactRef = await db
            .collection("dealers")
            .doc(inspectionRequest.dealerId)
            .collection("wholesaleContacts")
            .get();

        const wholesaleContacts = wholesaleContactRef.docs.map((c) => c.get("email"));

        const csvBuff = await fastcsv.writeToBuffer(vehicles, {
            headers: ["vin", "year", "make", "model", "miles", "reserve", "dealer", "createdAt", "comments"]
        });

        const html = `
        THIScar, LLC Wholesale Units
        Created on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}
        Location: ${inspectionRequest.dealer}
        
        Check Attached Spreadsheet for unit details
        `;

        const contacts =
            process.env.NODE_ENV === "production"
                ? ["lhazelet@acvauctions.com", "ACVrun-list@thiscar.com", "john@thiscar.com"]
                : [];

        await resend.emails.send({
            from: "partners_site@thiscar.com",
            to: process.env.NODE_ENV !== "production" ? [...wholesaleContacts] : [...contacts, ...wholesaleContacts],
            subject: `${
                process.env.NODE_ENV !== "production" ? "TEST TEST TEST" : "ALERT"
            } THIScar Wholesale Units Added`,
            text: html,
            attachments: [
                {
                    filename: `${new Date().getTime()}-tc-wholesale-inventory.csv`,
                    content: csvBuff
                }
            ]
        });
    } catch (error) {
        console.error(error);
    }
    redirect("/wholesale");
}
