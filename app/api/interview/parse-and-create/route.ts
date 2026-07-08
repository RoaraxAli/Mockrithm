import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { interviewLanguages } from "@/constants";
import { fetchGroq } from "@/lib/apiKeyManager";

async function groqChatCompletion(messages: any[], jsonMode = false) {
  const response = await fetchGroq("/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
    const { messages, userid, userResumeData, language, duration } = await request.json();
    console.log("[DEBUG] /api/interview/parse-and-create received payload:");
    console.log(`- User ID: ${userid}`);
    console.log(`- Language: ${language || "en-US"}`);
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

    const targetLangConfig = interviewLanguages.find((l) => l.code === language) || interviewLanguages[0];
    const languageInstruction = `LANGUAGE REQUIREMENT: The session language is "${targetLangConfig.name}" (Code: ${targetLangConfig.code}). You MUST output text ONLY in this language. Do not mix languages. Do not write Roman script translation (e.g. if Urdu is selected, write exclusively in actual Urdu script/characters, never in English or Roman Urdu).`;

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
      
      CRITICAL INSTRUCTIONS:
      - Scan the Transcript first. If the candidate explicitly chose to practice a role DIFFERENT from their default targetRole (e.g. "Prime Minister of Pakistan", "Joker", etc.), you MUST override the role and use this new requested role.
      - If the role is changed/overridden from the default targetRole, DO NOT use the techstack/skills or resume details from the Resume/Profile Data (e.g. do not use JavaScript, React, Node.js for a Prime Minister or Joker). Instead, generate relevant competencies/skills for the new chosen role (e.g. for Prime Minister: "crisis leadership", "governance", "public policy", "foreign affairs"; for Joker: "stand-up comedy", "timing", "joke delivery", "crowd interaction").
      - Only set "requiresSandbox" to true if the chosen option/mode explicitly involves a coding task, a mathematics problem-solving task, an essay-writing task, or a written drafting task (e.g. policy memo drafting, speech writing, script writing, solving math equations). If the chosen option is a verbal interview, Q&A session, verbal debate, or oral defense, "requiresSandbox" MUST be false.
      
      You must return ONLY a JSON object conforming exactly to this schema:
      {
        "role": "extracted/inferred job role",
        "level": "extracted/inferred experience level: Junior, Mid-level, Senior, or Lead",
        "techstack": ["technology1", "technology2", ... or key competencies],
        "type": "the selected option/mode (e.g. Public Address, Stand-up Set, Technical, Behavioral, Live Coding Sandbox, etc.)",
        "amount": number of questions (default to 5 if not specified),
        "requiresSandbox": true/false,
        "sandboxTitle": "a suitable title for the written challenge (if requiresSandbox is true)",
        "sandboxDescription": "instructions for the written/coding challenge (if requiresSandbox is true)",
        "sandboxTemplate": "initial text/code structure to edit (if requiresSandbox is true)",
        "sandboxLanguage": "syntax highlighting language (e.g. javascript, python, markdown, text - default is 'text')"
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
      The tech stack to ask about is: ${(setup.techstack || []).join(", ")}.
      The focus between behavioral and technical questions should lean towards: ${setup.type}.
      
      CRITICAL REQUIREMENTS:
      - ${languageInstruction}
      - Questions MUST be strictly relevant to the listed tech stack or core competencies: ${(setup.techstack || []).join(", ")}. Do NOT ask questions about other tools, languages, or frameworks not explicitly listed.
      - CRITICAL FRONTEND REQUIREMENT: If the role is Frontend Engineer or includes "frontend" / "front-end", you MUST NOT ask any database, SQL, backend, or cloud systems questions. Only ask about HTML, CSS, JavaScript, React, and general Web APIs/browser concepts. Never ask SQL queries or database optimization questions.
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

    // 4. Generate custom challenge if sandbox is required
    let codingProblem = null;
    if (setup.requiresSandbox) {
      console.log("[DEBUG] Sandbox/Workspace is required. Generating custom task...");
      try {
        const codingPrompt = `
          Generate a written, coding, or mathematical challenge suitable for a ${setup.level}-level ${setup.role} for the session mode "${setup.type}".
          Key topics/skills: ${(setup.techstack || []).join(", ") || "General"}.
          
          CRITICAL FRONTEND REQUIREMENT: If the role is Frontend Engineer or includes "frontend" / "front-end", you MUST NOT generate any database, SQL, backend, or cloud systems coding tasks. The task must focus entirely on client-side web technologies (HTML, CSS, JavaScript, React, UI components, state management, or browser APIs).
          
          CRITICAL:
          - ${languageInstruction}
          - Create a modern, practical example. For coding roles, ask the candidate to write code from scratch or fix a broken snippet (e.g., implementing React state counter, correcting a function bug, handling async APIs, etc.).
          - Do NOT provide the full solution in the template. The template should only have a broken/buggy code snippet or an empty template skeleton to complete, with clear comments explaining what to do.
          - Example: If React, ask them to implement a Counter component using useState, leaving the function body/handlers blank for them to write.
          
          You must return ONLY a JSON object conforming to this schema:
          {
            "title": "challenge/drafting/solving title",
            "description": "challenge description and instructions for the candidate",
            "templateCode": "starter text, equations, or code template/buggy snippet for the candidate to build upon",
            "language": "language name in lowercase (e.g. javascript, typescript, python, markdown, text, latex - default is 'text')"
          }
        `;
        const codingResponseText = await groqChatCompletion([
          { role: "system", content: "You only output a valid JSON coding or drafting challenge." },
          { role: "user", content: codingPrompt }
        ], true);
        console.log(`[DEBUG] Raw challenge response from Groq: ${codingResponseText}`);
        codingProblem = JSON.parse(codingResponseText);
        console.log("[DEBUG] Generated custom problem/task:", codingProblem);
      } catch (err: any) {
        console.error("[ERROR] Failed to generate/parse custom challenge. Falling back to default.", err);
        codingProblem = {
          title: setup.sandboxTitle || "Practice Task",
          description: setup.sandboxDescription || "Complete the practice exercise in the workspace editor.",
          templateCode: setup.sandboxTemplate || "",
          language: setup.sandboxLanguage || "text",
        };
      }
    }

    // 5. Generate unique dynamic first welcome greeting
    const welcomePrompt = `
      You are an AI interviewer named Alex. The candidate has already been introduced to the interview details and is ready to begin.
      Candidate Name: ${userName}
      Job Role: ${setup.role} (${setup.level})
      First Question to ask: "${questionsList[0] || ""}"
      
      Guidelines:
      - ${languageInstruction}
      - Do NOT greet, introduce yourself again, or say hello. Confirm that the interview is beginning and state the first question directly in your response.
      - Keep it extremely short: 2 sentences maximum. No markdown.
      - Example: "Great, let's start the ${setup.role} interview. Here is your first question: ${questionsList[0] || ""}"
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
      duration: duration || "medium",
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
