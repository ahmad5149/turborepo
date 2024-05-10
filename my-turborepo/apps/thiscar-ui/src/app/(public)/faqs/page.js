import Faqs from "../../../components/faq/Faqs";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";
import { useFaqPageContent } from "@/sanity/Sanity";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("FAQs"),
    description: "FAQ page"
};
const FaqPage = async () => {
    const pageData = await useFaqPageContent();
    if (pageData != null) {
        metadata.title = GetTabName(pageData.metaData.title);
        metadata.description = pageData.metaData.description;
    }
    return <div className="text-center">{pageData && <Faqs faq={pageData} />}</div>;
};

export default FaqPage;
