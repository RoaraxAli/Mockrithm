"use client";

import dynamic from "next/dynamic";

const ResumeTailoringEngine = dynamic(
  () => import("@/components/ResumeTailoringEngine"),
  {
    loading: () => (
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        <div className="w-full backdrop-blur-md bg-slate-950/40 border border-slate-900 rounded-2xl p-6 shadow-xl h-20 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl h-96 animate-pulse" />
          <div className="md:col-span-4 backdrop-blur-xl bg-slate-950/40 border border-slate-900 rounded-2xl h-48 animate-pulse" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

interface ResumeEngineWrapperProps {
  userId: string;
  userName: string;
}

export function ResumeEngineWrapper({ userId, userName }: ResumeEngineWrapperProps) {
  return <ResumeTailoringEngine userId={userId} userName={userName} />;
}
