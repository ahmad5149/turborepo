"use server";

import { resend } from "@/services/email";
import { saveNotification } from "../app/api/saveNotification";

export async function buyNow(prevState, formData) {
    const dealer = formData.get("dealer");
    const name = formData.get("userName");
    const stockNo = formData.get("stockNo");
    const vin = formData.get("vin");
    const price = formData.get("price");
    const email = formData.get("email");
    const dealerstockNo = formData.get("dealerstockNo");
    const requestingDealerId = formData.get("requestingDealerId");
    const requestingDealerName = formData.get("requestingDealerName");

    const html = `
    Purchase Request 
    Dealer ${dealer} 
    User ${name}
    Email ${email}
    Stock# ${stockNo}
    VIN ${vin}
    Partner Price $${Number(price).toLocaleString()}
    Submitted on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}
    `;

    const data = {
        vin: vin,
        type: "purchase",
        description: html,
        dealerStockId: dealerstockNo,
        userName: name,
        requestingDealerId: parseInt(requestingDealerId),
        requestingDealerName: requestingDealerName,
        email: email
    };

    try {
        const response = await saveNotification(data); // Wait for saveNotification to complete
        if (response.status === 200) {
            await resend.emails.send({
                from: process.env.NEXT_PUBLIC_SENDER_EMAIL,
                to: process.env.NEXT_PUBLIC_PURCHASE_CAR_EMAIL,
                // cc: "fahadullah.thiscar@nxvt.com",
                subject: `${process.env.NODE_ENV !== "production" ? "TEST" : "ALERT"} Partner Purchase Request`,
                text: html
            });
            return { status: 200, message: "" };
        } else {
            return { status: 500, message: response.message };
        }
    } catch (error) {
        return { status: 500, message: "" };
    }
}
