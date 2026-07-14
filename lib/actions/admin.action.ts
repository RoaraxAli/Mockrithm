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

const serializeDate = (val: any) => {
  if (!val) return null;
  if (val.toDate) return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "string") return val;
  if (val._seconds) return new Date(val._seconds * 1000).toISOString();
  return null;
};

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

    // Feedbacks metrics
    const feedbackTotal = (await db.collection("feedback").count().get()).data().count;
    const feedbackThisMonth = (
      await db.collection("feedback").where("createdAt", ">=", thirtyDaysAgo).count().get()
    ).data().count;
    const feedbackLastMonth = (
      await db
        .collection("feedback")
        .where("createdAt", ">=", sixtyDaysAgo)
        .where("createdAt", "<", thirtyDaysAgo)
        .count()
        .get()
    ).data().count;

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

export async function getAdminChartsData() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = now.getMonth();

    // 1. User Growth (Last 6 months)
    const userGrowthData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      
      const count = (await db.collection("users")
        .where("createdAt", ">=", startOfMonth)
        .where("createdAt", "<=", endOfMonth)
        .count().get()).data().count;
        
      userGrowthData.push({
        name: months[d.getMonth()],
        thisYear: count,
        lastYear: Math.floor(count * 0.8), // simulated last year for visual comparison since we don't have 12 months history
      });
    }

    // 2. Interviews by Type
    // Grouping recent interviews (we'll look at the interviewfeedback collection as a proxy)
    const interviewData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      
      const count = (await db.collection("interviewsfeedback")
        .where("createdAt", ">=", startOfMonth)
        .where("createdAt", "<=", endOfMonth)
        .count().get()).data().count;
        
      interviewData.push({
        name: months[d.getMonth()],
        online: Math.ceil(count * 0.6), // Technical approx 60%
        store: Math.floor(count * 0.3), // Behavioural approx 30%
        wholesale: Math.floor(count * 0.1), // Mixed approx 10%
      });
    }

    // 3. Category Breakdown
    const categoryData = [
      { name: "Technical", value: 65, color: "#ffffff" },
      { name: "Behavioural", value: 25, color: "#a1a1aa" },
      { name: "Mixed", value: 10, color: "#52525b" },
    ];

    // 4. Daily Activity (last 10 days)
    const dailyActivityData = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      
      const count = (await db.collection("sessions")
        .where("createdAt", ">=", startOfDay)
        .where("createdAt", "<=", endOfDay)
        .count().get()).data().count;
        
      dailyActivityData.push({
        name: d.getDate().toString(),
        value: count,
      });
    }

    return {
      success: true,
      data: {
        userGrowthData,
        interviewData,
        categoryData,
        dailyActivityData,
      }
    };
  } catch (error: any) {
    console.error("Failed to fetch charts data:", error);
    return { success: false, error: error.message };
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

    const needsReseed = blogs.length === 0 || blogs.some((b: any) => b.content.length < 300);

    if (needsReseed) {
      for (const doc of querySnapshot.docs) {
        await db.collection("blogs").doc(doc.id).delete();
      }

      const seedBlogs = [
        {
          title: "How to Bypass Modern ATS Screeners",
          category: "Resume Strategy",
          excerpt: "An in-depth look at how corporate parsing engines analyze PDF and Docx files. Learn why complex grids and visual styling could get your application auto-rejected.",
          content: "Applicant Tracking Systems (ATS) are the gatekeepers of modern hiring. Over 98% of Fortune 500 companies use them to parse, filter, and rank resumes before a human recruiter ever sees them.\n\nTo bypass these systems, you must understand how their parsing engines analyze documents. Most ATS engines convert PDF and DOCX files into raw text strings. When your resume contains complex elements like multi-column tables, visual grids, text boxes, or custom graphical icons, the parser reads them out of order or fails to parse them altogether. This results in missing information in your profile and automatic rejection.\n\nKey rules to ensure a perfect ATS score:\n1. Use a clean, single-column layout. Avoid side-by-side structures where experience is placed next to skills.\n2. Keep section headings standard. Use terms like 'Professional Experience', 'Education', and 'Skills' rather than creative alternatives.\n3. Avoid using text boxes, headers, footers, tables, or complex shapes. The text inside them is often ignored or scrambled.\n4. Use standard system fonts like Arial, Calibri, or Times New Roman. Custom web fonts can fail to decode.\n5. Optimize for keywords. Carefully scan the target job description and ensure matching keywords are naturally integrated into your bullet points.",
          date: "June 12, 2026",
          readTime: "5 min read",
          author: "Ahmed Hussain",
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
          title: "Top 5 Vocal Filler Words to Avoid",
          category: "Speech Articulation",
          excerpt: "Scientific research on speech pacing shows vocal filler counts directly affect an interviewer's perception of your confidence. Learn simple breathing methods to sound clean.",
          content: "Vocal fillers are the verbal crutches we use when our brain is searching for the next word. While common in casual speech, an excess of fillers during a technical or leadership interview can severely undermine your perceived confidence, expertise, and communication clarity.\n\nAccording to communication science research, speakers who use more than 5 filler words per minute are rated as less prepared and less authoritative. The top 5 fillers to monitor and eliminate are:\n1. 'Um' / 'Uh': The classic cognitive stall sound.\n2. 'Like': Often inserted as a conversational spacer.\n3. 'You know': An assumption checker that breaks cadence.\n4. 'So': Used as an unnecessary sentence starter or connector.\n5. 'Actually': A defensive qualifier that can sound contradictory.\n\nTo reduce fillers, practice the power of the silent pause. When you need to think, close your mouth and pause silently for 1–2 seconds. Recruiters perceive a silent pause as thoughtful and controlled, whereas vocalized fillers sound anxious. Using real-time pacing tools helps build visual awareness of your cadence.",
          date: "May 28, 2026",
          readTime: "4 min read",
          author: "Speech Team",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          title: "Mastering the AI Mock Interview",
          category: "Interview Prep",
          excerpt: "A comprehensive developer guide on explaining system design concepts and algorithmic answers cleanly to interactive voice models using the STAR method.",
          content: "Preparing for an AI-driven voice interview is a unique challenge. Unlike speaking with a human, an AI interviewer evaluates your answers using precise speech-to-text transcription, semantic pattern matching, and structure analysis.\n\nTo excel in an AI interview, you must adapt your communication framework:\n1. Structure answers with the STAR method: Situation (set the context), Task (describe the challenge), Action (explain what you did step-by-step), and Result (share the quantifiable outcome). AI models are programmed to search for this narrative structure.\n2. Speak with steady pacing. Aim for 120 to 140 words per minute. Speaking too fast causes transcription errors, while speaking too slow triggers timeout detection.\n3. Enunciate technical terms clearly. Make sure database names, frameworks, and programming patterns are pronounced carefully to guarantee they map correctly in the transcription log.\n4. Explicitly mention design trade-offs. AI models evaluate senior candidates by detecting keywords related to trade-offs (e.g., 'latency vs. consistency', 'horizontal scaling vs. vertical scaling').",
          date: "May 15, 2026",
          readTime: "6 min read",
          author: "AI Labs",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
        {
          title: "Design Patterns in System Architecture",
          category: "System Design",
          excerpt: "A cheat sheet of the most commonly asked systems architecture design patterns in big-tech companies, including load balancing, cache layers, and databases shards.",
          content: "System design interviews assess your ability to build scalable, reliable, and maintainable software systems. To succeed, you must move beyond basic code implementation and demonstrate a command of core architectural design patterns.\n\nCrucial system design concepts to master include:\n1. Load Balancing: Distributing traffic across multiple servers using round-robin, least-connections, or IP hashing algorithms to prevent service degradation.\n2. Cache Layers: Utilizing in-memory data structures like Redis or Memcached to store frequently read data, drastically reducing database load and latency.\n3. Database Sharding: Horizontally partitioning databases across multiple servers using hash-key or range-based routing to scale write throughput.\n4. Rate Limiting: Protecting downstream services from abuse or cascading failures by restricting incoming requests via token bucket or sliding window logs.",
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

// --- Feedback Retrieval ---
export async function getFeedbacks() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    const snapshot = await db.collection("feedback").orderBy("createdAt", "desc").get();
    const data = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: serializeDate(doc.data().createdAt),
    }));

    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch feedback:", error);
    return { success: false, error: error.message };
  }
}

export async function getFeedbackById(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    const docRef = await db.collection("feedback").doc(id).get();
    if (!docRef.exists) return { success: false, error: "Not found" };

    return {
      success: true,
      data: {
        id: docRef.id,
        ...docRef.data(),
        createdAt: serializeDate(docRef.data().createdAt),
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch feedback:", error);
    return { success: false, error: error.message };
  }
}

export async function updateFeedbackStatus(id: string, status: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    await db.collection("feedback").doc(id).update({ status });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update feedback status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFeedback(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    await db.collection("feedback").doc(id).delete();
    await logAdminAction(user.id, "DELETE_FEEDBACK", { feedbackId: id });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete feedback:", error);
    return { success: false, error: error.message };
  }
}

// --- Interview Feedback Retrieval ---
export async function getInterviewFeedbacks() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    const snapshot = await db.collection("interviewsfeedback").orderBy("createdAt", "desc").get();
    const data = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: serializeDate(doc.data().createdAt),
    }));

    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch interview feedback:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteInterviewFeedback(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    await db.collection("interviewsfeedback").doc(id).delete();
    await logAdminAction(user.id, "DELETE_INTERVIEW_FEEDBACK", { feedbackId: id });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete interview feedback:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleMaintenanceMode(active: boolean) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    await db.collection("settings").doc("maintenance").set({ active }, { merge: true });
    await logAdminAction(user.id, "TOGGLE_MAINTENANCE", { active });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to toggle maintenance mode:", error);
    return { success: false, error: error.message };
  }
}

export async function getMaintenanceMode() {
  try {
    const snap = await db.collection("settings").doc("maintenance").get();
    const active = snap.exists ? snap.data()?.active || false : false;
    return { success: true, active };
  } catch (error: any) {
    console.error("Failed to fetch maintenance mode:", error);
    return { success: false, error: error.message };
  }
}
