"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, PhoneOff, Mic, Brain, Volume2, Settings, 
  Code, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Play 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const currentWpmList = userWPMsRef.current;
  const currentAverageWpm = currentWpmList.length > 0
    ? Math.round(currentWpmList.reduce((a, b) => a + b, 0) / currentWpmList.length)
    : 135; // Fallback typical conversation rate for aesthetic preview

  const fillerUm = fillerCountsRef.current?.um || 0;
  const fillerLike = fillerCountsRef.current?.like || 0;
  const fillerUh = fillerCountsRef.current?.uh || 0;
  const fillerSo = fillerCountsRef.current?.so || 0;

  return (
    <div className="w-full flex flex-col gap-6 font-mona-sans text-slate-100 selection:bg-cyan-500/30 selection:text-white">
      {/* Premium Sci-Fi Telemetry Banner Header */}
      {callStatus !== CallStatus.INACTIVE && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full backdrop-blur-md bg-slate-950/40 border border-slate-900 px-6 py-3 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-[0.2em] text-slate-500 uppercase">EVALUATION CONSOLE</span>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                LINK STATE: [ONLINE_ACTIVE]
              </span>
            </div>
          </div>

          <div className="flex gap-6 items-center text-slate-400 font-mono text-[10px]">
            <div>
              <span className="text-slate-600 mr-1.5">// ID:</span>
              <span className="text-slate-300">SYS-{interviewId ? interviewId.slice(0, 8).toUpperCase() : "GENERATE"}</span>
            </div>
            <div className="max-sm:hidden">
              <span className="text-slate-600 mr-1.5">// MODE:</span>
              <span className="text-slate-300">{type.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-600 mr-1.5">// TELEMETRY:</span>
              <span className="text-emerald-400 font-bold">100% STABLE</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Panel: Styled as Cockpit Calibration Unit */}
      {callStatus === CallStatus.INACTIVE && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-xl mx-auto p-6 backdrop-blur-2xl bg-slate-950/70 rounded-md flex flex-col gap-5 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group"
        >
          {/* Neon Top Bar */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-800 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Cybernetic Accent Markers */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-slate-700" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-slate-700" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-slate-700" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-slate-700" />

          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2.5">
              <span className="p-1.5 bg-cyan-500/10 rounded-md border border-cyan-500/20">
                <Settings className="size-4 text-cyan-400 animate-[spin_10s_linear_infinite]" />
              </span>
              CALIBRATE PROTOCOLS
            </h4>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors duration-200 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md hover:border-cyan-500/50 shadow-md"
            >
              {showSettings ? "CLOSE INTERFACE" : "OPEN OPTIONS"}
            </button>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 border-t border-slate-900 pt-4 overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className="size-3.5 text-cyan-400" /> AI Diagnostic Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-slate-950 text-slate-100 text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 outline-none cursor-pointer hover:bg-slate-900 transition-all font-mono font-bold"
                  >
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B [REC]</option>
                    <option value="llama-3.1-8b-instant">Llama 3.1 8B [FAST]</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="size-3.5 text-cyan-400" /> Speech Synthesis Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="bg-slate-950 text-slate-100 text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 outline-none cursor-pointer hover:bg-slate-900 transition-all font-mono font-bold"
                  >
                    <option value="groq-autumn">Autumn (Female - Natural)</option>
                    <option value="groq-diana">Diana (Female - Crisp)</option>
                    <option value="groq-hannah">Hannah (Female - Warm)</option>
                    <option value="groq-austin">Austin (Male - Business)</option>
                    <option value="groq-daniel">Daniel (Male - Composed)</option>
                    <option value="groq-troy">Troy (Male - Deep)</option>
                    <option value="local">Local Browser Synthesis</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Main Split Grid for Interviewing & Sandbox */}
      <div className={cn(
        "grid grid-cols-1 gap-8 items-start w-full",
        codingProblem ? "lg:grid-cols-12" : "max-w-4xl mx-auto"
      )}>
        
        {/* Left Side: Voice Card, Transcript, STAR Checklist */}
        <div className={cn(
          "flex flex-col gap-6 w-full",
          codingProblem ? "lg:col-span-6" : "col-span-1"
        )}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full items-stretch">
            {/* AI Interviewer - alex Concentric Orb Telemetry Capsule */}
            <motion.div 
              whileHover={{ y: -2 }}
              className={cn(
                "flex items-center justify-center flex-col gap-5 p-8 min-h-[340px] backdrop-blur-xl border rounded-md flex-1 w-full shadow-2xl relative overflow-hidden transition-all duration-500",
                callStatus === CallStatus.ACTIVE && isSpeaking
                  ? "bg-slate-950/80 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
                  : "bg-slate-950/40 border-slate-800/80"
              )}
            >
              {/* Top Accent Lines */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-800" />
              
              <div className="relative flex justify-center items-center h-36 w-36">
                {/* Orbital concentric circles rotation */}
                <div className={cn(
                  "absolute inset-0 border border-dashed border-cyan-500/20 rounded-full",
                  callStatus === CallStatus.ACTIVE && isSpeaking ? "animate-[spin_30s_linear_infinite] border-cyan-400/40" : "animate-[spin_60s_linear_infinite]"
                )} />
                <div className={cn(
                  "absolute inset-3 border border-dashed border-violet-500/20 rounded-full",
                  callStatus === CallStatus.ACTIVE && isSpeaking ? "animate-[spin_15s_linear_infinite_reverse] border-violet-400/40" : "animate-[spin_40s_linear_infinite_reverse]"
                )} />
                <div className="absolute inset-6 border border-slate-800 rounded-full" />
                
                {/* Live pulsating concentric core rings */}
                {callStatus === CallStatus.ACTIVE && isSpeaking && (
                  <>
                    <span className="absolute inset-6 bg-cyan-500/10 rounded-full animate-ping opacity-60 pointer-events-none" />
                    <span className="absolute inset-10 bg-violet-500/10 rounded-full animate-[ping_1.5s_infinite] opacity-40 pointer-events-none" />
                  </>
                )}

                {/* Cyber holographic orb mesh container */}
                <div className={cn(
                  "z-10 flex items-center justify-center rounded-full size-[90px] relative border transition-all duration-500 shadow-2xl overflow-hidden bg-slate-950",
                  callStatus === CallStatus.ACTIVE && isSpeaking 
                    ? "border-cyan-400 scale-105 shadow-[0_0_30px_rgba(6,182,212,0.3)]" 
                    : "border-slate-800"
                )}>
                  {/* Holographic AI Sphere Drawing instead of boring avatar file */}
                  <svg className="w-14 h-14 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    <circle cx="12" cy="12" r="2" className="fill-cyan-400 animate-[ping_2s_infinite]" />
                  </svg>
                  
                  {/* Hexagon scanner layout lines */}
                  <div className="absolute inset-0 bg-transparent pointer-events-none" />
                </div>
              </div>
              
              <div className="text-center flex flex-col gap-1 items-center">
                <h3 className="text-base font-bold text-white tracking-widest uppercase font-mono">ALEX // EVALUATOR</h3>
                <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-widest bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                  SYS CORE PROMPT
                </span>
              </div>

              {callStatus === CallStatus.ACTIVE && (
                <div className="flex flex-col items-center gap-2.5 w-full mt-2">
                  {/* Futuristic visualizer bars */}
                  {isSpeaking ? (
                    <div className="flex items-end justify-center gap-1.5 h-6">
                      <div className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.7s_infinite] h-5" />
                      <div className="w-1.5 bg-violet-400 rounded-full animate-[pulse_1s_infinite] h-6" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 bg-cyan-300 rounded-full animate-[pulse_0.6s_infinite] h-4" style={{ animationDelay: '0.4s' }} />
                      <div className="w-1.5 bg-violet-500 rounded-full animate-[pulse_0.9s_infinite] h-7" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 bg-cyan-500 rounded-full animate-[pulse_0.8s_infinite] h-3" style={{ animationDelay: '0.3s' }} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 h-6 opacity-35">
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-ping" />
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Candidate Holographic Telemetry Panel */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center justify-center flex-col gap-4 p-6 min-h-[340px] backdrop-blur-xl border border-slate-800/80 bg-slate-950/40 rounded-2xl flex-1 w-full shadow-2xl relative overflow-hidden transition-all duration-500 max-md:hidden"
            >
              {/* Cyber Crosshairs */}
              <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-slate-700" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-slate-700" />
              <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-slate-700" />
              <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-slate-700" />

              <div className="relative">
                {callStatus === CallStatus.ACTIVE && !isSpeaking && (
                  <span className="absolute -inset-4 bg-emerald-500/10 rounded-full animate-ping opacity-60 pointer-events-none" />
                )}
                
                {/* Circular ring telemetry dial */}
                <div className={cn(
                  "flex items-center justify-center rounded-full size-[90px] border transition-all duration-500 bg-slate-950 shadow-2xl overflow-hidden",
                  callStatus === CallStatus.ACTIVE && !isSpeaking
                    ? "border-emerald-400 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    : "border-slate-800"
                )}>
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={userName}
                      width={90}
                      height={90}
                      className="rounded-full object-cover size-full transition-transform duration-500"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {/* Cyber matrix layout lines */}
                  <div className="absolute inset-0 bg-transparent pointer-events-none" />
                </div>
              </div>
              
              <div className="text-center flex flex-col gap-0.5 items-center w-full">
                <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono truncate max-w-[140px]">
                  {userName}
                </h3>
                <span className="text-[8px] text-slate-400 font-mono tracking-widest uppercase">
                  CANDIDATE LINK
                </span>
              </div>

              {/* Dynamic verbal diagnostics tracking */}
              {callStatus === CallStatus.ACTIVE && (
                <div className="w-full flex flex-col gap-2 mt-2 bg-slate-950/60 border border-slate-900/60 p-2.5 rounded-lg">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-slate-500">PACE DIAGNOSTIC</span>
                    <span className="text-emerald-400 font-bold">{currentAverageWpm} WPM</span>
                  </div>
                  {/* Speedometer mini line */}
                  <div className="w-full h-1 bg-slate-900 rounded-md overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (currentAverageWpm / 200) * 100)}%` }}
                    />
                  </div>

                  {/* Filler words indicator */}
                  <div className="flex justify-between text-[8px] font-mono text-slate-500 border-t border-slate-900/80 pt-1.5 mt-0.5">
                    <span>FILLER DETECT:</span>
                    <span className="text-amber-400/90 font-bold uppercase">
                      LIKE ({fillerLike}) // UM ({fillerUm}) // UH ({fillerUh})
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Typewriter Holographic Output Console */}
          {messages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-slate-800 p-0.5 rounded-md w-full shadow-2xl relative overflow-hidden backdrop-blur-xl bg-slate-950/80 shrink-0"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
              <div className="absolute top-1 left-3 font-mono text-[8px] text-cyan-400/60">// CORE_FEEDBACK_OUTPUT</div>
              <div className="rounded-md min-h-16 px-6 py-5 flex items-center justify-center border border-slate-900 bg-slate-950/40">
                <p
                  key={lastMessage}
                  className="text-xs text-center text-cyan-100 font-mono leading-relaxed animate-fadeIn"
                >
                  &gt;&gt; {lastMessage}
                </p>
              </div>
            </motion.div>
          )}

          {/* Behavioral STAR Framework Tracker: Premium Light-up Console */}
          {callStatus === CallStatus.ACTIVE && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 backdrop-blur-2xl bg-slate-950/70 border border-slate-800 rounded-md flex flex-col gap-4 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-800 pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <h4 className="text-[10px] font-mono font-bold uppercase text-slate-300 tracking-[0.15em] flex items-center gap-2">
                  <Sparkles className="size-4 text-cyan-400 animate-pulse" />
                  STAR COGNITIVE DIAGNOSTIC
                </h4>
                <span className="text-[8px] bg-cyan-500/10 text-cyan-400 font-mono font-bold px-2 py-0.5 rounded border border-cyan-500/25 uppercase tracking-widest">
                  LIVE TRACKER
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Situation */}
                <div className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1.5 items-center justify-center text-center transition-all duration-500 backdrop-blur-md font-mono",
                  starChecklist.situation 
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-slate-950/40 border-slate-900 text-slate-600 hover:border-slate-800"
                )}>
                  <CheckCircle2 className={cn("size-4.5 transition-colors duration-500", starChecklist.situation ? "text-emerald-400" : "text-slate-800")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">SITUATION</span>
                </div>
                
                {/* Task */}
                <div className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1.5 items-center justify-center text-center transition-all duration-500 backdrop-blur-md font-mono",
                  starChecklist.task 
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-slate-950/40 border-slate-900 text-slate-600 hover:border-slate-800"
                )}>
                  <CheckCircle2 className={cn("size-4.5 transition-colors duration-500", starChecklist.task ? "text-emerald-400" : "text-slate-800")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">TASK</span>
                </div>
                
                {/* Action */}
                <div className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1.5 items-center justify-center text-center transition-all duration-500 backdrop-blur-md font-mono",
                  starChecklist.action 
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-slate-950/40 border-slate-900 text-slate-600 hover:border-slate-800"
                )}>
                  <CheckCircle2 className={cn("size-4.5 transition-colors duration-500", starChecklist.action ? "text-emerald-400" : "text-slate-800")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">ACTION</span>
                </div>
                
                {/* Result */}
                <div className={cn(
                  "p-3 rounded-xl border flex flex-col gap-1.5 items-center justify-center text-center transition-all duration-500 backdrop-blur-md font-mono",
                  starChecklist.result 
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-slate-950/40 border-slate-900 text-slate-600 hover:border-slate-800"
                )}>
                  <CheckCircle2 className={cn("size-4.5 transition-colors duration-500", starChecklist.result ? "text-emerald-400" : "text-slate-800")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">RESULT</span>
                </div>
              </div>

              {/* Warnings and Dynamic Feedback */}
              <AnimatePresence>
                {starChecklist.result && !starChecklist.hasMetrics && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-amber-950/20 border border-amber-500/30 text-amber-400 rounded-xl p-3 text-[11px] flex gap-2.5 items-start shadow-md font-mono"
                  >
                    <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-400" />
                    <span>
                      <strong className="text-amber-300 font-bold uppercase">MISSING QUANTIFIABLE DATA:</strong> You described a result, but failed to support it with quantitative metrics (e.g. speedups, exact percentages, dollar amount saved). Provide measurable outcomes.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-[11px] text-cyan-200/90 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 font-mono">
                <span className="text-cyan-400 font-bold uppercase tracking-widest mr-2">// DIAG_COMMENTARY:</span>
                {starChecklist.feedback}
              </div>
            </motion.div>
          )}

          {/* Action Trigger Buttons */}
          <div className="w-full flex justify-center mt-1">
            {callStatus !== "ACTIVE" ? (
              <button 
                className="relative cursor-pointer flex items-center justify-center font-mono font-bold text-xs bg-cyan-500 text-slate-950 px-8 py-3.5 rounded-lg hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 active:scale-95 border border-cyan-400 shadow-xl overflow-hidden uppercase tracking-[0.15em]" 
                onClick={() => handleCall()}
              >
                <span
                  className={cn(
                    "absolute animate-ping rounded-full opacity-40 bg-cyan-400 h-[80%] w-[80%]",
                    callStatus !== "CONNECTING" && "hidden"
                  )}
                />
                <span className="relative flex items-center gap-2 text-black font-extrabold">
                  <span className="size-2 rounded-full bg-black animate-pulse" />
                  {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "ESTABLISH COGNITIVE LINK" : "STREAMING DATALINK..."}
                </span>
              </button>
            ) : (
              <button 
                className="cursor-pointer flex items-center justify-center gap-2 font-mono font-bold text-xs bg-rose-600 hover:bg-rose-500 hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] text-white px-8 py-3.5 rounded-lg transition-all duration-300 active:scale-95 border border-rose-500 shadow-xl tracking-[0.15em] uppercase" 
                onClick={() => handleDisconnect()}
              >
                <PhoneOff className="size-4" /> DISCONNECT COGNITIVE SESSION
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Technical Coding Sandbox Redesigned as Sliding IDE Workbench */}
        {codingProblem && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col gap-4 p-5 backdrop-blur-2xl bg-slate-950/70 rounded-2xl border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full relative overflow-hidden"
          >
            {/* Cyber Corner Marks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-700" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-700" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-700" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-700" />

            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="text-[10px] font-mono font-bold text-slate-300 tracking-[0.2em] uppercase flex items-center gap-2">
                <Code className="size-4.5 text-cyan-400" />
                ALGORITHMIC EDITOR WORKBENCH
              </h3>
              <span className="bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-mono text-[9px] px-3 py-1 rounded-md font-bold uppercase tracking-wider shadow-inner">
                PROTOCOL // {codingProblem.language.toUpperCase()}
              </span>
            </div>

            {/* Problem Statement Display */}
            <div className="flex flex-col gap-2 bg-slate-950 border border-slate-900 p-4 rounded-xl max-h-[150px] overflow-y-auto custom-scrollbar relative">
              <div className="absolute top-1 right-2 font-mono text-[8px] text-slate-600">// DESCR_SPEC</div>
              <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2 pr-16">
                <Lightbulb className="size-4 text-amber-400 shrink-0" />
                {codingProblem.title}
              </h4>
              <p className="text-[11px] text-slate-400 whitespace-pre-line leading-relaxed font-medium mt-1">
                {codingProblem.description}
              </p>
            </div>

            {/* Premium Code Textarea with custom brackets, lines, and glassmorphic look */}
            <div className="flex flex-col gap-0 relative">
              {/* IDE Top Window Bar */}
              <div className="flex px-4 py-2.5 border border-slate-800 rounded-t-xl text-[9px] text-slate-400 font-mono flex-row justify-between items-center bg-slate-950/90 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500/70" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 text-slate-300 font-bold">solution.{codingProblem.language === "python" ? "py" : "ts"}</span>
                </div>
                <span className="text-[8px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  SANDBOX STATUS: RUNNING
                </span>
              </div>

              {/* Gutter + TextArea Container */}
              <div className="relative flex items-stretch border border-t-0 border-slate-800 rounded-b-xl overflow-hidden bg-slate-950/50 shadow-[inset_0_4px_16px_rgba(0,0,0,0.85)]">
                {/* Gutter Line Numbers Simulation */}
                <div className="w-9 bg-slate-950/80 border-r border-slate-900 font-mono text-[10px] text-slate-600 py-4 select-none flex flex-col items-center gap-1.5 leading-relaxed text-right pr-2">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i}>{String(i + 1).padStart(2, "0")}</div>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="// Implement your algorithm here... alex will observe your code logic."
                  className="font-mono bg-transparent text-cyan-100 text-xs py-4 px-4 w-full h-[320px] outline-none focus:ring-0 resize-none leading-relaxed"
                  disabled={callStatus !== CallStatus.ACTIVE}
                />
              </div>

              {/* Floating Socratic Advisor Alert */}
              <AnimatePresence>
                {isCodingStuck && callStatus === CallStatus.ACTIVE && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute bottom-4 left-4 right-4 bg-slate-950 border border-violet-500/40 text-violet-400 rounded-xl p-3.5 text-xs flex gap-3 items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                  >
                    <div className="flex gap-2.5 items-center">
                      <div className="p-1.5 bg-violet-500/10 rounded-lg border border-violet-500/20 animate-pulse">
                        <Lightbulb className="size-4 text-violet-400" />
                      </div>
                      <span className="font-mono font-bold text-slate-200">System detected stalled state. Trigger helper?</span>
                    </div>
                    <Button
                      onClick={requestSocraticHint}
                      className="h-8 text-[9px] font-mono font-bold uppercase tracking-wider px-3.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 border border-violet-500/30 cursor-pointer shadow-lg active:scale-95"
                    >
                      REQUEST SCRIPT
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hint control trigger */}
            {callStatus === CallStatus.ACTIVE && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={requestSocraticHint}
                  className="text-[9px] font-mono font-bold uppercase tracking-widest px-4 py-2 h-9 border border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-cyan-500/30 transition-all rounded-lg cursor-pointer"
                >
                  <Sparkles className="size-3.5 text-cyan-400" /> REQUEST SOCRATIC SCRIPTS
                </Button>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Agent;
