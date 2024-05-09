"use server";
import { auth, db } from "./firebase-admin";

export async function fetchUsersByEmail( email = "") {
    try {
        let userData;
        const user = db.collection("users");
        const userSnapshot = await user.where("email", "==", email).get();
        if (!userSnapshot.empty) {
            userData = userSnapshot.docs[0].data();
        }
        return userData;

    } catch (err) {
        console.log("errors =>", err);
        throw err;
    }
}
