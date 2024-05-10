import { db } from "@/services/firebase-admin";

export async function GET(request, { params }) {
    try {
        const email = params.email;
        const users = await db
            .collection("users")
            .where("email", "==", email)
            .where("role", "==", "dealerManager")
            .where("isActive", "==", true)
            .where("isDeleted", "==", false)
            .get();

        const userData = users.docs.map((doc) => ({
            ...doc.data(),
            id: doc.data().firebaseId
        }));
        console.log("userData", userData[0].chromeDealerId);
        const dealers = await db
            .collection("dealers")
            .where("chromeDealerId", "==", userData[0].chromeDealerId)
            .where("isActive", "==", true)
            .where("isDeleted", "==", false)
            .get();

        const configText = dealers.docs.map((doc) => ({
            ...doc.data(),
            id: doc.data().chromeDealerId,
            userFirebaseId: userData[0].firebaseId,
            userRole: userData[0].role,
            userSecondaryDealership: userData[0].secondaryDealership
        }));
        if (configText.length > 0) {
            console.log("configText", configText);
            return Response.json(configText[0]);
        } else {
            return Response.json([]);
        }
    } catch (e) {
        console.log(e.message);
        return Response.json({ status: "error", message: e.message });
    }
}
