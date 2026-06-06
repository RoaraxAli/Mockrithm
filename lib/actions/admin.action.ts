"use server";

import { db } from "@/firebase/admin";

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
      db.collection("users").orderBy("createdAt", "desc").limit(10).get(),
      db.collection("interviewsfeedback").orderBy("createdAt", "desc").limit(5).get(),
      db.collection("feedback").orderBy("createdAt", "desc").limit(5).get(),
    ]);

    const serializeDate = (val: any) =>
      val?.toDate ? val.toDate().toISOString() : val;

    const recentUsers = usersSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: serializeDate(doc.data().createdAt),
    }));

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
