"use server";
import { auth, db } from "./firebase-admin";
import { search } from "./search";

const statusFilter = "isDeleted:=false";
export async function fetchUsersData(limit = 10, name = "", uuid = "", q, sortBy, sortOrder) {
    try {
        const userRef = db.collection("users");
        let query = userRef.orderBy(sortBy, sortOrder).orderBy("uuid", "asc");
        query = query.where("isDeleted", "==", false);

        if (q?.length > 0) {
            query = query.startAt(q).endAt(q + "\uf8ff");
        } else if (uuid?.length > 0) {
            const nameVal = name || null;
            query = query.startAfter(nameVal, uuid);
        }

        const result = await query.limit(limit).get();
        return result.docs.map((doc) => doc.data());
    } catch (err) {
        console.log("errors =>", err);
        throw err;
    }
}

export async function fetchUsersDataTest() {
    try {
        const userRef = db.collection("users");
        let query = userRef.orderBy("uuid", "desc");
        //.orderBy("firstName", "asc");
        //query = query.where("isDeleted", "==", false);
        query = query.where("role", "==", "dealerManager");
        query = query.where("firebaseId", "==", null);
        const result = await query.limit(200).get();

        const res = result.docs.map((doc) => {
            return doc.data();
        });
        // const resFilter = res.filter((doc) => {
        //     //if (!doc.firebaseId && doc.role == "dealerManager") {
        //     return doc;
        //     //}
        // });
        res.forEach(async (userData) => {
            //console.log(userData);
            // get firebase record
            const usersCollection = db.collection("users");
            const userQuery = await usersCollection.where("uuid", "==", userData.uuid).get();
            if (userQuery.empty) {
                return { status: 403, message: "User not found" };
            }

            const firebaseData = {
                email: userData.email,
                password: "secret", // Note: Consider using a more secure password mechanism
                displayName: userData.firstName + " " + userData.lastName,
                emailVerified: true
            };
            //console.log("firebaseData", firebaseData);
            await auth
                .getUserByEmail(userData.email)
                .then(async (res) => {
                    //console.log("🚀 ~ .then ~ res:", res);
                    if (res?.uid) {
                        userData.firebaseId = res.uid;
                        const userRef = userQuery.docs[0].ref;
                        //await userRef.update(userData);
                    } else {
                    }
                })
                .catch(async (error) => {
                    const firebaseUser = await auth.createUser(firebaseData);
                    if (firebaseUser.uid !== undefined && firebaseUser.uid !== "") {
                        userData.firebaseId = firebaseUser.uid;
                        const userRef = userQuery.docs[0].ref;
                        await userRef.update(userData);
                    }
                    console.log(error.code, "getUserByEmail-error:" + userData.email);
                });
        });

        //console.log("res", res);

        // const promises = resFilter.map(async (doc) => {
        //     try {
        //         const fbres = await auth
        //             .getUserByEmail(doc.email)
        //             .then((res) => {
        //                 console.log("then:", doc.email + "-" + res?.uid);
        //             })
        //             .catch((error) => {
        //                 console.log("catch:", error.code + "-" + doc.email);
        //             });

        //         return fbres;
        //     } catch (error) {
        //         console.error("Error fetching user:", error);
        //         return null; // or any other value indicating failure
        //     }
        // });

        // Promise.all(promises)
        //     .then((results) => {
        //         // Process results here if needed
        //     })
        //     .catch((error) => {
        //         console.error("Error while processing promises:", error);
        //         // Handle error from processing promises
        //     });

        return res;
    } catch (err) {
        console.log("errors =>", err);
        throw err;
    }
}

export async function fetchUsersByDealerId(limit = 10, dealerId = "") {
    try {
        const userRef = db.collection("users");
        let query = userRef.where("isDeleted", "==", false);
        let dealerUsers = [];
        let dealerUsersSecondary = [];
        if (dealerId) {
            //query = query.where("chromeDealerId", "==", dealerId);
            const dealerUsersRef = db.collection("users");
            const dealerUsersSnapshot = await dealerUsersRef.where("chromeDealerId", "==", dealerId).get();
            dealerUsers = dealerUsersSnapshot.docs.map((doc) => {
                return doc.data().uuid;
            });
            const secondaryDealership = db.collectionGroup("secondaryDealership");
            const secondaryUserSnapshot = await secondaryDealership.where("chromeDealerId", "==", dealerId).get();
            dealerUsersSecondary = secondaryUserSnapshot.docs.map((doc) => {
                return doc.data().userUuid;
            });
        }
        const users = dealerUsersSecondary.concat(dealerUsers);
        if (dealerId && users.length == 0) {
            return [];
        }
        if (users.length > 0) {
            query = query.where("uuid", "in", users);
        }

        query = query.orderBy("uuid", "desc").limit(limit);

        const result = await query.get();
        const resultMap = result.docs.map((doc) => doc.data());
        return resultMap;
    } catch (err) {
        console.log("errors =>", err);
        throw err;
    }
}

export async function deleteUser(id) {
    let status = false;
    try {
        const userDocRef = await db.collection("users").where("uuid", "==", id).get();

        if (userDocRef.empty) {
            return { error: "User not found." };
        }
        const docRef = userDocRef.docs[0].ref;
        //console.log("🚀 ~ deleteUser ~ userDocRef.docs[0]:", userDocRef.docs[0]);
        const firebaseId = userDocRef?.docs[0]?.data()?.firebaseId;

        if (firebaseId) {
            await auth
                .getUser(firebaseId)
                .then(async (res) => {
                    if (res?.uid) {
                        await auth.deleteUser(firebaseId);
                    }
                })
                .catch((error) => {});
        }

        await docRef.update({ isDeleted: true, firebaseId: null }).then((res) => {
            status = true;
        });
        // await auth
        //     .deleteUser(uid)
        //     .then(async (res) => {
        //         await docRef.update({ isDeleted: true, firebaseId: null });
        //         status = true;
        //         console.log("Successfully deleted user from firebase");
        //     })
        //     .catch(async (error) => {
        //         await docRef.update({ isDeleted: true, firebaseId: null });
        //         status = true;
        //         console.log("Error deleting user from firebase:", error);
        //     });
        return { success: status };
    } catch (error) {
        console.error(error.message);
        return { error: error.message };
    }
}

export async function GetUsers(query) {
    try {
        //const searchBy = query.searchBy;
        //const query_by = searchBy == "dealership" ? "chromeDealerId" : ["firstName", "lastName", "dealerShip", "title"];

        if (query.dealer && query.dealer != "") {
            const responseSecondary = await search
                .collections("secondaryDealership")
                .documents()
                .search({
                    q: "*",
                    page: query?.page ?? 1,
                    per_page: 250,
                    filter_by: " chromeDealerId:= " + query.dealer + ""
                });
            let uuidStr = "";
            responseSecondary.hits.forEach((res) => {
                uuidStr = "`" + res.document.userUuid + "`," + uuidStr;
            });
            uuidStr = "[" + uuidStr?.replace(/,\s*$/, "") + "]";

            const response = await search
                .collections("users")
                .documents()
                .search({
                    q: "*",
                    page: query?.page ?? 1,
                    sort_by: `${query?.sortBy || "createdAt"}:${query?.sortOrder || "desc"}`,
                    per_page: query?.perPage ?? 10,
                    filter_by: statusFilter + " && (chromeDealerId:= " + query.dealer + "|| uuid:=" + uuidStr + ")"
                });

            return response;
        } else {
            const response = await search
                .collections("users")
                .documents()
                .search({
                    q: query.q ?? "*",
                    page: query?.page ?? 1,
                    sort_by: `${query?.sortBy || "createdAt"}:${query?.sortOrder || "desc"}`,
                    per_page: query?.perPage ?? 10,
                    query_by: ["firstName", "lastName", "dealerShip", "title", "email"],
                    filter_by: statusFilter
                });
            return response;
        }
    } catch (err) {
        console.log(err.message);
        return [];
    }
}
