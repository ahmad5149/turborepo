import AddDealer from "../../../../../components/admin/dealers/AddDealer";
import { db } from "../../../../../services/firebase-admin";
import { submitDealer } from "@/app/api/addDealer";
import { GetMakes } from "@/services/carService";

export const metadata = {
    title: "Dealers",
    description: "Dealers Page"
};

const getDealers = async (dealerId) => {
    try {
        const dealer = await db.collection("dealers").where("uuid", "==", dealerId).get();

        if (dealer.empty) {
            return { error: "Dealer not found" };
        }

        const documentSnapshot = dealer.docs[0];
        let dealerData = documentSnapshot.data();

        const contactsSnapshot = await documentSnapshot.ref.collection("contacts").get();
        const contactsData = contactsSnapshot.docs.map((contactDoc) => contactDoc.data());
        dealerData.contacts = contactsData;
        // dealerData.sendInvitation = false;
        return dealerData;
    } catch (err) {
        console.log("=========================================================");
        console.log(err);
        console.log("=========================================================");
    }
    return { err: "unhandled" };
};

const DealersPage = async ({ searchParams }) => {
    const makes = await GetMakes();
    let dealers = null;
    if (searchParams?.id) dealers = await getDealers(searchParams.id);

    return (
        <div className="text-center">
            {
                <AddDealer
                    dealer={dealers}
                    submitDealer={submitDealer}
                    makes={makes?.filter((x) => x.value !== "FIAT")}
                />
            }
        </div>
    );
};

export default DealersPage;
