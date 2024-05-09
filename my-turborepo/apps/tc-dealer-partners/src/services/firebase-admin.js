import { initializeApp, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

try {
    getApp();
} catch (error) {
    initializeApp({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,
            clientEmail: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
            privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
        })
    });
}
export const admin = getApp();
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
