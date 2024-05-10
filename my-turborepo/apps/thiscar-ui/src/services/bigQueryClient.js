import { BigQuery } from "@google-cloud/bigquery";
import { appConfig } from "../appConfig";

export const bigQueryClient = (query) => {
    const bigquery = new BigQuery({
        projectId: appConfig.GOOGLE_PROJECT_ID,
        credentials: {
            client_email: appConfig.BIG_QUERY_CLIENT_EMAIL,
            private_key: appConfig.BIG_QUERY_KEY.replace(/\\n/g, "\n")
        }
    });

    return bigquery.query(query);
};
