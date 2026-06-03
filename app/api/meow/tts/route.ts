import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured on the server." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { text, voice } = body;

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 });
    }

    const voiceName = voice || "troy";
    const arabicVoices = ["abdullah", "aisha", "fahad", "sultan", "lulwa", "noura"];
    const model = arabicVoices.includes(voiceName.toLowerCase())
      ? "canopylabs/orpheus-arabic-saudi"
      : "canopylabs/orpheus-v1-english";

    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        input: text,
        voice: voiceName,
        response_format: "wav",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(errText, {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "audio/wav");
    responseHeaders.set("Cache-Control", "no-cache");

    for (const [key, val] of response.headers.entries()) {
      if (key.startsWith("x-ratelimit-") || key === "retry-after") {
        responseHeaders.set(key, val);
      }
    }

    return new Response(response.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
