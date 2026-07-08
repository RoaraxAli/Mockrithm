"use server";

import { db } from "@/firebase/admin";
import { assertOwnership } from "@/lib/actions/getAuthenticatedUserId";

export interface GameProgress {
  completedLevel: number;
  xp: number;
  updatedAt?: string | null;
}

export interface UserGamesProgress {
  progress: Record<string, GameProgress>;
  totalXp: number;
  country: string;
  city: string;
  claimedAchievements: string[];
  gamesFriends: string[];
  soundPreference: string;
  locationSet: boolean;
}

/**
 * Fetch the game progress and total XP for a user from Firestore.
 * Auto-creates document with passed Clerk metadata if it doesn't exist.
 */
export async function getUserGamesProgress(
  userId: string,
  clientName?: string,
  clientEmail?: string,
  clientImageUrl?: string
): Promise<UserGamesProgress> {
  try {
    if (!userId) {
      return {
        progress: {},
        totalXp: 0,
        country: "",
        city: "",
        claimedAchievements: [],
        gamesFriends: [],
        soundPreference: "chime",
        locationSet: false
      };
    }
    await assertOwnership(userId);
    const userDocRef = db.collection("users").doc(userId);
    let userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log("Auto-creating user document in games module for ID:", userId);
      const email = clientEmail || "";
      const name = clientName || email.split("@")[0] || "New User";
      const imageUrl = clientImageUrl || "";

      const newUserData = {
        name,
        email,
        imageUrl,
        role: "User",
        createdAt: new Date(),
        status: "Active",
        gamesProgress: {},
        gamesXp: 0,
        country: "",
        city: "",
        locationSet: false,
        claimedAchievements: [],
        gamesFriends: [],
        soundPreference: "chime"
      };

      await userDocRef.set(newUserData);
      userDoc = await userDocRef.get();
    }

    const data = userDoc.data();
    const progress = data?.gamesProgress || {};
    const totalXp = data?.gamesXp || 0;
    const country = data?.country || "";
    const city = data?.city || "";
    const locationSet = data?.locationSet === true;
    const claimedAchievements = data?.claimedAchievements || [];
    const gamesFriends = data?.gamesFriends || [];
    const soundPreference = data?.soundPreference || "chime";

    // Safely serialize nested gamesProgress updatedAt timestamps
    const serializedProgress: Record<string, GameProgress> = {};
    for (const gameId in progress) {
      const gData = progress[gameId];
      if (gData) {
        const dateVal = gData.updatedAt;
        serializedProgress[gameId] = {
          completedLevel: gData.completedLevel || 0,
          xp: gData.xp || 0,
          updatedAt: dateVal?.toDate
            ? dateVal.toDate().toISOString()
            : dateVal instanceof Date
            ? dateVal.toISOString()
            : typeof dateVal === "string"
            ? dateVal
            : null
        };
      }
    }

    return {
      progress: serializedProgress,
      totalXp,
      country,
      city,
      claimedAchievements,
      gamesFriends,
      soundPreference,
      locationSet
    };
  } catch (error: any) {
    console.error("Error fetching user games progress:", error);
    return {
      progress: {},
      totalXp: 0,
      country: "",
      city: "",
      claimedAchievements: [],
      gamesFriends: [],
      soundPreference: "chime",
      locationSet: false
    };
  }
}

/**
 * Update the user's game progress and add XP in Firestore
 */
export async function updateUserGamesProgress(
  userId: string,
  gameId: string,
  level: number,
  xpToAdd?: number, // Ignored on server to prevent parameter manipulation
  clientName?: string,
  clientEmail?: string,
  clientImageUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }
    await assertOwnership(userId);

    const userDocRef = db.collection("users").doc(userId);

    await db.runTransaction(async (transaction: any) => {
      const doc = await transaction.get(userDocRef);
      let data: any = {};

      if (doc.exists) {
        data = doc.data();
      } else {
        const email = clientEmail || "";
        const name = clientName || email.split("@")[0] || "New User";
        const imageUrl = clientImageUrl || "";
        data = {
          name,
          email,
          imageUrl,
          role: "User",
          createdAt: new Date(),
          status: "Active",
          gamesProgress: {},
          gamesXp: 0,
          country: "",
          city: "",
          locationSet: false,
          claimedAchievements: [],
          gamesFriends: [],
          soundPreference: "chime"
        };
      }

      const currentProgress = data.gamesProgress || {};
      const currentTotalXp = data.gamesXp || 0;

      const gameData = currentProgress[gameId] || { completedLevel: 0, xp: 0 };
      const newCompletedLevel = Math.max(gameData.completedLevel, level);

      let newXp = gameData.xp;
      let newTotalXp = currentTotalXp;
      if (level > gameData.completedLevel) {
        // Enforce server-side verified XP reward of 100 XP per level completed
        const verifiedXp = 100;
        newXp += verifiedXp;
        newTotalXp += verifiedXp;
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
 * Save user location and mark locationSet = true
 */
export async function saveUserLocation(userId: string, country: string, city: string) {
  try {
    if (!userId) return { success: false };
    await assertOwnership(userId);
    const userDocRef = db.collection("users").doc(userId);
    await userDocRef.set({ country, city, locationSet: true }, { merge: true });
    return { success: true };
  } catch (e: any) {
    console.error("Error saving user location:", e);
    return { success: false, error: e.message };
  }
}

/**
 * Save user sound preference
 */
export async function saveUserSoundPreference(userId: string, soundPreference: string) {
  try {
    if (!userId) return { success: false };
    await assertOwnership(userId);
    const userDocRef = db.collection("users").doc(userId);
    await userDocRef.set({ soundPreference }, { merge: true });
    return { success: true };
  } catch (e: any) {
    console.error("Error saving sound preference:", e);
    return { success: false, error: e.message };
  }
}

function getVerifiedAchievementXp(achievementId: string): number {
  if (achievementId.endsWith("_novice")) return 50;
  if (achievementId.endsWith("_apprentice")) return 100;
  if (achievementId.endsWith("_acolyte")) return 150;
  if (achievementId.endsWith("_expert")) return 200;

  const catalog: Record<string, number> = {
    first_syntax: 50,
    first_rank: 100,
    century_club: 250,
    apex_dev: 600,
    poly_1: 150,
    poly_2: 300,
    poly_3: 500,
    legend: 200,
    god: 500,
    social_1: 50,
    social_2: 150
  };
  
  return catalog[achievementId] || 0;
}

/**
 * Claim an achievement persistently in Firestore
 */
export async function claimAchievementPersistent(userId: string, achievementId: string, xpReward?: number) {
  try {
    if (!userId) return { success: false, error: "Unauthenticated" };
    await assertOwnership(userId);
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

      // Enforce server-side verified reward instead of relying on client parameter
      const verifiedReward = getVerifiedAchievementXp(achievementId);

      transaction.update(userDocRef, {
        claimedAchievements: [...claimed, achievementId],
        gamesXp: currentXp + verifiedReward,
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
 * Add a friend persistently
 */
export async function addFriendPersistent(userId: string, friendName: string) {
  try {
    if (!userId) return { success: false, error: "Unauthenticated" };
    await assertOwnership(userId);
    const userDocRef = db.collection("users").doc(userId);

    const doc = await userDocRef.get();
    if (!doc.exists) return { success: false, error: "User not found" };

    const data = doc.data() || {};
    const friends = data.gamesFriends || [];

    if (friends.includes(friendName)) {
      return { success: false, error: "Already in your friends list" };
    }

    const friendQuery = await db.collection("users").where("name", "==", friendName).get();
    if (friendQuery.empty) {
      return { success: false, error: "User not found in Mockrithm database" };
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
        country: data.country || "",
        city: data.city || "",
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

/**
 * Send a friend request
 */
export async function sendFriendRequest(userId: string, senderName: string, receiverName: string) {
  try {
    if (!userId) return { success: false, error: "Unauthenticated" };
    await assertOwnership(userId);
    if (senderName.toLowerCase() === receiverName.toLowerCase()) {
      return { success: false, error: "You cannot add yourself as a friend." };
    }

    // Find receiver
    const receiverQuery = await db.collection("users").where("name", "==", receiverName).get();
    if (receiverQuery.empty) {
      return { success: false, error: "User not found in Mockrithm database." };
    }
    const receiverDoc = receiverQuery.docs[0];
    const receiverNameExact = receiverDoc.data().name;
    const receiverId = receiverDoc.id;

    // Check if already friends
    const senderDoc = await db.collection("users").doc(userId).get();
    const senderData = senderDoc.data() || {};
    const friends = senderData.gamesFriends || [];
    if (friends.includes(receiverNameExact)) {
      return { success: false, error: "Already in your friends list." };
    }

    // Check if request already exists
    const existingReq = await db.collection("friendRequests")
      .where("senderName", "==", senderName)
      .where("receiverName", "==", receiverNameExact)
      .where("status", "==", "pending")
      .get();
    if (!existingReq.empty) {
      return { success: false, error: "Friend request already sent." };
    }

    // Check if there is an incoming request from them instead
    const incomingReq = await db.collection("friendRequests")
      .where("senderName", "==", receiverNameExact)
      .where("receiverName", "==", senderName)
      .where("status", "==", "pending")
      .get();
    if (!incomingReq.empty) {
      return { success: false, error: "They have already sent you a request. Accept it instead." };
    }

    // Create the request
    await db.collection("friendRequests").add({
      senderId: userId,
      senderName,
      receiverId,
      receiverName: receiverNameExact,
      status: "pending",
      createdAt: new Date()
    });

    return { success: true };
  } catch (e: any) {
    console.error("Error sending friend request:", e);
    return { success: false, error: e.message };
  }
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(userId: string, currentUserName: string, requestId: string) {
  try {
    if (!userId) return { success: false, error: "Unauthenticated" };
    await assertOwnership(userId);
    const reqRef = db.collection("friendRequests").doc(requestId);
    const reqSnap = await reqRef.get();
    if (!reqSnap.exists) return { success: false, error: "Request not found" };

    const reqData = reqSnap.data();
    if (reqData.status !== "pending") return { success: false, error: "Request is not pending" };

    const senderName = reqData.senderName;
    const receiverName = reqData.receiverName;
    const senderId = reqData.senderId;
    const receiverId = reqData.receiverId;

    // Update request status to accepted
    await reqRef.update({ status: "accepted" });

    // Add friends bidirectionally
    const senderDocRef = db.collection("users").doc(senderId);
    const receiverDocRef = db.collection("users").doc(receiverId);

    const senderDoc = await senderDocRef.get();
    const senderFriends = senderDoc.data()?.gamesFriends || [];
    if (!senderFriends.includes(receiverName)) {
      await senderDocRef.update({
        gamesFriends: [...senderFriends, receiverName]
      });
    }

    const receiverDoc = await receiverDocRef.get();
    const receiverFriends = receiverDoc.data()?.gamesFriends || [];
    if (!receiverFriends.includes(senderName)) {
      await receiverDocRef.update({
        gamesFriends: [...receiverFriends, senderName]
      });
    }

    return { success: true };
  } catch (e: any) {
    console.error("Error accepting friend request:", e);
    return { success: false, error: e.message };
  }
}

/**
 * Decline/Delete a friend request
 */
export async function declineFriendRequest(userId: string, requestId: string) {
  try {
    if (!userId) return { success: false, error: "Unauthenticated" };
    await assertOwnership(userId);
    await db.collection("friendRequests").doc(requestId).delete();
    return { success: true };
  } catch (e: any) {
    console.error("Error declining friend request:", e);
    return { success: false, error: e.message };
  }
}
