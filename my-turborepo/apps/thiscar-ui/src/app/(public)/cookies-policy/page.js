import CookiesPolicy from "../../../components/cookiespolicy/CookiesPolicy";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("Cookies Policy"),
    description: "Cookies Policy Page"
};
const CookiesPolicyPage = async () => {
    return (
        <div className="text-center cookies-overflow">
            <CookiesPolicy />
        </div>
    );
};

export default CookiesPolicyPage;
