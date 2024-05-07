"use server";
import { search } from "./search";
import { db } from "./firebase-admin";
import { randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { bigQueryClient } from "./bigQueryClient";

const excludeDataFields = [
    // "bodyStyle",
    "bodyType",
    "chromeStyleId",
    "cityMPG",
    "deleteTime",
    "doors",
    "drivetrain",
    "engine",
    "engineDisplacement",
    "exportId",
    // "extColor",
    "extColorGeneric",
    "fuel",
    "hwyMPG",
    // "interiorColor",
    "interiorMaterial",
    "modelCode",
    "photosUpdatedAt",
    "postalCode",
    "processedPhotos",
    "stockId",
    "vehicleStyle",
    "standardOptions",
    "yearString"
];

async function fetchInvData(
    size = 10,
    pageNumber = 1,
    searchText = "",
    dateRanges = [],
    status = "All",
    dealerId = null
) {
    const sort_by = "createdAt(missing_values: last):desc";

    const filter_by = [];
    if (dateRanges) {
        if (dateRanges[0] && dateRanges[1]) {
            filter_by.push(`createdAt:>${dateRanges[0].getTime()}&&createdAt:<${dateRanges[1].getTime()}`);
        } else if (dateRanges[0]) {
            filter_by.push(`createdAt:>${dateRanges[0].getTime()}`);
        } else if (dateRanges[1]) {
            filter_by.push(`createdAt:<${dateRanges[1].getTime()}`);
        }
    }

    if (dealerId) {
        filter_by.push(`dealerId:=${dealerId}`);
        searchText = "*";
    }
    if (status != "All") {
        filter_by.push(`status:=${status}`);
    }
    if (status != "All") {
        filter_by.push(`status:=${status}`);
    }
    const searchParameters = {
        q: searchText ?? "*",
        query_by: ["vin", "stockId", "dealerName", "dealerStockId"],
        filter_by: filter_by.join("&&"),
        sort_by,
        exclude_fields: excludeDataFields,
        per_page: size,
        page: pageNumber
    };
    const response = await search.collections("vehicles").documents().search(searchParameters);
    const pagination = {
        page: response.page,
        perPage: response.request_params.per_page,
        total: response.found,
        out_of: response.out_of,
        maxPage: Math.ceil(response.found / response.request_params.per_page)
    };
    return { pagination, items: response.hits };
}

async function fetchCar(vin) {
    try {
        if (vin.toString().length === 17) {
            // const response = await Api.GetByID(`${appConfig.API_URL}/v2/listings`, id);
            const response = await search.collections("vehicles").documents(vin).retrieve();
            // Check if response is undefined or null or has an error property
            if (response === undefined || response === null || (response.hasOwnProperty("error") && response.error)) {
                //    console.error("Error in GetCarDetails:", response.error);
                return null;
            }
            return response;
        } else {
            return null; // return null in case invalid VIN
        }
    } catch (error) {
        //  console.error("Error in GetCarDetails:", error);
        throw error;
    }
}

async function uploadUnprocessedImages(vin, images) {
    try {
        const imagesArray = [];

        // Process each image asynchronously
        await Promise.all(
            images.map(async (image) => {
                imagesArray.push({
                    dealerPhotoId: randomUUID(),
                    dealerPhotoUrl: image,
                    order: imagesArray.length + 1,
                    photoTimestamp: new Date().toISOString()
                });
            })
        );

        const newDocumentRef = await db.collection("photosToProcess").add({
            createdAt: Math.floor(new Date().getTime() / 1000),
            photos: imagesArray,
            vin: vin,
            isManualUpload: true
        });
    } catch (err) {
        console.log("There was an error in sending the image to process");
        console.log(err);
        throw err;
    }
}

async function updateInventory(data) {
    try {
        // Perform the query to get the document
        const querySnapshot = await db.collection("inventory").where("vin", "==", data.vin).get();
        if (querySnapshot.empty) {
            throw new Error("No matching documents.");
        }
        if (data.history) {
            delete data.history;
        }

        if (data.history) {
            delete data.history;
        }

        data.numberOfPhotos = data.photoUrls?.length ?? 0;
        data.updatedAt = FieldValue.serverTimestamp();
        const documentRef = querySnapshot.docs[0].ref;
        await documentRef.update(data);
    } catch (error) {
        console.log(error);
        console.error("Error updating document: ", error);
        throw error;
    }
}

async function deletePhoto(photoUrl) {
    try {
        // Perform the query to get the document
        const querySnapshot = await db.collection("inventoryPhotos").where("processedPhotoUrl", "==", photoUrl).get();

        if (querySnapshot.empty) {
            return;
        }

        const documentRef = querySnapshot.docs[0].ref;

        await documentRef.update({
            status: "hidden"
        });

        // Assuming there is only one document with the given VIN
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error; // Rethrow the error to be caught in the onSubmit function
    }
}

// const getCreatedAtCars = async (noOfDays = 7) => {
//     try {
//         var now1 = new Date();
//         const now = getChicagoDate(new Date());
//         const endDate = getChicagoDate(now);
//         console.log(endDate, getStartDate(noOfDays));
//         const carsRef = db.collection("inventory");
//         const query = carsRef.where("createdAt", ">=", getStartDate(noOfDays)).where("createdAt", "<=", endDate);

//         const snapshot = await query.get((timeout = 1000000));
//         const createdAtCarsCount = [];

//         // Loop through each day in the selected period
//         for (let i = 0; i < noOfDays; i++) {
//             const start = getStartDate(noOfDays - i);
//             const end = getEndDate(start);

//             // Count the cars added within the current interval
//             const count = snapshot.docs.filter((doc) => {
//                 const createdAt = doc.data().createdAt.toDate();
//                 return createdAt >= start && createdAt <= end;
//             }).length;

//             console.log(i, start, end, count);
//             createdAtCarsCount.push(count);
//         }

//         console.log(`Cars added in the last ${noOfDays} days:`, createdAtCarsCount);
//         console.log("Cost", new Date() - now1);
//         return createdAtCarsCount;
//     } catch (err) {
//         console.error("Error fetching created cars:", err);
//         return null;
//     }
// };

// const getDeletedAtCars = async (noOfDays = 7) => {
//     try {
//         const now = getChicagoDate(new Date());
//         const endDate = getChicagoDate(now);
//         console.log(endDate, getStartDate(noOfDays));
//         const carsRef = db.collection("inventory");
//         const query = carsRef.where("deleteTime", ">=", getStartDate(noOfDays)).where("deleteTime", "<=", endDate);

//         const snapshot = await query.get((timeout = 1000000));
//         const deletedTimeCarsCount = [];

//         // Loop through each day in the selected period
//         for (let i = 0; i < noOfDays; i++) {
//             const start = getStartDate(noOfDays - i);
//             const end = getEndDate(start);

//             // Count the cars deleted within the current interval
//             const count = snapshot.docs.filter((doc) => {
//                 const deleteTime = doc.data().deleteTime.toDate();
//                 return deleteTime >= start && deleteTime <= end;
//             }).length;

//             deletedTimeCarsCount.push(count);
//             console.log(i, start, end, count);
//         }

//         console.log(`Counts of deleted records per day within the last ${noOfDays} days:`, deletedTimeCarsCount);
//         return deletedTimeCarsCount;
//     } catch (err) {
//         console.error("Error fetching deleted cars:", err);
//         return null;
//     }
// };

const PAGE_SIZE = 100; // Adjust the page size as needed

const getCreatedAtCars = async (noOfDays = 7) => {
    try {
        const now1 = new Date();
        const now = getChicagoDate(new Date());

        // Initialize an array to store counts for each day
        const createdAtCarsCount = [];

        // Calculate start and end timestamps for each day and fetch records
        const fetchRecordsForDay = async (dayIndex) => {
            const start = getStartDate(noOfDays - dayIndex);
            const end = getEndDate(start.getTime() - 7); // Adjust end date to be 7 days before start

            const startSeconds = Math.floor(start.getTime() / 1000);
            const endSeconds = Math.floor(end.getTime() / 1000);

            // Execute the query to get all records within the specified time range
            const storeProc = `CALL firestore_export.sp_CarsSummaryAdded(${startSeconds},${endSeconds})`;
            const [rows] = await bigQueryClient(storeProc);

            // Count the records for the current day
            const count = rows.length;

            // Push the count for the current day into the array
            createdAtCarsCount.push({ date: start.toLocaleDateString(), count });
            // createdAtCarsCount.push(count);
        };

        // Fetch records for each day asynchronously
        await Promise.all(Array.from({ length: noOfDays }, (_, i) => fetchRecordsForDay(i)));
        //     createdAtCarsCount.sort((a, b) => a.date.getTime() - b.date.getTime());
        // Sort the array by date in ascending order
        createdAtCarsCount.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Extract and return only the counts
        const countsOnly = createdAtCarsCount.map((day) => day.count);
        return countsOnly; //createdAtCarsCount;
    } catch (error) {
        console.error("Error fetching created cars:", error);
        return null;
    }
};

const getDeletedAtCars = async (noOfDays = 7) => {
    try {
        const now1 = new Date();
        const now = getChicagoDate(new Date());

        // Initialize an array to store counts for each day
        const deletedAtCarsCount = [];

        // Calculate start and end timestamps for each day and fetch records
        const fetchRecordsForDay = async (dayIndex) => {
            const start = getStartDate(noOfDays - dayIndex);
            const end = getEndDate(start.getTime() - 7);

            const startSeconds = Math.floor(start.getTime() / 1000);
            const endSeconds = Math.floor(end.getTime() / 1000);

            // Execute the query to get all records within the specified time range
            const storeProc = `CALL firestore_export.sp_CarsSummaryRemoved(${startSeconds},${endSeconds})`;
            const [rows] = await bigQueryClient(storeProc);

            // Count the records for the current day
            const count = rows.length;

            // Push the count for the current day into the array
            deletedAtCarsCount.push({ date: start.toLocaleDateString(), count });
            // createdAtCarsCount.push(count);
        };

        // Fetch records for each day asynchronously
        await Promise.all(Array.from({ length: noOfDays }, (_, i) => fetchRecordsForDay(i)));
        //     createdAtCarsCount.sort((a, b) => a.date.getTime() - b.date.getTime());
        // Sort the array by date in ascending order
        deletedAtCarsCount.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Extract and return only the counts
        const countsOnly = deletedAtCarsCount.map((day) => day.count);
        return countsOnly;
    } catch (error) {
        console.error("Error fetching created cars:", error);
        return null;
    }
};

//Helper function to get start date 1 minute before midnight for the specified number of days ago
const getStartDate = (daysAgo) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    startDate.setUTCHours(5, 59, 0, 0); // Set to 11:59 PM Chicago time
    return startDate;
};

// Helper function to get end date for the specified start date (11:59 PM of the same day)
const getEndDate = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setUTCHours(5, 59, 59, 999); // Set to 11:59:59.999 PM Chicago time (same day)
    endDate.setDate(endDate.getDate() + 1); // Move to the next day
    return endDate;
};

// Helper function to convert UTC time to Chicago time
const getChicagoDate = (date) => {
    const chicagoDate = new Date(date.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    return chicagoDate;
};

async function getVehiclePriceData({ startDate, endDate, upDown, page = 1 }) {
    const startOfDayTime = startDate;
    const endOfDayTime = endDate;
    const searchParameters = {
        q: "*",
        exclude_fields: excludeDataFields,
        filter_by:
            "priceAction:=" +
            upDown +
            " && priceUpdateAt._seconds:>" +
            startOfDayTime +
            " &&  priceUpdateAt._seconds:<" +
            endOfDayTime,
        per_page: 100,
        page: page // Set per_page to 1 to minimize the number of items fetched
    };

    const response = await search.collections("vehicles").documents().search(searchParameters);

    return { hits: response.hits, page: response.page, found: response.found };
}

async function getPriceChangedCars({ startDate, endDate }) {
    try {
        const startOfDayTime = startDate;
        const endOfDayTime = endDate;
        const getFacets = await search
            .collections("vehicles")
            .documents()
            .search({
                q: "*",
                facet_by: "priceAction",
                max_facet_values: 50,
                exclude_fields: excludeDataFields,
                filter_by: "priceUpdateAt._seconds:>" + startOfDayTime + " &&  priceUpdateAt._seconds:<" + endOfDayTime,
                per_page: 1,
                page: 1 // Set per_page to 1 to minimize the number of items fetched
            });
        //return getFacets.facet_counts[0].counts;

        let increase = 0;
        let decrease = 0;
        let total = 0;
        getFacets.facet_counts[0].counts?.forEach((el) => {
            if (el.value === "down") {
                decrease = el.count;
            } else if (el.value === "up") {
                increase = el.count;
            }
        });
        total = decrease + increase;

        return { total, increase, decrease };

        ////Array to store all promises
        // const promises = [];

        // const vinRef = db.collection("inventory");

        // const queryUp = vinRef.where("vin", "=", doc.data().vin).where("price", ">", doc.data().price);
        // const queryDown = vinRef.where("vin", "=", doc.data().vin).where("price", "<", doc.data().price);

        // // Add promises to array
        // promises.push(
        //     queryUp.get().then((vinUpSnapshot) => {
        //         if (querySnapshotUp.docs.length > 0) {
        //             countsByDayUp[labelDate] = (countsByDayUp[labelDate] || 0) + 1;
        //         }
        //     })
        // );

        // promises.push(
        //     queryDown.get().then((vinDownSnapshot) => {
        //         if (vinDownSnapshot.docs.length > 0) {
        //             countsByDayDown[labelDate] = (countsByDayDown[labelDate] || 0) + 1;
        //         }
        //     })
        // );

        // // Wait for all promises to resolve
        // await Promise.all(promises);

        // const upCount = Object.entries(countsByDayUp).map(([date, count]) => ({ date, count }));
        // const downCount = Object.entries(countsByDayDown).map(([date, count]) => ({ date, count }));
        // const map = Object.entries(countsByDay).map(([date, count]) => ({ date, count }));

        // const response = { increase, decrease };

        // console.log("response", response);
        // return response;
    } catch (err) {
        console.log("Error fetching updated cars:", err.message);
        return null;
    }
}
const IORWidget = async () => {
    try {
        const storeProc = `CALL firestore_export.SP_inventory_operations()`;
        const [rows] = await bigQueryClient(storeProc);
        return rows;
    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error;
    }
};
export {
    fetchInvData,
    fetchCar,
    updateInventory,
    deletePhoto,
    uploadUnprocessedImages,
    getCreatedAtCars,
    getDeletedAtCars,
    getPriceChangedCars,
    getVehiclePriceData,
    IORWidget
};
