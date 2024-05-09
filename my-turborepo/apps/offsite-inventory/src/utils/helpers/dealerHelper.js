// import { appConfig } from "@/appConfig";
import { appConfig } from "../../appConfig";
async function GetDealerData(dealerName) {
    const baseUrl = appConfig.OFFSITE_API_BASE_URL;
    if (!baseUrl) {
        return notFound();
    }

    async function fetchData(dealer) {
        const response = await fetch(`${baseUrl}/api/dealer/${dealer}`);
        const newData = await response.json();
        return newData;
    }

    const dealerConfig = await fetchData(dealerName);

    return dealerConfig?.dealerData;
}

export { GetDealerData };
