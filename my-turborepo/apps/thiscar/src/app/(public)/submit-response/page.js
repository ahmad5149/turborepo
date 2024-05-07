import { inventoryPageContent } from "@/sanity/Sanity";
import SubmitNotificationResponse from "../../../components/submit-response/SubmitNotificationResponse";
import SubmitSMSNotificationResponse from "../../../components/submit-response/SubmitSMSNotificationResponse";
import { appConfig } from "@/appConfig";
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

const SubmitNotificationResponsePage = async ({ params, searchParams }) => {
    const notificationId = searchParams?.notificationId || ""; //"L4L2NDATNEyYnrORnK0D"; //"lGMK4gFpyMbHvg79DxMd";
    const notificationLogId = searchParams?.notificationLogId || ""; // "WlUhv9m3IInAmuqvF7Lr"; //"8CLFoAU7dkm5GCEHfivO"; //"Utg68IvruSDjuluBLN7o"; //"6YARTlKSkeia05Lu5OMb";
    const attempt = searchParams?.attempt || 1;
    const response = searchParams?.response || ""; //"Yes";
    const via = searchParams?.via || ""; //"EMAIL" //"SMS";
    const type = searchParams?.type || ""; //"available";
    const data = await inventoryPageContent();

    return (
        <div className="text-center">
            {notificationId && notificationLogId && via.toLowerCase() === "email" && (
                <SubmitNotificationResponse
                    notificationId={notificationId}
                    notificationLogId={notificationLogId}
                    attempt={attempt}
                    responseValue={response}
                    via={via}
                    headings={data.submitResponse ?? "Submit Your Response!"}
                />
            )}
            {notificationId && notificationLogId && via.toLowerCase() === "sms" && (
                <SubmitSMSNotificationResponse
                    notificationId={notificationId}
                    notificationLogId={notificationLogId}
                    attempt={attempt}
                    responseValue={response}
                    via={via}
                    type={type}
                    headings={data.submitResponse ?? "Submit Your Response!"}
                />
            )}
        </div>
    );
};

export default SubmitNotificationResponsePage;
