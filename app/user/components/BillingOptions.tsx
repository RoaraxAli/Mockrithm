"use client";

import { useState, useEffect } from "react";
import { Check, Crown, ArrowRight, Sparkles, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import type { User } from "../types";

interface BillingOptionsProps {
  user?: User | null;
  onRefresh?: () => void;
}

export function BillingOptions({ user, onRefresh }: BillingOptionsProps) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(user || null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      return;
    }
    if (clerkLoaded && clerkUser) {
      import("@/app/user/lib/firestore").then(({ getUserData }) => {
        getUserData(clerkUser.id).then((res) => {
          if (res) setCurrentUser(res);
        });
      });
    }
  }, [user, clerkLoaded, clerkUser]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="size-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const currentTier = currentUser.tier || "freemium";
  const currentInterval = currentUser.billingInterval || "monthly";

  // Pricing configuration
  const prices = {
    premium: isAnnual ? { monthly: 12, total: 144, amount: 144 } : { monthly: 15, total: 15, amount: 15 },
    pro: isAnnual ? { monthly: 24, total: 288, amount: 288 } : { monthly: 30, total: 30, amount: 30 },
  };

  const handlePay = async (plan: "premium" | "pro", amount: number) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          plan,
          billingInterval: isAnnual ? "annual" : "monthly",
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 font-mona-sans p-2 text-white">
      {/* Active Subscription Status Banner */}
      <div className="relative p-6 rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Plan</h3>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white capitalize">
                {currentTier === "pro" 
                  ? "Pro Membership" 
                  : currentTier === "premium" 
                  ? "Premium Membership" 
                  : "Freemium Account"}
              </span>
              {currentTier !== "freemium" && (
                <span className="flex items-center gap-1 text-[9px] font-black uppercase bg-white text-black px-2.5 py-0.5 rounded-full">
                  {currentTier === "pro" ? <Zap className="size-2.5 fill-black" /> : <Crown className="size-2.5 fill-black" />} 
                  {currentInterval === "annual" ? "Annual" : "Monthly"}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              {currentTier === "pro"
                ? "You have full, unrestricted access to systems design, mock interviews, and advanced ATS tools."
                : currentTier === "premium"
                ? "You have active access to 70 mock interviews per month, speech analysis, and unlimited resume scans."
                : "Your account is on the Free tier. Access up to 5 mock interviews and 5 ATS resume scans."}
            </p>
          </div>
          
        </div>
      </div>

      {/* Monthly / Annual Billing Toggle Switch */}
      {currentTier === "freemium" && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 bg-zinc-950/80 p-1.5 rounded-full border border-zinc-900 shadow-xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isAnnual 
                  ? "bg-white text-black font-black" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isAnnual 
                  ? "bg-white text-black font-black" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual
              <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-white px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Plan Cards Grid */}
      {currentTier === "freemium" ? (
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Premium Upgrade */}
          <div className="border border-white/10 bg-white/[0.01] rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-20 bg-white/5 blur-[35px] rounded-full pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-bold tracking-widest text-black bg-white px-2.5 py-1 rounded-full flex items-center gap-1 uppercase">
                  <Crown className="size-3 fill-black text-black" /> Premium
                </span>
                <span className="text-[11px] font-bold text-white">${prices.premium.monthly}.00/mo</span>
              </div>
              <h3 className="text-lg font-bold text-white">Premium Upgrade</h3>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Unlock 70 high-fidelity voice interviews per month and unlimited ATS resume scans.
              </p>
              <ul className="space-y-2.5 mt-5 text-[11px] text-zinc-350">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-zinc-400 shrink-0" />
                  <span>70 AI Voice Interviews / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-zinc-400 shrink-0" />
                  <span>Unlimited ATS Resume Scans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-zinc-400 shrink-0" />
                  <span>Full Real-Time Resume HTML Editing</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => handlePay("premium", prices.premium.amount)}
              disabled={loadingPlan !== null}
              className="mt-6 w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex justify-center items-center gap-1.5"
            >
              {loadingPlan === "premium" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  Activate Premium <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Card 2: Pro Upgrade */}
          <div className="border border-zinc-900 bg-zinc-950/20 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-800 transition-all relative">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-bold tracking-widest text-zinc-400 border border-zinc-850 px-2.5 py-1 rounded-full flex items-center gap-1 uppercase">
                  <Zap className="size-3 text-zinc-400" /> Pro Tier
                </span>
                <span className="text-[11px] font-bold text-white">${prices.pro.monthly}.00/mo</span>
              </div>
              <h3 className="text-lg font-bold text-white">Pro Membership</h3>
              <p className="text-zinc-450 text-xs mt-2 leading-relaxed">
                Add systems design engines, team-level logs sharing, and custom job configurations.
              </p>
              <ul className="space-y-2.5 mt-5 text-[11px] text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-zinc-650 shrink-0" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-zinc-650 shrink-0" />
                  <span>Interactive System Design Simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-zinc-650 shrink-0" />
                  <span>Telemetry reports sharing links</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => handlePay("pro", prices.pro.amount)}
              disabled={loadingPlan !== null}
              className="mt-6 w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex justify-center items-center gap-1.5"
            >
              {loadingPlan === "pro" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  Activate Pro <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </div>
          
        </div>
      ) : currentTier === "premium" ? (
        /* Upgradable from Premium to Pro */
        <div className="border border-white/5 bg-zinc-950/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white px-2.5 py-1 rounded-full inline-block">
              Upgrade Available
            </span>
            <h4 className="text-base font-bold text-white">Upgrade to Pro Membership</h4>
            <p className="text-xs text-zinc-400 max-w-md">
              Unlock interactive system design modules, custom resume matching, and 1-on-1 team sharing metrics for just $25.00/mo.
            </p>
          </div>
          <button
            onClick={() => handlePay("pro", isAnnual ? 240 : 25)}
            disabled={loadingPlan !== null}
            className="px-6 py-3 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            {loadingPlan === "pro" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Upgrade to Pro <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* Already Pro */
        <div className="p-8 border border-white/5 bg-zinc-950/20 rounded-2xl text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-white/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="size-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto">
            <Zap className="size-6 fill-white text-white" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-lg font-black text-white">Pro Access Active</h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your Pro membership is active. You have full, unlimited access to all system simulations, telemetry features, and document tailoring engines.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
