import { NextResponse } from "next/server";
import { generateText, generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action";

const setupSchema = z.object({
  role: z.string(),
  level: z.string(),
  techstack: z.array(z.string()),
  type: z.enum(["Technical", "Behavioral", "Mixed"]),
  amount: z.number(),
});

export async function POST(request: Request) {
  try {
    const { messages, userid, userResumeData } = await request.json();

    if (!messages || !userid) {
      return NextResponse.json(
        { error: "Conversation history and user ID are required." },
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

    // 1. Fetch candidate name for greeting personalization
    const userSnap = await db.collection("users").doc(userid).get();
    const userData = userSnap.data();
    const userName = userData?.name || "Candidate";

    // 2. Parse setup preferences from conversation transcript using Gemini
    const transcriptText = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    const { object: setup } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: setupSchema,
      prompt: `
        Analyze the following conversation transcript between a candidate and an interview setup assistant, as well as the candidate's resume/profile data.
        
        Candidate Resume/Profile Data:
        ${JSON.stringify(userResumeData || {})}
        
        Transcript:
        ${transcriptText}
        
        Extract or infer the configured job interview parameters:
        1. Job Role (e.g. "React Developer", "Data Analyst" - use the targetRole or resume data if not mentioned in the transcript)
        2. Experience Level (Junior, Mid-level, Senior, Lead - infer from profile experience if not mentioned in the transcript)
        3. Tech Stack (Array of technologies, e.g. ["React", "TypeScript", "Node.js"] - use key skills from resume if not mentioned in the transcript)
        4. Focus/Type of interview (Technical, Behavioral, or Mixed - extracted from the transcript choice)
        5. Amount of questions (default to 5 if not specified)
      `,
    });

    // 3. Generate tailored questions
    const questionsPrompt = `
      Prepare exactly ${setup.amount} interview questions for a job interview.
      The job role is ${setup.role} (${setup.level} level).
      The tech stack is: ${setup.techstack.join(", ")}.
      The focus between behavioral and technical questions should lean towards: ${setup.type}.
      
      Requirements:
      - Return ONLY the questions as a JSON string array. Do not include markdown or bold symbols. Example: ["Question 1", "Question 2", "Question 3"]
      - Do not use special characters which might break voice text-to-speech.
    `;

    const { text: questionsResponse } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: questionsPrompt,
    });

    let questionsList: string[] = [];
    try {
      const cleanedJSON = questionsResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      questionsList = JSON.parse(cleanedJSON);
    } catch (e) {
      questionsList = questionsResponse
        .split("\n")
        .map((line) => line.replace(/^\d+[\.\)]\s*/, "").replace(/[\[\]\",]/g, "").trim())
        .filter((line) => line.length > 0)
        .slice(0, setup.amount);
    }

    // 4. Generate custom coding problem if technical/mixed
    let codingProblem = null;
    const isTechnical = setup.type.toLowerCase() === "technical" || setup.type.toLowerCase() === "mixed";
    if (isTechnical) {
      try {
        const { object } = await generateObject({
          model: google("gemini-2.5-flash"),
          schema: z.object({
            title: z.string(),
            description: z.string(),
            templateCode: z.string(),
            language: z.string(),
          }),
          prompt: `
            Generate a coding challenge suitable for a ${setup.level}-level ${setup.role}.
            Primary Tech/Language: ${setup.techstack[0] || "JavaScript/TypeScript"}.
            Provide a title, brief description, starter code, and language name (lowercase).
          `,
        });
        codingProblem = object;
      } catch (err) {
        codingProblem = {
          title: "Two Sum",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          templateCode: "function twoSum(nums, target) {\n  // Write code\n}",
          language: "javascript",
        };
      }
    }

    // 5. Generate unique dynamic first welcome greeting
    const welcomePrompt = `
      Create a unique first greeting from an AI interviewer named Alex.
      Candidate Name: ${userName}
      Job Role: ${setup.role} (${setup.level})
      
      Guidelines:
      - Warmly welcome the candidate, use their name, and tell them you are ready to start.
      - Keep it short, engaging, and professional. 2 sentences maximum. No markdown.
    `;

    const { text: firstMessage } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: welcomePrompt,
    });

    // 6. Save the interview in Firestore
    const interviewData = {
      role: setup.role,
      type: setup.type,
      level: setup.level,
      techstack: setup.techstack,
      questions: questionsList,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      firstMessage: firstMessage.trim() || "Hello! Ready to start.",
      codingProblem: codingProblem,
    };

    const docRef = await db.collection("interviews").add(interviewData);

    return NextResponse.json({
      success: true,
      interviewId: docRef.id,
      questions: questionsList,
      codingProblem: codingProblem,
      firstMessage: interviewData.firstMessage,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error parsing and generating interview:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to finalize setup" },
      { status: 500 }
    );
  }
}
