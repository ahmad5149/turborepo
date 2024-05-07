import AddEditUser from "../../../../../components/admin/users/AddEdit";
import { db } from "../../../../../services/firebase-admin";
import { addUser } from "../../../../api/addUser";
import { getAllDealers } from "@/services/dealerService";
export const metadata = {
    title: "Users",
    description: "Users Page"
};

const getUsers = async (userId) => {
    try {
        const user = await db.collection("users").where("uuid", "==", userId).get();

        if (user.empty) {
            console.log("User not found");
        }

        const documentSnapshot = user.docs[0];
        const userDicId = user.docs[0].id;

        const userData = documentSnapshot.data();
        const secondaryDealers = await getSubCollectionData(userDicId);

        if (secondaryDealers?.length) {
            const chromeDealerIds = secondaryDealers.map((obj) => obj?.chromeDealerId);
            const dealersQuerySnapshot = await db
                .collection("dealers")
                .where("chromeDealerId", "in", chromeDealerIds)
                .get();
            const dealersData = dealersQuerySnapshot.docs.map((d) => d.data());

            const updatedSecondaryDealers = secondaryDealers.map((secondaryDealer) => {
                const dealerMatch = dealersData.find(
                    (dealer) => dealer.chromeDealerId === secondaryDealer.chromeDealerId
                );
                if (dealerMatch) {
                    return [
                        {
                            value: dealerMatch.chromeDealerId,
                            label: dealerMatch.name
                        }
                    ];
                } else {
                    return secondaryDealer;
                }
            });
            userData.secondaryDealers = updatedSecondaryDealers;
            userData.secondaryDealership = secondaryDealers;
        }

        return userData;
    } catch (err) {
        console.log("=========================================================");
        console.log(err);
        console.log("=========================================================");
    }
    return null;
};

const getSubCollectionData = async (docId) => {
    const userRef = db.collection("users").doc(docId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
        console.log("User not found");
    } else {
        const secondaryDealershipRef = userRef.collection("secondaryDealership");
        const secondaryDealershipSnapshot = await secondaryDealershipRef.get();

        if (!secondaryDealershipSnapshot.empty) {
            const secondaryDealershipData = secondaryDealershipSnapshot.docs.map((doc) => doc.data());

            return secondaryDealershipData;
        } else {
            console.log("No secondary dealership data found for this user.");
        }
    }
};
const UsersPage = async ({ searchParams }) => {
    let userData = null;
    const dealers = await getAllDealers();
    if (searchParams?.id) userData = await getUsers(searchParams.id);

    return (
        <div className="text-center">
            {
                <AddEditUser
                    addUser={addUser}
                    userData={userData}
                    dealerOptions={dealers}
                />
            }
        </div>
    );
};

export default UsersPage;
