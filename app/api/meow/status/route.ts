import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ status: "offline", error: "Missing GROQ_API_KEY in environment variables." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      return NextResponse.json({ status: "connected", model: process.env.GROQ_LLM_MODEL || "llama-3.3-70b-versatile" });
    } else {
      const data = await response.text();
      let errMsg = "API key invalid or rejected";
      try {
        const parsed = JSON.parse(data);
        errMsg = parsed.error?.message || errMsg;
      } catch (e) {}
      return NextResponse.json({ status: "offline", error: errMsg });
    }
  } catch (err: any) {
    return NextResponse.json({ status: "offline", error: err.message });
  }
}
