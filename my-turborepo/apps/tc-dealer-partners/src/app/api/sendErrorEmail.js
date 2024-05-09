"use server";
import nodemailer from "nodemailer";
export const sendErrorEmail = async ({ to, cc, bcc, subject, text, html }) => {
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
            from: process.env.NEXT_PUBLIC_SENDER_ERROR_EMAIL,
            to,
            cc,
            bcc,
            subject,
            text,
            html
        });

        console.log("Error Email sent successfully!");
    } catch (error) {
        console.error("Error  - sending Email:", error.message);
        throw error;
    }
};
