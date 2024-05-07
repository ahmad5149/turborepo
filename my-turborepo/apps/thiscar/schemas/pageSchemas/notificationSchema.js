import notification from "../pages/Notification";
import notificationPopup from "../admin/inventory/notificationPopup/notificationPopup";
import notificationContent from "../admin/inventory/notificationPopup/notificationContent";
import statusDescription from "../admin/inventory/notificationPopup/statusDescription";
import submitResponse from "../notificationResponse/submitResponse";
import confirmationResponse from "../admin/confirmationResponse/confirmationResponse";
import responseDescription from "../admin/confirmationResponse/responseDescription";
import releaseNotification from "../admin/inventory/releaseNotification/releaseNotification";
import releaseReminderNotification from "../admin/inventory/releaseNotification/releaseReminderNotification";
import confirmSaleOrNoSale from "../admin/offsiteNotification/confirmSales/confirmSaleOrNoSale";

export default [
    notification,
    notificationPopup,
    notificationContent,
    statusDescription,
    submitResponse,
    confirmationResponse,
    responseDescription,
    releaseNotification,
    releaseReminderNotification,
    confirmSaleOrNoSale
];
