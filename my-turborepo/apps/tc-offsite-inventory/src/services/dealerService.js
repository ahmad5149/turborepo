"use server";
import { auth, db } from "./firebase-admin";

export async function fetchDealersById(dealerId) {
    try {
        let dealerData;
        const dealer = db.collection("dealers");
        const dealerSnapshot = await dealer.where("chromeDealerId", "==", dealerId).get();
        if (!dealerSnapshot.empty) {
            dealerData = dealerSnapshot.docs[0].data();
        }
        return dealerData;
    } catch (err) {
        console.log("errors =>", err);
        throw err;
    }
}

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
