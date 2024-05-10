import { NextResponse } from "next/server";
import { db } from "../../../../services/firebase-admin";

export async function POST(req) {
    try {
        const payload = await req.text();

        const { email, uid, widgets } = JSON.parse(payload);

        const updatedData = widgets?.map((widget) => {
            return {
                label: widget.label,
                visibility: widget.visibility
            };
        });

        const userWidgetsCollection = db.collection("userWidgets");

        const querySnapshot = await userWidgetsCollection.where("email", "==", email).where("uid", "==", uid).get();

        if (querySnapshot.empty) {
            return { status: 403, message: "Settings not found" };
        }

        const updateRef = querySnapshot.docs[0].ref;

        await updateRef.update({ email, uid, widgets: updatedData });
        return NextResponse.json({ Message: "Success" });
    } catch (error) {
        console.error("Error managing user settings:", error);
        throw error;
    }
}
