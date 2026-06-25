# Mockrithm Project Documentation

Welcome to the comprehensive, single-source-of-truth technical blueprint and user manual for **Mockrithm**. This document details the entire architectural layout, integrations, code configurations, schemas, voice pipelines, and styling rules powering the Mockrithm platform.

---

## 1. System Architecture & High-Level Design

Mockrithm utilizes a dual-layer architecture built on **Next.js (App Router)** to decouple public marketing assets and documentation pages from the private, authenticated cockpit workspace.

```mermaid
graph TD
    Client[Next.js Client Components] --> Server[Next.js Server Actions & Routes]
    Server --> Clerk[Clerk Authentication Server SDK]
    Server --> Firebase[Firebase Admin SDK / Firestore]
    Server --> Gemini[Google Gemini AI Core]
    Server --> Groq[Groq Llama Inference Engine]
    Server --> Stripe[Stripe Billing Engine]
```

### Decoupled Core Layers
1. **Layer 1: Public Web & Documentation Suite**
   - High-performance, SEO-optimized visitor portal.
   - Built-in technical documentation powered by **Fumadocs** loaded from static MDX sources.
   - Landing showcases containing GSAP scroll animations and Three.js canvas components.
2. **Layer 2: Private Interactive Workspace**
   - A secure portal restricted by **Clerk** middleware guards.
   - Real-time ATS resume analysis and dynamic editing tools.
   - Voice-driven mock interview simulation utilizing low-latency WebSockets.
   - Subscription checkout integrations using Stripe.

---

## 2. Technology Stack & Key Dependencies

- **Frontend & Routing:** Next.js (version 16), React 19, TypeScript
- **Styling Core:** Tailwind CSS (v4) with custom variants and HSL/OKLCH themes
- **Interactive Graphics:** Three.js, GSAP (GreenSock) for stacked scroll pinning, Framer Motion
- **Authentication:** Clerk Next.js SDK (with subdomains routing configurations)
- **Database & Services:** Firebase Admin SDK (Google Cloud Firestore)
- **Primary AI Engines:** 
  - **Groq API:** Llama-3.3-70b-versatile for fast, low-latency mock interview evaluations.
  - **Google Gemini API:** Gemini-2.0-flash-001 & Gemini-2.5-flash for fallback structural parsing and ATS resumes checking.
- **Monetization Engine:** Stripe Checkout & Webhooks API
- **Live Communication:** WebSocket protocol for full-duplex audio stream handshakes

---

## 3. Directory Layout Blueprint

```
mockrithm/
├── .next/                    # Production Next.js compiler output
├── app/                      # Next.js App Router root
│   ├── (auth)/               # Clerk Login, Signup, Password resets
│   ├── (root)/               # Landing pages, layouts, pricing, features
│   │   ├── dashboard/        # Main candidate dashboard
│   │   └── interview/        # Interactive mock interview room
│   ├── admin/                # Admin Panel panel views (User/Audit logs, Blog panel)
│   ├── api/                  # Backend REST API endpoints
│   │   ├── auth/sync/        # Sync Clerk session to Firestore
│   │   ├── resume/           # ATS Parsing, scoring, autofix endpoints
│   │   └── payment/          # Stripe session initialization & webhooks
│   ├── blog/                 # Standalone blog pages
│   ├── documentation/        # Fumadocs route handlers [...slug]
│   ├── layout.config.tsx     # Custom Fumadocs base options
│   └── globals.css           # Custom Tailwind v4 themes and overrides
├── components/               # Shared frontend components
│   ├── landing/              # Hero, Canvas particle visualizers, pricing
│   ├── resume/               # PDF renderers, builders, templates
│   └── interview/            # Live calibration, checklists
├── content/                  # Documentation MDX source files
│   ├── docs/
│   │   ├── dev/              # Developer track indices & detail pages
│   │   ├── user/             # Candidate manual indices & detail pages
│   │   └── meta.json         # High-level Fumadocs layout mapping
├── firebase/                 # Firestore admin access files and settings
├── lib/                      # Shared utility methods
│   ├── actions/              # Next.js Server Actions (Auth, Admin, Resume)
│   └── source.ts             # Fumadocs source loader initialization
├── public/                   # Static assets, SVG shapes, logo files
├── vercel.json               # Vercel deployment subdomain routing configs
├── postcss.config.mjs        # CSS preprocessing variables
├── tsconfig.json             # TypeScript rules definition
├── package.json              # Main project package dependencies
└── source.config.ts          # Fumadocs configuration definitions
```

---

## 4. Local Workspace Environment Setup

Deploy the application locally by generating a local environment configuration file:

```ini
# Clerk Identity Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Firebase Cloud Connection (Admin Access JSON)
FIREBASE_PROJECT_ID=mockrithm-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@mockrithm-prod.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC..."

# AI Core Tokens
GEMINI_API_KEY=AIzaSyA...
GROQ_API_KEY=gsk_...

# Payments & Gateways
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Execute these terminal commands to initialize the node dependencies and trigger the Next dev environment:
```bash
npm install
npm run dev
```

---

## 5. User Manual & Functional Features

### 5.1 Dashboard Cockpit
Candidates track progress parameters from a centralized graphical terminal:
- **ATS Score Progression:** Line chart mapping historical resume scores.
- **Session Telemetry:** Aggregate statistics of completed voice sessions.
- **Calibration Status:** Current latency calibration values.

### 5.2 ATS Resume Workspace & Builder
Job seekers prepare resume documents using clean, parser-friendly single-column styling:
- **ATS Compatibilty Analysis:** Scanning resumes for styling glitches and missing sections.
- **Keywords Mapping:** Compares resume parameters against target Job Descriptions, highlighting keyword gaps.
- **Real-Time Editor:** Inline updates with instant PDF preview and download capabilities.

### 5.3 Voice-Driven AI Interview Engine
Engages candidates in high-fidelity mock interview sessions:
- **Custom Setting Triggers:** Selection of industry, role target, and seniority levels.
- **Dynamic Checklists:** Real-time STAR checklist ticking off components (Situation, Task, Action, Result) as they are spoken.
- **WPM Tracking:** Monitors pacing (Optimal speed: 120-150 Words Per Minute).
- **Filler Audits:** Monitors vocal halts (`um`, `ah`, `basically`, `like`) to score articulation.

---

## 6. Developer Reference & Implementation Specifics

### 6.1 Authentication Synchronization
When a user authenticates via Clerk, Next.js triggers a sync process writing metadata details directly into the server Firestore collections:

```javascript
// Next.js Route Handler: app/api/auth/sync/route.ts
import { db } from "@/firebase/admin";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const userRef = db.collection("users").doc(user.id);
  await userRef.set({
    email: user.emailAddresses[0].emailAddress,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    avatarUrl: user.imageUrl,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  return NextResponse.json({ success: true });
}
```

### 6.2 Voice WebSocket Handshake
The Voice Engine handles dynamic streaming sessions via WebSockets, mapping metrics and audio segments on the fly:

```javascript
const socket = new WebSocket("wss://api.mockrithm.me/v1/voice/stream");

socket.onopen = () => {
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
    console.log("Real-time transcription:", message.text);
    console.log("Fillers detected:", message.analytics.fillers);
  }
};
```

---

## 7. Firestore Database Schema

### 7.1 Users Collection (`/users`)
```json
{
  "id": "user_2Tsh3K8p...", 
  "name": "Muhammad Ali",
  "email": "ali@example.com",
  "role": "Admin" | "User",
  "status": "Active" | "Suspended",
  "createdAt": "2026-06-25T17:45:00.000Z",
  "updatedAt": "2026-06-25T17:45:00.000Z"
}
```

### 7.2 Resumes Subcollection (`/users/{userId}/resumes`)
```json
{
  "id": "resume_uuid...",
  "userId": "user_2Tsh3K8p...",
  "fileName": "Software_Engineer_CV.pdf",
  "rawText": "Experienced Developer...",
  "parsedData": {
    "basics": { "name": "Muhammad Ali", "email": "ali@example.com", "phone": "123456", "summary": "..." },
    "work": [{ "company": "Mockrithm", "role": "Engineer", "startDate": "2024", "endDate": "2026", "highlights": ["Built AI workflows"] }],
    "skills": ["TypeScript", "Next.js", "Firebase"],
    "projects": [{ "name": "Doc Extractor", "description": "...", "url": "..." }]
  },
  "atsAnalysis": {
    "score": 92,
    "issues": ["Add GitHub profile link"]
  },
  "createdAt": "2026-06-25T17:45:00.000Z"
}
```

### 7.3 Interviews Collection (`/interviews`)
```json
{
  "id": "session_uuid...",
  "userId": "user_2Tsh3K8p...",
  "role": "Software Engineer",
  "experience": "Senior",
  "questions": ["Explain WebSockets vs Polling", "Describe a challenging bug"],
  "transcript": [
    { "role": "interviewer", "content": "Welcome! Tell me about WebSockets." },
    { "role": "candidate", "content": "WebSockets support persistent connections..." }
  ],
  "finalized": true,
  "createdAt": "2026-06-25T17:45:00.000Z"
}
```

### 7.4 Interview Feedback Collection (`/interviewsfeedback`)
```json
{
  "id": "feedback_uuid...",
  "interviewId": "session_uuid...",
  "userId": "user_2Tsh3K8p...",
  "candidateName": "Muhammad Ali",
  "email": "ali@example.com",
  "totalScore": 88,
  "categoryScores": [
    { "name": "Communication Skills", "score": 90, "comment": "Clear speech patterns" },
    { "name": "Technical Knowledge", "score": 85, "comment": "Understands network protocols" }
  ],
  "strengths": ["Clear articulation", "Structured STAR method usage"],
  "areasForImprovement": ["Slow down during complex system design explanations"],
  "averageWpm": 132,
  "topFillerWords": ["like", "um"],
  "createdAt": "2026-06-25T17:45:00.000Z"
}
```

---

## 8. Stripe Integration & Pricing Tiers

Mockrithm provides three monetization plans:
1. **Freemium (Tier 1):** $0/mo. Access to 1 AI voice session, basic pacing analysis.
2. **Premium (Tier 2):** $10/mo. Unlimited voice sessions, filler word audits, and ATS checker reports.
3. **Pro (Tier 3):** $25/mo. Standard system designer layout editor, custom resume endpoints, API token keys.

Stripe payments are validated using secure webhook callbacks. Ensure signature validation checks inside checkout endpoints before upgrading user privileges:
```javascript
// Validate stripe signature inside API webhook
const event = stripe.webhooks.constructEvent(
  body, 
  signature, 
  process.env.STRIPE_WEBHOOK_SECRET
);
```

---

## 9. Visual styling & Aesthetic Guidelines

Mockrithm enforces a high-end, premium design language:
- **Design Language:** Monochromatic and minimal, using high contrast, crisp lines, and smooth transitions.
- **Colors:** Deep Zinc/Gray schemes (`#09090b` zinc-950, `#18181b` zinc-900, `#fafafa` off-white).
- **Typography:** **Mona Sans** (with fallback sans-serif) configured inside Tailwind layers.
- **Glassmorphism:** Embedded styling components use a custom `backdrop-filter: blur(20px)` and semi-transparent white borders (`rgba(255, 255, 255, 0.08)`) with radial gradient overlays.
