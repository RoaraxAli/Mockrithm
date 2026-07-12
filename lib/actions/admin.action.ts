"use server";

import { db } from "@/firebase/admin";
import { getCurrentUser } from "./auth.action";
import { FieldValue } from "firebase-admin/firestore";

// --- Audit Logging Helper ---
async function logAdminAction(adminId: string, action: string, details?: Record<string, any>) {
  try {
    await db.collection("auditLogs").add({
      adminId,
      action,
      details: details || {},
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

// --- Users (legacy non-paginated, kept for backward compat) ---
export async function getAdminUsers() {
  try {
    const user = await getCurrentUser();
    const isAdmin = user && user.role?.toLowerCase() === "admin";
    if (!user || !isAdmin) {
      return { success: false, error: "Forbidden" };
    }

    const querySnapshot = await db.collection("users").orderBy("createdAt", "desc").get();
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

// --- Users (paginated) ---
export async function getAdminUsersPaginated(pageSize: number = 20, startAfterId?: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    let query = db.collection("users").orderBy("createdAt", "desc").limit(pageSize);

    if (startAfterId) {
      const cursorDoc = await db.collection("users").doc(startAfterId).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.data().name || "",
      email: doc.data().email || "",
      role: doc.data().role || "User",
      status: doc.data().status || "Active",
      createdAt: doc.data().createdAt?.toDate
        ? doc.data().createdAt.toDate().toISOString()
        : doc.data().createdAt ?? null,
    }));

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    return {
      success: true,
      data: users,
      nextCursorId: lastDoc?.id || null,
      hasMore: snapshot.docs.length === pageSize,
    };
  } catch (error: any) {
    console.error("Failed to fetch paginated users:", error);
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
    await logAdminAction(user.id, "DELETE_USER", { targetUserId: userId });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message };
  }
}

// --- Role Management ---
export async function updateUserRole(userId: string, newRole: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    const validRoles = ["User", "Admin", "Moderator"];
    if (!validRoles.includes(newRole)) {
      return { success: false, error: `Invalid role. Must be one of: ${validRoles.join(", ")}` };
    }

    await db.collection("users").doc(userId).update({ role: newRole });
    await logAdminAction(user.id, "UPDATE_USER_ROLE", { targetUserId: userId, newRole });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update user role:", error);
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

    // Feedback metrics — combine both collections with real growth
    const [interviewFbTotal, supportFbTotal, interviewFbThisMonth, supportFbThisMonth, interviewFbLastMonth, supportFbLastMonth] = await Promise.all([
      db.collection("interviewsfeedback").count().get().then((s: any) => s.data().count),
      db.collection("feedback").count().get().then((s: any) => s.data().count),
      db.collection("interviewsfeedback").where("createdAt", ">=", thirtyDaysAgo).count().get().then((s: any) => s.data().count),
      db.collection("feedback").where("createdAt", ">=", thirtyDaysAgo).count().get().then((s: any) => s.data().count),
      db.collection("interviewsfeedback").where("createdAt", ">=", sixtyDaysAgo).where("createdAt", "<", thirtyDaysAgo).count().get().then((s: any) => s.data().count),
      db.collection("feedback").where("createdAt", ">=", sixtyDaysAgo).where("createdAt", "<", thirtyDaysAgo).count().get().then((s: any) => s.data().count),
    ]);
    const feedbackTotal = interviewFbTotal + supportFbTotal;
    const feedbackThisMonth = interviewFbThisMonth + supportFbThisMonth;
    const feedbackLastMonth = interviewFbLastMonth + supportFbLastMonth;

    const feedbackChange =
      feedbackLastMonth > 0
        ? ((feedbackThisMonth - feedbackLastMonth) / feedbackLastMonth) * 100
        : feedbackThisMonth > 0
        ? 100
        : 0;

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
          change: feedbackChange.toFixed(1),
          isPositive: feedbackChange >= 0,
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
    // Use Firestore orderBy + limit to fetch only the 10 most recent items per collection
    const [usersSnap, interviewFbSnap, supportFbSnap] = await Promise.all([
      db.collection("users").orderBy("createdAt", "desc").limit(10).get(),
      db.collection("interviewsfeedback").orderBy("createdAt", "desc").limit(10).get(),
      db.collection("feedback").orderBy("createdAt", "desc").limit(10).get(),
    ]);

    const serializeDate = (val: any) => {
      if (!val) return null;
      if (val.toDate) return val.toDate().toISOString();
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string") return val;
      if (val._seconds) return new Date(val._seconds * 1000).toISOString();
      return null;
    };

    const recentUsers = usersSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: serializeDate(doc.data().createdAt),
    }));

    // Merge both feedback collections, re-sort, take top 10
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
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    // Delete a single batch of up to 500 documents per call.
    // Returns progress info so the UI can display remaining count
    // and let the admin click "Delete Next Batch" if more remain.
    const BATCH_SIZE = 500;
    const collectionRef = db.collection("sessions");
    const snapshot = await collectionRef.orderBy("__name__").limit(BATCH_SIZE).get();

    if (snapshot.size === 0) {
      await logAdminAction(user.id, "RESET_SESSIONS", { deletedCount: 0, remaining: 0 });
      return { success: true, deletedCount: 0, remaining: 0 };
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
    await batch.commit();

    // Check remaining count
    const remainingSnap = await collectionRef.count().get();
    const remaining = remainingSnap.data().count;

    await logAdminAction(user.id, "RESET_SESSIONS", { deletedCount: snapshot.size, remaining });

    return {
      success: true,
      deletedCount: snapshot.size,
      remaining,
    };
  } catch (error) {
    console.error("Error resetting sessions:", error);
    return { success: false, error: "Failed to reset sessions" };
  }
}

// --- Full JSON Export (separate from the activity feed) ---
export async function exportFullActivityJSON() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    const serializeDate = (val: any) => {
      if (!val) return null;
      if (val.toDate) return val.toDate().toISOString();
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string") return val;
      if (val._seconds) return new Date(val._seconds * 1000).toISOString();
      return null;
    };

    const [usersSnap, interviewFbSnap, supportFbSnap] = await Promise.all([
      db.collection("users").orderBy("createdAt", "desc").get(),
      db.collection("interviewsfeedback").orderBy("createdAt", "desc").get(),
      db.collection("feedback").orderBy("createdAt", "desc").get(),
    ]);

    const users = usersSnap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: serializeDate(doc.data().createdAt),
    }));

    const feedbacks = [
      ...interviewFbSnap.docs.map((doc: any) => ({
        id: doc.id,
        source: "interviewsfeedback",
        ...doc.data(),
        createdAt: serializeDate(doc.data().createdAt),
      })),
      ...supportFbSnap.docs.map((doc: any) => ({
        id: doc.id,
        source: "feedback",
        ...doc.data(),
        createdAt: serializeDate(doc.data().createdAt),
      })),
    ];

    await logAdminAction(user.id, "EXPORT_JSON", { userCount: users.length, feedbackCount: feedbacks.length });

    return {
      success: true,
      data: JSON.stringify({ users, feedbacks, exportedAt: new Date().toISOString() }, null, 2),
    };
  } catch (error) {
    console.error("Error exporting JSON:", error);
    return { success: false, error: "Failed to export data" };
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

export async function getBlogs() {
  try {
    const querySnapshot = await db.collection("blogs").get();
    let blogs = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.data().title || "",
      category: doc.data().category || "",
      excerpt: doc.data().excerpt || "",
      content: doc.data().content || "",
      date: doc.data().date || "",
      readTime: doc.data().readTime || "",
      author: doc.data().author || "",
      createdAt: doc.data().createdAt ?? null,
    }));

    if (blogs.length === 0) {
      const seedBlogs = [
        {
          title: "How to Bypass Modern ATS Screeners",
          category: "Resume Strategy",
          excerpt: "An in-depth look at how corporate parsing engines analyze PDF and Docx files. Learn why complex grids and visual styling could get your application auto-rejected.",
          content: "Corporate screening engines utilize automated parsers to match credentials. Multi-column grids or dynamic diagrams frequently trigger parser failures. To maximize your success rate, design clean single-column templates, prioritize clear sections like experience and education, and use standardized system fonts.",
          date: "June 12, 2026",
          readTime: "5 min read",
          author: "Ahmed Hussain",
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
          title: "Top 5 Vocal Filler Words to Avoid",
          category: "Speech Articulation",
          excerpt: "Scientific research on speech pacing shows vocal filler counts directly affect an interviewer's perception of your confidence. Learn simple breathing methods to sound clean.",
          content: "Verbal fillers like 'um', 'like', and 'ah' interrupt communication cycles. Training with real-time pace guides teaches speakers to pause silently instead of vocalizing pauses, projecting confidence and command of topics.",
          date: "May 28, 2026",
          readTime: "4 min read",
          author: "Speech Team",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          title: "Mastering the AI Mock Interview",
          category: "Interview Prep",
          excerpt: "A comprehensive developer guide on explaining system design concepts and algorithmic answers cleanly to interactive voice models using the STAR method.",
          content: "Conversing with AI interviewers requires clarity and structure. Use the STAR (Situation, Task, Action, Result) format to organize answers. Explain your technical choices step-by-step to demonstrate structural systems design experience.",
          date: "May 15, 2026",
          readTime: "6 min read",
          author: "AI Labs",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
        {
          title: "Design Patterns in System Architecture",
          category: "System Design",
          excerpt: "A cheat sheet of the most commonly asked systems architecture design patterns in big-tech companies, including load balancing, cache layers, and databases shards.",
          content: "Scale requires patterns. Study rate limiting models, sharded schemas, caching architectures, and load balancing configurations to handle massive concurrent traffic profiles securely and reliably.",
          date: "April 29, 2026",
          readTime: "8 min read",
          author: "Arch Team",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        }
      ];

      for (const sb of seedBlogs) {
        await db.collection("blogs").add(sb);
      }
      
      const reSnapshot = await db.collection("blogs").get();
      blogs = reSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.data().title || "",
        category: doc.data().category || "",
        excerpt: doc.data().excerpt || "",
        content: doc.data().content || "",
        date: doc.data().date || "",
        readTime: doc.data().readTime || "",
        author: doc.data().author || "",
        createdAt: doc.data().createdAt ?? null,
      }));
    }

    // Sort descending by createdAt
    blogs.sort((a: any, b: any) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return { success: true, data: blogs };
  } catch (error: any) {
    console.error("Failed to fetch blogs:", error);
    return { success: false, error: error.message };
  }
}

export async function createBlog(blogData: any) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user && user.role?.toLowerCase() === "admin";
    if (!user || !isAdmin) {
      return { success: false, error: "Forbidden" };
    }

    const payload = {
      ...blogData,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const docRef = await db.collection("blogs").add(payload);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Failed to create blog:", error);
    return { success: false, error: error.message };
  }
}

export async function updateBlog(id: string, blogData: any) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user && user.role?.toLowerCase() === "admin";
    if (!user || !isAdmin) {
      return { success: false, error: "Forbidden" };
    }

    await db.collection("blogs").doc(id).update(blogData);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update blog:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteBlog(id: string) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user && user.role?.toLowerCase() === "admin";
    if (!user || !isAdmin) {
      return { success: false, error: "Forbidden" };
    }

    await db.collection("blogs").doc(id).delete();
    await logAdminAction(user.id, "DELETE_BLOG", { blogId: id });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete blog:", error);
    return { success: false, error: error.message };
  }
}

// --- Audit Logs Retrieval ---
export async function getAuditLogs(limitCount: number = 50) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    const snapshot = await db.collection("auditLogs")
      .orderBy("timestamp", "desc")
      .limit(limitCount)
      .get();

    const logs = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        adminId: data.adminId || "",
        action: data.action || "",
        details: data.details || {},
        timestamp: data.timestamp?.toDate
          ? data.timestamp.toDate().toISOString()
          : null,
      };
    });

    return { success: true, data: logs };
  } catch (error: any) {
    console.error("Failed to fetch audit logs:", error);
    return { success: false, error: error.message };
  }
}

