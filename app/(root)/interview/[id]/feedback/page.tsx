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
    <section className="max-w-5xl mx-auto flex flex-col gap-8 px-4 sm:px-6 py-8 font-mona-sans text-slate-100 animate-fadeIn relative">
      
      {/* Title Header: Futuristic Dashboard Title */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded border border-cyan-500/30 uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          DIAGNOSTIC REPORT // MOCK-SYS-{id.slice(0, 6).toUpperCase()}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-mono leading-tight tracking-tight text-white uppercase mt-1">
          PERFORMANCE ASSESSMENT DOCKET
        </h1>
        <p className="text-xs font-mono text-slate-500 tracking-[0.2em] uppercase mt-0.5">
          SUBJECT PROTOCOL: <span className="text-slate-300 font-extrabold">{interview.role} EVALUATION</span>
        </p>
      </div>

      {/* Quick Stats Telemetry Ribbon */}
      <div className="flex flex-row justify-center mt-2">
        <div className="flex flex-row gap-4 items-center flex-wrap justify-center font-mono text-[10px]">
          {/* Rating */}
          <div className="flex flex-row gap-2.5 items-center backdrop-blur-xl bg-slate-950/60 border border-slate-800 px-5 py-2.5 rounded-lg shadow-2xl">
            <svg className="w-4 h-4 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p className="text-slate-400 uppercase tracking-widest font-bold">
              ACCURACY RATING:{" "}
              <span className="text-cyan-400 font-extrabold text-xs ml-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                {totalScore}% MATCH
              </span>
            </p>
          </div>

          {/* Timestamp */}
          <div className="flex flex-row gap-2.5 items-center backdrop-blur-xl bg-slate-950/60 border border-slate-800 px-5 py-2.5 rounded-lg shadow-2xl">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-400 uppercase tracking-widest font-bold">
              STAMPED: <span className="text-slate-300 ml-1">{formattedDate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Executive Summary Panel */}
      <div className="p-7 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
        {/* Cyber accents */}
        <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-slate-700" />
        <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-slate-700" />
        <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-slate-700" />
        <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-slate-700" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
        
        <h3 className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <svg className="size-4.5 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI EXECUTIVE ASSESSMENT MATRIX
        </h3>
        
        <p className="text-xs sm:text-sm text-cyan-100 font-mono leading-relaxed bg-slate-950 border border-slate-900 p-5 rounded-xl">
          &gt;&gt; {feedback?.finalAssessment || "No summary assessment loaded. Establish active cognitive links to seed parameters."}
        </p>
      </div>

      {/* Speech Pacing Speedometer & Filler Word Telemetry Dials */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 backdrop-blur-xl bg-slate-950/70 p-7 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Cyber accents */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800 pointer-events-none" />
        <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-slate-700" />
        <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-slate-700" />
        <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-slate-700" />
        <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-slate-700" />

        {/* Speech Pacing Speedometer */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <h3 className="text-[10px] font-mono font-bold text-slate-300 tracking-[0.15em] uppercase flex items-center gap-2">
            <svg className="size-4.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            SPEECH PACING CADENCE (WPM)
          </h3>
          
          <div className="flex items-center gap-5 sm:gap-6 mt-1 flex-wrap sm:flex-nowrap">
            {/* Holographic Speedometer Gauge */}
            <div className="relative size-24 flex items-center justify-center shrink-0">
              <svg className="size-full transform -rotate-90 drop-shadow-[0_0_12px_rgba(6,182,212,0.2)]" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-900"
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
                <span className="text-2xl font-mono font-bold text-white leading-none">{averageWpm}</span>
                <span className="text-[7px] text-slate-500 font-mono font-bold uppercase mt-1">WPM</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 font-mono">
              <span className="text-[10px] font-bold uppercase text-slate-300 tracking-wider">
                CADENCE PROTOCOL:{" "}
                <span className={
                  averageWpm >= 130 && averageWpm <= 150
                    ? "text-emerald-400 font-bold"
                    : ((averageWpm >= 110 && averageWpm < 130) || (averageWpm > 150 && averageWpm <= 170))
                    ? "text-cyan-400 font-bold"
                    : "text-rose-400 font-bold"
                }>
                  {averageWpm >= 130 && averageWpm <= 150
                    ? "IDEAL CADENCE"
                    : ((averageWpm >= 110 && averageWpm < 130) || (averageWpm > 150 && averageWpm <= 170))
                    ? "ACCEPTABLE CADENCE"
                    : "UNBALANCED SPEED"}
                </span>
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                {averageWpm < 110
                  ? "Verbal output pace is slow. Introduce momentum to present proactive leadership during live dialog."
                  : averageWpm >= 110 && averageWpm < 130
                  ? "Deliberate, measured cadence. High clarity, but slightly increasing energy could convey stronger confidence."
                  : averageWpm >= 130 && averageWpm <= 150
                  ? "Optimal speaking rate. Pacing aligns perfectly with elite communication benchmarks under pressure."
                  : averageWpm > 150 && averageWpm <= 170
                  ? "Slightly accelerated. Integrate intentional pauses between key arguments to maximize impact."
                  : "Rapid speech rate. Rushing details can dilute key points. Deepen breathing cycles to throttle pacing."}
              </p>
            </div>
          </div>
        </div>

        {/* Filler Word Counter */}
        <div className="md:col-span-6 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-900 pt-4 md:pt-0 md:pl-6">
          <h3 className="text-[10px] font-mono font-bold text-slate-300 tracking-[0.15em] uppercase flex items-center gap-2">
            <svg className="size-4.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            FILLER VOCABULARY TELEMETRY
          </h3>
          
          <div className="flex flex-col gap-3.5 mt-1 font-mono">
            <div className="flex flex-wrap gap-2">
              {feedback?.topFillerWords && feedback.topFillerWords.length > 0 ? (
                feedback.topFillerWords.map((item, index) => (
                  <span
                    key={index}
                    className="text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded bg-rose-950/20 border border-rose-500/25 text-rose-400 flex items-center gap-2 shadow-sm"
                  >
                    <span>"{item.word.toUpperCase()}"</span>
                    <span className="bg-rose-500 text-black text-[9px] px-1.5 py-0.5 rounded font-black">
                      {item.count}X
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-sm">
                  ✓ NO VOCAL FILLERS DETECTED
                </span>
              )}
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              Vocal fillers like "um", "uh", or "like" diminish presentation authority. Replacing these words with momentary silence projects superior intellectual composure.
            </p>
          </div>
        </div>

      </div>

      {/* Categories & Competencies score list */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-400 uppercase flex items-center gap-2.5">
          <span className="h-3 w-1 bg-cyan-500 rounded-md" />
          COGNITIVE COMPETENCY MATRICES
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedback?.categoryScores?.map((category, index) => (
            <div 
              key={index} 
              className="p-5 backdrop-blur-xl bg-slate-950/50 border border-slate-900 rounded-2xl flex flex-col gap-3.5 relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30 font-mono shadow-xl group"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
              {/* Corner Indicators */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-slate-800 group-hover:border-cyan-500/40" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-slate-800 group-hover:border-cyan-500/40" />

              <div className="flex justify-between items-center text-xs font-bold text-white uppercase tracking-wider">
                <span className="truncate max-w-[190px]">{category.name}</span>
                <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded text-[9px] font-bold shadow-sm">
                  {category.score} / 100
                </span>
              </div>
              
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold bg-slate-950 p-3 rounded-lg border border-slate-900/60">
                {category.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        
        {/* Core Strengths */}
        <div className="p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col gap-4 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-800/30" />
          
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            CONFIRMED TECHNICAL PROWESS
          </h3>
          
          <ul className="space-y-3">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="text-slate-300 text-xs font-semibold flex items-start gap-2.5 leading-relaxed">
                <span className="text-emerald-400 font-bold text-sm leading-none mt-0.5">✓</span>
                <span className="text-slate-400 font-sans">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Optimizations */}
        <div className="p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col gap-4 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-rose-800/30" />
          
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            DIAGNOSTIC ADVISORY OPTIMIZATIONS
          </h3>
          
          <ul className="space-y-3">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-slate-300 text-xs font-semibold flex items-start gap-2.5 leading-relaxed">
                <span className="text-rose-400 font-bold text-sm leading-none mt-0.5">!</span>
                <span className="text-slate-400 font-sans">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons Deck */}
      <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center mt-6">
        <Button className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] flex-1 rounded-md h-12 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white transition-all duration-300 w-full shadow-2xl" asChild>
          <Link href="/">
            &lt;&lt; BACK TO PORTAL
          </Link>
        </Button>

        <Button className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] flex-1 rounded-md h-12 bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 w-full shadow-2xl border border-cyan-400/40" asChild>
          <Link href={`/interview/${id}`}>
            RE-CALIBRATE COGNITIVE SESSION &gt;&gt;
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
