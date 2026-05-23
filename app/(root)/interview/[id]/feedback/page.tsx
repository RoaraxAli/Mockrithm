import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
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

  return (
    <section className="section-feedback animate-fadeIn">
      <div className="flex flex-row justify-center">
        <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-300 tracking-tight text-center">
          Feedback Assessment - <span className="capitalize text-violet-400">{interview.role}</span>
        </h1>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-6 items-center flex-wrap">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full">
            <Image src="/star.svg" width={18} height={18} alt="star" className="filter drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
            <p className="text-sm font-bold text-gray-300">
              Overall Rating:{" "}
              <span className="text-violet-400 font-black">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2 items-center bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full">
            <Image src="/calendar.svg" width={18} height={18} alt="calendar" />
            <p className="text-sm font-bold text-gray-300">
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-white/5" />

      <div className="p-6 glass-card rounded-2xl border border-white/10 shadow-lg bg-white/[0.01]">
        <h3 className="text-lg font-bold text-gray-200 mb-3">AI Executive Summary</h3>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">{feedback?.finalAssessment}</p>
      </div>

      {/* Verbal & Pacing Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 glass-card p-6 border border-white/10 rounded-2xl shadow-xl">
        
        {/* WPM Speed Gauge */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <svg className="size-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Speech Pacing (WPM)
          </h3>
          
          <div className="flex items-center gap-5">
            {/* Speed Gauge Graphics */}
            <div className="relative size-24 flex items-center justify-center shrink-0">
              <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-white/[0.04]"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    feedback?.averageWpm && feedback.averageWpm >= 130 && feedback.averageWpm <= 150
                      ? "stroke-emerald-400"
                      : feedback?.averageWpm && ((feedback.averageWpm >= 110 && feedback.averageWpm < 130) || (feedback.averageWpm > 150 && feedback.averageWpm <= 170))
                      ? "stroke-violet-400"
                      : "stroke-rose-400"
                  }
                  strokeWidth="3.5"
                  strokeDasharray={`${Math.min(100, Math.round(((feedback?.averageWpm || 0) / 200) * 100))}, 100`}
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white">{feedback?.averageWpm || 0}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase">WPM</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-300">
                Pacing Score:{" "}
                <span className={
                  feedback?.averageWpm && feedback.averageWpm >= 130 && feedback.averageWpm <= 150
                    ? "text-emerald-400 font-extrabold"
                    : feedback?.averageWpm && ((feedback.averageWpm >= 110 && feedback.averageWpm < 130) || (feedback.averageWpm > 150 && feedback.averageWpm <= 170))
                    ? "text-violet-400 font-extrabold"
                    : "text-rose-400 font-extrabold"
                }>
                  {feedback?.averageWpm && feedback.averageWpm >= 130 && feedback.averageWpm <= 150
                    ? "Ideal Pace"
                    : feedback?.averageWpm && ((feedback.averageWpm >= 110 && feedback.averageWpm < 130) || (feedback.averageWpm > 150 && feedback.averageWpm <= 170))
                    ? "Acceptable Pace"
                    : "Unbalanced Pace"}
                </span>
              </span>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {feedback?.averageWpm && feedback.averageWpm < 110
                  ? "Your delivery is a bit slow. Express thoughts with more composure and momentum to keep interest."
                  : feedback?.averageWpm && feedback.averageWpm >= 110 && feedback.averageWpm < 130
                  ? "Slightly slow delivery. Calm and composed, but you can increase your pace slightly to cover more details."
                  : feedback?.averageWpm && feedback.averageWpm >= 130 && feedback.averageWpm <= 150
                  ? "Perfect pacing! Speaking at 130–150 wpm mimics real-world conversational readiness."
                  : feedback?.averageWpm && feedback.averageWpm > 150 && feedback.averageWpm <= 170
                  ? "Slightly fast. Try inserting pauses between sentences to let your points sink in."
                  : "Too fast. Rushing answers projects nervousness. Try slowing down and taking deep breaths."}
              </p>
            </div>
          </div>
        </div>

        {/* Filler Word Counter */}
        <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <svg className="size-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Filler Words Detected
          </h3>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap gap-2">
              {feedback?.topFillerWords && feedback.topFillerWords.length > 0 ? (
                feedback.topFillerWords.map((item, index) => (
                  <span
                    key={index}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 capitalize flex items-center gap-1.5"
                  >
                    <span>"{item.word}"</span>
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                      {item.count}x
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
                  Excellent! No filler words detected.
                </span>
              )}
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed mt-1 font-medium">
              Filler words dilute the strength of your arguments. Focus on pausing silently instead of using fillers like "um" or "like" to transition.
            </p>
          </div>
        </div>

      </div>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="h-5 w-1 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full" />
          Interview Category Scores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedback?.categoryScores?.map((category, index) => (
            <div key={index} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20" />
              <div className="flex justify-between items-center text-sm font-bold text-gray-200">
                <span>{category.name}</span>
                <span className="text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold">{category.score}/100</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium mt-1">{category.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Key Strengths
          </h3>
          <ul className="space-y-2.5">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="text-gray-300 text-sm font-medium flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-400 font-black">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2.5">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-gray-300 text-sm font-medium flex items-start gap-2 leading-relaxed">
                <span className="text-amber-400 font-black">•</span>
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1 rounded-full cursor-pointer h-12" asChild>
          <Link href="/">
            Back to dashboard
          </Link>
        </Button>

        <Button className="btn-primary flex-1 rounded-full cursor-pointer h-12" asChild>
          <Link href={`/interview/${id}`}>
            Retake Interview
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
