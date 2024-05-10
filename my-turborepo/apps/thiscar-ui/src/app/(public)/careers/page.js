import Cards from "@/components/careers/Cards";
import PerfectPosition from "@/components/careers/PerfectPosition";
import { appConfig } from "../../../appConfig";
import { GetTabName } from "@/utils/WebPageUtil";
import { useCareersPageContent } from "@/sanity/Sanity";
import React from "react";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("Careers"),
    description: "Careers Page"
};
const Careers = async () => {
    const pageData = await useCareersPageContent();

    if (pageData != null) {
        metadata.title = GetTabName(pageData.metaData.title);
        metadata.description = pageData.metaData.description;
    }
    return (
        <div className="text-center">
            {pageData && (
                <>
                    {pageData.position && <PerfectPosition perfectPosition={pageData.position} />}
                    <Cards
                        cards={pageData.pinnedTile}
                        card={pageData.jobInformation}
                    />
                </>
            )}
        </div>
    );
};

export default Careers;
