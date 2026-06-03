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
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        situation: false,
        task: false,
        action: false,
        result: false,
        hasMetrics: false,
        feedback: "No speech detected yet.",
      });
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: starAnalysisSchema,
      prompt: `
        Analyze the following candidate's response to an interview question using the STAR (Situation, Task, Action, Result) methodology.
        
        Candidate Response:
        "${text}"
        
        Evaluate whether the candidate has hit the following components:
        1. Situation: Did they establish the context of the story?
        2. Task: Did they state their specific responsibility or the goal?
        3. Action: Did they describe the concrete steps they took to resolve it?
        4. Result: Did they describe the outcome?
        5. Has Metrics (hasMetrics): Did they include measurable results/metrics (e.g. "reduced latency by 40%", "increased sales by $5k", "saved 10 hours per week")? Note: if Result is false, hasMetrics must also be false.
        
        Provide a concise, constructive feedback comment (feedback) advising them on any missing components, especially if they forgot to mention a measurable result.
      `,
    });

    return NextResponse.json(object, { status: 200 });
  } catch (error: any) {
    console.error("Error analyzing STAR framework:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze STAR" },
      { status: 500 }
    );
  }
}
