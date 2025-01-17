const appConfig = {
    APPLICATION_NAME: "ThisCar",
    DESCRIPTION: "ThisCar",
    SANITY_REVALIDATION_TIME: 60, //process.env.NEXT_PUBLIC_SANITY_REVALIDATION_TIME,
    API_REVALIDATION_TIME: 60, //process.env.NEXT_PUBLIC_API_REVALIDATION_TIME,
    AUTOCHECK_CID: process.env.AUTOCHECK_CID,
    AUTOCHECK_PWD: process.env.AUTOCHECK_PWD,
    AUTOCHECK_SID: process.env.AUTOCHECK_SID,
    BUCKET_REF: process.env.NEXT_PUBLIC_BUCKET_REF,
    SECOND_BUCKET_REF: process.env.NEXT_PUBLIC_SECOND_BUCKET_REF,
    COMING_SOON_REF: process.env.NEXT_PUBLIC_COMING_SOON_REF,
    GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    DEALER_ID: process.env.NEXT_PUBLIC_DEALER_ID,
    CONSUMER_TENANT_ID: process.env.NEXT_PUBLIC_CONSUMER_TENANT_ID,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    HR_EMAIL: process.env.NEXT_PUBLIC_HR_EMAIL,
    RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY,
    GOOGLE_AW_ID: process.env.NEXT_PUBLIC_GOOGLE_AW_ID,
    GOOGLE_LEAD_CONVERT: process.env.NEXT_PUBLIC_GOOGLE_LEAD_CONVERT,
    GOOGLE_AD_ID: process.env.NEXT_PUBLIC_GOOGLE_AD_ID,
    ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,

    //Configurations for Sanity Studio
    SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,

    //Google Project
    GOOGLE_PROJECT_ID: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,

    //Firebase configurations
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSIGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSIGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    FIREBASE_NOTIFICATION_RESPONSE: process.env.NEXT_PUBLIC_SUBMIT_RESPONSE_URL,

    MAPS_KEY: process.env.NEXT_PUBLIC_MAPS_KEY,
    experimental: {
        webpackBuildWorker: true
    },

    //BigQuery
    BIG_QUERY_CLIENT_EMAIL: process.env.NEXT_PUBLIC_BIG_QUERY_CLIENT_EMAIL,
    BIG_QUERY_KEY: process.env.NEXT_PUBLIC_BIG_QUERY_KEY,
    BIG_QUERY_DATASET_ID: process.env.BIG_QUERY_DATASET_ID
};

const DefaultBaseImagePath = "/media/";

module.exports = { appConfig, DefaultBaseImagePath };
