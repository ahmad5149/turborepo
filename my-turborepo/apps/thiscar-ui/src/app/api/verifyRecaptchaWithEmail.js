"use server";
import axios from "axios";
import { sendEmail } from "./sendEmail";

export default async function verifyRecaptchaWithEmail(recaptchaResponse, emailInfo) {
    try {
        // Verify recaptcha response
        const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;
        const token = recaptchaResponse;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
        const response = await axios.post(url);
        if (!response.data.success) {
            console.log("Recaptcha verification failed", response?.data?.success);
            throw new Error("reCAPTCHA verification failed");
        } else {
            await sendEmail({ to: emailInfo.to, subject: emailInfo.subject, text: emailInfo.text })
                .then((x) => {
                    console.log(x);
                })
                .catch((err) => {
                    console.log(err);
                });
            // Create transporter
            return { status: 200, message: "Email sent successfully!" };
        }
    } catch (error) {
        //throw error;
        return { status: 500, message: error.message };
    }
}
