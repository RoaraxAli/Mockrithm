import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { getCurrentUser } from "@/lib/actions/auth.action";

const starAnalysisSchema = z.object({
  situation: z.boolean(),
  task: z.boolean(),
  action: z.boolean(),
  result: z.boolean(),
  hasMetrics: z.boolean(),
  feedback: z.string(),
  labels: z.object({
    situation: z.string(),
    task: z.string(),
    action: z.string(),
    result: z.string(),
    hasMetrics: z.string(),
  }).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, role, type } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        situation: false,
        task: false,
        action: false,
        result: false,
        hasMetrics: false,
        feedback: "No speech detected yet.",
        labels: {
          situation: "Competency 1",
          task: "Competency 2",
          action: "Competency 3",
          result: "Competency 4",
          hasMetrics: "Supporting Evidence"
        }
      });
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: starAnalysisSchema,
      prompt: `
        Analyze the following candidate's response to a question during a practice session.
        Candidate's Target Role: "${role || "General"}"
        Session Mode/Type: "${type || "Behavioral"}"
        
        Candidate Response:
        "${text}"
        
        Evaluate the response against 4 relevant competencies or evaluation dimensions tailored specifically to the role and session type (e.g. for software engineering behavioral, use STAR; for a comedian/joker, use Setup, Punchline, Delivery, Timing; for a president, use Rhetoric, Policy Depth, Diplomacy, Structure, etc.).
        
        Map your 4 custom competencies/dimensions to these schema fields:
        1. situation -> Competency 1 (e.g. Context / Setup / Policy background)
        2. task -> Competency 2 (e.g. Focus / Core argument / Problem statement)
        3. action -> Competency 3 (e.g. Action taken / Solution details / Rhetorical delivery)
        4. result -> Competency 4 (e.g. Outcome / Punchline / Conclusion)
        5. hasMetrics -> Specific supporting details or evidence (e.g. stats, specific facts, timing/laughter, metrics)
        
        Provide the human-readable names for these competencies in the "labels" field so we can display them to the user.
        
        Provide a concise, constructive feedback comment (feedback) advising the candidate on any missing components or how they can improve.
      `,
    });

    return NextResponse.json(object, { status: 200 });
  } catch (error: any) {
    console.error("Error analyzing STAR framework:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze response" },
      { status: 500 }
    );
  }
}
