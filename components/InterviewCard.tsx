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
      themeColor: "from-zinc-500/5 to-transparent",
      borderColor: "group-hover:border-zinc-700",
      textTheme: "text-white border-zinc-800 bg-zinc-900/60",
      pulseColor: "bg-white",
    },
    Technical: {
      label: "Technical Protocol",
      themeColor: "from-zinc-550/5 to-transparent",
      borderColor: "group-hover:border-zinc-750",
      textTheme: "text-zinc-300 border-zinc-800 bg-zinc-900/40",
      pulseColor: "bg-zinc-400",
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
    <div className="w-[340px] max-sm:w-full min-h-[250px] relative flex items-stretch font-mona-sans group">
      {/* Premium Glassmorphic Card Container */}
      <div className="backdrop-blur-2xl bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-4.5 w-full flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden group-hover:-translate-y-1.5 group-hover:border-zinc-700 group-hover:shadow-[0_20px_40px_rgba(124,58,237,0.08)]">
        
        {/* Ambient Gradient Glow */}
        <div className={`absolute -inset-px bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ${typeConfig.themeColor}`} />

        <div className="relative z-10 flex flex-col gap-3">
          {/* Top Panel: Cover + Title / Meta */}
          <div className="flex gap-3 items-center">
            {/* Compact Profile/Cover Ring */}
            <div className="relative group-hover:scale-105 transition-transform duration-500 shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 group-hover:from-violet-500 group-hover:to-cyan-400 p-[1px] transition-all duration-500" />
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-900">
                <Image
                  src={getRandomInterviewCover()}
                  alt="interview-cover"
                  fill
                  sizes="44px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Title / Meta */}
            <div className="flex-1 min-w-0">
              <h3 className="capitalize text-sm font-bold text-white tracking-wide truncate group-hover:text-violet-400 transition-colors duration-300">
                {role}
              </h3>
              <div className="flex gap-1.5 items-center mt-0.5">
                <span className="text-[9px] font-semibold text-zinc-500 truncate">
                  {formattedDate}
                </span>
                <span className="text-[8px] text-zinc-650 font-bold">&bull;</span>
                <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-md border tracking-wide uppercase ${typeConfig.textTheme}`}>
                  {typeConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Assessment Body (line-clamp to prevent height blowout) */}
          <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2 min-h-[34px] border-t border-zinc-900/60 pt-2.5">
            {feedback?.finalAssessment ||
              "Analyze code structure, verbal pacing, filler word frequency, and technical accuracy with AI."}
          </p>

          {/* Compact Metrics Panel */}
          <div className="grid grid-cols-2 gap-2 bg-zinc-900/10 border border-zinc-900/60 rounded-xl p-2.5">
            <div className="flex flex-col justify-center">
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {feedback ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Completed</span>
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Available</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Score</span>
                <span className={`text-[9px] font-bold tracking-wider ${feedback ? "text-white font-black" : "text-zinc-500"}`}>
                  {feedback ? `${matchPercentage}%` : "---"}
                </span>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-white transition-all duration-1000"
                  style={{ width: `${feedback ? matchPercentage : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions & details */}
        <div className="flex flex-row justify-between items-center mt-3 pt-3 border-t border-zinc-900/60 gap-3 relative z-10">
          <div className="relative group/tech">
            <DisplayTechIcons techStack={techstack} />
          </div>

          <Button
            className={`font-semibold text-[9px] uppercase tracking-wider h-8 rounded-lg transition-all duration-300 px-4 border ${
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
                <span className="flex items-center gap-1">
                  Report
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Practice
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
