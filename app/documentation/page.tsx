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
  Command
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
          <span key={idx} className="text-neutral-450 italic block select-none">
            {line}
          </span>
        );
      }
      
      // Inline word highlighting rules (variables, functions, keywords, strings)
      // Break down the line into segments or just render grayscale styled texts.
      // This achieves high-contrast premium code visuals.
      return (
        <span key={idx} className="block text-neutral-800">
          {line.split(/(\s+)/).map((part, pIdx) => {
            const trimmed = part.trim();
            if (["const", "let", "var", "import", "export", "async", "await", "function", "return", "class", "def", "from", "while", "if", "for", "in"].includes(trimmed)) {
              return <span key={pIdx} className="font-extrabold text-black">{part}</span>;
            }
            if (trimmed.startsWith('"') || trimmed.startsWith("'") || trimmed.startsWith("`")) {
              return <span key={pIdx} className="text-neutral-500 font-medium">{part}</span>;
            }
            if (trimmed.match(/^\d+$/)) {
              return <span key={pIdx} className="text-neutral-600 font-mono">{part}</span>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <div className="group relative border border-neutral-200/80 bg-neutral-50/50 rounded-lg overflow-hidden my-4">
      <div className="bg-neutral-100/60 border-b border-neutral-200/80 px-4 py-2 flex items-center justify-between text-[10px] font-bold tracking-wider text-neutral-500 uppercase font-mono">
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
      <div className="p-4 overflow-x-auto bg-[#FFFFFF] font-mono text-[11px] leading-relaxed flex">
        <div className="pr-4 border-r border-neutral-100 text-neutral-300 text-right select-none w-8 shrink-0">
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

  const mainContentRef = useRef<HTMLDivElement>(null);

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

  const sections = [
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
    <div className="w-full flex bg-[#FFFFFF] min-h-screen text-black select-none relative z-10 overflow-hidden font-sans">
      
      {/* Background Subtle Hairline Separations */}
      <div className="absolute inset-0 bg-[#FAFAFA]/50 pointer-events-none z-0" />

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-xl mx-4 p-8 rounded-lg border border-neutral-200/80 bg-[#FFFFFF] shadow-xl space-y-6 overflow-hidden"
            >
              <div className="text-center space-y-2">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 border border-neutral-200 px-3 py-1 rounded">Mockrithm Portal</span>
                <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Choose Documentation Guide</h2>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">Select a track tailored to your role to browse relevant manuals or code instructions.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectMode("user")}
                  className="group p-5 rounded-lg border border-neutral-200 bg-white text-left hover:border-black transition-all duration-200 flex flex-col justify-between h-48 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="size-8 rounded bg-neutral-100 flex items-center justify-center text-black group-hover:scale-105 transition-transform duration-200">
                      <Users className="size-4" />
                    </div>
                    <h3 className="text-xs font-bold text-black uppercase tracking-wider">Candidate Track</h3>
                    <p className="text-[10px] leading-relaxed text-neutral-500 font-medium">Telemetry parameters, interview setups, and billing cycles.</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-extrabold text-black uppercase tracking-widest mt-4">
                    <span>Explore Track</span>
                    <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => handleSelectMode("developer")}
                  className="group p-5 rounded-lg border border-neutral-200 bg-white text-left hover:border-black transition-all duration-200 flex flex-col justify-between h-48 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="size-8 rounded bg-neutral-100 flex items-center justify-center text-black group-hover:scale-105 transition-transform duration-200">
                      <Terminal className="size-4" />
                    </div>
                    <h3 className="text-xs font-bold text-black uppercase tracking-wider">Developer Track</h3>
                    <p className="text-[10px] leading-relaxed text-neutral-500 font-medium">Clerk db synchronization, Stripe webhooks, WebSockets audio streams.</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-extrabold text-black uppercase tracking-widest mt-4">
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
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/25 backdrop-blur-xs"
            onClick={() => setShowCmdPalette(false)}
          >
            <motion.div 
              initial={{ y: -10, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg mx-4 rounded-lg border border-neutral-200 bg-[#FFFFFF] shadow-xl overflow-hidden"
            >
              <div className="flex items-center border-b border-neutral-150 px-4 py-3 bg-neutral-50/50">
                <Search className="size-4 text-neutral-450 mr-2" />
                <input
                  type="text"
                  placeholder="Type a command or search sections..."
                  className="w-full bg-transparent border-none text-xs focus:outline-none placeholder-neutral-400"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <div className="flex items-center gap-0.5 border border-neutral-200 px-1.5 py-0.5 rounded text-[8px] font-mono text-neutral-450">
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
                      className="w-full text-left px-3 py-2 text-xs rounded hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-black">{sec.title}</span>
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
      <aside className="w-64 border-r border-neutral-200/80 bg-[#FAFAFA] flex flex-col justify-between shrink-0 z-10 pt-8 pb-6 hidden md:flex">
        <div className="px-4 space-y-6">
          
          {/* Mode Switcher */}
          {docMode && (
            <div className="p-3 rounded border border-neutral-200 bg-white flex items-center justify-between shadow-xs">
              <div className="flex flex-col">
                <span className="text-[7.5px] font-extrabold text-neutral-400 uppercase tracking-widest">Active Track</span>
                <span className="text-[11px] font-extrabold text-black capitalize">{docMode} Track</span>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-500 hover:text-black px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          {/* Quick Command Guide */}
          <button
            onClick={() => setShowCmdPalette(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-neutral-200 rounded text-xs text-neutral-500 hover:border-neutral-400 transition-all cursor-pointer text-left"
          >
            <span className="font-medium text-[11px]">Quick Search...</span>
            <span className="text-[9px] font-mono border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-400">⌘K</span>
          </button>
          
          {/* Categorized Navigation */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {categories.map((cat) => {
              const catSections = filteredSections.filter((s) => s.category === cat);
              if (catSections.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <span className="text-[9px] font-extrabold text-neutral-450 uppercase tracking-widest px-3 block mb-2 font-mono">
                    {cat}
                  </span>
                  {catSections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`w-full flex items-center px-3 py-2 rounded text-left text-xs font-semibold tracking-wide transition-all border-l-2 cursor-pointer ${
                          isActive 
                            ? "bg-black text-white border-black font-extrabold shadow-sm" 
                            : "border-transparent text-neutral-500 hover:text-black hover:bg-neutral-100/60"
                        }`}
                      >
                        <sec.icon className="size-3.5 mr-3 shrink-0" />
                        <span className="truncate">{sec.title}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest font-mono">
          Mockrithm Docs v2.5
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto z-10 pt-8 pb-16 px-6 sm:px-12 max-w-4xl w-full mx-auto" ref={mainContentRef}>
          <div className="space-y-8">
            
            {/* Mobile Header / Navigation */}
            <div className="md:hidden space-y-4">
              {docMode && (
                <div className="p-3 rounded border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-black capitalize">{docMode} Track</span>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black px-2 py-1 bg-white border rounded"
                  >
                    Change
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowCmdPalette(true)}
                className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-450"
              >
                <span>Search docs...</span>
                <span className="text-[9px] font-mono border px-1 rounded">⌘K</span>
              </button>

              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-neutral-200 scrollbar-none">
                {modeSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-3 py-1.5 rounded text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap shrink-0 border ${
                      activeSection === sec.id 
                        ? "bg-black text-white border-black" 
                        : "bg-white border-neutral-200 text-neutral-500"
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest font-mono">
              <span>Docs</span>
              <ChevronRight className="size-2.5" />
              <span>{sections.find((s) => s.id === activeSection)?.category}</span>
              <ChevronRight className="size-2.5" />
              <span className="text-black">{sections.find((s) => s.id === activeSection)?.title}</span>
            </div>

            {/* Dynamic Active Section Panel */}
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="min-h-[50vh] border-b border-neutral-200 pb-12"
            >
              {sections.find((s) => s.id === activeSection)?.content}
            </motion.div>

            {/* Help / Feedback Panel */}
            <div className="p-6 rounded-lg border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-500 text-center sm:text-left">
                {feedbackGiven ? (
                  <span className="text-black font-extrabold block">✓ Thank you for helping us improve our documentation!</span>
                ) : (
                  <>
                    <span className="text-black font-extrabold block mb-1">Was this page helpful?</span>
                    Help us shape the future of Mockrithm's documentation.
                  </>
                )}
              </div>
              {!feedbackGiven && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFeedbackGiven("yes")}
                    className="px-4 py-2 rounded border border-neutral-200 hover:border-black bg-white text-neutral-600 hover:text-black flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <ThumbsUp className="size-3.5" /> Yes
                  </button>
                  <button 
                    onClick={() => setFeedbackGiven("no")}
                    className="px-4 py-2 rounded border border-neutral-200 hover:border-black bg-white text-neutral-600 hover:text-black flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <ThumbsDown className="size-3.5" /> No
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Right Side Table of Contents (On this page) */}
      <aside className="w-56 border-l border-neutral-200/80 bg-[#FAFAFA]/50 pt-8 pb-6 px-6 shrink-0 hidden lg:block z-10 text-xs">
        <div className="space-y-6 font-medium">
          <span className="text-[9px] font-extrabold text-neutral-455 uppercase tracking-widest block font-mono">On This Page</span>
          <div className="space-y-2">
            {filteredSections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left block truncate transition-all duration-200 hover:text-black cursor-pointer ${
                    isActive ? "text-black font-extrabold border-l border-black pl-2" : "text-neutral-400 pl-2"
                  }`}
                >
                  {sec.title}
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-neutral-200 space-y-3">
            <span className="text-[9px] font-extrabold text-neutral-450 uppercase tracking-widest block font-mono">Resources</span>
            <div className="space-y-2 text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider font-mono">
              <Link href="/resources" className="flex items-center justify-between hover:text-black transition-colors">
                <span>Guides</span>
                <ExternalLink className="size-3" />
              </Link>
              <Link href="/pricing" className="flex items-center justify-between hover:text-black transition-colors">
                <span>Pricing Plans</span>
                <ExternalLink className="size-3" />
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between hover:text-black transition-colors">
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
