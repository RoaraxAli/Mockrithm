import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

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

    console.log("[DEBUG] Starting ATS Resume Analysis using Zenmux GLM-4.7...");
    const response = await fetch("https://zenmux.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer sk-ai-v1-4920d263924179c0ea44a15eae5a86c5952353b776d649496f42a33095cae754",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "z-ai/glm-4.7-flash-free",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: `You are an expert ATS (Applicant Tracking System) optimization bot and recruiter.
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

Return the response in raw JSON format matching this schema:
{
  "atsScore": number,
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "bulletPointSuggestions": [
    {
      "original": "string",
      "suggested": "string",
      "explanation": "string"
    }
  ]
}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Zenmux API returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;
    const object = JSON.parse(resultText);

    return NextResponse.json(object, { status: 200 });
  } catch (error: any) {
    console.error("Error in resume analysis API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
