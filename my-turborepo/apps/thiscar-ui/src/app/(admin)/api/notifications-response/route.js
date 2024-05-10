import { NextResponse } from "next/server";
import { bigQueryClient } from "@/services/bigQueryClient";
import { appConfig } from "@/appConfig";

export async function POST(req) {
    try {
        const payload = await req.text();

        const { startDate, endDate, dealer } = JSON.parse(payload);

        // const callProcedure = `CALL ${appConfig.BIG_QUERY_DATASET_ID}.SP_NotificationResponseCount(${
        //     dealer?.value || null
        // },${startDate || null},${endDate || null})`;

        // const [rows] = await bigQueryClient(callProcedure);

        const callNotificationProcedure = `CALL ${appConfig.BIG_QUERY_DATASET_ID}.SP_NotificationResponseWidget(${
            dealer?.value || null
        },${startDate || null},${endDate || null})`;

        const [rowsData] = await bigQueryClient(callNotificationProcedure);
        const {
            total_records = 0,
            total_accepted = 0,
            total_declined = 0,
            total_expired = 0,
            total_accepted_type_purchase = 0,
            total_declined_type_purchase = 0,
            total_expired_type_purchase = 0
        } = rowsData[0];
        // const { total, accepted, declined } = rows?.reduce(
        //     (acc, el) => {
        //         acc.total += el.status_count;
        //         if (el.status === "accepted") {
        //             acc.accepted = el.status_count;
        //         } else if (el.status === "declined") {
        //             acc.declined = el.status_count;
        //         }
        //         return acc;
        //     },
        //     { total: 0, accepted: 0, declined: 0 }
        // );

        // return NextResponse.json({ Message: "Success", total, accepted, declined });
        return NextResponse.json({
            Message: "Success",
            total_records,
            total_accepted,
            total_declined,
            total_expired,
            total_accepted_type_purchase,
            total_declined_type_purchase,
            total_expired_type_purchase
        });
    } catch (error) {
        console.error("Error getting bigQuery rows:", error.message);
        return null;
    }
}

// --==========================================================================================================================
// --Author: Ahmad Ali
// --Descriptions: To get the notification count from Notifications Collection
// --Application: THIScar
// --Created Date: 23-04-2024
// --Modified Date : 23-04-2024
// --==========================================================================================================================

// CREATE OR REPLACE PROCEDURE dev_export.SP_NotificationResponseCount(dealerId INT64, startDate INT64, endDate INT64)
// BEGIN

//    SELECT
//     JSON_EXTRACT_SCALAR(data, '$.status') AS status,
//     COUNT(*) AS status_count
// FROM
//     development-390801.dev_export.notification_raw_changelog
// WHERE
//     JSON_EXTRACT_SCALAR(data, '$.status') IN ("accepted","declined")
//     AND (startDate IS NULL AND endDate IS NULL OR
//          (startDate IS NOT NULL AND endDate IS NOT NULL AND
//           CAST(JSON_EXTRACT(data, '$.dateOfAttempt._seconds') AS INT64) > startDate
//           AND
//           CAST(JSON_EXTRACT(data, '$.dateOfAttempt._seconds') AS INT64) < endDate))
//     AND (dealerId IS NULL OR CAST(JSON_EXTRACT_SCALAR(data, '$.dealerId') AS INT64) = dealerId)
// GROUP BY
//     status;
// END;
