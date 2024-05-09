import { revalidatePath } from "next/cache";
import { db } from "@/services/firebase-admin";
export async function updateVehicleStatus(formData) {
    "use server";
    const id = formData.get("id");
    const kind = formData.get("kind");

    try {
        await db.collection("inspectionRequests").doc(id).update({
            status: kind,
            updatedAt: new Date()
        });
    } catch (error) {
        console.log(error);
    }

    revalidatePath("/wholesale", "page");
}
