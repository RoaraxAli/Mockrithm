"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Crown, Zap, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

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

  const headingWords = [
    { text: "Pricing", tone: "text-white" },
    { text: "built", tone: "text-white" },
    { text: "for", tone: "text-zinc-550" },
    { text: "serious", tone: "text-zinc-550" },
    { text: "applicants.", tone: "text-zinc-550" },
  ];

  const pricingDetails = {
    premium: isAnnual ? { monthly: 8, total: 96 } : { monthly: 10, total: 10 },
    pro: isAnnual ? { monthly: 20, total: 240 } : { monthly: 25, total: 25 },
  };

  const comparison = [
    { feature: "AI Voice Practice Engine", free: "Standard", premium: "Advanced", pro: "Ultra-Low Latency" },
    { feature: "Speech Pacing Telemetry", free: "Standard", premium: "Detailed Logs", pro: "Real-time Alerts" },
    { feature: "Mock Evaluation Sessions", free: "1 Session", premium: "Unlimited", pro: "Unlimited" },
    { feature: "ATS Optimized Templates", free: "1 Template", premium: "6 Templates", pro: "All Templates" },
    { feature: "Real-Time HTML Editor", free: false, premium: true, pro: true },
    { feature: "Vocal Filler Word Tracker", free: "Basic (Counts)", premium: "Complete (Timestamps)", pro: "Interactive Feedback" },
    { feature: "Advanced System Design Engine", free: false, premium: false, pro: "Full Access" },
    { feature: "Custom Job Description Sync", free: false, premium: false, pro: "Unlimited" },
    { feature: "Priority AI Queue Access", free: false, premium: true, pro: "Instant Routing" },
    { feature: "1-on-1 Sharing Metrics", free: false, premium: false, pro: "Supported" },
  ];

  return (
    <section id="pricing" className="py-24 relative scroll-mt-16 z-10 text-white bg-transparent">
      {/* Cinematic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.01)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Heading Segment */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-zinc-950/60 border border-white/5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 font-mono mb-4">
            <Sparkles className="size-3 text-white" /> Access Tiers
          </div>
          <h2
            ref={headingRef}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] flex flex-wrap justify-center gap-x-3 uppercase"
          >
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

        {/* Premium Billing Switcher */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative p-1 bg-zinc-950/80 border border-white/5 rounded-full flex items-center shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative z-10 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                !isAnnual ? "text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative z-10 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${
                isAnnual ? "text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full transition-colors ${isAnnual ? "bg-black/10 border border-black/10 text-black" : "bg-white/5 border border-white/10 text-zinc-300"}`}>
                Save 20%
              </span>
            </button>

            {/* Slider pill overlay */}
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute top-1 bottom-1 left-1 bg-white rounded-full"
              style={{
                width: isAnnual ? "130px" : "90px",
                x: isAnnual ? "94px" : "0px",
              }}
            />
          </div>
        </div>

        {/* 3-Column Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          
          {/* Card 1: Developer Basic */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full"
          >
            <div className="relative flex flex-col justify-between p-8 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md hover:border-white/15 transition-all duration-300 h-full shadow-2xl group">
              <div>
                <span className="text-[8px] font-black text-zinc-450 uppercase tracking-[0.25em] font-mono border-b border-white/5 pb-1">
                  Tier // 01
                </span>
                <h3 className="text-lg font-black uppercase mt-4 text-white">Developer Basic</h3>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0.00</span>
                  <span className="text-[10px] font-bold text-zinc-550">/ month</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-3 leading-relaxed font-semibold">
                  Standard access to evaluate key voice engines and sandbox interfaces.
                </p>

                <ul className="space-y-4 mt-8 border-t border-white/5 pt-6 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-3.5 text-zinc-450 shrink-0" />
                    <span>1 AI Voice Practice Session</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-3.5 text-zinc-450 shrink-0" />
                    <span>1 ATS Resume Template</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-500">
                    <Check className="size-3.5 text-zinc-700 shrink-0" />
                    <span>Filler words count only</span>
                  </li>
                </ul>
              </div>

              <Button asChild variant="outline" className="mt-8 h-10 border-white/10 text-zinc-300 hover:text-white bg-zinc-900/20 hover:bg-zinc-900/60 rounded-full w-full text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all duration-200">
                <Link href={getAuthRedirectUrl("sign-in")}>Start Free Session</Link>
              </Button>
            </div>
          </motion.div>

          {/* Card 2: Mockrithm Unlimited (Featured) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full relative"
          >
            {/* Glowing neon halo overlay */}
            <div className="absolute inset-0 bg-white/[0.01] rounded-2xl blur-md pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-t-2xl z-40" />

            <div className="relative flex flex-col justify-between p-8 rounded-2xl border border-white/20 bg-white/[0.02] backdrop-blur-md hover:border-white/30 transition-all duration-300 h-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-30 group">
              
              {/* Highlight ribbon */}
              <div className="absolute -top-3.5 right-6 bg-white text-black text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center gap-1">
                <Crown className="size-3 fill-black text-black" /> Popular
              </div>

              <div>
                <span className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.25em] font-mono border-b border-white/10 pb-1">
                  Tier // 02
                </span>
                <h3 className="text-lg font-black uppercase mt-4 text-white flex items-center gap-1.5">
                  Mockrithm Unlimited
                </h3>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${pricingDetails.premium.monthly}.00</span>
                    <span className="text-[10px] font-bold text-zinc-400">/ month</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={isAnnual ? "ann" : "mon"}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="text-[9px] text-zinc-450 font-black uppercase tracking-wider mt-1"
                    >
                      {isAnnual ? `Billed annually at $${pricingDetails.premium.total}.00/yr` : "Billed monthly"}
                    </motion.p>
                  </AnimatePresence>
                </div>
                
                <p className="text-[11px] text-zinc-300 mt-3 leading-relaxed font-semibold">
                  Complete prep suite with unlimited speech assessments, dynamic ATS templates, and logs.
                </p>

                <ul className="space-y-4 mt-8 border-t border-white/10 pt-6 text-[10px] font-bold uppercase tracking-wider text-white">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-3.5 text-white shrink-0" />
                    <span>Unlimited AI Voice Interviews</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-3.5 text-white shrink-0" />
                    <span>6 Premium ATS Resume Templates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-3.5 text-white shrink-0" />
                    <span>Real-Time Resume HTML Editor</span>
                  </li>
                </ul>
              </div>

              <Button asChild className="mt-8 h-10 bg-white hover:bg-zinc-200 text-black rounded-full w-full text-[9px] font-black uppercase tracking-widest cursor-pointer flex justify-center items-center gap-1.5 shadow-[0_4px_15px_-3px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                <Link href={getAuthRedirectUrl("sign-up")} className="flex items-center justify-center gap-1">
                  Start Prep <ArrowRight className="size-3.5 text-black" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Card 3: Elite Strategist */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full"
          >
            <div className="relative flex flex-col justify-between p-8 rounded-2xl border border-white/5 bg-zinc-950/20 backdrop-blur-md hover:border-white/15 transition-all duration-300 h-full shadow-2xl group">
              <div>
                <span className="text-[8px] font-black text-zinc-450 uppercase tracking-[0.25em] font-mono border-b border-white/5 pb-1">
                  Tier // 03
                </span>
                <h3 className="text-lg font-black uppercase mt-4 text-white flex items-center gap-1.5">
                  Elite Strategist
                </h3>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${pricingDetails.pro.monthly}.00</span>
                    <span className="text-[10px] font-bold text-zinc-400">/ month</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={isAnnual ? "ann" : "mon"}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="text-[9px] text-zinc-450 font-black uppercase tracking-wider mt-1"
                    >
                      {isAnnual ? `Billed annually at $${pricingDetails.pro.total}.00/yr` : "Billed monthly"}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <p className="text-[11px] text-zinc-400 mt-3 leading-relaxed font-semibold">
                  For senior candidates requiring custom job syncs and full system design simulation modules.
                </p>

                <ul className="space-y-4 mt-8 border-t border-white/5 pt-6 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-3.5 text-zinc-450 shrink-0" />
                    <span>Everything in Unlimited</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-3.5 text-zinc-450 shrink-0" />
                    <span>System Design Interactive module</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-3.5 text-zinc-450 shrink-0" />
                    <span>Custom Job Description Sync</span>
                  </li>
                </ul>
              </div>

              <Button asChild variant="outline" className="mt-8 h-10 border-white/10 text-zinc-300 hover:text-white bg-zinc-900/20 hover:bg-zinc-900/60 rounded-full w-full text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all duration-200">
                <Link href={getAuthRedirectUrl("sign-up")}>Get Started Pro</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Comparison Matrix Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-white/5 rounded-2xl overflow-hidden bg-zinc-950/20 backdrop-blur-md shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/60 border-b border-white/5">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.25em] font-mono">Comparison Matrix</h4>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-zinc-550 uppercase tracking-widest">
              <HelpCircle className="size-3.5 text-zinc-600" /> Hover features for details
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px] min-w-[600px] uppercase font-bold tracking-wider">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-950/40 text-zinc-400">
                  <th className="p-4 w-2/5 font-black">Feature Parameter</th>
                  <th className="p-4 text-center font-black">Developer</th>
                  <th className="p-4 text-center font-black text-white">Unlimited</th>
                  <th className="p-4 text-center font-black">Elite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.015] transition-colors duration-150">
                    <td className="p-4 font-semibold text-zinc-400 font-mona-sans normal-case">{row.feature}</td>
                    
                    {/* Free column */}
                    <td className="p-4 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? <Check className="size-4 mx-auto text-emerald-400" /> : <span className="text-zinc-700 block font-black">─</span>
                      ) : (
                        <span className="text-[9px] text-zinc-450 font-black">{row.free}</span>
                      )}
                    </td>

                    {/* Premium/Unlimited column */}
                    <td className="p-4 text-center text-white bg-white/[0.005]">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? <Check className="size-4 mx-auto text-emerald-400" /> : <span className="text-zinc-700 block font-black">─</span>
                      ) : (
                        <span className="text-[9px] text-white font-black">{row.premium}</span>
                      )}
                    </td>

                    {/* Pro/Elite column */}
                    <td className="p-4 text-center">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? <Check className="size-4 mx-auto text-emerald-400" /> : <span className="text-zinc-700 block font-black">─</span>
                      ) : (
                        <span className="text-[9px] text-white font-black">{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
