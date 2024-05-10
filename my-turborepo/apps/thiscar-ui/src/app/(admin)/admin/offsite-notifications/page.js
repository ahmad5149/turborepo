import { inventoryPageContent } from "@/sanity/Sanity";
import OffsiteNotifications from "../../../../components/admin/offsiteNotifications/OffsiteNotifications";
import { transformData } from "../../../../components/admin/offsiteNotifications/Utilities";
import NotificationMobileListings from "../../../../components/admin/offsiteNotifications/NotificationMobileListings";
import { fetchNotifications } from "@/services/offsiteNotificationsService";
import { appConfig } from "@/appConfig";
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: "Offsite Notifications",
    description: "Offsite Notifications"
};

const NotificationsPage = async ({ params, searchParams }) => {
    const sortby = searchParams?.sortBy || "createdAt";
    const sortOrder = searchParams?.sortOrder || "desc";
    const page = searchParams?.page || 1;
    const q = searchParams?.q;
    const response = await fetchNotifications({ q, sortby, sortOrder, page });
    const notifications = transformData(response?.hits || []);
    const sanitizedNotifications = JSON.parse(JSON.stringify(notifications));
    const pageData = await inventoryPageContent();

    return (
        <div className="text-center">
            <div className="desktop-listing">
                <OffsiteNotifications
                    notifications={sanitizedNotifications}
                    confirmSaleOrNoSale={pageData.confirmSaleOrNoSale}
                />
            </div>
            <div className="mobile-listing">
                <NotificationMobileListings notifications={sanitizedNotifications} />
            </div>
        </div>
    );
};

export default NotificationsPage;
