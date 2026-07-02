"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Crown, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const springTransition = { type: "spring", stiffness: 90, damping: 18 };
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
        stagger: 0.03,
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
    { text: "for", tone: "text-zinc-500" },
    { text: "serious", tone: "text-zinc-500" },
    { text: "applicants.", tone: "text-zinc-500" },
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
    { feature: "Vocal Filler word tracker", free: "Basic (Counts)", premium: "Complete (Timestamps)", pro: "Interactive feedback" },
    { feature: "Advanced System Design Engine", free: false, premium: false, pro: "Full Access" },
    { feature: "Custom Job Description sync", free: false, premium: false, pro: "Unlimited" },
    { feature: "Priority AI queue access", free: false, premium: true, pro: "Instant routing" },
    { feature: "1-on-1 team sharing metrics", free: false, premium: false, pro: "Supported" },
  ];

  return (
    <section id="pricing" className="pt-4 pb-28 relative scroll-mt-16 z-10 text-white bg-transparent">
      {/* Background gradients */}
      <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.015)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Heading with split-text reveal */}
        <div className="text-center mb-12 pt-8">
          <span className="text-xs font-black tracking-[0.2em] text-zinc-400 uppercase">Flexible Access Tiers</span>
          <h2
            ref={headingRef}
            className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none flex flex-wrap justify-center gap-x-4"
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

        {/* Centered Billing Toggle Switch */}
        <div className="flex flex-col items-center mb-10">
          <div className="inline-flex items-center gap-3 bg-zinc-950/60 p-1.5 rounded-full border border-white/5 shadow-2xl backdrop-blur-md">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isAnnual 
                  ? "bg-white text-black font-black shadow-lg" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isAnnual 
                  ? "bg-white text-black font-black shadow-lg" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual Billing
              <span className="text-[9px] font-black bg-white/10 border border-white/20 text-zinc-300 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (Staggered layout to break standard grids) */}
        <div className="flex max-md:flex-col gap-8 md:gap-6 items-stretch mb-28 pt-8">
          
          {/* Freemium Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="flex md:-translate-y-6 md:flex-1 w-full"
          >
            <div
              className="border border-white/5 bg-zinc-950/20 backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-750 transition-all duration-300 relative pricing-card shadow-2xl w-full"
              style={{ willChange: "transform" }}
            >
              <div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 px-3 py-1 rounded-full">
                  Freemium Plan
                </span>
                <h4 className="text-4xl font-black text-white mt-6">$0.00</h4>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-medium">
                  Standard practice evaluation to test the voice engine framework.
                </p>
                <ul className="space-y-3.5 mt-8 text-[11px] text-zinc-300 font-medium border-t border-white/5 pt-6 list-none">
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-zinc-550 shrink-0" />
                    <span>1 AI Voice Practice Session</span>
                  </li>
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-zinc-550 shrink-0" />
                    <span>1 Basic ATS Resume Template</span>
                  </li>
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-zinc-550 shrink-0" />
                    <span>Vocal Filler words overview</span>
                  </li>
                </ul>
              </div>
              <Button asChild variant="outline" className="mt-8 border-white/10 text-zinc-300 hover:text-white bg-zinc-900/40 hover:bg-zinc-900/80 backdrop-blur-md rounded-xl w-full text-xs font-bold py-2.5 cursor-pointer transition-all duration-200">
                <Link href={getAuthRedirectUrl("sign-in")}>Start Free Trial</Link>
              </Button>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.08 }}
            className="flex md:flex-1 w-full"
          >
            <div
              className="border border-white/10 bg-white/[0.015] backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300 relative overflow-hidden pricing-card shadow-2xl w-full"
              style={{ willChange: "transform" }}
            >
              {/* Ambient inner glow */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-white/5 blur-[40px] rounded-full pointer-events-none" />
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest bg-white/5 border border-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="size-3 fill-white text-white" /> Recommended
                  </span>
                  <span className="text-[9px] font-black uppercase bg-white text-black px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    Popular
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <h4 className="text-4xl font-black text-white">${pricingDetails.premium.monthly}.00</h4>
                  <span className="text-xs text-zinc-400 font-bold">/ month</span>
                </div>
                <p className="text-[10px] text-zinc-455 font-bold uppercase mt-1">
                  {isAnnual ? `Billed annually at $${pricingDetails.premium.total}.00/yr` : "Billed monthly"}
                </p>
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed font-medium">
                  Complete practice with advanced analytics, custom resumes, and full session transcription logs.
                </p>
                <ul className="space-y-3.5 mt-8 text-[11px] text-white font-medium border-t border-white/10 pt-6 list-none">
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-white shrink-0" />
                    <span>Unlimited AI Voice Interviews</span>
                  </li>
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-white shrink-0" />
                    <span>6 Premium ATS Resume Templates</span>
                  </li>
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-white shrink-0" />
                    <span>Full Real-Time Resume HTML Editing</span>
                  </li>
                </ul>
              </div>
              <Button asChild className="mt-8 bg-white hover:bg-zinc-200 text-black rounded-xl w-full text-xs font-black py-2.5 cursor-pointer flex justify-center items-center gap-1.5 shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                <Link href={getAuthRedirectUrl("sign-up")}>
                  Start Prep <ArrowRight className="size-3.5 text-black" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.16 }}
            className="flex md:translate-y-6 md:flex-1 w-full"
          >
            <div
              className="border border-white/5 bg-zinc-950/20 backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-750 transition-all duration-300 relative pricing-card shadow-2xl w-full"
              style={{ willChange: "transform" }}
            >
              <div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-white/5 px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="size-3 text-white" /> Pro Plan
                </span>
                <div className="flex items-baseline gap-1 mt-6">
                  <h4 className="text-4xl font-black text-white">${pricingDetails.pro.monthly}.00</h4>
                  <span className="text-xs text-zinc-400 font-bold">/ month</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">
                  {isAnnual ? `Billed annually at $${pricingDetails.pro.total}.00/yr` : "Billed monthly"}
                </p>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed font-medium">
                  Designed for serious tech applicants seeking advanced system design and team-level diagnostic reviews.
                </p>
                <ul className="space-y-3.5 mt-8 text-[11px] text-zinc-350 font-medium border-t border-white/5 pt-6 list-none">
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-zinc-400 shrink-0" />
                    <span>Everything in Premium</span>
                  </li>
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-zinc-400 shrink-0" />
                    <span>System Design Interactive Simulator</span>
                  </li>
                  <li className="flex items-center gap-2.5 list-none">
                    <Check className="size-3.5 text-zinc-400 shrink-0" />
                    <span>Custom Job Description parsing</span>
                  </li>
                </ul>
              </div>
              <Button asChild variant="outline" className="mt-8 border-white/10 text-zinc-300 hover:text-white bg-zinc-900/40 hover:bg-zinc-900/80 backdrop-blur-md rounded-xl w-full text-xs font-bold py-2.5 cursor-pointer transition-all duration-200">
                <Link href={getAuthRedirectUrl("sign-up")}>Get Started Pro</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Benefit Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
          className="border border-white/5 rounded-2xl overflow-hidden bg-zinc-950/20 backdrop-blur-md shadow-2xl"
        >
          <h3 className="text-sm font-black text-white text-center py-4 bg-zinc-950/60 uppercase tracking-widest border-b border-white/5">Compare Benefits</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-950/40 font-bold uppercase text-zinc-400 tracking-wider">
                  <th className="p-4">Feature Details</th>
                  <th className="p-4 text-center">Freemium</th>
                  <th className="p-4 text-center text-zinc-400">Premium</th>
                  <th className="p-4 text-center">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors duration-150">
                    <td className="p-4 text-zinc-300 font-semibold">{row.feature}</td>
                    <td className="p-4 text-center text-zinc-400">
                      {typeof row.free === "boolean" ? (row.free ? "✓" : "✕") : row.free}
                    </td>
                    <td className="p-4 text-center text-white">
                      {typeof row.premium === "boolean" ? (row.premium ? "✓" : "✕") : row.premium}
                    </td>
                    <td className="p-4 text-center text-white font-bold">
                      {typeof row.pro === "boolean" ? (row.pro ? "✓" : "✕") : row.pro}
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
