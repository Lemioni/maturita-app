import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKZ8Najd-n5nfRfU7kf8Ke8dCv8efooRQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mojematurita-eb2ea.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mojematurita-eb2ea",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mojematurita-eb2ea.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "413053567592",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:413053567592:web:4699de9156fdead96f31dd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DV2H8SMKCN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;