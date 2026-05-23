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
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Verbal & Pacing Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark-200/30 p-6 border border-border/50 rounded-2xl backdrop-blur-md">
        
        {/* WPM Speed Gauge */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="size-5 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Speech Pacing (WPM)
          </h3>
          
          <div className="flex items-center gap-5">
            {/* Speed Gauge Graphics */}
            <div className="relative size-24 flex items-center justify-center shrink-0">
              <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-dark-300"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    feedback?.averageWpm && feedback.averageWpm >= 130 && feedback.averageWpm <= 150
                      ? "stroke-success-100"
                      : feedback?.averageWpm && ((feedback.averageWpm >= 110 && feedback.averageWpm < 130) || (feedback.averageWpm > 150 && feedback.averageWpm <= 170))
                      ? "stroke-primary-200"
                      : "stroke-destructive-100"
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
                <span className="text-[9px] text-light-400 font-bold uppercase">WPM</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-light-100">
                Pacing Score:{" "}
                <span className={
                  feedback?.averageWpm && feedback.averageWpm >= 130 && feedback.averageWpm <= 150
                    ? "text-success-100 font-extrabold"
                    : feedback?.averageWpm && ((feedback.averageWpm >= 110 && feedback.averageWpm < 130) || (feedback.averageWpm > 150 && feedback.averageWpm <= 170))
                    ? "text-primary-200 font-extrabold"
                    : "text-destructive-100 font-extrabold"
                }>
                  {feedback?.averageWpm && feedback.averageWpm >= 130 && feedback.averageWpm <= 150
                    ? "Ideal Pace"
                    : feedback?.averageWpm && ((feedback.averageWpm >= 110 && feedback.averageWpm < 130) || (feedback.averageWpm > 150 && feedback.averageWpm <= 170))
                    ? "Acceptable Pace"
                    : "Unbalanced Pace"}
                </span>
              </span>
              <p className="text-xs text-light-400 leading-relaxed">
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
        <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="size-5 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-destructive-100/10 border border-destructive-100/30 text-destructive-100 capitalize flex items-center gap-1.5"
                  >
                    <span>"{item.word}"</span>
                    <span className="bg-destructive-200 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                      {item.count}x
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-success-100/10 border border-success-100/30 text-success-100 flex items-center gap-1.5">
                  Excellent! No filler words detected.
                </span>
              )}
            </div>
            
            <p className="text-xs text-light-400 leading-relaxed mt-1">
              Filler words dilute the strength of your arguments. Focus on pausing silently instead of using fillers like "um" or "like" to transition.
            </p>
          </div>
        </div>

      </div>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
