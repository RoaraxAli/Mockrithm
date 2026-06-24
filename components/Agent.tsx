"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, PhoneOff, Mic, Brain, Volume2, Settings, 
  Code, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Play, User
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
  labels?: {
    situation: string;
    task: string;
    action: string;
    result: string;
    hasMetrics: string;
  };
}

const Agent = ({
  userName,
  userId,
  interviewId: propInterviewId,
  feedbackId: propFeedbackId,
  type: propType,
  questions: propQuestions,
  profileImage,
  firstMessage,
  codingProblem: propCodingProblem,
  userResumeData,
  role: propRole,
  sessionType: propSessionType,
}: AgentProps) => {
  const router = useRouter();

  // Dynamic interview state hooks allowing live transition
  const [activeType, setActiveType] = useState<"generate" | "interview">(propType);
  const [activeQuestions, setActiveQuestions] = useState<string[]>(propQuestions || []);
  const [activeCodingProblem, setActiveCodingProblem] = useState<any>(propCodingProblem || null);
  const [activeInterviewId, setActiveInterviewId] = useState<string | null>(propInterviewId || null);
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(propFeedbackId || null);
  const [activeRole, setActiveRole] = useState<string>(propRole || "");
  const [activeSessionType, setActiveSessionType] = useState<string>(propSessionType || "");

  const typeRef = useRef(activeType);
  const questionsRef = useRef(activeQuestions);
  const codingProblemRef = useRef(activeCodingProblem);
  const roleRef = useRef(activeRole);
  const sessionTypeRef = useRef(activeSessionType);

  useEffect(() => {
    typeRef.current = activeType;
  }, [activeType]);

  useEffect(() => {
    questionsRef.current = activeQuestions;
  }, [activeQuestions]);

  useEffect(() => {
    codingProblemRef.current = activeCodingProblem;
  }, [activeCodingProblem]);

  useEffect(() => {
    roleRef.current = activeRole;
  }, [activeRole]);

  useEffect(() => {
    sessionTypeRef.current = activeSessionType;
  }, [activeSessionType]);

  const type = activeType;
  const questions = activeQuestions;
  const codingProblem = activeCodingProblem;
  const interviewId = activeInterviewId;
  const feedbackId = activeFeedbackId;
  const role = activeRole;
  const sessionType = activeSessionType;

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, _setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // Meow Engine Configuration States
  const [selectedVoice, setSelectedVoice] = useState<string>("groq-autumn");
  const [selectedModel, setSelectedModel] = useState<string>("llama-3.1-8b-instant");
  const [showSettings, setShowSettings] = useState(false);

  // Interview Duration Selection
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<"brief" | "medium" | "lengthy" | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTimerEndingRef = useRef(false);

  // Live Coding States
  const [code, setCode] = useState(codingProblem?.templateCode || "");
  useEffect(() => {
    if (codingProblem?.templateCode) {
      setCode(codingProblem.templateCode);
    }
  }, [codingProblem]);
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
  const submittedTextRef = useRef<string>(""); // track last submitted text to prevent duplicate processing

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
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
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
        const res = await fetch("/api/interview/parse-and-create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            userid: userId,
            userResumeData: userResumeData,
          }),
        });
        const data = await res.json();
        if (data.success && data.interviewId) {
          router.push(`/interview/${data.interviewId}`);
          return;
        }
      } catch (err) {
        console.error("Failed to parse and create interview:", err);
      }
      router.push("/");
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
      console.log(`[Agent.tsx] speakSentence called. Raw: "${text}", Cleaned: "${cleanText}"`);
      if (!cleanText) {
        console.log("[Agent.tsx] Empty text, resolving speakSentence immediately.");
        resolve();
        return;
      }

      if (selectedVoice === "local") {
        console.log("[Agent.tsx] Selected voice is local. Using speakSentenceFallback.");
        speakSentenceFallback(cleanText).then(resolve);
        return;
      }

      const voiceName = selectedVoice.startsWith("groq-") ? selectedVoice.substring(5) : "troy";
      console.log(`[Agent.tsx] Requesting TTS generation via API for voice: ${voiceName}...`);

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
            console.error(`[Agent.tsx] TTS API response error. Status: ${response.status}`);
            throw new Error(`TTS API error: ${response.status}`);
          }
          console.log("[Agent.tsx] TTS audio blob retrieved successfully.");
          return response.blob();
        })
        .then((blob) => {
          if (!isCallActiveRef.current) {
            console.log("[Agent.tsx] Call is inactive, discarding audio playback.");
            resolve();
            return;
          }
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          audio.addEventListener("ended", () => {
            console.log("[Agent.tsx] TTS audio playback ended naturally.");
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            resolve();
          });

          audio.addEventListener("error", (e) => {
            console.error("[Agent.tsx] Audio element failed to play audio stream:", e);
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            console.log("[Agent.tsx] Falling back to local browser synthesis due to audio error.");
            speakSentenceFallback(cleanText).then(resolve);
          });

          audio.addEventListener("playing", () => {
            setIsSpeaking(true);
          });

          console.log("[Agent.tsx] Starting playback of TTS audio stream...");
          audio.play().catch((playErr) => {
            console.warn("[Agent.tsx] Autoplay policy blocked audio stream, falling back to local speech synth:", playErr);
            URL.revokeObjectURL(audioUrl);
            speakSentenceFallback(cleanText).then(resolve);
          });
        })
        .catch((err) => {
          console.error("[Agent.tsx] TTS workflow failed:", err);
          console.log("[Agent.tsx] Falling back to local browser synthesis...");
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
    if (!cleanText) {
      if (selectedVoice === "local") {
        if (streamCompletedRef.current && localSpeechFinishedCountRef.current === localSpeechQueueCountRef.current) {
          localSpeechQueueCountRef.current = 0;
          localSpeechFinishedCountRef.current = 0;
          resumeListeningAfterSpeech();
        }
      } else {
        if (streamCompletedRef.current && speechQueueRef.current.length === 0 && !isSpeakingActiveRef.current) {
          resumeListeningAfterSpeech();
        }
      }
      return;
    }

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
    if (!SpeechRecognition) {
      console.error("[Agent.tsx] SpeechRecognition API is not supported in this browser.");
      return;
    }

    try {
      if (recognitionRef.current) {
        console.log("[Agent.tsx] Aborting previous SpeechRecognition instance...");
        recognitionRef.current.abort();
      }
    } catch (e) {
      console.warn("[Agent.tsx] Error aborting previous SpeechRecognition:", e);
    }

    console.log("[Agent.tsx] Initializing new SpeechRecognition instance...");
    const rec = new SpeechRecognition();
    rec.continuous = true;     // Continuous listening to allow pause/think/context correction
    rec.interimResults = true; // Show real-time transcription while speaking
    rec.lang = "en-US";
    rec.maxAlternatives = 1;

    // Per-session accumulators (local vars, not refs)
    let sessionFinal = "";
    let sessionInterim = "";

    rec.onstart = () => {
      console.log("[Agent.tsx] SpeechRecognition session started. Listening for user input...");
      sessionFinal = "";
      sessionInterim = "";
      turnStartRef.current = Date.now();
    };

    rec.onerror = (event: any) => {
      console.error("[Agent.tsx] SpeechRecognition error event captured:", event.error);
      if (event.error === "not-allowed") {
        console.error("[Agent.tsx] Microphone access blocked or not allowed.");
        handleDisconnect();
        return;
      }
      // On no-speech or other transient errors, just restart
      if (
        event.error !== "aborted" &&
        isCallActiveRef.current &&
        !isProcessingRef.current &&
        !isSpeakingActiveRef.current
      ) {
        console.log("[Agent.tsx] Transient SpeechRecognition error. Restarting in 300ms...");
        setTimeout(() => {
          if (isCallActiveRef.current && !isProcessingRef.current && !isSpeakingActiveRef.current) {
            startSpeechRecognition();
          }
        }, 300);
      }
    };

    rec.onresult = (event: any) => {
      if (!isCallActiveRef.current || isProcessingRef.current) {
        console.log("[Agent.tsx] Result discarded: call inactive or process busy.");
        return;
      }

      // Rebuild the final and interim text across continuous updates
      let interimText = "";
      let finalParts = "";
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalParts += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }
      sessionFinal = finalParts;
      sessionInterim = interimText;

      const displayText = (sessionFinal + sessionInterim).trim();
      console.log(`[Agent.tsx] STT interim transcript: "${displayText}"`);
      if (displayText.length > 0) {
        setLastMessage(displayText);

        // Reset/start silence detection timer to submit speech when user pauses for 1.6s
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          console.log("[Agent.tsx] Silence detected (1.6s). Submitting speech to AI...");
          if (isCallActiveRef.current && !isProcessingRef.current && !isSpeakingActiveRef.current) {
            // Stop recognition to submit
            try {
              rec.stop();
            } catch (e) {}
            handleSpeechCompleted(displayText);
          }
        }, 1600);
      }
    };

    rec.onend = () => {
      console.log("[Agent.tsx] SpeechRecognition session ended.");
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      if (!isCallActiveRef.current || isProcessingRef.current || isSpeakingActiveRef.current) {
        console.log("[Agent.tsx] Discarding STT completion: state is active speaking or processing.");
        return;
      }

      const capturedText = (sessionFinal + sessionInterim).trim();
      console.log(`[Agent.tsx] STT session final captured text on end: "${capturedText}"`);

      if (capturedText.length > 2) {
        // User said something — submit it to the AI
        handleSpeechCompleted(capturedText);
      } else {
        // Nothing useful captured, restart listening
        console.log("[Agent.tsx] Captured text is too short. Restarting SpeechRecognition in 150ms...");
        setTimeout(() => {
          if (isCallActiveRef.current && !isProcessingRef.current && !isSpeakingActiveRef.current) {
            startSpeechRecognition();
          }
        }, 150);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (e) {
      console.error("[Agent.tsx] Exception starting SpeechRecognition:", e);
    }
  };


  const handleSpeechCompleted = async (text: string) => {
    if (isProcessingRef.current) return;
    if (submittedTextRef.current === text) {
      console.log("[Agent.tsx] Duplicate speech submission blocked.");
      return;
    }
    isProcessingRef.current = true;
    submittedTextRef.current = text;

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

    // STT Corrections
    let cleanedText = text;
    const sttCorrections: Record<string, string> = {
      "yo yo exercise": "UI UX design",
      "yo-yo exercise": "UI UX design",
      "yo yo design": "UI UX design",
      "yo-yo design": "UI UX design",
      "yo yo": "UI/UX",
      "yo-yo": "UI/UX",
    };
    for (const [misheard, correction] of Object.entries(sttCorrections)) {
      const regex = new RegExp(`\\b${misheard}\\b`, "gi");
      cleanedText = cleanedText.replace(regex, correction);
    }

    // Append timer ending cue
    if (isTimerEndingRef.current && typeRef.current === "interview") {
      cleanedText += "\n[SYSTEM: Time is up. Acknowledge the candidate's response, state that time is up, conclude the interview warmly, say goodbye, and ALWAYS append '[END_CALL]' at the very end.]";
    }

    // Append user message to history
    const userMsg: SavedMessage = { role: "user", content: cleanedText };
    setMessages((prev) => [...prev, userMsg]);
    setIsSpeaking(false);

    // Call STAR framework analysis API in parallel
    fetch("/api/interview/analyze-star", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanedText, role: roleRef.current, type: sessionTypeRef.current }),
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
      if (typeRef.current === "interview" && questionsRef.current) {
        const formattedQuestions = questionsRef.current.map((q: string) => `- ${q}`).join("\n");
        const candidateRoleName = roleRef.current || userResumeData?.targetRole || "Software Engineer";
        const candidateSessionType = sessionTypeRef.current || "Interview";
        const personaText = candidateRoleName.toLowerCase().includes("president")
          ? "Your persona: A senior political debate moderator or veteran political journalist. Keep your tone formal, sharp, and demanding."
          : candidateRoleName.toLowerCase().includes("joker") || candidateRoleName.toLowerCase().includes("comedian")
          ? "Your persona: A comedy club owner, talent scout, or talk show host. Keep your tone conversational, witty, and responsive to humor."
          : "Your persona: A professional interviewer conducting a real-time voice interview to assess their qualifications, motivation, and fit for the role.";

        systemPrompt = `You are Alex, conducting a real-time voice evaluation or interview with a candidate.
Role: ${candidateRoleName}
Session Mode/Type: ${candidateSessionType}

${personaText}

Interview Guidelines:
Follow this structured question flow:
${formattedQuestions}

CRITICAL RULES - CONVERSATIONAL FLOW & CONCISENESS:
- DO NOT LECTURE ON CORRECT ANSWERS: If the candidate answers correctly or reasonably, do not explain the concept, define terms, or repeat the textbook answer back to them. Simply acknowledge briefly (e.g. "Got it.", "Makes sense.", "Solid explanation.") and transition immediately to the next question.
- GENTLY CORRECT BIG BLUNDERS: If the candidate makes a major blunder or says something completely incorrect, gently correct them and guide them in the right direction in one short, polite sentence before transitioning.
- KEEP RESPONSES VERY SHORT: Keep your replies under 25 words maximum. No yapping or long paragraphs. Keep the pacing fast and conversational.
- Write only plain, clean text. Do not use markdown like bold (**), italics (*), lists, or hashtags.
- Never use emojis.
- Conclude the interview properly when all questions are asked and answered.
- When all questions are done OR when you receive a [SYSTEM: Time is up...] message, conclude the interview warmly. Thank the candidate, wish them luck, say goodbye, and ALWAYS append "[END_CALL]" at the very end so the system knows to close the session. Example: "Thanks so much for your time today — it was great chatting with you. Best of luck! [END_CALL]"

${
  codingProblemRef.current
    ? `Sandbox/Workspace Info:
- The candidate is working on the task/problem: "${codingProblemRef.current.title}".
- Description: ${codingProblemRef.current.description}
- Candidate's current draft/code is:
\`\`\`${codingProblemRef.current.language}
${code}
\`\`\`
- If the candidate gets stuck, provide a Socratic hint to help them think in the right direction. Do NOT give them the full solution.`
    : ""
}`;
      } else {
        // Build context from the user's existing profile data
        const profileRole = userResumeData?.targetRole || "";
        const profileSummary = userResumeData?.resumeData?.parsedData?.basics?.summary || userResumeData?.resumeData?.summary || "";
        const profileSkills = userResumeData?.resumeData?.parsedData?.skills || userResumeData?.resumeData?.fixedParsedData?.skills || [];
        const skillsList = Array.isArray(profileSkills) ? profileSkills.slice(0, 6).join(", ") : "";

        systemPrompt = `You are a professional interview assistant helping ${userName} configure their mock session.

CANDIDATE PROFILE (already collected, do NOT ask about these again unless changing):
- Name: ${userName}
- Default Target Role: ${profileRole || "Software Engineer"}
- Key Skills: ${skillsList || "JavaScript, React, Node.js"}
- Profile Summary: ${profileSummary ? profileSummary.slice(0, 200) : "Experienced professional"}

YOUR CONVERSATION FLOW:
1. First, ask them if they want to practice their listed target role ("${profileRole || "Software Engineer"}") or something else.
2. If they say they want to practice their target role:
   - Suggest 2 to 4 custom session options/modes suited specifically to "${profileRole || "Software Engineer"}" (e.g. Technical, Behavioral, Live Coding Sandbox; or for President: Public Address, Crisis Management, Policy Memo Drafting; or for UI/UX Design: Portfolio Review, Design Challenge, Interaction Prototyping).
   - Ask them to pick one.
3. If they say they want to practice a different role (or name a different role):
   - Ask what role they want to practice (if not already specified).
   - Once they specify the new role, suggest 2 to 4 custom session options/modes suited to this new role.
   - Ask them to pick one.

RULES:
- Keep every reply under 30 words.
- Write only plain clean text. No markdown, no emojis, no symbols.
- Once they choose/specify their choice and the role, confirm their choice and the chosen role in one short sentence, append "[END_CALL]" at the very end of your response, and end your response. The system will create the interview automatically.`;
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
      console.error("[Agent.tsx] LLM streaming failed with error:", e);
      console.error("[Agent.tsx] Error message:", e.message);
      console.error("[Agent.tsx] Error stack:", e.stack);
      setLastMessage(`Error: ${e.message}`);
      setTimeout(() => {
        resumeListeningAfterSpeech();
      }, 3000);
    }
  };

  const requestSocraticHint = () => {
    if (callStatus !== CallStatus.ACTIVE || isProcessingRef.current) return;
    setIsCodingStuck(false);
    const isWritten = codingProblemRef.current?.language === "text" || codingProblemRef.current?.language === "markdown";
    handleSpeechCompleted(isWritten 
      ? "I am stuck on this draft. Can you give me a Socratic hint about my current text?" 
      : "I am stuck on this coding problem. Can you give me a Socratic hint about my current code?");
  };

  const transitionToInterview = async () => {
    console.log("[Agent.tsx] transitionToInterview triggered.");
    isProcessingRef.current = true;
    setIsSpeaking(true);
    setLastMessage("Configuring your interview questions. Please hold on...");

    try {
      const payload = {
        messages: messagesRef.current.map((m) => ({ role: m.role, content: m.content })),
        userid: userId,
        userResumeData: userResumeData,
      };
      console.log("[Agent.tsx] POST payload to /api/interview/parse-and-create:", payload);

      const res = await fetch("/api/interview/parse-and-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log(`[Agent.tsx] Received response status: ${res.status}`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Agent.tsx] API parse-and-create returned non-OK status. Body: ${errorText}`);
        throw new Error(`Server returned status ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("[Agent.tsx] Response payload parsed:", data);

      if (data.success && data.interviewId) {
        console.log(`[Agent.tsx] Transition success. Active Interview ID: ${data.interviewId}`);
        setActiveQuestions(data.questions || []);
        setActiveCodingProblem(data.codingProblem || null);
        setActiveInterviewId(data.interviewId);
        setActiveType("interview");
        setActiveFeedbackId(null);
        setActiveRole(data.role || "");
        setActiveSessionType(data.type || "");

        const welcome = data.firstMessage || "Okay, let's start the interview.";
        setLastMessage(welcome);

        // Reset the message history to start the interview cleanly
        setMessages([{ role: "assistant", content: welcome }]);

        // Speak the welcome greeting
        await speakSentence(welcome);

        if (isCallActiveRef.current) {
          setIsSpeaking(false);
          submittedTextRef.current = "";
          setLastMessage("Listening... Speak now");
          startSpeechRecognition();
        }
      } else {
        console.error("[Agent.tsx] API success is false or missing interviewId:", data);
        throw new Error("Failed to parse and create interview");
      }
    } catch (err: any) {
      console.error("[Agent.tsx] Exception caught during transitionToInterview:", err);
      console.error("[Agent.tsx] Error stack trace:", err.stack);
      setLastMessage("Failed to start interview. Ending call.");
      setTimeout(() => {
        handleDisconnect();
      }, 3000);
    } finally {
      isProcessingRef.current = false;
    }
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
      const isGoodbye = lowercaseMsg.includes("[end_call]");

      if (isGoodbye) {
        if (typeRef.current === "generate") {
          transitionToInterview();
        } else {
          // Stop timer if running
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          setTimeout(() => {
            handleDisconnect();
          }, 1500);
        }
      } else {
        submittedTextRef.current = ""; // reset so next answer isn't blocked
        setLastMessage("Listening... Speak now");
        startSpeechRecognition();
      }
    }
  };

  // Connect & Disconnect Call Lifecycles
  const startCallWithDuration = async (duration: "brief" | "medium" | "lengthy") => {
    setSelectedDuration(duration);
    setShowDurationModal(false);
    isTimerEndingRef.current = false;

    // Compute seconds for timer (brief=5min, medium=10min, lengthy=no timer)
    const durationSeconds = duration === "brief" ? 5 * 60 : duration === "medium" ? 10 * 60 : null;

    setCallStatus(CallStatus.CONNECTING);
    isCallActiveRef.current = true;
    isProcessingRef.current = false;
    accumulatedTextRef.current = "";
    sentenceBufferRef.current = "";
    speechQueueRef.current = [];

    // Start countdown timer if applicable
    if (durationSeconds !== null) {
      setTimerSecondsLeft(durationSeconds);
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            timerIntervalRef.current = null;
            isTimerEndingRef.current = true;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimerSecondsLeft(null);
    }

    // Dynamic Custom Welcome Greeting seeding
    let welcomeMsg = firstMessage || interviewer.firstMessage || "Hello! Thank you for taking the time to speak with me today.";
    if (type === "generate") {
      const profileRole = userResumeData?.targetRole || "Software Engineer";
      welcomeMsg = `Hello ${userName}! I see your target role is listed as "${profileRole}". Would you like to practice for this role, or would you like to prepare for a different role today?`;
    }

    setMessages([]);
    setCallStatus(CallStatus.ACTIVE);
    setIsSpeaking(true);

    setLastMessage(welcomeMsg);
    setMessages([{ role: "assistant", content: welcomeMsg }]);

    // Speak welcome message
    await speakSentence(welcomeMsg);

    // Start listening once welcome message finishes speaking
    if (isCallActiveRef.current) {
      setIsSpeaking(false);
      submittedTextRef.current = ""; // reset for fresh session
      setLastMessage("Listening... Speak now");
      startSpeechRecognition();
    }
  };

  const handleCall = () => {
    // Show duration picker modal instead of starting immediately
    setShowDurationModal(true);
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    isCallActiveRef.current = false;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerSecondsLeft(null);

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
    : 135; // Fallback typical conversation rate

  const fillerUm = fillerCountsRef.current?.um || 0;
  const fillerLike = fillerCountsRef.current?.like || 0;
  const fillerUh = fillerCountsRef.current?.uh || 0;
  const fillerSo = fillerCountsRef.current?.so || 0;

  return (
    <div className="w-full flex flex-col gap-6 font-mona-sans text-zinc-100 selection:bg-violet-500/30 selection:text-white">
      {/* Duration Selection Modal */}
      <AnimatePresence>
        {showDurationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-sm mx-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-7 shadow-2xl"
            >
              <button
                onClick={() => setShowDurationModal(false)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors text-xs font-bold"
              >
                ✕
              </button>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Interview Length</h2>
              <p className="text-[11px] text-zinc-500 mb-6">How long would you like this session to be?</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => startCallWithDuration("brief")}
                  className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-emerald-300 transition-colors">Brief</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">~5 minutes · Quick practice round</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">5 min</span>
                </button>
                <button
                  onClick={() => startCallWithDuration("medium")}
                  className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-amber-500/40 hover:bg-amber-950/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">Medium</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">~10 minutes · Balanced session</div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">10 min</span>
                </button>
                <button
                  onClick={() => startCallWithDuration("lengthy")}
                  className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-violet-300 transition-colors">Lengthy</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">20+ minutes · Full interview experience</div>
                  </div>
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">No limit</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleek Modern Session Status Bar */}
      {callStatus !== CallStatus.INACTIVE && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 px-6 py-3.5 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
              Practice Session Active
            </span>
          </div>

          <div className="flex gap-6 items-center text-zinc-500 text-[11px] font-semibold">
            <div>
              <span className="text-zinc-600 mr-1.5">Session ID:</span>
              <span className="text-zinc-300 font-mono">#{interviewId ? interviewId.slice(0, 8).toUpperCase() : "GENERATE"}</span>
            </div>
            <div className="max-sm:hidden">
              <span className="text-zinc-600 mr-1.5">Type:</span>
              <span className="text-zinc-300 uppercase">{type}</span>
            </div>
             {timerSecondsLeft !== null && (
              <div className={cn(
                "flex items-center gap-1.5 font-mono font-black px-3 py-1 rounded-full border transition-all duration-500",
                timerSecondsLeft <= 60
                  ? "text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse"
                  : timerSecondsLeft <= 120
                  ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                  : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              )}>
                {String(Math.floor(timerSecondsLeft / 60)).padStart(2, "0")}:{String(timerSecondsLeft % 60).padStart(2, "0")}
              </div>
            )}
            <div>
              <span className="text-zinc-600 mr-1.5">Connection:</span>
              <span className="text-emerald-400 font-bold">Stable</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Panel: Styled as Modern Calibration Drawer */}
      {callStatus === CallStatus.INACTIVE && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-xl mx-auto p-6 backdrop-blur-2xl bg-zinc-950/40 rounded-2xl flex flex-col gap-5 border border-zinc-900 shadow-2xl relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2.5">
              <span className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <Settings className="size-4 text-white" />
              </span>
              Practice Calibration
            </h4>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[10px] font-bold text-white hover:text-zinc-350 cursor-pointer transition-colors duration-200 px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg hover:border-zinc-800 shadow-md uppercase tracking-wider"
            >
              {showSettings ? "Hide Settings" : "Show Settings"}
            </button>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 border-t border-zinc-900 pt-4 overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className="size-3.5 text-zinc-400" /> Interview Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-zinc-950 text-zinc-100 text-xs rounded-xl p-3 border border-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 outline-none cursor-pointer hover:bg-zinc-900 transition-all font-semibold"
                  >
                    <option value="llama-3.1-8b-instant">Llama 3.1 8B (Fast & Recommended)</option>
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B (High Quality)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="size-3.5 text-zinc-400" /> Speech Engine Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="bg-zinc-950 text-zinc-100 text-xs rounded-xl p-3 border border-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 outline-none cursor-pointer hover:bg-zinc-900 transition-all font-semibold"
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

      {/* Main Split Grid for Practice & Editor */}
      <div className={cn(
        "grid grid-cols-1 gap-5 items-start w-full",
        codingProblem ? "lg:grid-cols-12" : "max-w-4xl mx-auto"
      )}>
        
        {/* Left Side: Voice Card, Transcript, STAR Tracker */}
        <div className={cn(
          "flex flex-col gap-4 w-full",
          codingProblem ? "lg:col-span-6" : "col-span-1"
        )}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full items-stretch">
            {/* AI Voice Interviewer Orb Card */}
            <motion.div 
              whileHover={{ y: -1 }}
              className={cn(
                "flex items-center justify-center flex-col gap-3.5 p-4 min-h-[175px] backdrop-blur-xl border rounded-2xl flex-1 w-full shadow-2xl relative overflow-hidden transition-all duration-500",
                callStatus === CallStatus.ACTIVE && isSpeaking
                  ? "bg-zinc-950/60 border-zinc-700 shadow-[0_0_50px_rgba(255,255,255,0.03)]"
                  : "bg-zinc-950/20 border-zinc-900"
              )}
            >
              <div className="relative flex justify-center items-center h-16 w-16">
                {/* Modern circular breathing halo aura */}
                <div className={cn(
                  "absolute inset-0 border border-zinc-700/10 rounded-full transition-all duration-1000",
                  callStatus === CallStatus.ACTIVE && isSpeaking ? "scale-110 opacity-100 bg-white/5" : "scale-100 opacity-0"
                )} />
                <div className={cn(
                  "absolute inset-1.5 border border-zinc-700/10 rounded-full transition-all duration-1000",
                  callStatus === CallStatus.ACTIVE && isSpeaking ? "scale-105 opacity-100 bg-white/5 animate-pulse" : "scale-100 opacity-0"
                )} />
                
                {/* Voice core orb */}
                <div className={cn(
                  "z-10 flex items-center justify-center rounded-full size-[48px] relative border transition-all duration-500 shadow-2xl bg-zinc-950",
                  callStatus === CallStatus.ACTIVE && isSpeaking 
                    ? "border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                    : "border-zinc-800"
                )}>
                  {/* Glowing core animation */}
                  <svg className={cn("w-5 h-5 text-white", callStatus === CallStatus.ACTIVE && isSpeaking ? "animate-pulse" : "opacity-60")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center flex flex-col gap-0.5 items-center">
                <h3 className="text-xs font-bold text-white tracking-wider uppercase">Alex</h3>
                <span className="text-[8px] text-zinc-455 font-bold tracking-widest bg-zinc-900/60 border border-zinc-850 px-2 py-0.5 rounded-full uppercase">
                  AI Voice Interviewer
                </span>
              </div>

              {callStatus === CallStatus.ACTIVE && (
                <div className="flex flex-col items-center gap-2 w-full mt-0.5">
                  {/* Subtle clean visualizer */}
                  {isSpeaking ? (
                    <div className="flex items-end justify-center gap-1 h-3.5">
                      <div className="w-1 bg-white rounded-full h-2 animate-[pulse_0.7s_infinite]" />
                      <div className="w-1 bg-zinc-400 rounded-full h-3.5 animate-[pulse_1s_infinite] delay-100" />
                      <div className="w-1 bg-zinc-350 rounded-full h-2.5 animate-[pulse_0.6s_infinite] delay-200" />
                      <div className="w-1 bg-white rounded-full h-1.5 animate-[pulse_0.8s_infinite] delay-150" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 h-3.5 opacity-35">
                      <span className="w-1 h-1 bg-zinc-650 rounded-full" />
                      <span className="w-1 h-1 bg-zinc-650 rounded-full animate-ping" />
                      <span className="w-1 h-1 bg-zinc-650 rounded-full" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Candidate Premium Profile Panel */}
            <motion.div 
              whileHover={{ y: -1 }}
              className="flex items-center justify-center flex-col gap-3.5 p-4 min-h-[175px] backdrop-blur-xl border border-zinc-900 bg-zinc-950/20 rounded-2xl flex-1 w-full shadow-2xl relative overflow-hidden transition-all duration-500 max-md:hidden"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 group-hover:from-violet-500 group-hover:to-cyan-400 p-[1px] transition-all duration-500" />
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-900">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={userName}
                      width={44}
                      height={44}
                      className="rounded-full object-cover size-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 border border-zinc-850">
                      <User className="w-5 h-5 text-zinc-550" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center flex flex-col gap-0.5 items-center w-full">
                <h3 className="text-xs font-bold text-white tracking-wide truncate max-w-[140px]">
                  {userName}
                </h3>
                <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                  Candidate Profile
                </span>
              </div>

              {/* Dynamic stats tracking */}
              {callStatus === CallStatus.ACTIVE && (
                <div className="w-full flex flex-col gap-2 mt-1 bg-zinc-950/40 border border-zinc-900/60 p-2.5 rounded-xl">
                  <div className="flex justify-between items-center text-[9px] font-bold">
                    <span className="text-zinc-500">Speaking Pace</span>
                    <span className="text-emerald-400">{currentAverageWpm} WPM</span>
                  </div>
                  {/* Speedometer line */}
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, (currentAverageWpm / 200) * 100)}%` }}
                    />
                  </div>

                  {/* Filler words indicator */}
                  <div className="flex justify-between text-[8px] font-bold text-zinc-500 border-t border-zinc-900/60 pt-1.5 mt-0.5">
                    <span>Fillers Detected:</span>
                    <span className="text-amber-400">
                      Like ({fillerLike}) / Um ({fillerUm}) / Uh ({fillerUh})
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Premium Chat Bubble Transcript */}
          {messages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-zinc-900 rounded-2xl w-full shadow-2xl relative overflow-hidden backdrop-blur-xl bg-zinc-950/30"
            >
              <div className="rounded-2xl px-5 py-4 flex items-center justify-center bg-zinc-950/20">
                <p
                  key={lastMessage}
                  className="text-xs text-center text-zinc-300 font-semibold leading-relaxed animate-fadeIn"
                >
                  "{lastMessage}"
                </p>
              </div>
            </motion.div>
          )}

          {/* STAR Response Analyzer Board */}
          {callStatus === CallStatus.ACTIVE && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4.5 backdrop-blur-2xl bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-3 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <h4 className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                  <Sparkles className="size-3.5 text-violet-400" />
                  {activeSessionType ? `${activeSessionType} Evaluation` : "Response Analyzer"}
                </h4>
                <span className="text-[8px] bg-violet-500/10 text-violet-400 font-bold px-2 py-0.5 rounded-full border border-violet-500/25 uppercase tracking-wider">
                  Live Insights
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Situation */}
                <div className={cn(
                  "p-2.5 rounded-xl border flex flex-col gap-1 items-center justify-center text-center transition-all duration-500 backdrop-blur-md",
                  starChecklist.situation 
                    ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-md" 
                    : "bg-zinc-900/10 border-zinc-900 text-zinc-650 hover:border-zinc-800"
                )}>
                  <CheckCircle2 className={cn("size-3.5 transition-colors duration-500", starChecklist.situation ? "text-emerald-400" : "text-zinc-800")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">{starChecklist.labels?.situation || "Situation"}</span>
                </div>
                
                {/* Task */}
                <div className={cn(
                  "p-2.5 rounded-xl border flex flex-col gap-1 items-center justify-center text-center transition-all duration-500 backdrop-blur-md",
                  starChecklist.task 
                    ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-md" 
                    : "bg-zinc-900/10 border-zinc-900 text-zinc-650 hover:border-zinc-800"
                )}>
                  <CheckCircle2 className={cn("size-3.5 transition-colors duration-500", starChecklist.task ? "text-emerald-400" : "text-zinc-800")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">{starChecklist.labels?.task || "Task"}</span>
                </div>
                
                {/* Action */}
                <div className={cn(
                  "p-2.5 rounded-xl border flex flex-col gap-1 items-center justify-center text-center transition-all duration-500 backdrop-blur-md",
                  starChecklist.action 
                    ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-md" 
                    : "bg-zinc-900/10 border-zinc-900 text-zinc-650 hover:border-zinc-800"
                )}>
                  <CheckCircle2 className={cn("size-3.5 transition-colors duration-500", starChecklist.action ? "text-emerald-400" : "text-zinc-800")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">{starChecklist.labels?.action || "Action"}</span>
                </div>
                
                {/* Result */}
                <div className={cn(
                  "p-2.5 rounded-xl border flex flex-col gap-1 items-center justify-center text-center transition-all duration-500 backdrop-blur-md",
                  starChecklist.result 
                    ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-md" 
                    : "bg-zinc-900/10 border-zinc-900 text-zinc-650 hover:border-zinc-800"
                )}>
                  <CheckCircle2 className={cn("size-3.5 transition-colors duration-500", starChecklist.result ? "text-emerald-400" : "text-zinc-800")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">{starChecklist.labels?.result || "Result"}</span>
                </div>
              </div>
 
              {/* Warnings and Dynamic Feedback */}
              <AnimatePresence>
                {starChecklist.result && !starChecklist.hasMetrics && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-amber-950/10 border border-amber-500/20 text-amber-400 rounded-xl p-3 text-[10px] flex gap-2.5 items-start shadow-md"
                  >
                    <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <span>
                      <strong className="text-amber-300 font-bold uppercase">Missing {starChecklist.labels?.hasMetrics || "Evidence"}:</strong> You outlined a response, but did not support it with specific {starChecklist.labels?.hasMetrics?.toLowerCase() || "details or metrics"}.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-[10px] text-zinc-400 leading-relaxed bg-zinc-950/40 p-3 rounded-xl border border-zinc-900 font-semibold">
                <span className="text-violet-400 font-bold uppercase tracking-wider mr-2">Evaluation Insights:</span>
                {starChecklist.feedback}
              </div>
            </motion.div>
          )}

          {/* Action Trigger Buttons */}
          <div className="w-full flex justify-center mt-0.5">
            {callStatus !== "ACTIVE" ? (
              <button 
                className="relative cursor-pointer flex items-center justify-center font-bold text-xs bg-white text-black px-8 py-3 rounded-full hover:bg-zinc-200 transition-all duration-300 active:scale-95 border border-white shadow-xl uppercase tracking-wider shadow-[0_4px_25px_rgba(255,255,255,0.15)]" 
                onClick={() => handleCall()}
              >
                <span
                  className={cn(
                    "absolute animate-ping rounded-full opacity-40 bg-zinc-400 h-[80%] w-[80%]",
                    callStatus !== "CONNECTING" && "hidden"
                  )}
                />
                <span className="relative flex items-center gap-2 font-black">
                  <span className="size-2 rounded-full bg-black animate-pulse" />
                  {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Start Voice Session" : "Connecting..."}
                </span>
              </button>
            ) : (
              <button 
                className="cursor-pointer flex items-center justify-center gap-2 font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-full transition-all duration-300 active:scale-95 border border-rose-500 shadow-xl tracking-wider uppercase hover:shadow-[0_4px_25px_rgba(225,29,72,0.25)]" 
                onClick={() => handleDisconnect()}
              >
                <PhoneOff className="size-4.5" /> End Practice Session
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Technical Coding Sandbox Redesigned as Premium IDE */}
        {codingProblem && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col gap-3.5 p-4.5 backdrop-blur-2xl bg-zinc-950/20 rounded-2xl border border-zinc-900 shadow-2xl w-full relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
              <h3 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-2">
                <Code className="size-4.5 text-violet-400" />
                {codingProblem.language === "text" || codingProblem.language === "markdown" ? "Workspace Sandbox" : "Coding Sandbox"}
              </h3>
              <span className="bg-zinc-900 border border-zinc-850 text-zinc-300 font-mono text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-inner">
                {codingProblem.language.toUpperCase()}
              </span>
            </div>

            {/* Problem Statement Display */}
            <div className="flex flex-col gap-1.5 bg-zinc-950/40 border border-zinc-900 p-3.5 rounded-xl max-h-[100px] overflow-y-auto custom-scrollbar relative">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Lightbulb className="size-4 text-amber-400 shrink-0" />
                {codingProblem.title}
              </h4>
              <p className="text-[11px] text-zinc-400 whitespace-pre-line leading-relaxed font-semibold mt-0.5">
                {codingProblem.description}
              </p>
            </div>

            {/* Premium Code Textarea */}
            <div className="flex flex-col gap-0 relative">
              {/* IDE Top Window Bar */}
              <div className="flex px-4 py-2.5 border border-zinc-900 rounded-t-xl text-[9px] text-zinc-500 font-semibold flex-row justify-between items-center bg-zinc-950/60 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500/40" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/40" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/40" />
                  <span className="ml-2 text-zinc-400 font-bold">
                    {codingProblem.language === "python" ? "solution.py" : 
                     codingProblem.language === "javascript" || codingProblem.language === "typescript" ? "solution.ts" :
                     codingProblem.language === "markdown" ? "draft.md" : "draft.txt"}
                  </span>
                </div>
                <span className="text-[8px] uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
                  Ready
                </span>
              </div>

              {/* Gutter + TextArea Container */}
              <div className="relative flex items-stretch border border-t-0 border-zinc-900 rounded-b-xl overflow-hidden bg-zinc-950/10 shadow-[inset_0_4px_16px_rgba(0,0,0,0.4)]">
                {/* Gutter Line Numbers Simulation */}
                <div className="w-9 bg-zinc-950/40 border-r border-zinc-900/60 font-mono text-[10px] text-zinc-650 py-3.5 select-none flex flex-col items-center gap-1.5 leading-relaxed text-right pr-2">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i}>{String(i + 1).padStart(2, "0")}</div>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder={codingProblem.language === "text" || codingProblem.language === "markdown" 
                    ? "Draft your response here... Alex will observe your inputs." 
                    : "// Implement your algorithm here... Alex will observe your code logic."}
                  className="font-mono bg-transparent text-zinc-205 text-xs py-3.5 px-4 w-full h-[190px] outline-none focus:ring-0 resize-none leading-relaxed"
                  disabled={callStatus !== CallStatus.ACTIVE}
                />
              </div>

              {/* Floating Socratic Advisor Alert */}
              <AnimatePresence>
                {isCodingStuck && callStatus === CallStatus.ACTIVE && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 bg-zinc-950 border border-violet-500/20 text-violet-400 rounded-xl p-3 flex gap-3 items-center justify-between shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex gap-2.5 items-center">
                      <div className="p-1.5 bg-violet-500/10 rounded-lg border border-violet-500/20 animate-pulse">
                        <Lightbulb className="size-4 text-violet-400" />
                      </div>
                      <span className="font-semibold text-zinc-300">
                        {codingProblem.language === "text" || codingProblem.language === "markdown" 
                          ? "Need a hint with your draft?" 
                          : "Need a hint with your code?"}
                      </span>
                    </div>
                    <Button
                      onClick={requestSocraticHint}
                      className="h-8 text-[9px] font-bold uppercase tracking-wider px-3.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 border border-violet-500/30 cursor-pointer shadow-lg active:scale-95"
                    >
                      Get Hint
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
                  className="text-[9px] font-bold uppercase tracking-widest px-4 py-2 h-9 border border-zinc-900 text-zinc-500 hover:bg-zinc-900 hover:text-white hover:border-violet-500/30 transition-all rounded-lg cursor-pointer"
                >
                  <Sparkles className="size-3.5 text-violet-400" /> Request Socratic Hint
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
