import AtTheHeart from "../../../components/about/AtTheHeart";
import AboutPersonalShopper from "../../../components/about/AboutPersonalShopper";
import CarBuying from "../../../components/about/CarBuying";
import SmoothRelaxRide from "../../../components/about/SmoothRelaxRide";
import HowWeRoll from "../../../components/about/HowWeRoll";
import ThisCarPromise from "../../../components/about/ThisCarPromise";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";
import { useAboutPageContent } from "@/sanity/Sanity";
import React from "react";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("About"),
    description: "About Page"
};

export default async function AboutPage() {
    const pageData = await useAboutPageContent();

    if (pageData != null) {
        metadata.title = GetTabName(pageData.metaData.title);
        metadata.description = pageData.metaData.description;
    }
    return (
        <div className="text-center">
            {pageData && (
                <>
                    <AtTheHeart atTheHeart={pageData.atTheHeart} />
                    <AboutPersonalShopper aboutPersonalShopper={pageData.aboutPersonalShopper} />
                    <CarBuying onlineCarBuying={pageData.onlineCarBuying} />
                    <SmoothRelaxRide smoothRelaxRide={pageData.smoothRelaxRide} />
                    {pageData.howWeRoll && <HowWeRoll details={pageData.howWeRoll} />}
                    <ThisCarPromise thisCarPromise={pageData.thisCarPromise} />
                </>
            )}
        </div>
    );
}

//export default AboutPage;
