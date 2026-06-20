declare module 'lucide-react';

interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
  averageWpm?: number;
  topFillerWords?: Array<{ word: string; count: number }>;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
  resumeText?: string;
  jobDescription?: string;
  firstMessage?: string;
  codingProblem?: {
    title: string;
    description: string;
    templateCode: string;
    language: string;
  } | null;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
  averageWpm?: number;
  topFillerWords?: { word: string; count: number }[];
}

interface User {
  name: string;
  email: string;
  id: string;
  role?: string;
  resumeLink?: string;
  profileURL?: string;
  imageUrl?: string;
  tier?: "freemium" | "premium" | "pro";
  billingInterval?: "monthly" | "annual" | "lifetime";
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
  profileImage?: string;
  firstMessage?: string;
  codingProblem?: {
    title: string;
    description: string;
    templateCode: string;
    language: string;
  } | null;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
  uid?: string;
  displayName?: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}
