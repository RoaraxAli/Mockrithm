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
      
      {/* 1. Centered Cyberpunk Telemetry Hero Console */}
      <motion.section 
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center text-center rounded-md p-10 sm:p-16 border border-white/8 shadow-3xl bg-zinc-950/30 overflow-hidden"
      >
        {/* Neon Backlighting ambient nodes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-transparent rounded-md pointer-events-none" />
        
        {/* Telemetry Status Line */}
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-5 py-2.5 flex items-center gap-3.5 mb-8 shadow-md"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400 flex items-center gap-1.5">
            <Cpu className="size-3.5" /> AI voice engine online
          </span>
        </motion.div>

        {/* Centered Main Title */}
        <div className="max-w-3xl flex flex-col gap-6 relative">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight text-white tracking-tight">
            Face the Machine.
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-semibold max-w-xl mx-auto">
            Engage in face-to-face vocal simulations with Alex, our conversational AI agent. Rephrase your accomplishments and master pacing under pressure.
          </p>
        </div>

        {/* Futuristic Audio Grid Telemetry Mockup */}
        <div className="w-full max-w-lg mt-10 p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-4 relative overflow-hidden backdrop-blur-xs shadow-inner">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[9px] font-black uppercase text-gray-500 tracking-widest">
            <span className="flex items-center gap-1"><Terminal className="size-3" /> system_monitor.log</span>
            <span className="flex items-center gap-1"><Activity className="size-3 animate-pulse text-violet-400" /> Wavelength active</span>
          </div>
          
          {/* Waveform Bars */}
          <div className="flex items-end justify-center gap-2 h-14 w-full">
            <div className="w-1.5 bg-violet-500/20 rounded-full h-8 animate-[pulse_1.2s_infinite]" />
            <div className="w-1.5 bg-violet-500/40 rounded-full h-12 animate-[pulse_0.9s_infinite] delay-100" />
            <div className="w-1.5 bg-violet-500 rounded-full h-10 animate-[pulse_1.4s_infinite] delay-300" />
            <div className="w-1.5 bg-indigo-500 rounded-full h-14 animate-[pulse_0.8s_infinite] delay-200" />
            <div className="w-1.5 bg-indigo-500/40 rounded-full h-8 animate-[pulse_1.1s_infinite] delay-400" />
            <div className="w-1.5 bg-violet-500/20 rounded-full h-11 animate-[pulse_1s_infinite] delay-150" />
          </div>
        </div>

        {/* Primary Call to Action */}
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex gap-4 items-center justify-center max-sm:flex-col w-full max-w-sm"
        >
          <Button asChild className="btn-primary uppercase tracking-wider text-xs font-black px-10 py-3 rounded-md cursor-pointer h-12 w-full max-sm:w-full group">
            <Link href="/interview" className="flex items-center justify-center gap-2">
              <Play className="size-4 animate-pulse" /> Launch Session
            </Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* 2. Interactive Navigation Segment Filter */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 max-sm:flex-col max-sm:gap-4 max-sm:items-start relative">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-cyan-500 rounded-md" />
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-300">Diagnostic Hub</h2>
        </div>

        <div className="flex bg-black/60 p-0.5 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-wider">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-lg cursor-pointer transition-all",
              filter === "all" ? "bg-white/5 text-violet-400 font-black shadow-sm" : "text-gray-400 font-semibold"
            )}
          >
            All Roles
          </button>
          <button
            onClick={() => setFilter("past")}
            className={cn(
              "px-4 py-2 rounded-lg cursor-pointer transition-all",
              filter === "past" ? "bg-white/5 text-violet-400 font-black shadow-sm" : "text-gray-400 font-semibold"
            )}
          >
            Past Sessions
          </button>
          <button
            onClick={() => setFilter("available")}
            className={cn(
              "px-4 py-2 rounded-lg cursor-pointer transition-all",
              filter === "available" ? "bg-white/5 text-violet-400 font-black shadow-sm" : "text-gray-400 font-semibold"
            )}
          >
            Available practice
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
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <User className="size-4 text-violet-400" /> Historical Trials
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
              <div className="py-14 px-6 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md flex flex-col items-center text-center shadow-lg gap-3">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">No completed trials found in database</p>
                <Link href="/interview" className="text-violet-400 text-xs hover:text-violet-300 font-black tracking-widest uppercase flex items-center gap-1 transition-all">Launch first evaluation now &rarr;</Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Curated Available Practice Roles */}
        {(filter === "all" || filter === "available") && (
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <BookOpen className="size-4 text-indigo-400" /> Curated Assessments
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
              <div className="py-14 px-6 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md flex flex-col items-center text-center shadow-lg">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">No curated trial configurations online</p>
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
