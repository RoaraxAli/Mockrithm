# Mockrithm

Mockrithm is a proprietary, enterprise-grade mock interview and interactive learning simulator. It is built to offer a sleek, premium experience for assessment, dynamic coding sandbox execution, and structured evaluation.

**Note: This is a commercial product. The source code, prompts, assets, and design systems are proprietary and protected under copyright law.**

---

## 🔒 Security & Proprietary Prompts
To secure our intellectual property, all core AI prompt systems (including syllabus, interview persona, STAR grading, and feedback compilation templates) are configured via environment variables:
- These are kept completely out of the source code repository.
- You can customize the prompts in production by setting the corresponding environment variables in the Vercel Project Settings panel.
- If these environment variables are not defined, the system falls back to standard, out-of-the-box templates defined internally.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19) with TypeScript
- **Voice STT**: Client-side VAD (Voice Activity Detection) + Whisper Large V3 Turbo (Groq API wrapper)
- **Voice TTS**: Microsoft Edge Neural TTS (Free, high-quality zero-cost API fallback)
- **State Management**: React Hook Form + Zod for validation, Context API for global state
- **Animations**: Framer Motion, GSAP
- **Authentication**: Clerk / Firebase Auth
- **Database**: Firestore (via Firebase Admin SDK)
- **AI Backend**: Dynamic Multi-Key API load-balancing (`fetchGroq`) with automated 429 and terms-acceptance rate-limit failovers.

---

## 🏁 Development Setup

### Prerequisites
- Node.js (v18+)
- npm (or yarn)

### Configuration
1. Initialize a `.env` file at the root of the project with required keys:
   ```env
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----"
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   
   GROQ_API_KEY=your_primary_groq_api_key
   GROQ_API_KEY_2=your_secondary_groq_api_key
   GROQ_API_KEY_3=your_tertiary_groq_api_key
   
   # Optional prompt overrides (commercial templates)
   PROMPT_INTERVIEW_PERSONA="Your custom interview system prompt..."
   PROMPT_SETUP_PERSONA="Your custom setup session onboarding prompt..."
   PROMPT_CHALLENGE_GENERATOR="Your custom coding sandbox challenge prompt..."
   PROMPT_WELCOME_GENERATOR="Your custom greeting prompt..."
   PROMPT_STAR_ANALYZER="Your custom response rating prompt..."
   PROMPT_FEEDBACK_GENERATOR="Your custom grading feedback prompt..."
   ```

---

## 📄 License and Copyright

Copyright © 2026 Mockrithm. All rights reserved. 

Unauthorized copying, distribution, modification, or download of this software, via any medium, is strictly prohibited. This code is confidential and proprietary to the copyright holders.
