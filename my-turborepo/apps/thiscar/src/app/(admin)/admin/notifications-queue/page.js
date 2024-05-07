import ThisCarNotifications from "../../../../components/admin/conflictedNotifications/conflictedNotifications";
import { fetchConflictedNotifications } from "@/services/notificationsService";

export const metadata = {
    title: "Notifications Queue",
    description: "Notifications Queue Page"
};

const ConflictedNotificationsPage = async ({ params, searchParams }) => {
    const sortby = searchParams?.sortBy || "dateOfAttempt._seconds";
    const sortOrder = searchParams?.sortOrder || "desc";
    const q = searchParams?.q;
    const status = searchParams?.status || "";
    const type = searchParams?.type || "";

    const response = await fetchConflictedNotifications({ q, status, type, sortby, sortOrder });
    const notifications = response?.hits?.map((item) => item?.document) || [];

    return (
        <div className="text-center">
            <ThisCarNotifications
                notifications={notifications}
                notificationFound={response.found}
            />
        </div>
    );
};

export default ConflictedNotificationsPage;
