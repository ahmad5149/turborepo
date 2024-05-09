import { appConfig } from "@/appConfig";

async function GetDealerData(dealerName) {
    const baseUrl = appConfig.OFFSITE_API_BASE_URL;
    if (!baseUrl) {
        return notFound();
    }

    const dealerConfig = await fetch(`${baseUrl}/api/dealer/${dealerName}`).then(async (res) => await res.json());

    return dealerConfig?.dealerData;
}

export { GetDealerData };
