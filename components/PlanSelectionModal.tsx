"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { updateUserTier } from "@/lib/actions/auth.action";
import { toast } from "sonner";

interface PlanSelectionModalProps {
  userId: string;
  userTier?: "freemium" | "premium" | null;
  onCompleted: () => void;
}

export default function PlanSelectionModal({
  userId,
  userTier,
  onCompleted,
}: PlanSelectionModalProps) {
  const [step, setStep] = useState<"choose" | "already_premium">(
    userTier === "premium" ? "already_premium" : "choose"
  );
  const [loading, setLoading] = useState(false);

  const handleSelectFreemium = async () => {
    setLoading(true);
    try {
      const res = await updateUserTier(userId, "freemium");
      if (res.success) {
        toast.success("Freemium tier activated successfully!");
        onCompleted();
      } else {
        toast.error("Failed to select plan. Please try again.");
      }
    } catch (e: any) {
      console.error(e);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPremium = () => {
    toast.success("Premium access confirmed!");
    onCompleted();
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 10.00, // Fixed USD 10.00 subscription amount
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        toast.success("Redirecting to Stripe secure checkout...");
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Failed to initialize checkout.");
        setLoading(false);
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Could not reach payment gateway.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <AnimatePresence mode="wait">
        {step === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/5 blur-[50px] rounded-full pointer-events-none" />

            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                <Sparkles className="size-5 text-white animate-pulse" /> Welcome to Mockrithm
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Please select your plan tier to continue your session
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Freemium Card */}
              <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-5 md:p-6 flex flex-col justify-between hover:border-zinc-800 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold tracking-widest text-zinc-550 uppercase bg-zinc-900 px-2.5 py-1 rounded-full">
                      Free Access
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-300">Freemium</h3>
                  <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                    Basic trial with standard features and restricted credits.
                  </p>
                  <ul className="space-y-2.5 mt-5 text-[11px] text-zinc-400">
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-zinc-600 shrink-0" />
                      <span>Standard AI Voice Engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-zinc-600 shrink-0" />
                      <span>1 Mock Interview Practice</span>
                    </li>
                    <li className="flex items-center gap-2 text-zinc-600">
                      <span>✕ No premium designs / templates</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={handleSelectFreemium}
                  disabled={loading}
                  className="mt-6 w-full py-2.5 rounded-lg border border-zinc-850 hover:bg-zinc-900 text-zinc-300 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex justify-center items-center gap-1.5"
                >
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Continue Freemium"}
                </button>
              </div>

              {/* Premium Card */}
              <div className="border border-white/10 bg-white/[0.02] rounded-xl p-5 md:p-6 flex flex-col justify-between hover:border-white/20 transition-all relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/[0.02] to-white/[0.08] pointer-events-none" />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold tracking-widest text-black uppercase bg-white px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Crown className="size-3 fill-black text-black" /> Premium
                    </span>
                    <span className="text-[11px] font-bold text-white">$10.00 USD</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Premium Tier</h3>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    Complete, unlimited access to advanced ATS designs & real-time analytics.
                  </p>
                  <ul className="space-y-2.5 mt-5 text-[11px] text-white">
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-white shrink-0" />
                      <span>Unlimited AI Voice Interviews</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-white shrink-0" />
                      <span>6 Premium ATS Resume Templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-white shrink-0" />
                      <span>Full Real-Time HTML Preview</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="mt-6 w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex justify-center items-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Initializing...
                    </>
                  ) : (
                    <>
                      Upgrade to Premium <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === "already_premium" && (
          <motion.div
            key="already_premium"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md border border-zinc-800 bg-zinc-950/70 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl text-center"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/5 blur-[50px] rounded-full pointer-events-none" />

            <div className="size-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Crown className="size-7 fill-white text-white" />
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Premium Tier Confirmed
            </h2>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Your premium membership is active. Enjoy unlimited access, premium ATS templates, and real-time interview practice.
            </p>

            <button
              onClick={handleConfirmPremium}
              className="mt-6 w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all cursor-pointer"
            >
              Confirm & Continue Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
