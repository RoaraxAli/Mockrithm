"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalibrationModalProps {
  onSelected: (durationMinutes: number) => void;
}

export default function CalibrationModal({ onSelected }: CalibrationModalProps) {
  const [duration, setDuration] = useState<5 | 15 | 25>(15);

  const durationOptions = [
    { value: 5, label: "Brief", details: "5 Minutes • Focused Core Assessment" },
    { value: 15, label: "Medium", details: "10-15 Minutes • Standard Evaluation" },
    { value: 25, label: "Long", details: "20-25 Minutes • Deep Technical Inquest" }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md border border-zinc-900 bg-zinc-950/80 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/5 blur-[50px] rounded-full pointer-events-none" />

        <div className="size-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Clock className="size-6 text-white" />
        </div>

        <h2 className="text-xl md:text-2xl font-black text-white text-center tracking-tight uppercase">
          Calibrate Session
        </h2>
        <p className="text-xs text-zinc-400 text-center mt-2 leading-relaxed max-w-xs mx-auto">
          Choose a time limit. The interviewer will dynamically structure and pace questions to complete strictly within the parameter.
        </p>

        <div className="flex flex-col gap-3 mt-6">
          {durationOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setDuration(opt.value as 5 | 15 | 25)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-1",
                duration === opt.value
                  ? "bg-white/[0.03] border-white/20"
                  : "bg-zinc-950/20 border-zinc-900 hover:border-zinc-800"
              )}
            >
              <div className="flex justify-between items-center text-xs font-bold text-white uppercase tracking-wider">
                <span>{opt.label}</span>
                <span className={cn(
                  "size-4 rounded-full border flex items-center justify-center",
                  duration === opt.value ? "border-white bg-white" : "border-zinc-800"
                )}>
                  {duration === opt.value && <span className="size-2 rounded-full bg-black" />}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">{opt.details}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onSelected(duration)}
          className="mt-6 w-full h-11 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          Initiate Session <ArrowRight className="size-4" />
        </button>
      </motion.div>
    </div>
  );
}
