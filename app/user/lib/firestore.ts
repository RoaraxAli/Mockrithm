"use server"

// Firestore helpers for User Panel
import { db } from "@/firebase/admin"
import { clerkClient } from "@clerk/nextjs/server"
import type { User, Interview, Feedback } from "@/app/user/types"

// Helper to recursively serialize firestore timestamps and dates
function serializeDoc(data: any): any {
  if (!data) return data
  const serialized: any = {}
  for (const key of Object.keys(data)) {
    const value = data[key]
    if (value && typeof value.toDate === "function") {
      serialized[key] = value.toDate().toISOString()
    } else if (value instanceof Date) {
      serialized[key] = value.toISOString()
    } else if (Array.isArray(value)) {
      serialized[key] = value.map(item => (item && typeof item === "object" ? serializeDoc(item) : item))
    } else if (value && typeof value === "object" && value.constructor === Object) {
      serialized[key] = serializeDoc(value)
    } else {
      serialized[key] = value
    }
  }
  return serialized
}

export async function getUserData(userId: string): Promise<User | null> {
  try {
    const userDoc = await db.collection("users").doc(userId).get()
    if (userDoc.exists) {
      return serializeDoc({
        id: userDoc.id,
        ...userDoc.data()
      }) as User
    }
    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    throw error
  }
}

export async function getUserInterviews(userId: string): Promise<Interview[]> {
  try {
    const querySnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get()

    const interviews = querySnapshot.docs.map((doc: any) => {
      return serializeDoc({
        id: doc.id,
        ...doc.data()
      }) as Interview
    })
    
    return interviews.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error fetching user interviews:", error)
    throw error
  }
}

export async function getInterviewById(interviewId: string): Promise<Interview | null> {
  try {
    const interviewDoc = await db.collection("interviews").doc(interviewId).get()
    if (interviewDoc.exists) {
      const data = interviewDoc.data()!
      return serializeDoc({
        id: interviewDoc.id,
        ...data,
        questions: data.questions?.map((q: string, index: number) => ({ id: `q${index}`, question: q })) || [],
      }) as Interview
    }
    return null
  } catch (error) {
    console.error("Error fetching interview:", error)
    throw error
  }
}

export async function getUserFeedback(userId: string): Promise<Feedback[]> {
  try {
    const querySnapshot = await db
      .collection("interviewsfeedback")
      .where("userId", "==", userId)
      .get()

    const feedbacks = querySnapshot.docs.map((doc: any) => {
      const data = doc.data()
      return serializeDoc({
        id: doc.id,
        ...data,
        categoryScores: data.categoryScores?.map((c: any) => ({
          category: c.name,
          score: c.score,
          maxScore: 100,
        })) || [],
      }) as Feedback
    })
    
    return feedbacks.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error fetching user feedback:", error)
    throw error
  }
}

export async function getInterviewFeedback(interviewId: string): Promise<Feedback | null> {
  const querySnapshot = await db
    .collection("interviewsfeedback")
    .where("interviewId", "==", interviewId)
    .get()
    
  if (querySnapshot.empty) return null

  const docSnap = querySnapshot.docs[0]
  const data = docSnap.data()

  return serializeDoc({
    id: docSnap.id,
    ...data,
    strengths: data.strengths || [],
    areasForImprovement: data.areasForImprovement || [],
    categoryScores: data.categoryScores?.map((c: any) => ({
      category: c.name,     
      score: c.score,
      maxScore: 100,           
    })) || [],
  }) as Feedback
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
  try {
    // 1. Update Firestore
    await db.collection("users").doc(userId).update(data)

    // 2. Sync to Clerk if name is updated
    if (data.name) {
      const parts = data.name.trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      const client = await clerkClient()
      await client.users.updateUser(userId, {
        firstName,
        lastName,
      })
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

