import { Toolbar } from "../../../components/admin/common/toolbar/Toolbar";
import { Widgets } from "@/components/admin/dashboard/Widgets";
import { getAllDealers } from "@/services/dealerService";

export default async function Home({ searchParams }) {
    // const noOfDays = searchParams?.noOfDays ? parseInt(searchParams.noOfDays.toLowerCase()) : 7; // Default to 1 day if not specified
    const dealers = await getAllDealers();

    return (
        <>
            <Toolbar pageName="Dashboard" />

            <div className="container-xxl">
                <div className="row gy-5 g-xl-10">
                    <Widgets dealerOptions={dealers} />
                </div>
            </div>
        </>
    );
}
