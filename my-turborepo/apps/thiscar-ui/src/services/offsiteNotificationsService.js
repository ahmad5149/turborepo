"use server";
import { search } from "./search";

export async function fetchNotifications(query) {
    try {
        const response = await search
            .collections("offsiteNotification")
            .documents()
            .search({
                q: query.q ?? "*",
                page: query?.page ?? 1,
                sort_by: `${query?.sortby || "createdAt"}:${query?.sortOrder || "desc"}`,
                per_page: query?.perPage ?? 10,
                query_by: ["requestingDealerName", "dealerName", "userName", "vin"]
            });
        return response;
    } catch (err) {
        console.log(err);
        return [];
    }
}
