import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";
import { 
  Terminal, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  Award, 
  Clock, 
  RotateCw, 
  ArrowRight,
  Code,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const formattedDate = feedback?.createdAt
    ? dayjs(feedback.createdAt).format("YYYY-MM-DD HH:mm:ss")
    : "N/A";

  const totalScore = feedback?.totalScore || 0;
  const averageWpm = feedback?.averageWpm || 140;

  // Rating coloring and tags
  const ratingColor = totalScore >= 80 ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                      totalScore >= 60 ? "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" :
                      totalScore >= 40 ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                      "text-rose-400 border-rose-500/20 bg-rose-500/5";

  const ratingTag = totalScore >= 80 ? "CRITICAL_FIT" :
                    totalScore >= 60 ? "STABLE_MATCH" :
                    totalScore >= 40 ? "ATTEMPTED_MATCH" :
                    "INSUFFICIENT_DATA";

  return (
    <section className="max-w-5xl mx-auto flex flex-col gap-6 px-4 sm:px-6 py-8 font-mono text-zinc-100 animate-fadeIn relative">
      
      {/* Title Header: Premium Cyber HUD Header */}
      <div className="flex flex-col items-center text-center gap-2 border-b border-zinc-800 pb-6 relative overflow-hidden bg-black/35 p-6 rounded-xl border">
        {/* Neon decorative scanner */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-[pulse_2s_infinite]" />
        
        <span className="text-[9px] font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/25 uppercase font-mono shadow-sm flex items-center gap-1.5">
          <Terminal className="size-3 animate-[pulse_1s_infinite]" /> SYSTEM_DIAGNOSTIC: 0x8F5
        </span>
        <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-widest text-white uppercase mt-1 font-mono">
          EVALUATION_REPORT
        </h1>
        <p className="text-[10px] font-bold text-zinc-550 tracking-wider uppercase mt-0.5">
          NODE_ROLE: <span className="text-zinc-200 font-extrabold">{interview.role}</span>
        </p>
      </div>

      {/* Quick Stats Telemetry Ribbon */}
      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-4 items-center flex-wrap justify-center font-mono text-[9px]">
          {/* Match Rating Card */}
          <div className={cn("flex flex-row gap-2.5 items-center backdrop-blur-xl border px-4 py-2 rounded shadow-lg", ratingColor)}>
            <Award className="w-3.5 h-3.5" />
            <p className="uppercase tracking-wider font-semibold">
              MATCH_RATING:{" "}
              <span className="font-extrabold ml-1">
                {totalScore}% ({ratingTag})
              </span>
            </p>
          </div>

          {/* Timestamp */}
          <div className="flex flex-row gap-2.5 items-center backdrop-blur-xl bg-black/40 border border-zinc-800 px-4 py-2 rounded shadow-lg text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-550" />
            <p className="uppercase tracking-wider font-semibold">
              UTC_TIMESTAMP: <span className="text-zinc-300 ml-1">{formattedDate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Executive Summary Panel */}
      <div className="border border-zinc-800/80 rounded-xl shadow-2xl relative overflow-hidden bg-black/40 backdrop-blur-xl">
        {/* Terminal Header */}
        <div className="flex px-4 py-2.5 border-b border-zinc-800/80 text-[10px] text-zinc-500 font-semibold justify-between items-center bg-zinc-950/60 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            <span className="ml-1.5 text-zinc-400 font-bold">executive_summary.log</span>
          </div>
          <span className="text-[8px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
            STABLE_READ
          </span>
        </div>
        
        <div className="p-5">
          <p className="text-xs text-zinc-300 leading-relaxed bg-black/25 border border-zinc-850 p-4 rounded select-text">
            {feedback?.finalAssessment || "No summary assessment loaded."}
          </p>
        </div>
      </div>

      {/* Submitted Sandbox Code Panel */}
      {feedback?.candidateCode && (
        <div className="border border-zinc-800/80 rounded-xl shadow-2xl relative overflow-hidden bg-black/40 backdrop-blur-xl flex flex-col">
          {/* IDE Top Window Bar */}
          <div className="flex px-4 py-2.5 border-b border-zinc-800/80 text-[10px] text-zinc-500 font-semibold flex-row justify-between items-center bg-zinc-955/60">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
              <span className="ml-2 text-zinc-400 font-bold flex items-center gap-1.5">
                <Code className="size-3 text-cyan-400" /> workspace_solution.txt
              </span>
            </div>
            <span className="text-[8px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              SAVED
            </span>
          </div>
          
          <div className="p-4">
            <pre className="text-xs text-zinc-300 font-mono p-4 overflow-x-auto max-h-[320px] custom-scrollbar leading-relaxed bg-black/60 border border-zinc-850 rounded select-text">
              <code>{feedback.candidateCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Speech Pacing Speedometer & Filler Word Telemetry Dials */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-black/40 border border-zinc-800/80 rounded-xl shadow-2xl relative overflow-hidden p-6 backdrop-blur-xl">
        {/* Speech Pacing Speedometer */}
        <div className="md:col-span-6 flex flex-col gap-3 font-mono">
          <h3 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-2">
            <Activity className="size-3.5 text-cyan-400" />
            speech_pacing_cadence
          </h3>
          
          <div className="flex items-center gap-5 sm:gap-6 mt-1 flex-wrap sm:flex-nowrap">
            {/* Holographic Speedometer Gauge */}
            <div className="relative size-20 flex items-center justify-center shrink-0">
              <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-zinc-900"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    averageWpm >= 130 && averageWpm <= 150
                      ? "stroke-emerald-400"
                      : ((averageWpm >= 110 && averageWpm < 130) || (averageWpm > 150 && averageWpm <= 170))
                      ? "stroke-cyan-400"
                      : "stroke-rose-400"
                  }
                  strokeWidth="3.5"
                  strokeDasharray={`${Math.min(100, Math.round((averageWpm / 200) * 100))}, 100`}
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center font-mono">
                <span className="text-xl font-black text-white leading-none">{averageWpm}</span>
                <span className="text-[6px] text-zinc-550 font-bold uppercase mt-1">WPM</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <span className="text-[9px] font-bold uppercase text-zinc-350 tracking-wider">
                status:{" "}
                <span className={
                  averageWpm >= 130 && averageWpm <= 150
                    ? "text-emerald-400 font-bold"
                    : ((averageWpm >= 110 && averageWpm < 130) || (averageWpm > 150 && averageWpm <= 170))
                    ? "text-cyan-400 font-bold"
                    : "text-rose-400 font-bold"
                }>
                  {averageWpm >= 130 && averageWpm <= 150
                    ? "IDEAL_PACE"
                    : ((averageWpm >= 110 && averageWpm < 130) || (averageWpm > 150 && averageWpm <= 170))
                    ? "STABLE_PACE"
                    : "OUT_OF_BOUNDS"}
                </span>
              </span>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold">
                {averageWpm < 110
                  ? "Cadence is slower than standard speed. Speak with steady momentum to convey clarity."
                  : averageWpm >= 110 && averageWpm < 130
                  ? "Clear cadence. Practice speaking slightly faster to build dynamic energy."
                  : averageWpm >= 130 && averageWpm <= 150
                  ? "Optimal conversational speed! Aligns with elite professional metrics."
                  : "Rapid speaking pace. Deepen breathing cycles and pause between core arguments."}
              </p>
            </div>
          </div>
        </div>

        {/* Filler Word Counter */}
        <div className="md:col-span-6 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-zinc-800/80 pt-4 md:pt-0 md:pl-6 font-mono">
          <h3 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-cyan-400" />
            vocal_filler_diagnostics
          </h3>
          
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex flex-wrap gap-2">
              {feedback?.topFillerWords && feedback.topFillerWords.length > 0 ? (
                feedback.topFillerWords.map((item, index) => (
                  <span
                    key={index}
                    className="text-[8px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2"
                  >
                    <span>"{item.word.toUpperCase()}"</span>
                    <span className="bg-rose-500/20 text-rose-300 text-[8px] px-1 rounded font-black">
                      {item.count}X
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-[8px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 font-mono">
                  ✓ NO_VOCAL_FILLERS_DETECTED
                </span>
              )}
            </div>
            
            <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold">
              Vocal fillers reduce professional composure. Swap fillers with brief tactical pauses to increase conversational impact.
            </p>
          </div>
        </div>
      </div>

      {/* Categories & Competencies score list */}
      <div className="flex flex-col gap-3 font-mono">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-2">
          <Cpu className="size-3.5 text-cyan-400" />
          COMPETENCY_MATRICES
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedback?.categoryScores?.map((category, index) => {
            const isComm = category.name.toLowerCase().includes("comm");
            const isTech = category.name.toLowerCase().includes("tech") || category.name.toLowerCase().includes("know");
            const isProb = category.name.toLowerCase().includes("prob") || category.name.toLowerCase().includes("solve");
            const isCult = category.name.toLowerCase().includes("cult") || category.name.toLowerCase().includes("fit");

            const borderClass = isComm ? "hover:border-violet-500/40" :
                                isTech ? "hover:border-emerald-500/40" :
                                isProb ? "hover:border-pink-500/40" :
                                isCult ? "hover:border-cyan-500/40" :
                                "hover:border-amber-500/40";

            const badgeColor = isComm ? "text-violet-400 bg-violet-500/10 border-violet-500/20" :
                               isTech ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                               isProb ? "text-pink-400 bg-pink-500/10 border-pink-500/20" :
                               isCult ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" :
                               "text-amber-400 bg-amber-500/10 border-amber-500/20";

            const barColor = isComm ? "bg-violet-400" :
                             isTech ? "bg-emerald-400" :
                             isProb ? "bg-pink-400" :
                             isCult ? "bg-cyan-400" :
                             "bg-amber-400";

            return (
              <div 
                key={index} 
                className={cn(
                  "p-4.5 bg-black/40 border border-zinc-800/80 rounded-xl flex flex-col gap-3 relative overflow-hidden transition-all duration-300 shadow-xl",
                  borderClass
                )}
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                  <span className="truncate max-w-[190px]">{category.name}</span>
                  <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold border font-mono", badgeColor)}>
                    {category.score}/100
                  </span>
                </div>

                {/* Cyber progress bar */}
                <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", barColor)}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                
                <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold bg-black/20 p-2.5 rounded border border-zinc-850">
                  {category.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        
        {/* Core Strengths */}
        <div className="p-5 bg-black/40 border border-zinc-800/80 rounded-xl flex flex-col gap-3 relative overflow-hidden shadow-2xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2 border-b border-zinc-800/80 pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            STRENGTHS_STDOUT
          </h3>
          
          <ul className="space-y-2">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="text-zinc-350 text-[10px] font-semibold flex items-start gap-2 leading-relaxed">
                <CheckCircle2 className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-zinc-400">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Optimizations */}
        <div className="p-5 bg-black/40 border border-zinc-800/80 rounded-xl flex flex-col gap-3 relative overflow-hidden shadow-2xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-2 border-b border-zinc-800/80 pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            RECOMMENDED_OPTIMIZATIONS
          </h3>
          
          <ul className="space-y-2">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-zinc-350 text-[10px] font-semibold flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="size-3 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-zinc-400">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons Deck */}
      <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center mt-4 font-mono">
        <Button className="text-[10px] font-bold uppercase tracking-wider flex-1 rounded h-11 bg-black/40 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300 w-full shadow-2xl" asChild>
          <Link href="/">
            <Terminal className="size-3.5 mr-2 text-cyan-400" /> RETURN_DASHBOARD
          </Link>
        </Button>

        <Button className="text-[10px] font-bold uppercase tracking-wider flex-1 rounded h-11 bg-white text-black hover:bg-zinc-200 transition-all duration-300 w-full shadow-2xl border border-white hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)]" asChild>
          <Link href={`/interview/${id}`}>
            <RotateCw className="size-3.5 mr-2 animate-[spin_4s_linear_infinite]" /> RESTART_SESSION
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
