"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Phone, PhoneOff, Mic, Brain, Volume2, Settings,
  Code, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Play, User, Languages
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { interviewer, interviewLanguages } from "@/constants";
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
  const [selectedStt, setSelectedStt] = useState<"browser" | "whisper-v3" | "whisper-turbo">("browser");
  const selectedSttRef = useRef<string>("browser");
  useEffect(() => {
    selectedSttRef.current = selectedStt;
    if (callStatus === CallStatus.ACTIVE) {
      console.log(`[Agent.tsx] STT Engine changed to ${selectedStt}. Reinitializing...`);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      } catch (e) {}
      stopWhisperRecordingOnly();
      isListeningRef.current = false;
      submittedThisTurnRef.current = false;
      if (!isProcessingRef.current && !isSpeakingActiveRef.current) {
        startSpeechRecognition();
      }
    }
  }, [selectedStt, callStatus]);

  // Interview Language (selected before the session starts)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");
  const languageRef = useRef<string>("en-US");
  useEffect(() => {
    languageRef.current = selectedLanguage;
  }, [selectedLanguage]);

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
  const [showSandbox, setShowSandbox] = useState(false);

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
  const isListeningRef = useRef<boolean>(false); // true while a SpeechRecognition instance is live
  const submittedThisTurnRef = useRef<boolean>(false); // true once this turn's speech has been captured
  const messagesRef = useRef<SavedMessage[]>([]);
  const submittedTextRef = useRef<string>(""); // track last submitted text to prevent duplicate processing

  // Whisper Speech-to-Text Refs
  const mediaRecorderRef = useRef<any>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derive the effective TTS voice. All languages now have neural TTS
  // (Groq for English/Arabic, edge-tts for everything else). The local
  // browser synthesis is only used when the user explicitly picks "local".
  const currentLangConfig = interviewLanguages.find((l) => l.code === selectedLanguage) || interviewLanguages[0];
  const effectiveVoice: string = currentLangConfig.neuralTTS ? selectedVoice : "local";

  // Pick a browser SpeechSynthesis voice that matches the current interview language.
  const pickBrowserVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !voices || voices.length === 0) return null;
    const lang = languageRef.current.toLowerCase();
    const langBase = lang.split("-")[0]; // e.g. "ur" from "ur-pk"
    // Prefer high-quality voices for the exact locale, then the language family.
    const exact = voices.find((v) => v.lang.toLowerCase() === lang);
    if (exact) return exact;
    const base = voices.find((v) => v.lang.toLowerCase().startsWith(langBase));
    if (base) return base;
    return null;
  };

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

  // Check coding activity stuck status (60-second check, visual indicator only to prevent AI interrupting voice chat)
  useEffect(() => {
    if (callStatus !== CallStatus.ACTIVE || !codingProblem || !showSandbox) return;

    // Reset reference time when sandbox becomes visible
    lastCodeTypedRef.current = Date.now();
    setIsCodingStuck(false);

    const interval = setInterval(() => {
      const msSinceLastType = Date.now() - lastCodeTypedRef.current;
      if (msSinceLastType > 60000) { // 60 seconds of inactivity
        setIsCodingStuck(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [callStatus, codingProblem, showSandbox]);

  // Clean resources on unmount
  useEffect(() => {
    return () => {
      isCallActiveRef.current = false;
      isListeningRef.current = false;
      submittedThisTurnRef.current = false;
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
        transcript: messages
          .filter((m) => !m.content.startsWith("[SYSTEM:"))
          .map((m) => ({ role: m.role, content: m.content })),
        feedbackId: feedbackId || undefined,
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
            messages: messages
              .filter((m) => !m.content.startsWith("[SYSTEM:"))
              .map((m) => ({ role: m.role, content: m.content })),
            userid: userId,
            userResumeData: userResumeData,
            language: selectedLanguage,
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
    utterance.lang = languageRef.current;
    utterance.rate = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const matchVoice = pickBrowserVoice(voices);
    if (matchVoice) {
      utterance.voice = matchVoice;
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
        utterance.lang = languageRef.current;
        utterance.rate = 1.05;

        let voices = window.speechSynthesis.getVoices();
        // Fallback for chrome async load
        if (voices.length === 0) {
          voices = speechSynthesis.getVoices();
        }
        let matchVoice = pickBrowserVoice(voices);
        if (!matchVoice && voices.length > 0) {
          // If no specific locale match, prefer a female voice fallback over the default male voice
          matchVoice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira")) || voices[0];
        }
        if (matchVoice) {
          utterance.voice = matchVoice;
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
      const cleanText = text.replace(/\[END[-_ ]?CALL\]/gi, "").replace(/\[SHOW[-_ ]?SANDBOX\]/gi, "").replace(/[*#_`~[\]]/g, "").trim();
      console.log(`[Agent.tsx] speakSentence called. Raw: "${text}", Cleaned: "${cleanText}"`);
      if (!cleanText) {
        console.log("[Agent.tsx] Empty text, resolving speakSentence immediately.");
        resolve();
        return;
      }

      if (effectiveVoice === "local") {
        console.log("[Agent.tsx] Effective voice is local. Using speakSentenceFallback.");
        speakSentenceFallback(cleanText).then(resolve);
        return;
      }

      const voiceName = effectiveVoice.startsWith("groq-") ? effectiveVoice.substring(5) : effectiveVoice;
      console.log(`[Agent.tsx] Requesting TTS generation via API for voice: ${voiceName}...`);

      fetch("/api/meow/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanText,
          voice: voiceName,
          language: languageRef.current,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errBody = await response.text();
            console.error(`[Agent.tsx] TTS API response error. Status: ${response.status}. Payload:`, errBody);
            throw new Error(`TTS API error: ${response.status} - ${errBody}`);
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
    const cleanText = text.replace(/\[END[-_ ]?CALL\]/gi, "").replace(/\[SHOW[-_ ]?SANDBOX\]/gi, "").replace(/[*#_`~[\]]/g, "").trim();
    if (!cleanText) {
      if (effectiveVoice === "local") {
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

    if (effectiveVoice === "local") {
      playLocalSpeechChunk(cleanText);
    } else {
      speechQueueRef.current.push(cleanText);
      processSpeechQueue();
    }
  };

  const handleNewStreamToken = (token: string) => {
    accumulatedTextRef.current += token;

    if (/\[SHOW[-_ ]?SANDBOX\]/i.test(accumulatedTextRef.current)) {
      setShowSandbox(true);
    }

    const displayClean = accumulatedTextRef.current
      .replace(/\[SHOW[-_ ]?SANDBOX\]/gi, "")
      .replace(/\[END[-_ ]?CALL\]/gi, "")
      .trim();
    setLastMessage(displayClean);

    sentenceBufferRef.current += token;
    const sentenceBoundaryRegex = /[.?!;\n]/;
    const match = sentenceBufferRef.current.match(sentenceBoundaryRegex);

    if (match) {
      const puncIndex = sentenceBufferRef.current.indexOf(match[0]);
      const chunkText = sentenceBufferRef.current.substring(0, puncIndex + 1).trim();
      if (chunkText.length > 0) {
        sentenceBufferRef.current = sentenceBufferRef.current.substring(puncIndex + 1);
        const cleanChunk = chunkText
          .replace(/\[SHOW[-_ ]?SANDBOX\]/gi, "")
          .replace(/\[END[-_ ]?CALL\]/gi, "")
          .trim();
        queueSpeechChunk(cleanChunk);
      }
    }
  };

  // Speech Recognition (STT) Setup
  const startSpeechRecognition = () => {
    if (selectedSttRef.current !== "browser") {
      startWhisperRecording();
      return;
    }

    if (!SpeechRecognition) {
      console.error("[Agent.tsx] SpeechRecognition API is not supported in this browser.");
      return;
    }

    // Single-entry guard: never start two recognition instances at once.
    if (isListeningRef.current) {
      console.log("[Agent.tsx] SpeechRecognition already listening. Skipping duplicate start.");
      return;
    }
    isListeningRef.current = true;

    console.log("[Agent.tsx] Initializing new SpeechRecognition instance...");
    const rec = new SpeechRecognition();
    recognitionRef.current = rec; // Set immediately to ignore obsolete instances
    rec.continuous = false;    // Disabled to let natural single utterances finish and fire immediately
    rec.interimResults = true; // Show real-time transcription while speaking
    rec.lang = languageRef.current;
    rec.maxAlternatives = 1;

    // Per-session accumulators (local vars, not refs)
    let sessionFinal = "";
    let sessionInterim = "";

    // The ONLY path that submits captured speech. Guards against the race
    // between the silence timer, onend, and onerror so a turn's speech is
    // submitted exactly once and a duplicate "Listening... Speak now" never
    // appears from a glitch-triggered restart.
    const submitCapturedSpeech = (text: string) => {
      console.log(`[Agent.tsx - STT SUBMIT] submitCapturedSpeech called. Text: "${text}". isProcessingRef=${isProcessingRef.current}, recognitionRefMatches=${recognitionRef.current === rec}, submittedThisTurnRef=${submittedThisTurnRef.current}`);
      if (recognitionRef.current !== rec) {
        console.warn("[Agent.tsx - STT SUBMIT DISCARD] Obsolete instance mismatch.");
        return;
      }
      if (!isCallActiveRef.current || isProcessingRef.current) {
        console.warn(`[Agent.tsx - STT SUBMIT DISCARD] Call inactive or process busy. isCallActive=${isCallActiveRef.current}, isProcessing=${isProcessingRef.current}`);
        return;
      }
      if (submittedThisTurnRef.current) {
        console.warn("[Agent.tsx - STT SUBMIT DISCARD] Speech already submitted this turn.");
        return;
      }
      submittedThisTurnRef.current = true;
      isProcessingRef.current = true;

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      try {
        rec.stop();
      } catch (e) {}
      handleSpeechCompleted(text);
    };

    rec.onstart = () => {
      console.log(`[Agent.tsx - STT START] SpeechRecognition session started. isListeningRef=${isListeningRef.current}, isProcessingRef=${isProcessingRef.current}, submittedThisTurnRef=${submittedThisTurnRef.current}`);
      isListeningRef.current = true;
      sessionFinal = "";
      sessionInterim = "";
      turnStartRef.current = Date.now();
    };

    rec.onerror = (event: any) => {
      if (recognitionRef.current !== rec) {
        console.log("[Agent.tsx] Obsolete recognition instance error. Discarding event.");
        return;
      }
      console.error("[Agent.tsx] SpeechRecognition error event captured:", event.error);
      if (event.error === "not-allowed") {
        console.error("[Agent.tsx] Microphone access blocked or not allowed.");
        handleDisconnect();
        return;
      }
      // On no-speech or other transient errors, just restart — but only if
      // nothing has been submitted this turn and nothing is processing/speaking.
      if (
        event.error !== "aborted" &&
        !submittedThisTurnRef.current &&
        isCallActiveRef.current &&
        !isProcessingRef.current &&
        !isSpeakingActiveRef.current
      ) {
        console.log("[Agent.tsx] Transient SpeechRecognition error. Restarting in 300ms...");
        setTimeout(() => {
          if (
            !submittedThisTurnRef.current &&
            isCallActiveRef.current &&
            !isProcessingRef.current &&
            !isSpeakingActiveRef.current
          ) {
            startSpeechRecognition();
          }
        }, 300);
      }
    };

    rec.onresult = (event: any) => {
      if (recognitionRef.current !== rec) {
        console.log("[Agent.tsx] Obsolete recognition result discarded.");
        return;
      }
      if (!isCallActiveRef.current || isProcessingRef.current || submittedThisTurnRef.current) {
        console.log("[Agent.tsx] Result discarded: call inactive, process busy, or already submitted.");
        return;
      }

      // Rebuild the final and interim text across continuous updates, preventing consecutive duplicates
      let interimText = "";
      let finalParts = "";
      let lastFinal = "";
      let lastInterim = "";
      for (let i = 0; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          if (transcript && transcript !== lastFinal) {
            finalParts += (finalParts ? " " : "") + transcript;
            lastFinal = transcript;
          }
        } else {
          if (transcript && transcript !== lastInterim) {
            interimText += (interimText ? " " : "") + transcript;
            lastInterim = transcript;
          }
        }
      }
      sessionFinal = finalParts;
      sessionInterim = interimText;

      const displayText = (sessionFinal + sessionInterim).trim();
      console.log(`[Agent.tsx] STT interim transcript: "${displayText}"`);
      if (displayText.length > 0) {
        setLastMessage(displayText);

        // Reset/start silence detection timer to submit speech when user pauses for 1.1s
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          console.log("[Agent.tsx] Silence detected (1.1s). Submitting speech to AI...");
          submitCapturedSpeech(displayText);
        }, 1100);
      }
    };

    rec.onend = () => {
      console.log("[Agent.tsx] SpeechRecognition session ended.");
      if (recognitionRef.current !== rec) {
        console.log("[Agent.tsx] Obsolete recognition instance ended. Discarding event.");
        return;
      }
      isListeningRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      // If this turn's speech was already submitted, do nothing — no restart, no re-submit.
      if (submittedThisTurnRef.current) {
        console.log("[Agent.tsx] STT session ended after submission. No further action.");
        return;
      }

      if (!isCallActiveRef.current || isProcessingRef.current || isSpeakingActiveRef.current) {
        console.log("[Agent.tsx] Discarding STT completion: state is active speaking or processing.");
        return;
      }

      const capturedText = (sessionFinal + sessionInterim).trim();
      console.log(`[Agent.tsx] STT session final captured text on end: "${capturedText}"`);

      if (capturedText.length > 1 && !submittedThisTurnRef.current) {
        submitCapturedSpeech(capturedText);
      } else {
        // Restart listening cleanly if session auto-stops empty
        console.log("[Agent.tsx] STT session ended empty. Restarting in 150ms...");
        setTimeout(() => {
          if (
            !submittedThisTurnRef.current &&
            isCallActiveRef.current &&
            !isProcessingRef.current &&
            !isSpeakingActiveRef.current
          ) {
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
      isListeningRef.current = false;
    }
  };

  // Start Whisper Microphone Recording and Client VAD
  const startWhisperRecording = async () => {
    if (isListeningRef.current) {
      console.log("[Agent.tsx] Whisper already listening. Skipping duplicate start.");
      return;
    }
    isListeningRef.current = true;
    submittedThisTurnRef.current = false;
    audioChunksRef.current = [];

    console.log("[Agent.tsx] Starting Whisper microphone recording...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250); // Capture chunks every 250ms
      turnStartRef.current = Date.now();

      // Set up Audio Context for Volume Detection
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;
        source.connect(analyser);

        const bufferLength = analyser.fftSize;
        const dataArray = new Float32Array(bufferLength);

        let lastSpeechTime = 0;
        let hasSpoken = false;

        const checkAudio = () => {
          if (!isListeningRef.current || submittedThisTurnRef.current) return;

          analyser.getFloatTimeDomainData(dataArray);
          let sumSquares = 0.0;
          for (let i = 0; i < bufferLength; i++) {
            sumSquares += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sumSquares / bufferLength);

          // Voice threshold detection
          if (rms > 0.015) {
            lastSpeechTime = Date.now();
            if (!hasSpoken) {
              hasSpoken = true;
              console.log("[Agent.tsx] User speech activity detected.");
            }
          }

          // If user spoke and now we have 1.2s of silence, transcribe and submit
          if (hasSpoken && Date.now() - lastSpeechTime > 1200) {
            console.log("[Agent.tsx] VAD: Silence detected. Initiating transcription...");
            stopWhisperRecordingAndTranscribe();
          }
        };

        vadIntervalRef.current = setInterval(checkAudio, 100);
      } else {
        console.warn("[Agent.tsx] Web Audio API is not supported. Streaming media recorder only.");
      }

    } catch (err) {
      console.error("[Agent.tsx] Failed to initialize microphone for Whisper:", err);
      isListeningRef.current = false;
    }
  };

  const stopWhisperRecordingOnly = () => {
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
  };

  const stopWhisperRecordingAndTranscribe = async () => {
    if (submittedThisTurnRef.current) return;
    submittedThisTurnRef.current = true;
    isListeningRef.current = false;
    isProcessingRef.current = true;

    setLastMessage("Transcribing audio...");
    stopWhisperRecordingOnly();

    setTimeout(async () => {
      if (audioChunksRef.current.length === 0) {
        console.warn("[Agent.tsx] No audio chunks captured.");
        isProcessingRef.current = false;
        resumeListeningAfterSpeech();
        return;
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob);
      const modelId = selectedSttRef.current === "whisper-v3" ? "whisper-large-v3" : "whisper-large-v3-turbo";
      formData.append("model", modelId);
      formData.append("language", languageRef.current);

      try {
        const res = await fetch("/api/meow/stt", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`STT API responded with status ${res.status}`);
        }

        const data = await res.json();
        const text = data.text || "";
        console.log(`[Agent.tsx] Whisper transcription success: "${text}"`);
        
        if (text.trim().length > 1) {
          handleSpeechCompleted(text);
        } else {
          console.log("[Agent.tsx] Whisper transcript empty. Resetting listening.");
          isProcessingRef.current = false;
          resumeListeningAfterSpeech();
        }
      } catch (err: any) {
        console.error("[Agent.tsx] Whisper transcription failed:", err);
        setLastMessage("Transcription failed. Try again.");
        isProcessingRef.current = false;
        setTimeout(() => {
          resumeListeningAfterSpeech();
        }, 1500);
      }
    }, 150);
  };


  const handleSpeechCompleted = async (text: string) => {
    if (submittedTextRef.current === text) {
      console.log("[Agent.tsx] Duplicate speech submission blocked.");
      isProcessingRef.current = false;
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

    // Clean speech of Urdu filler words (ام, امم, etc.) to keep transcripts clean
    let cleanedSpeechText = text;
    if (languageRef.current === "ur-PK") {
      cleanedSpeechText = cleanedSpeechText
        .replace(/\b(امم|ام|آں|اہ|اہہ|اہہہ)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // Accumulate and count filler words
    const wordsList = cleanedSpeechText.toLowerCase().split(/\s+/);
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
    let cleanedText = cleanedSpeechText;
    const sttCorrections: Record<string, string> = {
      "yo yo exercise": "UI UX design",
      "yo-yo exercise": "UI UX design",
      "yo yo design": "UI UX design",
      "yo-yo design": "UI UX design",
      "yo yo": "UI/UX",
      "yo-yo": "UI/UX",
      "una": "Q&A",
      "you and a": "Q&A",
      "you and are": "Q&A",
      "you and R": "Q&A",
      "q and a": "Q&A",
      "q & a": "Q&A",
      "qna": "Q&A",
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
      setLastMessage("AI is thinking...");
      setIsSpeaking(true);

      const response = await fetch("/api/meow/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: messagesRef.current,
          promptParams: {
            type: typeRef.current,
            role: roleRef.current,
            sessionType: sessionTypeRef.current,
            language: languageRef.current,
            questions: questionsRef.current,
            codingProblem: codingProblemRef.current,
            code: code,
            userName: userName,
            userResumeData: userResumeData
          },
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

      if (sentenceBufferRef.current.trim().length > 0) {
        const chunk = sentenceBufferRef.current.trim();
        sentenceBufferRef.current = "";
        queueSpeechChunk(chunk);
      } else {
        if (effectiveVoice === "local") {
          if (
            localSpeechQueueCountRef.current === 0 ||
            localSpeechFinishedCountRef.current === localSpeechQueueCountRef.current
          ) {
            localSpeechQueueCountRef.current = 0;
            localSpeechFinishedCountRef.current = 0;
            resumeListeningAfterSpeech();
          }
        } else {
          if (speechQueueRef.current.length === 0 && !isSpeakingActiveRef.current) {
            resumeListeningAfterSpeech();
          }
        }
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

  async function triggerAutomaticHint() {
    if (callStatus !== CallStatus.ACTIVE || isProcessingRef.current) return;
    
    setIsCodingStuck(false);
    lastCodeTypedRef.current = Date.now();
    isProcessingRef.current = true;
    
    stopTTSPlayback();
    accumulatedTextRef.current = "";
    sentenceBufferRef.current = "";
    speechQueueRef.current = [];
    isSpeakingActiveRef.current = false;
    streamCompletedRef.current = false;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {}

    const isWritten = codingProblemRef.current?.language === "text" || codingProblemRef.current?.language === "markdown";
    const hintPrompt = isWritten
      ? `[SYSTEM: The candidate has been inactive/stuck on the writing sandbox for 10 seconds. Proactively help them with a brief, warm Socratic hint or suggestion based on their current text: "${code}". Keep it under 25 words.]`
      : `[SYSTEM: The candidate has been inactive/stuck on the coding sandbox for 10 seconds. Proactively help them with a brief, warm Socratic hint based on their current code: "${code}". Keep it under 25 words.]`;

    const systemCue: SavedMessage = { role: "user", content: hintPrompt };
    setMessages((prev) => [...prev, systemCue]);
    setIsSpeaking(false);
    setLastMessage("AI is thinking...");
    setIsSpeaking(true);

    try {
      const candidateRoleName = roleRef.current || userResumeData?.targetRole || "Software Engineer";
      const candidateSessionType = sessionTypeRef.current || "Interview";
      const langConfig = interviewLanguages.find((l) => l.code === languageRef.current);
      const languageInstruction = `LANGUAGE REQUIREMENT: The candidate selected "${langConfig?.name || "English"}" (${languageRef.current}). You MUST reply ONLY in this language.`;
      const personaText = candidateRoleName.toLowerCase().includes("president")
        ? "Your persona: A senior political debate moderator or veteran political journalist. Keep your tone formal, sharp, and demanding."
        : candidateRoleName.toLowerCase().includes("joker") || candidateRoleName.toLowerCase().includes("comedian")
        ? "Your persona: A comedy club owner, talent scout, or talk show host. Keep your tone conversational, witty, and responsive to humor."
        : "Your persona: A professional interviewer conducting a real-time voice interview to assess their qualifications, motivation, and fit for the role.";

      const formattedQuestions = questionsRef.current.map((q: string) => `- ${q}`).join("\n");
      
      const systemPrompt = `You are Alex, conducting a real-time voice evaluation or interview with a candidate.
Role: ${candidateRoleName}
Session Mode/Type: ${candidateSessionType}

${personaText}

${languageInstruction}

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
- When all questions are done OR when you receive a [SYSTEM: Time is up...] message, conclude the interview warmly. Thank the candidate, wish them luck, say goodbye, and ALWAYS append "[END_CALL]" at the very end so the system knows to close the session.

${
  codingProblemRef.current
    ? `Sandbox/Workspace Info:
- The candidate is working on the task/problem: "${codingProblemRef.current.title}".
- Description: ${codingProblemRef.current.description}
- Candidate's current draft/code is:
\`\`\`${codingProblemRef.current.language}
${code}
\`\`\`
- If the candidate gets stuck, provide a Socratic hint to help them think in the right direction. Do NOT give them the full solution.
- CRITICAL: The sandbox is hidden from the candidate initially. When you are ready for them to write/code/solve the challenge, you MUST output the exact tag '[SHOW_SANDBOX]' in your response. Do not output this tag before you introduce the problem.`
    : ""
}`;

      const history = [
        { role: "system", content: systemPrompt },
        ...messagesRef.current,
      ];

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

      if (effectiveVoice === "local") {
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
      console.error("[Agent.tsx] LLM streaming failed during auto-hint:", e);
      setLastMessage("Error: " + e.message);
      setTimeout(() => {
        resumeListeningAfterSpeech();
      }, 3000);
    }
  }

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
        language: selectedLanguage,
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
          submittedThisTurnRef.current = false;
          isListeningRef.current = false;
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
        // Reset per-turn flags so the next turn captures fresh speech exactly once.
        submittedTextRef.current = ""; // reset so next answer isn't blocked
        submittedThisTurnRef.current = false;
        isListeningRef.current = false;
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
    isListeningRef.current = false;
    submittedThisTurnRef.current = false;
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
      if (selectedLanguage === "ur-PK") {
        welcomeMsg = `ہیلو ${userName}! میں دیکھ سکتا ہوں کہ آپ کا ہدف کردار "${profileRole}" ہے۔ کیا آپ اسی کردار کے لیے مشق کرنا چاہیں گے، یا آج کسی دوسرے کردار کی تیاری کرنا چاہتے ہیں؟`;
      } else if (selectedLanguage === "es-ES") {
        welcomeMsg = `¡Hola ${userName}! Veo que tu rol objetivo es "${profileRole}". ¿Te gustaría practicar para este rol o prefieres prepararte para un rol diferente hoy?`;
      } else if (selectedLanguage === "fr-FR") {
        welcomeMsg = `Bonjour ${userName}! Je vois que votre rôle cible est "${profileRole}". Souhaitez-vous vous entraîner pour ce rôle, ou préférez-vous vous préparer pour un autre rôle aujourd'hui?`;
      } else if (selectedLanguage === "zh-CN") {
        welcomeMsg = `你好 ${userName}！我看到你的目标职位是 "${profileRole}"。你想针对这个职位进行练习，还是今天想准备其他职位？`;
      } else if (selectedLanguage === "ar-SA") {
        welcomeMsg = `مرحباً ${userName}! أرى أن دورك المستهدف هو "${profileRole}". هل ترغب في التدرب على هذا الدور، أم ترغب في الاستعداد لدور مختلف اليوم؟`;
      } else if (selectedLanguage === "hi-IN") {
        welcomeMsg = `नमस्ते ${userName}! मैं देख सकता हूँ कि आपकी लक्षित भूमिका "${profileRole}" है। क्या आप इस भूमिका के लिए अभ्यास करना चाहेंगे, या आज किसी अन्य भूमिका की तैयारी करना चाहेंगे?`;
      } else if (selectedLanguage === "de-DE") {
        welcomeMsg = `Hallo ${userName}! Ich sehe, dass deine Zielrolle als "${profileRole}" aufgeführt ist. Möchtest du für diese Rolle üben oder dich heute auf eine andere Rolle vorbereiten?`;
      } else if (selectedLanguage === "pt-BR") {
        welcomeMsg = `Olá ${userName}! Vejo que seu cargo de interesse é "${profileRole}". Você gostaria de praticar para este cargo ou prefere se preparar para um cargo diferente hoje?`;
      } else if (selectedLanguage === "ja-JP") {
        welcomeMsg = `こんにちは ${userName}さん！目標の職種が「${profileRole}」に設定されているようですね。この職種の練習を始めますか？それとも今日は別の職種の準備をしますか？`;
      } else {
        welcomeMsg = `Hello ${userName}! I see your target role is listed as "${profileRole}". Would you like to practice for this role, or would you like to prepare for a different role today?`;
      }
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
      submittedThisTurnRef.current = false;
      isListeningRef.current = false;
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
    isListeningRef.current = false;
    submittedThisTurnRef.current = false;

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
    stopWhisperRecordingOnly();

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {}
  };

    // Quick inline localization translations dictionary
    const translations: Record<string, Record<string, string>> = {
      "ur-PK": {
        "active": "مشق کا سیشن فعال ہے",
        "session_id": "سیشن آئی ڈی",
        "type": "قسم",
        "language": "زبان",
        "connection": "کنکشن",
        "stable": "مستحکم",
        "title": "مصنوعی ذہانت کا انٹرویو لینے والا",
        "profile": "امیدوار کا پروفائل",
        "pace": "بولنے کی رفتار",
        "fillers": "فالتو الفاظ",
        "detected": "پائے گئے",
        "analyzer": "جواب کا تجزیہ کار",
        "insights": "براہ راست بصیرت",
        "situation": "صورتحال",
        "task": "کام",
        "action": "عمل",
        "result": "نتیجہ",
        "evaluation_insights": "تشخیص کی بصیرت",
        "default_feedback": "تجزیہ شروع کرنے کے لیے سلوکی سوالات کے جواب دینا شروع کریں۔",
        "start_session": "وائس سیشن شروع کریں",
        "connecting": "رابطہ قائم کیا جا رہا ہے...",
        "end_session": "مشق کا سیشن ختم کریں",
        "interview_length": "انٹرویو کا دورانیہ",
        "length_desc": "آپ اس سیشن کو کتنا طویل رکھنا چاہیں گے؟",
        "brief": "مختصر",
        "brief_desc": "~5 منٹ · فوری مشق کا دور",
        "medium": "درمیانہ",
        "medium_desc": "~10 منٹ · متوازن سیشن",
        "lengthy": "طویل",
        "lengthy_desc": "20+ منٹ · مکمل انٹرویو کا تجربہ",
        "no_limit": "کوئی حد نہیں",
        "workspace_sandbox": "کام کی جگہ کا سینڈ باکس",
        "coding_sandbox": "کوڈنگ سینڈ باکس",
        "ready": "تیار",
        "need_hint": "کیا آپ کو کوئی اشارہ چاہیے؟",
        "get_hint": "اشارہ حاصل کریں",
        "req_hint": "سقراطی اشارہ کی درخواست کریں",
        "calibration": "مشق کی ترتیب",
        "show_settings": "ترتیبات دکھائیں",
        "hide_settings": "ترتیبات چھپائیں",
        "model": "انٹرویو کا ماڈل",
        "voice": "آواز کا انجن"
      },
      "es-ES": {
        "active": "Sesión de práctica activa",
        "session_id": "ID de sesión",
        "type": "Tipo",
        "language": "Idioma",
        "connection": "Conexión",
        "stable": "Estable",
        "title": "Entrevistador de voz de IA",
        "profile": "Perfil del candidato",
        "pace": "Ritmo de voz",
        "fillers": "Muletillas detectadas",
        "detected": "Detectado",
        "analyzer": "Analizador de respuestas",
        "insights": "Información en vivo",
        "situation": "Situación",
        "task": "Tarea",
        "action": "Acción",
        "result": "Resultado",
        "evaluation_insights": "Análisis de evaluación",
        "default_feedback": "Comienza a responder las preguntas de comportamiento para iniciar el análisis.",
        "start_session": "Iniciar sesión de voz",
        "connecting": "Conectando...",
        "end_session": "Finalizar sesión de práctica",
        "interview_length": "Duración de la entrevista",
        "length_desc": "¿Cuánto tiempo te gustaría que dure esta sesión?",
        "brief": "Breve",
        "brief_desc": "~5 minutos · Ronda de práctica rápida",
        "medium": "Medio",
        "medium_desc": "~10 minutos · Sesión equilibrada",
        "lengthy": "Largo",
        "lengthy_desc": "20+ minutos · Experiencia completa de entrevista",
        "no_limit": "Sin límite",
        "workspace_sandbox": "Sandbox del espacio de trabajo",
        "coding_sandbox": "Sandbox de código",
        "ready": "Listo",
        "need_hint": "¿Necesitas una pista?",
        "get_hint": "Obtener pista",
        "req_hint": "Solicitar pista socrática",
        "calibration": "Calibración de práctica",
        "show_settings": "Mostrar configuración",
        "hide_settings": "Ocultar configuración",
        "model": "Modelo de entrevista",
        "voice": "Motor de voz"
      },
      "fr-FR": {
        "active": "Session de pratique active",
        "session_id": "ID de session",
        "type": "Type",
        "language": "Langue",
        "connection": "Connexion",
        "stable": "Stable",
        "title": "Interviewer vocal IA",
        "profile": "Profil du candidat",
        "pace": "Rythme de parole",
        "fillers": "Tics de langage détectés",
        "detected": "Détecté",
        "analyzer": "Analyseur de réponse",
        "insights": "Aperçu en direct",
        "situation": "Situation",
        "task": "Tâche",
        "action": "Action",
        "result": "Résultat",
        "evaluation_insights": "Analyses d'évaluation",
        "default_feedback": "Commencez à répondre aux questions comportementales pour lancer l'analyse.",
        "start_session": "Démarrer la session vocale",
        "connecting": "Connexion...",
        "end_session": "Terminer la session",
        "interview_length": "Durée de l'entretien",
        "length_desc": "Combien de temps souhaitez-vous que cette session dure ?",
        "brief": "Court",
        "brief_desc": "~5 minutes · Entraînement rapide",
        "medium": "Moyen",
        "medium_desc": "~10 minutes · Session équilibrée",
        "lengthy": "Long",
        "lengthy_desc": "20+ minutes · Entretien complet",
        "no_limit": "Pas de limite",
        "workspace_sandbox": "Bac à sable de rédaction",
        "coding_sandbox": "Bac à sable de codage",
        "ready": "Prêt",
        "need_hint": "Besoin d'un indice ?",
        "get_hint": "Obtenir un indice",
        "req_hint": "Demander un indice socratique",
        "calibration": "Configuration",
        "show_settings": "Afficher les paramètres",
        "hide_settings": "Masquer les paramètres",
        "model": "Modèle d'entretien",
        "voice": "Moteur vocal"
      }
    };

    const t = (key: string): string => {
      const lang = selectedLanguage;
      if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
      }
      // Fallback translation table to English default mappings
      const defaults: Record<string, string> = {
        "active": "Practice Session Active",
        "session_id": "Session ID",
        "type": "Type",
        "language": "Language",
        "connection": "Connection",
        "stable": "Stable",
        "title": "AI Voice Interviewer",
        "profile": "Candidate Profile",
        "pace": "Speaking Pace",
        "fillers": "Fillers Detected",
        "detected": "Live Insights",
        "analyzer": "Response Analyzer",
        "insights": "Live Insights",
        "situation": "Situation",
        "task": "Task",
        "action": "Action",
        "result": "Result",
        "evaluation_insights": "Evaluation Insights",
        "default_feedback": "Begin answering the behavioral questions to start analysis.",
        "start_session": "Start Voice Session",
        "connecting": "Connecting...",
        "end_session": "End Practice Session",
        "interview_length": "Interview Length",
        "length_desc": "How long would you like this session to be?",
        "brief": "Brief",
        "brief_desc": "~5 minutes · Quick practice round",
        "medium": "Medium",
        "medium_desc": "~10 minutes · Balanced session",
        "lengthy": "Lengthy",
        "lengthy_desc": "20+ minutes · Full interview experience",
        "no_limit": "No limit",
        "workspace_sandbox": "Workspace Sandbox",
        "coding_sandbox": "Coding Sandbox",
        "ready": "Ready",
        "need_hint": "Need a hint?",
        "get_hint": "Get Hint",
        "req_hint": "Request Socratic Hint",
        "calibration": "Practice Calibration",
        "show_settings": "Show Settings",
        "hide_settings": "Hide Settings",
        "model": "Interview Model",
        "voice": "Speech Engine Voice"
      };
      return defaults[key] || key;
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
                <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-1">{t("interview_length")}</h2>
                <p className="text-[11px] text-zinc-500 mb-6">{t("length_desc")}</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => startCallWithDuration("brief")}
                    className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-left">
                      <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-emerald-300 transition-colors">{t("brief")}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{t("brief_desc")}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">5 min</span>
                  </button>
                  <button
                    onClick={() => startCallWithDuration("medium")}
                    className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-amber-500/40 hover:bg-amber-950/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-left">
                      <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">{t("medium")}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{t("medium_desc")}</div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">10 min</span>
                  </button>
                  <button
                    onClick={() => startCallWithDuration("lengthy")}
                    className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-left">
                      <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-violet-300 transition-colors">{t("lengthy")}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{t("lengthy_desc")}</div>
                    </div>
                    <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">{t("no_limit")}</span>
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
                {t("active")}
              </span>
            </div>

            <div className="flex gap-6 items-center text-zinc-500 text-[11px] font-semibold">
              <div className="max-sm:hidden">
                <span className="text-zinc-600 mr-1.5">{t("language")}:</span>
                <span className="text-sky-300 font-bold">{currentLangConfig.name.split(" (")[0]}</span>
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
                <span className="text-zinc-600 mr-1.5">{t("connection")}:</span>
                <span className="text-emerald-400 font-bold">{t("stable")}</span>
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
                {t("calibration")}
              </h4>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-[10px] font-bold text-white hover:text-zinc-350 cursor-pointer transition-colors duration-200 px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg hover:border-zinc-800 shadow-md uppercase tracking-wider"
              >
                {showSettings ? t("hide_settings") : t("show_settings")}
              </button>
            </div>

            {/* Interview Language — always visible, must be chosen before starting */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Languages className="size-3.5 text-zinc-400" /> {t("language")}
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-zinc-950 text-zinc-100 text-xs rounded-xl p-3 border border-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 outline-none cursor-pointer hover:bg-zinc-900 transition-all font-semibold"
              >
                {interviewLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} {!lang.neuralTTS && "(Browser Voice)"}
                  </option>
                ))}
              </select>
              {!currentLangConfig.neuralTTS && (
                <p className="text-[10px] text-amber-400/80 font-semibold leading-relaxed">
                  This language uses your browser/OS built-in voice for the interviewer. For best results, install the {currentLangConfig.name.split(" ")[0]} voice in your system settings.
                </p>
              )}
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 border-t border-zinc-900 pt-4 overflow-hidden"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Brain className="size-3.5 text-zinc-400" /> {t("model")}
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
                      <Volume2 className="size-3.5 text-zinc-400" /> {t("voice")}
                    </label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="bg-zinc-950 text-zinc-100 text-xs rounded-xl p-3 border border-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 outline-none cursor-pointer hover:bg-zinc-900 transition-all font-semibold"
                    >
                      {selectedLanguage === "ar-SA" ? (
                        <>
                          <option value="groq-abdullah">Abdullah (Male - Natural)</option>
                          <option value="groq-aisha">Aisha (Female - Crisp)</option>
                          <option value="groq-fahad">Fahad (Male - Composed)</option>
                          <option value="groq-sultan">Sultan (Male - Deep)</option>
                          <option value="groq-lulwa">Lulwa (Female - Warm)</option>
                          <option value="groq-noura">Noura (Female - Natural)</option>
                        </>
                      ) : (
                        <>
                          <option value="groq-autumn">Autumn (Female - Natural)</option>
                          <option value="groq-diana">Diana (Female - Crisp)</option>
                          <option value="groq-hannah">Hannah (Female - Warm)</option>
                          <option value="groq-austin">Austin (Male - Business)</option>
                          <option value="groq-daniel">Daniel (Male - Composed)</option>
                          <option value="groq-troy">Troy (Male - Deep)</option>
                        </>
                      )}
                      <option value="local">Local Browser Synthesis</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Mic className="size-3.5 text-zinc-400" /> Speech-to-Text (STT)
                    </label>
                    <select
                      value={selectedStt}
                      onChange={(e) => setSelectedStt(e.target.value as any)}
                      className="bg-zinc-950 text-zinc-100 text-xs rounded-xl p-3 border border-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 outline-none cursor-pointer hover:bg-zinc-900 transition-all font-semibold"
                    >
                      <option value="browser">Browser Web Speech (Free)</option>
                      <option value="whisper-turbo">Whisper Large V3 Turbo (Fast)</option>
                      <option value="whisper-v3">Whisper Large V3 (Accurate)</option>
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
          (codingProblem && showSandbox) ? "lg:grid-cols-12" : "max-w-4xl mx-auto"
        )}>
          
          {/* Left Side: Voice Card, Transcript, STAR Tracker */}
          <div className={cn(
            "flex flex-col gap-4 w-full",
            (codingProblem && showSandbox) ? "lg:col-span-6" : "col-span-1"
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
                    {t("title")}
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
                    {t("profile")}
                  </span>
                </div>

                {/* Dynamic stats tracking */}
                {callStatus === CallStatus.ACTIVE && (
                  <div className="w-full flex flex-col gap-2 mt-1 bg-zinc-950/40 border border-zinc-900/60 p-2.5 rounded-xl">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-zinc-500">{t("pace")}</span>
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
                      <span>{t("fillers")}:</span>
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
                    {activeSessionType ? `${activeSessionType} Evaluation` : t("analyzer")}
                  </h4>
                  <span className="text-[8px] bg-violet-500/10 text-violet-400 font-bold px-2 py-0.5 rounded-full border border-violet-500/25 uppercase tracking-wider">
                    {t("insights")}
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
                    <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">{starChecklist.labels?.situation || t("situation")}</span>
                  </div>
                  
                  {/* Task */}
                  <div className={cn(
                    "p-2.5 rounded-xl border flex flex-col gap-1 items-center justify-center text-center transition-all duration-500 backdrop-blur-md",
                    starChecklist.task 
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-md" 
                      : "bg-zinc-900/10 border-zinc-900 text-zinc-650 hover:border-zinc-800"
                  )}>
                    <CheckCircle2 className={cn("size-3.5 transition-colors duration-500", starChecklist.task ? "text-emerald-400" : "text-zinc-800")} />
                    <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">{starChecklist.labels?.task || t("task")}</span>
                  </div>
                  
                  {/* Action */}
                  <div className={cn(
                    "p-2.5 rounded-xl border flex flex-col gap-1 items-center justify-center text-center transition-all duration-500 backdrop-blur-md",
                    starChecklist.action 
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-md" 
                      : "bg-zinc-900/10 border-zinc-900 text-zinc-650 hover:border-zinc-800"
                  )}>
                    <CheckCircle2 className={cn("size-3.5 transition-colors duration-500", starChecklist.action ? "text-emerald-400" : "text-zinc-800")} />
                    <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">{starChecklist.labels?.action || t("action")}</span>
                  </div>
                  
                  {/* Result */}
                  <div className={cn(
                    "p-2.5 rounded-xl border flex flex-col gap-1 items-center justify-center text-center transition-all duration-500 backdrop-blur-md",
                    starChecklist.result 
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 shadow-md" 
                      : "bg-zinc-900/10 border-zinc-900 text-zinc-650 hover:border-zinc-800"
                  )}>
                    <CheckCircle2 className={cn("size-3.5 transition-colors duration-500", starChecklist.result ? "text-emerald-400" : "text-zinc-800")} />
                    <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">{starChecklist.labels?.result || t("result")}</span>
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
                  <span className="text-violet-400 font-bold uppercase tracking-wider mr-2">{t("evaluation_insights")}:</span>
                  {starChecklist.feedback === "Begin answering the behavioral questions to start analysis." ? t("default_feedback") : starChecklist.feedback}
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
                    {callStatus === "INACTIVE" || callStatus === "FINISHED" ? t("start_session") : t("connecting")}
                  </span>
                </button>
              ) : (
                <button 
                  className="cursor-pointer flex items-center justify-center gap-2 font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-full transition-all duration-300 active:scale-95 border border-rose-500 shadow-xl tracking-wider uppercase hover:shadow-[0_4px_25px_rgba(225,29,72,0.25)]" 
                  onClick={() => handleDisconnect()}
                >
                  <PhoneOff className="size-4.5" /> {t("end_session")}
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Technical Coding Sandbox Redesigned as Premium IDE */}
          {codingProblem && showSandbox && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6 flex flex-col gap-3.5 p-4.5 backdrop-blur-2xl bg-zinc-950/20 rounded-2xl border border-zinc-900 shadow-2xl w-full relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                <h3 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-2">
                  <Code className="size-4.5 text-violet-400" />
                  {codingProblem.language === "text" || codingProblem.language === "markdown" ? t("workspace_sandbox") : t("coding_sandbox")}
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
                    {t("ready")}
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
                            ? t("need_hint") 
                            : t("need_hint")}
                        </span>
                      </div>
                      <Button
                        onClick={requestSocraticHint}
                        className="h-8 text-[9px] font-bold uppercase tracking-wider px-3.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 border border-violet-500/30 cursor-pointer shadow-lg active:scale-95"
                      >
                        {t("get_hint")}
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
                    <Sparkles className="size-3.5 text-violet-400" /> {t("req_hint")}
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
