"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Terminal, Sparkles, Shield, BarChart3, Clock, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";

export default function FeaturesPage() {
  const details = [
    {
      title: "Conversational AI Engine",
      subtitle: "High-fidelity real-time audio analysis",
      icon: Cpu,
      points: [
        "Vocal Filler Tracking: Logs and displays verbal pauses like 'um', 'like', and 'ah'.",
        "WPM Pacing Analyzer: Guides you to speak in the optimal 120-150 WPM range.",
        "STAR Method Recognition: Rates how well you outline Situation, Task, Action, and Result.",
      ],
    },
    {
      title: "ATS-Optimized Resumes",
      subtitle: "Pass the screening bot algorithms",
      icon: Terminal,
      points: [
        "6 Professional Templates: Built specifically to pass standard parser filters.",
        "Real-Time HTML Preview: Edit raw values and see updates immediately.",
        "Export Support: Download clean PDF files that maintain parseable structures.",
      ],
    },
    {
      title: "Real-Time AI Analytics",
      subtitle: "Instant feedback reports on completion",
      icon: BarChart3,
      points: [
        "Aggregated Grading Scale: Get overall prep readiness marks instantly.",
        "Strengths & Improvements: AI outlines exactly what you did well and what to fix.",
        "Session Logs: Review the full transcription of your dialogue after every round.",
      ],
    },
  ];

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 bg-black min-h-screen text-white select-none pb-20 pt-12">
      {/* Background Overlays */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-15 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none z-0" />

      {/* Hero Header (Monochrome) */}
      <section className="relative w-full py-16 flex flex-col justify-center text-center">
        <div className="max-w-3xl mx-auto w-full px-6 flex flex-col items-center gap-4 z-10">
          <h1 className="text-xs font-black tracking-widest text-zinc-500 uppercase">Core Capabilities</h1>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Built for developers, <br />
            <span className="text-zinc-500">engineered to convert.</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed max-w-xl">
            A comprehensive list of features built to train developers in conversational speech, systems design, and ATS-optimized document delivery.
          </p>
        </div>
      </section>

      {/* Grid List */}
      <section className="max-w-5xl mx-auto w-full px-6 z-10 mt-6">
        <div className="flex flex-col gap-12">
          {details.map((detail, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 relative overflow-hidden group hover:border-zinc-800 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  <div className="size-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white">
                    <detail.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{detail.title}</h3>
                    <p className="text-xs text-zinc-450 font-bold uppercase tracking-wider">{detail.subtitle}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-lg space-y-3">
                  {detail.points.map((pt, pIdx) => {
                    const [head, desc] = pt.split(":");
                    return (
                      <div key={pIdx} className="flex items-start gap-2 text-xs">
                        <Check className="size-4 text-zinc-400 shrink-0 mt-0.5" />
                        <p className="text-zinc-400 leading-relaxed font-medium">
                          <strong className="text-white font-bold">{head}</strong>: {desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 p-8 border border-zinc-900 bg-zinc-950/20 rounded-2xl text-center space-y-6 relative overflow-hidden max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-white/5 blur-[55px] rounded-full pointer-events-none" />
          <h4 className="text-lg font-black text-white">Ready to start practicing?</h4>
          <p className="text-xs text-zinc-450 max-w-md mx-auto leading-relaxed">
            Create your free freemium account and launch your first AI mock evaluation now. Upgrade anytime for lifetime premium access.
          </p>
          <Button asChild className="bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold px-8 h-11 transition-all cursor-pointer shadow-lg shadow-white/5">
            <Link href={getAuthRedirectUrl("sign-up")}>
              Sign Up Free
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
