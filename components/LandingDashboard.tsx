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
    <div className="max-w-7xl mx-auto flex flex-col gap-16 py-6 px-4 sm:px-6 font-mona-sans relative z-10">
      
      {/* 1. Modern Premium SaaS Hero Header */}
      <motion.section 
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center text-center rounded-[32px] p-10 sm:p-16 border border-zinc-800 bg-zinc-950/20 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Soft Radial Backlighting Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-violet-600/10 to-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-full px-5 py-2 flex items-center gap-2.5 mb-8 shadow-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          <span className="text-[10px] font-bold tracking-wider text-zinc-300 uppercase flex items-center gap-1.5">
            <Cpu className="size-3.5 text-violet-400" /> Next-Gen AI Voice Engine Active
          </span>
        </motion.div>

        {/* Centered Main Title */}
        <div className="max-w-3xl flex flex-col gap-6 relative">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white tracking-tight">
            Practice interviews <br/>
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              with conversational AI.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto font-medium">
            Conduct live, voice-driven mock interviews tailored to your experience. Improve delivery pacing, eliminate vocal fillers, and solve code challenges with real-time feedback.
          </p>
        </div>

        {/* Modern Live Vocal Cadence Stream Mockup */}
        <div className="w-full max-w-md mt-10 p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-4 relative overflow-hidden backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              Live Vocal Cadence stream
            </span>
            <span className="text-zinc-600 font-mono">STAR Analysis Mode</span>
          </div>
          
          {/* Waveform Bars */}
          <div className="flex items-end justify-center gap-2.5 h-12 w-full select-none mt-1">
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-4 animate-[pulse_1.2s_infinite]" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-8 animate-[pulse_0.9s_infinite] delay-100" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-6 animate-[pulse_1.4s_infinite] delay-300" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-11 animate-[pulse_0.8s_infinite] delay-200" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-5 animate-[pulse_1.1s_infinite] delay-400" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-9 animate-[pulse_1s_infinite] delay-150" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-full h-3 animate-[pulse_1.3s_infinite]" />
          </div>
        </div>

        {/* Primary Call to Action */}
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex gap-4 items-center justify-center max-sm:flex-col w-full max-w-sm"
        >
          <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm px-10 py-3 rounded-full cursor-pointer h-12 w-full max-sm:w-full hover:shadow-[0_4px_25px_rgba(124,58,237,0.3)] transition-all duration-300">
            <Link href="/interview" className="flex items-center justify-center gap-2">
              <Play className="size-4 fill-white" /> Start Practice Interview
            </Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* 2. Interactive Navigation Segment Filter */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 max-sm:flex-col max-sm:gap-4 max-sm:items-start relative">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-violet-500 rounded-md" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">Practice Dashboard</h2>
        </div>

        <div className="flex bg-zinc-950/60 p-1 rounded-xl border border-zinc-900 text-[10px] font-bold uppercase tracking-wider">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-lg cursor-pointer transition-all",
              filter === "all" ? "bg-white/5 text-violet-400 font-bold shadow-md border border-white/5" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            All Roles
          </button>
          <button
            onClick={() => setFilter("past")}
            className={cn(
              "px-4 py-2 rounded-lg cursor-pointer transition-all",
              filter === "past" ? "bg-white/5 text-violet-400 font-bold shadow-md border border-white/5" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            My Past Sessions
          </button>
          <button
            onClick={() => setFilter("available")}
            className={cn(
              "px-4 py-2 rounded-lg cursor-pointer transition-all",
              filter === "available" ? "bg-white/5 text-violet-400 font-bold shadow-md border border-white/5" : "text-zinc-500 hover:text-zinc-300"
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
        className="flex flex-col gap-12"
      >
        
        {/* Past Sessions List */}
        {(filter === "all" || filter === "past") && (
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <User className="size-4 text-violet-400" /> Past Session History
            </h3>
            
            {userInterviews.length > 0 ? (
              <div className="interviews-section">
                {userInterviews.map((interview) => (
                  <motion.div key={interview.id} whileHover={{ y: -3 }} className="h-full">
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
              <div className="py-14 px-6 rounded-2xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md flex flex-col items-center text-center shadow-lg gap-3">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">No completed trials found in database</p>
                <Link href="/interview" className="text-violet-400 text-xs hover:text-violet-300 font-bold tracking-widest uppercase flex items-center gap-1 transition-all">Launch first evaluation now &rarr;</Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Curated Available Practice Roles */}
        {(filter === "all" || filter === "available") && (
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <BookOpen className="size-4 text-indigo-400" /> Curated Practice Categories
            </h3>
            
            {allInterviews.length > 0 ? (
              <div className="interviews-section">
                {allInterviews.map((interview) => (
                  <motion.div key={interview.id} whileHover={{ y: -3 }} className="h-full">
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
              <div className="py-14 px-6 rounded-2xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md flex flex-col items-center text-center shadow-lg">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">No curated trial configurations online</p>
              </div>
            )}
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}

// Inline HSL Cn tool helper
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
