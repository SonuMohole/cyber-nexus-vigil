import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!firebaseConfig) {
  throw new Error("❌ FIREBASE_SERVICE_ACCOUNT is not defined in .env");
}

const serviceAccount = JSON.parse(firebaseConfig);

// 🔥 Fix for PEM newlines 🔥
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Admin Initialized");

export default admin;
