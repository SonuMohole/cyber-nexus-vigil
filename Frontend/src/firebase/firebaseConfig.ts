// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // optional: add more if you need
import { getFirestore } from "firebase/firestore"; // optional

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7PpM94xWjLqfADb1bkWSy3nSRHsuizas",
  authDomain: "qstellarauth.firebaseapp.com",
  projectId: "qstellarauth",
  storageBucket: "qstellarauth.firebasestorage.app",
  messagingSenderId: "645525964314",
  appId: "1:645525964314:web:d2bdb138efcea69bcc73a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional exports (use these in your other components)
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
