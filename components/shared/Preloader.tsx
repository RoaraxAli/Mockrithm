"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      if (window.location.hostname.startsWith("blog.") || window.location.pathname.includes("/blog")) {
        return;
      }
    }
    // Check sessionStorage to show only on first launch of the session
    const hasVisited = sessionStorage.getItem("mockrithm_visited");
    if (hasVisited) {
      return;
    }

    setIsVisible(true);

    let start = 0;
    const end = 100;
    const duration = 1400; // 1.4 seconds initialization
    const intervalTime = Math.floor(duration / end);

    const timer = setInterval(() => {
      start += 1;
      setProgress(start);
      if (start >= end) {
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem("mockrithm_visited", "true");
        }, 300); // Brief hold at 100%
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col justify-between p-8 sm:p-16 select-none font-mona-sans"
        >
          {/* Top header telemetry */}
          <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-zinc-500 uppercase">
            <span>AI INTEGRATED CORE v1.0</span>
            <span>STATUS: INITIALIZING SYSTEM</span>
          </div>

          {/* Central Logo Reveal */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1], delay: 0.1 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white flex flex-col items-center leading-none"
              >
                MOCKRITHM.
              </motion.h1>
            </div>

          </div>

          {/* Bottom Loading Telemetry */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col text-[10px] font-bold text-zinc-500 uppercase tracking-wider gap-0.5">
              <span>SYSTEM ALLOCATION</span>
              <span className="text-zinc-400">LOADING AI AUDIO ENGINE...</span>
            </div>
            
            {/* Sleek Monospace Percentage Counter */}
            <div className="text-6xl sm:text-8xl lg:text-9xl font-light font-mono text-white leading-none tracking-tighter">
              {progress.toString().padStart(2, "0")}%
            </div>
          </div>

          {/* Core progress line bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-75" style={{ width: `${progress}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
