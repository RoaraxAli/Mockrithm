"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, PhoneOff, Mic, Brain, Volume2, Settings, 
  Code, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Play 
} from "lucide-react";

import { cn } from "@/lib/utils";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface StarChecklist {
  situation: boolean;
  task: boolean;
  action: boolean;
  result: boolean;
  hasMetrics: boolean;
  feedback: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  profileImage,
  firstMessage,
  codingProblem,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, _setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // Meow Engine Configuration States
  const [selectedVoice, setSelectedVoice] = useState<string>("groq-autumn");
  const [selectedModel, setSelectedModel] = useState<string>("llama-3.3-70b-versatile");
  const [showSettings, setShowSettings] = useState(false);

  // Live Coding States
  const [code, setCode] = useState(codingProblem?.templateCode || "");
  const [isCodingStuck, setIsCodingStuck] = useState(false);
  const lastCodeTypedRef = useRef<number>(Date.now());

  // Behavioral STAR Framework States
  const [starChecklist, setStarChecklist] = useState<StarChecklist>({
    situation: false,
    task: false,
    action: false,
    result: false,
    hasMetrics: false,
    feedback: "Begin answering the behavioral questions to start analysis.",
  });

  // Verbal & Pacing Analytics
  const userWPMsRef = useRef<number[]>([]);
  const fillerCountsRef = useRef<Record<string, number>>({
    like: 0,
    um: 0,
    uh: 0,
    so: 0,
    actually: 0,
    basically: 0,
  });
  const turnStartRef = useRef<number | null>(null);

  // Web Speech API STT
  const SpeechRecognition = typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechQueueRef = useRef<string[]>([]);
  const isSpeakingActiveRef = useRef<boolean>(false);
  const streamCompletedRef = useRef<boolean>(false);
  const sentenceBufferRef = useRef<string>("");
  const accumulatedTextRef = useRef<string>("");
  const localSpeechQueueCountRef = useRef<number>(0);
  const localSpeechFinishedCountRef = useRef<number>(0);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const isCallActiveRef = useRef<boolean>(false);
  const messagesRef = useRef<SavedMessage[]>([]);

  // Helper to sync state and ref
  const setMessages = (updater: SavedMessage[] | ((prev: SavedMessage[]) => SavedMessage[])) => {
    _setMessages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      messagesRef.current = next;
      return next;
    });
  };

  // Sync typing updates to detect stuck states
  const handleCodeChange = (newVal: string) => {
    setCode(newVal);
    lastCodeTypedRef.current = Date.now();
    setIsCodingStuck(false);
  };

  // Check coding activity stuck status (2-minute check)
  useEffect(() => {
    if (callStatus !== CallStatus.ACTIVE || !codingProblem) return;

    const interval = setInterval(() => {
      const msSinceLastType = Date.now() - lastCodeTypedRef.current;
      if (msSinceLastType > 120000) {
        setIsCodingStuck(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [callStatus, codingProblem]);

  // Clean resources on unmount
  useEffect(() => {
    return () => {
      isCallActiveRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      stopTTSPlayback();
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      } catch (e) {}
    };
  }, []);

  // Sync and save feedback when finished
  useEffect(() => {
    if (messages.length > 0) {
      const visibleMessages = messages.filter((m) => m.role !== "system");
      if (visibleMessages.length > 0) {
        setLastMessage(visibleMessages[visibleMessages.length - 1].content);
      }
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback with WPM tracking");

      const sumWpm = userWPMsRef.current.reduce((a, b) => a + b, 0);
      const averageWpm = userWPMsRef.current.length > 0 ? Math.round(sumWpm / userWPMsRef.current.length) : 0;

      const topFillerWords = Object.entries(fillerCountsRef.current)
        .map(([word, count]) => ({ word, count }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages.map((m) => ({ role: m.role, content: m.content })),
        feedbackId,
        averageWpm,
        topFillerWords,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    const handleSaveConversationSetup = async (messages: SavedMessage[]) => {
      try {
        await fetch("/api/interview/parse-and-create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            userid: userId,
          }),
        });
      } catch (err) {
        console.error("Failed to parse and create interview:", err);
      } finally {
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        handleSaveConversationSetup(messages);
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  // TTS Control Deck
  const stopTTSPlayback = () => {
    speechQueueRef.current = [];
    isSpeakingActiveRef.current = false;
    streamCompletedRef.current = false;
    sentenceBufferRef.current = "";
    localSpeechQueueCountRef.current = 0;
    localSpeechFinishedCountRef.current = 0;

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {}
      audioRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playLocalSpeechChunk = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (localSpeechQueueCountRef.current === 0) {
      localSpeechFinishedCountRef.current = 0;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Microsoft"))
    );
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      localSpeechFinishedCountRef.current++;
      if (streamCompletedRef.current && localSpeechFinishedCountRef.current === localSpeechQueueCountRef.current) {
        localSpeechQueueCountRef.current = 0;
        localSpeechFinishedCountRef.current = 0;
        resumeListeningAfterSpeech();
      }
    };

    utterance.onerror = () => {
      localSpeechFinishedCountRef.current++;
      if (streamCompletedRef.current && localSpeechFinishedCountRef.current === localSpeechQueueCountRef.current) {
        localSpeechQueueCountRef.current = 0;
        localSpeechFinishedCountRef.current = 0;
        resumeListeningAfterSpeech();
      }
    };

    localSpeechQueueCountRef.current++;
    window.speechSynthesis.speak(utterance);
  };

  const speakSentenceFallback = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(
          (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural"))
        );
        if (enVoice) {
          utterance.voice = enVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };

        utterance.onerror = (e) => {
          console.error("Local synth error:", e);
          setIsSpeaking(false);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const speakSentence = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const cleanText = text.replace(/\[END_CALL\]/gi, "").replace(/[*#_`~[\]]/g, "").trim();
      if (!cleanText) {
        resolve();
        return;
      }

      if (selectedVoice === "local") {
        speakSentenceFallback(cleanText).then(resolve);
        return;
      }

      const voiceName = selectedVoice.startsWith("groq-") ? selectedVoice.substring(5) : "troy";

      fetch("/api/meow/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanText,
          voice: voiceName,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`TTS API error: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          if (!isCallActiveRef.current) {
            resolve();
            return;
          }
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          audio.addEventListener("ended", () => {
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            resolve();
          });

          audio.addEventListener("error", () => {
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            speakSentenceFallback(cleanText).then(resolve);
          });

          audio.addEventListener("playing", () => {
            setIsSpeaking(true);
          });

          audio.play().catch((playErr) => {
            console.warn("Autoplay blocked, falling back", playErr);
            URL.revokeObjectURL(audioUrl);
            speakSentenceFallback(cleanText).then(resolve);
          });
        })
        .catch((err) => {
          console.warn("TTS failed, using local browser synthesis", err);
          speakSentenceFallback(cleanText).then(resolve);
        });
    });
  };

  const processSpeechQueue = async () => {
    if (isSpeakingActiveRef.current) return;

    if (speechQueueRef.current.length === 0) {
      if (streamCompletedRef.current) {
        resumeListeningAfterSpeech();
      }
      return;
    }

    const nextSentence = speechQueueRef.current.shift()!;
    isSpeakingActiveRef.current = true;

    try {
      await speakSentence(nextSentence);
    } catch (e) {
      console.error("Queue speech sentence error:", e);
    } finally {
      isSpeakingActiveRef.current = false;
      processSpeechQueue();
    }
  };

  const queueSpeechChunk = (text: string) => {
    const cleanText = text.replace(/\[END_CALL\]/gi, "").replace(/[*#_`~[\]]/g, "").trim();
    if (!cleanText) return;

    if (selectedVoice === "local") {
      playLocalSpeechChunk(cleanText);
    } else {
      speechQueueRef.current.push(cleanText);
      processSpeechQueue();
    }
  };

  const handleNewStreamToken = (token: string) => {
    accumulatedTextRef.current += token;
    setLastMessage(accumulatedTextRef.current);

    if (selectedVoice === "local") {
      sentenceBufferRef.current += token;
      const sentenceBoundaryRegex = /[.?!;\n]/;
      const match = sentenceBufferRef.current.match(sentenceBoundaryRegex);

      if (match) {
        const puncIndex = sentenceBufferRef.current.indexOf(match[0]);
        const chunkText = sentenceBufferRef.current.substring(0, puncIndex + 1).trim();
        if (chunkText.length > 0) {
          sentenceBufferRef.current = sentenceBufferRef.current.substring(puncIndex + 1);
          queueSpeechChunk(chunkText);
        }
      }
    }
  };

  // Speech Recognition (STT) Setup
  const startSpeechRecognition = () => {
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    } catch (e) {}

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => {
      console.log("Speech recognition started");
      turnStartRef.current = Date.now();
    };

    rec.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        handleDisconnect();
      }
    };

    rec.onend = () => {
      if (isCallActiveRef.current && !isProcessingRef.current && !isSpeakingActiveRef.current) {
        setTimeout(() => {
          if (isCallActiveRef.current && !isProcessingRef.current && !isSpeakingActiveRef.current) {
            try {
              rec.start();
            } catch (e) {}
          }
        }, 150);
      }
    };

    rec.onresult = (event: any) => {
      if (!isCallActiveRef.current || isProcessingRef.current) return;

      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const combinedText = (finalTranscript + interimTranscript).trim();
      if (combinedText.length > 0) {
        setLastMessage(combinedText);

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        silenceTimerRef.current = setTimeout(() => {
          handleSpeechCompleted(combinedText);
        }, 1700);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (e) {
      console.error("Failed to start SpeechRecognition:", e);
    }
  };

  const handleSpeechCompleted = async (text: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Verbal Pacing & Analytics Calculation
    if (turnStartRef.current) {
      const durationMs = Date.now() - turnStartRef.current;
      const durationMin = durationMs / 1000 / 60;
      const words = text.split(/\s+/).filter(Boolean);
      if (durationMin > 0.05 && words.length > 2) {
        const wpm = words.length / durationMin;
        userWPMsRef.current.push(wpm);
      }
      turnStartRef.current = null;
    }

    // Accumulate and count filler words
    const wordsList = text.toLowerCase().split(/\s+/);
    wordsList.forEach((w) => {
      const cleanW = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      if (cleanW in fillerCountsRef.current) {
        fillerCountsRef.current[cleanW]++;
      }
    });

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {}

    stopTTSPlayback();
    accumulatedTextRef.current = "";
    sentenceBufferRef.current = "";
    speechQueueRef.current = [];
    isSpeakingActiveRef.current = false;
    streamCompletedRef.current = false;

    // Append user message to history
    const userMsg: SavedMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsSpeaking(false);

    // Call STAR framework analysis API in parallel
    fetch("/api/interview/analyze-star", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setStarChecklist(data);
        }
      })
      .catch((err) => console.error("Error analyzing STAR:", err));

    try {
      let systemPrompt = "";
      if (type === "interview" && questions) {
        const formattedQuestions = questions.map((q: string) => `- ${q}`).join("\n");
        systemPrompt = `You are Alex, a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow this structured question flow:
${formattedQuestions}

CRITICAL RULES - CONVERSATIONAL FLOW & CONCISENESS:
- DO NOT LECTURE ON CORRECT ANSWERS: If the candidate answers correctly or reasonably, do not explain the concept, define terms, or repeat the textbook answer back to them. Simply acknowledge briefly (e.g. "Got it.", "Makes sense.", "Solid explanation.") and transition immediately to the next question.
- GENTLY CORRECT BIG BLUNDERS: If the candidate makes a major blunder or says something completely incorrect (e.g. saying React is a fruit color), gently correct them and guide them in the right direction in one short, polite sentence (e.g. "Actually, React is a frontend JavaScript library for building user interfaces. Let's move on to...") before transitioning.
- KEEP RESPONSES VERY SHORT: Keep your replies under 25 words maximum. No yapping or long paragraphs. Keep the pacing fast and conversational.
- Write only plain, clean text. Do not use markdown like bold (**), italics (*), lists, or hashtags.
- Never use emojis.
- If you ask a behavioral question and the candidate's response misses a concrete, measurable Result or outcome (e.g., they don't give numbers, metrics, or saved time), ask a follow-up question specifically seeking to uncover that quantitative metric.
- Conclude the interview properly when all questions are asked and answered.
- Thank the candidate for their time, say goodbye, and append the tag "[END_CALL]" at the end of your response to signal the system to close the session. Example: "Thank you for your time. Goodbye! [END_CALL]"

${
  codingProblem
    ? `Coding Sandbox Info:
- The candidate is working on the coding problem: "${codingProblem.title}".
- Description: ${codingProblem.description}
- Candidate's current code is:
\`\`\`${codingProblem.language}
${code}
\`\`\`
- If the candidate gets stuck (e.g., they say they don't know what to do, or they ask for a hint, or they don't make progress for a while), provide a Socratic hint to help them think in the right direction. Do NOT give them the full solution.`
    : ""
}`;
      } else {
        systemPrompt = `You are a professional assistant helping the user configure and generate their interview. Help them choose their job role, experience level, and tech stack. Keep responses short and conversational. Write only plain, clean text without any markdown or symbols.`;
      }

      const history = [
        { role: "system", content: systemPrompt },
        ...messagesRef.current,
      ];

      setLastMessage("AI is thinking...");
      setIsSpeaking(true);

      const response = await fetch("/api/meow/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: history,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get reader");

      const decoder = new TextDecoder();
      let buffer = "";

      setIsSpeaking(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let boundary = buffer.indexOf("\n");
        while (boundary !== -1) {
          const line = buffer.substring(0, boundary).trim();
          buffer = buffer.substring(boundary + 1);

          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              const token = parsed.choices?.[0]?.delta?.content || "";
              if (token) {
                handleNewStreamToken(token);
              }
            } catch (e) {}
          }
          boundary = buffer.indexOf("\n");
        }
      }

      streamCompletedRef.current = true;

      if (selectedVoice === "local") {
        if (sentenceBufferRef.current.trim().length > 0) {
          const chunk = sentenceBufferRef.current.trim();
          sentenceBufferRef.current = "";
          queueSpeechChunk(chunk);
        } else {
          if (
            localSpeechQueueCountRef.current === 0 ||
            localSpeechFinishedCountRef.current === localSpeechQueueCountRef.current
          ) {
            localSpeechQueueCountRef.current = 0;
            localSpeechFinishedCountRef.current = 0;
            resumeListeningAfterSpeech();
          }
        }
      } else {
        queueSpeechChunk(accumulatedTextRef.current.trim());
      }
    } catch (e: any) {
      console.error("LLM streaming failed:", e);
      setLastMessage(`Error: ${e.message}`);
      setTimeout(() => {
        resumeListeningAfterSpeech();
      }, 3000);
    }
  };

  const requestSocraticHint = () => {
    if (callStatus !== CallStatus.ACTIVE || isProcessingRef.current) return;
    setIsCodingStuck(false);
    handleSpeechCompleted("I am stuck on this coding problem. Can you give me a Socratic hint about my current code?");
  };

  const resumeListeningAfterSpeech = () => {
    isProcessingRef.current = false;
    setIsSpeaking(false);

    const fullMessageText = accumulatedTextRef.current.trim();

    if (isCallActiveRef.current) {
      if (fullMessageText.length > 0) {
        const assistantMsg: SavedMessage = { role: "assistant" as const, content: fullMessageText };
        setMessages((prev) => [...prev, assistantMsg]);
        accumulatedTextRef.current = "";
      }

      // Check if the assistant message signals the end of the interview
      const lowercaseMsg = fullMessageText.toLowerCase();
      const isGoodbye = lowercaseMsg.includes("[end_call]") || 
                        lowercaseMsg.includes("goodbye") || 
                        (lowercaseMsg.includes("thank you") && lowercaseMsg.includes("time") && lowercaseMsg.includes("today") && messagesRef.current.length > (questions?.length || 5) * 1.5);

      if (isGoodbye) {
        setTimeout(() => {
          handleDisconnect();
        }, 1500);
      } else {
        setLastMessage("Listening... Speak now");
        startSpeechRecognition();
      }
    }
  };

  // Connect & Disconnect Call Lifecycles
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    isCallActiveRef.current = true;
    isProcessingRef.current = false;
    accumulatedTextRef.current = "";
    sentenceBufferRef.current = "";
    speechQueueRef.current = [];

    setMessages([]);
    setCallStatus(CallStatus.ACTIVE);
    setIsSpeaking(true);

    // Dynamic Custom Welcome Greeting seeding
    const welcomeMsg = firstMessage || interviewer.firstMessage || "Hello! Thank you for taking the time to speak with me today.";
    setLastMessage(welcomeMsg);
    setMessages([{ role: "assistant", content: welcomeMsg }]);

    // Speak welcome message
    await speakSentence(welcomeMsg);

    // Start listening once welcome message finishes speaking
    if (isCallActiveRef.current) {
      setIsSpeaking(false);
      setLastMessage("Listening... Speak now");
      startSpeechRecognition();
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    isCallActiveRef.current = false;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    stopTTSPlayback();

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {}
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Settings Row */}
      {callStatus === CallStatus.INACTIVE && (
        <div className="w-full max-w-xl mx-auto p-5 bg-dark-200/50 border border-border/50 rounded-2xl flex flex-col gap-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-primary-100 flex items-center gap-2">
              <Settings className="size-4 text-primary-200" />
              Configure Voice & LLM Engine
            </h4>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs text-primary-200 hover:text-white cursor-pointer"
            >
              {showSettings ? "Hide Settings" : "Show Settings"}
            </button>
          </div>

          {showSettings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 border-t border-border/40 pt-4 animate-fadeIn">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-light-100 font-medium flex items-center gap-1">
                  <Brain className="size-3.5" /> LLM Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-dark-300 text-white text-xs rounded-xl p-2.5 border border-border focus:ring-1 focus:ring-primary-200 outline-none cursor-pointer"
                >
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Versatile)</option>
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B (Instant)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-light-100 font-medium flex items-center gap-1">
                  <Volume2 className="size-3.5" /> TTS Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="bg-dark-300 text-white text-xs rounded-xl p-2.5 border border-border focus:ring-1 focus:ring-primary-200 outline-none cursor-pointer"
                >
                  <option value="groq-autumn">Autumn (Female)</option>
                  <option value="groq-diana">Diana (Female)</option>
                  <option value="groq-hannah">Hannah (Female)</option>
                  <option value="groq-austin">Austin (Male)</option>
                  <option value="groq-daniel">Daniel (Male)</option>
                  <option value="groq-troy">Troy (Male)</option>
                  <option value="local">Local Browser TTS</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Split Grid for Interviewing & Sandbox */}
      <div className={cn(
        "grid grid-cols-1 gap-8 items-start w-full",
        codingProblem ? "lg:grid-cols-12" : "max-w-3xl mx-auto"
      )}>
        
        {/* Left Side: Voice Card, Transcript, STAR Checklist */}
        <div className={cn(
          "flex flex-col gap-6 w-full",
          codingProblem ? "lg:col-span-6" : "col-span-1"
        )}>
          
          <div className="call-view">
            {/* AI Interviewer Card */}
            <div className="card-interviewer">
              <div className="avatar">
                <Image
                  src="/ai-avatar.png"
                  alt="profile-image"
                  width={65}
                  height={54}
                  className="object-cover"
                />
                {isSpeaking && <span className="animate-speak" />}
              </div>
              <h3>AI Interviewer Alex</h3>
              {callStatus === CallStatus.ACTIVE && (
                <span className="text-xs font-bold text-success-100 bg-success-100/10 px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5">
                  <Mic className="size-3" /> Call in Session
                </span>
              )}
            </div>

            {/* User Profile Card */}
            <div className="card-border">
              <div className="card-content">
                <Image
                  src={profileImage || "/user-avatar.png"}
                  alt="profile-image"
                  width={120}
                  height={120}
                  className="rounded-full object-cover size-[120px]"
                />
                <h3>{userName}</h3>
              </div>
            </div>
          </div>

          {/* Transcript / Last Message Panel */}
          {messages.length > 0 && (
            <div className="transcript-border shrink-0">
              <div className="transcript">
                <p
                  key={lastMessage}
                  className={cn(
                    "transition-opacity duration-500 opacity-0",
                    "animate-fadeIn opacity-100"
                  )}
                >
                  {lastMessage}
                </p>
              </div>
            </div>
          )}

          {/* Behavioral STAR Framework Checklist Widget */}
          {callStatus === CallStatus.ACTIVE && (
            <div className="p-5 bg-dark-200/50 border border-border/50 rounded-2xl flex flex-col gap-4 backdrop-blur-md animate-fadeIn">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <h4 className="text-sm font-bold text-primary-100 flex items-center gap-2">
                  <Sparkles className="size-4 text-primary-200" />
                  Live Behavioral STAR Tracker
                </h4>
                <span className="text-[10px] bg-primary-200/20 text-primary-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">STAR Analyzer</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Situation */}
                <div className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1 items-center justify-center text-center",
                  starChecklist.situation ? "bg-success-100/5 border-success-100/30 text-success-100" : "bg-dark-300/40 border-border/40 text-light-400"
                )}>
                  <CheckCircle2 className={cn("size-5", starChecklist.situation ? "text-success-100" : "text-light-600")} />
                  <span className="text-xs font-bold mt-1">Situation</span>
                </div>
                {/* Task */}
                <div className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1 items-center justify-center text-center",
                  starChecklist.task ? "bg-success-100/5 border-success-100/30 text-success-100" : "bg-dark-300/40 border-border/40 text-light-400"
                )}>
                  <CheckCircle2 className={cn("size-5", starChecklist.task ? "text-success-100" : "text-light-600")} />
                  <span className="text-xs font-bold mt-1">Task</span>
                </div>
                {/* Action */}
                <div className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1 items-center justify-center text-center",
                  starChecklist.action ? "bg-success-100/5 border-success-100/30 text-success-100" : "bg-dark-300/40 border-border/40 text-light-400"
                )}>
                  <CheckCircle2 className={cn("size-5", starChecklist.action ? "text-success-100" : "text-light-600")} />
                  <span className="text-xs font-bold mt-1">Action</span>
                </div>
                {/* Result */}
                <div className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1 items-center justify-center text-center",
                  starChecklist.result ? "bg-success-100/5 border-success-100/30 text-success-100" : "bg-dark-300/40 border-border/40 text-light-400"
                )}>
                  <CheckCircle2 className={cn("size-5", starChecklist.result ? "text-success-100" : "text-light-600")} />
                  <span className="text-xs font-bold mt-1">Result</span>
                </div>
              </div>

              {/* Warnings and Dynamic Feedback */}
              {starChecklist.result && !starChecklist.hasMetrics && (
                <div className="bg-destructive-100/10 border border-destructive-100/30 text-destructive-100 rounded-xl p-3 text-xs flex gap-2.5 items-start">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Missing Result Metrics!</strong> You described an outcome, but forgot to state a quantifiable result (e.g. improved speed by 20%, saved $500). Alex will likely ask a follow-up.
                  </span>
                </div>
              )}

              <div className="text-xs text-light-400 italic bg-dark-300/40 p-3 rounded-xl border border-border/30">
                <strong>Analysis:</strong> {starChecklist.feedback}
              </div>
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="w-full flex justify-center mt-2">
            {callStatus !== "ACTIVE" ? (
              <button className="relative btn-call cursor-pointer flex items-center justify-center" onClick={() => handleCall()}>
                <span
                  className={cn(
                    "absolute animate-ping rounded-full opacity-75 bg-success-100 h-[85%] w-[65%]",
                    callStatus !== "CONNECTING" && "hidden"
                  )}
                />
                <span className="relative">
                  {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Connect Call" : "Connecting..."}
                </span>
              </button>
            ) : (
              <button className="btn-disconnect cursor-pointer flex items-center justify-center gap-1.5" onClick={() => handleDisconnect()}>
                <PhoneOff className="size-4" /> End Interview
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Technical Coding Sandbox Editor */}
        {codingProblem && (
          <div className="lg:col-span-6 flex flex-col gap-5 p-6 bg-dark-200/50 border border-border/50 rounded-2xl backdrop-blur-md w-full">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-lg font-bold text-primary-100 flex items-center gap-2">
                <Code className="size-5 text-primary-200" />
                Live Technical Sandbox
              </h3>
              <span className="bg-primary-200/20 text-primary-200 text-xs px-2.5 py-1 rounded-full font-extrabold capitalize">
                {codingProblem.language}
              </span>
            </div>

            {/* Problem Statement Display */}
            <div className="flex flex-col gap-2 bg-dark-300/55 p-4 rounded-xl border border-border/30 max-h-[160px] overflow-y-auto">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Lightbulb className="size-4 text-primary-200" />
                {codingProblem.title}
              </h4>
              <p className="text-xs text-light-100 whitespace-pre-line leading-relaxed">
                {codingProblem.description}
              </p>
            </div>

            {/* Code Textarea mimicking IDE */}
            <div className="flex flex-col gap-1 relative">
              <div className="flex bg-dark-300 px-4 py-2 border border-b-0 border-border/30 rounded-t-xl text-[11px] text-light-400 font-mono flex-row justify-between items-center">
                <span>sandbox_editor.js</span>
                <span>Active Editing</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="// Type your code solution here..."
                className="font-mono bg-dark-300 text-sm text-primary-100 border border-t-0 border-border/30 rounded-b-xl p-4 w-full h-[340px] outline-none focus:ring-1 focus:ring-primary-200 resize-none leading-relaxed"
                disabled={callStatus !== CallStatus.ACTIVE}
              />

              {/* Socratic Hint Alerts */}
              {isCodingStuck && callStatus === CallStatus.ACTIVE && (
                <div className="absolute bottom-4 left-4 right-4 bg-primary-200/10 border border-primary-200/30 text-primary-200 rounded-xl p-3 text-xs flex gap-2.5 items-center justify-between shadow-xl animate-fadeIn backdrop-blur-md">
                  <div className="flex gap-2 items-center">
                    <Lightbulb className="size-4 animate-bounce shrink-0" />
                    <span>Stuck? Get a Socratic hint about your implementation.</span>
                  </div>
                  <Button
                    onClick={requestSocraticHint}
                    className="h-7 text-[10px] font-bold px-2.5 rounded-md bg-primary-200 text-dark-100 hover:bg-primary-200/90 shrink-0"
                  >
                    Get Hint
                  </Button>
                </div>
              )}
            </div>

            {/* Interactive hint control button */}
            {callStatus === CallStatus.ACTIVE && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={requestSocraticHint}
                  className="text-xs font-bold px-4 py-2 h-9 flex items-center gap-1.5 border border-border text-light-100 hover:bg-dark-300"
                >
                  <Sparkles className="size-3.5" /> Request Socratic Hint
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Agent;
