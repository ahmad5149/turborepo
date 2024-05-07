import ThisCarNotifications from "../../../../components/admin/thisCarNotifications/ThisCarNotifications";
import NotificationMobileListings from "../../../../components/admin/thisCarNotifications/NotificationMobileListings";
import { fetchNotifications } from "@/services/notificationsService";

export const metadata = {
    title: "ThisCar Notifications",
    description: "ThisCar Notifications Page"
};

const NotificationsPage = async ({ params, searchParams }) => {
    const sortby = searchParams?.sortBy || "dateOfAttempt._seconds";
    const sortOrder = searchParams?.sortOrder || "desc";
    const q = searchParams?.q;
    const status = searchParams?.status || "";
    const type = searchParams?.type || "";

    const response = await fetchNotifications({ q, status, type, sortby, sortOrder });
   
    const notifications = response?.hits?.map((item) => item?.document) || [];

    return (
        // <div className="text-center">
        //     <ThisCarNotifications
        //         notifications={notifications}
        //         notificationFound = {response.found}
        //     />
        // </div>

        <div className="text-center">
            {/* <InfiniteScrollList></InfiniteScrollList> */}
            <div className="desktop-listing">
                <ThisCarNotifications
                    notifications={notifications}
                    notificationFound={response.found}
                />
            </div>
            <div className="mobile-listing">
                <NotificationMobileListings
                    notifications={notifications}
                    notificationFound={response.found}
                />
            </div>
        </div>
    );
};

export default NotificationsPage;
