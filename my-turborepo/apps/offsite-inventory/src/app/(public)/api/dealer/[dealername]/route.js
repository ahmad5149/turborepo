import { db } from "@/services/firebase-admin";

export async function GET(request, { params }) {
    try {
        const dealer = params.dealername;
        const dealers = await db.collection("dealers").where("dealerURI", "==", dealer).get();
        if (dealers.docs.length == 0) {
            return Response.json({});
        } else {
            const dealerData = dealers.docs[0].data();
            return Response.json({ dealerData });
        }
    } catch (e) {
        console.log("Error in dealers fetching");
        console.log(e.message);
        return Response.json({});
    }
}
