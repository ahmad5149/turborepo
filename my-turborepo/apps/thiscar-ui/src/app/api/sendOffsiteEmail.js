"use server";
import nodemailer from "nodemailer";
export const sendOffsiteEmail = async ({ to, cc, bcc, subject, text, html }) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "resend",
            host: "smtp.resend.com",
            port: 465,
            auth: {
                user: "resend",
                pass: process.env.NEXT_PUBLIC_RESEND_KEY
            }
        });

        // Send email
        await transporter.sendMail({
            from: process.env.NEXT_PUBLIC_SENDER_NOTIFICATION_EMAIL,
            to,
            cc,
            bcc,
            subject,
            text,
            html
        });

        console.log("Offsite Notification - Email sent successfully!");
    } catch (error) {
        console.error("Error  - sending Offsite Notification Email:", error.message);
        throw error;
    }
};
