"use server";

import { cache } from "react";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

async function groqGenerateObject(prompt: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_LLM_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant. Return your response ONLY as a valid JSON object matching the requested schema. Do not output any markdown formatting, thoughts, or markdown codeblocks outside the JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API returned status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content || "";
  return JSON.parse(text);
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId, averageWpm, topFillerWords } = params;
  const userSnap = await db.collection("users").doc(userId).get();
  const userData = userSnap.data();

  const candidateName = userData?.name || "Candidate";
  const email = userData?.email || "candidate@example.com";
  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    let object;
    const promptText = `
        You are an AI interviewer evaluating a candidate's mock interview performance.

        Strict Rules:
        - Always evaluate across the 5 categories in this exact order:
          1. "Communication Skills"
          2. "Technical Knowledge"
          3. "Problem Solving"
          4. "Cultural Fit"
          5. "Confidence and Clarity"
        - For each category object, you must output exactly:
          - "name": (the exact literal string name of the category as listed above)
          - "score": (numeric score 0 to 100)
          - "comment": (short justification comment for the score, explaining why they got the score and how they can improve)
        - Scores must be from 0 to 100.
        - If candidate does not answer, says "I don’t know", or microphone is not connected (no audio detected/purposely bad answers), assign a score of 0 (or very low score) for the affected category and explain it in the comment (e.g., "No audio detected or answer was missing"). Do not crash.
        - Do not invent or assume answers not present in the transcript.
        - Be professional, direct, and constructive in feedback.

        Interview Transcript:
        ${formattedTranscript}
      `;

    try {
      console.log("[DEBUG] Calling primary Groq model for final feedback generation...");
      const groqJson = await groqGenerateObject(promptText + `\n\nSchema format:\n{\n  "totalScore": number,\n  "categoryScores": [\n    { "name": "Communication Skills", "score": number, "comment": "string" },\n    { "name": "Technical Knowledge", "score": number, "comment": "string" },\n    { "name": "Problem Solving", "score": number, "comment": "string" },\n    { "name": "Cultural Fit", "score": number, "comment": "string" },\n    { "name": "Confidence and Clarity", "score": number, "comment": "string" }\n  ],\n  "strengths": ["string"],\n  "areasForImprovement": ["string"],\n  "finalAssessment": "string"\n}`);
      
      const categories = [
        "Communication Skills",
        "Technical Knowledge",
        "Problem Solving",
        "Cultural Fit",
        "Confidence and Clarity"
      ];
      const categoryScores = categories.map((catName) => {
        const found = groqJson.categoryScores?.find((c: any) => c.name === catName) || {};
        return {
          name: catName,
          score: typeof found.score === "number" ? found.score : 70,
          comment: found.comment || "No comment provided."
        };
      });

      object = {
        totalScore: typeof groqJson.totalScore === "number" ? groqJson.totalScore : 70,
        categoryScores: categoryScores,
        strengths: Array.isArray(groqJson.strengths) ? groqJson.strengths : ["Good effort"],
        areasForImprovement: Array.isArray(groqJson.areasForImprovement) ? groqJson.areasForImprovement : ["Structure responses better"],
        finalAssessment: groqJson.finalAssessment || "Keep practicing."
      };
    } catch (err: any) {
      console.warn("Primary feedback model Groq failed, trying Gemini-2.0-flash-001...", err.message);
      try {
        const result = await generateObject({
          model: google("gemini-2.0-flash-001", {
            structuredOutputs: true,
          }),
          schema: feedbackSchema,
          prompt: promptText,
        });
        object = result.object;
      } catch (geminiErr: any) {
        console.warn("Primary feedback model gemini-2.0-flash-001 failed, trying gemini-2.5-flash...", geminiErr.message);
        const result = await generateObject({
          model: google("gemini-2.5-flash", {
            structuredOutputs: true,
          }),
          schema: feedbackSchema,
          prompt: promptText,
        });
        object = result.object;
      }
    }

    const feedback = {
      interviewId,
      userId,
      candidateName, 
      email,         
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date(),
      averageWpm: averageWpm || 0,
      topFillerWords: topFillerWords || [],
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("interviewsfeedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("interviewsfeedback").doc();
    }

    await feedbackRef.set(feedback);

    // Mark the interview document as finalized in Firestore
    try {
      await db.collection("interviews").doc(interviewId).update({ finalized: true });
    } catch (e) {
      console.error("Failed to mark interview as finalized:", e);
    }

    // Trigger self-improving profile refinement algorithm asynchronously
    optimizeUserProfileWithFeedback(userId, feedback).catch((err) => {
      console.error("Profile auto-optimization failed:", err);
    });

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export const getFeedbackByInterviewId = cache(async (
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> => {
  const { interviewId, userId } = params;

  const querySnapshot = await db
  .collection("interviewsfeedback")
  .where("interviewId", "==", interviewId)
  .where("userId", "==", userId)
  .limit(1)
  .get();
  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  const data = feedbackDoc.data();
  return {
    id: feedbackDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate
      ? data.createdAt.toDate().toISOString()
      : data.createdAt instanceof Date
      ? data.createdAt.toISOString()
      : data.createdAt ?? null,
  } as unknown as Feedback;
});

export const getFeedbacksForUser = cache(async (userId: string): Promise<Feedback[]> => {
  if (!userId) return [];
  const querySnapshot = await db
    .collection("interviewsfeedback")
    .where("userId", "==", userId)
    .get();
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : data.createdAt instanceof Date
        ? data.createdAt.toISOString()
        : data.createdAt ?? null,
    };
  }) as unknown as Feedback[];
});

export const getLatestInterviews = cache(async (
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> => {
  const { userId, limit = 20 } = params;

  // Fetch recent interviews and filter in memory to avoid index requirements
  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .limit(limit * 5) // Fetch a larger batch to ensure we have enough finalized ones
    .get();

  return interviews.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt instanceof Date
          ? data.createdAt.toISOString()
          : data.createdAt ?? null,
      };
    })
    .filter((interview: any) => 
      interview.finalized === true && 
      interview.userId !== userId
    )
    .slice(0, limit) as unknown as Interview[];
});

export const getInterviewsByUserId = cache(async (
  userId: string
): Promise<Interview[] | null> => {
  const querySnapshot = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .get();

  const interviews = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : data.createdAt instanceof Date
        ? data.createdAt.toISOString()
        : data.createdAt ?? null,
    };
  }) as unknown as Interview[];
  
  return interviews.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
});

export async function optimizeUserProfileWithFeedback(userId: string, feedback: any) {
  try {
    const userDocRef = db.collection("users").doc(userId);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) return;

    const userData = userDoc.data();
    if (!userData || !userData.onboarded || !userData.resumeData) return;

    const currentResumeData = userData.resumeData;
    const currentParsedData = currentResumeData.fixedParsedData || currentResumeData.parsedData || {};

    const workList = (currentParsedData.work || []).map((w: any) => ({
      company: w.company,
      position: w.position,
      highlights: w.highlights
    }));

    let object;
    const optimizationSchema = z.object({
      summary: z.string().describe("Polished professional summary incorporating candidate strengths demonstrated in mock interviews"),
      skills: z.array(z.string()).describe("Polished list of skills incorporating newly demonstrated competencies and removing/adjusting weak ones"),
      work: z.array(
        z.object({
          company: z.string(),
          position: z.string(),
          highlights: z.array(z.string()).describe("Polished and perfected work highlights for this position using the STAR framework, integrating achievements")
        })
      ).describe("Polished work experience highlights")
    });

    const optPrompt = `
        You are an elite Career Coach, Technical Recruiter, and Resume Writer.
        Your task is to analyze a candidate's current resume details along with their latest mock interview feedback, and output an optimized, refined, and perfected set of professional details.
        
        Mock Interview Feedback:
        - Score: ${feedback.totalScore}%
        - Demonstrated Strengths: ${JSON.stringify(feedback.strengths)}
        - Areas for Improvement: ${JSON.stringify(feedback.areasForImprovement)}
        - Assessment Summary: ${feedback.finalAssessment}
        
        Current Resume Profile Details:
        - Summary: ${currentParsedData.basics?.summary || ""}
        - Skills: ${JSON.stringify(currentParsedData.skills || [])}
        - Work Experience: ${JSON.stringify(workList)}
        
        Refinement Guidelines:
        1. Professional Summary: Perfect the summary. Incorporate key technical strengths demonstrated in the interview, while maintaining a professional and crisp tone. Keep it under 4 sentences.
        2. Skills: Refine the skills list. Retain valid technical skills, add skills they demonstrated competence in during the interview, and ensure the list is clean and highly relevant.
        3. Work Experience Highlights: Refine the bullet points (highlights) for each job. Apply the STAR framework. If the interview feedback highlighted positive technical depth or specific project achievements, subtly weave that context into the bullet points. Ensure they start with strong action verbs and feel extremely premium. Do not change the company name or position.
      `;

    try {
      const result = await generateObject({
        model: google("gemini-2.5-flash", {
          structuredOutputs: false,
        }),
        schema: optimizationSchema,
        prompt: optPrompt,
      });
      object = result.object;
    } catch (err: any) {
      console.warn("Primary optimization model gemini-2.5-flash failed, trying gemini-2.0-flash...", err.message);
      const result = await generateObject({
        model: google("gemini-2.0-flash", {
          structuredOutputs: false,
        }),
        schema: optimizationSchema,
        prompt: optPrompt,
      });
      object = result.object;
    }

    // Merge the optimized details back into Firestore under fixedParsedData
    const updatedParsedData = {
      ...currentParsedData,
      basics: {
        ...(currentParsedData.basics || {}),
        summary: object.summary
      },
      skills: object.skills,
      work: (currentParsedData.work || []).map((w: any) => {
        const matchingFix = object.work.find(
          (fw: any) => fw.company.toLowerCase().includes(w.company.toLowerCase()) || w.company.toLowerCase().includes(fw.company.toLowerCase())
        );
        return {
          ...w,
          highlights: matchingFix ? matchingFix.highlights : w.highlights
        };
      })
    };

    const optimizationLog = `Optimized after mock interview for role '\${userData.targetRole || "Unknown"}'. Rating: \${feedback.totalScore}%. Refined summary and highlights based on demonstrated competencies.`;

    await userDocRef.update({
      "resumeData.fixedParsedData": updatedParsedData,
      "resumeData.summary": optimizationLog,
      "resumeData.updatedAt": new Date().toISOString()
    });

    console.log("User profile optimized successfully for user ID:", userId);
  } catch (error) {
    console.error("Failed to run profile optimization algorithm:", error);
  }
}
