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
    <section className="max-w-4xl mx-auto flex flex-col gap-12 px-6 py-16 text-zinc-300 bg-black min-h-screen selection:bg-zinc-800 selection:text-white font-sans">
      
      {/* Header - Editorial Style */}
      <div className="flex flex-col gap-6 border-b border-zinc-800 pb-10">
        <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest font-semibold font-mono">
          <span>Ref: {id.slice(0, 8)}</span>
          <span>Date: {formattedDate}</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-light text-white tracking-tight leading-tight">
            Evaluation Report
          </h1>
          <p className="text-xs font-bold text-zinc-400 tracking-wider uppercase font-mono">
            Candidate: {user?.name} &mdash; Role: {interview.role.toUpperCase()} ({interview.type.toUpperCase()})
          </p>
        </div>
      </div>

      {/* Grid: Score & Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Score Card */}
        <div className="md:col-span-1 p-8 border border-zinc-800 rounded-lg bg-zinc-950/40 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest font-mono">Overall Match</span>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-7xl font-light text-white tracking-tighter leading-none">{totalScore}</span>
              <span className="text-xl text-zinc-500 font-light">%</span>
            </div>
          </div>
          <div className="mt-8 border-t border-zinc-900 pt-4">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest font-mono">
              Status: {totalScore >= 80 ? "Excellent Fit" :
                       totalScore >= 60 ? "Strong Match" :
                       totalScore >= 40 ? "Partial Match" :
                       "Weak Match"}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="md:col-span-2 p-8 border border-zinc-800 rounded-lg bg-zinc-950/20 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest font-mono">Executive Summary</span>
            <p className="text-sm text-zinc-350 leading-relaxed font-light select-text">
              {feedback?.finalAssessment || "No summary assessment loaded."}
            </p>
          </div>
        </div>
      </div>

      {/* Multi-file submitted code viewer */}
      {(feedback as any)?.candidateCode && (
        <FeedbackTabs candidateCode={(feedback as any).candidateCode} />
      )}

      {/* Speech Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-zinc-800 py-12">
        {/* Cadence */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Speech Pacing</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-light text-white leading-none">{averageWpm}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono">WPM</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-light mt-2">
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
        <div className="flex flex-col gap-4 border-l border-zinc-800 pl-8 max-md:border-l-0 max-md:pl-0">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Filler Word Diagnostics</span>
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
          <p className="text-xs text-zinc-400 leading-relaxed font-light mt-2">
            Vocal fillers are natural, but replacement with deliberate silence conveys confidence and professional poise.
          </p>
        </div>
      </div>

      {/* Competency Breakdown */}
      <div className="flex flex-col gap-6">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Competency Matrices</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedback?.categoryScores?.map((category, index) => (
            <div 
              key={index} 
              className="p-6 bg-zinc-950/30 border border-zinc-800 rounded-lg flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-center text-xs font-semibold text-white uppercase tracking-wider">
                <span>{category.name}</span>
                <span className="font-mono text-zinc-400">{category.score} / 100</span>
              </div>

              {/* Stark Black & White Progress Track */}
              <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${category.score}%` }}
                />
              </div>
              
              <p className="text-xs text-zinc-450 leading-relaxed font-light">
                {category.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-800 pt-12">
        {/* Key Strengths */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Strengths Output
          </h3>
          <ul className="space-y-3 mt-2">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="text-zinc-400 text-xs font-light flex items-start gap-3 leading-relaxed">
                <span className="text-white font-bold font-mono">[✓]</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="flex flex-col gap-4 border-l border-zinc-800 pl-8 max-md:border-l-0 max-md:pl-0">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Actionable Optimizations
          </h3>
          <ul className="space-y-3 mt-2">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-zinc-400 text-xs font-light flex items-start gap-3 leading-relaxed">
                <span className="text-zinc-500 font-bold font-mono">[!]</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex w-full justify-between gap-6 max-sm:flex-col mt-8">
        <Button className="text-xs font-semibold uppercase tracking-wider flex-1 rounded h-11 bg-black border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300 w-full" asChild>
          <Link href="/">
            [ return dashboard ]
          </Link>
        </Button>

        <Button className="text-xs font-semibold uppercase tracking-wider flex-1 rounded h-11 bg-white text-black hover:bg-zinc-200 transition-all duration-300 w-full border border-white" asChild>
          <Link href={`/interview/${id}`}>
            [ restart session ]
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
