"use server";

import { db } from "@/firebase/admin";

export interface GameProgress {
  completedLevel: number;
  xp: number;
}

export interface UserGamesProgress {
  progress: Record<string, GameProgress>;
  totalXp: number;
}

/**
 * Fetch the game progress and total XP for a user from Firestore
 */
export async function getUserGamesProgress(userId: string): Promise<UserGamesProgress> {
  try {
    if (!userId) {
      return { progress: {}, totalXp: 0 };
    }
    const userDocRef = db.collection("users").doc(userId);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      return { progress: {}, totalXp: 0 };
    }

    const data = userDoc.data();
    const progress = data?.gamesProgress || {};
    const totalXp = data?.gamesXp || 0;

    return { progress, totalXp };
  } catch (error: any) {
    console.error("Error fetching user games progress:", error);
    return { progress: {}, totalXp: 0 };
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
      if (!doc.exists) {
        throw new Error("User document does not exist");
      }

      const data = doc.data() || {};
      const currentProgress = data.gamesProgress || {};
      const currentTotalXp = data.gamesXp || 0;

      const gameData = currentProgress[gameId] || { completedLevel: 0, xp: 0 };
      
      // Only update if the completed level is higher than before
      const newCompletedLevel = Math.max(gameData.completedLevel, level);
      
      // Only add XP if we are completing a level that we haven't completed before
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

      transaction.update(userDocRef, {
        gamesProgress: updatedProgress,
        gamesXp: newTotalXp,
        updatedAt: new Date()
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating user games progress:", error);
    return { success: false, error: error.message };
  }
}
