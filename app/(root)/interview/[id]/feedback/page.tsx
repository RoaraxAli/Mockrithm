import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

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
    ? dayjs(feedback.createdAt).format("MMM D, YYYY — h:mm A")
    : "N/A";

  const totalScore = feedback?.totalScore || 0;
  const averageWpm = feedback?.averageWpm || 140;

  return (
    <section className="max-w-5xl mx-auto flex flex-col gap-8 px-4 sm:px-6 py-8 font-mona-sans text-zinc-100 animate-fadeIn relative">
      
      {/* Title Header: Premium SaaS Report Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-[10px] font-bold tracking-wider text-violet-400 bg-violet-500/10 px-4 py-1.5 rounded-full border border-violet-500/20 uppercase shadow-sm">
          Performance Report
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white uppercase mt-1">
          Evaluation Analysis
        </h1>
        <p className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mt-0.5">
          Role: <span className="text-zinc-300 font-extrabold">{interview.role}</span>
        </p>
      </div>

      {/* Quick Stats Telemetry Ribbon */}
      <div className="flex flex-row justify-center mt-2">
        <div className="flex flex-row gap-4 items-center flex-wrap justify-center font-mono text-[10px]">
          {/* Rating */}
          <div className="flex flex-row gap-2.5 items-center backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 px-5 py-2.5 rounded-xl shadow-lg">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p className="text-zinc-400 uppercase tracking-wider font-semibold">
              Match Rating:{" "}
              <span className="text-violet-400 font-extrabold text-xs ml-1">
                {totalScore}% Match
              </span>
            </p>
          </div>

          {/* Timestamp */}
          <div className="flex flex-row gap-2.5 items-center backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 px-5 py-2.5 rounded-xl shadow-lg">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-zinc-400 uppercase tracking-wider font-semibold">
              Completed: <span className="text-zinc-300 ml-1 font-sans">{formattedDate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Executive Summary Panel */}
      <div className="p-7 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl shadow-2xl relative overflow-hidden group">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="size-4.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Executive Summary
        </h3>
        
        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 border border-zinc-900/60 p-5 rounded-xl">
          {feedback?.finalAssessment || "No summary assessment loaded."}
        </p>
      </div>

      {/* Speech Pacing Speedometer & Filler Word Telemetry Dials */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 backdrop-blur-xl bg-zinc-950/40 p-7 border border-zinc-900 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Speech Pacing Speedometer */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-2">
            <svg className="size-4.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Speech Pacing Cadence (WPM)
          </h3>
          
          <div className="flex items-center gap-5 sm:gap-6 mt-1 flex-wrap sm:flex-nowrap">
            {/* Holographic Speedometer Gauge */}
            <div className="relative size-24 flex items-center justify-center shrink-0">
              <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-zinc-900"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
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
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white leading-none">{averageWpm}</span>
                <span className="text-[7px] text-zinc-500 font-bold uppercase mt-1">WPM</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-[10px] font-bold uppercase text-zinc-300 tracking-wider">
                Cadence Status:{" "}
                <span className={
                  averageWpm >= 130 && averageWpm <= 150
                    ? "text-emerald-400 font-bold"
                    : ((averageWpm >= 110 && averageWpm < 130) || (averageWpm > 150 && averageWpm <= 170))
                    ? "text-cyan-400 font-bold"
                    : "text-rose-400 font-bold"
                }>
                  {averageWpm >= 130 && averageWpm <= 150
                    ? "Ideal Cadence"
                    : ((averageWpm >= 110 && averageWpm < 130) || (averageWpm > 150 && averageWpm <= 170))
                    ? "Acceptable Cadence"
                    : "Unbalanced Speed"}
                </span>
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
                {averageWpm < 110
                  ? "Speaking pace is slow. Introduce momentum to present strong confidence."
                  : averageWpm >= 110 && averageWpm < 130
                  ? "Measured, clear cadence. Increasing energy slightly could convey stronger confidence."
                  : averageWpm >= 130 && averageWpm <= 150
                  ? "Optimal speaking rate. Pacing aligns perfectly with elite communication benchmarks under pressure."
                  : averageWpm > 150 && averageWpm <= 170
                  ? "Slightly accelerated. Integrate pauses between arguments to maximize impact."
                  : "Rapid speaking pace. Deepen breathing cycles to throttle pacing."}
              </p>
            </div>
          </div>
        </div>

        {/* Filler Word Counter */}
        <div className="md:col-span-6 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0 md:pl-6">
          <h3 className="text-xs font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-2">
            <svg className="size-4.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Vocal Filler Diagnostics
          </h3>
          
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex flex-wrap gap-2">
              {feedback?.topFillerWords && feedback.topFillerWords.length > 0 ? (
                feedback.topFillerWords.map((item, index) => (
                  <span
                    key={index}
                    className="text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-rose-950/20 border border-rose-500/20 text-rose-400 flex items-center gap-2 shadow-sm"
                  >
                    <span>"{item.word}"</span>
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                      {item.count}x
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-sm">
                  ✓ No Vocal Fillers Detected
                </span>
              )}
            </div>
            
            <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
              Fillers like "um", "uh", or "like" reduce authority. Replacing these words with momentary silence projects superior intellectual composure.
            </p>
          </div>
        </div>
      </div>

      {/* Categories & Competencies score list */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-2.5">
          <span className="h-3.5 w-1 bg-violet-500 rounded-md" />
          Competency Matrices
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedback?.categoryScores?.map((category, index) => (
            <div 
              key={index} 
              className="p-5 backdrop-blur-xl bg-zinc-950/20 border border-zinc-900 rounded-2xl flex flex-col gap-3.5 relative overflow-hidden transition-all duration-300 hover:border-violet-500/30 shadow-xl group"
            >
              <div className="flex justify-between items-center text-xs font-bold text-white uppercase tracking-wider">
                <span className="truncate max-w-[190px]">{category.name}</span>
                <span className="text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-sm">
                  {category.score} / 100
                </span>
              </div>
              
              <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold bg-zinc-950/60 p-3 rounded-xl border border-zinc-900/60">
                {category.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        
        {/* Core Strengths */}
        <div className="p-6 backdrop-blur-xl bg-zinc-950/20 border border-zinc-900 rounded-2xl flex flex-col gap-4 relative overflow-hidden shadow-2xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Key Strengths
          </h3>
          
          <ul className="space-y-3">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="text-zinc-350 text-xs font-semibold flex items-start gap-2.5 leading-relaxed">
                <span className="text-emerald-400 font-bold text-sm leading-none mt-0.5">✓</span>
                <span className="text-zinc-400">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Optimizations */}
        <div className="p-6 backdrop-blur-xl bg-zinc-950/20 border border-zinc-900 rounded-2xl flex flex-col gap-4 relative overflow-hidden shadow-2xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            Recommended Improvements
          </h3>
          
          <ul className="space-y-3">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-zinc-350 text-xs font-semibold flex items-start gap-2.5 leading-relaxed">
                <span className="text-rose-400 font-bold text-sm leading-none mt-0.5">•</span>
                <span className="text-zinc-400">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons Deck */}
      <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center mt-6">
        <Button className="text-[10px] font-bold uppercase tracking-wider flex-1 rounded-xl h-12 bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-300 w-full shadow-2xl" asChild>
          <Link href="/">
            Back to Dashboard
          </Link>
        </Button>

        <Button className="text-[10px] font-bold uppercase tracking-wider flex-1 rounded-xl h-12 bg-white text-black hover:bg-zinc-200 transition-all duration-300 w-full shadow-2xl border border-white hover:shadow-[0_4px_25px_rgba(255,255,255,0.15)]" asChild>
          <Link href={`/interview/${id}`}>
            Retake Session
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
