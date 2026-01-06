import dotenv from "dotenv";
dotenv.config(); // 🔥 GUARANTEED ENV LOAD

import admin from "firebase-admin";

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY not available at firebase init");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: privateKey.replace(/\\n/g, "\n"),
    }),
       storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();