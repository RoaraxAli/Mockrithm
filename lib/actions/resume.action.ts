"use server";

import { cache } from "react";
import { db } from "@/firebase/admin";
import { ResumeDocument, ParsedResume, AtsScoreResult } from "@/types/resume";
import { assertOwnership } from "@/lib/actions/getAuthenticatedUserId";

export async function saveParsedResume(params: {
  userId: string;
  fileName: string;
  rawText: string;
  parsedData: ParsedResume;
  atsAnalysis?: AtsScoreResult;
  country?: string;
}): Promise<{ success: boolean; resumeId?: string; error?: string }> {
  try {
    await assertOwnership(params.userId);
    const { userId, fileName, rawText, parsedData, atsAnalysis, country } = params;

    const resumeData: ResumeDocument = {
      userId,
      fileName,
      rawText,
      parsedData,
      atsAnalysis,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db
      .collection("users")
      .doc(userId)
      .collection("resumes")
      .add(resumeData);

    if (country) {
      await db.collection("users").doc(userId).set({ country }, { merge: true });
    }

    return { success: true, resumeId: docRef.id };
  } catch (error: any) {
    console.error("Error saving parsed resume:", error);
    return { success: false, error: error.message };
  }
}

export const getUserResumes = cache(async (userId: string): Promise<ResumeDocument[]> => {
  try {
    await assertOwnership(userId);
    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("resumes")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as ResumeDocument[];
  } catch (error) {
    console.error("Error fetching user resumes:", error);
    return [];
  }
});

export async function getResumeById(userId: string, resumeId: string): Promise<ResumeDocument | null> {
  try {
    await assertOwnership(userId);
    const doc = await db
      .collection("users")
      .doc(userId)
      .collection("resumes")
      .doc(resumeId)
      .get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as ResumeDocument;
  } catch (error) {
    console.error("Error fetching resume by id:", error);
    return null;
  }
}

export async function hasUploadedResume(userId: string): Promise<boolean> {
  try {
    await assertOwnership(userId);
    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("resumes")
      .limit(1)
      .get();
      
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking for uploaded resumes:", error);
    return false; // Fail safe to false to allow them to upload
  }
}

import { SAMPLE_PROFILES } from "@/components/resume/sampleProfiles";

export async function createResumeFromTemplate(
  userId: string,
  templateId: string,
  fileName: string = "Untitled Resume"
): Promise<{ success: boolean; resumeId?: string; error?: string }> {
  try {
    await assertOwnership(userId);
    const defaultProfile = SAMPLE_PROFILES[templateId] || {
      basics: { name: "", label: "", email: "", phone: "", summary: "" },
      work: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      socialLinks: []
    };

    const initialResumeData: ParsedResume = {
      ...defaultProfile,
      templateId
    };

    const resumeData: ResumeDocument = {
      userId,
      fileName,
      rawText: "",
      parsedData: initialResumeData,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db
      .collection("users")
      .doc(userId)
      .collection("resumes")
      .add(resumeData);

    return { success: true, resumeId: docRef.id };
  } catch (error: any) {
    console.error("Error creating resume from template:", error);
    return { success: false, error: error.message };
  }
}

export async function updateResumeData(
  userId: string,
  resumeId: string,
  parsedData: ParsedResume
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertOwnership(userId);
    await db
      .collection("users")
      .doc(userId)
      .collection("resumes")
      .doc(resumeId)
      .update({
        parsedData,
        updatedAt: new Date().toISOString()
      });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating resume data:", error);
    return { success: false, error: error.message };
  }
}

export async function saveAtsAnalysis(
  userId: string,
  resumeId: string,
  atsAnalysis: AtsScoreResult
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertOwnership(userId);
    await db
      .collection("users")
      .doc(userId)
      .collection("resumes")
      .doc(resumeId)
      .update({
        atsAnalysis,
        updatedAt: new Date().toISOString()
      });

    return { success: true };
  } catch (error: any) {
    console.error("Error saving ATS analysis:", error);
    return { success: false, error: error.message };
  }
}


