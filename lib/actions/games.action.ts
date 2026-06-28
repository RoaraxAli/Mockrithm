"use server";

import { db } from "@/firebase/admin";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs/server";

export interface GameProgress {
  completedLevel: number;
  xp: number;
}

export interface UserGamesProgress {
  progress: Record<string, GameProgress>;
  totalXp: number;
  country: string;
  city: string;
  claimedAchievements: string[];
  gamesFriends: string[];
}

/**
 * Fetch the game progress and total XP for a user from Firestore
 * Auto-creates document with Clerk details if it doesn't exist
 */
export async function getUserGamesProgress(userId: string): Promise<UserGamesProgress> {
  try {
    if (!userId) {
      return { progress: {}, totalXp: 0, country: "United States", city: "San Francisco", claimedAchievements: [], gamesFriends: [] };
    }
    const userDocRef = db.collection("users").doc(userId);
    let userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      console.log("Auto-creating user document in games module for ID:", userId);
      const clerkUser = await clerkCurrentUser();
      const email = clerkUser?.emailAddresses[0]?.emailAddress || "";
      const name = clerkUser?.fullName || clerkUser?.firstName || email.split("@")[0] || "New User";
      const imageUrl = clerkUser?.imageUrl || "";

      const newUserData = {
        name,
        email,
        imageUrl,
        role: "User",
        createdAt: new Date(),
        status: "Active",
        gamesProgress: {},
        gamesXp: 0,
        country: "United States",
        city: "San Francisco",
        claimedAchievements: [],
        gamesFriends: []
      };

      await userDocRef.set(newUserData);
      userDoc = await userDocRef.get();
    }

    const data = userDoc.data();
    const progress = data?.gamesProgress || {};
    const totalXp = data?.gamesXp || 0;
    const country = data?.country || "United States";
    const city = data?.city || "San Francisco";
    const claimedAchievements = data?.claimedAchievements || [];
    const gamesFriends = data?.gamesFriends || []; // Empty by default!

    return { progress, totalXp, country, city, claimedAchievements, gamesFriends };
  } catch (error: any) {
    console.error("Error fetching user games progress:", error);
    return { progress: {}, totalXp: 0, country: "United States", city: "San Francisco", claimedAchievements: [], gamesFriends: [] };
  }
}

/**
 * Update the user's game progress and add XP in Firestore
 */
export async function updateUserGamesProgress(
  userId: string,
  gameId: string,
  level: number,
  xpToAdd: number
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const userDocRef = db.collection("users").doc(userId);
    
    await db.runTransaction(async (transaction: any) => {
      const doc = await transaction.get(userDocRef);
      let data: any = {};
      
      if (doc.exists) {
        data = doc.data();
      } else {
        const clerkUser = await clerkCurrentUser();
        const email = clerkUser?.emailAddresses[0]?.emailAddress || "";
        const name = clerkUser?.fullName || clerkUser?.firstName || email.split("@")[0] || "New User";
        const imageUrl = clerkUser?.imageUrl || "";
        data = {
          name,
          email,
          imageUrl,
          role: "User",
          createdAt: new Date(),
          status: "Active",
          gamesProgress: {},
          gamesXp: 0,
          country: "United States",
          city: "San Francisco",
          claimedAchievements: [],
          gamesFriends: []
        };
      }

      const currentProgress = data.gamesProgress || {};
      const currentTotalXp = data.gamesXp || 0;

      const gameData = currentProgress[gameId] || { completedLevel: 0, xp: 0 };
      const newCompletedLevel = Math.max(gameData.completedLevel, level);
      
      let newXp = gameData.xp;
      let newTotalXp = currentTotalXp;
      if (level > gameData.completedLevel) {
        newXp += xpToAdd;
        newTotalXp += xpToAdd;
      }

      const updatedProgress = {
        ...currentProgress,
        [gameId]: {
          completedLevel: newCompletedLevel,
          xp: newXp,
          updatedAt: new Date()
        }
      };

      if (doc.exists) {
        transaction.update(userDocRef, {
          gamesProgress: updatedProgress,
          gamesXp: newTotalXp,
          updatedAt: new Date()
        });
      } else {
        transaction.set(userDocRef, {
          ...data,
          gamesProgress: updatedProgress,
          gamesXp: newTotalXp,
          updatedAt: new Date()
        });
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating user games progress:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Save user location
 */
export async function saveUserLocation(userId: string, country: string, city: string) {
  try {
    if (!userId) return { success: false };
    const userDocRef = db.collection("users").doc(userId);
    await userDocRef.set({ country, city }, { merge: true });
    return { success: true };
  } catch (e: any) {
    console.error("Error saving user location:", e);
    return { success: false, error: e.message };
  }
}

/**
 * Claim an achievement persistently in Firestore
 */
export async function claimAchievementPersistent(userId: string, achievementId: string, xpReward: number) {
  try {
    if (!userId) return { success: false, error: "Unauthenticated" };
    const userDocRef = db.collection("users").doc(userId);

    await db.runTransaction(async (transaction: any) => {
      const doc = await transaction.get(userDocRef);
      if (!doc.exists) throw new Error("User not found");

      const data = doc.data() || {};
      const claimed = data.claimedAchievements || [];
      const currentXp = data.gamesXp || 0;

      if (claimed.includes(achievementId)) {
        return;
      }

      transaction.update(userDocRef, {
        claimedAchievements: [...claimed, achievementId],
        gamesXp: currentXp + xpReward,
        updatedAt: new Date()
      });
    });
    return { success: true };
  } catch (e: any) {
    console.error("Error claiming achievement:", e);
    return { success: false, error: e.message };
  }
}

/**
 * Persistent Friend adding
 */
export async function addFriendPersistent(userId: string, friendName: string) {
  try {
    if (!userId) return { success: false, error: "Unauthenticated" };
    const userDocRef = db.collection("users").doc(userId);

    const doc = await userDocRef.get();
    if (!doc.exists) return { success: false, error: "User not found" };

    const data = doc.data() || {};
    const friends = data.gamesFriends || [];

    if (friends.includes(friendName)) {
      return { success: false, error: "Friend already added" };
    }

    // Verify if the hacker exists in the users database
    const friendQuery = await db.collection("users").where("name", "==", friendName).get();
    if (friendQuery.empty) {
      return { success: false, error: "Hacker not found in Mockrithm database" };
    }

    const updatedFriends = [...friends, friendName];
    await userDocRef.update({
      gamesFriends: updatedFriends
    });

    return { success: true, friends: updatedFriends };
  } catch (e: any) {
    console.error("Error adding friend persistent:", e);
    return { success: false, error: e.message };
  }
}

/**
 * Fetch all users to build Leaderboard
 */
export async function getLeaderboardUsers() {
  try {
    const snapshot = await db.collection("users").get();
    const leaderboard = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      const progress = data.gamesProgress || {};
      const claimedAchievements = data.claimedAchievements || [];
      return {
        name: data.name || "Anonymous",
        country: data.country || "United States",
        city: data.city || "San Francisco",
        xp: data.gamesXp || 0,
        badges: Object.keys(progress).length,
        achievements: claimedAchievements.length,
        avatar: data.imageUrl || ""
      };
    });

    return { success: true, leaderboard };
  } catch (e: any) {
    console.error("Error fetching leaderboard users:", e);
    return { success: false, leaderboard: [] };
  }
}
