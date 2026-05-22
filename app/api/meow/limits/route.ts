import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured on the server." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const modelName = body.model;

    if (!modelName) {
      return NextResponse.json({ error: "Model name is required" }, { status: 400 });
    }

    const isVoice = modelName.startsWith("canopylabs/");
    let groqPath, groqPayload;

    if (isVoice) {
      groqPath = "/openai/v1/audio/speech";
      groqPayload = {
        model: modelName,
        input: "a",
        voice: body.voice || "troy",
        response_format: "wav",
      };
    } else {
      groqPath = "/openai/v1/chat/completions";
      groqPayload = {
        model: modelName,
        messages: [{ role: "user", content: "h" }],
        max_tokens: 1,
        stream: false,
      };
    }

    const response = await fetch(`https://api.groq.com${groqPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(groqPayload),
    });

    const limitHeaders: Record<string, string | null> = {};
    for (const [key, val] of response.headers.entries()) {
      if (key.startsWith("x-ratelimit-") || key === "retry-after") {
        limitHeaders[key] = val;
      }
    }

    const resData = await response.text();
    let errorObj = null;
    if (!response.ok) {
      try {
        errorObj = JSON.parse(resData);
      } catch (e) {
        errorObj = { message: resData };
      }
    }

    return NextResponse.json({
      statusCode: response.status,
      limits: limitHeaders,
      error: errorObj,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
