"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Terminal, Sparkles, ArrowRight, Play, Volume2, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";

export default function MarketingLanding() {
  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 bg-black min-h-screen text-white overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* Subtle Monochrome Ambient Lights (Charcoal/Silver) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-zinc-800/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-zinc-700/5 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Grid Dot Overlay */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />

      {/* Hero Section */}
      <section id="intro" className="relative w-full min-h-[90vh] flex flex-col justify-center pt-32 pb-20 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 grid lg:grid-cols-12 gap-12 items-center z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left items-start">
            {/* Version Badge (Monochrome) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/60 border border-zinc-800 rounded-full px-4 py-1.5 flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300" />
              </span>
              <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">
                Mockrithm Pre-Login Portal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black leading-[1.05] text-white tracking-tight"
            >
              Face the machine. <br />
              <span className="text-zinc-500">
                Master the interview.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base text-zinc-400 leading-relaxed font-medium"
            >
              Conduct dynamic, voice-driven mock interviews tailored specifically to your resume. Eliminate vocal fillers, perfect your pacing, and pass corporate screeners with automated real-time analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex gap-4 items-center justify-start max-sm:flex-col w-full mt-2"
            >
              <Button asChild className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-8 py-3 rounded-xl cursor-pointer h-12 w-full sm:w-48 transition-all duration-300">
                <Link href={getAuthRedirectUrl("sign-up")} className="flex items-center justify-center gap-2">
                  Try it Free <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-350 hover:text-white font-bold text-xs px-8 py-3 rounded-xl cursor-pointer h-12 w-full sm:w-48 transition-all duration-300">
                <Link href={getAuthRedirectUrl("sign-in")}>
                  Sign In
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Interface Demo Column (Monochrome mockup) */}
          <div className="lg:col-span-6 w-full relative flex justify-center items-center">
            <div className="absolute inset-0 bg-white/[0.02] blur-[80px] rounded-3xl pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-lg border border-zinc-800 bg-zinc-950/60 p-5 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-zinc-800" />
                  <span className="size-2.5 rounded-full bg-zinc-800" />
                  <span className="size-2.5 rounded-full bg-zinc-800" />
                </div>
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest">Mockrithm Engine Mockup</span>
                <span className="size-4" />
              </div>

              {/* Window Body - Mock AI dialogue */}
              <div className="space-y-4 text-xs">
                {/* AI Dialogue */}
                <div className="flex gap-3 items-start">
                  <div className="size-6 bg-white/5 border border-white/10 rounded-md flex items-center justify-center text-zinc-300 shrink-0">
                    <Cpu className="size-3.5" />
                  </div>
                  <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl rounded-tl-none text-zinc-400 leading-relaxed font-medium">
                    &quot;Hello! Let&apos;s start your Software Engineer interview. Please walk me through how you design a rate limiter in a distributed system.&quot;
                  </div>
                </div>

                {/* Audio Waveform Simulator */}
                <div className="py-2.5 border-y border-zinc-900 flex items-center justify-between px-2 gap-4">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="size-4 text-white animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Listening</span>
                  </div>
                  {/* Simulated Waves */}
                  <div className="flex gap-0.5 items-center">
                    <span className="h-2 w-[3px] bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="h-4 w-[3px] bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="h-3 w-[3px] bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
                    <span className="h-5 w-[3px] bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="h-2 w-[3px] bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>

                {/* Real-time Analytics Mockup */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white/[0.01] border border-zinc-900 rounded-xl text-center space-y-1">
                    <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-wider block">Pacing Speed</span>
                    <span className="text-sm font-black text-white">135 WPM</span>
                    <span className="text-[8px] text-zinc-450 font-bold block">✓ Optimal</span>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-zinc-900 rounded-xl text-center space-y-1">
                    <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-wider block">Filler Words</span>
                    <span className="text-sm font-black text-white">2 counts</span>
                    <span className="text-[8px] text-zinc-450 font-bold block">✓ Clean</span>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-zinc-900 rounded-xl text-center space-y-1">
                    <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-wider block">STAR Method</span>
                    <span className="text-sm font-black text-white">92%</span>
                    <span className="text-[8px] text-zinc-450 font-bold block">✓ Complete</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section Preview */}
      <section className="py-20 border-b border-zinc-900 bg-zinc-950/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-xs font-black tracking-widest text-zinc-550 uppercase">The Platform</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Fully Optimized Developer Assessments</h3>
          <p className="text-sm text-zinc-450 leading-relaxed max-w-xl mx-auto">
            From mock coding reviews to conversational systems design practices, prepare inside a standardized environment.
          </p>
          <Button asChild variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 rounded-xl text-xs font-bold px-6 h-10 transition-all">
            <Link href="/features" className="flex items-center gap-1">
              Read Detailed Features <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
