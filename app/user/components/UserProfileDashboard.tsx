"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import type { User, Interview, Feedback } from "../types";
import { getUserData, getUserInterviews, getUserFeedback } from "../lib/firestore";
import { Loader2 } from "lucide-react";

export function UserProfileDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);
        const [userDataResult, interviewsResult, feedbackResult] = await Promise.all([
          getUserData(user.id),
          getUserInterviews(user.id),
          getUserFeedback(user.id),
        ]);

        setUserData(userDataResult);
        setInterviews(interviewsResult);
        setFeedback(feedbackResult);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(`Failed to load dashboard data: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center py-12 text-zinc-400 font-mona-sans">
        <Loader2 className="size-6 animate-spin mr-2" />
        <span className="text-xs uppercase tracking-wider font-bold">Loading operational portfolio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mona-sans">
        {error}
      </div>
    );
  }

  const lastScore = feedback.length > 0 ? feedback[0].totalScore : 0;
  const averageScore =
    feedback.length > 0 ? Math.round(feedback.reduce((sum, f) => sum + f.totalScore, 0) / feedback.length) : 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 font-mona-sans p-2 text-white">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
        <span className="w-fit text-[8px] font-black tracking-widest uppercase text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">Operational Portfolio</span>
        <h2 className="text-xl font-black text-white">
          Welcome, {userData?.name || user?.firstName || "Candidate"}!
        </h2>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Here&apos;s your interview portfolio and progress analysis overview.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="relative p-5 backdrop-blur-2xl bg-zinc-950/40 rounded-xl border border-white/5 shadow-2xl overflow-hidden group hover:border-white/10 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-white opacity-20" />
          <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Evaluations</h4>
          <span className="text-2xl font-black text-white">{interviews.length}</span>
          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-2">Completed & ongoing sessions</p>
        </div>

        <div className="relative p-5 backdrop-blur-2xl bg-zinc-950/40 rounded-xl border border-white/5 shadow-2xl overflow-hidden group hover:border-white/10 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-white opacity-20" />
          <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Most Recent Score</h4>
          <span className="text-2xl font-black text-white">{lastScore > 0 ? `${lastScore}%` : "N/A"}</span>
          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-2">Latest matching rate</p>
        </div>

        <div className="relative p-5 backdrop-blur-2xl bg-zinc-950/40 rounded-xl border border-white/5 shadow-2xl overflow-hidden group hover:border-white/10 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-white opacity-20" />
          <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Average Prep Score</h4>
          <span className="text-2xl font-black text-white">{averageScore > 0 ? `${averageScore}%` : "N/A"}</span>
          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-2">Aggregated match rate</p>
        </div>
      </div>

      {/* Feedback & Evaluation History */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Feedback & Assessment History</h3>
        
        {feedback.length > 0 ? (
          <div className="space-y-3">
            {feedback.map((fb, index) => (
              <div key={fb.id} className="relative p-4 backdrop-blur-2xl bg-zinc-950/40 rounded-xl border border-zinc-900 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-800 transition-all duration-300">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[8px] bg-white/5 text-zinc-400 border border-white/10 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                      Session #{feedback.length - index}
                    </span>
                    <span className="text-[10px] text-zinc-550 font-medium">
                      {new Date(fb.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-350 leading-relaxed font-medium line-clamp-2">
                    {fb.finalAssessment}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Match Score</span>
                    <span className="text-lg font-mono font-black text-white">{fb.totalScore}%</span>
                  </div>
                  <a 
                    href={`/interview/${fb.interviewId}/feedback`}
                    className="px-3.5 py-1.5 bg-white text-black font-bold text-[10px] rounded-lg hover:bg-zinc-200 transition-all text-center uppercase tracking-wider"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-zinc-950/20 border border-zinc-900 rounded-xl">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">No feedback records found yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
