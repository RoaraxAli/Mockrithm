"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Crown, Zap, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { openPaddleCheckout } from "@/lib/paddle";
import type { User } from "@/app/user/types";

export default function PostLoginPricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  
  // Billing / User state
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      import("@/app/user/lib/firestore").then(({ getUserData }) => {
        getUserData(clerkUser.id).then((res) => {
          if (res) setCurrentUser(res as any);
        });
      });
    }
  }, [clerkLoaded, clerkUser]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".pricing-reveal-char");
      if (chars.length === 0) return;

      const tween = gsap.from(chars, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.02,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, headingRef);

    return () => ctx.revert();
  }, []);

  const currentTier = currentUser?.tier || "freemium";

  const handlePay = async (plan: "premium" | "pro", amount: number) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, plan, billingInterval: isAnnual ? "annual" : "monthly" }),
      });

      const data = await res.json();
      if (data.transactionId) {
        toast.success("Opening Paddle checkout modal...");
        const opened = await openPaddleCheckout(data.transactionId);
        if (!opened && data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          setLoadingPlan(null);
        }
      } else if (data.checkoutUrl) {
        toast.success("Redirecting to Paddle secure checkout...");
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Failed to initialize checkout.");
        setLoadingPlan(null);
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Could not reach payment gateway.");
      setLoadingPlan(null);
    }
  };

  const headingWords = [
    { text: "PRICING", tone: "text-white font-extrabold tracking-tight font-mona-sans" },
    { text: "BUILT", tone: "text-white font-extrabold tracking-tight font-mona-sans" },
    { text: "FOR", tone: "text-zinc-500 font-bold tracking-tight font-mona-sans" },
    { text: "SERIOUS", tone: "text-zinc-500 font-bold tracking-tight font-mona-sans" },
    { text: "DEVELOPERS.", tone: "text-zinc-500 font-bold tracking-tight font-mona-sans" },
  ];

  const pricingDetails = {
    premium: isAnnual ? { monthly: 12, total: 144, amount: 144 } : { monthly: 15, total: 15, amount: 15 },
    pro: isAnnual ? { monthly: 24, total: 288, amount: 288 } : { monthly: 30, total: 30, amount: 30 },
  };

  return (
    <section id="pricing" className="pt-24 pb-32 relative scroll-mt-16 z-10 text-white bg-zinc-950 min-h-screen overflow-hidden">
      {/* Cinematic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.015)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-white/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 font-mono mb-6">
            <Sparkles className="size-3.5 text-white" /> FLEXIBLE PREP PLANS
          </div>
          <h2 ref={headingRef} className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] flex flex-wrap justify-center gap-x-4 uppercase font-mona-sans">
            {headingWords.map((word, wi) => (
              <span key={wi} className="inline-flex overflow-hidden">
                {word.text.split("").map((char, ci) => (
                  <span key={ci} className={`pricing-reveal-char inline-block ${word.tone}`}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        <div className="flex flex-col items-center mb-20">
          <div className="relative p-1.5 bg-zinc-950 border border-white/10 rounded-full flex items-center shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <button onClick={() => setIsAnnual(false)} className={`relative z-10 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${!isAnnual ? "text-black" : "text-zinc-400 hover:text-white"}`}>
              {!isAnnual && <motion.div layoutId="billing-pill-slider-post" className="absolute inset-0 bg-white rounded-full -z-10" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              Monthly
            </button>
            <button onClick={() => setIsAnnual(true)} className={`relative z-10 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${isAnnual ? "text-black" : "text-zinc-400 hover:text-white"}`}>
              {isAnnual && <motion.div layoutId="billing-pill-slider-post" className="absolute inset-0 bg-white rounded-full -z-10" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              Annual
              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full transition-colors ${isAnnual ? "bg-black/10 text-black" : "bg-white/10 text-zinc-300"}`}>Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-24">
          {/* Freemium Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col h-full">
            <div className="relative flex flex-col justify-between p-8 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md hover:border-white/15 transition-all duration-300 h-full shadow-2xl group min-h-[680px]">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-wide text-white font-mona-sans">Developer Basic</h3>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white font-mono">$0.00</span>
                  <span className="text-[11px] font-bold text-zinc-550">/ month</span>
                </div>
                <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-semibold">Standard access to evaluate key voice engines and sandbox interfaces.</p>
                <div className="mt-8 border-t border-white/5 pt-6">
                  <span className="text-[9px] font-black text-zinc-450 uppercase tracking-[0.2em] font-mono block mb-4">Included Parameters:</span>
                  <ul className="space-y-4 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.03]"><span className="text-zinc-500 font-medium normal-case">AI Voice Practice Engine</span><span className="text-zinc-400">Standard</span></li>
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.03]"><span className="text-zinc-500 font-medium normal-case">Speech Pacing Telemetry</span><span className="text-zinc-400">Standard</span></li>
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.03]"><span className="text-zinc-500 font-medium normal-case">Mock Evaluation Sessions</span><span className="text-zinc-400">5 Sessions</span></li>
                  </ul>
                </div>
              </div>
              <Button disabled variant="outline" className="mt-8 h-12 border-white/10 text-zinc-300 bg-zinc-900/20 rounded-full w-full text-xs font-black uppercase tracking-widest cursor-not-allowed">
                {currentTier === "freemium" ? "Current Plan" : "Included"}
              </Button>
            </div>
          </motion.div>

          {/* Premium Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col h-full relative">
            <div className="absolute inset-0 bg-white/[0.01] rounded-2xl blur-md pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-t-2xl z-40" />
            <div className="relative flex flex-col justify-between p-8 rounded-2xl border border-white/20 bg-white/[0.02] backdrop-blur-md hover:border-white/30 transition-all duration-300 h-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-30 group min-h-[680px]">
              <div className="absolute -top-3.5 right-6 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <Crown className="size-3.5 fill-black text-black" /> Popular
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-wide text-white flex items-center gap-1.5 font-mona-sans">Mockrithm Unlimited</h3>
                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white font-mono">${pricingDetails.premium.monthly}.00</span>
                    <span className="text-[11px] font-bold text-zinc-400">/ month</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 mt-4 leading-relaxed font-semibold">Complete prep suite with unlimited speech assessments, dynamic ATS templates, and logs.</p>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] font-mono block mb-4">Included Parameters:</span>
                  <ul className="space-y-4 text-[11px] font-bold uppercase tracking-wider text-white">
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.06]"><span className="text-zinc-400 font-medium normal-case">AI Voice Practice Engine</span><span className="text-white">Advanced</span></li>
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.06]"><span className="text-zinc-400 font-medium normal-case">Speech Pacing Telemetry</span><span className="text-white">Detailed Logs</span></li>
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.06]"><span className="text-zinc-400 font-medium normal-case">Mock Evaluation Sessions</span><span className="text-white">70 Sessions</span></li>
                  </ul>
                </div>
              </div>
              <Button 
                disabled={loadingPlan !== null || currentTier === "premium" || currentTier === "pro"} 
                onClick={() => handlePay("premium", pricingDetails.premium.amount)}
                className="mt-8 h-12 bg-white hover:bg-zinc-200 text-black rounded-full w-full text-xs font-black uppercase tracking-widest cursor-pointer shadow-[0_4px_15px_-3px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-1.5"
              >
                {loadingPlan === "premium" ? <><Loader2 className="size-4 animate-spin" /> Connecting...</> : currentTier === "premium" || currentTier === "pro" ? "Current Plan" : <>Activate Premium <ArrowRight className="size-4" /></>}
              </Button>
            </div>
          </motion.div>

          {/* Pro Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col h-full">
            <div className="relative flex flex-col justify-between p-8 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md hover:border-white/15 transition-all duration-300 h-full shadow-2xl group min-h-[680px]">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-wide text-white flex items-center gap-1.5 font-mona-sans">Elite Strategist</h3>
                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white font-mono">${pricingDetails.pro.monthly}.00</span>
                    <span className="text-[11px] font-bold text-zinc-400">/ month</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-semibold">For senior candidates requiring custom job syncs and full system design simulation modules.</p>
                <div className="mt-8 border-t border-white/5 pt-6">
                  <span className="text-[9px] font-black text-zinc-455 uppercase tracking-[0.2em] font-mono block mb-4">Included Parameters:</span>
                  <ul className="space-y-4 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.03]"><span className="text-zinc-500 font-medium normal-case">AI Voice Practice Engine</span><span className="text-white">Ultra-Low</span></li>
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.03]"><span className="text-zinc-500 font-medium normal-case">Speech Pacing Telemetry</span><span className="text-white">Real-time</span></li>
                    <li className="flex items-center justify-between py-1.5 border-b border-white/[0.03]"><span className="text-zinc-500 font-medium normal-case">Mock Evaluation Sessions</span><span className="text-emerald-400">Unlimited</span></li>
                  </ul>
                </div>
              </div>
              <Button 
                disabled={loadingPlan !== null || currentTier === "pro"} 
                onClick={() => handlePay("pro", pricingDetails.pro.amount)}
                variant="outline" 
                className="mt-8 h-12 border-white/10 text-zinc-300 hover:text-white bg-zinc-900/20 hover:bg-zinc-900/60 rounded-full w-full text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                {loadingPlan === "pro" ? <><Loader2 className="size-4 animate-spin" /> Connecting...</> : currentTier === "pro" ? "Current Plan" : <>Activate Pro <ArrowRight className="size-4" /></>}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
