import { createClient } from "next-sanity";
import { appConfig } from "../../src/appConfig";

export default createClient({
    projectId: appConfig.SANITY_PROJECT_ID,
    dataset: appConfig.SANITY_DATASET,
    apiVersion: "2021-08-31",
    useCdn: true
});
