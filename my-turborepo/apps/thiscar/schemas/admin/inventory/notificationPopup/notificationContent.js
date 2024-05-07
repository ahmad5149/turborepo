export default {
    title: "Notification Content",
    name: "notificationContent",
    type: "object",
    fields: [
        {
            title: "Notification Content for Email",
            name: "emailContent", // Button text/label Placeholder
            type: "notificationPopup"
        },
        {
            title: "Notification Content for SMS",
            name: "smsContent", // Button text/label Placeholder
            type: "notificationPopup"
        }
    ]
};
