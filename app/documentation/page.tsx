"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
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
  Users
} from "lucide-react";

type CodeLang = "javascript" | "python" | "curl";
type DocMode = "user" | "developer";

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
  const [copiedText, setCopiedText] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeLang>("javascript");
  const [feedbackGiven, setFeedbackGiven] = useState<"yes" | "no" | null>(null);

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

  const handleSelectMode = (mode: DocMode) => {
    setDocMode(mode);
    sessionStorage.setItem("mockrithm_docs_mode", mode);
    setActiveSection(mode === "user" ? "user-interviews" : "intro");
    setShowModal(false);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
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
      curl: `# Fetch Clerk User Metadata & Sync Manual Session
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
                print(f"Received Transcript: {data['text']}")

asyncio.run(stream_audio_session())`,
      curl: `# Connect and initiate low latency voice handshakes
wscat -c wss://api.mockrithm.me/v1/voice/stream \\
  -H "Authorization: Bearer wss_token_..."`
    }
  };

  const sections = [
    // --- CATEGORY: Getting Started (Developer Only) ---
    {
      id: "intro",
      title: "Introduction",
      category: "Getting Started",
      icon: BookOpen,
      mode: "developer",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">Overview</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Introduction</h3>
          </div>
          
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Welcome to the official documentation for <strong>Mockrithm</strong>, an advanced AI-powered career training framework. Mockrithm utilizes dual-layer architecture, combining static marketing features with protected dashboard widgets.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-3 hover:border-zinc-855 transition-all">
              <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Layers className="size-4" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Layer 1: Public Base</h4>
              <p className="text-xs text-zinc-450 leading-relaxed">
                Fast static visitors layer. Delivers pages containing capability descriptions, pricing options, articles, and documentation.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-3 hover:border-zinc-855 transition-all">
              <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Zap className="size-4" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Layer 2: Private Dashboard</h4>
              <p className="text-xs text-zinc-450 leading-relaxed">
                Protected user cockpit. Integrates Clerk login, WebSockets audio sessions, resume tailors, and payment systems.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 flex gap-3.5 items-start">
            <Info className="size-5 text-white shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-zinc-400 font-medium">
              <strong className="text-white">API Core URL:</strong> Sandbox actions point to <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-white border border-zinc-800 font-mono">sandbox.api.mockrithm.me</code>. Production releases leverage sharded cloud nodes.
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
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">Initialization</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Setup & Secrets</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Deploy the environment locally by generating a local environment config file.
          </p>

          <div className="border border-zinc-900 bg-zinc-950 rounded-xl overflow-hidden font-mono text-xs">
            <div className="bg-zinc-900/40 border-b border-zinc-900 px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <span>.env.local</span>
              <button 
                onClick={() => handleCopyCode(`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
FIREBASE_PROJECT_ID=mockrithm-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...`)}
                className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedText ? <Check className="size-3 text-emerald-450" /> : <Copy className="size-3" />}
                {copiedText ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed text-zinc-350 bg-black/60">
{`# Clerk Identity Setup
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
            </pre>
          </div>
        </div>
      ),
    },

    // --- CATEGORY: User Manual (User Only) ---
    {
      id: "user-interviews",
      title: "Voice Practice Guide",
      category: "User Manual",
      icon: HelpCircle,
      mode: "user",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">How it Works</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Voice Practice Guide</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Mockrithm's audio core conducts dynamic, conversational mock interviews using your microphone. Learn how to launch your session:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Step 1: Check Microphone Permissions</h4>
              <p className="text-xs text-zinc-450 leading-relaxed">
                When starting an interview, click "Allow" on the browser audio pop-up. The framework uses a sample rate of 16kHz for clean audio transmission.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Step 2: Respond naturally</h4>
              <p className="text-xs text-zinc-450 leading-relaxed">
                Our AI agent listens for brief pauses. Keep your speech smooth. If you stop speaking, the agent will analyze your input and reply.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Step 3: Complete & Review</h4>
              <p className="text-xs text-zinc-450 leading-relaxed">
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
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono font-bold">Metrics Guide</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Feedback & Telemetry</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            After each session, you will receive score metrics. Below is an explanation of what the telemetry parameters track:
          </p>

          <table className="w-full text-left border-collapse text-xs mt-4">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-450 font-bold uppercase">
                <th className="pb-2">Metric</th>
                <th className="pb-2">Optimal range</th>
                <th className="pb-2">Evaluation Goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              <tr>
                <td className="py-3 text-zinc-200 font-bold">Pacing Speed (WPM)</td>
                <td className="py-3 text-emerald-450 font-bold">120 - 150 WPM</td>
                <td className="py-3 text-zinc-400 font-medium">Ensures you speak at a clear, professional speed.</td>
              </tr>
              <tr>
                <td className="py-3 text-zinc-200 font-bold">Vocal Filler Words</td>
                <td className="py-3 text-emerald-450 font-bold">&lt; 3 per answer</td>
                <td className="py-3 text-zinc-400 font-medium">Tracks vocal halts (like 'um', 'like', 'ah') to clean up communication.</td>
              </tr>
              <tr>
                <td className="py-3 text-zinc-200 font-bold">STAR Method Score</td>
                <td className="py-3 text-emerald-450 font-bold">&gt; 85% Match</td>
                <td className="py-3 text-zinc-400 font-medium">Evaluates if your answer covers Situation, Task, Action, and Result.</td>
              </tr>
            </tbody>
          </table>
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
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">Templates & Editing</div>
            <h3 className="text-3xl font-black tracking-tight text-white">ATS Resume Builder</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Corporate screening software uses automated parsers to read credentials. Mockrithm includes resume builder features to format templates.
          </p>

          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 flex gap-3.5 items-start">
            <Lightbulb className="size-5 text-white shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-zinc-400 font-medium">
              <strong className="text-white">Design Rule:</strong> Use single-column layouts. Multicolumn designs confuse parsing software and could lead to auto-rejection.
            </div>
          </div>

          <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400 font-medium">
            <li><strong>Live HTML Editor:</strong> Modify fields in real time to see formatting updates immediately.</li>
            <li><strong>JSON Data Export:</strong> Save data in a clean schema to download or port anywhere.</li>
            <li><strong>Clean Export:</strong> Export files in clean print layouts without rendering issues.</li>
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
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono font-bold">Billing Cycles</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Billing & Plans</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Mockrithm supports three tiers. You can choose to bill monthly or select annual billing to save 20%.
          </p>

          <ul className="space-y-3.5 mt-4 text-xs text-zinc-400">
            <li><strong>Freemium:</strong> Trial access. Includes 1 AI Voice Practice Session and standard pacing reviews.</li>
            <li><strong>Premium ($10/mo or $96/yr):</strong> Unlimited mock interviews, 6 resume templates, filler word timestamps.</li>
            <li><strong>Pro ($25/mo or $240/yr):</strong> Interactive System Design Simulator, telemetry sharing links, custom matches.</li>
          </ul>

          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 flex gap-3.5 items-start">
            <Info className="size-5 text-white shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-zinc-400 font-medium">
              <strong className="text-white">Managing Subscription:</strong> Upgrade or cancel subscription parameters inside your Account Settings panel under "Billing & Subscription".
            </div>
          </div>
        </div>
      ),
    },

    // --- CATEGORY: Developer Reference (Developer Only) ---
    {
      id: "dev-sync",
      title: "Clerk & Firebase Sync",
      category: "Developer Reference",
      icon: KeyRound,
      mode: "developer",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">Database Integration</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Clerk & Firebase Sync</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Mockrithm syncs profile sessions between Clerk auth rules and the Firestore database structure.
          </p>

          <div className="border border-zinc-900 rounded-xl overflow-hidden mt-4">
            <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2 flex items-center justify-between">
              <div className="flex gap-2 text-[10px] font-black uppercase tracking-wider">
                {(["javascript", "python", "curl"] as CodeLang[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      activeTab === lang 
                        ? "bg-white/5 border-white/10 text-white font-black" 
                        : "border-transparent text-zinc-500 hover:text-white"
                    }`}
                  >
                    {lang === "javascript" ? "Next.js" : lang === "python" ? "Python SDK" : "cURL"}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleCopyCode(codeSnippets.authSync[activeTab])}
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedText ? <Check className="size-3 text-emerald-450" /> : <Copy className="size-3" />}
                {copiedText ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="p-4 font-mono text-[10.5px] leading-relaxed text-zinc-350 bg-black/60 overflow-x-auto max-h-[300px]">
              {codeSnippets.authSync[activeTab]}
            </pre>
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
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">WebSocket Handshakes</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Audio WebSockets Stream</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Streaming uses full-duplex WebSockets. Read the client implementation patterns below:
          </p>

          <div className="border border-zinc-900 rounded-xl overflow-hidden mt-4">
            <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2 flex items-center justify-between">
              <div className="flex gap-2 text-[10px] font-black uppercase tracking-wider">
                {(["javascript", "python", "curl"] as CodeLang[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      activeTab === lang 
                        ? "bg-white/5 border-white/10 text-white font-black" 
                        : "border-transparent text-zinc-500 hover:text-white"
                    }`}
                  >
                    {lang === "javascript" ? "Web Client" : lang === "python" ? "Python Client" : "cURL CLI"}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleCopyCode(codeSnippets.voiceEngine[activeTab])}
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedText ? <Check className="size-3 text-emerald-450" /> : <Copy className="size-3" />}
                {copiedText ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="p-4 font-mono text-[10.5px] leading-relaxed text-zinc-350 bg-black/60 overflow-x-auto max-h-[300px]">
              {codeSnippets.voiceEngine[activeTab]}
            </pre>
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
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">ATS System Specifications</div>
            <h3 className="text-3xl font-black tracking-tight text-white">ATS Schema Rules</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            ATS parsing templates use strict schemas. Ensure data schemas follow the structure below:
          </p>

          <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 overflow-x-auto text-[10px] font-mono text-zinc-300">
{`interface ResumeData {
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
          </pre>
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
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">Payment Routing</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Stripe & Webhooks</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Transactions redirect customers to Stripe. Once complete, Stripe redirects verification calls back to the application.
          </p>

          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 flex gap-3.5 items-start">
            <AlertTriangle className="size-5 text-white shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-zinc-400 font-medium">
              <strong className="text-white">Security Tip:</strong> Verify signatures inside checkout webhook callbacks (<code className="bg-zinc-900 px-1 rounded text-white font-mono">checkout.session.completed</code>) before upgrading databases.
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
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono font-bold">Admin Panel Options</div>
            <h3 className="text-3xl font-black tracking-tight text-white">Admin Panel Controls</h3>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            The admin page dashboard tracks platform operations. Features include:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400 font-medium">
            <li><strong>Users Management:</strong> View roles, configure tiers, delete test account parameters.</li>
            <li><strong>Audits Logs:</strong> Monitor general site feedback and specific interview feedback logs.</li>
            <li><strong>Blog Publishing Engine:</strong> Publish new technical resources directly to Firestore.</li>
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
    <div className="w-full flex font-mona-sans bg-black min-h-screen text-white select-none relative z-10 overflow-hidden">
      
      {/* Background patterns */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-15 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[350px] bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none z-0" />

      {/* Role Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-500 animate-fadeIn">
          <div className="relative w-full max-w-2xl mx-4 p-8 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-3xl shadow-2xl space-y-8 animate-scaleUp overflow-hidden">
            <div className="absolute -top-24 -left-24 size-48 rounded-full bg-white/5 blur-[50px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 size-48 rounded-full bg-white/5 blur-[50px] pointer-events-none" />

            <div className="text-center space-y-3">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full">Documentation Hub</span>
              <h2 className="text-3xl font-black text-white tracking-tight">Select Documentation Track</h2>
              <p className="text-xs text-zinc-400 font-medium max-w-md mx-auto">Choose a customized documentation track aligned with your specific integration or training targets.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Candidate Card */}
              <button
                onClick={() => handleSelectMode("user")}
                className="group p-6 rounded-xl border border-white/5 bg-white/[0.01] text-left hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300 flex flex-col justify-between h-56 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
              >
                <div className="space-y-4">
                  <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                    <Users className="size-5" />
                  </div>
                  <h3 className="text-base font-black tracking-tight text-white uppercase">Candidate Track</h3>
                  <p className="text-[11px] leading-relaxed text-zinc-400 font-medium">Learn how to configure your voice diagnostics, review telemetry analysis, export ATS resumes, and configure premium tiers.</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-white uppercase tracking-widest mt-4">
                  <span>Enter Track</span>
                  <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Developer Card */}
              <button
                onClick={() => handleSelectMode("developer")}
                className="group p-6 rounded-xl border border-white/5 bg-white/[0.01] text-left hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300 flex flex-col justify-between h-56 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
              >
                <div className="space-y-4">
                  <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                    <Terminal className="size-5" />
                  </div>
                  <h3 className="text-base font-black tracking-tight text-white uppercase">Developer Track</h3>
                  <p className="text-[11px] leading-relaxed text-zinc-400 font-medium">Explore Clerk auth sync, WebSocket audio streaming channels, Stripe webhook signatures, and administrative platform controls.</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-white uppercase tracking-widest mt-4">
                  <span>Enter Track</span>
                  <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex flex-col justify-between shrink-0 z-10 pt-24 pb-6 hidden md:flex">
        <div className="px-4 space-y-6">
          
          {/* Mode Switcher */}
          {docMode && (
            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Active Mode</span>
                <span className="text-xs font-black text-white capitalize">{docMode} Guide</span>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="text-[9px] font-black uppercase tracking-wider text-zinc-400 hover:text-white px-2 py-1 bg-white/5 border border-white/10 rounded transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-900/40 border border-zinc-800 rounded-lg text-xs font-semibold placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors text-white"
            />
          </div>
          
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-thin">
            {categories.map((cat) => {
              const catSections = filteredSections.filter((s) => s.category === cat);
              if (catSections.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-650 uppercase tracking-widest px-3.5 block mb-2">
                    {cat}
                  </span>
                  {catSections.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`w-full flex items-center px-3.5 py-2 rounded-lg text-left text-xs font-semibold uppercase tracking-wider transition-all border border-transparent cursor-pointer ${
                          isActive 
                            ? "bg-white/5 border-white/10 text-white font-black" 
                            : "text-zinc-450 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <sec.icon className="size-3.5 mr-3 text-zinc-500 group-hover:text-white" />
                        {sec.title}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 text-[10px] text-zinc-650 font-bold uppercase tracking-widest">
          Mockrithm Docs v2.5
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto z-10 pt-24 pb-16 px-6 sm:px-12 max-w-4xl">
        <div className="space-y-8">
          
          {/* Mobile Search & Navigation */}
          <div className="md:hidden space-y-4">
            {docMode && (
              <div className="p-3 rounded-lg border border-white/5 bg-zinc-950 flex items-center justify-between">
                <span className="text-xs font-black text-white capitalize">{docMode} Track</span>
                <button 
                  onClick={() => setShowModal(true)}
                  className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white px-2 py-1 bg-white/5 rounded"
                >
                  Change
                </button>
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-900/40 border border-zinc-850 rounded-lg text-xs placeholder-zinc-500 text-white"
              />
            </div>

            {/* Mobile Categories Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-900">
              {modeSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 border ${
                    activeSection === sec.id 
                      ? "bg-white text-black border-white" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>Docs</span>
            <ChevronRight className="size-3" />
            <span>{sections.find((s) => s.id === activeSection)?.category}</span>
            <ChevronRight className="size-3" />
            <span className="text-zinc-300">{sections.find((s) => s.id === activeSection)?.title}</span>
          </div>

          {/* Active section rendering */}
          <div className="min-h-[50vh] border-b border-zinc-900 pb-12">
            {sections.find((s) => s.id === activeSection)?.content}
          </div>

          {/* Help Widget / Feedback */}
          <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-semibold text-zinc-400 text-center sm:text-left">
              {feedbackGiven ? (
                <span className="text-emerald-450 font-bold block">✓ Thank you for helping us improve our documentation!</span>
              ) : (
                <>
                  <span className="text-white font-bold block mb-1">Was this page helpful?</span>
                  Help us shape the future of Mockrithm's documentation.
                </>
              )}
            </div>
            {!feedbackGiven && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFeedbackGiven("yes")}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <ThumbsUp className="size-3.5" /> Yes
                </button>
                <button 
                  onClick={() => setFeedbackGiven("no")}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <ThumbsDown className="size-3.5" /> No
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Table of Contents (On this page) */}
      <aside className="w-56 border-l border-zinc-900 bg-zinc-950/20 pt-24 pb-6 px-6 shrink-0 hidden lg:block z-10 text-xs">
        <div className="space-y-4 font-medium">
          <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block">On This Page</span>
          <div className="space-y-2">
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left font-semibold cursor-pointer block truncate hover:text-white transition-colors ${
                  activeSection === sec.id ? "text-white font-black" : "text-zinc-500"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-zinc-900 space-y-3">
            <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block">Resources</span>
            <div className="space-y-2 text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              <a href="/resources" className="flex items-center justify-between hover:text-white transition-colors">
                <span>Guides</span>
                <ExternalLink className="size-3" />
              </a>
              <a href="/pricing" className="flex items-center justify-between hover:text-white transition-colors">
                <span>Pricing Plans</span>
                <ExternalLink className="size-3" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between hover:text-white transition-colors">
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
