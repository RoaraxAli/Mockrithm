"use server"

// Firestore helpers for User Panel
import { db } from "@/firebase/admin"
import type { User, Interview, Feedback } from "@/app/user/types"

export async function getUserData(userId: string): Promise<User | null> {
  try {
    const userDoc = await db.collection("users").doc(userId).get()
    if (userDoc.exists) {
      const data = userDoc.data()!
      return {
        ...data,
        id: userDoc.id,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt instanceof Date
          ? data.createdAt.toISOString()
          : data.createdAt ?? null,
        premiumUpdatedAt: data.premiumUpdatedAt?.toDate
          ? data.premiumUpdatedAt.toDate().toISOString()
          : data.premiumUpdatedAt instanceof Date
          ? data.premiumUpdatedAt.toISOString()
          : data.premiumUpdatedAt ?? null,
      } as unknown as User
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

    const interviews = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const rawCreatedAt = data.createdAt
      const createdAt = rawCreatedAt?.toDate ? rawCreatedAt.toDate() : new Date(rawCreatedAt)

      return {
        id: doc.id,
        ...data,
        createdAt,
      } as Interview
    })
    
    return interviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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
      const rawCreatedAt = data.createdAt
      const createdAt = rawCreatedAt?.toDate ? rawCreatedAt.toDate() : new Date(rawCreatedAt)

      return {
        id: interviewDoc.id,
        ...data,
        createdAt,
        questions: data.questions?.map((q: string, index: number) => ({ id: `q${index}`, question: q })) || [],
      } as Interview
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

    const feedbacks = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const rawCreatedAt = data.createdAt
      const createdAt = rawCreatedAt?.toDate ? rawCreatedAt.toDate() : new Date(rawCreatedAt)

      return {
        id: doc.id,
        ...data,
        createdAt,
        categoryScores: data.categoryScores?.map((c: any) => ({
          category: c.name,
          score: c.score,
          maxScore: 100,
        })) || [],
      } as Feedback
    })
    
    return feedbacks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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

  return {
    id: docSnap.id,
    ...data,
    createdAt: new Date(data.createdAt),
    strengths: data.strengths || [],
    areasForImprovement: data.areasForImprovement || [],
    categoryScores: data.categoryScores?.map((c: any) => ({
      category: c.name,     
      score: c.score,
      maxScore: 100,           
    })) || [],
  } as Feedback
}


export async function updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
  try {
    await db.collection("users").doc(userId).update(data)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}
