"use client";

import { motion } from "framer-motion";

export default function TelemetryShowcase() {
  const springTransition = { type: "spring" as const, stiffness: 90, damping: 18 };

  const telemetryItems = [
    { title: "STAR Evaluation", desc: "Measures story composition elements dynamically." },
    { title: "Acoustic Pacing Guard", desc: "Flagging excessive run-ons or speed drops." },
    { title: "Structural ATS Sync", desc: "Aligns spoken experience with resume keywords." },
  ];

  return (
    <section id="showcase" className="py-28 bg-transparent relative scroll-mt-16 z-10 text-white">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -40, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springTransition}
          className="md:col-span-5 space-y-6"
        >
          <span className="text-xs font-black tracking-[0.2em] text-cyan-400 uppercase">Live Telemetry</span>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[0.98] drop-shadow-[0_0_30px_rgba(255,255,255,0.03)]">
            Analyze speech pacing & parameters dynamically
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold">
            As you talk, our voice model captures speed patterns, hesitation anchors, and keyword match rates. Get immediate corrective guidelines.
          </p>

          <div className="space-y-5 pt-4">
            {telemetryItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring" as const, stiffness: 90, damping: 18, delay: idx * 0.1 }}
                className="flex gap-4 items-start"
              >
                <span className="size-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-zinc-350 font-black shrink-0 mt-0.5 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                  {idx + 1}
                </span>
                <div>
                  <h5 className="text-xs font-black text-white uppercase tracking-wider">{item.title}</h5>
                  <p className="text-[11px] text-zinc-450 font-semibold leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="md:col-span-7 flex justify-center items-center">
          <motion.div 
            initial={{ scale: 0.94, opacity: 0, rotateY: 8 }}
            whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ type: "spring" as const, stiffness: 60, damping: 18 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(6, 182, 212, 0.1)",
              borderColor: "rgba(255,255,255,0.15)"
            }}
            className="w-full max-w-md bg-zinc-950/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-6">
              <span className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.15em]">Acoustic telemetry core</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest animate-pulse">Active Stream</span>
                <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-ping" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Telemetry Metric 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-zinc-400">Pacing Speed (WPM)</span>
                  <span className="text-cyan-400 font-extrabold shadow-sm">130 WPM</span>
                </div>
                <div className="h-2 w-full bg-zinc-900/80 rounded-full overflow-hidden border border-white/[0.03]">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" 
                  />
                </div>
              </div>

              {/* Telemetry Metric 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-zinc-400">STAR Content Alignment</span>
                  <span className="text-purple-400 font-extrabold">94%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900/80 rounded-full overflow-hidden border border-white/[0.03]">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "94%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                    className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full" 
                  />
                </div>
              </div>

              {/* Telemetry Metric 3 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-zinc-400">ATS Keyword Fit</span>
                  <span className="text-emerald-400 font-extrabold">88%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900/80 rounded-full overflow-hidden border border-white/[0.03]">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "88%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
