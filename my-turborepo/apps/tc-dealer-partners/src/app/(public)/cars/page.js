import SRP from "../../../components/cars/AccessingSRPData";
import { offsiteFindYourRidePageContent } from "@/sanity/Sanity";
import { GetAllFacets } from "@/services/carService";
import { appConfig } from "../../../appConfig";
import React from "react";

import { GetDealerData } from "@/utils/helpers/dealerHelper";
import CarWithInvalidVIN from "@/components/cars/cardetails/CarWithInvalidVIN";
import { CheckAuth } from "../page";
import { redirect } from "next/navigation";

export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

const CarsPage = async ({ searchParams }) => {
    const user = await CheckAuth();

    if (!user) {
        redirect("/");
    }

    const findYourRideData = await offsiteFindYourRidePageContent();
    const dealerData = await GetDealerData(user.dealer);

    const allFacets = await GetAllFacets(dealerData?.chromeDealerId);

    let dealerPackAmount = dealerData?.packAmount ?? 500;
    return (
        <div className="text-center">
            {allFacets && findYourRideData && (
                <SRP
                    allFacets={allFacets}
                    queryParams={searchParams}
                    marketingDetails={findYourRideData.marketingDetails}
                    carTileContactInfo={findYourRideData.contactDetailsText}
                    dealerConfig={dealerData}
                    packAmount={dealerPackAmount}
                    dealerName={dealerData?.name ?? "THIScar.com"}
                />
            )}
            {!findYourRideData && <CarWithInvalidVIN message={"No sanity data found!"}></CarWithInvalidVIN>}
            {!allFacets && <CarWithInvalidVIN message={"Sorry, no cars found!"}></CarWithInvalidVIN>}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
          .aa-apv-card-row.aa-apv-row-container {
            background: #f4f6f8 !important;
          }
        `
                }}
            />
        </div>
    );
};
export default CarsPage;
export const dynamic = "force-dynamic";
