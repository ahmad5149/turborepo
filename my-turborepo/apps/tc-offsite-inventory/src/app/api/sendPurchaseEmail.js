"use server";
import axios from "axios";
import { sendEmail } from "./sendEmail";

export default async function sendPurchaseEmail(emailInfo) {
    debugger;
    try {
        await sendEmail({ to: emailInfo.to, subject: emailInfo.subject, text: emailInfo.text,pdfBuffer:emailInfo.pdfBuffer })
            .then((x) => {
                console.log(x);
            })
            .catch((err) => {
                console.log(err);
            });
        // Create transporter

        return { status: 200, message: "Email sent successfully!" };
    } catch (error) {
        //throw error;
        return { status: 500, message: error.message };
    }
}
