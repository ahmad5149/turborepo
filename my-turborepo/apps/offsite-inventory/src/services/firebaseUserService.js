import { admin, db } from "./firebase-admin";
import { sendSignInLinkToEmail } from "firebase/auth";
import { clientAuth } from "@/services/firebase";
export async function createFBFSUser(data, role) {
    const userData = {
        email: data.ownerEmail,
        password: "secret",
        displayName: data.ownerLastName + " " + data.ownerFirstName
    };
    admin
        .auth()
        .createUser(userData)
        .then((userRecord) => {
            const dealerCollection = db.collection("users");
            userData["firebaseId"] = userRecord.uid;
            userData["rule"] = role;

            dealerCollection.add(userData).then((res) => {
                console.log("created firetore user:", res);
            });
            console.log("firebase new user:", userRecord.uid);
        })
        .catch((error) => {
            console.error("Error creating user:", error);
            return error;
        });
}

export async function sendLoginLink(email) {
    const auth = clientAuth;
    const dealers = await db.collection("dealerSiteConfig").where("emailAddress", "==", email).get();
    const dealerData = await dealers.docs[0].data();
    console.log("dealerConfig", dealerData);
    try {
        if (dealerData && dealerData.subDomain != "") {
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
            const dealerSub = dealerData.subDomain;
            const fullHostName = baseURL.replace(/^http:\/\//, "http://" + dealerSub + ".");

            const actionCodeSettings = {
                // URL you want to redirect back to. The domain (www.example.com) for this
                // URL must be in the authorized domains list in the Firebase Console.
                url: "http://" + fullHostName + "finish-signin",
                // This must be true.
                handleCodeInApp: true
                //dynamicLinkDomain: "thiscars.page.link"
            };

            sendSignInLinkToEmail(auth, email, actionCodeSettings)
                .then(async (result) => {
                    console.log(result);
                    //setSuccess(true);
                    //window.localStorage.setItem("emailForSignIn", email);
                    // window.localStorage.setItem("displayNameForSignIn", displayName);
                })
                .catch((error) => {
                    //setErrors({ firebaseError: error.message });
                    console.error(error);
                    //console.log("api", error.message);
                });
        } else {
            console.error("no subdomain found for in dealer config.");
            return;
        }
    } catch (error) {
        console.log(error.message);
    }
}
