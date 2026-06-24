"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Code2, 
  FileCode2, 
  Settings, 
  ChevronRight, 
  Copy, 
  Check, 
  Search, 
  ExternalLink,
  Info,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Zap,
  KeyRound,
  FileSpreadsheet,
  HelpCircle,
  BarChart3,
  User,
  Sliders,
  DollarSign,
  CloudLightning,
  ShieldCheck,
  ToggleLeft,
  Users,
  Command,
  Sun,
  Moon,
  Lock,
  Unlock
} from "lucide-react";

type CodeLang = "javascript" | "python" | "curl";
type DocMode = "user" | "developer";

// Bespoke Monochromatic Code Highlighter implementation
// Since standard highlighters are colored, we parse and wrap syntax segments into grayscale tokens manually.
interface CodeBlockProps {
  code: string;
  lang: string;
}

function PremiumCodeBlock({ code, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple monochromatic formatter based on standard JS/Python syntax
  const formatMonochrome = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Highlight comments in light gray
      if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
        return (
          <span key={idx} className="comment text-neutral-450 italic block select-none">
            {line}
          </span>
        );
      }
      
      // Inline word highlighting rules (variables, functions, keywords, strings)
      // Break down the line into segments or just render grayscale styled texts.
      // This achieves high-contrast premium code visuals.
      return (
        <span key={idx} className="default-line block text-neutral-800">
          {line.split(/(\s+)/).map((part, pIdx) => {
            const trimmed = part.trim();
            if (["const", "let", "var", "import", "export", "async", "await", "function", "return", "class", "def", "from", "while", "if", "for", "in"].includes(trimmed)) {
              return <span key={pIdx} className="keyword font-extrabold text-black">{part}</span>;
            }
            if (trimmed.startsWith('"') || trimmed.startsWith("'") || trimmed.startsWith("`")) {
              return <span key={pIdx} className="string text-neutral-500 font-medium">{part}</span>;
            }
            if (trimmed.match(/^\d+$/)) {
              return <span key={pIdx} className="number text-neutral-600 font-mono">{part}</span>;
            }
            return <span key={pIdx} className="default-segment">{part}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <div className="premium-code-block-outer group relative border border-neutral-200/80 bg-neutral-50/50 rounded-lg overflow-hidden my-4">
      <div className="premium-code-block-header bg-neutral-100/60 border-b border-neutral-200/80 px-4 py-2 flex items-center justify-between text-[10px] font-bold tracking-wider text-neutral-500 uppercase font-mono">
        <span>{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-black transition-colors cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1 text-black font-extrabold"
              >
                <Check className="size-3" /> Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Copy className="size-3" /> Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <div className="premium-code-block-pre p-4 overflow-x-auto bg-[#FFFFFF] font-mono text-[11px] leading-relaxed flex">
        <div className="premium-code-block-lines pr-4 border-r border-neutral-100 text-neutral-300 text-right select-none w-8 shrink-0">
          {code.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="pl-4 flex-1 whitespace-pre">{formatMonochrome(code)}</pre>
      </div>
    </div>
  );
}

export default function DocumentationPage() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (process.env.NODE_ENV === "production" && !isSignedIn && !hostname.startsWith("docs.")) {
        window.location.href = "https://docs.mockrithm.me";
      }
    }
  }, [isLoaded, isSignedIn]);

  const [docMode, setDocMode] = useState<DocMode | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CodeLang>("javascript");
  const [feedbackGiven, setFeedbackGiven] = useState<"yes" | "no" | null>(null);
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [sidebarLocked, setSidebarLocked] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const mainContentRef = useRef<HTMLDivElement>(null);

  // Force restore mouse cursor visibility on documentation page
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "force-show-default-cursor-docs";
    styleEl.innerHTML = `
      * {
        cursor: auto !important;
      }
      a, button, [role="button"], select, input, textarea, [data-magnetic] {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      styleEl.remove();
    };
  }, []);

  // Initialize mode from sessionStorage
  useEffect(() => {
    const savedMode = sessionStorage.getItem("mockrithm_docs_mode") as DocMode | null;
    if (savedMode === "user" || savedMode === "developer") {
      setDocMode(savedMode);
      setActiveSection(savedMode === "user" ? "user-interviews" : "intro");
    } else {
      setShowModal(true);
    }
  }, []);

  // Listen for Command Palette hotkey Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCmdPalette((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectMode = (mode: DocMode) => {
    setDocMode(mode);
    sessionStorage.setItem("mockrithm_docs_mode", mode);
    setActiveSection(mode === "user" ? "user-interviews" : "intro");
    setShowModal(false);
  };

  const codeSnippets = {
    authSync: {
      javascript: `// app/api/auth/sync/route.ts
import { db } from "@/firebase/admin";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const userRef = db.collection("users").doc(user.id);
  await userRef.set({
    email: user.emailAddresses[0].emailAddress,
    name: \`\${user.firstName || ""} \${user.lastName || ""}\`.trim(),
    avatarUrl: user.imageUrl,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  return NextResponse.json({ success: true });
}`,
      python: `# auth_sync.py
import firebase_admin
from firebase_admin import credentials, firestore
from clerk_sdk import Clerk

cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def sync_clerk_user_to_firestore(user_id):
    clerk_client = Clerk(bearer_token="sk_test_...")
    user = clerk_client.users.get_user(user_id)
    
    user_ref = db.collection("users").document(user_id)
    user_ref.set({
        "email": user.email_addresses[0].email_address,
        "name": f"{user.first_name} {user.last_name}",
        "avatarUrl": user.image_url,
        "updatedAt": firestore.SERVER_TIMESTAMP
    }, merge=True)
    return {"success": True}`,
      curl: `# Fetch Clerk User & Sync Session
curl -X POST https://api.mockrithm.me/v1/auth/sync \\
  -H "Authorization: Bearer clk_sec_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "user_2Tsh3K8p..."
  }'`
    },
    voiceEngine: {
      javascript: `// components/InterviewWS.tsx
const socket = new WebSocket("wss://api.mockrithm.me/v1/voice/stream");

socket.onopen = () => {
  // Start stream configuration
  socket.send(JSON.stringify({
    event: "start",
    streamSid: "session_abc123",
    voiceId: "eleven_rachel",
    pacingLimit: { min: 110, max: 165 }
  }));
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.event === "transcript") {
    console.log("Real-time transcript:", message.text);
    console.log("Filler word counts:", message.analytics.fillers);
  }
};`,
      python: `# voice_agent.py
import asyncio
import websockets
import json

async def stream_audio_session():
    uri = "wss://api.mockrithm.me/v1/voice/stream"
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps({
            "event": "start",
            "streamSid": "session_abc123",
            "voiceId": "eleven_rachel"
        }))
        while True:
            response = await websocket.recv()
            data = json.loads(response)
            if data["event"] == "transcript":
                print(f"Transcript: {data['text']}")

asyncio.run(stream_audio_session())`,
      curl: `# Initiate voice handshake
wscat -c wss://api.mockrithm.me/v1/voice/stream \\
  -H "Authorization: Bearer wss_token_..."`
    }
  };

  const additionalSections = [
    // 15 Developer Track Sections
    {
      id: "dev-middleware",
      title: "Routing & Middleware Architecture",
      category: "Developer Reference",
      icon: Layers,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Routing</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Routing & Middleware</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Next.js routing uses the Clerk Middleware to intercept API routes and protected page views. Subdomain mappings (e.g. docs.mockrithm.me) are dynamically resolved in the root middleware file.
          </p>
        </div>
      )
    },
    {
      id: "dev-groq",
      title: "Groq LLM Configuration",
      category: "Developer Reference",
      icon: Cpu,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Groq API</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Groq LLM Setup</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            We use Llama-3.3-70b-versatile via Groq for high-speed structural parsing. Make sure the api keys are configured in local env settings.
          </p>
        </div>
      )
    },
    {
      id: "dev-gemini",
      title: "Gemini LLM Configuration",
      category: "Developer Reference",
      icon: Sparkles,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Google AI</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Gemini LLM Setup</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Gemini-2.0-flash-001 and Gemini-2.5-flash are set up as secondary fallback endpoints, utilizing Vercel AI SDK schemas.
          </p>
        </div>
      )
    },
    {
      id: "dev-elevenlabs",
      title: "ElevenLabs API Integration",
      category: "Developer Reference",
      icon: Zap,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Voice Synthesizer</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">ElevenLabs Audio Setup</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            The live speech engine synthesizes agent responses. It maps specific voice configurations and streaming bitrates.
          </p>
        </div>
      )
    },
    {
      id: "dev-vapi",
      title: "Vapi Custom Telephony",
      category: "Developer Reference",
      icon: CloudLightning,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Telephony Engine</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Vapi Telephony API</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Vapi telephone agents are generated programmatically using API triggers. Webhook calls verify connection metadata.
          </p>
        </div>
      )
    },
    {
      id: "dev-stripe-webhooks",
      title: "Stripe Billing Webhooks",
      category: "Developer Reference",
      icon: FileCode2,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Payment Logs</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Stripe Webhooks Configuration</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Configures Stripe event signatures verification to validate purchases and upgrades before writing changes to Firestore.
          </p>
        </div>
      )
    },
    {
      id: "dev-clerk-webhooks",
      title: "Clerk Webhook Integrations",
      category: "Developer Reference",
      icon: KeyRound,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Authentication</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Clerk Webhooks</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Listens for Clerk account creation events to automatically provision profiles inside the Firestore user collections database.
          </p>
        </div>
      )
    },
    {
      id: "dev-design-system",
      title: "Tailwind CSS Design System",
      category: "Developer Reference",
      icon: Sliders,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Styles</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Design System Configuration</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Contains color configuration schemas, layouts, typography styling configurations, and spacing tokens in global css rules.
          </p>
        </div>
      )
    },
    {
      id: "dev-three-bloom",
      title: "Three.js WebGL Bloom Pass",
      category: "Developer Reference",
      icon: Settings,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">WebGL</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">WebGL Unreal Bloom Effects</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Enables high-performance edge glow on meshes via post-processing UnrealBloomPass and EffectComposer setups.
          </p>
        </div>
      )
    },
    {
      id: "dev-three-shaders",
      title: "WebGL Noise Vertex Shaders",
      category: "Developer Reference",
      icon: Code2,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Shaders</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Deformation Shaders</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Implements 3D simplex noise algorithm in glsl to deform the knot centerpiece and animate particle explosion vectors.
          </p>
        </div>
      )
    },
    {
      id: "dev-gsap-pinning",
      title: "GSAP Stacked Pinning Triggers",
      category: "Developer Reference",
      icon: ToggleLeft,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">GSAP</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">GSAP Scroll Pinning</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Pins stage components and coordinates scrolling transitions. The container stays fixed during active cards triggers.
          </p>
        </div>
      )
    },
    {
      id: "dev-lenis",
      title: "Lenis Smooth Scroll Pipeline",
      category: "Developer Reference",
      icon: Sliders,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Smooth Scroll</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Lenis Smooth Scroll</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Normalizes wheel event animations across platforms, enabling responsive scroll triggers.
          </p>
        </div>
      )
    },
    {
      id: "dev-star-grading",
      title: "Structured STAR Grading Engine",
      category: "Developer Reference",
      icon: ShieldCheck,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Grading</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">STAR Grading Schema</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Evaluates the transcript dynamically, validating structural markers for Situation, Task, Action, and Result formats.
          </p>
        </div>
      )
    },
    {
      id: "dev-ats-pdf",
      title: "ATS Parser PDF Extractors",
      category: "Developer Reference",
      icon: FileSpreadsheet,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Parser</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">ATS Resume Extraction</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Extracts data from uploaded resumes and parses it into compliant JSON structures using client-side parsing engines.
          </p>
        </div>
      )
    },
    {
      id: "dev-deploy",
      title: "Production Deployment & CI",
      category: "Developer Reference",
      icon: Terminal,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">CI/CD</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Deploy & CI Setup</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Deployment configurations target Vercel hosting using automated Github hooks. Environment variables sync keys securely.
          </p>
        </div>
      )
    },
    // 15 User Track Sections
    {
      id: "user-audio",
      title: "Audio Connection & Troubleshoot",
      category: "User Manual",
      icon: HelpCircle,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Troubleshoot</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Audio Troubleshooting</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Resolve microphone block settings, set noise suppression values, and test latency variables before launching voice sessions.
          </p>
        </div>
      )
    },
    {
      id: "user-wpm",
      title: "Real-Time WPM Metrics",
      category: "User Manual",
      icon: BarChart3,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">WPM</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Words Per Minute Metrics</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            The pacing engine scores WPM rates in real time. Maintain between 120-150 WPM to score in the optimal range.
          </p>
        </div>
      )
    },
    {
      id: "user-fillers",
      title: "Vocal Fillers Audits",
      category: "User Manual",
      icon: Sliders,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Filler Words</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Filler Words Tracking</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Monitors usage of keywords like 'um', 'ah', 'like', and 'basically'. Reducing fillers increases confidence score metrics.
          </p>
        </div>
      )
    },
    {
      id: "user-star",
      title: "STAR Method Structuring",
      category: "User Manual",
      icon: ShieldCheck,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">STAR Method</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">STAR Structure Guide</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Format answers into Situation (context), Task (goal), Action (what you did), and Result (outcomes and metrics).
          </p>
        </div>
      )
    },
    {
      id: "user-reports",
      title: "Dashboard Career Reports",
      category: "User Manual",
      icon: FileSpreadsheet,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Reports</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Dashboard Metrics & Logs</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Review detailed reports on completed mock session logs, transcribing files, score trends, and AI recommendations.
          </p>
        </div>
      )
    },
    {
      id: "user-resume-templates",
      title: "Resume Templates Selection",
      category: "User Manual",
      icon: Layers,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Templates</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">ATS Template Selection</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Choose from six single-column layouts engineered to pass modern screening engines and algorithms cleanly.
          </p>
        </div>
      )
    },
    {
      id: "user-skills",
      title: "Custom Skills Highlighting",
      category: "User Manual",
      icon: Sparkles,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Skills</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Skills Keywords Setup</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Manage tags to match specific roles keywords. Parsers scan for skill tags to determine compatibility score metrics.
          </p>
        </div>
      )
    },
    {
      id: "user-projects",
      title: "Project Portfolios Details",
      category: "User Manual",
      icon: Code2,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Projects</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Adding Portfolio Highlights</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Include technical project links, repositories, live URLs, and descriptions highlighting key deliverables.
          </p>
        </div>
      )
    },
    {
      id: "user-resume-preview",
      title: "Real-Time Resume HTML Previews",
      category: "User Manual",
      icon: Zap,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Preview</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">HTML Real-Time Previews</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Edit fields on the editor and observe formatting layout updates instantly to ensure proper font styles and alignment.
          </p>
        </div>
      )
    },
    {
      id: "user-billing-plans",
      title: "Stripe Subscriptions Plans",
      category: "User Manual",
      icon: DollarSign,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Plans</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Choosing Upgrade Tiers</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Browse options between Freemium, Premium, and Pro plans. Manage monthly cycles or switch to annual billing inside profile panels.
          </p>
        </div>
      )
    },
    {
      id: "user-payment-methods",
      title: "Stripe Payment Methods",
      category: "User Manual",
      icon: KeyRound,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Security</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Managing Payment Cards</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Upgrade subscriptions securely using Stripe Checkout. Add, update, or remove credit card details within Stripe Portal settings.
          </p>
        </div>
      )
    },
    {
      id: "user-annual-billing",
      title: "Managing Annual Billing Cycles",
      category: "User Manual",
      icon: DollarSign,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Billing</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Annual Billing Upgrades</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Switch from monthly subscriptions to annual billing cycles to secure a 20% discount on Premium and Pro packages.
          </p>
        </div>
      )
    },
    {
      id: "user-support",
      title: "Platform Bug Reports",
      category: "User Manual",
      icon: HelpCircle,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Support</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Bug Reporting & Feedback</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Submit general platform feedback, report connection bugs, and communicate with admins through the support portal contact forms.
          </p>
        </div>
      )
    },
    {
      id: "user-settings",
      title: "Account Settings & Deletion",
      category: "User Manual",
      icon: Settings,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Account</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Identity Data Management</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            Manage your authenticated email addresses, profile photo, and password configurations, or request permanent deletion of details.
          </p>
        </div>
      )
    },
    {
      id: "user-privacy",
      title: "Security & Privacy Practices",
      category: "User Manual",
      icon: ShieldCheck,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Data Security</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Privacy Policies & Encryption</h3>
          </div>
          <p className="text-[14px] text-neutral-605 leading-relaxed font-normal">
            All transcripts, ratings, and resumes are protected in Firestore using database security rules and transmission encryption parameters.
          </p>
        </div>
      )
    }
  ];

  const sections = [
    ...additionalSections,
    // --- Getting Started (Developer Only) ---
    {
      id: "intro",
      title: "Introduction",
      category: "Getting Started",
      icon: BookOpen,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Overview</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Introduction</h3>
          </div>
          
          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Welcome to the official documentation for <strong className="text-black font-semibold">Mockrithm</strong>, an advanced AI-powered career training framework. Mockrithm utilizes a dual-layer architecture, combining static marketing features with protected dashboard widgets.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 my-6">
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-6 rounded-lg border border-neutral-200/80 bg-neutral-50/50 space-y-4 hover:border-black transition-all duration-200"
            >
              <div className="size-8 rounded bg-black flex items-center justify-center text-white">
                <Layers className="size-4" />
              </div>
              <h4 className="text-sm font-extrabold text-black uppercase tracking-wider">Layer 1: Public Base</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Fast static visitors layer. Delivers pages containing capability descriptions, pricing options, articles, and documentation.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="p-6 rounded-lg border border-neutral-200/80 bg-neutral-50/50 space-y-4 hover:border-black transition-all duration-200"
            >
              <div className="size-8 rounded bg-black flex items-center justify-center text-white">
                <Zap className="size-4" />
              </div>
              <h4 className="text-sm font-extrabold text-black uppercase tracking-wider">Layer 2: Private Dashboard</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Protected user cockpit. Integrates Clerk login, WebSockets audio sessions, resume tailors, and payment systems.
              </p>
            </motion.div>
          </div>

          <div className="p-4 rounded-lg border border-neutral-200/80 bg-neutral-50/50 flex gap-4 items-start">
            <Info className="size-5 text-black shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-neutral-600">
              <strong className="text-black">API Core URL:</strong> Sandbox actions point to <code className="bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded text-black font-mono text-[10px]">sandbox.api.mockrithm.me</code>. Production releases leverage sharded cloud nodes.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "quickstart",
      title: "Setup & Secrets",
      category: "Getting Started",
      icon: Terminal,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Initialization</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Setup & Secrets</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Deploy the environment locally by generating a local environment configuration file.
          </p>

          <PremiumCodeBlock 
            lang=".env.local"
            code={`# Clerk Identity Setup
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Firebase Cloud Connection
FIREBASE_PROJECT_ID=mockrithm-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."

# Payments Config
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...`}
          />
        </div>
      ),
    },

    // --- User Manual (User Only) ---
    {
      id: "user-interviews",
      title: "Voice Practice Guide",
      category: "User Manual",
      icon: HelpCircle,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">How it Works</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Voice Practice Guide</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Mockrithm's audio core conducts dynamic, conversational mock interviews using your microphone. Learn how to launch your session:
          </p>

          <div className="space-y-4">
            <div className="p-5 rounded-lg border border-neutral-200/80 bg-neutral-50/30">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">Step 1: Check Microphone Permissions</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                When starting an interview, click "Allow" on the browser audio pop-up. The framework uses a sample rate of 16kHz for clean audio transmission.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-neutral-200/80 bg-neutral-50/30">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">Step 2: Respond naturally</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Our AI agent listens for brief pauses. Keep your speech smooth. If you stop speaking, the agent will analyze your input and reply.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-neutral-200/80 bg-neutral-50/30">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">Step 3: Complete & Review</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Once the assessment ends, click "Finalize Interview" to generate your detailed feedback scores.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "user-scores",
      title: "Feedback & Telemetry",
      category: "User Manual",
      icon: BarChart3,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Metrics Guide</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Feedback & Telemetry</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            After each session, you will receive score metrics. Below is an explanation of what the telemetry parameters track:
          </p>

          <div className="border border-neutral-200/80 rounded-lg overflow-hidden mt-4 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Metric</th>
                  <th className="p-4">Optimal range</th>
                  <th className="p-4">Evaluation Goal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr className="hover:bg-neutral-50/30 transition-colors">
                  <td className="p-4 text-black font-extrabold">Pacing Speed (WPM)</td>
                  <td className="p-4 text-neutral-800 font-mono font-bold">120 - 150 WPM</td>
                  <td className="p-4 text-neutral-500 font-normal">Ensures you speak at a clear, professional speed.</td>
                </tr>
                <tr className="hover:bg-neutral-50/30 transition-colors">
                  <td className="p-4 text-black font-extrabold">Vocal Filler Words</td>
                  <td className="p-4 text-neutral-800 font-mono font-bold">&lt; 3 per answer</td>
                  <td className="p-4 text-neutral-500 font-normal">Tracks vocal halts (like 'um', 'like', 'ah') to clean up communication.</td>
                </tr>
                <tr className="hover:bg-neutral-50/30 transition-colors">
                  <td className="p-4 text-black font-extrabold">STAR Method Score</td>
                  <td className="p-4 text-neutral-800 font-mono font-bold">&gt; 85% Match</td>
                  <td className="p-4 text-neutral-500 font-normal">Evaluates if your answer covers Situation, Task, Action, and Result.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "user-resumes",
      title: "ATS Resume Builder",
      category: "User Manual",
      icon: Sparkles,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Templates & Editing</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">ATS Resume Builder</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Corporate screening software uses automated parsers to read credentials. Mockrithm includes resume builder features to format templates.
          </p>

          <div className="p-4 rounded-lg border border-neutral-200/80 bg-neutral-50/50 flex gap-4 items-start">
            <Lightbulb className="size-5 text-black shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-neutral-600">
              <strong className="text-black">Design Rule:</strong> Use single-column layouts. Multicolumn designs confuse parsing software and could lead to auto-rejection.
            </div>
          </div>

          <ul className="space-y-3 pl-4 text-xs text-neutral-600 list-none">
            <li className="flex items-start gap-3">
              <span className="inline-block size-1.5 rounded-full bg-black shrink-0 mt-1.5" />
              <span><strong className="text-black font-semibold">Live HTML Editor:</strong> Modify fields in real time to see formatting updates immediately.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block size-1.5 rounded-full bg-black shrink-0 mt-1.5" />
              <span><strong className="text-black font-semibold">JSON Data Export:</strong> Save data in a clean schema to download or port anywhere.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block size-1.5 rounded-full bg-black shrink-0 mt-1.5" />
              <span><strong className="text-black font-semibold">Clean Export:</strong> Export files in clean print layouts without rendering issues.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "user-billing",
      title: "Billing & Plans",
      category: "User Manual",
      icon: DollarSign,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Billing Cycles</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Billing & Plans</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Mockrithm supports three tiers. You can choose to bill monthly or select annual billing to save 20%.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 my-6">
            <div className="p-5 rounded-lg border border-neutral-200/80 bg-[#FFFFFF] space-y-2">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Tier 1</span>
              <h4 className="text-sm font-extrabold text-black uppercase">Freemium</h4>
              <p className="text-xs text-neutral-500">1 AI Voice session, standard pacing feedback.</p>
            </div>
            <div className="p-5 rounded-lg border border-black bg-[#FFFFFF] space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">Popular</div>
              <span className="text-[9px] font-bold text-neutral-455 uppercase tracking-wider font-mono">Tier 2</span>
              <h4 className="text-sm font-extrabold text-black uppercase">Premium</h4>
              <p className="text-xs text-neutral-500">$10/mo. Unlimited voices, 6 templates, fillers.</p>
            </div>
            <div className="p-5 rounded-lg border border-neutral-200/80 bg-[#FFFFFF] space-y-2">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Tier 3</span>
              <h4 className="text-sm font-extrabold text-black uppercase">Pro</h4>
              <p className="text-xs text-neutral-500">$25/mo. System designer, custom templates, API.</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-neutral-200/80 bg-neutral-50/50 flex gap-4 items-start">
            <Info className="size-5 text-black shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-neutral-600">
              <strong className="text-black">Managing Subscription:</strong> Upgrade or cancel subscription parameters inside your Account Settings panel under "Billing & Subscription".
            </div>
          </div>
        </div>
      ),
    },

    // --- Developer Reference (Developer Only) ---
    {
      id: "dev-sync",
      title: "Clerk & Firebase Sync",
      category: "Developer Reference",
      icon: KeyRound,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Database Integration</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Clerk & Firebase Sync</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Mockrithm syncs profile sessions between Clerk auth rules and the Firestore database structure.
          </p>

          <div className="border border-neutral-200/80 rounded-lg overflow-hidden mt-4">
            <div className="bg-neutral-50 border-b border-neutral-200/80 px-4 py-2.5 flex items-center justify-between">
              <div className="flex gap-1">
                {(["javascript", "python", "curl"] as CodeLang[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                      activeTab === lang 
                        ? "bg-black text-white" 
                        : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                    }`}
                  >
                    {lang === "javascript" ? "Next.js" : lang === "python" ? "Python SDK" : "cURL"}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[#FFFFFF]">
              <PremiumCodeBlock 
                lang={activeTab === "javascript" ? "nextjs" : activeTab === "python" ? "python" : "curl"} 
                code={codeSnippets.authSync[activeTab]} 
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dev-websockets",
      title: "Audio WebSockets Stream",
      category: "Developer Reference",
      icon: Cpu,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">WebSocket Handshakes</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Audio WebSockets Stream</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Streaming uses full-duplex WebSockets. Read the client implementation patterns below:
          </p>

          <div className="border border-neutral-200/80 rounded-lg overflow-hidden mt-4">
            <div className="bg-neutral-50 border-b border-neutral-200/80 px-4 py-2.5 flex items-center justify-between">
              <div className="flex gap-1">
                {(["javascript", "python", "curl"] as CodeLang[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                      activeTab === lang 
                        ? "bg-black text-white" 
                        : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                    }`}
                  >
                    {lang === "javascript" ? "Web Client" : lang === "python" ? "Python Client" : "cURL CLI"}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[#FFFFFF]">
              <PremiumCodeBlock 
                lang={activeTab === "javascript" ? "websocket" : activeTab === "python" ? "python" : "curl"} 
                code={codeSnippets.voiceEngine[activeTab]} 
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dev-ats-rules",
      title: "ATS Schema Rules",
      category: "Developer Reference",
      icon: Sliders,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">ATS Specifications</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">ATS Schema Rules</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            ATS parsing templates use strict schemas. Ensure data schemas follow the structure below:
          </p>

          <PremiumCodeBlock 
            lang="typescript"
            code={`interface ResumeData {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    githubUrl?: string;
  };
  experience: Array<{
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
}`}
          />
        </div>
      ),
    },
    {
      id: "dev-stripe",
      title: "Stripe & Webhooks",
      category: "Developer Reference",
      icon: FileCode2,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Payment Routing</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Stripe & Webhooks</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Transactions redirect customers to Stripe. Once complete, Stripe redirects verification calls back to the application.
          </p>

          <div className="p-4 rounded-lg border border-neutral-200/80 bg-neutral-50/50 flex gap-4 items-start">
            <AlertTriangle className="size-5 text-black shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-neutral-600">
              <strong className="text-black">Security Tip:</strong> Verify signatures inside checkout webhook callbacks (<code className="bg-neutral-100 border border-neutral-200 px-1 py-0.5 rounded text-black font-mono">checkout.session.completed</code>) before upgrading databases.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dev-admin",
      title: "Admin Panel Controls",
      category: "Developer Reference",
      icon: ShieldCheck,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Admin Panel Options</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Admin Panel Controls</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            The admin page dashboard tracks platform operations. Features include:
          </p>

          <ul className="space-y-3 pl-4 text-xs text-neutral-600 list-none">
            <li className="flex items-start gap-3">
              <span className="inline-block size-1.5 rounded-full bg-black shrink-0 mt-1.5" />
              <span><strong className="text-black font-semibold">Users Management:</strong> View roles, configure tiers, delete test account parameters.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block size-1.5 rounded-full bg-black shrink-0 mt-1.5" />
              <span><strong className="text-black font-semibold">Audits Logs:</strong> Monitor general site feedback and specific interview feedback logs.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block size-1.5 rounded-full bg-black shrink-0 mt-1.5" />
              <span><strong className="text-black font-semibold">Blog Publishing Engine:</strong> Publish new technical resources directly to Firestore.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "dev-db-schema",
      title: "Firestore Database Architecture",
      category: "Developer Reference",
      icon: FileSpreadsheet,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Data Modeling</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Firestore Database Architecture</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            Mockrithm leverages Google Cloud Firestore as its primary serverless document store. Below is the comprehensive schema guide for the key collections used in the platform:
          </p>

          <div className="space-y-6">
            <div className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/30 space-y-3">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">1. Users Collection (`/users`)</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Stores root-level user metadata and configuration. User IDs match Clerk authenticated IDs exactly.
              </p>
              <PremiumCodeBlock 
                lang="Schema"
                code={`{
  "id": "user_clerkId...", // Match Clerk Auth ID
  "name": "Muhammad Ali",
  "email": "ali@example.com",
  "role": "Admin" | "User",
  "status": "Active" | "Suspended",
  "country": "US",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}`}
              />
            </div>

            <div className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/30 space-y-3">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">2. Resumes Subcollection (`/users/{"{userId}"}/resumes`)</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Contains the parsed and template-based resume documents for each individual candidate.
              </p>
              <PremiumCodeBlock 
                lang="Schema"
                code={`{
  "userId": "user_clerkId...",
  "fileName": "Software_Engineer_CV.pdf",
  "rawText": "Extracted text content...",
  "createdAt": "2026-06-24T22:37:51.000Z",
  "parsedData": {
    "basics": { "name": "...", "label": "...", "email": "...", "phone": "...", "summary": "..." },
    "work": [{ "company": "...", "role": "...", "startDate": "...", "endDate": "...", "highlights": ["..."] }],
    "education": [{ "institution": "...", "studyType": "...", "area": "...", "score": "..." }],
    "skills": ["TypeScript", "Next.js", "Python"],
    "projects": [{ "name": "...", "description": "...", "url": "..." }],
    "templateId": "ATS-Template-V1"
  },
  "atsAnalysis": {
    "score": 85,
    "parsingSuccess": true,
    "issues": ["Missing GitHub link", "Summary too short"]
  }
}`}
              />
            </div>

            <div className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/30 space-y-3">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">3. Interviews Collection (`/interviews`)</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Logs voice assessment sessions, their current parameters, and live status.
              </p>
              <PremiumCodeBlock 
                lang="Schema"
                code={`{
  "id": "interview_session_id...",
  "userId": "user_clerkId...",
  "role": "Frontend Engineer",
  "experience": "Senior",
  "questions": ["Explain React Server Components", "Design a custom hook..."],
  "transcript": [
    { "role": "interviewer", "content": "Welcome! Tell me about React Server Components." },
    { "role": "candidate", "content": "RSCs run on the server side..." }
  ],
  "finalized": true,
  "createdAt": Timestamp
}`}
              />
            </div>

            <div className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/30 space-y-3">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">4. Interview Feedback Collection (`/interviewsfeedback`)</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Stores parsed LLM response metrics, comment suggestions, pacing metrics, and vocal filler count structures.
              </p>
              <PremiumCodeBlock 
                lang="Schema"
                code={`{
  "interviewId": "interview_id...",
  "userId": "user_clerkId...",
  "candidateName": "Ali",
  "email": "ali@example.com",
  "totalScore": 88,
  "categoryScores": [
    { "name": "Communication Skills", "score": 90, "comment": "Clear speech pattern." },
    { "name": "Technical Knowledge", "score": 85, "comment": "Good grasp of hydration..." }
  ],
  "strengths": ["Clear articulation", "Structured STAR methodology"],
  "areasForImprovement": ["Slowing down pacing during complex system explanations"],
  "finalAssessment": "Strong candidate. Focus on polishing system design details.",
  "averageWpm": 132,
  "topFillerWords": ["like", "um"],
  "createdAt": Timestamp
}`}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dev-ai-engine",
      title: "AI Feedback & LLM Engine",
      category: "Developer Reference",
      icon: Cpu,
      mode: "developer",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Engine Core</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">AI Feedback & LLM Engine</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            The candidate assessment engine operates as a hybrid pipeline using Groq and Gemini models.
          </p>

          <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
            <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">Execution Pipeline Steps</h4>
            <ol className="list-decimal pl-4 space-y-2">
              <li>
                <strong className="text-black">Primary Model Target:</strong> The engine formats full transcript dialogues and makes a high-speed inference call to Groq using the <code className="bg-neutral-100 px-1 py-0.5 rounded text-black font-mono">llama-3.3-70b-versatile</code> model.
              </li>
              <li>
                <strong className="text-black">Zod Schema fallback:</strong> If Groq times out, experiences rate limits, or fails JSON verification, the system falls back to Google's <code className="bg-neutral-100 px-1 py-0.5 rounded text-black font-mono">gemini-2.0-flash-001</code> model using structured schema formatting from the <code className="bg-neutral-100 px-1 py-0.5 rounded text-black font-mono">ai</code> SDK.
              </li>
              <li>
                <strong className="text-black">Profile Customization Loop:</strong> On successful scoring, the engine launches an asynchronous auto-optimization process to update the candidate's profile metrics inside Firestore.
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "user-onboarding",
      title: "Onboarding & Profile Setup",
      category: "User Manual",
      icon: Sliders,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Onboarding Guide</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Onboarding & Profile Setup</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            To start using Mockrithm, complete the onboarding profile initialization. Below is the walkthrough of the process:
          </p>

          <div className="space-y-4">
            <div className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/30">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">1. Template Pick</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Select your base design layout. If you upload a pre-made resume, the parser will map text straight into the editor.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/30">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">2. Industry Focus</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Specify your role target (e.g. Software Engineer, Product Manager, Analyst). The AI interviewer selects questions based on this focus.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "user-resume-export",
      title: "Resume Editor & PDF Export",
      category: "User Manual",
      icon: FileCode2,
      mode: "user",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">Export Guide</div>
            <h3 className="text-4xl font-extrabold tracking-tight text-neutral-900">Resume Editor & PDF Export</h3>
          </div>

          <p className="text-[14px] text-neutral-600 leading-relaxed font-normal">
            The ATS Resume Builder converts inputs to compliant formatting structure.
          </p>

          <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
            <p>
              Once your fields are completed, click <strong className="text-black font-semibold">"Export PDF"</strong> to open the system print prompt:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Set destination to <strong className="text-black font-semibold">Save as PDF</strong>.</li>
              <li>Disable header and footer parameters.</li>
              <li>Set margins to <strong className="text-black font-semibold">None</strong> or <strong className="text-black font-semibold">Default</strong> for clean borderless prints.</li>
            </ul>
          </div>
        </div>
      ),
    }
  ];

  // Filter sections depending on user role
  const modeSections = sections.filter(sec => !docMode || sec.mode === docMode);
  const categories = Array.from(new Set(modeSections.map((s) => s.category)));
  const filteredSections = modeSections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full flex min-h-screen select-none relative z-10 overflow-hidden font-sans transition-colors duration-300 ${theme === "dark" ? "docs-theme-dark bg-black text-zinc-100" : "bg-[#FFFFFF] text-black"}`}>
      
      {/* Dynamic Style Theme Overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Force dark/black mode styles */
        .docs-theme-dark {
          background-color: #000000 !important;
          color: #e4e4e7 !important; /* zinc-200 */
        }
        .docs-theme-dark a,
        .docs-theme-dark button {
          color: inherit;
        }
        /* Theme-specific background corrections */
        .docs-theme-dark .bg-white,
        .docs-theme-dark .bg-\\[\\#FFFFFF\\] {
          background-color: #09090b !important; /* zinc-950 */
          color: #ffffff !important;
        }
        .docs-theme-dark .bg-neutral-50,
        .docs-theme-dark .bg-neutral-50\\/50 {
          background-color: #09090b !important; /* zinc-950 */
        }
        .docs-theme-dark .bg-neutral-100,
        .docs-theme-dark .bg-neutral-100\\/60 {
          background-color: #18181b !important; /* zinc-900 */
        }
        
        /* Sidebar and Borders */
        .docs-theme-dark aside {
          background-color: #000000 !important;
          border-color: #18181b !important;
        }
        .docs-theme-dark .border-neutral-200,
        .docs-theme-dark .border-neutral-200\\/80,
        .docs-theme-dark .border-neutral-100,
        .docs-theme-dark .border-neutral-150 {
          border-color: #18181b !important; /* zinc-900 */
        }
        
        /* Text colors */
        .docs-theme-dark .text-black,
        .docs-theme-dark .text-neutral-900,
        .docs-theme-dark h1,
        .docs-theme-dark h2,
        .docs-theme-dark h3,
        .docs-theme-dark h4,
        .docs-theme-dark h5,
        .docs-theme-dark h6,
        .docs-theme-dark strong {
          color: #ffffff !important;
        }
        .docs-theme-dark .text-neutral-600,
        .docs-theme-dark .text-neutral-605,
        .docs-theme-dark .text-neutral-500,
        .docs-theme-dark .text-neutral-450 {
          color: #a1a1aa !important; /* zinc-400 */
        }
        
        /* Custom code blocks */
        .docs-theme-dark .premium-code-block-outer {
          border-color: #27272a !important;
          background-color: rgba(24, 24, 27, 0.4) !important;
        }
        .docs-theme-dark .premium-code-block-header {
          background-color: rgba(39, 39, 42, 0.8) !important;
          border-color: #27272a !important;
          color: #a1a1aa !important;
        }
        .docs-theme-dark .premium-code-block-pre {
          background-color: #09090b !important;
        }
        .docs-theme-dark .premium-code-block-lines {
          border-color: #18181b !important;
          color: #52525b !important;
        }
        .docs-theme-dark .premium-code-block-pre .keyword {
          color: #ffffff !important;
        }
        .docs-theme-dark .premium-code-block-pre .string {
          color: #a1a1aa !important;
        }
        .docs-theme-dark .premium-code-block-pre .number {
          color: #d4d4d8 !important;
        }
        .docs-theme-dark .premium-code-block-pre .comment {
          color: #71717a !important;
        }
        .docs-theme-dark .premium-code-block-pre .default-segment {
          color: #e5e5e5 !important;
        }

        /* Hover overrides */
        .docs-theme-dark .hover\\:border-black:hover {
          border-color: #ffffff !important;
        }
        .docs-theme-dark .hover\\:text-black:hover {
          color: #ffffff !important;
        }
        .docs-theme-dark .hover\\:bg-neutral-50:hover {
          background-color: #18181b !important;
        }
        .docs-theme-dark .hover\\:bg-neutral-100\\/60:hover {
          background-color: #27272a !important;
        }
        .docs-theme-dark .bg-black {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
      `}} />
      
      {/* Background Subtle Hairline Separations */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${theme === "dark" ? "bg-[#09090b]/10" : "bg-[#FAFAFA]/50"}`} />

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`relative w-full max-w-xl mx-4 p-8 rounded-lg border shadow-xl space-y-6 overflow-hidden ${
                theme === "dark" ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[#FFFFFF] border-neutral-200/80 text-black"
              }`}
            >
              <div className="text-center space-y-2">
                <span className={`text-[9px] font-bold uppercase tracking-widest border px-3 py-1 rounded ${
                  theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-neutral-50 border-neutral-200 text-neutral-400"
                }`}>Mockrithm Portal</span>
                <h2 className={`text-2xl font-extrabold tracking-tight ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>Choose Documentation Guide</h2>
                <p className={`text-xs max-w-sm mx-auto ${theme === "dark" ? "text-zinc-400" : "text-neutral-500"}`}>Select a track tailored to your role to browse relevant manuals or code instructions.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectMode("user")}
                  className={`group p-5 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between h-48 cursor-pointer ${
                    theme === "dark" ? "border-zinc-800 bg-zinc-900 hover:border-white" : "border-neutral-200 bg-white hover:border-black"
                  }`}
                >
                  <div className="space-y-3">
                    <div className={`size-8 rounded flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${
                      theme === "dark" ? "bg-zinc-800 text-white" : "bg-neutral-100 text-black"
                    }`}>
                      <Users className="size-4" />
                    </div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-black"}`}>Candidate Track</h3>
                    <p className={`text-[10px] leading-relaxed font-medium ${theme === "dark" ? "text-zinc-450" : "text-neutral-500"}`}>Telemetry parameters, interview setups, and billing cycles.</p>
                  </div>
                  <div className={`flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest mt-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                    <span>Explore Track</span>
                    <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => handleSelectMode("developer")}
                  className={`group p-5 rounded-lg border text-left transition-all duration-200 flex flex-col justify-between h-48 cursor-pointer ${
                    theme === "dark" ? "border-zinc-800 bg-zinc-900 hover:border-white" : "border-neutral-200 bg-white hover:border-black"
                  }`}
                >
                  <div className="space-y-3">
                    <div className={`size-8 rounded flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${
                      theme === "dark" ? "bg-zinc-800 text-white" : "bg-neutral-100 text-black"
                    }`}>
                      <Terminal className="size-4" />
                    </div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-black"}`}>Developer Track</h3>
                    <p className={`text-[10px] leading-relaxed font-medium ${theme === "dark" ? "text-zinc-450" : "text-neutral-500"}`}>Clerk db synchronization, Stripe webhooks, WebSockets audio streams.</p>
                  </div>
                  <div className={`flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest mt-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                    <span>Explore Track</span>
                    <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal (Cmd+K) */}
      <AnimatePresence>
        {showCmdPalette && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowCmdPalette(false)}
          >
            <motion.div 
              initial={{ y: -10, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg mx-4 rounded-lg border shadow-xl overflow-hidden ${
                theme === "dark" ? "bg-zinc-950 border-zinc-850" : "bg-[#FFFFFF] border-neutral-200"
              }`}
            >
              <div className={`flex items-center border-b px-4 py-3 ${
                theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-neutral-50/50 border-neutral-150"
              }`}>
                <Search className="size-4 text-neutral-400 mr-2" />
                <input
                  type="text"
                  placeholder="Type a command or search sections..."
                  className={`w-full bg-transparent border-none text-xs focus:outline-none placeholder-neutral-400 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <div className={`flex items-center gap-0.5 border px-1.5 py-0.5 rounded text-[8px] font-mono ${
                  theme === "dark" ? "border-zinc-850 text-zinc-500" : "border-neutral-200 text-neutral-450"
                }`}>
                  <Command className="size-2" /> K
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                {filteredSections.length > 0 ? (
                  filteredSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSection(sec.id);
                        setShowCmdPalette(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded flex items-center justify-between cursor-pointer ${
                        theme === "dark" ? "hover:bg-zinc-900 text-zinc-300" : "hover:bg-neutral-50 text-black"
                      }`}
                    >
                      <span className="font-semibold">{sec.title}</span>
                      <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-mono">{sec.category}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-neutral-450">No results found</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bespoke Grayscale Sticky Sidebar */}
      <aside 
        className={`sticky top-0 h-screen border-r flex flex-col justify-between shrink-0 z-20 pt-8 pb-6 hidden md:flex transition-all duration-300 ${
          theme === "dark" 
            ? "bg-zinc-950 border-zinc-900 text-zinc-300" 
            : "bg-[#FAFAFA] border-neutral-200/85 text-neutral-600"
        } ${
          sidebarLocked || isSidebarHovered ? "w-64 px-4" : "w-16 px-2"
        }`}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <div className="space-y-6 overflow-hidden flex flex-col flex-1">
          
          {/* Header Controls inside Sidebar */}
          <div className="flex items-center justify-between h-8 shrink-0">
            {(sidebarLocked || isSidebarHovered) ? (
              <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${theme === "dark" ? "text-white" : "text-black"}`}>
                Mockrithm Portal
              </span>
            ) : (
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse mx-auto" />
            )}
            
            {(sidebarLocked || isSidebarHovered) && (
              <div className="flex items-center gap-2">
                {/* Theme Switcher Button */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-1.5 rounded transition-all hover:scale-105 cursor-pointer ${
                    theme === "dark" ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-neutral-500 hover:text-black hover:bg-neutral-200"
                  }`}
                  title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                </button>
                
                {/* Lock Sidebar Button */}
                <button
                  onClick={() => setSidebarLocked(!sidebarLocked)}
                  className={`p-1.5 rounded transition-all hover:scale-105 cursor-pointer ${
                    theme === "dark" ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-neutral-500 hover:text-black hover:bg-neutral-200"
                  }`}
                  title={sidebarLocked ? "Unlock Sidebar (Hover Mode)" : "Lock Sidebar"}
                >
                  {sidebarLocked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Mode Switcher */}
          {docMode && (sidebarLocked || isSidebarHovered) && (
            <div className={`p-3 rounded border flex items-center justify-between shadow-xs shrink-0 ${
              theme === "dark" ? "bg-zinc-900 border-zinc-850" : "bg-white border-neutral-250"
            }`}>
              <div className="flex flex-col">
                <span className="text-[7.5px] font-extrabold text-neutral-400 uppercase tracking-widest">Active Track</span>
                <span className="text-[11px] font-extrabold capitalize">{docMode} Track</span>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded transition-colors cursor-pointer ${
                  theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black"
                }`}
              >
                Change
              </button>
            </div>
          )}

          {/* Quick Command Guide */}
          {(sidebarLocked || isSidebarHovered) ? (
            <button
              onClick={() => setShowCmdPalette(true)}
              className={`w-full flex items-center justify-between px-3 py-2 border rounded text-xs transition-all cursor-pointer text-left shrink-0 ${
                theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700" : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400"
              }`}
            >
              <span className="font-medium text-[11px]">Quick Search...</span>
              <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded ${
                theme === "dark" ? "border-zinc-800 text-zinc-500" : "border-neutral-200 text-neutral-400"
              }`}>⌘K</span>
            </button>
          ) : (
            <button
              onClick={() => setShowCmdPalette(true)}
              className={`mx-auto p-2 border rounded transition-all cursor-pointer shrink-0 ${
                theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700" : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400"
              }`}
              title="Search docs (⌘K)"
            >
              <Search className="size-3.5" />
            </button>
          )}
          
          {/* Categorized Navigation */}
          <div className="space-y-6 overflow-y-auto flex-1 pr-1 scrollbar-none">
            {categories.map((cat) => {
              const catSections = filteredSections.filter((s) => s.category === cat);
              if (catSections.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  {(sidebarLocked || isSidebarHovered) && (
                    <span className="text-[9px] font-extrabold text-neutral-450 uppercase tracking-widest px-3 block mb-2 font-mono">
                      {cat}
                    </span>
                  )}
                  {catSections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`w-full flex items-center py-2 rounded text-left text-xs font-semibold tracking-wide transition-all border-l-2 cursor-pointer ${
                          sidebarLocked || isSidebarHovered ? "px-3 justify-start" : "px-0 justify-center"
                        } ${
                          isActive 
                            ? theme === "dark"
                              ? "bg-zinc-150 text-black border-white font-extrabold shadow-sm"
                              : "bg-black text-white border-black font-extrabold shadow-sm" 
                            : theme === "dark"
                              ? "border-transparent text-zinc-450 hover:text-white hover:bg-zinc-900/60"
                              : "border-transparent text-neutral-500 hover:text-black hover:bg-neutral-100/60"
                        }`}
                        title={sec.title}
                      >
                        <sec.icon className={`size-3.5 shrink-0 ${sidebarLocked || isSidebarHovered ? "mr-3" : "mr-0"}`} />
                        {(sidebarLocked || isSidebarHovered) && (
                          <span className="truncate">{sec.title}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`px-2 text-[9px] font-extrabold uppercase tracking-widest font-mono shrink-0 ${
          sidebarLocked || isSidebarHovered ? "text-neutral-450 text-left px-6" : "text-neutral-500 text-center"
        }`}>
          {sidebarLocked || isSidebarHovered ? "Mockrithm Docs v2.5" : "v2.5"}
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto z-10 pt-8 pb-16 px-6 sm:px-12 max-w-4xl w-full mx-auto" ref={mainContentRef}>
          <div className="space-y-8">
            
            {/* Mobile Header / Navigation */}
            <div className="md:hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${theme === "dark" ? "text-white" : "text-black"}`}>
                  Mockrithm Docs
                </span>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    theme === "dark" ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-neutral-500 hover:text-black hover:bg-neutral-200"
                  }`}
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
              </div>

              {docMode && (
                <div className={`p-3 rounded border flex items-center justify-between ${
                  theme === "dark" ? "bg-zinc-900 border-zinc-850" : "bg-neutral-50 border-neutral-200"
                }`}>
                  <span className="text-xs font-extrabold capitalize">{docMode} Track</span>
                  <button 
                    onClick={() => setShowModal(true)}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 border rounded ${
                      theme === "dark" ? "bg-zinc-800 border-zinc-700 text-zinc-300" : "bg-white border-neutral-200 text-neutral-550"
                    }`}
                  >
                    Change
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowCmdPalette(true)}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded text-xs ${
                  theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-450" : "bg-neutral-50 border-neutral-200 text-neutral-450"
                }`}
              >
                <span>Search docs...</span>
                <span className="text-[9px] font-mono border px-1 rounded">⌘K</span>
              </button>

              <div className="flex gap-2 overflow-x-auto pb-2 border-b scrollbar-none border-neutral-200 dark:border-zinc-800">
                {modeSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-3 py-1.5 rounded text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap shrink-0 border ${
                      activeSection === sec.id 
                        ? theme === "dark" ? "bg-white text-black border-white" : "bg-black text-white border-black" 
                        : theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-neutral-200 text-neutral-500"
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className={`hidden md:flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest font-mono ${
              theme === "dark" ? "text-zinc-550" : "text-neutral-400"
            }`}>
              <span>Docs</span>
              <ChevronRight className="size-2.5" />
              <span>{sections.find((s) => s.id === activeSection)?.category}</span>
              <ChevronRight className="size-2.5" />
              <span className={theme === "dark" ? "text-white" : "text-black"}>{sections.find((s) => s.id === activeSection)?.title}</span>
            </div>

            {/* Dynamic Active Section Panel */}
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`min-h-[50vh] border-b pb-12 ${
                theme === "dark" ? "border-zinc-900" : "border-neutral-200"
              }`}
            >
              {sections.find((s) => s.id === activeSection)?.content}
            </motion.div>

            {/* Help / Feedback Panel */}
            <div className={`p-6 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              theme === "dark" ? "bg-zinc-950 border-zinc-900 text-zinc-400" : "bg-neutral-50/50 border-neutral-200 text-neutral-500"
            }`}>
              <div className="text-xs text-center sm:text-left">
                {feedbackGiven ? (
                  <span className={`font-extrabold block ${theme === "dark" ? "text-white" : "text-black"}`}>✓ Thank you for helping us improve our documentation!</span>
                ) : (
                  <>
                    <span className={`font-extrabold block mb-1 ${theme === "dark" ? "text-white" : "text-black"}`}>Was this page helpful?</span>
                    Help us shape the future of Mockrithm's documentation.
                  </>
                )}
              </div>
              {!feedbackGiven && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFeedbackGiven("yes")}
                    className={`px-4 py-2 rounded border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      theme === "dark" ? "border-zinc-800 bg-zinc-900 hover:border-zinc-650 hover:bg-zinc-850 hover:text-white" : "border-neutral-200 hover:border-black bg-white text-neutral-600 hover:text-black"
                    }`}
                  >
                    <ThumbsUp className="size-3.5" /> Yes
                  </button>
                  <button 
                    onClick={() => setFeedbackGiven("no")}
                    className={`px-4 py-2 rounded border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      theme === "dark" ? "border-zinc-800 bg-zinc-900 hover:border-zinc-650 hover:bg-zinc-850 hover:text-white" : "border-neutral-200 hover:border-black bg-white text-neutral-600 hover:text-black"
                    }`}
                  >
                    <ThumbsDown className="size-3.5" /> No
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Right Side Table of Contents (On this page) - Sticky */}
      <aside className={`w-56 sticky top-0 h-screen border-l pt-8 pb-6 px-6 shrink-0 hidden lg:block z-10 text-xs ${
        theme === "dark" ? "bg-zinc-950/20 border-zinc-900" : "bg-[#FAFAFA]/50 border-neutral-200/80"
      }`}>
        <div className="space-y-6 font-medium">
          <span className="text-[9px] font-extrabold uppercase tracking-widest block font-mono text-neutral-450">On This Page</span>
          <div className="space-y-2">
            {filteredSections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left block truncate transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? theme === "dark" ? "text-white font-extrabold border-l border-white pl-2" : "text-black font-extrabold border-l border-black pl-2" 
                      : "text-neutral-400 pl-2 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {sec.title}
                </button>
              );
            })}
          </div>

          <div className={`pt-6 border-t space-y-3 ${theme === "dark" ? "border-zinc-900" : "border-neutral-205"}`}>
            <span className="text-[9px] font-extrabold uppercase tracking-widest block font-mono text-neutral-450">Resources</span>
            <div className="space-y-2 text-[10px] font-extrabold uppercase tracking-wider font-mono text-neutral-500">
              <Link href="/resources" className="flex items-center justify-between hover:text-black dark:hover:text-white transition-colors">
                <span>Guides</span>
                <ExternalLink className="size-3" />
              </Link>
              <Link href="/pricing" className="flex items-center justify-between hover:text-black dark:hover:text-white transition-colors">
                <span>Pricing Plans</span>
                <ExternalLink className="size-3" />
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between hover:text-black dark:hover:text-white transition-colors">
                <span>GitHub Repos</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
