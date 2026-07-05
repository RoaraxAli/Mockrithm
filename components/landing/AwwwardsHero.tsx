"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ShieldAlert, Cpu, Activity, BarChart2, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AwwwardsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wpm, setWpm] = useState(135);
  const [fillers, setFillers] = useState(1);

  // Live telemetry simulator for the glassmorphic widget
  useEffect(() => {
    const interval = setInterval(() => {
      setWpm(Math.floor(130 + Math.random() * 12));
      if (Math.random() > 0.8) {
        setFillers((prev) => (prev < 3 ? prev + 1 : 0));
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Fade out all hero elements as we scroll down
      gsap.to(".hero-fade-target", {
        scrollTrigger: {
          trigger: "#awwwards-hero",
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
        opacity: 0,
        y: -40,
        ease: "power2.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 18 }
    }
  };

  return (
    <section
      ref={containerRef}
      id="awwwards-hero"
      className="relative w-full min-h-screen flex flex-col justify-center px-8 md:px-16 py-20 overflow-hidden bg-transparent z-20"
    >
      {/* Subtle Grid overlay background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* Main Grid Layout split (Asymmetrical) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="hero-fade-target max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-30"
      >
        
        {/* Left Column: Typographic Messaging (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
          
          {/* Cybernetic active system tag */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 bg-zinc-950/80 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 font-mono shadow-[0_0_15px_rgba(255,255,255,0.02)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM ACTIVE // VER 1.8
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants}>
            <h1 className="font-sans font-black tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] uppercase bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-100 to-zinc-650">
              Practice <br />
              <span className="text-zinc-550">Differently.</span>
            </h1>
          </motion.div>

          {/* Descriptive Pitch */}
          <motion.div variants={itemVariants} className="max-w-xl">
            <p className="text-xs md:text-sm font-semibold text-zinc-450 leading-relaxed font-mona-sans">
              Conduct dynamic, voice-driven mock interviews tailored specifically to your target roles. Track pacing stats, benchmark STAR structures, and analyze algorithmic output in real-time.
            </p>
          </motion.div>

          {/* New Custom Cybernetic Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4"
          >
            {/* Primary Action capsule */}
            <Link href={getAuthRedirectUrl("sign-up")} className="w-full sm:w-auto">
              <Button className="w-full sm:w-48 h-12 bg-white hover:bg-zinc-100 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-full border border-white transition-all duration-300 shadow-[0_8px_20px_-8px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
                <Play className="size-3.5 fill-black" />
                Launch Session
              </Button>
            </Link>

            {/* Secondary Action outlined */}
            <Link href={getAuthRedirectUrl("sign-in")} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-48 h-12 border-white/10 hover:border-white/30 bg-zinc-950/30 hover:bg-zinc-900/30 backdrop-blur-md text-zinc-400 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
                Access Portal
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Interactive Real-time Telemetry Dashboard (5 Columns) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          {/* Glassmorphic Cyber-Widget */}
          <div className="relative w-full max-w-sm p-6 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden group">
            {/* Corner glowing nodes */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.03] transition-all duration-700" />
            <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-white/25 rounded-full" />
            <div className="absolute -top-2 -right-2 w-1 h-1 bg-white/25 rounded-full" />

            {/* Widget header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-zinc-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white font-mono">Telemetry // Star</span>
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                Live Feed
              </span>
            </div>

            {/* Simulated Live Audio Spectrum/Waveform */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[8px] text-zinc-500 font-bold uppercase tracking-widest font-mono">
                <span>Vocal Stream</span>
                <span>Active</span>
              </div>
              
              {/* Pulsing bars */}
              <div className="h-10 flex items-end justify-between gap-1 px-1">
                {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.2, 0.6, 0.95, 0.45, 0.75, 0.35, 0.65, 0.85, 0.25, 0.55].map((val, idx) => (
                  <motion.div 
                    key={idx}
                    animate={{ height: [`${val * 100}%`, `${Math.max(10, val * 100 - (Math.random() * 40))}%`, `${val * 100}%`] }}
                    transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                    className="w-full bg-gradient-to-t from-zinc-800 to-white/85 rounded-t-sm"
                    style={{ height: `${val * 100}%` }}
                  />
                ))}
              </div>

              {/* Dynamic stats */}
              <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                <div className="bg-zinc-950/45 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">
                    <Activity className="size-3 text-zinc-400" />
                    Speed
                  </div>
                  <span className="text-sm font-black text-white font-mono">{wpm} <span className="text-[9px] text-zinc-500 font-bold">WPM</span></span>
                </div>
                <div className="bg-zinc-950/45 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">
                    <ShieldAlert className="size-3 text-zinc-400" />
                    Fillers
                  </div>
                  <span className="text-sm font-black text-white font-mono">{fillers} <span className="text-[9px] text-zinc-500 font-bold">UM/LIKE</span></span>
                </div>
              </div>

              {/* STAR Framework checklist progress */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[8px] text-zinc-500 font-bold uppercase tracking-widest font-mono">
                  <span>STAR Compliance</span>
                  <span>78%</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-white/70 w-[78%] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Downward indicator */}
      <div className="hero-fade-target w-full flex justify-center z-40 mt-auto pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[7px] font-black uppercase tracking-[0.3em] text-zinc-500">SCROLL TO DISCOVER</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white via-zinc-800 to-transparent relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute left-0 top-0 w-full h-1/2 bg-white"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
