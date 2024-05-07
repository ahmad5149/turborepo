import Script from "next/script";
import Faq from "../../../components/support/Faq/Faq";
import SupportBanner from "../../../components/support/supportBanner/SupportBanner";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";
import { useFaqPageContent, useSupportPageContent } from "@/sanity/Sanity";
import React from "react";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("Contact"),
    description: "Contact Page"
};

const SupportPage = async () => {
    const pageData = await useSupportPageContent();
    const faqPageData = await useFaqPageContent();

    if (pageData != null) {
        metadata.title = GetTabName(pageData.metaData.title);
        metadata.description = pageData.metaData.description;
    }
    return (
        <div className="text-center">
            <Script src={`https://www.google.com/recaptcha/api.js?render=${appConfig.RECAPTCHA_SITE_KEY}`} />
            {pageData && (
                <SupportBanner
                    questionSection={pageData.questionSection}
                    chatSection={pageData.chatSection}
                />
            )}
            {faqPageData && (
                <>
                    {" "}
                    <Faq faq={faqPageData} />
                </>
            )}
        </div>
    );
};

export default SupportPage;
