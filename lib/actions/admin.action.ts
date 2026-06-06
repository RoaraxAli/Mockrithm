"use server";

import { db } from "@/firebase/admin";
import { getCurrentUser } from "./auth.action";

export async function getAdminUsers() {
  try {
    const user = await getCurrentUser();
    const isAdmin = user && user.role?.toLowerCase() === "admin";
    if (!user || !isAdmin) {
      return { success: false, error: "Forbidden" };
    }

    const querySnapshot = await db.collection("users").get();
    const users = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.data().name || "",
      email: doc.data().email || "",
      role: doc.data().role || "User",
      status: doc.data().status || "Active",
      createdAt: doc.data().createdAt?.toDate
        ? doc.data().createdAt.toDate().toISOString()
        : doc.data().createdAt ?? null,
    }));
    return { success: true, data: users };
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAdminUser(userId: string) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user && user.role?.toLowerCase() === "admin";
    if (!user || !isAdmin) {
      return { success: false, error: "Forbidden" };
    }

    await db.collection("users").doc(userId).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminMetrics() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Users metrics
    const userTotal = (await db.collection("users").count().get()).data().count;
    const userThisMonth = (
      await db.collection("users").where("createdAt", ">=", thirtyDaysAgo).count().get()
    ).data().count;
    const userLastMonth = (
      await db
        .collection("users")
        .where("createdAt", ">=", sixtyDaysAgo)
        .where("createdAt", "<", thirtyDaysAgo)
        .count()
        .get()
    ).data().count;

    const userChange =
      userLastMonth > 0
        ? ((userThisMonth - userLastMonth) / userLastMonth) * 100
        : userThisMonth > 0
        ? 100
        : 0;

    // Feedback metrics — combine both collections
    const [interviewFbTotal, supportFbTotal] = await Promise.all([
      db.collection("interviewsfeedback").count().get().then((s) => s.data().count),
      db.collection("feedback").count().get().then((s) => s.data().count),
    ]);
    const feedbackTotal = interviewFbTotal + supportFbTotal;

    // Sessions metrics
    const sessionTotal = (await db.collection("sessions").count().get()).data().count;
    const sessionThisMonth = (
      await db.collection("sessions").where("createdAt", ">=", thirtyDaysAgo).count().get()
    ).data().count;
    const sessionLastMonth = (
      await db
        .collection("sessions")
        .where("createdAt", ">=", sixtyDaysAgo)
        .where("createdAt", "<", thirtyDaysAgo)
        .count()
        .get()
    ).data().count;

    const sessionChange =
      sessionLastMonth > 0
        ? ((sessionThisMonth - sessionLastMonth) / sessionLastMonth) * 100
        : sessionThisMonth > 0
        ? 100
        : 0;

    return {
      success: true,
      data: {
        users: {
          total: userTotal,
          change: userChange.toFixed(1),
          isPositive: userChange >= 0,
        },
        feedbacks: {
          total: feedbackTotal,
          change: "0.0",
          isPositive: true,
        },
        sessions: {
          total: sessionTotal,
          change: sessionChange.toFixed(1),
          isPositive: sessionChange >= 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    return { success: false, error: "Failed to fetch metrics" };
  }
}

export async function getRecentActivity() {
  try {
    const [usersSnap, interviewFbSnap, supportFbSnap] = await Promise.all([
      db.collection("users").limit(100).get(),
      db.collection("interviewsfeedback").limit(100).get(),
      db.collection("feedback").limit(100).get(),
    ]);

    const serializeDate = (val: any) => {
      if (!val) return null;
      if (val.toDate) return val.toDate().toISOString();
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string") return val;
      if (val._seconds) return new Date(val._seconds * 1000).toISOString();
      return null;
    };

    const recentUsers = usersSnap.docs
      .map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: serializeDate(doc.data().createdAt),
      }))
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 10);

    // Merge both feedback collections for Recent Activity feed
    const recentFeedbacks = [
      ...interviewFbSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: serializeDate(doc.data().createdAt),
      })),
      ...supportFbSnap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: serializeDate(doc.data().createdAt),
      })),
    ].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    }).slice(0, 10);

    return {
      success: true,
      data: {
        recentUsers,
        recentFeedbacks,
      },
    };
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return { success: false, error: "Failed to fetch activity" };
  }
}

export async function resetSessions() {
  try {
    const batchSize = 500;
    const collectionRef = db.collection("sessions");
    const query = collectionRef.orderBy("__name__").limit(batchSize);

    return new Promise((resolve, reject) => {
      deleteQueryBatch(query, resolve).catch(reject);
    });

    async function deleteQueryBatch(query: any, resolve: any) {
      const snapshot = await query.get();

      const batchSize = snapshot.size;
      if (batchSize === 0) {
        resolve();
        return;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      process.nextTick(() => {
        deleteQueryBatch(query, resolve);
      });
    }
  } catch (error) {
    console.error("Error resetting sessions:", error);
    return { success: false, error: "Failed to reset sessions" };
  }
}

export async function getSupportFeedback() {
  try {
    const snapshot = await db.collection("feedback").get();
    const feedbackData = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        type: data.type || "General",
        message: data.message || "",
        date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A",
        status: data.status || "Open",
      };
    });
    return { success: true, data: feedbackData };
  } catch (error) {
    console.error("Error fetching support feedback:", error);
    return { success: false, error: "Failed to fetch feedback" };
  }
}

export async function deleteSupportFeedback(id: string) {
  try {
    await db.collection("feedback").doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return { success: false, error: "Failed to delete feedback" };
  }
}

export async function updateSupportFeedbackStatus(id: string, newStatus: string) {
  try {
    await db.collection("feedback").doc(id).update({ status: newStatus });
    return { success: true };
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return { success: false, error: "Failed to update feedback status" };
  }
}
