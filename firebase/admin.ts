import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initFirebaseAdmin() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn(
        "Firebase Admin: Missing credentials. Admin SDK will not be initialized. " +
        "This is expected during build time."
      );
      return { auth: null as any, db: null as any };
    }

    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    } catch (error) {
      console.error("Firebase Admin initialization failed:", error);
      return { auth: null as any, db: null as any };
    }
  }
  return { auth: getAuth(), db: getFirestore() };
}

export const { auth, db } = initFirebaseAdmin();
