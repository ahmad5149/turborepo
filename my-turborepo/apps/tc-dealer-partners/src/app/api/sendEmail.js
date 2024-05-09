"use server";
import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, text, pdfBuffer = "" }) => {
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

        if (pdfBuffer != "") {
            // Send email
            await transporter.sendMail({
                from: process.env.NEXT_PUBLIC_SENDER_EMAIL,
                to,
                subject,
                text,
                attachments: [
                    {
                        filename: "purchase_agreement.pdf",
                        content: pdfBuffer,
                        encoding: "base64"
                    }
                ]
            });
        } else {
            await transporter.sendMail({
                from: process.env.NEXT_PUBLIC_SENDER_EMAIL,
                to,
                subject,
                text
            });
        }

        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending Email:", error.message);
        throw error;
    }
};
