"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";

export default function HeroSection() {
  const springTransition = { type: "spring" as const, stiffness: 90, damping: 18 };

  return (
    <section
      id="intro"
      className="relative w-full min-h-screen flex flex-col justify-center items-center pt-24 bg-transparent overflow-hidden select-none"
    >
      {/* Glow highlight background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(138,43,226,0.15)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(0,191,255,0.06)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-3xl pointer-events-none" />

      {/* Grid Dot Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />

      {/* Main glassmorphic wrapper */}
      <div className="max-w-4xl mx-auto w-full px-6 sm:px-8 flex flex-col items-center text-center gap-6 z-10 py-12 relative">
        {/* Apple/Vercel-like sleek micro-badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-[10px] font-black uppercase tracking-[0.15em] text-zinc-300"
        >
          <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          Core Engine v2.4.0 Online
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...springTransition, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] text-white tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          Face the machine. <br />
          <span className="text-zinc-500 bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-650 bg-clip-text text-transparent">
            Master the interview.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.2 }}
          className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed font-medium max-w-2xl tracking-wide"
        >
          Conduct dynamic, voice-driven mock interviews tailored specifically to your resume. Eliminate vocal fillers, perfect your pacing, and pass corporate screeners with automated real-time analytics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.3 }}
          className="flex gap-4 items-center justify-center max-sm:flex-col w-full max-w-md mt-4"
        >
          <Button
            asChild
            className="bg-white hover:bg-zinc-200 text-black font-extrabold text-xs px-8 py-3 rounded-xl cursor-pointer h-12 w-full sm:w-48 transition-all duration-300 border border-white hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97]"
          >
            <Link
              href={getAuthRedirectUrl("sign-up")}
              className="flex items-center justify-center gap-2"
            >
              Start Prep <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-zinc-800 hover:border-zinc-650 bg-white/5 backdrop-blur-md text-zinc-300 hover:text-white font-extrabold text-xs px-8 py-3 rounded-xl cursor-pointer h-12 w-full sm:w-48 transition-all duration-300 flex items-center justify-center hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] active:scale-[0.97]"
          >
            <Link href={getAuthRedirectUrl("sign-in")}>Access Portal</Link>
          </Button>
        </motion.div>
      </div>

      {/* Dynamic Infinite Ticker */}
      <div className="w-full overflow-hidden py-4 border-y border-white/5 bg-black/40 backdrop-blur-md select-none relative z-10 mt-auto mb-16">
        <div className="animate-marquee space-x-12 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span>Conversational AI Mock interviews</span>
          <span>•</span>
          <span>System Design Drills</span>
          <span>•</span>
          <span>ATS Resume Builder</span>
          <span>•</span>
          <span>Real-time Speech Telemetry</span>
          <span>•</span>
          <span>STAR Method Evaluation</span>
          <span>•</span>
          <span>Vocal Filler Detection</span>
          <span>•</span>
          <span>Conversational AI Mock interviews</span>
          <span>•</span>
          <span>System Design Drills</span>
          <span>•</span>
          <span>ATS Resume Builder</span>
          <span>•</span>
          <span>Real-time Speech Telemetry</span>
          <span>•</span>
          <span>STAR Method Evaluation</span>
          <span>•</span>
          <span>Vocal Filler Detection</span>
          <span>•</span>
        </div>
      </div>
    </section>
  );
}
