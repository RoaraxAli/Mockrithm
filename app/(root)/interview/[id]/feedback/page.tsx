import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { FeedbackTabs } from "@/components/FeedbackTabs";
import { 
  TrendingUp, Clock, Mic, Activity, ChevronRight, 
  Award, FileText, CheckCircle2 
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
    ? dayjs(feedback.createdAt).format("MMMM D, YYYY")
    : "N/A";

  const totalScore = feedback?.totalScore || 0;
  const averageWpm = feedback?.averageWpm || 140;

  return (
    <div className="dark bg-zinc-950 text-zinc-50 min-h-screen w-full flex flex-col font-mona-sans relative z-10 select-none pb-12">
      {/* Background patterns matching premium SaaS dashboard */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-10 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-white/[0.005] to-transparent pointer-events-none z-0" />

      <section className="root-layout max-w-6xl mx-auto w-full px-6 sm:px-8 py-12 flex flex-col gap-12 z-10">
        
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
          <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
          <ChevronRight className="size-3 text-zinc-700" />
          <Link href="/interview" className="hover:text-white transition-colors">Simulator</Link>
          <ChevronRight className="size-3 text-zinc-700" />
          <span className="text-zinc-300 font-bold">Report #{id.slice(0, 8)}</span>
        </div>

        {/* Header - Editorial Premium Style */}
        <div className="flex flex-col gap-6 border-b border-zinc-900 pb-10">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest font-semibold font-mono">
            <span className="flex items-center gap-1.5"><Activity className="size-3 text-zinc-500" /> Session: {id.slice(0, 8)}</span>
            <span>Date: {formattedDate}</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase font-mona-sans">
              Evaluation Report
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 text-[10px] font-bold font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-full">
                {interview.role}
              </span>
              <span className="px-3 py-1 text-[10px] font-bold font-mono uppercase bg-white/5 border border-white/10 text-zinc-400 rounded-full">
                {interview.type}
              </span>
              <span className="text-xs font-semibold text-zinc-400 font-mono ml-1">
                Candidate: {user?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Grid: Score & Executive Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Score Card */}
          <div className="md:col-span-1 p-8 border border-zinc-900 bg-zinc-900/20 backdrop-blur-xl rounded-2xl flex flex-col justify-between relative overflow-hidden group">
            {/* Subtle glow */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/[0.02] blur-xl rounded-full pointer-events-none group-hover:bg-white/[0.04] transition-all" />
            
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Award className="size-3.5" /> Overall Fit Match
              </span>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-7xl font-black text-white tracking-tighter leading-none">{totalScore}</span>
                <span className="text-xl text-zinc-500 font-light">%</span>
              </div>
            </div>
            <div className="mt-8 border-t border-zinc-900 pt-4 flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider font-mono">
                Status:
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2.5 py-1 rounded bg-zinc-950 border ${
                totalScore >= 80 ? "text-emerald-400 border-emerald-500/20" :
                totalScore >= 60 ? "text-blue-400 border-blue-500/20" :
                totalScore >= 40 ? "text-amber-400 border-amber-500/20" :
                "text-rose-450 border-rose-500/20"
              }`}>
                {totalScore >= 80 ? "Excellent Fit" :
                 totalScore >= 60 ? "Strong Match" :
                 totalScore >= 40 ? "Partial Match" :
                 "Weak Match"}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="md:col-span-2 p-8 border border-zinc-900 bg-zinc-900/10 backdrop-blur-md rounded-2xl flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
                <FileText className="size-3.5" /> Executive Summary
              </span>
              <p className="text-sm text-zinc-350 leading-relaxed font-semibold select-text">
                {feedback?.finalAssessment || "No summary assessment loaded."}
              </p>
            </div>
          </div>
        </div>

        {/* Multi-file submitted code viewer */}
        {(feedback as any)?.candidateCode && (
          <div className="w-full">
            <FeedbackTabs candidateCode={(feedback as any).candidateCode} />
          </div>
        )}

        {/* Speech Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-zinc-900 py-12">
          {/* Cadence */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Clock className="size-3.5" /> Speech Pacing
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white leading-none">{averageWpm}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono">WPM</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-semibold mt-2">
              {averageWpm < 110
                ? "Your pace is slightly measured. Speaking with more momentum will keep the interviewer highly engaged."
                : averageWpm >= 110 && averageWpm < 130
                ? "Good steady pace. Incorporating brief pauses to transition between main ideas will add impact."
                : averageWpm >= 130 && averageWpm <= 150
                ? "Excellent cadence. This is the optimal pace for professional voice communication."
                : "Your delivery is quick. Try structuring your sentences to speak more deliberately."}
            </p>
          </div>

          {/* Vocal Fillers */}
          <div className="flex flex-col gap-4 border-l border-zinc-900 pl-8 max-md:border-l-0 max-md:pl-0">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Mic className="size-3.5" /> Filler Word Diagnostics
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {feedback?.topFillerWords && feedback.topFillerWords.length > 0 ? (
                feedback.topFillerWords.map((item, index) => (
                  <span
                    key={index}
                    className="text-[10px] font-semibold font-mono px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-2"
                  >
                    <span>"{item.word.toUpperCase()}"</span>
                    <span className="bg-zinc-800 text-white text-[9px] px-1 rounded-sm">
                      {item.count}X
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-[10px] font-semibold font-mono px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-white">
                  ✓ Zero Vocal Fillers Detected
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-semibold mt-2">
              Vocal fillers are natural, but replacement with deliberate silence conveys confidence and professional poise.
            </p>
          </div>
        </div>

        {/* Competency Breakdown */}
        <div className="flex flex-col gap-6">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
            <TrendingUp className="size-3.5" /> Competency Matrices
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedback?.categoryScores?.map((category, index) => (
              <div 
                key={index} 
                className="p-6 bg-zinc-900/10 border border-zinc-900 rounded-2xl flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="flex justify-between items-center text-xs font-semibold text-white uppercase tracking-wider">
                  <span>{category.name}</span>
                  <span className="font-mono text-zinc-400">{category.score} / 100</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                  {category.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-900 pt-12">
          {/* Key Strengths */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-zinc-455" /> Key Strengths
            </h3>
            <ul className="space-y-3 mt-2">
              {feedback?.strengths?.map((strength, index) => (
                <li key={index} className="text-zinc-400 text-xs font-semibold flex items-start gap-3 leading-relaxed">
                  <span className="text-white font-bold font-mono">[✓]</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="flex flex-col gap-4 border-l border-zinc-900 pl-8 max-md:border-l-0 max-md:pl-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="size-4.5 text-zinc-405" /> Optimizations
            </h3>
            <ul className="space-y-3 mt-2">
              {feedback?.areasForImprovement?.map((area, index) => (
                <li key={index} className="text-zinc-400 text-xs font-semibold flex items-start gap-3 leading-relaxed">
                  <span className="text-zinc-500 font-bold font-mono">[!]</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex w-full justify-between gap-6 max-sm:flex-col mt-8">
          <Button className="text-xs font-bold uppercase tracking-wider flex-1 rounded-full h-11 bg-zinc-900/50 border border-zinc-800 text-zinc-350 hover:bg-zinc-800 hover:text-white transition-all duration-300 w-full" asChild>
            <Link href="/">
              Return Dashboard
            </Link>
          </Button>

          <Button className="text-xs font-bold uppercase tracking-wider flex-1 rounded-full h-11 bg-white text-black hover:bg-zinc-200 transition-all duration-300 w-full border border-white" asChild>
            <Link href={`/interview/${id}`}>
              Restart Session
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
