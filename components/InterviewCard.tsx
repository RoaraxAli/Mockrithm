import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
}: InterviewCardProps & { feedback?: any }) => {

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const typeConfig = {
    Behavioral: {
      label: "Behavioral",
      themeColor: "from-emerald-500/5 to-transparent",
      borderColor: "group-hover:border-emerald-500/30",
      textTheme: "text-emerald-400 border-emerald-500/10 bg-emerald-500/5",
      pulseColor: "bg-emerald-400",
    },
    Mixed: {
      label: "Mixed Session",
      themeColor: "from-violet-500/5 to-transparent",
      borderColor: "group-hover:border-violet-500/30",
      textTheme: "text-violet-400 border-violet-500/10 bg-violet-500/5",
      pulseColor: "bg-violet-400",
    },
    Technical: {
      label: "Technical Protocol",
      themeColor: "from-cyan-500/5 to-transparent",
      borderColor: "group-hover:border-cyan-500/30",
      textTheme: "text-cyan-400 border-cyan-500/10 bg-cyan-500/5",
      pulseColor: "bg-cyan-400",
    },
  }[normalizedType as "Behavioral" | "Mixed" | "Technical"] || {
    label: "Practice Session",
    themeColor: "from-zinc-500/5 to-transparent",
    borderColor: "group-hover:border-zinc-500/30",
    textTheme: "text-zinc-400 border-zinc-500/10 bg-zinc-500/5",
    pulseColor: "bg-zinc-400",
  };

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMMM D, YYYY");

  const matchPercentage = feedback?.totalScore || 0;

  return (
    <div className="w-[360px] max-sm:w-full min-h-[420px] relative flex items-stretch font-mona-sans group">
      {/* Premium Glassmorphic Card Container */}
      <div className="backdrop-blur-2xl bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-6 w-full flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden group-hover:-translate-y-1.5 group-hover:border-zinc-700 group-hover:shadow-[0_20px_40px_rgba(124,58,237,0.08)]">
        
        {/* Ambient Gradient Glow */}
        <div className={`absolute -inset-px bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ${typeConfig.themeColor}`} />

        <div className="relative z-10">
          {/* Top Panel metadata */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${typeConfig.pulseColor}`} />
              {formattedDate}
            </span>

            <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full border tracking-wide uppercase ${typeConfig.textTheme}`}>
              {typeConfig.label}
            </span>
          </div>

          {/* Premium Profile/Cover Ring */}
          <div className="relative flex justify-center mb-6">
            <div className="relative group-hover:scale-105 transition-transform duration-500">
              {/* Outer soft glowing halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-violet-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
              
              {/* Inner Border Ring */}
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 group-hover:from-violet-500 group-hover:to-cyan-400 p-[1px] transition-all duration-500" />

              <div className="relative w-[76px] h-[76px] rounded-full overflow-hidden bg-zinc-900">
                <Image
                  src={getRandomInterviewCover()}
                  alt="interview-cover"
                  fill
                  sizes="76px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Interview Role Header */}
          <h3 className="capitalize text-lg font-bold text-white tracking-wide text-center group-hover:text-violet-400 transition-colors duration-300">
            {role}
          </h3>
          <p className="text-[11px] text-zinc-500 text-center tracking-wide mt-1 mb-5">
            Voice Evaluation Practice
          </p>

          {/* Metrics Panel Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Session Status Gauge */}
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-3 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Status</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                {feedback ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Completed</span>
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Available</span>
                  </>
                )}
              </div>
            </div>

            {/* Performance Match Accuracy */}
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-3 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-300">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Match Score</span>
              <div className="flex flex-col gap-1.5 mt-1.5">
                <span className={`text-[10px] font-bold tracking-wider ${feedback ? "text-violet-400" : "text-zinc-500"}`}>
                  {feedback ? `${matchPercentage}%` : "Not Started"}
                </span>
                {/* Mini bar indicator */}
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 transition-all duration-1000"
                    style={{ width: `${feedback ? matchPercentage : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Assessment Body */}
          <p className="mt-5 text-xs text-zinc-400 leading-relaxed min-h-[48px] text-center border-t border-b border-zinc-900/80 py-3.5 group-hover:text-zinc-300 transition-colors duration-300">
            {feedback?.finalAssessment ||
              "Analyze code structure, verbal pacing, filler word frequency, and technical accuracy with AI."}
          </p>
        </div>

        {/* Footer actions & details */}
        <div className="flex flex-row justify-between items-center mt-6 pt-4 border-t border-zinc-900/80 gap-3 relative z-10">
          <div className="relative group/tech">
            <DisplayTechIcons techStack={techstack} />
          </div>

          <Button
            className={`font-semibold text-[10px] uppercase tracking-wider h-9 rounded-xl transition-all duration-300 px-5 border ${
              feedback
                ? "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
                : "bg-white text-black font-bold hover:bg-zinc-200 border-white hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
            }`}
            asChild
          >
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? (
                <span className="flex items-center gap-1.5">
                  Report
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Start Session
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
