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
    ? dayjs(feedback.createdAt).format("YYYY.MM.DD HH:mm:ss")
    : "N/A";

  const totalScore = feedback?.totalScore || 0;
  const averageWpm = feedback?.averageWpm || 140;

  return (
    <section className="max-w-4xl mx-auto flex flex-col gap-10 px-4 sm:px-6 py-12 font-mono text-zinc-300 animate-fadeIn relative bg-black select-text selection:bg-zinc-800 selection:text-white">
      
      {/* Stark Editorial Header */}
      <div className="flex flex-col items-start gap-4 border-b border-zinc-800 pb-8">
        <div className="flex justify-between items-center w-full text-[10px] text-zinc-550 uppercase tracking-widest font-bold">
          <span>assessment_report // id: {id.slice(0, 8)}</span>
          <span>utc: {formattedDate}</span>
        </div>
        
        <div className="flex flex-col gap-2 mt-2">
          <h1 className="text-4xl sm:text-6xl font-normal text-white uppercase tracking-tight font-serif leading-none">
            Evaluation Analysis
          </h1>
          <p className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase">
            TARGET_ROLE / <span className="text-white underline decoration-zinc-700 underline-offset-4">{interview.role.toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* Hero Match Rating Block - Stark Monochrome Statement */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-zinc-800 pb-10">
        <div className="sm:col-span-1 flex flex-col justify-center p-6 border border-zinc-800 rounded bg-zinc-950/40">
          <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest">match_rating</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-6xl font-normal font-serif text-white leading-none">{totalScore}</span>
            <span className="text-lg text-zinc-500 font-serif">%</span>
          </div>
          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-3 border-t border-zinc-900 pt-2 block">
            {totalScore >= 80 ? "status: critical_fit" :
             totalScore >= 60 ? "status: stable_match" :
             totalScore >= 40 ? "status: partial_match" :
             "status: weak_match"}
          </span>
        </div>

        {/* Short meta metadata cards */}
        <div className="sm:col-span-2 flex flex-col justify-between gap-4">
          <div className="p-5 border border-zinc-800 rounded bg-zinc-950/20 flex-1 flex flex-col justify-center">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest">executive_summary</span>
            <p className="text-xs text-zinc-400 leading-relaxed mt-2.5 line-clamp-3">
              {feedback?.finalAssessment || "No summary assessment loaded."}
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary Log (Full Read) */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-10">
        <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          <span>01 / assessment_details.txt</span>
          <span>read_only</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/30 p-6 border border-zinc-900 rounded select-text">
          {feedback?.finalAssessment || "No summary assessment loaded."}
        </p>
      </div>

      {/* Submitted Sandbox Code Panel */}
      {feedback?.candidateCode && (
        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-10">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            <span>02 / submitted_workspace_code</span>
            <span>saved_draft</span>
          </div>
          <div className="rounded border border-zinc-800 overflow-hidden bg-zinc-950/50">
            <div className="flex px-4 py-2 border-b border-zinc-900 text-[9px] text-zinc-550 font-bold justify-between items-center bg-zinc-950">
              <span>solution_code.txt</span>
              <span className="text-[8px] uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">UTF-8</span>
            </div>
            <pre className="text-xs text-zinc-300 p-5 overflow-x-auto max-h-[320px] custom-scrollbar leading-relaxed font-mono">
              <code>{feedback.candidateCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Telemetry Grid (Speech Cadence & Vocal Diagnostics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-zinc-800 pb-10">
        {/* Speech Pacing Cadence */}
        <div className="p-6 border border-zinc-800 rounded bg-zinc-950/20 flex flex-col gap-4">
          <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest">03 / speech_cadence</span>
          
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-normal text-white font-serif leading-none">{averageWpm}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Words Per Minute</span>
          </div>

          <div className="flex flex-col gap-2 mt-2 border-t border-zinc-900 pt-4">
            <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">
              CADENCE_METRIC:{" "}
              <span className="text-white underline decoration-zinc-700 underline-offset-2">
                {averageWpm >= 130 && averageWpm <= 150
                  ? "OPTIMAL_PACE"
                  : ((averageWpm >= 110 && averageWpm < 130) || (averageWpm > 150 && averageWpm <= 170))
                  ? "STABLE_PACE"
                  : "UNBALANCED_PACE"}
              </span>
            </span>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold">
              {averageWpm < 110
                ? "Speaking pace is slower than conversational average. Practice speaking with steady momentum."
                : averageWpm >= 110 && averageWpm < 130
                ? "Clear cadence. Minor speed increases will convey additional energy."
                : averageWpm >= 130 && averageWpm <= 150
                ? "Ideal conversational pace. Maintains perfect engagement under pressure."
                : "Speaking pace is rapid. Practice slowing down to maximize verbal impact."}
            </p>
          </div>
        </div>

        {/* Vocal Fillers diagnostics */}
        <div className="p-6 border border-zinc-800 rounded bg-zinc-950/20 flex flex-col gap-4">
          <span className="text-[9px] text-zinc-555 font-bold uppercase tracking-widest">04 / vocal_filler_diagnostics</span>
          
          <div className="flex flex-wrap gap-2 mt-1">
            {feedback?.topFillerWords && feedback.topFillerWords.length > 0 ? (
              feedback.topFillerWords.map((item, index) => (
                <span
                  key={index}
                  className="text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-2"
                >
                  <span>"{item.word.toUpperCase()}"</span>
                  <span className="bg-zinc-850 text-white text-[8px] px-1 rounded-sm">
                    {item.count}X
                  </span>
                </span>
              ))
            ) : (
              <span className="text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-white flex items-center gap-1.5">
                ✓ ZERO_VOCAL_FILLERS_DETECTED
              </span>
            )}
          </div>

          <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold border-t border-zinc-900 pt-4 mt-auto">
            Vocal fillers like "like" or "um" interrupt flow. Emphasize deliberate pauses to project authority and composure.
          </p>
        </div>
      </div>

      {/* Competency Matrices */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-10">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
          <span>05 / competency_matrices</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedback?.categoryScores?.map((category, index) => {
            return (
              <div 
                key={index} 
                className="p-5 bg-zinc-950/30 border border-zinc-800 rounded flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-white uppercase tracking-wider">
                  <span className="truncate max-w-[190px]">{category.name}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-zinc-800 bg-zinc-900 text-zinc-300">
                    {category.score}/100
                  </span>
                </div>

                {/* Cyber black & white progress bar */}
                <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                
                <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold bg-black/40 p-3 rounded border border-zinc-900">
                  {category.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-zinc-800 pb-10">
        
        {/* Core Strengths */}
        <div className="p-6 bg-zinc-950/30 border border-zinc-800 rounded flex flex-col gap-4 relative overflow-hidden">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-zinc-900 pb-2">
            06 / strengths_stdout
          </h3>
          
          <ul className="space-y-3">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="text-zinc-400 text-[10px] font-semibold flex items-start gap-2.5 leading-relaxed">
                <span className="text-white font-bold">[✓]</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Optimizations */}
        <div className="p-6 bg-zinc-950/30 border border-zinc-800 rounded flex flex-col gap-4 relative overflow-hidden">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-2">
            07 / optimizations_stdout
          </h3>
          
          <ul className="space-y-3">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-zinc-400 text-[10px] font-semibold flex items-start gap-2.5 leading-relaxed">
                <span className="text-zinc-500 font-bold">[!]</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons Deck - Playfair and Mono styles */}
      <div className="flex w-full justify-between gap-6 max-sm:flex-col mt-4 font-mono">
        <Button className="text-[10px] font-bold uppercase tracking-wider flex-1 rounded-sm h-11 bg-black border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300 w-full" asChild>
          <Link href="/">
            [ return_dashboard ]
          </Link>
        </Button>

        <Button className="text-[10px] font-bold uppercase tracking-wider flex-1 rounded-sm h-11 bg-white text-black hover:bg-zinc-200 transition-all duration-300 w-full border border-white font-bold" asChild>
          <Link href={`/interview/${id}`}>
            [ restart_session ]
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
