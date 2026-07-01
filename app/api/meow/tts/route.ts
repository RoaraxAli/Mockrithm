import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { interviewLanguages } from "@/constants";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { text, voice, language } = body;

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 });
    }

    // Determine which TTS provider to use based on language
    const langConfig = interviewLanguages.find((l) => l.code === language);
    const ttsProvider = langConfig?.ttsProvider || "groq";

    if (ttsProvider === "edge") {
      // Use Microsoft Edge TTS (free, no API key, supports all languages)
      const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");
      const edgeVoice = langConfig?.edgeVoice || "en-US-AndrewNeural";

      const ttsInstance = new MsEdgeTTS();
      await ttsInstance.setMetadata(edgeVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

      const { audioStream } = ttsInstance.toStream(text);
      const chunks: Buffer[] = [];

      const audioBuffer = await new Promise<Buffer>((resolve, reject) => {
        audioStream.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });
        audioStream.on("close", () => {
          resolve(Buffer.concat(chunks));
        });
        audioStream.on("error", (err: any) => {
          reject(err);
        });
      });

      return new Response(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Groq TTS path (English and Arabic)
    const apiKey1 = process.env.GROQ_API_KEY;
    const apiKey2 = process.env.GROQ_API_KEY_2;
    
    // Randomly assign one of the active API keys to spread quota load
    const activeKeys = [apiKey1, apiKey2].filter(Boolean);
    if (activeKeys.length === 0) {
      return NextResponse.json({ error: "No GROQ_API_KEY configured on the server." }, { status: 400 });
    }
    const apiKey = activeKeys[Math.floor(Math.random() * activeKeys.length)];

    const voiceName = voice || "troy";
    const arabicVoices = ["abdullah", "aisha", "fahad", "sultan", "lulwa", "noura"];
    const model = arabicVoices.includes(voiceName.toLowerCase())
      ? "canopylabs/orpheus-arabic-saudi"
      : "canopylabs/orpheus-v1-english";

    console.log(`[TTS Route] Active API key selected (truncated): ...${apiKey.slice(-6)}`);
    console.log(`[TTS Route] Parameters - Voice: ${voiceName}, Model: ${model}, Language: ${language}`);

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
      console.error(`[TTS Route] Groq TTS API error (Status: ${response.status}):`, errText);
      return new Response(JSON.stringify({ error: errText, status: response.status }), {
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
