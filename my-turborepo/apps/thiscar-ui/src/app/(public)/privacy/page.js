import PrivacyPolicy from "../../../components/privacypolicy/PrivacyPolicy";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";
import React from "react";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("Privacy Policy"),
    description: "Privacy Policy Page"
};
const PrivacyPage = async () => {
    return (
        <div className="text-center">
            <PrivacyPolicy />
        </div>
    );
};

export default PrivacyPage;
