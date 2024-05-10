export default {
    title: "Notification",
    name: "notification",
    type: "document",
    __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
    fields: [
        {
            title: "Title",
            name: "title",
            type: "string"
        },
        {
            title: "Notification",
            name: "notificationContent",
            type: "notificationContent"
        },
        {
            title: "Release Notification",
            name: "releaseNotificationContent",
            type: "releaseNotificationContent"
        },
        {
            title: "Release Reminder Notification",
            name: "releaseNotificationReminderContent",
            type: "releaseNotificationReminderContent"
        },
        {
            title: "Submit Notification Response",
            name: "submitResponse",
            type: "submitResponse"
        },
        {
            title: "Confirmation Response",
            name: "confirmationResponse",
            type: "confirmationResponse"
        },
        {
            title: "Confirm Sale or No Sale - offsite notification",
            name: "confirmSaleOrNoSale",
            type: "confirmSaleOrNoSale"
        }
    ]
};
