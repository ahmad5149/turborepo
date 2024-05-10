const path = require("path");
const { appConfig } = require("./src/appConfig");

const currentBucketConfig = [appConfig.BUCKET_REF, appConfig.SECOND_BUCKET_REF, appConfig.COMING_SOON_REF];
const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")]
    },
    images: {
        remotePatterns: [
            ...currentBucketConfig.map((bucket) => ({
                protocol: "https",
                hostname: bucket,
                pathname: "**"
            })),
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
                pathname: "**"
            },
            {
                protocol: "https",
                hostname: "statefulimageprocessings-processedimagesbucketv23-gvors1gr2emh.s3.amazonaws.com",
                pathname: "**"
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "**"
            },
            {
                protocol: "https",
                hostname: "cdn.inventoryrsc.com",
                pathname: "**"
            }
        ]
    },
    crossOrigin: "anonymous",
    // Can be safely removed in newer versions of Next.js
    // future: {
    //     // by default, if you customize webpack config, they switch back to version 4.
    //     // Looks like backward compatibility approach.
    //     webpack5: true
    // },

    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve = {
                ...config.resolve,
                fallback: {
                    net: false,
                    dns: false,
                    tls: false,
                    fs: false,
                    request: false,
                    child_process: false
                }
            };
        }
        return config;
    },
    experimental: {
        webpackBuildWorker: true,
        esmExternals: false,
        serverActions: {
            bodySizeLimit: "3mb"
        }
    },
    poweredByHeader: false
};
module.exports = nextConfig;
