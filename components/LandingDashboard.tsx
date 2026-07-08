"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Terminal, Play, ShieldAlert, Cpu, Activity, User, BookOpen, 
  Clock, Mic, FileText, CheckCircle2, AlertTriangle, ChevronRight, 
  RefreshCw, TrendingUp, Sliders, Calendar, ArrowUpRight, Award, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SessionTracker from "@/components/SessionTracker";
import InteractiveHeroBackground from "@/components/InteractiveHeroBackground";
import { useUser } from "@clerk/nextjs";

interface LandingDashboardProps {
  user?: any;
  userInterviews?: any[];
  allInterviews?: any[];
}

export default function LandingDashboard({
  user,
  userInterviews: initialUserInterviews = [],
  allInterviews: initialAllInterviews = [],
}: LandingDashboardProps) {
  const [filter, setFilter] = useState<"all" | "past" | "available">("all");
  const [userInterviews, setUserInterviews] = useState<any[]>(initialUserInterviews);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const [clientUser, setClientUser] = useState<any>(user || null);
  const [authResolved, setAuthResolved] = useState(false);
  const [activeTip, setActiveTip] = useState(0);
  const [greetingText, setGreetingText] = useState("Welcome back!");

  // Tips dataset for carousel
  const interviewTips = [
    {
      title: "Master the STAR Method",
      text: "Structure behavioral responses using Situation, Task, Action, and Result. Ensure your Action takes 60% of the speaking time.",
      icon: BookOpen,
      tag: "Methodology"
    },
    {
      title: "Control Vocal Pacing",
      text: "Aim for a speed of 120-150 words per minute. Speaking too fast reduces articulation, while speaking too slow lowers engagement.",
      icon: Clock,
      tag: "Speech Diagnostics"
    },
    {
      title: "Minimize Filler Words",
      text: "Vocal halts like 'um', 'like', and 'basically' break candidate presence. Pause silently for 1 second instead of filling the gap.",
      icon: Mic,
      tag: "Delivery"
    },
    {
      title: "ATS Keyword Optimization",
      text: "Compare your resume against the target role requirements. Increase matching terms to above 80% to clear screening hurdles.",
      icon: Sparkles,
      tag: "Resume Optimization"
    }
  ];

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

  // Greeting logic with safety from hydration mismatches
  useEffect(() => {
    if (clientUser?.name) {
      const name = clientUser.name.split(" ")[0];
      const hrs = new Date().getHours();
      let greet = "Welcome back";
      if (hrs < 12) greet = "Good morning";
      else if (hrs < 17) greet = "Good afternoon";
      else greet = "Good evening";
      setGreetingText(`${greet}, ${name}!`);
    } else if (isLoaded && !isSignedIn) {
      setGreetingText("Welcome!");
    }
  }, [clientUser, isLoaded, isSignedIn]);

  // 2. Load Dashboard Data (Interviews, Feedback, Resumes)
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

        const fetchResumesAction = async () => {
          if (!userId) return [];
          const { getUserResumes } = await import("@/lib/actions/resume.action");
          return await getUserResumes(userId) || [];
        };

        const [userInterviewsData, resumesData] = await Promise.all([
          fetchUserInterviewsAction(),
          fetchResumesAction()
        ]);

        setUserInterviews(userInterviewsData);
        setResumes(resumesData);
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

  // Rotate tips carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % interviewTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Time-based greeting helper
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good morning";
    if (hrs < 17) return "Good afternoon";
    return "Good evening";
  };

  // Aggregate user statistics
  const totalInterviews = userInterviews.length;
  
  const scoreFilteredInterviews = userInterviews.filter(i => typeof i.feedback?.totalScore === "number");
  const averageScore = scoreFilteredInterviews.length > 0
    ? Math.round(scoreFilteredInterviews.reduce((acc, curr) => acc + curr.feedback.totalScore, 0) / scoreFilteredInterviews.length)
    : 0;

  // Calculate Speech Telemetry WPM
  const wpms = userInterviews
    .map((i) => i.feedback?.averageWpm)
    .filter((w) => typeof w === "number" && w > 0);
  const averageWpm = wpms.length > 0 ? Math.round(wpms.reduce((acc, curr) => acc + curr, 0) / wpms.length) : 0;

  // Aggregate vocal filler words
  const fillerWordCounts: { [key: string]: number } = {};
  userInterviews.forEach((i) => {
    const fb = i.feedback;
    if (fb && Array.isArray(fb.topFillerWords)) {
      fb.topFillerWords.forEach((item: any) => {
        if (item) {
          let wordStr = "";
          let countVal = 1;
          if (typeof item === "string") {
            wordStr = item;
          } else if (typeof item === "object" && typeof item.word === "string") {
            wordStr = item.word;
            countVal = typeof item.count === "number" ? item.count : 1;
          }
          const cleanWord = wordStr.trim().toLowerCase();
          if (cleanWord) {
            fillerWordCounts[cleanWord] = (fillerWordCounts[cleanWord] || 0) + countVal;
          }
        }
      });
    }
  });

  const sortedFillerWords = Object.entries(fillerWordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Resume states
  const latestResume = resumes.length > 0 ? resumes[0] : null;
  const latestAtsScore = latestResume?.atsAnalysis?.atsScore || latestResume?.atsAnalysis?.score || 0;
  const missingKeywords = latestResume?.atsAnalysis?.missingKeywords || [];
  const resumeStrengths = latestResume?.atsAnalysis?.strengths || [];
  const resumeWeaknesses = latestResume?.atsAnalysis?.weaknesses || [];

  // Generate SVG Score Chart points (Chronological Order)
  const chronologicalScores = [...userInterviews]
    .filter(i => i.feedback && typeof i.feedback.totalScore === "number")
    .reverse()
    .map((i) => ({
      date: new Date(i.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: i.feedback.totalScore,
      role: i.role
    }));

  const chartWidth = 550;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;
  let chartPath = "";
  let chartArea = "";
  let chartPoints: { x: number; y: number; score: number; role: string; date: string }[] = [];

  if (chronologicalScores.length > 0) {
    if (chronologicalScores.length === 1) {
      // Draw a single horizontal line indicating one score
      const x1 = paddingX;
      const x2 = chartWidth - paddingX;
      const y = chartHeight - paddingY - (chronologicalScores[0].score * (chartHeight - paddingY * 2)) / 100;
      chartPath = `M ${x1} ${y} L ${x2} ${y}`;
      chartPoints = [{ x: (x1 + x2) / 2, y, ...chronologicalScores[0] }];
    } else {
      chartPoints = chronologicalScores.map((data, index) => {
        const x = paddingX + (index * (chartWidth - paddingX * 2)) / (chronologicalScores.length - 1);
        const y = chartHeight - paddingY - (data.score * (chartHeight - paddingY * 2)) / 100;
        return { x, y, score: data.score, role: data.role, date: data.date };
      });
chartPath = `M ${chartPoints[0].x} ${chartPoints[0].y} ` + chartPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
      chartArea = `${chartPath} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - paddingY} L ${chartPoints[0].x} ${chartHeight - paddingY} Z`;
    }
  }

  return (
    <div className="dark bg-zinc-950 text-zinc-50 w-full flex flex-col font-mona-sans relative z-10 select-none pb-12 min-h-screen">
      <SessionTracker userId={clientUser?.id || null} />
      
      {/* Background patterns */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-white/[0.005] to-transparent pointer-events-none z-0" />

      {/* 1. Immersive Premium SaaS Hero Header */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full min-h-[55vh] flex flex-col justify-center border-b border-zinc-900 bg-zinc-950/10 overflow-hidden pb-12 pt-8"
      >
        <InteractiveHeroBackground />
        {/* Subtle Ambient Radial Backlighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.015] blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto w-full px-6 sm:px-8 flex flex-col items-center text-center gap-6 z-10">
          


          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] text-white tracking-tight uppercase">
            {greetingText} <br/>
            <span className="text-zinc-400">
              Ready for calibration.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-medium">
            Conduct live, voice-driven mock interviews tailored to your experience. Improve delivery pacing, eliminate vocal fillers, and solve code challenges with real-time feedback.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 items-center justify-center max-sm:flex-col w-full max-w-md mt-2"
          >
            <Button asChild className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer h-11 w-full sm:w-48 transition-all duration-300 shadow-lg shadow-white/5 hover:scale-[1.02]">
              <Link href="/interview" className="flex items-center justify-center gap-2">
                <Play className="size-3.5 fill-black" /> Run Simulator
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-white/5 hover:border-white/20 bg-zinc-900/30 text-zinc-300 hover:text-white font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer h-11 w-full sm:w-48 transition-all duration-300 hover:scale-[1.02]">
              <Link href="/user/resume" className="flex items-center justify-center gap-2">
                Resume Desk {"→"}
              </Link>
            </Button>
          </motion.div>


        </div>
      </motion.section>

      {/* 2. Content Layout Wrapper (Adds margin/padding from the corners) */}
      <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 flex flex-col gap-8 relative z-10 mt-8">
        
        {/* Top Metrics Bento Grid with Scroll Reveal */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Sessions Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative p-6 backdrop-blur-2xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl overflow-hidden group hover:border-white/15 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">Practice Runs</span>
              <div className="p-1 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/15 transition-colors">
                <Activity className="size-4 text-zinc-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tight">{totalInterviews}</span>
              <span className="text-[10px] text-emerald-500 font-bold font-mono">Sessions</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-3">Completed simulation logs</p>
          </motion.div>

          {/* Avg Match Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative p-6 backdrop-blur-2xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl overflow-hidden group hover:border-white/15 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">Average Fit Score</span>
              <div className="p-1 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/15 transition-colors">
                <Award className="size-4 text-zinc-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tight">{averageScore}%</span>
              {averageScore >= 80 ? (
                <span className="text-[10px] text-emerald-400 font-bold font-mono flex items-center gap-0.5">
                  <CheckCircle2 className="size-3" /> Target Met
                </span>
              ) : averageScore > 0 ? (
                <span className="text-[10px] text-yellow-500 font-bold font-mono flex items-center gap-0.5">
                  <AlertTriangle className="size-3" /> Focus Needed
                </span>
              ) : (
                <span className="text-[9px] text-zinc-650 font-bold font-mono">N/A</span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-3">Standard overall rating fit</p>
          </motion.div>

          {/* ATS Resume score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="relative p-6 backdrop-blur-2xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl overflow-hidden group hover:border-white/15 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">Resume Match Score</span>
              <div className="p-1 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/15 transition-colors">
                <FileText className="size-4 text-zinc-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tight">
                {latestResume ? `${latestAtsScore}%` : "N/A"}
              </span>
              {latestResume ? (
                latestAtsScore >= 85 ? (
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Optimal</span>
                ) : (
                  <span className="text-[10px] text-yellow-500 font-mono font-bold">Warnings</span>
                )
              ) : (
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">Unuploaded</span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-3">
              {latestResume ? `Doc: ${latestResume.fileName.substring(0, 18)}${latestResume.fileName.length > 18 ? "..." : ""}` : "No resume document on file"}
            </p>
          </motion.div>
        </section>

        {/* 3. Primary Bento Layout (Charts & Analytics Dashboard) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Span 2): SVG Chart & Diagnostics */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Card 1: Performance Progression SVG Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="p-6 backdrop-blur-3xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden relative group hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-zinc-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Score Tracking Progression</h3>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Chronological evaluations</span>
              </div>

              {loadingData ? (
                <div className="h-[220px] flex items-center justify-center">
                  <RefreshCw className="size-6 text-zinc-700 animate-spin" />
                </div>
              ) : chronologicalScores.length > 0 ? (
                <div className="relative w-full flex items-center justify-center py-2">
                  {/* Score Chart Grid Wrapper */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none px-[40px] py-[25px] opacity-10">
                    <div className="border-b border-white w-full h-0" />
                    <div className="border-b border-white w-full h-0" />
                    <div className="border-b border-white w-full h-0" />
                    <div className="border-b border-white w-full h-0" />
                  </div>

                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                    className="w-full h-auto overflow-visible select-none max-md:min-w-[450px]"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.00" />
                      </linearGradient>
                      <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.15" />
                      </filter>
                    </defs>

                    {/* Horizontal gridlines labels */}
                    <text x="5" y="30" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace">100%</text>
                    <text x="5" y="95" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace">50%</text>
                    <text x="5" y="160" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace">0%</text>

                    {/* Area beneath chart curve */}
                    {chartArea && (
                      <path d={chartArea} fill="url(#chartGradient)" />
                    )}

                    {/* Trend line */}
                    {chartPath && (
                      <path 
                        d={chartPath} 
                        fill="none" 
                        stroke="#ffffff" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />
                    )}

                    {/* Data points */}
                    {chartPoints.map((pt, idx) => (
                      <g key={idx} className="group/node cursor-pointer">
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="5" 
                          fill="#09090b" 
                          stroke="#ffffff" 
                          strokeWidth="2" 
                          className="transition-all duration-300 hover:r-7"
                        />
                        
                        {/* Interactive Tooltip Card overlay on Node Hover */}
                        <g className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <rect 
                            x={pt.x - 65} 
                            y={pt.y - 45} 
                            width="130" 
                            height="35" 
                            rx="6" 
                            fill="#09090b" 
                            stroke="rgba(255,255,255,0.12)" 
                            strokeWidth="1.5" 
                          />
                          <text x={pt.x} y={pt.y - 32} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                            {pt.role}
                          </text>
                          <text x={pt.x} y={pt.y - 20} fill="#a1a1aa" fontSize="7" fontWeight="bold" textAnchor="middle">
                            Score: {pt.score}% | {pt.date}
                          </text>
                        </g>
                      </g>
                    ))}
                  </svg>
                </div>
              ) : (
                <div className="h-[180px] border border-dashed border-zinc-900 rounded-xl bg-zinc-950/10 flex flex-col items-center justify-center text-center p-6 gap-2">
                  <TrendingUp className="size-8 text-zinc-700" />
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Insufficient telemetry for charting</p>
                  <p className="text-[9px] text-zinc-650 max-w-sm">Complete at least two mock evaluations to initialize performance trend maps.</p>
                </div>
              )}
            </motion.div>

            {/* Card 2: Conversational Telemetry (WPM & Filler Check) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pacing Speedometer */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 backdrop-blur-3xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">Speaking Speed</span>
                  <span className="text-[8px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded font-mono font-bold">WPM Tracking</span>
                </div>

                <div className="flex flex-col gap-3 my-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-4xl font-black text-white font-mono">
                      {averageWpm > 0 ? averageWpm : "N/A"}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Words Per Min</span>
                  </div>

                  {/* Speed Range indicator */}
                  <div className="space-y-1.5">
                    <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                      <div className="h-full w-[35%] bg-yellow-500/20" />
                      <div className="h-full w-[35%] bg-emerald-500/50" />
                      <div className="h-full w-[30%] bg-red-500/20" />

                      {/* Cursor */}
                      {averageWpm > 0 && (
                        <span 
                          className="absolute top-0 bottom-0 w-[3px] bg-white shadow-xl -translate-x-1/2 transition-all duration-1000"
                          style={{ left: `${Math.min(100, Math.max(0, (averageWpm / 220) * 100))}%` }}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-[7px] font-mono text-zinc-600 font-bold uppercase">
                      <span>Slow (&lt;120)</span>
                      <span className="text-emerald-400 font-black">Ideal (120-150)</span>
                      <span>Fast (&gt;150)</span>
                    </div>
                  </div>
                </div>

                <p className="text-[9px] text-zinc-500 leading-relaxed font-semibold uppercase mt-2">
                  {averageWpm >= 120 && averageWpm <= 150 
                    ? "✓ Your speaking pace is ideal for corporate interviews." 
                    : averageWpm > 0 
                      ? "⚠ Calibration required. Slow down or accelerate to align target cadence."
                      : "No vocal metrics saved. Perform a mock simulation to calibrate pace."}
                </p>
              </motion.div>

              {/* Vocal Fillers Matrix */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-6 backdrop-blur-3xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">Filler Word Auditing</span>
                  <span className="text-[8px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded font-mono font-bold">Frequencies</span>
                </div>

                <div className="flex flex-col gap-2.5 my-1.5">
                  {sortedFillerWords.length > 0 ? (
                    sortedFillerWords.map(([word, count]) => (
                      <div key={word} className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono font-bold uppercase">
                          <span className="text-white">&apos;{word}&apos;</span>
                          <span className="text-zinc-500">{count} events</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white opacity-40 rounded-full"
                            style={{ width: `${Math.min(100, (count / (totalInterviews * 4)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center text-center text-zinc-600 gap-1.5">
                      <Sliders className="size-5 text-zinc-700" />
                      <span className="text-[8px] font-mono font-bold uppercase">No vocal halts indexed</span>
                    </div>
                  )}
                </div>

                <p className="text-[9px] text-zinc-500 leading-relaxed font-semibold uppercase mt-2">
                  Identify speech anomalies. Audits trigger automatically from transcribed recordings.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Column (Span 1): Sidebar Bento blocks */}
          <div className="flex flex-col gap-6">
            


            {/* Interactive Guidance & Tips Carousel */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="p-6 backdrop-blur-3xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl flex flex-col justify-between min-h-[220px] relative group hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">Calibration Tip</span>
                <span className="text-[8.5px] font-mono font-bold text-white flex items-center gap-1">
                  <Sparkles className="size-3 text-zinc-400" /> AI Insights
                </span>
              </div>

              <div className="my-4 h-24 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTip}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col gap-1.5"
                  >
                    <span className="text-[7.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                      {interviewTips[activeTip].tag}
                    </span>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
                      {interviewTips[activeTip].title}
                    </h4>
                    <p className="text-[9px] text-zinc-400 leading-relaxed font-semibold">
                      {interviewTips[activeTip].text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-1.5 mt-2 justify-center">
                {interviewTips.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTip(idx)}
                    className={cn(
                      "size-1.5 rounded-full transition-all cursor-pointer",
                      activeTip === idx ? "bg-white w-3" : "bg-zinc-800 hover:bg-zinc-700"
                    )}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. ATS Resume Workspace Bento Card with Scroll Reveal */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="w-full relative z-10"
        >
          <div className="p-6 backdrop-blur-3xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl flex flex-col gap-6 group hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-zinc-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">ATS Resume Intelligence Desk</h3>
              </div>
              <Link 
                href="/user/resume" 
                className="text-[9px] font-mono font-black text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                Analyze Resume <ArrowUpRight className="size-3" />
              </Link>
            </div>

            {loadingData ? (
              <div className="py-8 flex items-center justify-center">
                <RefreshCw className="size-5 text-zinc-700 animate-spin" />
              </div>
            ) : latestResume ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stats & Metadata block */}
                <div className="p-5 bg-zinc-950/30 border border-white/5 rounded-xl flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[7px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Active Document</span>
                    <h4 className="text-xs font-black text-white truncate">{latestResume.fileName}</h4>
                    <p className="text-[8.5px] text-zinc-550 font-mono">
                      Parsed: {new Date(latestResume.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[8px] font-mono text-zinc-500 font-bold uppercase">
                      <span>ATS Matching Score</span>
                      <span className="text-white">{latestAtsScore}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          latestAtsScore >= 80 ? "bg-emerald-500" : "bg-yellow-500"
                        )}
                        style={{ width: `${latestAtsScore}%` }}
                      />
                    </div>
                  </div>

                  <Link 
                    href="/user/resume" 
                    className="w-full h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white text-[9px] font-mono font-bold uppercase tracking-wider flex items-center justify-center transition-all"
                  >
                    Modify Resume CV
                  </Link>
                </div>

                {/* Strengths & Weaknesses blocks */}
                <div className="p-5 bg-zinc-950/30 border border-white/5 rounded-xl space-y-3">
                  <span className="text-[8px] font-mono font-bold text-zinc-550 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-emerald-500" /> Structural Strengths
                  </span>
                  <div className="flex flex-col gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                    {resumeStrengths.length > 0 ? (
                      resumeStrengths.slice(0, 3).map((strength: string, i: number) => (
                        <div key={i} className="text-[9px] text-zinc-300 leading-relaxed font-semibold">
                          • {strength}
                        </div>
                      ))
                    ) : (
                      <div className="text-[8.5px] text-zinc-550 font-mono italic">No structural index data.</div>
                    )}
                  </div>
                </div>

                {/* Missing keywords block */}
                <div className="p-5 bg-zinc-950/30 border border-white/5 rounded-xl space-y-3">
                  <span className="text-[8px] font-mono font-bold text-zinc-550 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle className="size-3 text-yellow-500" /> Keyword Gaps
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                    {missingKeywords.length > 0 ? (
                      missingKeywords.slice(0, 8).map((keyword: string) => (
                        <span 
                          key={keyword}
                          className="text-[8.5px] font-mono font-bold uppercase text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <div className="text-[8.5px] text-zinc-550 font-mono italic">No keyword gap reports found.</div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-12 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/10 flex flex-col items-center justify-center text-center p-6 gap-3 select-none">
                <FileText className="size-8 text-zinc-700" />
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">No Resume parsed yet</p>
                  <p className="text-[9px] text-zinc-650 max-w-sm">Upload and scan your resume against corporate job listings to unlock full ATS recommendations.</p>
                </div>
                <Button asChild className="bg-white hover:bg-zinc-200 text-black font-black text-[9px] tracking-wider uppercase h-8 px-4 rounded-lg cursor-pointer transition-all">
                  <Link href="/user/resume">Upload Resume</Link>
                </Button>
              </div>
            )}
          </div>
        </motion.section>

        {/* 5. Scrollable Evaluation Logs Timeline with Scroll Reveal */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="w-full relative z-10"
        >
          <div className="p-6 backdrop-blur-3xl bg-zinc-950/40 border border-white/5 rounded-2xl shadow-xl flex flex-col gap-6 group hover:border-white/10 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-zinc-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Simulation Log & Assessment Logs</h3>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">
                {userInterviews.length} sessions indexed
              </span>
            </div>

            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-4">
              {loadingData ? (
                <div className="py-12 flex items-center justify-center">
                  <RefreshCw className="size-5 text-zinc-700 animate-spin" />
                </div>
              ) : userInterviews.length > 0 ? (
                <div className="relative border-l border-white/5 pl-6 ml-4 space-y-6 py-2">
                  {userInterviews.map((interview, index) => {
                    const score = interview.feedback?.totalScore || 0;
                    const date = new Date(interview.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    const strengthsList = interview.feedback?.strengths || [];

                    return (
                      <div 
                        key={interview.id} 
                        className="relative group/timeline-item"
                      >
                        {/* Timeline dot */}
                        <span className={cn(
                          "absolute -left-[31px] top-2 size-2 rounded-full border border-zinc-950 flex items-center justify-center transition-all duration-300",
                          score >= 80 ? "bg-white scale-125" : "bg-zinc-800"
                        )} />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 bg-zinc-950/30 hover:bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded-xl transition-all duration-300">
                          <div className="flex flex-col gap-1.5 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[8px] font-mono text-zinc-550 font-bold uppercase">{date}</span>
                              <span className="text-[7.5px] bg-white/5 text-zinc-400 border border-white/10 px-2 py-0.5 rounded font-mono font-bold uppercase">
                                #{userInterviews.length - index}
                              </span>
                            </div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{interview.role} Mock Interview</h4>
                            
                            {strengthsList.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {strengthsList.slice(0, 2).map((str: string, i: number) => (
                                  <span 
                                    key={i} 
                                    className="text-[7.5px] font-semibold text-zinc-450 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded"
                                  >
                                    {str}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest">Match score</span>
                              <span className="text-base font-mono font-black text-white">{score}%</span>
                            </div>
                            
                            <Link 
                              href={`/interview/${interview.id}/feedback`}
                              className="h-8 px-3.5 rounded-lg bg-zinc-900 border border-white/5 text-zinc-450 hover:text-white hover:bg-zinc-800 text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center transition-all cursor-pointer"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/10 flex flex-col items-center justify-center text-center p-6 gap-2">
                  <Clock className="size-6 text-zinc-700" />
                  <p className="text-[9px] text-zinc-505 font-bold uppercase tracking-wider">No completed trials found</p>
                  <Link href="/interview" className="text-white text-[9px] hover:underline font-bold tracking-widest uppercase flex items-center gap-1 transition-all">Launch first evaluation now {"→"}</Link>
                </div>
              )}
            </div>

          </div>
        </motion.section>

      </div>
    </div>
  );
}
