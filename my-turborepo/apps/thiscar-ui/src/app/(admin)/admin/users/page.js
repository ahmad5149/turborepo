import { db } from "@/services/firebase-admin";
import Users from "../../../../components/admin/users/Users";
import { UserMobileListing } from "../../../../components/admin/users/UserMobileListing";
import { fetchUsersData } from "./../../../../services/userService";
import { GetUsers } from "@/services/userService";
import { transformUserData } from "../../../../utils/transformData";
import { getAllDealers } from "@/services/dealerService";

export const metadata = {
    title: "Users",
    description: "Users Page"
};

const getUsers = async (uuid, q, sortby, sortOrder) => {
    const limit = 10;

    try {
        const userRef = db.collection("users");

        let query = userRef.orderBy(sortby, sortOrder).orderBy("uuid");
        query = query.where("isDeleted", "==", false);

        if (q?.length > 0) {
            query = query.startAt(q).endAt(q + "\uf8ff");
        } else if (uuid?.length > 0) {
            query = query.startAfter(uuid);
        }

        const result = await query.limit(limit).get();

        const users = result.docs.map((doc) => doc.data());
        return JSON.parse(JSON.stringify(users));
    } catch (err) {
        console.log(err);
    }
    return [];
};

const UsersPage = async ({ params, searchParams }) => {
    let query = {
        sortBy: searchParams?.sortBy || "firstName",
        sortOrder: searchParams?.sortOrder || "asc",
        page: searchParams?.page || 1,
        q: searchParams?.q || "",
        dealer: ""
    };
    let usersData = await GetUsers(query);
    usersData = transformUserData(usersData?.hits);
    usersData = JSON.parse(JSON.stringify(usersData));
    //const users = await getUsers(searchParams?.uuid, searchParams?.q, query.sortBy, query.sortOrder);
    const dealers = await getAllDealers();

    return (
        <div className="text-center">
            <div className="user-desktop-listing">
                <Users
                    dealerOptions={dealers}
                    users={usersData}
                    fetchUsersData={fetchUsersData}
                />
            </div>
            <div className="user-mobile-listing">
                <UserMobileListing fetchUsersData={fetchUsersData} />
            </div>
        </div>
    );
};

export default UsersPage;
