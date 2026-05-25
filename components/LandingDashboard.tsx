"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Play, ShieldAlert, Cpu, Activity, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InterviewCard from "./InterviewCard";

interface LandingDashboardProps {
  user: any;
  userInterviews: any[];
  allInterviews: any[];
}

export default function LandingDashboard({
  user,
  userInterviews,
  allInterviews,
}: LandingDashboardProps) {
  const [filter, setFilter] = useState<"all" | "past" | "available">("all");

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
            
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
              <span className="text-zinc-400">
                with conversational AI.
              </span>
            </h1>
            
            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg font-medium">
              Conduct live, voice-driven mock interviews tailored to your experience. Improve delivery pacing, eliminate vocal fillers, and solve code challenges with real-time feedback.
            </p>

            <motion.div 
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 items-center justify-start max-sm:flex-col w-full max-w-md mt-2"
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

          {/* Right Column: Visualizer & Active AI Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-md p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl flex flex-col gap-6 relative overflow-hidden backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
            >
              {/* Border shine effect */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Status Header */}
              <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 tracking-widest uppercase">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  AI SESSION ACTIVE
                </span>
                <span className="text-zinc-500 font-mono">ID: SEC_804</span>
              </div>

              {/* Visualizer & Orb Block */}
              <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/40 rounded-xl border border-white/5 relative group">
                <div className="absolute inset-0 premium-grid-dot opacity-20 pointer-events-none" />
                
                {/* Voice Orb Halo */}
                <div className="relative size-24 flex items-center justify-center mb-6">
                  {/* Concentric expanding circles */}
                  <motion.div 
                    animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0, 0.15] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border border-white/30"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0, 0.25] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="absolute inset-2 rounded-full border border-white/40"
                  />
                  {/* Outer glow core */}
                  <div className="absolute inset-4 rounded-full bg-white/5 blur-sm" />
                  
                  {/* Core Speaker Orb */}
                  <motion.div 
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative size-12 rounded-full bg-white flex items-center justify-center border border-white shadow-[0_0_20px_rgba(255,255,255,0.25)] animate-pulse"
                  >
                    <Activity className="size-5 text-black" />
                  </motion.div>
                </div>

                {/* Compact Waveform Bars */}
                <div className="flex items-end justify-center gap-1.5 h-6 w-full select-none">
                  {[2, 4, 3, 5, 2, 4, 2].map((height, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: [`${height * 3}px`, `${height * 6}px`, `${height * 3}px`] }}
                      transition={{ 
                        duration: 0.8 + idx * 0.15, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: idx * 0.1
                      }}
                      className="w-1 bg-white/70 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Chat Stream */}
              <div className="flex flex-col gap-4 font-mona-sans">
                {/* AI Question */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-1.5 items-start"
                >
                  <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">AI INTERVIEWER (SPEAKER)</span>
                  <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-zinc-900/60 border border-zinc-800 text-xs font-semibold text-zinc-200 max-w-[90%] leading-relaxed shadow-md">
                    "Explain closures in JavaScript and how they retrieve lexical scope."
                  </div>
                </motion.div>

                {/* Candidate Response */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col gap-1.5 items-end"
                >
                  <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">YOU (TRANSCRIBING...)</span>
                  <div className="px-4 py-2.5 rounded-2xl rounded-tr-none bg-white text-black text-xs font-semibold max-w-[90%] leading-relaxed shadow-[0_4px_12px_rgba(255,255,255,0.1)] border border-white/20">
                    "A closure is when a function remembers its outer lexical environment..."
                  </div>
                </motion.div>
              </div>

              {/* Metrics Divider */}
              <div className="h-px bg-zinc-800/80" />

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="flex flex-col p-2.5 rounded-lg bg-zinc-950/25 border border-white/5">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider">Speech Latency</span>
                  <span className="text-sm font-black text-white mt-0.5">180ms</span>
                </div>
                <div className="flex flex-col p-2.5 rounded-lg bg-zinc-950/25 border border-white/5">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider">Vocal Fillers</span>
                  <span className="text-sm font-black text-white mt-0.5">0 count</span>
                </div>
                <div className="flex flex-col p-2.5 rounded-lg bg-zinc-950/25 border border-white/5">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider">Tone Match</span>
                  <span className="text-sm font-black text-white mt-0.5">98% Neutral</span>
                </div>
                <div className="flex flex-col p-2.5 rounded-lg bg-zinc-950/25 border border-white/5">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider">Confidence Index</span>
                  <span className="text-sm font-black text-white mt-0.5">97% Stable</span>
                </div>
              </div>
            </motion.div>
          </div>
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
            
            {userInterviews.length > 0 ? (
              <div className="interviews-section">
                {userInterviews.map((interview) => (
                  <motion.div key={interview.id} whileHover={{ y: -2 }} className="h-full">
                    <InterviewCard
                      userId={user?.id}
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
            
            {allInterviews.length > 0 ? (
              <div className="interviews-section">
                {allInterviews.map((interview) => (
                  <motion.div key={interview.id} whileHover={{ y: -2 }} className="h-full">
                    <InterviewCard
                      userId={user?.id}
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
