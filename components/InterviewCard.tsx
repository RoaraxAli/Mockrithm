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
      label: "BEHAVIORAL DOCKET",
      themeColor: "bg-emerald-950/10",
      borderColor: "group-hover:border-emerald-500/40",
      textTheme: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      pulseColor: "bg-emerald-400",
    },
    Mixed: {
      label: "MIXED SYSTEM DIAG",
      themeColor: "bg-indigo-950/10",
      borderColor: "group-hover:border-violet-500/40",
      textTheme: "text-violet-400 border-violet-500/30 bg-violet-500/10",
      pulseColor: "bg-violet-400",
    },
    Technical: {
      label: "TECHNICAL PROTOCOL",
      themeColor: "bg-cyan-950/10",
      borderColor: "group-hover:border-cyan-500/40",
      textTheme: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
      pulseColor: "bg-cyan-400",
    },
  }[normalizedType as "Behavioral" | "Mixed" | "Technical"] || {
    label: "SYS-OP EVALUATION",
    themeColor: "bg-slate-900/10",
    borderColor: "group-hover:border-indigo-500/40",
    textTheme: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    pulseColor: "bg-indigo-400",
  };

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const matchPercentage = feedback?.totalScore || 0;

  return (
    <div className="w-[360px] max-sm:w-full min-h-[420px] relative flex items-stretch font-mona-sans group">
      {/* Outer Hologram Card with Cyberpunk Accents */}
      <div className="backdrop-blur-xl bg-slate-950/75 border border-slate-800 rounded-md p-6 w-full flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_50px_rgba(6,182,212,0.1)]">
        
        {/* Futuristic Corner HUD Markers */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-700 group-hover:border-cyan-500 transition-colors duration-300" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-700 group-hover:border-cyan-500 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-700 group-hover:border-cyan-500 transition-colors duration-300" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-700 group-hover:border-cyan-500 transition-colors duration-300" />

        {/* Dynamic Colored Core Background Mask */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          typeConfig.themeColor
        )} />

        <div className="relative z-10">
          {/* Top Panel Docket Tag */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[9px] font-mono tracking-[0.2em] text-slate-400 flex items-center gap-1.5 uppercase">
              <span className="relative flex h-2 w-2">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", typeConfig.pulseColor)}></span>
                <span className={cn("relative inline-flex rounded-full h-2 w-2", typeConfig.pulseColor)}></span>
              </span>
              LOG // {formattedDate}
            </span>

            <span className={cn(
              "px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded border uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)]",
              typeConfig.textTheme
            )}>
              {typeConfig.label}
            </span>
          </div>

          {/* Cybernetic Profile/Cover Ring */}
          <div className="relative flex justify-center mb-6">
            <div className="relative">
              {/* Outer rotating bracket crosshair */}
              <div className="absolute -inset-3 border border-dashed border-cyan-500/30 rounded-full animate-[spin_40s_linear_infinite] group-hover:border-cyan-400/50" />
              {/* Inner fast-spinning brackets */}
              <div className="absolute -inset-1.5 border border-dashed border-violet-500/40 rounded-full animate-[spin_12s_linear_infinite_reverse] group-hover:border-violet-400/60" />
              
              {/* Hexagonal corner grid brackets */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-cyan-400" />

              <div className="relative w-[76px] h-[76px] rounded-full overflow-hidden bg-slate-900 border border-slate-700/60 group-hover:border-cyan-400 transition-all duration-300">
                <Image
                  src={getRandomInterviewCover()}
                  alt="interview-cover"
                  fill
                  sizes="76px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Diagonal grid overlay */}
                <div className="absolute inset-0 bg-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Interview Role Header */}
          <h3 className="capitalize text-lg font-bold text-white tracking-wide text-center group-hover:text-cyan-300 transition-colors duration-300">
            {role} Assessment
          </h3>
          <p className="text-[10px] font-mono text-cyan-400/80 text-center tracking-widest mt-1 mb-5">
            [IDENT: MOCK-SYS-{interviewId.slice(0, 6).toUpperCase()}]
          </p>

          {/* Telemetry Widgets Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Session Status Gauge */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors duration-300">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">DIAG STATUS</span>
              <div className="flex items-center gap-1.5 mt-1">
                {feedback ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">COMPLETED</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-amber-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.28 15" />
                    </svg>
                    <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider">UNRESOLVED</span>
                  </>
                )}
              </div>
            </div>

            {/* Performance Match Accuracy */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors duration-300">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">EVAL SCORE</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-xs font-mono font-bold tracking-wider",
                  feedback ? "text-cyan-400" : "text-slate-500"
                )}>
                  {feedback ? `${matchPercentage}%` : "00.0%"}
                </span>
                {/* Mini bar indicator */}
                <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-1000"
                    style={{ width: `${feedback ? matchPercentage : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Assessment Body */}
          <p className="mt-5 text-xs text-slate-400 font-medium leading-relaxed min-h-[48px] text-center border-t border-b border-slate-900 py-3 group-hover:text-slate-200 transition-colors duration-300">
            {feedback?.finalAssessment ||
              "Initiate AI assessment of socratic code architecture, technical responses, and speech speed pacing."}
          </p>
        </div>

        {/* Footer actions & details */}
        <div className="flex flex-row justify-between items-center mt-6 pt-4 border-t border-slate-900 gap-3 relative z-10">
          <div className="relative group/tech">
            <DisplayTechIcons techStack={techstack} />
          </div>

          <Button
            className={cn(
              "font-mono text-[9px] font-bold uppercase tracking-[0.15em] h-9 rounded-md transition-all duration-300 relative overflow-hidden px-5 shadow-2xl border",
              feedback
                ? "bg-slate-900 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-cyan-500 border-cyan-400 text-black font-extrabold hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            )}
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
                  ANALYZE
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  INITIALIZE
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
