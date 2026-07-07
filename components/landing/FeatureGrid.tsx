"use client";

import { motion } from "framer-motion";
import { 
  Cpu, 
  Terminal, 
  BarChart3, 
  CheckCircle2, 
  Activity, 
  FileText, 
  Sliders, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle 
} from "lucide-react";
import Link from "next/link";

export default function FeatureGrid() {
  const cardReveal = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <section id="features" className="relative w-full py-28 bg-transparent scroll-mt-16 z-10">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(138,43,226,0.04)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-20"
        >
          <span className="text-xs font-black tracking-[0.2em] text-purple-400 uppercase">Core Capabilities</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
            Built for developers, <br />
            <span className="text-zinc-500 bg-gradient-to-r from-zinc-500 to-zinc-300 bg-clip-text text-transparent">engineered to convert.</span>
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-semibold">
            A comprehensive suite of tools designed to drill conversational fluency, structural logic, and ATS parser readiness.
          </p>
        </motion.div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Conversational AI Simulator (Spans 2 columns) */}
          <motion.div
            {...cardReveal}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="lg:col-span-2 p-8 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row gap-8 justify-between shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            
            {/* Left Content */}
            <div className="flex flex-col justify-between max-w-xs space-y-6">
              <div className="space-y-4">
                <div className="size-11 bg-zinc-900/60 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]">
                  <Cpu className="size-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Conversational AI Engine</h3>
                  <p className="text-[9px] text-zinc-450 font-black uppercase tracking-widest mt-1">High-fidelity audio feedback</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Practice live with our conversational voice agent. Analyze WPM cadence, log vocal filler stops, and measure STAR method story structure compliance.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[9px] font-mono text-zinc-550 font-bold uppercase">
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">Voice active</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">Latency &lt;200ms</span>
              </div>
            </div>

            {/* Right Visual Mockup (Interactive-looking waveform & telemetry panel) */}
            <div className="flex-1 min-w-[240px] bg-zinc-950/50 border border-white/5 rounded-xl p-5 flex flex-col justify-between gap-4 relative">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[8px] font-mono font-black text-zinc-550 uppercase tracking-widest">Speech Diagnostics</span>
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Mock Waveform */}
              <div className="h-8 flex items-end justify-between gap-1 px-2">
                {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.2, 0.6, 0.95, 0.45, 0.75, 0.35, 0.65, 0.85, 0.25, 0.55].map((val, idx) => (
                  <div 
                    key={idx}
                    className="w-full bg-zinc-800 rounded-t-sm transition-all duration-300 group-hover:bg-purple-500/60"
                    style={{ height: `${val * 100}%` }}
                  />
                ))}
              </div>

              {/* Telemetry log list */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase">
                  <span className="text-zinc-500">&apos;Basically&apos; (filler)</span>
                  <span className="text-yellow-500 flex items-center gap-0.5"><AlertTriangle className="size-2" /> 3x events</span>
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase">
                  <span className="text-zinc-500">&apos;Like&apos; (filler)</span>
                  <span className="text-zinc-400">1x event</span>
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase">
                  <span className="text-zinc-500">&apos;Um&apos; (filler)</span>
                  <span className="text-emerald-400 flex items-center gap-0.5"><CheckCircle2 className="size-2" /> 0x events</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: ATS Resume Desk (Spans 1 column) */}
          <motion.div
            {...cardReveal}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-1 p-8 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col justify-between shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            
            <div className="space-y-4">
              <div className="size-11 bg-zinc-900/60 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
                <Terminal className="size-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">ATS Resume Desk</h3>
                <p className="text-[9px] text-zinc-450 font-black uppercase tracking-widest mt-1">Pass the screening algorithms</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Upload and scan your resume against specific engineering profiles. Optimize keywords, identify structure gaps, and export clean, parseable PDF files.
              </p>
            </div>

            {/* Visual Circular matching score mockup */}
            <div className="mt-6 p-4 bg-zinc-950/50 border border-white/5 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[7px] font-mono font-bold text-zinc-550 uppercase tracking-widest">Matching score</span>
                <div className="text-lg font-mono font-black text-white">92% Match</div>
                <span className="text-[7.5px] font-mono text-emerald-400 font-bold uppercase">Optimal Rating</span>
              </div>
              <svg className="size-14 -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#22d3ee" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="20.1" 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 group-hover:stroke-cyan-300"
                />
              </svg>
            </div>
          </motion.div>

          {/* Card 3: Performance Cockpit (Spans 1 column) */}
          <motion.div
            {...cardReveal}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 p-8 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col justify-between shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
            
            <div className="space-y-4">
              <div className="size-11 bg-zinc-900/60 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_10px_rgba(236,72,153,0.1)]">
                <BarChart3 className="size-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Real-Time Analytics</h3>
                <p className="text-[9px] text-zinc-450 font-black uppercase tracking-widest mt-1">Instant telemetry reports</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Log completed trials, map performance trends over time, and outline exact strengths and weaknesses using dynamic grading matrices.
              </p>
            </div>

            {/* Visual SVG Mini trend chart mockup */}
            <div className="mt-6 p-4 bg-zinc-950/50 border border-white/5 rounded-xl flex flex-col justify-between gap-3">
              <div className="flex justify-between text-[7px] font-mono font-bold text-zinc-550 uppercase">
                <span>Evaluations Trend</span>
                <span className="text-pink-400 flex items-center gap-0.5"><TrendingUp className="size-2" /> +15% gain</span>
              </div>
              
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 60">
                <path 
                  d="M 10 50 Q 50 42 90 25 T 180 12" 
                  fill="none" 
                  stroke="#ec4899" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  className="transition-all duration-300 group-hover:stroke-pink-400"
                />
                <circle cx="180" cy="12" r="3.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1" />
              </svg>
            </div>
          </motion.div>

          {/* Card 4: Custom Simulator Presets (Spans 2 columns) */}
          <motion.div
            {...cardReveal}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-2 p-8 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row gap-8 justify-between shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* Left Content */}
            <div className="flex flex-col justify-between max-w-xs space-y-6">
              <div className="space-y-4">
                <div className="size-11 bg-zinc-900/60 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Sliders className="size-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Targeted Presets</h3>
                  <p className="text-[9px] text-zinc-450 font-black uppercase tracking-widest mt-1">Calibrated interview profiles</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Launch simulations tailored for specific developer profiles. Includes built-in contexts for Frontend Architects, System Design, and STAR Behavioral questions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[9px] font-mono text-zinc-550 font-bold uppercase">
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">Frontend</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">Systems</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5">STAR</span>
              </div>
            </div>

            {/* Right Visual Preset mock items list */}
            <div className="flex-1 min-w-[240px] flex flex-col gap-2 justify-center">
              {[
                { name: "Frontend Architect", type: "Technical", level: "Senior" },
                { name: "Backend Engineer", type: "System Design", level: "Lead" },
                { name: "STAR Behavioral", type: "Behavioral", level: "All Tiers" }
              ].map((preset) => (
                <div 
                  key={preset.name}
                  className="p-3 border border-white/5 bg-zinc-950/50 rounded-xl flex items-center justify-between group/item transition-all duration-300 hover:bg-white/5"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{preset.name}</span>
                    <span className="text-[7.5px] font-mono font-bold text-zinc-500 uppercase">{preset.type} • {preset.level}</span>
                  </div>
                  <div className="size-6 bg-white/5 group-hover/item:bg-white text-zinc-500 group-hover/item:text-black rounded-lg border border-white/5 flex items-center justify-center transition-all duration-300">
                    <ChevronRight className="size-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
