"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AwwwardsHero() {
  const transition = { type: "spring", stiffness: 70, damping: 18 };
  const containerRef = useRef<HTMLDivElement>(null);

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
        y: -60,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="awwwards-hero"
      className="relative w-full h-screen bg-transparent select-none overflow-hidden"
    >
      {/* Top telemetry bar */}
      <div className="hero-fade-target absolute top-8 left-10 right-10 flex items-center justify-between text-[9px] font-black tracking-[0.2em] text-zinc-450 uppercase z-40 max-sm:hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <span className="size-1.5 rounded-full bg-white animate-pulse" />
          <span>FWA // Agency Core v2.4.0</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transition, delay: 0.15 }}
        >
          <span>Face the Machine • Master the Interview</span>
        </motion.div>
      </div>

      {/* ASYMMETRICAL TYPOGRAPHY COLLISION (Floating coordinates) */}
      <div className="hero-fade-target absolute inset-0 z-20 pointer-events-none">
        
        {/* Word 1: FACE - top left */}
        <motion.h1
          initial={{ opacity: 0, x: -100, y: -30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="absolute left-[10%] top-[25%] text-[9vw] max-sm:text-[14vw] font-black leading-none uppercase tracking-tighter text-white"
        >
          Face
        </motion.h1>

        {/* Word 2: THE - middle left */}
        <motion.h1
          initial={{ opacity: 0, x: -80, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="absolute left-[20%] top-[40%] text-[9vw] max-sm:text-[14vw] font-black leading-none uppercase tracking-tighter text-zinc-600/90"
        >
          the
        </motion.h1>

        {/* Word 3: MACHINE - middle right (will overlap with Centerpiece Mesh) */}
        <motion.h1
          initial={{ opacity: 0, x: 120, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ ...transition, delay: 0.3 }}
          className="absolute right-[8%] top-[34%] text-[10vw] max-sm:text-[15vw] font-extrabold leading-none uppercase tracking-tight text-white/95"
        >
          machine.
        </motion.h1>

        {/* Word 4: MASTER. - lower middle right */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.4 }}
          className="absolute right-[22%] top-[52%] text-[4vw] max-sm:text-[6vw] font-black leading-none uppercase tracking-[0.25em] text-zinc-700/80"
        >
          Master.
        </motion.h1>
      </div>

      {/* Description paragraph - placed asymmetrically bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: 0.5 }}
        className="hero-fade-target absolute right-[12%] bottom-[20%] max-w-xs sm:max-w-sm text-right z-30 max-sm:bottom-[32%] max-sm:left-6 max-sm:right-6 max-sm:text-left"
      >
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-450 leading-relaxed">
          Conduct dynamic, voice-driven mock interviews tailored specifically to your resume. Eliminate vocal fillers, perfect your pacing, and pass corporate screeners with automated real-time analytics.
        </p>
      </motion.div>

      {/* CTAs - placed asymmetrically bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: 0.65 }}
        className="hero-fade-target absolute left-[12%] bottom-[16%] flex flex-col gap-4 items-start z-35 pointer-events-auto max-sm:bottom-[8%] max-sm:left-6 max-sm:right-6 max-sm:w-full"
      >
        <div className="flex gap-4 items-center max-sm:flex-col max-sm:w-full">
          <Button
            asChild
            className="bg-white hover:bg-zinc-200 text-black font-extrabold text-[10px] uppercase tracking-widest px-8 py-3 rounded-none border border-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 h-11 w-44 max-sm:w-full"
            data-magnetic
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
            className="border-white/20 hover:border-white/50 bg-black/40 backdrop-blur-md text-zinc-350 hover:text-white font-extrabold text-[10px] uppercase tracking-widest px-8 py-3 rounded-none hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 h-11 w-44 max-sm:w-full"
            data-magnetic
          >
            <Link href={getAuthRedirectUrl("sign-in")}>Access Portal</Link>
          </Button>
        </div>
      </motion.div>

      {/* Scroll indicator - center bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
        className="hero-fade-target absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40"
      >
        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-zinc-500">SCROLL DOWN TO FLY</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white via-zinc-800 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute left-0 top-0 w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
