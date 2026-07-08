"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface InterviewTimerProps {
  initialSeconds: number | null;
  onTimeUp: () => void;
}

export function InterviewTimer({ initialSeconds, onTimeUp }: InterviewTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  if (secondsLeft === null) {
    return (
      <div className="flex items-center gap-1.5 font-mono font-black px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 text-[8.5px] uppercase tracking-wider">
        Unlimited
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 font-mono font-black px-3 py-1 rounded-full border transition-all duration-500",
        secondsLeft <= 60
          ? "text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse"
          : secondsLeft <= 120
          ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
          : "text-emerald-400 border-emerald-500/30 bg-zinc-300/10"
      )}
    >
      {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
      {String(secondsLeft % 60).padStart(2, "0")}
    </div>
  );
}
