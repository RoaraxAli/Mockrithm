"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-mona-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md border border-zinc-900 bg-zinc-950/40 p-6 md:p-8 rounded-3xl shadow-2xl relative backdrop-blur-xl z-10 text-center"
      >
        <div className="size-16 bg-amber-950/10 border border-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="size-8 text-amber-500 animate-pulse" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/30 px-3.5 py-1.5 rounded-full border border-amber-900/20">
          Checkout Cancelled
        </span>

        <h1 className="text-2xl font-black text-white mt-4 tracking-tight">
          Transaction Cancelled
        </h1>
        <p className="text-zinc-450 text-xs mt-2 leading-relaxed">
          You aborted the Safepay checkout. No charges were made to your account. You can complete the upgrade at any time from your dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                if (window.self !== window.top) {
                  window.parent.location.href = "/";
                } else {
                  window.location.href = "/";
                }
              }
            }}
            className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            Return to Dashboard <ArrowRight className="size-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
