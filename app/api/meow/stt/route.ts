import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { fetchGroq } from "@/lib/apiKeyManager";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    const model = formData.get("model") as string || "whisper-large-v3-turbo";
    const language = formData.get("language") as string || "en";

    if (!file) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    // Forward form data to Groq
    const groqFormData = new FormData();
    groqFormData.append("file", file, "speech.webm");
    groqFormData.append("model", model);
    groqFormData.append("language", language.split("-")[0]); // e.g. "en" instead of "en-US"

    console.log(`[STT Route] Transcribing audio with model: ${model}, size: ${file.size} bytes`);

    const response = await fetchGroq("/audio/transcriptions", {
      method: "POST",
      body: groqFormData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[STT Route] Groq transcription error (status ${response.status}):`, errText);
      
      // Handle too short/invalid audio files gracefully by returning an empty string
      if (response.status === 400 || errText.includes("too short") || errText.includes("Minimum audio length")) {
        return NextResponse.json({ text: "" });
      }
      return NextResponse.json({ error: errText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text || "" });
  } catch (err: any) {
    console.error("[STT Route] Server error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
