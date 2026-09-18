"use client";

import { useEffect, useRef, useState } from "react";
import { Wrench, Clock, Zap, Server, Shield, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import gsap from "gsap";

export default function MaintenancePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState({ hours: "02", minutes: "00", seconds: "00" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Status check demo state
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [serverStatus, setServerStatus] = useState<string | null>(null);

  // End time (2 hours from now)
  const [endTime] = useState(() => Date.now() + 2 * 60 * 60 * 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setCountdown({ hours: "00", minutes: "00", seconds: "00" });
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, "0");
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");

      setCountdown({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    // GSAP animations
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      );
    }

    if (portalRef.current) {
      // Continuous rotation of portal rings
      gsap.to(portalRef.current.querySelector(".ring-outer"), {
        rotation: 360,
        transformOrigin: "center",
        duration: 20,
        repeat: -1,
        ease: "none"
      });
      gsap.to(portalRef.current.querySelector(".ring-inner"), {
        rotation: -360,
        transformOrigin: "center",
        duration: 12,
        repeat: -1,
        ease: "none"
      });
      gsap.to(portalRef.current.querySelector(".star-center"), {
        scale: 1.15,
        opacity: 0.8,
        transformOrigin: "center",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    // Glow background animation
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: "random(-40, 40)",
        y: "random(-40, 40)",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    try {
      setSubmitting(true);
      const { db } = await import("@/firebase/client");
      const { collection, addDoc } = await import("firebase/firestore");
      await addDoc(collection(db, "feedback"), {
        email,
        type: "maintenance_subscription",
        message: "Wants to be notified when site goes live.",
        createdAt: new Date(),
      });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error("Subscription failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckStatus = () => {
    if (checkingStatus) return;
    setCheckingStatus(true);
    setServerStatus(null);

    setTimeout(() => {
      setCheckingStatus(false);
      setServerStatus("All systems operational. Main database online (Ping: 42ms).");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative font-sans select-none overflow-hidden w-full">
      
      {/* Cybernetic Glowing Nebula Backgrounds */}
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/10 via-fuchsia-600/10 to-cyan-600/10 rounded-full blur-[120px] pointer-events-none" 
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Central Glass Card */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-lg bg-zinc-950/40 border border-white/10 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 overflow-hidden text-center"
      >
        {/* Glow element inside the card */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Cyber Portal Header */}
        <svg ref={portalRef} className="w-24 h-24 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" viewBox="0 0 100 100">
          <circle className="ring-outer" cx="50" cy="50" r="45" fill="none" stroke="url(#purpleGrad)" strokeWidth="2.5" strokeDasharray="10 12" />
          <circle className="ring-inner" cx="50" cy="50" r="35" fill="none" stroke="url(#cyanGrad)" strokeWidth="1.5" strokeDasharray="6 8" />
          <polygon className="star-center" points="50,22 58,40 78,40 62,52 68,70 50,58 32,70 38,52 22,40 42,40" fill="url(#pinkGrad)" />
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Text Headers */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
          SYSTEM MAINTENANCE
        </h1>
        <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed mb-8">
          We're upgrading core services and database performance. The platform will be live again shortly.
        </p>

        {/* Neon Countdown Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto my-8">
          {[
            { value: countdown.hours, label: "HOURS" },
            { value: countdown.minutes, label: "MINUTES" },
            { value: countdown.seconds, label: "SECONDS" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                {item.value}
              </span>
              <span className="text-[8px] font-bold tracking-[0.15em] text-zinc-500 mt-1.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Subscription Form */}
        <div className="space-y-4 mb-8">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            Want to be notified when we are back online?
          </p>
          
          {submitted ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-5 py-3 rounded-full animate-fade-in mx-auto">
              <CheckCircle2 className="h-4 w-4" />
              <span>We'll send you an email the second we're live!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="relative max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                disabled={submitting}
                className="w-full bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.05] border border-white/10 focus:border-purple-500/50 rounded-full px-5 py-3.5 pr-14 text-sm text-white placeholder-zinc-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={submitting}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full px-4 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          )}
        </div>

        {/* Interactive Server Check */}
        <div className="pt-6 border-t border-white/5">
          <button
            onClick={handleCheckStatus}
            disabled={checkingStatus}
            className="inline-flex items-center gap-2.5 text-xs font-bold tracking-wider text-zinc-400 hover:text-white transition-colors bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-full px-5 py-2.5 cursor-pointer"
          >
            <Server className={`w-3.5 h-3.5 ${checkingStatus ? "animate-spin text-purple-400" : ""}`} />
            {checkingStatus ? "Pinging database nodes..." : "CHECK SERVER STATUS"}
          </button>
          
          {serverStatus && (
            <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl max-w-sm mx-auto animate-fade-in">
              <p className="text-xs text-emerald-400 font-medium font-mono">
                {serverStatus}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}