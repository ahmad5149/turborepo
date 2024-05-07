import BuyThisWay from "../../../components/howitworks/BuyThisWay";
import MoneyBackGuarantee from "../../../components/howitworks/MoneyBackGuarantee";
import SellAndTradeThisWay from "../../../components/howitworks/SellAndTradeThisWay";
import GetAGuaranteedOffer from "../../../components/howitworks/GetAGuranteedOffer";
import NextStepAfter from "../../../components/howitworks/NextStepAfter";
import HowItWorksPersonalShopper from "../../../components/howitworks/HowItWorksPersonalShopper";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";
import { useHowItWorksPageContent } from "@/sanity/Sanity";
import React from "react";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("How it Works"),
    description: "How it Works Page"
};
const HowItWorksPage = async () => {
    const pageData = await useHowItWorksPageContent();

    if (pageData != null) {
        metadata.title = GetTabName(pageData.metaData.title);
        metadata.description = pageData.metaData.description;
    }
    return (
        <div className="text-center">
            {pageData && (
                <>
                    <BuyThisWay buyThisWay={pageData.buyThisWay} />
                    <MoneyBackGuarantee moneyBackGuarantee={pageData.moneyBackGuarantee} />
                    {pageData.sellAndTradeThisWay && <SellAndTradeThisWay details={pageData.sellAndTradeThisWay} />}
                    <GetAGuaranteedOffer offer={pageData.getAGuaranteedOffer} />
                    <NextStepAfter nextSteps={pageData.nextSteps} />
                    <HowItWorksPersonalShopper personalShopper={pageData.howItWorkPersonalShopper} />
                </>
            )}
        </div>
    );
};

export default HowItWorksPage;
