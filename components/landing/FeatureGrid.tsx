"use client";

import { motion } from "framer-motion";
import { Cpu, Terminal, BarChart3, Check } from "lucide-react";

export default function FeatureGrid() {
  const springTransition = { type: "spring", stiffness: 80, damping: 18 };

  const features = [
    {
      title: "Conversational AI Engine",
      subtitle: "High-fidelity audio feedback",
      icon: Cpu,
      glowColor: "rgba(168, 85, 247, 0.15)", // Purple
      borderColor: "rgba(168, 85, 247, 0.4)",
      points: [
        "Vocal Filler Tracking: Logs verbal pauses like 'um', 'like', and 'ah'.",
        "WPM Pacing Analyzer: Guides speaking speed in the optimal WPM range.",
        "STAR Method Recognition: Rates how well you outline answers.",
      ],
    },
    {
      title: "ATS-Optimized Resumes",
      subtitle: "Pass the screening algorithms",
      icon: Terminal,
      glowColor: "rgba(34, 211, 238, 0.15)", // Cyan
      borderColor: "rgba(34, 211, 238, 0.4)",
      points: [
        "6 Professional Templates: Built specifically to pass standard filters.",
        "Real-Time HTML Preview: Edit raw values and see updates instantly.",
        "Export Support: Download clean PDF files maintaining parseable structures.",
      ],
    },
    {
      title: "Real-Time AI Analytics",
      subtitle: "Instant feedback reports on finish",
      icon: BarChart3,
      glowColor: "rgba(236, 72, 153, 0.15)", // Pink
      borderColor: "rgba(236, 72, 153, 0.4)",
      points: [
        "Aggregated Grading Scale: Get overall prep readiness marks.",
        "Strengths & Improvements: AI outlines exactly what to fix.",
        "Session Logs: Review the full transcription of your dialogue.",
      ],
    },
  ];

  return (
    <section id="features" className="relative w-full py-28 bg-transparent scroll-mt-16 z-10">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(138,43,226,0.06)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springTransition}
          className="text-center space-y-4 mb-20"
        >
          <span className="text-xs font-black tracking-[0.2em] text-purple-400 uppercase">Core Capabilities</span>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.03)]">
            Built for developers, <br />
            <span className="text-zinc-500 bg-gradient-to-r from-zinc-500 to-zinc-300 bg-clip-text text-transparent">engineered to convert.</span>
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-semibold">
            A comprehensive suite of tools designed to drill conversational fluency, structural logic, and ATS parser readiness.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...springTransition, delay: idx * 0.08 }}
              whileHover={{ 
                scale: 1.03, 
                y: -5,
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px ${feat.glowColor}`,
                borderColor: feat.borderColor
              }}
              className="p-8 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden group transition-all duration-300 flex flex-col justify-between floating-card shadow-2xl"
            >
              {/* Subtle top glow overlay */}
              <div 
                className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${feat.borderColor.replace('0.4', '1')}, transparent)` 
                }} 
              />
              
              <div className="space-y-6">
                <div 
                  className="size-11 bg-zinc-900/60 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300"
                  style={{ boxShadow: `inset 0 0 10px ${feat.glowColor}` }}
                >
                  <feat.icon className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">{feat.title}</h3>
                  <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mt-1.5">{feat.subtitle}</p>
                </div>

                <ul className="space-y-3.5 pt-5 border-t border-white/10 list-none">
                  {feat.points.map((pt, pIdx) => {
                    const [head, desc] = pt.split(":");
                    return (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-400 list-none">
                        <Check className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          <strong className="text-white font-bold">{head}</strong>: {desc}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
