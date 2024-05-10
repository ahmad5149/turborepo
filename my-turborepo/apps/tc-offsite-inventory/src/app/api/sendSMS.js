"use server";
import twilio from "twilio";

const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.NEXT_PUBLIC_TWILIO_PHONE;
const client = twilio(accountSid, authToken);

export const sendSMS = async ({ to, body }) => {
  try {
    const message = await client.messages.create({
      to,
      from: twilioPhone,
      body,
    });
    console.log(`SMS sent: ${message.sid}`);
    return { status: 200, message: "SMS sent successfully!",messageSID:message.sid };
    // return message.sid;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    return { status: 500, message: error.message };
    // throw error;
  }
};
