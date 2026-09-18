"use server";

import { db } from "@/firebase/admin";
import { assertOwnership } from "./getAuthenticatedUserId";

/**
 * Checks if a username is unique in the database
 */
export async function checkUsernameUnique(username: string): Promise<{ isUnique: boolean }> {
  try {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) return { isUnique: false };

    // Regex check: only allow alphanumeric and underscores, length 3-20
    const validRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!validRegex.test(cleanUsername)) {
      return { isUnique: false };
    }

    const query = await db.collection("users")
      .where("username", "==", cleanUsername)
      .limit(1)
      .get();

    return { isUnique: query.empty };
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return { isUnique: false };
  }
}

/**
 * Updates the user's username
 */
export async function updateUsername(userId: string, username: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) return { success: false, error: "Unauthenticated" };
    await assertOwnership(userId);

    const cleanUsername = username.trim().toLowerCase();
    const uniqueCheck = await checkUsernameUnique(cleanUsername);
    if (!uniqueCheck.isUnique) {
      return { success: false, error: "Username is already taken or invalid." };
    }

    await db.collection("users").doc(userId).update({
      username: cleanUsername,
      usernameClaimed: true,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating username:", error);
    return { success: false, error: error.message || "Failed to update username" };
  }
}
