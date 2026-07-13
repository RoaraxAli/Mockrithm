"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleJourneyBegin = () => {
    window.location.href = "https://accounts.mockrithm.me/sign-up";
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b",
        scrolled 
          ? "bg-black/60 backdrop-blur-md border-white/10 py-3 shadow-lg" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="https://mockrithm.me"
          className="text-2xl md:text-3xl tracking-tight text-white select-none cursor-pointer"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Mockrithm<sup className="text-[10px] align-super">®</sup>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
          <Link href="https://mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">
            Home
          </Link>
          <Link href="https://mockrithm.me/interview" className="text-white/60 hover:text-white transition-colors duration-200">
            Interview
          </Link>
          <Link href="https://games.mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">
            Games
          </Link>
          <Link href="https://resume.mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">
            Resume
          </Link>
          <Link href="https://docs.mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">
            Docs
          </Link>
          <Link href="https://mockrithm.me/blog" className="text-white/60 hover:text-white transition-colors duration-200">
            Blog
          </Link>
          <Link href="https://mockrithm.me/about" className="text-white/60 hover:text-white transition-colors duration-200">
            About
          </Link>
          <Link href="https://mockrithm.me/about#contact" className="text-white/60 hover:text-white transition-colors duration-200">
            Reach Us
          </Link>
        </div>

        {/* CTA */}
        <button
          onClick={handleJourneyBegin}
          className="liquid-glass rounded-full px-5 py-2 text-sm text-white font-medium hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-lg active:scale-95 border-none outline-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Begin Journey
        </button>
      </div>
    </nav>
  );
}
