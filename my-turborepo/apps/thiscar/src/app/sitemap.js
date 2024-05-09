import { search } from "@/services/search";

export default async function sitemap() {
    let page = 0;
    let searchParams = {
        q: "*",
        query_by: "make",
        page: page,
        per_page: 250
    };

    let vehicles = [];
    const query = await search.collections("vehicles").documents().search(searchParams);
    const pages = Math.ceil(query.found / 250);

    vehicles.push(...query.hits);

    const urls = [
        {
            url: "https://thiscar.com",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1
        },
        {
            url: "https://thiscar.com/cars",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1
        },
        {
            url: "https://thiscar.com/sell-trade",
            lastModified: new Date(),
            changeFrequency: "weekly"
        },
        {
            url: "https://thiscar.com/about",
            lastModified: new Date(),
            changeFrequency: "weekly"
        },
        {
            url: "https://thiscar.com/how-it-works",
            lastModified: new Date(),
            changeFrequency: "monthly"
        },
        {
            url: "https://thiscar.com/faqs",
            lastModified: new Date(),
            changeFrequency: "monthly"
        },
        {
            url: "https://thiscar.com/",
            lastModified: new Date(),
            changeFrequency: "monthly"
        }
    ];

    if (pages > 1) {
        page++;
        for (page; page < pages; page++) {
            const response = await search
                .collections("vehicles")
                .documents()
                .search({ ...searchParams, page });
            if (response.hits) {
                vehicles.push(...response.hits);
            }
        }
    }

    for (const v of vehicles) {
        urls.push({
            url: `https://thiscar.com/cars/${v.document.vin}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8
        });
    }

    return urls;
}
