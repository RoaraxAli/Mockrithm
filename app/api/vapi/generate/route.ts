import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action";

const VALID_TYPES = ["technical", "behavioural", "mixed"];
const VALID_LEVELS = ["junior", "mid", "senior", "lead", "intern", "entry"];

/** Strip special characters that could be used for prompt injection */
function sanitizeLLMInput(input: string, maxLen = 100): string {
  return input.replace(/[^\w\s,.\-#+()/&]/g, "").slice(0, maxLen);
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.id !== userid) {
    return Response.json(
      { success: false, error: "Forbidden: Tenant isolation violation." },
      { status: 403 }
    );
  }

  // Validate allowlisted enums
  if (!VALID_TYPES.includes(type)) {
    return Response.json({ success: false, error: "Invalid interview type." }, { status: 400 });
  }
  if (!VALID_LEVELS.includes(level)) {
    return Response.json({ success: false, error: "Invalid experience level." }, { status: 400 });
  }

  // Sanitize free-text inputs to prevent prompt injection
  const safeRole = sanitizeLLMInput(role, 80);
  const safeTechstack = sanitizeLLMInput(techstack, 200);
  const safeAmount = Math.min(Math.max(parseInt(amount) || 5, 1), 20);

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${safeRole}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${safeTechstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${safeAmount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    // Safe JSON parse: strip markdown code fences if present
    const cleanedQuestions = questions.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    let parsedQuestions: string[];
    try {
      parsedQuestions = JSON.parse(cleanedQuestions);
    } catch (parseErr) {
      console.error("Failed to parse AI questions output:", cleanedQuestions);
      return Response.json({ success: false, error: "AI returned malformed question data. Please retry." }, { status: 502 });
    }

    const interview = {
      role: safeRole,
      type: type,
      level: level,
      techstack: safeTechstack.split(",").map((s: string) => s.trim()).filter(Boolean),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
