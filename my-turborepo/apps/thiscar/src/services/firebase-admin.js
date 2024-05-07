import { initializeApp, getApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
// Import the functions you need from the SDKs you need
// import { initializeApp, cert } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSIGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
try {
    getApp();
} catch (error) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,
                clientEmail: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
                privateKey: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
            })
        });
    } catch (error) {
        initializeApp(firebaseConfig);
    }
}
export const admin = getApp();
export const db = getFirestore();
export const storage = getStorage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
export const auth = getAuth();
