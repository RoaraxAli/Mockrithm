"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown, ArrowLeft, ArrowRight, Sparkles, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

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

  // Pricing configuration
  const prices = {
    premium: isAnnual ? { monthly: 8, total: 96 } : { monthly: 10, total: 10 },
    pro: isAnnual ? { monthly: 20, total: 240 } : { monthly: 25, total: 25 },
  };

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 bg-black min-h-screen text-white select-none pb-20 pt-12">
      {/* Background Overlays */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-15 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none z-0" />

      {/* Hero Header (Monochrome) */}
      <section className="relative w-full py-12 flex flex-col justify-center text-center">
        <div className="max-w-3xl mx-auto w-full px-6 flex flex-col items-center gap-4 z-10">
          <h1 className="text-xs font-black tracking-widest text-zinc-500 uppercase">Pricing Tiers</h1>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Choose your speed, <br />
            <span className="text-zinc-500">unlock professional preparation.</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-455 leading-relaxed max-w-xl">
            Upgrade your preparation portfolio. Pay monthly or choose annual billing to save up to 20%.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 mt-8 bg-zinc-950/80 p-1.5 rounded-full border border-zinc-900 shadow-xl z-20">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isAnnual 
                  ? "bg-white text-black font-black" 
                  : "text-zinc-450 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isAnnual 
                  ? "bg-white text-black font-black" 
                  : "text-zinc-450 hover:text-white"
              }`}
            >
              Annual Billing
              <span className="text-[9px] font-black bg-zinc-900 border border-zinc-800 text-white px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-6xl mx-auto w-full px-6 z-10 mt-6 grid md:grid-cols-3 gap-8 items-stretch">
        
        {/* Plan 1: Freemium */}
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-800 transition-all relative">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 border border-zinc-850 px-3 py-1 rounded-full">
                Freemium Plan
              </span>
            </div>
            <h4 className="text-3xl font-black text-white">$0.00</h4>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Standard practice evaluation to test the voice engine framework.
            </p>
            
            <ul className="space-y-3.5 mt-8 text-[11px] text-zinc-450 font-medium border-t border-zinc-900 pt-6">
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-zinc-650 shrink-0" />
                <span>1 AI Voice Practice Session</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-zinc-650 shrink-0" />
                <span>1 Basic ATS Resume Template</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-zinc-650 shrink-0" />
                <span>Vocal Filler words overview</span>
              </li>
              <li className="flex items-center gap-2.5 text-zinc-700">
                <span>✕ Restricted system design simulator</span>
              </li>
              <li className="flex items-center gap-2.5 text-zinc-700">
                <span>✕ No priority queuing support</span>
              </li>
            </ul>
          </div>
          
          <Button asChild variant="outline" className="mt-8 border-zinc-850 text-zinc-350 hover:text-white bg-zinc-950/40 rounded-xl w-full text-xs font-bold py-2.5 cursor-pointer">
            <Link href={getAuthRedirectUrl("sign-in")}>Start Free Trial</Link>
          </Button>
        </div>

        {/* Plan 2: Premium */}
        <div className="border border-white/10 bg-white/[0.015] rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-white/5 blur-[40px] rounded-full pointer-events-none" />
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold text-zinc-350 uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-1">
                <Crown className="size-3 fill-white text-white" /> Recommended
              </span>
              <span className="text-[9px] font-black uppercase bg-white text-black px-2 py-0.5 rounded-full">
                Popular
              </span>
            </div>
            
            <div className="flex items-baseline gap-1">
              <h4 className="text-3xl font-black text-white">${prices.premium.monthly}.00</h4>
              <span className="text-xs text-zinc-450 font-bold">/ month</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
              {isAnnual ? `Billed annually at $${prices.premium.total}.00/yr` : "Billed monthly"}
            </p>
            <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
              Complete practice with advanced analytics, custom resumes, and full session transcription logs.
            </p>
            
            <ul className="space-y-3.5 mt-8 text-[11px] text-white font-medium border-t border-zinc-900 pt-6">
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
                <span>Full Real-Time Resume HTML Editing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Vocal filler word timestamps</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Priority AI node queuing access</span>
              </li>
            </ul>
          </div>
          
          <Button asChild className="mt-8 bg-white hover:bg-zinc-200 text-black rounded-xl w-full text-xs font-bold py-2.5 cursor-pointer flex justify-center items-center gap-1.5 shadow-lg shadow-white/5">
            <Link href={getAuthRedirectUrl("sign-up")}>
              Unlock Premium <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Plan 3: Pro */}
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-800 transition-all relative">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 border border-zinc-850 px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="size-3 text-zinc-450" /> Pro Plan
              </span>
            </div>
            
            <div className="flex items-baseline gap-1">
              <h4 className="text-3xl font-black text-white">${prices.pro.monthly}.00</h4>
              <span className="text-xs text-zinc-450 font-bold">/ month</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
              {isAnnual ? `Billed annually at $${prices.pro.total}.00/yr` : "Billed monthly"}
            </p>
            <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
              Designed for serious tech applicants seeking advanced system design and team-level diagnostic reviews.
            </p>
            
            <ul className="space-y-3.5 mt-8 text-[11px] text-zinc-450 font-medium border-t border-zinc-900 pt-6">
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-zinc-450 shrink-0" />
                <span><strong>Everything in Premium</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-zinc-450 shrink-0" />
                <span>System Design Interactive Simulator</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-zinc-450 shrink-0" />
                <span>Custom Job Description parsing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-zinc-450 shrink-0" />
                <span>Detailed ATS match checklists</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-3.5 text-zinc-450 shrink-0" />
                <span>Telemetry dashboard sharing links</span>
              </li>
            </ul>
          </div>
          
          <Button asChild variant="outline" className="mt-8 border-zinc-850 text-zinc-350 hover:text-white bg-zinc-950/40 rounded-xl w-full text-xs font-bold py-2.5 cursor-pointer">
            <Link href={getAuthRedirectUrl("sign-up")}>Get Started Pro</Link>
          </Button>
        </div>

      </section>

      {/* Comparison Details Table */}
      <section className="max-w-6xl mx-auto w-full px-6 z-10 mt-24">
        <h3 className="text-lg font-black text-white text-center mb-8">Compare Tier Benefits</h3>
        <div className="border border-zinc-900 rounded-2xl overflow-hidden bg-zinc-950/20 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-950/60 font-bold uppercase text-zinc-450 tracking-wider">
                <th className="p-4">Feature Details</th>
                <th className="p-4 text-center">Freemium</th>
                <th className="p-4 text-center">Premium</th>
                <th className="p-4 text-center">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-medium">
              {comparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 text-zinc-350 font-semibold">{row.feature}</td>
                  <td className="p-4 text-center text-zinc-500">
                    {typeof row.free === "boolean" ? (row.free ? "✓" : "✕") : row.free}
                  </td>
                  <td className="p-4 text-center text-zinc-300">
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
      </section>
    </div>
  );
}
