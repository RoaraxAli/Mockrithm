"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Play, ShieldAlert, Cpu, Activity, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
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
      
      {/* 1. Immersive Premium SaaS Hero Header */}
      <motion.section 
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 border-b border-zinc-900 bg-zinc-950/10 overflow-hidden pb-16 pt-12"
      >
        {/* Soft Radial Backlighting Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-violet-600/12 to-cyan-500/8 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 blur-[70px] rounded-full pointer-events-none" />
        
        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-full px-4.5 py-1.5 flex items-center gap-2 mb-6 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          <span className="text-[9px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-1">
            <Cpu className="size-3.5 text-violet-400" /> AI Voice Engine Online
          </span>
        </motion.div>

        {/* Centered Main Title */}
        <div className="max-w-4xl flex flex-col gap-4 relative z-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white tracking-tight">
            Practice interviews <br/>
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              with conversational AI.
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto font-medium">
            Conduct live, voice-driven mock interviews tailored to your experience. Improve delivery pacing, eliminate vocal fillers, and solve code challenges with real-time feedback.
          </p>
        </div>

        {/* Modern Live Vocal Cadence Stream Mockup */}
        <div className="w-full max-w-xs mt-8 p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl flex flex-col gap-2 relative overflow-hidden backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-[8px] font-bold text-zinc-500 tracking-wider uppercase">
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-violet-500 animate-pulse" />
              Live Vocal Cadence stream
            </span>
            <span className="text-zinc-650 font-mono">STAR Mode</span>
          </div>
          
          {/* Waveform Bars */}
          <div className="flex items-end justify-center gap-2 h-8 w-full select-none mt-1">
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-3 animate-[pulse_1.2s_infinite]" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-6 animate-[pulse_0.9s_infinite] delay-100" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-4 animate-[pulse_1.4s_infinite] delay-300" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-7 animate-[pulse_0.8s_infinite] delay-200" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-3 animate-[pulse_1.1s_infinite] delay-400" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-5 animate-[pulse_1s_infinite] delay-150" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-2 animate-[pulse_1.3s_infinite]" />
          </div>
        </div>

        {/* Primary Call to Action */}
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex gap-4 items-center justify-center max-sm:flex-col w-full max-w-sm"
        >
          <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs px-6 py-2 rounded-full cursor-pointer h-10 w-full sm:w-48 hover:shadow-[0_4px_15px_rgba(124,58,237,0.3)] transition-all duration-300">
            <Link href="/interview" className="flex items-center justify-center gap-2">
              <Play className="size-3.5 fill-white" /> Start Practice
            </Link>
          </Button>

          <Button 
            onClick={() => {
              document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline"
            className="border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:text-white font-bold text-xs px-6 py-2 rounded-full cursor-pointer h-10 w-full sm:w-48 transition-all duration-300"
          >
            Explore Dashboard {"↓"}
          </Button>
        </motion.div>
      </motion.section>

      {/* 2. Compact Dashboard Content Section */}
      <div id="dashboard-section" className="max-w-7xl mx-auto w-full flex flex-col gap-6 py-8 px-4 sm:px-6 relative scroll-mt-20 z-10">
        
        {/* Interactive Navigation Segment Filter */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 max-sm:flex-col max-sm:gap-3 max-sm:items-start relative">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-violet-500 rounded-md" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Practice Dashboard</h2>
          </div>

          <div className="flex bg-zinc-950/60 p-0.5 rounded-xl border border-zinc-900 text-[9px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg cursor-pointer transition-all",
                filter === "all" ? "bg-white/5 text-violet-400 font-bold shadow-md border border-white/5" : "text-zinc-550 hover:text-zinc-350"
              )}
            >
              All Roles
            </button>
            <button
              onClick={() => setFilter("past")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg cursor-pointer transition-all",
                filter === "past" ? "bg-white/5 text-violet-400 font-bold shadow-md border border-white/5" : "text-zinc-550 hover:text-zinc-350"
              )}
            >
              My Past Sessions
            </button>
            <button
              onClick={() => setFilter("available")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg cursor-pointer transition-all",
                filter === "available" ? "bg-white/5 text-violet-400 font-bold shadow-md border border-white/5" : "text-zinc-550 hover:text-zinc-350"
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
              <User className="size-3.5 text-violet-400" /> Past Session History
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
                <Link href="/interview" className="text-violet-400 text-[10px] hover:text-violet-300 font-bold tracking-widest uppercase flex items-center gap-1 transition-all">Launch first evaluation now {"→"}</Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Curated Available Practice Roles */}
        {(filter === "all" || filter === "available") && (
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-550 flex items-center gap-2">
              <BookOpen className="size-3.5 text-indigo-400" /> Curated Practice Categories
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

// Inline HSL Cn tool helper
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
