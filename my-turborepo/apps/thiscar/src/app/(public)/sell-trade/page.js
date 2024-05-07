import SellOrTrade from "../../../components/selltrade/SellOrTrade";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";
import { useSellAndTradePageContent } from "@/sanity/Sanity";
import GTagLead from "@/components/gtag-lead";
//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;
import React from "react";

export const metadata = {
    title: GetTabName("Sell or Trade"),
    description: "Sell or Trade Page"
};
const SellTrade = async () => {
    const pageData = await useSellAndTradePageContent();
    if (pageData != null) {
        metadata.title = GetTabName(pageData.metaData.title);
        metadata.description = pageData.metaData.description;
    }
    return (
        <div className="text-center">
            {pageData && (
                <>
                    {appConfig.GOOGLE_LEAD_CONVERT ? <GTagLead gtag_lead_id={appConfig.GOOGLE_LEAD_CONVERT} /> : null}
                    <SellOrTrade sellOrTrade={pageData.sellOrTrade} />
                </>
            )}
        </div>
    );
};

export default SellTrade;
