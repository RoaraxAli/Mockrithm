"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Layout, Zap, Database } from "lucide-react";
import { RESUME_LANDING_LIST } from "@/lib/resumeData";
import Footer from "@/components/shared/Footer";

export default function ResumeLandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoSrc("/bg.mp4");
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSubdomain(window.location.hostname.startsWith("resume."));
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = "/dashboard";
    }
  }, [isSignedIn, isLoaded]);

  const handleCTAClick = () => {
    window.location.href = "https://accounts.mockrithm.me/sign-up?redirect_url=https://resume.mockrithm.me/dashboard";
  };

  const getResumeLink = (path: string) => {
    if (isSubdomain) {
      return path;
    }
    return `/resume${path}`;
  };

  const categories = Object.values(RESUME_LANDING_LIST).filter(
    (item) => item.slug !== "ats-checker" && item.slug !== "templates"
  );

  return (
    <div className="relative min-h-screen bg-transparent text-white flex flex-col font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Fixed Fullscreen Background Video & Overlay (stays static behind the hero) */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-zinc-950">
        {videoSrc ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100"
            src={videoSrc}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-zinc-950" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Fixed Glassmorphic Navigation Bar (stays static at the top when scrolling) */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-black/30 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <span
            className="text-2xl md:text-3xl tracking-tight text-white select-none cursor-pointer"
            style={{ fontFamily: "'Instrument Serif', serif" }}
            onClick={() => { window.location.href = "https://mockrithm.me"; }}
          >
            Mockrithm<sup className="text-[10px] align-super">®</sup>
          </span>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="https://mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <a href="#niche-resumes" className="text-white/60 hover:text-white transition-colors duration-200">
              Role Profiles
            </a>
            <Link href="https://games.mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">
              Games
            </Link>
            <Link href="https://docs.mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">
              Docs
            </Link>
          </div>

          <button
            onClick={handleCTAClick}
            className="liquid-glass rounded-full px-5 py-2 text-sm text-white font-medium hover:scale-[1.03] transition-all duration-300 shadow-lg border-none outline-none cursor-pointer"
          >
            Begin Journey
          </button>
        </div>
      </nav>

      {/* Hero Section (occupies full viewport height, transparent background) */}
      <header className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full pt-16">
        <h1
          className="text-5xl sm:text-7xl md:text-[5.5rem] leading-[1] tracking-[-2px] font-normal text-white animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Build resumes that pass <br />
          <em className="not-italic text-white/60">ATS filters automatically.</em>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed animate-fade-rise-delay">
          Stop getting rejected by applicant tracking software. Write structural, single-page, parsing-safe PDF resumes with our production-grade compiler.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-rise-delay-2">
          <button
            onClick={handleCTAClick}
            className="liquid-glass rounded-full px-14 py-4.5 text-base text-white font-medium hover:scale-[1.03] transition-all duration-300 shadow-xl border-none outline-none cursor-pointer flex items-center gap-2"
          >
            Begin Journey
            <ArrowRight className="size-4" />
          </button>
        </div>
      </header>

      {/* Scrolling Content Wrapper (transparent background, video visible through) */}
      <div className="relative z-20 w-full bg-transparent">
        
        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <Layout className="size-8 text-white/80 mb-4" />
            <h3 className="text-lg font-bold mb-2">10+ Verified Templates</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Beautiful single-column structures engineered to preserve layout parsing logic during automated tracking loops.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <Zap className="size-8 text-white/80 mb-4" />
            <h3 className="text-lg font-bold mb-2">Instant ATS Diagnosis</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Get parsed structure feedback, calculate semantic match density scores, and discover missing target keywords instantly.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <Database className="size-8 text-white/80 mb-4" />
            <h3 className="text-lg font-bold mb-2">Git Parity & Projects</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Directly connect your GitHub repository to pull live projects and format technical achievements with metrics automatically.
            </p>
          </div>
        </section>

        {/* Subpage Niche Link List */}
        <section id="niche-resumes" className="max-w-7xl mx-auto px-6 md:px-8 py-20 w-full border-t border-white/5">
          <h2 className="text-3xl font-normal text-center mb-12" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Targeted Lead Roles & Configurations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            <Link
              href={getResumeLink("/templates")}
              className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Designs</span>
                <h3 className="text-base font-bold mt-1 text-white group-hover:text-white">Templates</h3>
              </div>
              <ArrowRight className="size-4 text-white/40 group-hover:translate-x-1 transition-transform mt-4 align-self-end" />
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={getResumeLink(`/${cat.slug}`)}
                className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Niche Profile</span>
                  <h3 className="text-base font-bold mt-1 text-white/80 group-hover:text-white">{cat.title.split(" | ")[0].split(" Resume ")[0]}</h3>
                </div>
                <ArrowRight className="size-4 text-white/30 group-hover:translate-x-1 group-hover:text-white transition-all mt-4 align-self-end" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="relative z-20 w-full bg-transparent">
        <Footer />
      </div>
    </div>
  );
}
