import { GetTabName } from "@/utils/WebPageUtil";
import { appConfig } from "../../../appConfig";

//Ravalidate sanity content after specified time
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export const metadata = {
    title: GetTabName("Find Your Ride"),
    description: "Find Your Ride Page"
};
const FindYourRide = async () => {
    return (
        <>
            <div className="text-center">
                <h4 style={{ color: "grey" }}>Find your ride</h4>
                <img src="under-construction.png" />
            </div>
        </>
    );
};

export default FindYourRide;
