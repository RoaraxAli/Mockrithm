"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [statusText, setStatusText] = useState("Initializing core...");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      if (
        hostname.startsWith("blog.") ||
        hostname.startsWith("resume.") ||
        hostname.startsWith("games.") ||
        hostname.startsWith("docs.") ||
        pathname.includes("/blog") ||
        pathname.includes("/resume") ||
        pathname.includes("/games") ||
        pathname.startsWith("/documentation")
      ) {
        return;
      }
    }

    // Only show on first launch of the session
    const hasVisited = sessionStorage.getItem("mockrithm_visited");
    if (hasVisited) {
      return;
    }

    setIsVisible(true);

    const statuses = [
      "Allocating memory...",
      "Connecting voice nodes...",
      "Resolving workspace pipelines...",
      "Finalizing compilers...",
      "Ready to launch."
    ];

    let start = 0;
    const end = 100;
    const duration = 1200; // Fast and snappy (1.2s total)
    const intervalTime = Math.floor(duration / end);

    const timer = setInterval(() => {
      start += 1;
      setProgress(start);

      // Dynamically change status text based on progress
      const statusIndex = Math.floor((start / 100) * (statuses.length - 1));
      setStatusText(statuses[statusIndex]);

      if (start >= end) {
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem("mockrithm_visited", "true");
        }, 150);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#030712] flex flex-col justify-between p-8 sm:p-12 select-none"
        >
          {/* Subtle Ambient Background Radial Glow */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-white/[0.02] blur-[120px]" />
          </div>

          {/* Top header telemetry */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-bold tracking-[0.3em] text-white/40 uppercase font-sans">
            <span>Mockrithm® Integrated System</span>
            <span>Est. 2026</span>
          </div>

          {/* Central Typography Reveal */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1">
            <div className="overflow-hidden relative py-4">
              <motion.h1
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl sm:text-7xl font-normal tracking-tight text-white/90 leading-none select-none text-center"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Mockrithm
              </motion.h1>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] uppercase tracking-[0.2em] text-white font-sans mt-3 text-center"
            >
              {statusText}
            </motion.p>
          </div>

          {/* Bottom Telemetry & Progress */}
          <div className="relative z-10 flex items-end justify-between font-sans">
            <div className="flex flex-col text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] gap-1">
              <span>Progress Allocation</span>
              <span className="text-white/60 font-mono font-normal">Core Node // Load</span>
            </div>
            
            <div className="text-5xl sm:text-6xl font-light font-mono text-white/80 leading-none tracking-tighter">
              {progress}%
            </div>
          </div>

          {/* Razor-thin progress line bar */}
          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-75" 
            style={{ width: `${progress}%` }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
