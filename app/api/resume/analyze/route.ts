import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { getCurrentUser } from "@/lib/actions/auth.action";

const analysisSchema = z.object({
  atsScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  bulletPointSuggestions: z.array(
    z.object({
      original: z.string(),
      suggested: z.string(),
      explanation: z.string(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: analysisSchema,
      prompt: `
        You are an expert ATS (Applicant Tracking System) optimization bot and recruiter.
        Analyze the following resume text against the target job description.
        
        Resume:
        ${resumeText}
        
        Job Description:
        ${jobDescription}
        
        Tasks:
        1. Calculate a realistic ATS Match Score (0 to 100) based on skills, keyword density, and experience alignment.
        2. Identify key skills/keywords from the Job Description that ARE present in the Resume (matchedKeywords).
        3. Identify key skills/keywords from the Job Description that ARE MISSING from the Resume (missingKeywords).
        4. Analyze the experience bullet points in the Resume and suggest 3-5 rephrased versions that incorporate missing keywords, use strong action verbs, and structure them to show impact/results (Situation-Task-Action-Result format) to pass ATS filters and recruiter screening.
      `,
    });

    return NextResponse.json(object, { status: 200 });
  } catch (error: any) {
    console.error("Error in resume analysis API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
