"use server";

import { resend } from "@/services/email";
import { db } from "@/services/firebase-admin";

import * as fastcsv from "fast-csv";

export async function downloadInspectionRequests({ email, dealer, status }) {
    let colRef = db.collection("inspectionRequests");

    if (dealer) {
        colRef = colRef.where("dealer", "==", dealer);
    }

    if (status) {
        colRef = colRef.where("status", "==", status);
    }

    let response = await colRef.get();

    let hits = response.docs
        .sort((a, b) => (a.createTime.toDate() > b.createTime.toDate() ? -1 : 1))
        .map((d) => ({
            ...d.data(),
            id: d.id,
            createdAt: d.get("createdAt").toDate().toLocaleString("en-US", { timeZone: "America/Chicago" })
        }));

    const inspectionRequestsByDealer = hits.reduce((acc, req) => {
        acc[req.dealer] = acc[req.dealer] || [];
        acc[req.dealer].push(req);
        return acc;
    }, {});

    const attachments = [];

    const all = await fastcsv.writeToBuffer(hits, {
        headers: [
            "createdAt",
            "status",
            "dealer",
            "user",
            "vin",
            "year",
            "make",
            "model",
            "miles",
            "reserve",
            "comments"
        ]
    });

    attachments.push({
        filename: `${new Date().getTime()}-ALL-INVENTORY-inspections.csv`,
        content: all
    });

    for (const d in inspectionRequestsByDealer) {
        const dealerData = inspectionRequestsByDealer[d];
        const csvBuff = await fastcsv.writeToBuffer(dealerData, {
            headers: [
                "createdAt",
                "status",
                "dealer",
                "user",
                "vin",
                "year",
                "make",
                "model",
                "miles",
                "reserve",
                "comments"
            ]
        });
        const filename = `${new Date().getTime()}-${d.replace(" ", "-")}-inspections.csv`;
        attachments.push({
            filename,
            content: csvBuff
        });
    }

    const html = `
    Inspection File Attached
    Created on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}
    `;
    try {
        await resend.emails.send({
            from: "partners_site@thiscar.com",
            to: email,
            subject: `${process.env.NODE_ENV !== "production" ? "TEST TEST TEST" : "ALERT"} Inspection File`,
            text: html,
            attachments
        });
        return true;
    } catch (error) {
        return false;
    }
}
