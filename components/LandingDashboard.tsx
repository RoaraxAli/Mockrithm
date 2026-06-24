"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Play, ShieldAlert, Cpu, Activity, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InterviewCard from "./InterviewCard";
import SessionTracker from "@/components/SessionTracker";
import { useUser } from "@clerk/nextjs";

interface LandingDashboardProps {
  user?: any;
  userInterviews?: any[];
  allInterviews?: any[];
}

const SkeletonCard = () => (
  <div className="h-44 border border-zinc-900 bg-zinc-950/20 rounded-xl animate-pulse flex flex-col justify-between p-6 select-none">
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-2/3">
        <div className="h-3.5 bg-zinc-900 rounded-md w-3/4" />
        <div className="h-2.5 bg-zinc-900/60 rounded-md w-1/2" />
      </div>
      <div className="h-4 bg-zinc-900 rounded-full w-12" />
    </div>
    <div className="flex flex-wrap gap-1.5 mt-2">
      <div className="h-4 bg-zinc-900/50 rounded-md w-12" />
      <div className="h-4 bg-zinc-900/50 rounded-md w-16" />
    </div>
    <div className="flex justify-between items-center border-t border-zinc-900/40 pt-4 mt-2">
      <div className="h-2 bg-zinc-900 rounded w-1/4" />
      <div className="h-3.5 bg-zinc-900 rounded w-16" />
    </div>
  </div>
);

export default function LandingDashboard({
  user,
  userInterviews: initialUserInterviews = [],
  allInterviews: initialAllInterviews = [],
}: LandingDashboardProps) {
  const [filter, setFilter] = useState<"all" | "past" | "available">("all");
  const [userInterviews, setUserInterviews] = useState<any[]>(initialUserInterviews);
  const [allInterviews, setAllInterviews] = useState<any[]>(initialAllInterviews);
  const [loadingData, setLoadingData] = useState(true);
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const [clientUser, setClientUser] = useState<any>(user || null);
  const [authResolved, setAuthResolved] = useState(false);

  // 1. Subscribe to Client Auth State
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && clerkUser) {
      setClientUser({
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        role: user?.role || "User",
      });
    } else {
      setClientUser(null);
    }
    setAuthResolved(true);
  }, [isLoaded, isSignedIn, clerkUser, user]);

  // 2. Load Dashboard Data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoadingData(true);
        const userId = clientUser?.id || null;

        // Fetch user feedback in a single batched query if user is logged in
        let feedbackMap = new Map();
        if (userId) {
          const { getFeedbacksForUser } = await import("@/lib/actions/general.action");
          const userFeedbacks = await getFeedbacksForUser(userId) || [];
          feedbackMap = new Map(userFeedbacks.map((f) => [f.interviewId, f]));
        }

        const fetchUserInterviewsAction = async () => {
          if (!userId) return [];
          const { getInterviewsByUserId } = await import("@/lib/actions/general.action");
          const rawUserInterviews = await getInterviewsByUserId(userId) || [];
          return rawUserInterviews.map((interview) => ({
            ...interview,
            feedback: feedbackMap.get(interview.id) || null,
          }));
        };

        const fetchLatestInterviewsAction = async () => {
          const { getLatestInterviews } = await import("@/lib/actions/general.action");
          const rawAllInterviews = await getLatestInterviews({ userId: userId || "" }) || [];
          return rawAllInterviews.map((interview) => ({
            ...interview,
            feedback: feedbackMap.get(interview.id) || null,
          }));
        };

        const [userInterviewsData, allInterviewsData] = await Promise.all([
          fetchUserInterviewsAction(),
          fetchLatestInterviewsAction()
        ]);

        setUserInterviews(userInterviewsData);
        setAllInterviews(allInterviewsData);
      } catch (error) {
        console.error("Failed to load async dashboard data:", error);
      } finally {
        setLoadingData(false);
      }
    }

    if (authResolved) {
      loadDashboardData();
    }
  }, [clientUser?.id, authResolved]);

  // Aggregate user statistics
  const totalInterviews = userInterviews.length;
  const passedInterviews = userInterviews.filter(i => (i.feedback?.totalScore || 0) >= 80).length;
  const averageScore = totalInterviews > 0
    ? Math.round(userInterviews.reduce((acc, curr) => acc + (curr.feedback?.totalScore || 0), 0) / totalInterviews)
    : 0;

  const containerVariants: any = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 1, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10">
      <SessionTracker userId={clientUser?.id || null} />
      {/* Background patterns */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-30 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none z-0" />
      
      {/* 1. Immersive Premium SaaS Hero Header */}
      <motion.section 
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full min-h-[70vh] flex flex-col justify-center border-b border-zinc-900 bg-zinc-950/10 overflow-hidden pb-16 pt-12"
      >
        {/* Subtle Ambient Radial Backlighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.015] blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full px-6 sm:px-8 flex flex-col items-center text-center gap-6 z-10">
          
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800/80 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-1.5 font-mono">
              <Cpu className="size-3.5 text-zinc-500" /> AI Voice Engine Active
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] text-white tracking-tight">
            Practice interviews <br/>
            <span className="text-zinc-400">
              with conversational AI.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-medium">
            Conduct live, voice-driven mock interviews tailored to your experience. Improve delivery pacing, eliminate vocal fillers, and solve code challenges with real-time feedback.
          </p>

          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 items-center justify-center max-sm:flex-col w-full max-w-md mt-2 animate-fadeIn"
          >
            <Button asChild className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer h-11 w-full sm:w-48 transition-all duration-300">
              <Link href="/interview" className="flex items-center justify-center gap-2">
                <Play className="size-3.5 fill-black" /> Start Practice
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:text-white font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer h-11 w-full sm:w-48 transition-all duration-300">
              <Link href="/user/dashboard/resume" className="flex items-center justify-center gap-2">
                Optimize Resume {"→"}
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Dynamic Telemetry Metrics Panel */}
      {clientUser && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 z-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-2">
            <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="size-3.5 text-zinc-450" /> Sessions Initiated
            </span>
            <span className="text-3xl font-black text-white font-mono">{totalInterviews}</span>
            <p className="text-[10px] text-zinc-500 font-medium">Accumulated training logs</p>
          </div>

          <div className="p-6 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-2">
            <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-zinc-450" /> Average ATS Fit
            </span>
            <span className="text-3xl font-black text-white font-mono">{averageScore}%</span>
            <p className="text-[10px] text-zinc-500 font-medium">Standard overall matching score</p>
          </div>

          <div className="p-6 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-2">
            <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="size-3.5 text-zinc-450" /> Passed Trials (80%+)
            </span>
            <span className="text-3xl font-black text-white font-mono">{passedInterviews}</span>
            <p className="text-[10px] text-zinc-500 font-medium">Completed target benchmarks</p>
          </div>
        </section>
      )}

      {/* 2. Compact Dashboard Content Section */}      <div id="dashboard-section" className="max-w-7xl mx-auto w-full flex flex-col gap-6 py-8 px-4 sm:px-6 relative scroll-mt-20 z-10">
        
        {/* Interactive Navigation Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 max-sm:flex-col max-sm:gap-3 max-sm:items-start relative">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-white rounded-md" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-350">Your Evaluation History</h2>
          </div>
        </div>

        {/* 3. Dynamic Animated Lists with Scroll Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-6"
        >
        
        {/* Past Sessions Timeline */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          {loadingData ? (
            <div className="interviews-section">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : userInterviews.length > 0 ? (
            <div className="relative border-l border-zinc-900 pl-6 ml-4 space-y-8 py-4">
              {userInterviews.map((interview, index) => {
                const score = interview.feedback?.totalScore || 0;
                const date = new Date(interview.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <motion.div 
                    key={interview.id} 
                    className="relative group/item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Timeline dot */}
                    <span className={cn(
                      "absolute -left-[31px] top-1.5 size-2.5 rounded-full border border-zinc-950 flex items-center justify-center transition-all",
                      score >= 80 ? "bg-white" : "bg-zinc-800"
                    )} />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-zinc-950/20 hover:bg-zinc-950/50 border border-zinc-900 hover:border-zinc-800 rounded-2xl transition-all duration-300">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">{date}</span>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{interview.role} Interview</h4>
                        <span className="text-[10px] text-zinc-400 font-medium">Type: {interview.type}</span>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest">Match score</span>
                          <span className="text-lg font-mono font-black text-white">{score}%</span>
                        </div>
                        
                        <Link 
                          href={`/interview/${interview.id}/feedback`}
                          className="h-9 px-4 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-white hover:bg-zinc-800 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center transition-all"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 px-4 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md flex flex-col items-center text-center shadow-lg gap-2">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">No completed trials found in database</p>
              <Link href="/interview" className="text-white text-[10px] hover:underline font-bold tracking-widest uppercase flex items-center gap-1 transition-all">Launch first evaluation now {"→"}</Link>
            </div>
          )}
        </motion.div>

      </motion.div>
      </div>
    </div>
  );
}
