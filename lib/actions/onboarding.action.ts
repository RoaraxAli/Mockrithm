"use server";

import { db } from "@/firebase/admin";

export async function saveOnboardingData(params: {
  userId: string;
  country: string;
  role: string;
  rawText: string;
  parsedData: any;
  atsAnalysis: any;
  fixedParsedData: any;
  summary: string;
}) {
  try {
    const { userId, country, role, rawText, parsedData, atsAnalysis, fixedParsedData, summary } = params;

    // Save to user doc: country, targetRole, onboarded: true, and resumeData
    await db.collection("users").doc(userId).set({
      country,
      targetRole: role,
      onboarded: true,
      resumeData: {
        rawText,
        parsedData,
        atsAnalysis,
        fixedParsedData,
        summary,
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error("Error saving onboarding data server-side:", error);
    return { success: false, error: error.message };
  }
}
