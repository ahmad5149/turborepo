import { cache } from "react";
import { createClient, groq } from "next-sanity";
import sanityImageURL from "@sanity/image-url";
import * as queries from "./SanityQueries";
import { appConfig } from "../../src/appConfig";

const client = createClient({
    projectId: appConfig.SANITY_PROJECT_ID,
    dataset: appConfig.SANITY_DATASET,
    apiVersion: "2021-08-31",
    useCdn: true
});

// get the benefit of the new RSC with cache
export const useSanity = cache(client.fetch.bind(client));

// image builder
const builder = sanityImageURL(client);

export function SanityImageURL(source = null, defaultImage = null, height = null, width = null) {
    if (!source) {
        return defaultImage;
    }
    const image = builder.image(source);
    if (height) {
        image.height(height);
    }
    if (width) {
        image.width(width);
    }
    return image.url();
}

// hooks for content
export function useHomePageContent() {
    return useSanity(groq`${queries.homePageQuery}`);
}

export function useAboutPageContent() {
    return useSanity(groq`${queries.aboutPageQuery}`);
}

export function useHowItWorksPageContent() {
    return useSanity(groq`${queries.howItWorksQuery}`);
}

export function useFaqPageContent() {
    return useSanity(groq`${queries.faqsQuery}`);
}

export function useSellAndTradePageContent() {
    return useSanity(groq`${queries.sellTradeQuery}`);
}

export function useCareersPageContent() {
    return useSanity(groq`${queries.careerQuery}`);
}

export function useMainPageContent() {
    return useSanity(groq`${queries.mainPageQuery}`);
}

export function usePopoutContent() {
    return useSanity(groq`${queries.popOutQuery}`);
}

export function useSupportPageContent() {
    return useSanity(groq`${queries.supportPageQuery}`);
}

export function useDefaultPageContent() {
    return useSanity(groq`${queries.defaultPageQuery}`);
}

export function useCarDetailsPageContent() {
    return useSanity(groq`${queries.carDetailsQuery}`);
}

export function useFlyoutPageContent() {
    return useSanity(groq`${queries.flyoutQuery}`);
}

export function findYourRidePageContent() {
    return useSanity(groq`${queries.findYourRideQuery}`);
}
export function inventoryPageContent() {
    return useSanity(groq`${queries.notificationQuery}`);
}
