"use server";

import { resend } from "@/services/email";
import { search } from "@/services/search";
import * as fastcsv from "fast-csv";

export async function downloadInventory(email) {
    const page = 1;
    const perPage = 250;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfDay = Math.floor(currentDate.getTime() / 1000);

    async function fetchData(page) {
        return await search
            .collections("vehicles")
            .documents()
            .search({
                q: "*",
                query_by: "make",
                filter_by: `updatedAt:>${startOfDay}`,
                page,
                per_page: perPage
            });
    }

    let response = await fetchData(page);
    let hits = [];

    if (response.hits) {
        hits.push(
            ...response.hits.map((v) => {
                const { standardOptions, ...rest } = v.document;
                return rest;
            })
        );
    }

    let pages = Math.ceil(response.found / perPage);

    if (pages > 1) {
        for (let p = page + 1; p <= pages; p++) {
            response = await fetchData(p);
            if (response.hits) {
                hits.push(
                    ...response.hits.map((v) => {
                        const { standardOptions, ...rest } = v.document;
                        return rest;
                    })
                );
            }
        }
    }

    const csvBuff = await fastcsv.writeToBuffer(hits, {
        headers: [
            "vin",
            "status",
            "year",
            "make",
            "model",
            "trim",
            "odometer",
            "transmission",
            "dealerPrice",
            "nada",
            "mmr"
        ]
    });

    const html = `
    Inventory File Attached
    Created on ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}
    `;
    try {
        await resend.emails.send({
            from: "partners_site@thiscar.com",
            to: email,
            subject: `${process.env.NODE_ENV !== "production" ? "TEST TEST TEST" : "ALERT"} Inventory File`,
            text: html,
            attachments: [
                {
                    filename: `${new Date().getTime()}-inventory.csv`,
                    content: csvBuff
                }
            ]
        });
        return true;
    } catch (error) {
        return false;
    }
}
