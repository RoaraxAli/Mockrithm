"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { RESUME_LANDING_LIST } from "@/lib/resumeData";

export default function ResumeTopicPage() {
  const params = useParams();
  const topic = params?.topic as string;
  const config = RESUME_LANDING_LIST[topic];
  
  const { isSignedIn, isLoaded } = useUser();
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSubdomain(window.location.hostname.startsWith("resume."));
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = "https://mockrithm.me/user/resume";
    }
  }, [isSignedIn, isLoaded]);

  if (!config) {
    notFound();
  }

  const getResumeHubLink = () => {
    if (isSubdomain) {
      return "/";
    }
    return "/resume";
  };

  return (
    <div className="relative min-h-screen bg-[#07131e] text-white flex flex-col font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Fixed Fullscreen Background Video & Overlay */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Fixed Glassmorphic Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-[#07131e]/40 border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <Link
            href={getResumeHubLink()}
            className="text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="size-3" />
            Back to Hub
          </Link>

          <span
            className="text-2xl md:text-3xl tracking-tight text-white select-none cursor-pointer"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Mockrithm<sup className="text-[10px] align-super">®</sup>
          </span>

          <button
            className="liquid-glass rounded-full px-5 py-2 text-sm text-white font-medium hover:scale-[1.03] transition-all duration-300 shadow-lg border-none outline-none cursor-pointer"
            onClick={() => { window.location.href = "https://accounts.mockrithm.me/sign-up?redirect_url=https://mockrithm.me/user/resume"; }}
          >
            Begin Journey
          </button>
        </div>
      </nav>

      {/* Hero Block (occupies full viewport height, transparent background) */}
      <main className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full pt-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
          Specialized Configuration // {config.slug.replace("-", " ")}
        </span>

        <h1
          className="text-5xl sm:text-7xl md:text-[5rem] leading-[1] tracking-[-2px] font-normal text-white mt-4 animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {config.heroTitle}
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed animate-fade-rise-delay">
          {config.heroSubtitle}
        </p>

        <div className="mt-10 animate-fade-rise-delay-2">
          <button
            onClick={() => { window.location.href = "https://accounts.mockrithm.me/sign-up?redirect_url=https://mockrithm.me/user/resume"; }}
            className="liquid-glass rounded-full px-14 py-4.5 text-base text-white font-medium hover:scale-[1.03] transition-all duration-300 shadow-xl border-none outline-none cursor-pointer flex items-center gap-2"
          >
            {config.primaryCTA}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </main>

      {/* Scrolling Content Wrapper (solid background, slides up to cover the video) */}
      <div className="relative z-20 w-full bg-[#07131e] border-t border-white/5">
        
        {/* Niche Features Showcase */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-24">
          <h2
            className="text-3xl md:text-4xl text-center mb-12 font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {config.featureTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <CheckCircle2 className="size-6 text-white/60 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verification / Quality Badging */}
        <section className="max-w-4xl mx-auto text-center px-6 py-20 border-t border-white/5 w-full">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Verified Compliance</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Greenhouse Compliant
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Workday Parser Compliant
            </div>
            <div className="flex items-center gap-2">
              <Award className="size-4" />
              100% Structural Standard
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
