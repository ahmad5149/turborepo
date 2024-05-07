"use server";
import { db } from "./firebase-admin";
import { search } from "./search";
import { dealerNameColumns } from "../utils/excludedColumns";

const excludeFields = [
    "packAmount",
    "alwaysAvailable",
    "dealerURI",
    "dealerZipCode",
    "escalationEmail",
    "escalationFirstName",
    "escalationLastName",
    "escalationPhone",
    "generalManagerEmail",
    "generalManagerFirstName",
    "generalManagerLastName",
    "generalManagerPhoneNumber",
    "logo",
    "ownerEmail",
    "ownerFirstName",
    "ownerLastName",
    "ownerPhone",
    "retailMarkup",
    "createdDate",
    "notes"
];

export async function fetchDealersListing(
    limit = 10,
    page = 1,
    query = "*",
    status = 0,
    sortBy = "name",
    sortOrder = "asc"
) {
    try {
        sortOrder = sortBy === "isActive" ? (sortOrder === "asc" ? "desc" : "asc") : sortOrder;

        let filter_by = "";
        if (status == 2) {
            filter_by = `isDeleted:true`;
        } else {
            filter_by = `isDeleted:false`;
        }
        if (status == 0) {
            filter_by = `isActive:false`;
        } else if (status == 1) {
            filter_by = `isActive:true`;
        }
        const response = await search
            .collections("dealers")
            .documents()
            .search({
                q: query,
                page: page,
                sort_by: `${sortBy}:${sortOrder}`,
                per_page: limit,
                filter_by,
                query_by: "name"
            });

        const dealers = response?.hits.map((item) => item.document);
        const chromeDealerIdsSet = new Set(dealers.map((dealer) => dealer.chromeDealerId));

        const uniqueChromeDealerIds = Array.from(chromeDealerIdsSet);

        const invCounts = await search
            .collections("vehicles")
            .documents()
            .search({
                q: "*",
                filter_by: `dealerId:[${uniqueChromeDealerIds.join(",")}]`,
                group_by: "dealerId",
                group_limit: "1",
                exclude_fields: excludeFields,
                per_page: 100
            });

        invCounts.grouped_hits.forEach((hit) => {
            const dealerId = hit.group_key[0];
            const dealer = dealers.find((d) => d.chromeDealerId === dealerId);
            if (dealer) {
                const invCount = hit.found;
                dealer.invCount = invCount;
            }
        });
        return {
            found: response.found,
            data: dealers,
            page: response.page
        };
    } catch (error) {
        console.error("Error fetching dealers listing:", error);
        throw error;
    }
}

export async function deleteDealer(uuid) {
    try {
        const querySnapshot = await db.collection("dealers").where("uuid", "==", uuid).get();

        if (!querySnapshot.empty) {
            const documentRef = querySnapshot.docs[0].ref;

            await documentRef.update({ isDeleted: true, isActive: false });

            console.log("Document marked as deleted:", documentRef.id);
            return { success: true };
        } else {
            console.log("No document found with the specified UUID:", uuid);
            return { error: "No document found with the specified UUID" };
        }
    } catch (error) {
        console.log("Error:", error.message);
        return { error: error.message };
    }
}

export async function addDeletedDealer(refId) {
    try {
        const documentRef = await db.collection("dealers").doc(refId);
        documentRef
            .update({ isDeleted: "0" })
            .then((res) => {
                return { success: true };
            })
            .catch((error) => {
                console.log(error);
                return { error: error.message };
            });
    } catch (error) {
        console.log("Error while adding dealer");
        console.log(error.message);
        return { error: error.message };
    }
    return;
}

export async function getTotalDealersCount() {
    try {
        const dealerRef = await db.collection("dealers");
        const snapshot = await dealerRef.get();
        const count = snapshot.size;
        return count;
    } catch (error) {
        console.log(error.message);
        return 0;
    }
}

export async function getAllDealers() {
    try {
        const onlyDealerNames = dealerNameColumns();
        const searchResults = await search.collections("dealers").documents().search({
            q: "*",
            filter_by: "isDeleted:false",
            sort_by: "name:asc",
            exclude_fields: onlyDealerNames,
            per_page: 250
        });

        const dealers = searchResults.hits.map((hit) => ({
            value: hit.document.chromeDealerId,
            label: hit.document.name
        }));

        return dealers;
    } catch (error) {
        console.log(error.message);
        return [];
    }
}
const searchDealerByName = (dealerList, name) => {
    const foundDealer = dealerList.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    return foundDealer;
};
export async function searchDealer(search) {
    try {
        if (search.length > 0) {
            const dealers = await db.collection("dealers").orderBy("name", "ASC").get();

            // .startAt(search)
            // .endAt(search + "\uf8ff")
            // // .limit(5)
            // .get();
            const dealersData = dealers.docs.map((doc) => doc.data());

            const sResult = searchDealerByName(dealersData, search);
            const searchResult = sResult.map((doc) => ({
                value: doc.chromeDealerId,
                label: doc.name
            }));

            //  console.log("searchResult", searchResult);

            return searchResult;
        }
    } catch (e) {
        console.log("Error in dealers fetching");
        console.log(e.message);
        //return Response.json(e.message);
    }
    return [];
}

export async function checkDealerEscalation(dealerId) {
    try {
        const snapshot = await db
            .collection("users")
            .where("chromeDealerId", "==", dealerId)
            .where("escalationNotification", "==", true)
            .limit(1)
            .get();
        if (snapshot.empty) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export async function getDealerByName(dealerName) {
    try {
        let dealerData = null;
        const dealers = await db.collection("dealers").where("name", "==", dealerName).get();
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
