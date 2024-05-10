"use server";

import { db } from "../../services/firebase-admin";

export const manageUserSettings = async ({ email, uid }) => {
    try {
        const fetchWidgets = db.collection("widgets");
        const userWidgetsCollection = db.collection("userWidgets");

        const widgetsSnapshot = await fetchWidgets.where("active", "==", true).get();
        const querySnapshot = await userWidgetsCollection.where("email", "==", email).where("uid", "==", uid).get();

        if (!querySnapshot.empty) {
            const currentSetting = querySnapshot.docs[0].data();

            const allActiveWidgets = widgetsSnapshot.docs.map((doc) => doc.data());

            const visibilityMap = currentSetting.widgets.reduce((map, item) => {
                map.set(item.label, item.visibility);
                return map;
            }, new Map());

            const updatedData = allActiveWidgets.map((item) => {
                const { active, ...rest } = item;
                return {
                    ...rest,
                    visibility: visibilityMap.get(item.label)
                };
            });
            return { email, uid, widgets: updatedData };
        } else {
            const allActiveWidgets = widgetsSnapshot.docs.map((doc) => {
                const { label } = doc.data();
                return { label, visibility: true };
            });

            await userWidgetsCollection.add({ email, uid, widgets: allActiveWidgets });

            const activeModifiedWidgets = widgetsSnapshot.docs.map((doc) => {
                const { active, ...rest } = doc.data();
                return {
                    ...rest,
                    visibility: true
                };
            });
            return { email, uid, widgets: activeModifiedWidgets };
        }
    } catch (error) {
        console.error("Error managing user settings:", error);
        throw error;
    }
};

export const updateUserSettings = async ({ email, uid, widgets }) => {
    try {
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
    } catch (error) {
        console.error("Error managing user settings:", error);
        throw error;
    }
};
