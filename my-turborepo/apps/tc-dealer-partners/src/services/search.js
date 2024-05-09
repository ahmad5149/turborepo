import ts, { Client } from "typesense";

/**
 * @type {Client}
 */
export let search;

if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    search = new ts.Client({
        nearestNode: {
            host: process.env.NEXT_PUBLIC_TYPESENSE_LB ?? "",
            port: 443,
            protocol: "https"
        },
        nodes: [
            {
                host: process.env.NEXT_PUBLIC_TYPESENSE_HOST_1 ?? "",
                port: 443,
                protocol: "https"
            },
            {
                host: process.env.NEXT_PUBLIC_TYPESENSE_HOST_2 ?? "",
                port: 443,
                protocol: "https"
            },
            {
                host: process.env.NEXT_PUBLIC_TYPESENSE_HOST_3 ?? "",
                port: 443,
                protocol: "https"
            }
        ],
        apiKey: process.env.NEXT_PUBLIC_TYPESENSE_KEY_PROD ?? "",
        connectionTimeoutSeconds: 10
    });
} else {
    search = new ts.Client({
        nodes: [
            {
                host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
                port: 443,
                protocol: "https"
            }
        ],
        apiKey: process.env.NEXT_PUBLIC_TYPESENSE_KEY ?? "",
        connectionTimeoutSeconds: 10
    });
}
