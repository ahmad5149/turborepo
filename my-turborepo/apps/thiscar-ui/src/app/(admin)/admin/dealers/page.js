import DealersMobile from "@/components/admin/dealers/DealerMobileListing";
import Dealers from "../../../../components/admin/dealers/Dealers";
import { fetchDealersListing } from "../../../../services/dealerService";

export const metadata = {
    title: "Dealers",
    description: "Dealers Page"
};

const limit = 50;

// Example usage

// don't load in a client component if not needed, pass the data to components
// but use the strength of next for server side components and rendering.
// don't even need an api route for the admin dashboard.
const DealersPage = async ({ params, searchParams }) => {
    const sortBy = searchParams?.sortBy || "name";
    let sortOrder = searchParams?.sortOrder || "asc";

    const active = searchParams?.active || -1;
    const dealersData = await fetchDealersListing(undefined, undefined, undefined, active, sortBy, sortOrder);
    return (
        <div className="text-center">
            {/* <InfiniteScrollList></InfiniteScrollList> */}
            <div className="desktop-listing">
                <Dealers
                    dealersListing={dealersData}
                    totalDealers={dealersData.found}
                    // fetchDealersData={fetchDealersListing}
                />
            </div>
            <div className="mobile-listing">
                <DealersMobile
                    dealersListing={dealersData}
                    totalDealers={dealersData.found}
                />
            </div>
        </div>
    );
};

export default DealersPage;
