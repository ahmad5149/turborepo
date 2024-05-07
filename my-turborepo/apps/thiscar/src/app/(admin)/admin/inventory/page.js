import InventoryContainer from "../../../../components/admin/inventory/InventoryContainer";
import { fetchInvData } from "../../../../services/inventoryService";
import { saveNotification } from "../../../../app/api/saveNotification";
import { inventoryPageContent } from "@/sanity/Sanity";
import { appConfig } from "../../../../appConfig";

export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: "Inventory",
    description: "Inventory Page"
};

const InventoryPage = async ({ params, searchParams }) => {
    const pageData = await inventoryPageContent();
    const query = searchParams?.q || "";
    const dealerName = searchParams?.name || "";

    const data = await fetchInvData();

    return (
        <div className="text-center">
            <InventoryContainer
                inventory={data}
                saveNotification={saveNotification}
                notification={pageData}
                query={query}
                dealerName={dealerName}
            />
        </div>
    );
};

export default InventoryPage;
