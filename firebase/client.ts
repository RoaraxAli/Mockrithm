import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  projectId: "mockrithm",
  appId: "1:138025815317:web:b97169a1a7209970ebad1c",
  databaseURL: "https://mockrithm-default-rtdb.firebaseio.com",
  storageBucket: "mockrithm.firebasestorage.app",
  apiKey: "AIzaSyAb-Lj30_u4iGCOQihx7zbdIG-T8rJTZws",
  authDomain: "mockrithm.firebaseapp.com",
  messagingSenderId: "138025815317",
  measurementId: "G-2MZ6M1W59S",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
