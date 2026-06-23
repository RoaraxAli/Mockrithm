import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action";

async function groqChatCompletion(messages: any[], jsonMode = false) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.GROQ_LLM_MODEL || "llama-3.3-70b-versatile",
      messages,
      response_format: jsonMode ? { type: "json_object" } : undefined
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API returned status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function POST(request: Request) {
  try {
    const { messages, userid, userResumeData } = await request.json();
    console.log("[DEBUG] /api/interview/parse-and-create received payload:");
    console.log(`- User ID: ${userid}`);
    console.log(`- Messages Count: ${messages?.length || 0}`);
    console.log(`- Resume Data Target Role: ${userResumeData?.targetRole || "None Provided"}`);

    if (!messages || !userid) {
      console.error("[ERROR] Missing required parameters messages or userid.");
      return NextResponse.json(
        { error: "Conversation history and user ID are required." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.id !== userid) {
      console.error(`[ERROR] Forbidden access attempt. Tenant isolation violation. Authenticated user ID: ${currentUser?.id || "None"}, Payload user ID: ${userid}`);
      return NextResponse.json(
        { error: "Forbidden: Tenant isolation violation." },
        { status: 403 }
      );
    }

    // 1. Fetch candidate name for greeting personalization
    console.log("[DEBUG] Fetching candidate name from Firestore...");
    const userSnap = await db.collection("users").doc(userid).get();
    const userData = userSnap.data();
    const userName = userData?.name || "Candidate";
    console.log(`[DEBUG] Candidate name: ${userName}`);

    // 2. Parse setup preferences from conversation transcript
    const transcriptText = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    const setupPrompt = `
      Analyze the following conversation transcript between a candidate and an interview setup assistant, as well as the candidate's resume/profile data.
      
      Candidate Resume/Profile Data:
      ${JSON.stringify(userResumeData || {})}
      
      Transcript:
      ${transcriptText}
      
      Extract or infer the configured job interview parameters.
      You must return ONLY a JSON object conforming exactly to this schema:
      {
        "role": "extracted/inferred job role, e.g. React Developer",
        "level": "extracted/inferred experience level: Junior, Mid-level, Senior, or Lead",
        "techstack": ["technology1", "technology2", ...],
        "type": "Technical", "Behavioral", or "Mixed",
        "amount": number of questions (default to 5 if not specified)
      }
    `;

    console.log("[DEBUG] Parsing setup preferences using Groq...");
    let setup;
    try {
      const setupResponseText = await groqChatCompletion([
        { role: "system", content: "You are a setup parser. You only output valid JSON conforming to the requested schema." },
        { role: "user", content: setupPrompt }
      ], true);
      console.log(`[DEBUG] Raw setup response from Groq: ${setupResponseText}`);
      setup = JSON.parse(setupResponseText);
      console.log("[DEBUG] Parsed setup preferences:", setup);
    } catch (e: any) {
      console.error("[ERROR] Failed to parse setup preferences from Groq response:", e);
      throw e;
    }

    // 3. Generate tailored questions
    const questionsPrompt = `
      Prepare exactly ${setup.amount || 5} interview questions for a job interview.
      The job role is ${setup.role} (${setup.level} level).
      The tech stack is: ${(setup.techstack || []).join(", ")}.
      The focus between behavioral and technical questions should lean towards: ${setup.type}.
      
      Requirements:
      - Return ONLY a JSON object with a single "questions" key containing the array of questions. Example:
      {
        "questions": ["Question 1", "Question 2", "Question 3"]
      }
      - Do not use special characters which might break voice text-to-speech.
    `;

    console.log("[DEBUG] Generating tailored questions using Groq...");
    let questionsList: string[] = [];
    try {
      const questionsResponseText = await groqChatCompletion([
        { role: "system", content: "You only output valid JSON containing the array of questions." },
        { role: "user", content: questionsPrompt }
      ], true);
      console.log(`[DEBUG] Raw questions response from Groq: ${questionsResponseText}`);
      const questionsObj = JSON.parse(questionsResponseText);
      questionsList = questionsObj.questions || [];
      console.log(`[DEBUG] Inferred Questions (${questionsList.length}):`, questionsList);
    } catch (e: any) {
      console.error("[ERROR] Failed to parse tailored questions from Groq response:", e);
      throw e;
    }

    // 4. Generate custom coding problem if technical/mixed
    let codingProblem = null;
    const isTechnical = String(setup.type || "").toLowerCase() === "technical" || String(setup.type || "").toLowerCase() === "mixed";
    if (isTechnical) {
      console.log("[DEBUG] Focus is Technical/Mixed. Generating coding challenge...");
      try {
        const codingPrompt = `
          Generate a coding challenge suitable for a ${setup.level}-level ${setup.role}.
          Primary Tech/Language: ${(setup.techstack || [])[0] || "JavaScript/TypeScript"}.
          
          You must return ONLY a JSON object conforming to this schema:
          {
            "title": "challenge title",
            "description": "challenge description",
            "templateCode": "starter template code",
            "language": "language name in lowercase"
          }
        `;
        const codingResponseText = await groqChatCompletion([
          { role: "system", content: "You only output a valid JSON coding challenge." },
          { role: "user", content: codingPrompt }
        ], true);
        console.log(`[DEBUG] Raw coding challenge response from Groq: ${codingResponseText}`);
        codingProblem = JSON.parse(codingResponseText);
        console.log("[DEBUG] Generated coding problem:", codingProblem);
      } catch (err: any) {
        console.error("[ERROR] Failed to generate/parse custom coding challenge. Falling back to default Two Sum challenge.", err);
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

    console.log("[DEBUG] Generating welcome message using Groq...");
    let firstMessage = "Hello! Ready to start.";
    try {
      firstMessage = await groqChatCompletion([
        { role: "user", content: welcomePrompt }
      ]);
      console.log(`[DEBUG] Generated first message: "${firstMessage}"`);
    } catch (e: any) {
      console.error("[ERROR] Failed to generate first welcome message. Using fallback.", e);
    }

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

    console.log("[DEBUG] Saving generated interview details to Firestore collection 'interviews'...");
    const docRef = await db.collection("interviews").add(interviewData);
    console.log(`[DEBUG] Firestore document saved successfully with ID: ${docRef.id}`);

    return NextResponse.json({
      success: true,
      interviewId: docRef.id,
      questions: questionsList,
      codingProblem: codingProblem,
      firstMessage: interviewData.firstMessage,
    }, { status: 200 });
  } catch (error: any) {
    console.error("[FATAL ERROR] /api/interview/parse-and-create caught unhandled error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to finalize setup" },
      { status: 500 }
    );
  }
}
