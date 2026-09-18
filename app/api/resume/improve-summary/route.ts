import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { label, skills, currentSummary } = await request.json();

    const promptText = `
      You are an elite professional resume writer.
      Generate a compelling, highly professional, and energetic 2-4 sentence summary (profile summary / executive summary) for a candidate's resume.
      
      Target Job Title: ${label || "Professional"}
      Skills / Core Focus Areas: ${skills && skills.length > 0 ? skills.join(", ") : "general industry practices"}
      Current Draft / Context: ${currentSummary || "No draft provided. Write a fresh, standard summary."}
      
      Requirements:
      1. Keep it professional, concise (between 300 to 500 characters, or 2 to 4 sentences).
      2. Start with a strong hook using action-oriented words.
      3. Quantify impact or potential where relevant.
      4. DO NOT include any markdown headers, bullet points, introductory remarks (like "Here is your summary:"), or placeholders.
      5. Output ONLY the raw text summary string.
    `;

    let summaryText = "";
    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: promptText,
      });
      summaryText = text;
    } catch (err: any) {
      console.warn("Primary model gemini-2.5-flash failed, trying gemini-2.0-flash...", err.message);
      const { text } = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: promptText,
      });
      summaryText = text;
    }

    return NextResponse.json({ summary: summaryText.trim() });
  } catch (error: any) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
