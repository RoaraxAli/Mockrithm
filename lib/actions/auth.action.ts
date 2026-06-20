"use server";

import { cache } from "react";
import { db } from "@/firebase/admin";
import { auth as clerkAuth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";

export async function checkRateLimit() {
  return { isBanned: false };
}

export async function recordLoginAttempt(success: boolean) {
  // no-op
}

export async function checkEmailExists(email: string) {
  return { exists: false };
}

export async function setSessionCookie(idToken: string) {
  // no-op
}

export async function signUp(params: any) {
  return { success: true };
}

export async function signIn(params: any) {
  return { success: true };
}

export async function signOut() {
  // no-op
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const { userId } = await clerkAuth();
    if (!userId) return null;

    const userDocRef = db.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log("Creating new user document in Firestore for Clerk ID:", userId);
      const clerkUser = await clerkCurrentUser();
      if (!clerkUser) return null;

      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      const name = clerkUser.fullName || clerkUser.firstName || email.split("@")[0] || "New User";
      const imageUrl = clerkUser.imageUrl || "";
      const isAdmin = email === "ahmed@gmail.com";
      const role = isAdmin ? "Admin" : "User";

      const newUserData = {
        name,
        email,
        imageUrl,
        role,
        createdAt: new Date(),
        status: "Active",
      };

      await userDocRef.set(newUserData);
      return {
        id: userId,
        ...newUserData,
        createdAt: newUserData.createdAt.toISOString(),
      } as unknown as User;
    }

    let rawData = userDoc.data();
    
    // Sync updates from Clerk if they changed
    try {
      const clerkUser = await clerkCurrentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || "";
        const name = clerkUser.fullName || clerkUser.firstName || email.split("@")[0] || "New User";
        const imageUrl = clerkUser.imageUrl || "";
        
        if (
          rawData?.name !== name ||
          rawData?.email !== email ||
          rawData?.imageUrl !== imageUrl
        ) {
          console.log("Syncing Clerk user details to Firestore for ID:", userId);
          const updates = {
            name,
            email,
            imageUrl,
            updatedAt: new Date(),
          };
          await userDocRef.set(updates, { merge: true });
          rawData = {
            ...rawData,
            ...updates,
          };
        }
      }
    } catch (e: any) {
      console.error("Failed to sync Clerk data inside getCurrentUser:", e.message);
    }

    const userData = {
      ...rawData,
      id: userDoc.id,
      createdAt: rawData?.createdAt?.toDate
        ? rawData.createdAt.toDate().toISOString()
        : rawData?.createdAt instanceof Date
        ? rawData.createdAt.toISOString()
        : rawData?.createdAt ?? null,
      premiumUpdatedAt: rawData?.premiumUpdatedAt?.toDate
        ? rawData.premiumUpdatedAt.toDate().toISOString()
        : rawData?.premiumUpdatedAt instanceof Date
        ? rawData.premiumUpdatedAt.toISOString()
        : rawData?.premiumUpdatedAt ?? null,
      updatedAt: rawData?.updatedAt?.toDate
        ? rawData.updatedAt.toDate().toISOString()
        : rawData?.updatedAt instanceof Date
        ? rawData.updatedAt.toISOString()
        : rawData?.updatedAt ?? null,
    } as unknown as User;
    console.log("Server user data fetched:", userData.name);
    return userData;
  } catch (error: any) {
    console.error("Error in getCurrentUser:", error.message);
    return null;
  }
});

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function getUserProfile(uid: string) {
  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      return {
        success: true,
        name: data?.name || "User",
        role: data?.role || "User",
        email: data?.email || "",
        tier: data?.tier || null,
      };
    }
    return { success: false, message: "User not found" };
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return { success: false, message: error.message };
  }
}

export async function updateUserTier(userId: string, tier: "freemium" | "premium" | "pro") {
  try {
    await db.collection("users").doc(userId).set({ tier }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user tier:", error);
    return { success: false, message: error.message };
  }
}
