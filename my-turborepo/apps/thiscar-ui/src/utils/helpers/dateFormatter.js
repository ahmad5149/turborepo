import { toDate } from "date-fns-tz";

export function formatTimestamp(timestamp) {
    if (timestamp) {
        let milliseconds = timestamp._seconds * 1000;
        if (timestamp._nanoseconds && timestamp._nanoseconds > 0) {
            milliseconds += timestamp._nanoseconds / 1000000;
        }
        const date = toDate(milliseconds, { timeZone: "UTC" });
        const formattedDate = date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            //second: "numeric", // Add seconds
            hour12: true
        });
        return formattedDate;
    } else {
        return "N/A";
    }
}
export const formatThisCarNotificationDate = (notifications) => {
    const formattedNotifications = notifications?.map((notification) => {
        let formattedResponseDate = "N/A";
        let formattedDateOfAttempt = "N/A";

        if (notification && notification?.dateOfAttempt) {
            formattedDateOfAttempt = formatTimestamp(notification.dateOfAttempt);
        }
        if (notification && notification?.responseDate) {
            formattedResponseDate = formatTimestamp(notification.responseDate);
        }
        return { ...notification, responseDate: formattedResponseDate, dateOfAttempt: formattedDateOfAttempt };
    });
    return formattedNotifications;
};

export const formatOffsiteNotificationDate = (notifications) => {
    const formattedNotifications = notifications.map((notification) => {
        let formattedSentDate = "N/A";
        if (notification && notification?.createdAt) {
            formattedSentDate = formatTimestamp(notification.createdAt);
        }

        return { ...notification, createdAt: formattedSentDate };
    });
    return formattedNotifications;
};
