"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Play, ShieldAlert, Cpu, Activity, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InterviewCard from "./InterviewCard";
import { auth, db } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import SessionTracker from "@/components/SessionTracker";

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
  const [loadingData, setLoadingData] = useState(
    initialAllInterviews.length > 0 || (user && initialUserInterviews.length > 0) ? false : true
  );
  const [clientUser, setClientUser] = useState<any>(user || null);
  const [authResolved, setAuthResolved] = useState(!!user);

  // 1. Subscribe to Client Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (user && firebaseUser.uid === user.id) {
          console.log("LandingDashboard client auth matches server user, skipping Firestore read");
          setClientUser(user);
          setAuthResolved(true);
          return;
        }

        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setClientUser({
              id: firebaseUser.uid,
              ...userDoc.data()
            });
          } else {
            setClientUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "User"
            });
          }
        } catch (error) {
          console.error("Failed to fetch user doc in LandingDashboard:", error);
          setClientUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || "User"
          });
        }
      } else {
        setClientUser(null);
      }
      setAuthResolved(true);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Load Dashboard Data
  useEffect(() => {
    if (initialAllInterviews.length > 0 && clientUser?.id === user?.id) {
      console.log("LandingDashboard skipping client-side data fetch (using server preloaded data)");
      setLoadingData(false);
      return;
    }

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
  }, [clientUser?.id, authResolved, initialAllInterviews.length, user]);

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
        className="relative w-full min-h-[75vh] flex flex-col justify-center border-b border-zinc-900 bg-zinc-950/10 overflow-hidden pb-16 pt-12"
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
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
              <Cpu className="size-3.5 text-zinc-500" /> AI Voice Engine Active
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] text-white tracking-tight">
            Practice interviews <br/>
            <span className="text-zinc-405">
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
            className="flex gap-4 items-center justify-center max-sm:flex-col w-full max-w-md mt-2"
          >
            <Button asChild className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer h-11 w-full sm:w-48 transition-all duration-300">
              <Link href="/interview" className="flex items-center justify-center gap-2">
                <Play className="size-3.5 fill-black" /> Start Practice
              </Link>
            </Button>

            <Button 
              onClick={() => {
                document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              className="border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:text-white font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer h-11 w-full sm:w-48 transition-all duration-300"
            >
              Explore Dashboard {"↓"}
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. Compact Dashboard Content Section */}
      <div id="dashboard-section" className="max-w-7xl mx-auto w-full flex flex-col gap-6 py-8 px-4 sm:px-6 relative scroll-mt-20 z-10">
        
        {/* Interactive Navigation Segment Filter */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 max-sm:flex-col max-sm:gap-3 max-sm:items-start relative">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-white rounded-md" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-350">Practice Dashboard</h2>
          </div>

          <div className="flex bg-zinc-950/60 p-0.5 rounded-xl border border-zinc-900 text-[9px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg cursor-pointer transition-all",
                filter === "all" ? "bg-white text-black font-bold shadow-md" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              All Roles
            </button>
            <button
              onClick={() => setFilter("past")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg cursor-pointer transition-all",
                filter === "past" ? "bg-white text-black font-bold shadow-md" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              My Past Sessions
            </button>
            <button
              onClick={() => setFilter("available")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg cursor-pointer transition-all",
                filter === "available" ? "bg-white text-black font-bold shadow-md" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Curated Practice
            </button>
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
        
        {/* Past Sessions List */}
        {(filter === "all" || filter === "past") && (
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-550 flex items-center gap-2">
              <User className="size-3.5 text-zinc-400" /> Past Session History
            </h3>
            
            {loadingData ? (
              <div className="interviews-section">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : userInterviews.length > 0 ? (
              <div className="interviews-section">
                {userInterviews.map((interview) => (
                  <motion.div key={interview.id} whileHover={{ y: -2 }} className="h-full">
                    <InterviewCard
                      userId={clientUser?.id}
                      interviewId={interview.id}
                      role={interview.role}
                      type={interview.type}
                      techstack={interview.techstack}
                      createdAt={interview.createdAt}
                      feedback={interview.feedback}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-10 px-4 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md flex flex-col items-center text-center shadow-lg gap-2">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">No completed trials found in database</p>
                <Link href="/interview" className="text-white text-[10px] hover:underline font-bold tracking-widest uppercase flex items-center gap-1 transition-all">Launch first evaluation now {"→"}</Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Curated Available Practice Roles */}
        {(filter === "all" || filter === "available") && (
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-550 flex items-center gap-2">
              <BookOpen className="size-3.5 text-zinc-400" /> Curated Practice Categories
            </h3>
            
            {loadingData ? (
              <div className="interviews-section">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : allInterviews.length > 0 ? (
              <div className="interviews-section">
                {allInterviews.map((interview) => (
                  <motion.div key={interview.id} whileHover={{ y: -2 }} className="h-full">
                    <InterviewCard
                      userId={clientUser?.id}
                      interviewId={interview.id}
                      role={interview.role}
                      type={interview.type}
                      techstack={interview.techstack}
                      createdAt={interview.createdAt}
                      feedback={interview.feedback}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-10 px-4 rounded-xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md flex flex-col items-center text-center shadow-lg">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">No curated trial configurations online</p>
              </div>
            )}
          </motion.div>
        )}

      </motion.div>
      </div>
    </div>
  );
}
