import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, FacebookAuthProvider } from "firebase/auth";
import { appConfig } from "@/appConfig";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: appConfig.FIREBASE_API_KEY,
    authDomain: appConfig.FIREBASE_AUTH_DOMAIN,
    databaseURL: appConfig.FIREBASE_DATABASE_URL,
    projectId: appConfig.FIREBASE_PROJECT_ID,
    storageBucket: appConfig.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: appConfig.FIREBASE_MESSIGING_SENDER_ID,
    appId: appConfig.FIREBASE_APP_ID,
    measurementId: appConfig.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const clientAuth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();
