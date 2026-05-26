"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

export default function OnboardingWelcome() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto mb-8 p-1"
    >
      <div className="backdrop-blur-xl bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden flex flex-col items-center text-center gap-4">
        <div className="absolute -top-10 -right-10 size-40 bg-cyan-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 size-40 bg-indigo-500/10 blur-3xl rounded-full" />
        
        <div className="size-12 rounded-full bg-cyan-950/50 border border-cyan-500/50 flex items-center justify-center mb-2 relative z-10">
          <Sparkles className="size-6 text-cyan-400 animate-pulse" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black text-white font-mono tracking-wide relative z-10">
          Welcome to Mockrithm AI Career Preparation
        </h2>
        
        <p className="text-sm md:text-base text-cyan-100/80 font-semibold max-w-2xl leading-relaxed relative z-10">
          Upload your resume to unlock advanced ATS analysis, tailored AI mock interviews, and personalized career assessments. We use this to tailor your entire experience.
        </p>

        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-4 relative z-10 text-cyan-500"
        >
          <ArrowDown className="size-5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
