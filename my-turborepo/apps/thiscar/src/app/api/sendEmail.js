"use server";
import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, text }) => {
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
            from: process.env.NEXT_PUBLIC_SENDER_EMAIL,
            to,
            subject,
            text
        });

        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending Email:", error.message);
        throw error;
    }
};
