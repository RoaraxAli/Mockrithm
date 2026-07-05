import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { fetchGroq } from "@/lib/apiKeyManager";
import { loadPromptTemplate, compilePrompt } from "@/lib/promptLoader";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    let messages = body.messages || [];

    if (body.promptParams) {
      const { type, role, sessionType, language, questions, codingProblem, code, userName, userResumeData } = body.promptParams;
      let systemPrompt = "";
      
      const languageInstruction = `LANGUAGE REQUIREMENT: The candidate selected "${language || "English"}" (${language || "en-US"}). You MUST speak, ask questions, and reply ONLY in this language for the entire session. Never switch to another language unless the candidate explicitly asks you to. Keep all text plain and natural in that language.`;
      
      if (type === "interview") {
        const formattedQuestions = (questions || []).map((q: string) => `- ${q}`).join("\n");
        const candidateRoleName = role || "Software Engineer";
        const candidateSessionType = sessionType || "Interview";
        
        const personaText = candidateRoleName.toLowerCase().includes("president")
          ? "Your persona: A senior political debate moderator or veteran political journalist. Keep your tone formal, sharp, and demanding."
          : candidateRoleName.toLowerCase().includes("joker") || candidateRoleName.toLowerCase().includes("comedian")
          ? "Your persona: A comedy club owner, talent scout, or talk show host. Keep your tone conversational, witty, and responsive to humor."
          : "Your persona: A professional interviewer conducting a real-time voice interview to assess their qualifications, motivation, and fit for the role.";

        const sandboxInfo = codingProblem
          ? `Sandbox/Workspace Info:
- The candidate is working on the task/problem: "${codingProblem.title}".
- Description: ${codingProblem.description}
- Candidate's current draft/code is:
\`\`\`${codingProblem.language}
${code || ""}
\`\`\`
- If the candidate gets stuck, provide a Socratic hint to help them think in the right direction. Do NOT give them the full solution.
- CRITICAL: The sandbox is hidden from the candidate initially. You MUST output the exact tag '[SHOW_SANDBOX]' (case-insensitive) in your response as soon as you present the coding challenge or ask the candidate to write code. Do NOT output this tag on conceptual/verbal-only questions.`
          : "";

        const rawTemplate = loadPromptTemplate("interview_persona.txt");
        systemPrompt = compilePrompt(rawTemplate, {
          role: candidateRoleName,
          sessionType: candidateSessionType,
          personaText,
          languageInstruction,
          formattedQuestions,
          sandboxInfo
        });
      } else {
        const profileRole = role || userResumeData?.targetRole || "";
        const profileSummary = userResumeData?.resumeData?.parsedData?.basics?.summary || userResumeData?.resumeData?.summary || "";
        const profileSkills = userResumeData?.resumeData?.parsedData?.skills || userResumeData?.resumeData?.fixedParsedData?.skills || [];
        const skillsList = Array.isArray(profileSkills) ? profileSkills.slice(0, 6).join(", ") : "";

        const rawTemplate = loadPromptTemplate("setup_persona.txt");
        systemPrompt = compilePrompt(rawTemplate, {
          userName: userName || "Candidate",
          profileRole: profileRole || "Software Engineer",
          skillsList: skillsList || "JavaScript, React, Node.js",
          profileSummary: profileSummary || "Experienced professional",
          languageInstruction
        });
      }

      // Prepend the compiled system prompt
      messages = [
        { role: "system", content: systemPrompt },
        ...messages
      ];
    }

    const groqPayload = {
      model: body.model || process.env.GROQ_LLM_MODEL || "llama-3.3-70b-versatile",
      messages,
      stream: body.stream !== false,
    };

    const response = await fetchGroq("/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groqPayload),
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("content-type") || "text/event-stream");
    responseHeaders.set("Cache-Control", "no-cache");
    responseHeaders.set("Connection", "keep-alive");

    for (const [key, val] of response.headers.entries()) {
      if (key.startsWith("x-ratelimit-") || key === "retry-after") {
        responseHeaders.set(key, val);
      }
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
