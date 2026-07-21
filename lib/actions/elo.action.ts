"use server";

import { db } from "@/firebase/admin";
import { calculateEloChange, normalizeRoleName } from "@/lib/utils/elo";
import { getCurrentUser } from "@/lib/actions/auth.action";

export interface UpdateEloParams {
  userId: string;
  interviewId: string;
  role: string;
  sessionType: string;
  totalScore: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  overallElo: number;
  roleElo: number;
  modeElo: number;
  totalInterviews: number;
  averageScore: number;
}

/**
 * Updates a user's overall, role-specific, and mode-specific Elo ratings upon completing an interview.
 */
export async function updateUserEloRating(params: UpdateEloParams) {
  const { userId, interviewId, role, sessionType, totalScore } = params;

  if (!userId) return null;

  try {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      console.warn(`[EloAction] User document not found for id: ${userId}`);
      return null;
    }

    const userData = userSnap.data() || {};
    const normalizedRole = normalizeRoleName(role);
    const safeMode = (sessionType || "Technical").trim();

    const currentOverallElo = userData.overallElo || 1200;
    const eloByRole = userData.eloByRole || {};
    const eloByMode = userData.eloByMode || {};
    const totalInterviews = (userData.totalInterviews || 0) + 1;

    const currentRoleElo = eloByRole[normalizedRole] || 1200;
    const currentModeElo = eloByMode[safeMode] || 1200;

    // Calculate rating changes
    const overallRes = calculateEloChange(currentOverallElo, totalScore);
    const roleRes = calculateEloChange(currentRoleElo, totalScore);
    const modeRes = calculateEloChange(currentModeElo, totalScore);

    const updatedEloByRole = {
      ...eloByRole,
      [normalizedRole]: roleRes.newElo,
    };

    const updatedEloByMode = {
      ...eloByMode,
      [safeMode]: modeRes.newElo,
    };

    const historyEntry = {
      interviewId: interviewId || "",
      date: new Date().toISOString(),
      role: normalizedRole,
      mode: safeMode,
      score: Math.round(totalScore),
      previousOverallElo: overallRes.previousElo,
      newOverallElo: overallRes.newElo,
      deltaElo: overallRes.deltaElo,
      roleElo: roleRes.newElo,
      roleDeltaElo: roleRes.deltaElo,
    };

    const existingHistory = Array.isArray(userData.eloHistory) ? userData.eloHistory : [];
    // Keep last 50 history entries
    const updatedHistory = [historyEntry, ...existingHistory].slice(0, 50);

    await userRef.update({
      overallElo: overallRes.newElo,
      eloByRole: updatedEloByRole,
      eloByMode: updatedEloByMode,
      totalInterviews,
      eloHistory: updatedHistory,
      updatedAt: new Date().toISOString(),
    });

    console.log(`[EloAction] Successfully updated Elo for user ${userId}: Overall ${overallRes.previousElo} -> ${overallRes.newElo} (${overallRes.deltaElo >= 0 ? "+" : ""}${overallRes.deltaElo}), ${normalizedRole}: ${roleRes.previousElo} -> ${roleRes.newElo}`);

    return {
      overallElo: overallRes.newElo,
      overallDelta: overallRes.deltaElo,
      roleElo: roleRes.newElo,
      roleDelta: roleRes.deltaElo,
      roleName: normalizedRole,
      modeElo: modeRes.newElo,
      modeDelta: modeRes.deltaElo,
    };
  } catch (error) {
    console.error("[EloAction] Error updating user Elo rating:", error);
    return null;
  }
}

/**
 * Fetches candidate leaderboard filtered by mode, role, or search query.
 */
export async function getLeaderboardData({
  searchQuery = "",
  modeFilter = "all",
  roleFilter = "all",
  limit = 50,
}: {
  searchQuery?: string;
  modeFilter?: string;
  roleFilter?: string;
  limit?: number;
}) {
  try {
    const usersSnap = await db.collection("users").get();
    let candidates: LeaderboardUser[] = [];

    usersSnap.forEach((doc) => {
      const data = doc.data();
      const name = data.name || "Candidate";
      const email = data.email || "";
      const targetRole = data.targetRole || "Software Engineer";
      const overallElo = typeof data.overallElo === "number" ? data.overallElo : 1200;
      const eloByRole = data.eloByRole || {};
      const eloByMode = data.eloByMode || {};
      const totalInterviews = data.totalInterviews || 0;

      // Determine active role Elo
      let activeRoleElo = overallElo;
      if (roleFilter !== "all" && roleFilter) {
        const normRole = normalizeRoleName(roleFilter);
        activeRoleElo = eloByRole[normRole] || 1200;
      }

      // Determine active mode Elo
      let activeModeElo = overallElo;
      if (modeFilter !== "all" && modeFilter) {
        activeModeElo = eloByMode[modeFilter] || 1200;
      }

      candidates.push({
        id: doc.id,
        name,
        email,
        targetRole,
        overallElo,
        roleElo: activeRoleElo,
        modeElo: activeModeElo,
        totalInterviews,
        averageScore: Math.round(overallElo / 20), // Proxy average score
      });
    });

    // Filter by search query (candidate name, target role, or search string)
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      candidates = candidates.filter((c) => {
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesRole = c.targetRole.toLowerCase().includes(q);
        const matchesEmail = c.email.toLowerCase().includes(q);
        return matchesName || matchesRole || matchesEmail;
      });
    }

    // Sort descending by relevant Elo score
    candidates.sort((a, b) => {
      if (roleFilter !== "all") {
        return b.roleElo - a.roleElo;
      }
      if (modeFilter !== "all") {
        return b.modeElo - a.modeElo;
      }
      return b.overallElo - a.overallElo;
    });

    return {
      success: true,
      data: candidates.slice(0, limit),
    };
  } catch (error: any) {
    console.error("[EloAction] Error fetching leaderboard data:", error);
    return {
      success: false,
      error: error.message || "Failed to load leaderboard data.",
      data: [],
    };
  }
}

/**
 * Fetches user profile Elo metrics and role rating breakdown.
 */
export async function getUserEloProfile(userId?: string) {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const currentUser = await getCurrentUser();
      if (!currentUser) return null;
      targetUserId = currentUser.id;
    }

    const userSnap = await db.collection("users").doc(targetUserId).get();
    if (!userSnap.exists) return null;

    const data = userSnap.data() || {};
    return {
      userId: targetUserId,
      name: data.name || "Candidate",
      overallElo: typeof data.overallElo === "number" ? data.overallElo : 1200,
      eloByRole: (data.eloByRole as Record<string, number>) || {},
      eloByMode: (data.eloByMode as Record<string, number>) || {},
      totalInterviews: data.totalInterviews || 0,
      eloHistory: data.eloHistory || [],
    };
  } catch (error) {
    console.error("[EloAction] Error getting user Elo profile:", error);
    return null;
  }
}
