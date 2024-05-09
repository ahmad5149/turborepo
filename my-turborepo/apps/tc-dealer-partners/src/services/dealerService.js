"use server";
import { db } from "./firebase-admin";
export async function getDealersById(dealerId) {
    try {
        let dealerData = null;
        const dealers = await db.collection("dealers").where("chromeDealerId", "==", dealerId).get();
        if (dealers.docs.length == 0) {
            return dealerData;
        } else {
            dealerData = dealers.docs[0].data();
            return dealerData;
        }
    } catch (e) {
        console.log("Error in dealers fetching");
        console.log(e.message);
    }
}