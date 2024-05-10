import Terms from "@/components/terms/Terms";
import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("Terms"),
    description: "Terms"
};

const TermsPage = async () => {
    return (
        <div className="text-center">
            <Terms />
        </div>
    );
};

export default TermsPage;
