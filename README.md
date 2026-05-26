# Mockrithm

Mockrithm is a modern web platform for interactive learning and assessment through realistic mock tests and quizzes. It offers a sleek, premium UI, customizable content, and robust admin controls, empowering both learners and administrators with a seamless experience.

Live: [mockrithm.vercel.app](https://mockrithm.vercel.app)

---

## 🚀 Features

- **Google Authentication** – Secure sign‑in/signup using Google accounts.
- **Admin Panel** – Dashboard for admins to manage users, create/edit quizzes, and view analytics.
- **User Panel** – Personalized dashboard for users to attempt quizzes, track progress, and view results.
- **Real‑Time Analytics** – Instant feedback and performance stats.
- **Dark/Light Theme** – Beautiful, animated theme switcher.
- **Responsive Design** – Optimized for desktop, tablet, and mobile.
- **Instant Feedback** – Immediate results after each quiz attempt.
- **Role‑Based Access Control** – Separate admin and user privileges.
- **AI‑Powered Quiz Generation** – Uses Google Generative AI to auto‑generate quiz questions (powered by `@ai-sdk/google`).
- **Email Notifications** – Automated emails via Nodemailer and Resend integration.
- **Animations & Motion** – Smooth UI with Framer Motion and GSAP.
- **Radix UI Components** – Accessible UI primitives for dialogs, menus, dropdowns, etc.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19) with TypeScript
- **State Management**: React Hook Form + Zod for validation, Context API for global state
- **Styling**: Tailwind CSS 4 + Tailwind‑merge + Tailwindcss‑animate
- **UI Primitives**: Radix UI (avatar, dialog, dropdown‑menu, label, progress, scroll‑area, select, separator, slot, tabs, tooltip)
- **Animations**: Framer Motion, GSAP
- **Authentication**: Firebase Auth (Google provider)
- **Database**: Firestore (via Firebase Admin SDK)
- **Backend**: Node.js (v18+) serverless functions in Next.js, Firebase Admin for privileged operations
- **Email**: Nodemailer + Resend
- **AI Integration**: `@ai-sdk/google` (Google Generative AI) for dynamic content generation
- **Analytics**: Vercel Analytics & custom real‑time stats
- **Deployment**: Vercel (auto‑deployment from GitHub)
- **Testing / Linting**: ESLint, TypeScript strict mode, Prettier

---

## 🌐 Live Demo

[https://mockrithm.vercel.app](https://mockrithm.vercel.app)

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (or yarn)

### Installation

```bash
git clone https://github.com/AhmedHussainCodes/Mockrithm.git
cd Mockrithm
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Configuration

Create a `.env` file (or copy `.env.example` if present) and set the following variables:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_service_account_email
GROQ_API_KEY=your_groq_api_key
GROQ_LLM_MODEL=llama-3.3-70b-versatile
SMTP_EMAIL=your_smtp_email
SMTP_PASSWORD="your_smtp_password"
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id
NEXT_PUBLIC_MAINTENANCE=false
```
These variables enable Google OAuth, Firebase admin access, AI content generation, and email notifications.

---

## 🤝 Contributing

Contributions are welcome! Fork the repository, create a feature branch, and submit a pull request with a clear description of your changes.

---

## 📄 License

This project is open source. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

- [Ahmed Hussain](https://github.com/AhmedHussainCodes)

---

> Made with ❤️ for learners, by learners.
