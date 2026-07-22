"use client";

import React, { useState, useEffect } from "react";
import { Gamepad2, Sparkles, X, ArrowRight, Trophy, Calendar } from "lucide-react";
import Link from "next/link";

export const WeeklyGamesModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem("mockrithm_weekly_games_modal_seen");
      if (!hasSeen) {
        // Delay slightly for smooth initial page hydration
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("LocalStorage check failed:", e);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem("mockrithm_weekly_games_modal_seen", "true");
    } catch (e) {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-emerald-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors z-10 cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          {/* Animated Header Badge & Icon */}
          <div className="relative">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 shadow-xl shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="size-8 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px] uppercase tracking-widest">
            <Sparkles className="size-3" /> Interactive Learning Games
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono uppercase">
              Master Coding With Weekly 3D Games!
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-mono">
              Welcome to Mockrithm! Enhance your frontend, CSS3, Flexbox, Grid, SQL, Git, and algorithm skills through 100-level interactive 3D games.
            </p>
          </div>

          {/* Weekly Habit Box */}
          <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 text-left">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Calendar className="size-5 text-amber-400" />
            </div>
            <div className="font-mono text-xs">
              <span className="font-bold text-amber-300 block uppercase text-[11px]">
                📅 Recommended Weekly Habit
              </span>
              <span className="text-zinc-400 text-[11px]">
                Visit Games <strong className="text-white">once every week</strong> to keep your developer problem-solving skills sharp!
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/games"
              onClick={handleDismiss}
              className="flex-1 py-3.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gamepad2 className="size-4" /> Play Games Now <ArrowRight className="size-4" />
            </Link>

            <button
              onClick={handleDismiss}
              className="py-3.5 px-5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
