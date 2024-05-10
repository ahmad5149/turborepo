"use server";
import { appConfig } from "@/appConfig";
import { db } from "./firebase-admin";
import { search } from "./search";
import { bigQueryClient } from "./bigQueryClient";
import { dealerNameColumns } from "../utils/excludedColumns";

const excludeDataFields = [
    "bodyStyle",
    "bodyType",
    "chromeStyleId",
    "cityMPG",
    "dealerId",
    "deleteTime",
    "doors",
    "drivetrain",
    "engine",
    "engineDisplacement",
    "exportId",
    "extColor",
    "extColorGeneric",
    "fuel",
    "hwyMPG",
    "id",
    "interiorColor",
    "interiorMaterial",
    "modelCode",
    "photosUpdatedAt",
    "postalCode",
    "processedPhotos",
    "stockId",
    "transmission",
    "vehicleStyle",
    "standardOptions",
    "yearString"
];

const excludeNotificationFields = [
    "answerVia",
    "contactId",
    "contactName",
    //   "createdAt",
    "dateOfAttempt",
    //   "responseDate",
    "updatedAt",
    "attempt",
    "createdBy",
    "isEscalation",
    "uuid",
    "isSecondary",
    "vin",
    "stockId",
    "description",
    "responseMessage",
    "isResponseConflicted",
    //  "type",
    //  "dealerId",
    "score",
    "tokens_matched",
    "id"
];

// export async function fetchNotifications(query) {
//     try {
//         const status = query.status;
//         const type = query.type;

//         let filter_by_status = "";
//         // status filter
//         switch (status) {
//             case "accepted":
//                 filter_by_status = `status:accepted`;

//                 break;
//             case "submitted":
//                 filter_by_status = `status:submitted`;
//                 break;
//             case "expired":
//                 filter_by_status = `status:expired'`;
//                 break;
//             case "declined":
//                 filter_by_status = `status:declined`;
//                 break;
//             default:
//             // code block
//         }

//         let filter_by_type = "";
//         // type filter
//         switch (type) {
//             case "available":
//                 filter_by_type = `type:available`;
//                 break;
//             case "24hourhold":
//                 filter_by_type = `type:24hourhold`;
//                 break;
//             case "purchase":
//                 filter_by_type = `type:purchase`;
//                 break;
//             default:
//             // code block
//         }
//         let filter_by = "";
//         if (!query?.q) {
//             filter_by += "isResponseConflicted:false && status:!=expired";
//         }
//         if (filter_by_status != "" || filter_by_type != "") {
//             if (filter_by_status != "" && filter_by_type != "") {
//                 filter_by.length
//                     ? (filter_by += " &&" + filter_by_status + " && " + filter_by_type)
//                     : (filter_by = filter_by_status + " && " + filter_by_type);
//             } else {
//                 filter_by.length
//                     ? (filter_by += " &&" + filter_by_status != "" ? filter_by_status : filter_by_type)
//                     : (filter_by = filter_by_status != "" ? filter_by_status : filter_by_type);
//             }
//         }

//         let searchRequests = {
//             searches: [
//                 {
//                     collection: "notification",
//                     filter_by: filter_by,
//                     sort_by: `${query?.sortby || "dateOfAttempt._seconds"}:${query?.sortOrder || "desc"}`,
//                     query_by: "createdBy,dealerName,contactName,vin"
//                 },
//                 {
//                     collection: "offsiteNotification",
//                     filter_by: `vin:${query?.q || null}`,
//                     query_by: "vin"
//                 }
//             ]
//         };
//         let commonSearchParams = {
//             q: query.q ?? "*",
//             page: query?.page ?? 1,
//             per_page: query?.perPage ?? 10
//         };

//         const { results } = await search.multiSearch.perform(searchRequests, commonSearchParams);

//         return {
//             hits: [...results[0]?.hits, ...results[1]?.hits],
//             found: results[0]?.found + results[1]?.found,
//             page: results[0]?.page
//         };
//     } catch (err) {
//         console.log(err);
//         return [];
//     }
// }

export async function fetchNotifications(query) {
    try {
        const status = query.status;
        const type = query.type;

        let filter_by_status = "";
        // status filter
        switch (status) {
            case "accepted":
                filter_by_status = `status:accepted`;

                break;
            case "submitted":
                filter_by_status = `status:submitted`;
                break;
            case "expired":
                filter_by_status = `status:expired'`;
                break;
            case "declined":
                filter_by_status = `status:declined`;
                break;
            default:
                break;
        }

        let filter_by_type = "";
        // type filter
        switch (type) {
            case "available":
                filter_by_type = `type:available`;
                break;
            case "24hourhold":
                filter_by_type = `type:24hourhold`;
                break;
            case "purchase":
                filter_by_type = `type:purchase`;
                break;
            default:
                break;
        }
        let filter_by = "";
        if (filter_by_status != "" || filter_by_type != "") {
            if (filter_by_status != "" && filter_by_type != "") {
                filter_by = filter_by_status + " && " + filter_by_type;
            } else {
                filter_by = filter_by_status != "" ? filter_by_status : filter_by_type;
            }

            filter_by += " && isResponseConflicted:false && status:!=expired";
        } else {
            filter_by = "isResponseConflicted:false && status:!=expired";
        }

        const response = await search
            .collections("notification")
            .documents()
            .search({
                q: query.q ?? "*",
                page: query?.page ?? 1,
                sort_by: `${query?.sortby || "dateOfAttempt._seconds"}:${query?.sortOrder || "desc"}`,
                per_page: query?.perPage ?? 10,
                filter_by: filter_by,
                query_by: ["createdBy", "dealerName", "contactName", "vin"]
            });

        return response;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export async function fetchNotificationsForExport(startOfDayTime,endOfDayTime) {
    try {
        const notifications = [];
        let maxCalls = 2;
        for (let i = 1; i < maxCalls + 1; i++) {
            const notificationData = await search.collections("notification").documents().search({
                q: "*",
                page: i,
                filter_by: "dateOfAttempt._seconds:>" + startOfDayTime + " &&  dateOfAttempt._seconds:<" + endOfDayTime,
                per_page: 200
            });

            maxCalls = Math.ceil(notificationData.found / 200);
            notifications.push(...notificationData.hits);
        }

        return notifications;
    } catch (err) {
        console.log(err);
        return [];
    }
}
export async function fetchConflictedNotifications(query) {
    try {
        let filter_by = "";

        filter_by = "isResponseConflicted:true||status:expired";

        const response = await search
            .collections("notification")
            .documents()
            .search({
                q: query.q ?? "*",
                page: query?.page ?? 1,
                sort_by: `${query?.sortby || "dateOfAttempt._seconds"}:${query?.sortOrder || "desc"}`,
                per_page: query?.perPage ?? 10,
                filter_by: filter_by,
                query_by: ["createdBy", "dealerName", "contactName", "vin"]
            });

        return response;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export async function fetchNotificationLogs(notificationId, vinId) {
    try {
        const response = await search
            .collections("notificationLog")
            .documents()
            .search({
                q: notificationId,
                sort_by: "_text_match:desc,dateOfAttempt._seconds:desc,responseDate._seconds:desc",
                query_by: ["notificationId"]
            });

        const documentObjects = response.hits.map((item) => item.document);
        return documentObjects;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export async function fetchNotificationLogsRes(notificationId, logId) {
    try {
        const response = await search
            .collections("response")
            .documents()
            .search({
                q: logId,
                sort_by: "responseDate._seconds:desc",
                query_by: ["notificationLogId"]
            });

        const documentObjects = response.hits
            .filter((item) => item.document.notificationId == notificationId)
            .map((item) => item.document);

        return documentObjects;
    } catch (error) {
        console.error("Error getting document:", error.message);
        return null;
    }
}

export async function GetNotificationsCount({ startDate, endDate }) {
    try {
        // console.log("dates", dates);
        // const startDate = dates.startDate ?? new Date();

        // let startDateUTC = startDate.toUTCString();
        // let startOfDay = new Date(startDateUTC);
        // startOfDay.setUTCHours(0, 0, 0, 0);
        // const startOfDayTime = new Date(startOfDay).getTime() / 1000;

        // const endDate = dates.endDate ?? new Date();
        // let endDateUTC = endDate.toUTCString();
        // let endOfDay = new Date(endDateUTC);
        // endOfDay.setUTCHours(23, 59, 59, 0);

        // // console.log(startOfDay);
        // const endOfDayTime = new Date(endOfDay).getTime() / 1000;
        const startOfDayTime = startDate;
        const endOfDayTime = endDate;
        const getFacets = await search
            .collections("notification")
            .documents()
            .search({
                q: "*",
                facet_by: "type",
                max_facet_values: 50,
                //exclude_fields: excludeDataFields,
                filter_by: "dateOfAttempt._seconds:>" + startOfDayTime + " &&  dateOfAttempt._seconds:<" + endOfDayTime,
                //filter_by: filterBy,
                per_page: 1,
                page: 1 // Set per_page to 1 to minimize the number of items fetched
            });
        //console.log(getFacets.facet_counts[0].counts);
        //return getFacets.facet_counts[0].counts;

        let total = 0;
        let purchaseCount = 0;
        let availableCount = 0;
        let holdCount = 0;
        getFacets.facet_counts[0].counts?.forEach((el) => {
            total += el.count;
            if (el.value === "purchase") {
                purchaseCount = el.count;
            } else if (el.value === "available") {
                availableCount = el.count;
            } else if (el.value === "24hourhold") {
                holdCount = el.count;
            }
        });
        return { total, purchase: purchaseCount, available: availableCount, hold: holdCount };
    } catch (error) {
        console.error("Error getting document:", error.message);
        return null;
    }
    //const type = getFacets.facet_counts.find((row) => row.field_name == "type");
    //console.log(type);
}

export async function GetResponsesCountPerDealer({ startDate, endDate, dealer, type = "All" }) {
    try {
        let statusCondition = "";
        if (type && type != "All") {
            statusCondition = ` &&type:${type}`;
        }
        var selectedStartDate = new Date(startDate?.toLocaleString());
        selectedStartDate.setHours(0, 0, 0, 0);

        var utcStartInSeconds = selectedStartDate.getTime() / 1000;

        var selectedEndDate = new Date(endDate?.toLocaleString());
        selectedEndDate.setHours(23, 59, 59, 0);

        var utcEndInSeconds = selectedEndDate.getTime() / 1000;

        let dealerIdCondition = "";
        if (dealer && dealer.value) {
            dealerIdCondition = ` && dealerId:${dealer.value}`;
        }

        let datesCondition = "";
        if (utcStartInSeconds && utcEndInSeconds) {
            datesCondition = ` && dateOfAttempt._seconds:> ${utcStartInSeconds} && dateOfAttempt._seconds:< ${utcEndInSeconds}`;
        }

        const perPage = 250;
        let currentPage = 1;

        let total = 0;

        const data = {
            categories: [],
            series: [
                { name: "accepted", data: [] },
                { name: "declined", data: [] }
            ]
        };

        const dealerCounts = {};

        while (true) {
            const getFacets = await search
                .collections("notification")
                .documents()
                .search({
                    q: "*",
                    filter_by: `(status:[accepted, declined]${dealerIdCondition}) ${datesCondition} ${statusCondition}`,
                    per_page: perPage,
                    page: currentPage,
                    group_by: "dealerName,status"
                });

            if (getFacets.grouped_hits.length === 0) {
                // No more data, exit the loop
                break;
            }

            getFacets.grouped_hits.forEach(({ found, group_key }) => {
                total += found;
                const [dealerName, status] = group_key;

                // Add dealerName to categories if not already present
                if (!data.categories.includes(dealerName)) {
                    data.categories.push(dealerName);
                }

                // Check if dealerName already exists in the temporary storage
                if (dealerCounts[dealerName] === undefined) {
                    dealerCounts[dealerName] = {
                        accepted: 0,
                        declined: 0
                    };
                }

                // Update counts in the temporary storage
                if (status === "accepted") {
                    dealerCounts[dealerName].accepted += found;
                } else if (status === "declined") {
                    dealerCounts[dealerName].declined += found;
                }
            });

            currentPage++;
        }

        // Populate the final data series using the accumulated counts
        data.categories.forEach((dealerName, index) => {
            data.series[0].data[index] = dealerCounts[dealerName]?.accepted || 0;
            data.series[1].data[index] = dealerCounts[dealerName]?.declined || 0;
        });

        return { total, data };
    } catch (error) {
        console.error("Error getting document:", error.message);
        return null;
    }
}

export async function GetResponsesTableData({ startDate, endDate, dealer, type = "All" }) {
    try {
        let statusCondition = "";
        if (type && type !== "All") {
            statusCondition = ` &&type:${type}`;
        }

        const utcStartInSeconds = startDate;
        const utcEndInSeconds = endDate;

        let dealerIdCondition = "";
        if (dealer && dealer.value) {
            dealerIdCondition = ` && dealerId:${dealer.value}`;
        }

        let datesCondition = "";
        if (utcStartInSeconds && utcEndInSeconds) {
            datesCondition = ` && dateOfAttempt._seconds:> ${utcStartInSeconds} && dateOfAttempt._seconds:< ${utcEndInSeconds}`;
        }

        const perPage = 250;
        let currentPage = 1;
        let total = 0;

        let formattedDealers = [];

        if (!dealer || !dealer.value) {
            const onlyDealerName = dealerNameColumns();
            const getDealers = await search.collections("dealers").documents().search({
                q: "*",
                per_page: perPage,
                page: currentPage,
                exclude_fields: onlyDealerName
            });

            formattedDealers = getDealers.hits.map(({ document }) => ({
                dealerName: document.name,
                acceptedCount: 0,
                declinedCount: 0
            }));
        } else {
            formattedDealers.push({
                dealerName: dealer.label,
                acceptedCount: 0,
                declinedCount: 0
            });
        }

        while (true) {
            const getFacets = await search
                .collections("notification")
                .documents()
                .search({
                    q: "*",
                    filter_by: `(status:[accepted, declined]${dealerIdCondition}) ${datesCondition} ${statusCondition}`,
                    per_page: perPage,
                    page: currentPage,
                    exclude_fields: excludeNotificationFields,
                    group_by: "dealerName,status"
                });

            if (getFacets.grouped_hits.length === 0) {
                // No more data, exit the loop
                break;
            }

            getFacets.grouped_hits.forEach(({ found, group_key }) => {
                const [dealerName, status] = group_key;
                total += found;

                // Update counts per dealer in formattedDealers array
                const dealerToUpdate = formattedDealers.find(({ dealerName: name }) => name === dealerName);
                if (dealerToUpdate) {
                    if (status === "accepted") {
                        dealerToUpdate.acceptedCount += found;
                    } else if (status === "declined") {
                        dealerToUpdate.declinedCount += found;
                    }
                }
            });

            currentPage++;
        }

        //sorting based on accepted requests and then on declined
        formattedDealers.sort((a, b) => {
            if (a.acceptedCount !== b.acceptedCount) {
                return b.acceptedCount - a.acceptedCount;
            }
            return b.declinedCount - a.declinedCount;
        });

        return { total, data: formattedDealers };
    } catch (error) {
        console.error("Error getting document:", error.message);
        return null;
    }
}

export async function EditNotificationResponse(notificationId, status, username) {
    try {
        const notificationsCollection = db.collection("notification");

        const notificationDoc = await notificationsCollection.doc(notificationId).get();

        if (notificationDoc.exists) {
            await notificationsCollection.doc(notificationId).update({
                status: status.toLowerCase(),
                isResponseConflicted: false,
                isManualUpdate: true,
                updatedBy: username ?? "",
                updatedAt: new Date()
            });

            console.log(`Notification with ID ${notificationId} updated successfully.`);
            return { success: true, message: `Notification updated successfully.` };
        } else {
            console.error(`Notification with ID ${notificationId} not found.`);
            return { success: false, message: `Notification not found.` };
        }
    } catch (e) {
        console.error("Error editing notification response:", e);
        return { success: false, message: "Error editing notification response." };
    }
}
export async function GetAverageResponseTimeByDealer({ startDate, endDate, dealer = {} }) {
    try {
        let dealerIdCondition = "";
        if (dealer && dealer.value) {
            dealerIdCondition = ` && dealerId:${dealer.value}`;
        }
        const utcStartInSeconds = startDate;
        const utcEndInSeconds = endDate;

        let datesCondition = "";
        if (utcStartInSeconds && utcEndInSeconds) {
            datesCondition = ` && createdAt._seconds:> ${utcStartInSeconds} && responseDate._seconds:< ${utcEndInSeconds}`;
        }
        const perPage = 250;
        let currentPage = 1;
        let allNotifications = [];

        while (true) {
            const getAllNotifications = await search
                .collections("notification")
                .documents()
                .search({
                    q: "*",
                    per_page: perPage,
                    filter_by: `(type:[available, 24hourhold, purchase]${dealerIdCondition}${datesCondition}) && (status:[accepted, declined])`,

                    page: currentPage,
                    excludeDataFields: excludeNotificationFields,
                    group_by: "dealerName,type",
                    group_limit: 50
                });
            if (getAllNotifications.grouped_hits.length === 0) {
                // No more data, exit the loop
                break;
            }

            const hits = getAllNotifications.grouped_hits.flatMap((group) => group.hits);
            allNotifications.push(...hits);
            currentPage++;
        }
        const availableResponseTimes = allNotifications
            .filter((notification) => {
                return notification.document.type && notification.document.type.toLowerCase() === "available";
            })
            .map((notification) => {
                const createdAt = notification.document.createdAt;
                const responseDate = notification.document.responseDate;

                if (!createdAt || !responseDate) {
                    return null;
                }

                const createdAtInSeconds = createdAt._seconds + createdAt._nanoseconds / 1e9; // convert nano in sec div by 1e9
                const responseDateInSeconds = responseDate._seconds + responseDate._nanoseconds / 1e9;

                return (responseDateInSeconds - createdAtInSeconds) / 60;
            })
            .filter((timeDifference) => timeDifference !== null && timeDifference > 0);

        const averageAvailableResponseTime =
            availableResponseTimes.length > 0
                ? availableResponseTimes.reduce((acc, val) => acc + val, 0) / availableResponseTimes.length
                : 0;

        const holdResponseTimes = allNotifications
            .filter((notification) => {
                return notification.document.type && notification.document.type.toLowerCase() === "24hourhold";
            })
            .map((notification) => {
                const createdAt = notification.document.createdAt;
                const responseDate = notification.document.responseDate;

                if (!createdAt || !responseDate) {
                    return null;
                }

                const createdAtInSeconds = createdAt._seconds + createdAt._nanoseconds / 1e9; // convert nano in sec div by 1e9
                const responseDateInSeconds = responseDate._seconds + responseDate._nanoseconds / 1e9;

                return (responseDateInSeconds - createdAtInSeconds) / 60;
            })
            .filter((timeDifference) => timeDifference !== null && timeDifference > 0);

        const averageHoldResponseTime =
            holdResponseTimes.length > 0
                ? holdResponseTimes.reduce((acc, val) => acc + val, 0) / holdResponseTimes.length
                : 0;

        const purchaseResponseTimes = allNotifications
            .filter((notification) => {
                return notification.document.type && notification.document.type.toLowerCase() === "purchase";
            })
            .map((notification) => {
                const createdAt = notification.document.createdAt;
                const responseDate = notification.document.responseDate;
                // var difference = responseDate._seconds - createdAt._seconds;
                if (!createdAt || !responseDate) {
                    return null;
                }

                const createdAtInSeconds = createdAt._seconds + createdAt._nanoseconds / 1e9; // convert nano in sec div by 1e9
                const responseDateInSeconds = responseDate._seconds + responseDate._nanoseconds / 1e9;

                return (responseDateInSeconds - createdAtInSeconds) / 60;
            })
            .filter((timeDifference) => timeDifference !== null && timeDifference > 0);

        const averagePurchaseResponseTime =
            purchaseResponseTimes.length > 0
                ? purchaseResponseTimes.reduce((acc, val) => acc + val, 0) / purchaseResponseTimes.length
                : 0;

        // // Filter notifications for 24-hour hold and purchase types
        const holdNotifications = allNotifications.filter(
            (notification) => notification.document.type === "24hourhold" && notification.document.responseDate !== null
        );
        const purchaseNotifications = allNotifications.filter(
            (notification) => notification.document.type === "purchase"
        );

        //    console.log(holdNotifications);
        //    console.log(purchaseNotifications);
        // Create a map to store hold notifications by VIN
        const holdMap = new Map();

        // Populate the map with hold notifications
        holdNotifications.forEach((notification) => {
            const vin = notification.document.vin;
            if (!holdMap.has(vin)) {
                holdMap.set(vin, notification);
            }
        });
        // holdMap.forEach((notification, vin) => {
        //     console.log(`VIN: ${vin}, Notification:`, notification);
        // });
        // Calculate the interval between hold and purchase notifications for each VIN
        const averageInterval = [];
        holdMap.forEach((holdNotification, vin) => {
            const correspondingPurchase = purchaseNotifications.find(
                (purchaseNotification) => purchaseNotification.document.vin === vin
            );

            //  console.log( correspondingPurchase );

            if (correspondingPurchase) {
                const holdSeconds =
                    holdNotification.document.createdAt &&
                    holdNotification.document.createdAt._seconds +
                        holdNotification.document.createdAt._nanoseconds / 1e9;
                const purchaseSeconds =
                    correspondingPurchase.document.createdAt &&
                    correspondingPurchase.document.createdAt._seconds +
                        correspondingPurchase.document.createdAt._nanoseconds / 1e9;
                const interval = Math.abs(purchaseSeconds - holdSeconds);
                const intervalInMinutes = interval / 60;
                averageInterval.push(intervalInMinutes);
            }
        });
        // Calculate the average interval
        const sumIntervals = averageInterval.reduce((acc, curr) => acc + curr, 0);
        const averageIntervalValue = sumIntervals / averageInterval.length;
        const formattedAverageInterval = isNaN(averageIntervalValue) ? 0 : averageIntervalValue.toFixed(2);

        //    console.log("Intervals:", averageInterval);

        return {
            total: 0, //Math.round(averageAvailableResponseTime + averageHoldResponseTime + averagePurchaseResponseTime),
            // available: Math.round(averageAvailableResponseTime) || "N/A",
            // hourhold24: Math.round(averageHoldResponseTime) || "N/A",
            // purchase: Math.round(averagePurchaseResponseTime) || "N/A",
            // thisCar: Math.round(averageInterval) || "N/A"
            available:
                averageAvailableResponseTime.toFixed(2) != 0.0 ? averageAvailableResponseTime.toFixed(2) : 0 || 0,
            hourhold24: averageHoldResponseTime.toFixed(2) != 0.0 ? averageHoldResponseTime.toFixed(2) : 0 || 0,
            purchase: averagePurchaseResponseTime.toFixed(2) != 0.0 ? averagePurchaseResponseTime.toFixed(2) : 0 || 0,
            thisCar: formattedAverageInterval != 0.0 ? formattedAverageInterval : 0 || 0
        };
    } catch (error) {
        console.error("Error fetching notifications by dealer:", error.message);
        return null;
    }
}

export async function Get_24HourHoldData({ startDate, endDate, dealer = {} }) {
    try {
        let total = 0;
        let data = [];
        let query = `CALL ${
            process.env.BIG_QUERY_DATASET_ID
        }.SP_AnalyzeHoldPurchaseNotifications(${startDate},${endDate},'${dealer?.value ?? ""}')`;
        try {
            const [rows] = await bigQueryClient(query);
            if (rows.length > 0) {
                data = rows;
                total = rows.length;
            } else {
                data = [
                    {
                        dealerId: 0,
                        dealerName: dealer?.value ? dealer?.label : "N/A",
                        holdUnit: 0,
                        releaseUnit: 0,
                        buyUnit: 0
                    }
                ];
                total = 0;
            }
        } catch (error) {
            data = [
                {
                    dealerId: 0,
                    dealerName: dealer?.value ? dealer?.label : "N/A",
                    holdUnit: 0,
                    releaseUnit: 0,
                    buyUnit: 0
                }
            ];
            total = 0;
            console.error("Error executing query:", error);
        }

        return { total, data };
    } catch (error) {
        console.error("Error getting document:", error.message);
        return null;
    }
}

export async function UpdateOffsiteNotificationResponse(notificationId, status, username) {
    try {
        const notificationsCollection = db.collection("offsiteNotification");

        const notificationDoc = await notificationsCollection.doc(notificationId).get();
        console.log("🚀 ~ UpdateOffsiteNotificationResponse ~ notificationDoc:", notificationDoc);

        if (notificationDoc.exists) {
            const notification = notificationDoc.data(); // Access notification data
            console.log("VIN:", notification.vin);
            await notificationsCollection.doc(notificationId).update({
                offsiteStatus: status,
                updatedBy: username ?? "",
                updatedAt: new Date()
                // isManualUpdate: true,
            });

            console.log(`Notification with ID ${notificationId} updated successfully.`);
            return { success: true, message: `Notification updated successfully.` };
        } else {
            console.error(`Notification with ID ${notificationId} not found.`);
            return { success: false, message: `Notification not found.` };
        }
    } catch (e) {
        console.error("Error editing notification response:", e);
        return { success: false, message: "Error editing notification response." };
    }
}
