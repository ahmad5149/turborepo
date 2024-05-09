"use server";
import { db, storage, admin } from "../../services/firebase-admin";
import { createFBFSUser, sendLoginLink } from "../../services/firebaseUserService";
async function submitDealer(data, isInserting) {
    // console.log(" file: addDealer.js:6 ~ submitDealer ~ data:", data);
    try {
        if (!data) return { status: 403, message: "Bad Request" };

        const dealerCollection = db.collection("dealers");

        const contacts = data.contacts;

        if (data.contacts != undefined) delete data.contacts;

        if (isInserting) {
            const dealerRef = await dealerCollection.add(data);

            if (data.isActive) {
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
                        console.log("Error creating user:", error.message);
                        //return error;
                    });

                    sendLoginLink("ajaz.thiscar@nxvt.com")
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }

            // create firebase user and firestore profile
            /*if (data.isActive) {
                createFBFSUser(data, "dealer")
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }*/

            //comment by hamza as we are sendInvitation checkbox
            // if (data.sendInvitation) {
            //     sendLoginLink("ajaz.thiscar@nxvt.com")
            //         .then((res) => {
            //             console.log(res);
            //         })
            //         .catch((error) => {
            //             console.log(error.message);
            //         });
            // }
            // send invite link
            //await sendLoginLink("ajaz.thiscar@nxvt.com");

            if (contacts && contacts.length > 0) {
                const contactsCollection = dealerRef.collection("contacts");

                const contactPromises = contacts.map((contact) => contactsCollection.add(contact));

                await Promise.all(contactPromises);
            }
        } else {

            const dealerQuery = await dealerCollection.where("uuid", "==", data.uuid).get();

            if (dealerQuery.empty) {
                return { status: 403, message: "Dealer not found" };
            }

            const dealerRef = dealerQuery.docs[0].ref;            
            await dealerRef.update(data);

            // commented by hamza as per discussion with shehzad for now 
            // we will send email only in insert case
            // if (data.isActive) {
            //     const userData = {
            //         email: data.ownerEmail,
            //         password: "secret",
            //         displayName: data.ownerLastName + " " + data.ownerFirstName
            //     };
            //     admin
            //         .auth()
            //         .createUser(userData)
            //         .then((userRecord) => {
            //             const dealerCollection = db.collection("users");
            //             userData["firebaseId"] = userRecord.uid;
            //             userData["rule"] = role;

            //             dealerCollection.add(userData).then((res) => {
            //                 console.log("created firetore user:", res);
            //             });
            //             console.log("firebase new user:", userRecord.uid);
            //         })
            //         .catch((error) => {
            //             console.log("Error creating user:", error.message);
            //             //return error;
            //         });
            // }

            // create firebase user and firestore profile
            /*if (data.isActive) {
                createFBFSUser(data, "dealer")
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }*/
            // send invite link
            // if (data.sendInvitation) {
            //     sendLoginLink("ajaz.thiscar@nxvt.com")
            //         .then((res) => {
            //             console.log(res);
            //         })
            //         .catch((error) => {
            //             console.log(error.message);
            //         });
            // }

            const contactsCollection = dealerRef.collection("contacts");
            const allContactsQuery = await contactsCollection.get();

            if (allContactsQuery && allContactsQuery.size > 0) {
                console.log("contact found to delete", allContactsQuery.size);

                const deletePromises = allContactsQuery.docs.map((contactDoc) => {
                    return contactDoc.ref.delete();
                });
                await Promise.all(deletePromises);
            }
            
            if (contacts && contacts.length > 0) {
                const contactPromises = contacts.map((contact) => contactsCollection.add(contact));
                await Promise.all(contactPromises);
            }
        }        
    } catch (error) {
        console.error("Error saving data to Firestore:", error);
        return {
            status: "ERROR",
            message: error
        };
    }

    return {
        status: "OK",
        message: isInserting ? "dealer saved successfully" : "dealer updated successfully"
    };
}

async function uploadImage({ imageName, imageBase64 }) {
    try {
        // const storageRef = ref(storage, `dealer-logos/${imageName}`);

        // uploadString(storageRef, imageBase64, "data_url").then((snapshot) => {
        //   console.log(JSON.stringify(snapshot));
        // });

        const photoBuffer = Buffer.from(imageBase64, "base64");
        await storage.file(`dealer-logos/${imageName}`).save(photoBuffer);
        await storage.file(`dealer-logos/${imageName}`).makePublic();

        return storage.file(`dealer-logos/${imageName}`).publicUrl();
    } catch (error) {
        console.log("error", error);
        return "";
    }
}

export { submitDealer, uploadImage };
