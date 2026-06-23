"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { updateUserTier } from "@/lib/actions/auth.action";
import { toast } from "sonner";

interface EmbeddedPlanSelectorProps {
  userId: string;
  onSelected: (tier: "freemium" | "premium" | "pro") => void;
}

export default function EmbeddedPlanSelector({ userId, onSelected }: EmbeddedPlanSelectorProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const selectTier = async (tier: "freemium" | "premium" | "pro") => {
    setLoadingTier(tier);
    try {
      const res = await updateUserTier(userId, tier);
      if (res.success) {
        toast.success(`${tier.toUpperCase()} plan selected successfully!`);
        onSelected(tier);
      } else {
        toast.error("Failed to select plan. Please try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-zinc-100 font-mona-sans">
      <div className="text-center mb-4">
        <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">STEP 05 // MEMBERSHIP LEVEL</span>
        <h2 className="text-2xl font-black text-white mt-1">Select Your Plan</h2>
        <p className="text-xs text-zinc-400 mt-1">Select a membership level to save your profile and complete onboarding.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
        {/* Freemium Card */}
        <div className="border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-800 transition-all relative">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold tracking-widest text-zinc-450 uppercase bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-850">
                Free Trial
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-200">Freemium</h3>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
              Standard access for initial evaluations.
            </p>
            <ul className="space-y-2 mt-5 text-[11px] text-zinc-400">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-zinc-600 shrink-0" />
                <span>1 Voice Interview Practice</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-zinc-600 shrink-0" />
                <span>Basic ATS Score Summary</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => selectTier("freemium")}
            disabled={loadingTier !== null}
            className="mt-6 w-full py-2.5 rounded-xl border border-zinc-850 hover:bg-zinc-900 text-zinc-300 text-xs font-bold transition-all cursor-pointer flex justify-center items-center gap-1.5"
          >
            {loadingTier === "freemium" ? <Loader2 className="size-3.5 animate-spin" /> : "Select Freemium"}
          </button>
        </div>

        {/* Premium Card */}
        <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.01] to-white/[0.05] pointer-events-none" />
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold tracking-widest text-black uppercase bg-white px-2.5 py-1 rounded-full flex items-center gap-1">
                <Crown className="size-3 fill-black text-black" /> Pro Core
              </span>
              <span className="text-[11px] font-bold text-white font-mono">$10.00 USD</span>
            </div>
            <h3 className="text-lg font-bold text-white">Premium</h3>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Complete access to dynamic AI voice coaching & ATS rewrites.
            </p>
            <ul className="space-y-2 mt-5 text-[11px] text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Unlimited LLM Audio Mock Sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Instant Socratic Code Assistance</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>6 Premium ATS Templates</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => selectTier("premium")}
            disabled={loadingTier !== null}
            className="mt-6 w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all cursor-pointer flex justify-center items-center gap-1.5"
          >
            {loadingTier === "premium" ? <Loader2 className="size-3.5 animate-spin" /> : "Select Premium"}
          </button>
        </div>
      </div>
    </div>
  );
}
