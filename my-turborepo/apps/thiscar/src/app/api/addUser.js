"use server";

import { db, auth } from "../../services/firebase-admin";

async function addUser(data, isInserting) {
    const usersCollection = db.collection("users");
    try {
        if (!data) return { status: 403, message: "Bad Request" };

        let { secondaryDealership, ...userData } = data;

        if (secondaryDealership?.length) {
            secondaryDealership = secondaryDealership.filter((obj) => obj?.chromeDealerId);
        }

        let errorStatus = null;
        let errorMessage = null;
        let errorCode = null;
        const firebaseData = {
            email: userData.email,
            password: "secret", // Note: Consider using a more secure password mechanism
            displayName: userData.firstName + " " + userData.lastName,
            emailVerified: true
        };

        if (isInserting) {
            const users = await usersCollection
                .where("email", "==", userData.email)
                .where("isDeleted", "!=", true)
                .get();
            const userExists = users.docs;

            if (userExists.length > 0) {
                return {
                    status: "error",
                    message: "A user with this email already exists on firestore."
                };
            }

            userData.firebaseId = null;

            if (userData.role == "dealerManager" || userData.role == "thisCarAdmin") {
                try {
                    let firebaseUser = null;
                    if (userData.forceLinkEmail) {
                        firebaseUser = await auth.getUserByEmail(userData.email);
                    } else {
                        firebaseUser = await auth.createUser(firebaseData);
                    }

                    if (firebaseUser.uid != "") {
                        userData.firebaseId = firebaseUser.uid;
                        const userAdded = await usersCollection.add(userData);
                        const userDocRef = usersCollection.doc(userAdded?.id);

                        for (const secondaryDealer of secondaryDealership) {
                            await userDocRef.collection("secondaryDealership").add({
                                ...secondaryDealer,
                                userId: userAdded?.id,
                                userUuid: userData?.uuid,
                                chromeDealerId: secondaryDealer?.chromeDealerId
                            });
                        }
                    } else {
                        errorStatus = true;
                        errorMessage = "Error creating Firebase user";
                    }
                } catch (error) {
                    console.error(error);

                    if (error.code === "auth/email-already-exists") {
                        errorCode = "email-already-exists";
                        errorMessage = "The email address is already in use by another account on Firebase";
                    } else {
                        errorMessage = "Error creating Firebase user";
                    }

                    errorStatus = true;
                }
            } else {
                const userAdded = await usersCollection.add(userData);
                const userDocRef = usersCollection.doc(userAdded?.id);

                for (const secondaryDealer of secondaryDealership) {
                    await userDocRef.collection("secondaryDealership").add({
                        ...secondaryDealer,
                        userId: userAdded?.id,
                        userUuid: userData?.uuid,
                        chromeDealerId: secondaryDealer?.chromeDealerId
                    });
                }
            }
        } else {
            // Update user
            const dealerQuery = await usersCollection.where("uuid", "==", userData.uuid).get();
            if (dealerQuery.empty) {
                return { status: 403, message: "User not found" };
            }
            const origData = dealerQuery.docs[0].data();

            if (origData.email !== userData.email && origData.email) {
                const userWithEmailQuery = await usersCollection
                    .where("email", "==", userData.email)
                    .where("isDeleted", "!=", true)
                    .get();

                if (!userWithEmailQuery.empty) {
                    return {
                        status: "error",
                        message: "A user with this email already exists."
                    };
                }
            }

            if (
                (userData.role == "dealerManager" || userData.role == "thisCarAdmin") &&
                (origData.firebaseId == "" || origData.firebaseId == null)
            ) {
                try {
                    let firebaseUser = null;
                    if (userData.forceLinkEmail) {
                        firebaseUser = await auth.getUserByEmail(userData.email);
                    } else {
                        firebaseUser = await auth.createUser(firebaseData);
                    }
                    userData.firebaseId = firebaseUser?.uid;
                } catch (error) {
                    if (error.code === "auth/email-already-exists") {
                        errorCode = "email-already-exists";
                        errorMessage = "The email address is already in use by another account on Firebase";
                    } else {
                        errorMessage = "Error creating Firebase user";
                    }
                    errorStatus = true;
                }
            }
            const dealerRef = dealerQuery.docs[0].ref;
            const userDocRef = usersCollection.doc(dealerRef?.id);
            deleteSecondaryDealership(userDocRef);
            await dealerRef.update(userData);

            for (const secondaryDealer of secondaryDealership) {
                await userDocRef.collection("secondaryDealership").add({
                    ...secondaryDealer,
                    userId: dealerRef.id,
                    userUuid: userData?.uuid,
                    chromeDealerId: secondaryDealer?.chromeDealerId
                });
            }
        }

        return {
            status: errorStatus ? "error" : "OK",
            errorCode: errorCode,
            message: errorStatus ? errorMessage : isInserting ? "User saved successfully" : "User updated successfully"
        };
    } catch (error) {
        console.error("44534", error.message);

        return {
            status: "error",
            message: error.message
        };
    }
}

const deleteSecondaryDealership = async (userDocRef) => {
    const secondaryDealershipRef = userDocRef.collection("secondaryDealership");
    const deleteQuerySnapshot = await secondaryDealershipRef.get();
    deleteQuerySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
    });
};

export { addUser };
