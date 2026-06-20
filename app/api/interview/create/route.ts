import { NextResponse } from "next/server";
import { generateText, generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action";

const codingProblemSchema = z.object({
  title: z.string(),
  description: z.string(),
  templateCode: z.string(),
  language: z.string(),
});

export async function POST(request: Request) {
  try {
    const {
      type,
      role,
      level,
      techstack,
      amount,
      userid,
      resumeText,
      jobDescription,
    } = await request.json();

    if (!role || !level || !type || !techstack || !userid) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.id !== userid) {
      return NextResponse.json(
        { error: "Forbidden: Tenant isolation violation." },
        { status: 403 }
      );
    }

    // 1. Fetch user info for personalization
    const userSnap = await db.collection("users").doc(userid).get();
    const userData = userSnap.data();
    const userName = userData?.name || "Candidate";

    // Normalize techstack to array of strings
    const techArray = Array.isArray(techstack)
      ? techstack
      : typeof techstack === "string"
      ? techstack.split(",").map((s) => s.trim())
      : [];

    // 2. Generate custom, tailored questions
    const questionsPrompt = `
      Prepare exactly ${amount} interview questions for a job interview.
      The job role is ${role} (${level} level).
      The tech stack is: ${techArray.join(", ")}.
      The focus between behavioral and technical questions should lean towards: ${type}.
      
      ${resumeText ? `Candidate's Resume:\n${resumeText}\n` : ""}
      ${jobDescription ? `Target Job Description:\n${jobDescription}\n` : ""}
      
      Requirements:
      - If a resume is provided, at least 2 questions should be directly related to the projects or experience listed on the resume. The interviewer should ask the candidate to walk through these specific projects.
      - If a job description is provided, customize the technical and behavioral questions to align with the core requirements of that job.
      - Return ONLY the questions as a JSON string array. Do not include markdown like \`\`\`json or \`\`\`. Example format: ["Question 1", "Question 2", "Question 3"]
      - Make sure questions do not use special characters like "/" or "*" which might break voice assistant text-to-speech.
    `;

    const { text: questionsResponse } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: questionsPrompt,
    });

    let questionsList: string[] = [];
    try {
      // Clean potential JSON markdown formatting if present
      const cleanedJSON = questionsResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      questionsList = JSON.parse(cleanedJSON);
    } catch (e) {
      console.warn("Failed to parse AI questions as JSON, fallback to line splitting", e);
      // Fallback parser: split by lines and strip number prefix
      questionsList = questionsResponse
        .split("\n")
        .map((line) => line.replace(/^\d+[\.\)]\s*/, "").replace(/[\[\]\",]/g, "").trim())
        .filter((line) => line.length > 0)
        .slice(0, amount);
    }

    // 3. Generate a coding problem if it's a technical or mixed interview
    let codingProblem = null;
    const isTechnical = type.toLowerCase() === "technical" || type.toLowerCase() === "mixed";
    if (isTechnical) {
      try {
        const { object } = await generateObject({
          model: google("gemini-2.5-flash"),
          schema: codingProblemSchema,
          prompt: `
            Generate a coding challenge suitable for a ${level}-level ${role}.
            Primary Tech/Language: ${techArray[0] || "JavaScript/TypeScript"}.
            Provide:
            1. An algorithmic or structure coding problem title (e.g. "Two Sum", "Debounce function").
            2. A short, clear description of the problem, input/output requirements, and an example.
            3. A clean starter code template that the candidate will edit.
            4. The primary language name (lowercase, e.g. "javascript", "python").
          `,
        });
        codingProblem = object;
      } catch (err) {
        console.error("Failed to generate coding problem, using fallback:", err);
        codingProblem = {
          title: "Two Sum",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
          templateCode: "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
          language: "javascript",
        };
      }
    }

    // 4. Generate unique first message (welcome greeting)
    const welcomePrompt = `
      Create a unique, conversational first greeting from an AI interviewer named Alex.
      Candidate Name: ${userName}
      Job Role: ${role} (${level})
      
      ${resumeText ? `Resume Context:\n${resumeText}\n` : ""}
      
      Guidelines:
      - Do NOT start with the standard "tell me about yourself and your experience" line.
      - Acknowledge the candidate warmly, mention their name, and bring up a specific project, skill, or experience from their resume (if available) or show enthusiasm about their profile.
      - Keep it short, engaging, and professional. 2 sentences maximum.
      - Write only plain text. No markdown.
    `;

    const { text: firstMessage } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: welcomePrompt,
    });

    // 5. Save the interview record in Firestore
    const interviewData = {
      role: role,
      type: type,
      level: level,
      techstack: techArray,
      questions: questionsList,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      resumeText: resumeText || "",
      jobDescription: jobDescription || "",
      firstMessage: firstMessage.trim() || "Hello! Thank you for taking the time to speak with me today.",
      codingProblem: codingProblem,
    };

    const docRef = await db.collection("interviews").add(interviewData);

    return NextResponse.json({ success: true, interviewId: docRef.id }, { status: 200 });
  } catch (error: any) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create interview" },
      { status: 500 }
    );
  }
}
