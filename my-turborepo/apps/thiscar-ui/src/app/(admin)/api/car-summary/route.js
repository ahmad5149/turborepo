import { NextResponse } from "next/server";
import { bigQueryClient } from "../../../../services/bigQueryClient";
import { db } from "../../../../services/firebase-admin";

export async function POST(req) {
    try {
        // const payload = await req.text();

        const createdAtCarsData = await getCreatedAtCars(7);
        const deletedTimeCarsData = await getDeletedAtCars(7);
        return NextResponse.json({ Message: "Success", createdAtCarsData, deletedTimeCarsData });
    } catch (err) {
        console.error("Error fetching cars summary wudget data:", err);
        return null;
    }
}

const getCreatedAtCars = async (noOfDays = 7) => {
    try {
        const now1 = new Date();
        const now = getChicagoDate(new Date());

        const createdAtCarsCount = [];

        // Calculate start and end timestamps for each day and fetch records
        const fetchRecordsForDay = async (dayIndex) => {
            const start = getStartDate(noOfDays - dayIndex);
            let end;
            if (dayIndex === noOfDays - 1) {
                // For the last day, set the end time to the current time
                end = now;
            } else {
                // For other days, subtract 7 days from the start date
                end = getEndDate(start.getTime() - 7);
            }
            // const start = getStartDate(noOfDays - dayIndex);
            // const end = getEndDate(start.getTime() - 7); // Adjust end date to be 7 days before start

            const startSeconds = Math.floor(start.getTime() / 1000);
            const endSeconds = Math.floor(end.getTime() / 1000);

            // Execute the query to get all records within the specified time range
            const storeProc = `CALL firestore_export.sp_CarsSummaryAdded(${startSeconds},${endSeconds})`;
            const [rows] = await bigQueryClient(storeProc);

            // Count the records for the current day
            const count = rows.length;

            // Push the count for the current day into the array
            createdAtCarsCount.push({ date: start.toLocaleDateString(), count });
        };

        // Fetch records for each day asynchronously
        await Promise.all(Array.from({ length: noOfDays }, (_, i) => fetchRecordsForDay(i)));

        // Sort the array by date in ascending order as its randomly added to array as received
        createdAtCarsCount.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Extract and return only the counts
        const countsOnly = createdAtCarsCount.map((day) => {
            return day.count;
        });
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

    endDate.setUTCHours(5, 59, 0, 0); // Set to 11:59:00 PM Chicago time (same day)
    // endDate.setUTCHours(5, 59, 59, 999); // Set to 11:59:59.999 PM Chicago time (same day)
    endDate.setDate(endDate.getDate() + 1); // Move to the next day
    return endDate;
};

// Helper function to convert UTC time to Chicago time
const getChicagoDate = (date) => {
    const chicagoDate = new Date(date.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    return chicagoDate;
};

// const getCreatedAtCars1 = async (noOfDays = 7) => {
//     try {
//         var now1 = new Date();
//         const now = getChicagoDate(new Date());
//         const endDate = getChicagoDate(now);
//         const carsRef = db.collection("inventory");
//         const query = carsRef
//             .where("createdAt", ">=", getStartDate(noOfDays))
//             .where("createdAt", "<=", endDate)
//             .limit(1000);

//         // Define a promise that resolves when the query completes
//         const queryPromise = query.get();

//         // Set a timeout for the query
//         const timeoutPromise = new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 reject(new Error("Query timeout"));
//             }, 1000000); // Set the timeout value in milliseconds
//         });

//         // Use Promise.race() to execute both promises concurrently
//         const snapshot = await Promise.race([queryPromise, timeoutPromise]);

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

//             createdAtCarsCount.push(count);
//         }
//         return createdAtCarsCount;
//     } catch (err) {
//         console.error("Error fetching created cars:", err);
//         return null;
//     }
// };

// const getDeletedAtCars1 = async (noOfDays = 7) => {
//     try {
//         var now1 = new Date();
//         const now = getChicagoDate(new Date());
//         const endDate = getChicagoDate(now);
//         const carsRef = db.collection("inventory");
//         const query = carsRef
//             .where("deleteTime", ">=", getStartDate(noOfDays))
//             .where("deleteTime", "<=", endDate)
//             .limit(1000);

//         // Similar implementation for setting a timeout
//         const queryPromise = query.get();
//         const timeoutPromise = new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 reject(new Error("Query timeout"));
//             }, 1000000); // Set the timeout value in milliseconds
//         });

//         const snapshot = await Promise.race([queryPromise, timeoutPromise]);
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
//         }

//         return deletedTimeCarsCount;
//     } catch (err) {
//         console.error("Error fetching deleted cars:", err);
//         return null;
//     }
// };

// const getChicagoDate = (date) => {
//     const chicagoDate = new Date(date.toLocaleString("en-US", { timeZone: "America/Chicago" }));
//     return chicagoDate;
// };

// const getStartDate = (daysAgo) => {
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - daysAgo);
//     startDate.setUTCHours(5, 59, 0, 0); // Set to 11:59 PM Chicago time
//     return startDate;
// };

// const getEndDate = (startDate) => {
//     const endDate = new Date(startDate);
//     endDate.setUTCHours(5, 59, 59, 999); // Set to 11:59:59.999 PM Chicago time (same day)
//     endDate.setDate(endDate.getDate() + 1); // Move to the next day
//     return endDate;
// };
