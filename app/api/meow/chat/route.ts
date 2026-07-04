import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { fetchGroq } from "@/lib/apiKeyManager";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const groqPayload = {
      model: body.model || process.env.GROQ_LLM_MODEL || "llama-3.3-70b-versatile",
      messages: body.messages || [],
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
