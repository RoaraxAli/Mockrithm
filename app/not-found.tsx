"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Disable scrolling on body while 404 page is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = "";
    };
  }, []);

  const navLinks = [
    { href: "https://mockrithm.me", label: "Home" },
    { href: "https://mockrithm.me/interview", label: "Interview" },
    { href: "https://games.mockrithm.me", label: "Games" },
    { href: "https://resume.mockrithm.me", label: "Resume" },
    { href: "https://docs.mockrithm.me", label: "Docs" },
    { href: "https://mockrithm.me/blog", label: "Blog" },
    { href: "https://mockrithm.me/about", label: "About" },
    { href: "https://mockrithm.me/about#contact", label: "Reach Us" },
  ];

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[100] flex flex-col overflow-hidden bg-zinc-950 font-dm-sans select-none">
      {/* Load external styling, fonts, and icons */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0&display=swap');
        
        .font-dm-sans {
          font-family: 'DM Sans', sans-serif;
        }

        .font-instrument {
          font-family: 'Instrument Serif', serif;
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        
        .animate-float-slow {
          animation: floatSlow 5s ease-in-out infinite;
        }
        
        .animate-float-slow-delay {
          animation: floatSlow 4.5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .nav-dashed-border::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1100px;
          height: 1px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.08) 2px, transparent 2px);
          background-size: 6px 1px;
        }

        .bg-layer-spaceship {
          background-image: url('https://pub-e68758f43067417dba612b2371819aa1.r2.dev/viktor-components/alien-spaceship.png');
          background-position: center 40%;
          background-size: contain;
          background-repeat: no-repeat;
          background-attachment: fixed;
          opacity: 0.1;
        }

        .bg-page-gradient {
          background: linear-gradient(to top left, #07070a, #111116);
        }

        @media (max-width: 768px) {
          .bg-layer-spaceship {
            background-size: 90% !important;
            background-position: center 45% !important;
          }
          .title-text {
            font-size: 30px !important;
          }
          .decoration-cloud {
            font-size: 30px !important;
            top: -12px !important;
            left: -16px !important;
          }
          .decoration-favorite {
            font-size: 24px !important;
            bottom: -10px !important;
            right: 12px !important;
          }
          .nav-card-container {
            gap: 10px !important;
          }
          .nav-card-icon {
            width: 40px !important;
            height: 40px !important;
          }
        }

        @media (max-width: 480px) {
          .bg-layer-spaceship {
            background-size: 100% !important;
          }
          .title-text {
            font-size: 26px !important;
          }
          .decoration-cloud {
            font-size: 24px !important;
            top: -8px !important;
            left: -12px !important;
          }
          .decoration-favorite {
            font-size: 20px !important;
            bottom: -8px !important;
            right: 8px !important;
          }
        }
      `}} />

      {/* Layered Background */}
      <div className="absolute inset-0 bg-page-gradient z-0" />
      <div className="absolute inset-0 bg-layer-spaceship z-0 pointer-events-none" />

      {/* Watermark 404 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <span className="text-[12rem] sm:text-[18rem] md:text-[22rem] font-black text-white/[0.02] tracking-tighter">
          404
        </span>
      </div>

      {/* Navbar Container */}
      <nav className="relative z-55 w-full flex justify-center py-1 nav-dashed-border">
        <div className="w-full max-w-[1100px] px-6 md:px-10 py-7 flex items-center justify-between">
          
          {/* Left: Logo (Actual Logo + Text Mockrithm® overlay) */}
          <Link href="https://mockrithm.me" className="relative group flex items-center justify-start py-1">
            {/* The mockrithm logo shown behind the text */}
            <div className="absolute -left-3 -top-2 w-14 h-14 opacity-25 z-0 pointer-events-none select-none filter invert brightness-200">
              <img src="/logo.svg" alt="" className="w-full h-full object-contain" />
            </div>
            <span className="relative z-10 text-2xl md:text-3xl tracking-tight text-white font-instrument select-none">
              Mockrithm<sup className="text-[10px] align-super text-white/60">®</sup>
            </span>
          </Link>

          {/* Center: Nav links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-9 text-[14px] font-normal">
            {navLinks.slice(0, 5).map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-white/60 hover:text-white transition-opacity duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: CTA button "Begin Journey" */}
          <div className="hidden md:block">
            <button
              onClick={() => window.location.href = "https://accounts.mockrithm.me/sign-up"}
              className="relative flex items-center gap-3 bg-gradient-to-b from-[#2c2c2c] to-[#111111] hover:from-[#3a3a3a] hover:to-[#1a1a1a] border border-white/10 hover:border-white/20 text-white text-[13px] font-medium py-1 px-4 pr-5 rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center -ml-2 select-none shadow-md">
                <svg className="w-3 h-3 text-black stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span>Begin Journey</span>
            </button>
          </div>

          {/* Hamburger Menu (mobile only) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-between w-6 h-[14px] z-50 relative cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-[2px] bg-white transition-all duration-300 origin-left ${isMobileMenuOpen ? "rotate-45 translate-x-[2px] translate-y-[-1px]" : ""}`} />
            <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-[2px] bg-white transition-all duration-300 origin-left ${isMobileMenuOpen ? "-rotate-45 translate-x-[2px] translate-y-[1px]" : ""}`} />
          </button>

        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-zinc-950/98 backdrop-blur-xl z-40 p-10 pt-28 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-0 text-left max-w-md mx-auto w-full">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[38px] font-extrabold tracking-[-1.5px] text-white py-5 border-b border-white/5 hover:text-white/80 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-8">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.location.href = "https://accounts.mockrithm.me/sign-up";
              }}
              className="relative flex items-center gap-4 bg-gradient-to-b from-[#2c2c2c] to-[#111111] border border-white/10 text-white text-[16px] font-semibold py-3 px-6 pr-8 rounded-full transition-all duration-300 shadow-lg w-fit cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center -ml-2 select-none shadow-md">
                <svg className="w-4 h-4 text-black stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span>Begin Journey</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-[700px] mx-auto w-full relative z-10 pt-10">
        
        {/* Lost Text */}
        <span className="text-[15px] text-zinc-400 font-normal mb-3 tracking-wide select-none">
          404 Error • Seems you've wandered off...
        </span>

        {/* Title Wrapper */}
        <div className="relative inline-block mb-4 z-10 px-6">
          
          {/* Cloud Decoration */}
          <span 
            className="material-symbols-rounded absolute -top-5 -left-1 text-[42px] select-none pointer-events-none animate-float-slow decoration-cloud"
            style={{
              background: 'linear-gradient(to bottom, #F7B2FB 50%, #786EF1 80%, #5588FB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 1.5px rgba(255,255,255,0.7))'
            }}
          >
            cloud
          </span>

          {/* Heart Decoration */}
          <span 
            className="material-symbols-rounded absolute -bottom-4 right-12 text-[32px] select-none pointer-events-none animate-float-slow-delay decoration-favorite"
            style={{
              background: 'linear-gradient(to bottom, #F7B2FB 50%, #786EF1 80%, #5588FB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 1.5px rgba(255,255,255,0.7))'
            }}
          >
            favorite
          </span>

          {/* Title */}
          <h1 className="text-[34px] sm:text-[44px] md:text-[52px] font-medium tracking-[-1.5px] leading-[1.08] text-white title-text select-none">
            Whoops! Nothing here yet
          </h1>
        </div>

        {/* Subtext */}
        <p className="text-[14px] text-zinc-400 leading-[1.7] max-w-[470px] mb-8 font-dm-sans px-4 select-none">
          Grab a 30-minute{' '}
          <span className="inline-flex items-center bg-[#1b1c22] text-white text-[12.5px] font-semibold px-3 py-0.5 rounded-md border border-white/5">
            chat
          </span>{' '}
          to explore your ideas, scope, and vision. We'll find common ground, sync and{' '}
          <span className="inline-flex items-center bg-[#1b1c22] text-white text-[12.5px] font-semibold px-3 py-0.5 rounded-md border border-white/5">
            define
          </span>{' '}
          a clear roadmap.
        </p>

        {/* Bottom Navigation Cards */}
        <div className="flex flex-col gap-3 w-full max-w-[460px] mt-auto mb-10 nav-card-container">
          
          {/* Card 1: Main Page */}
          <a 
            href="https://mockrithm.me"
            className="group flex items-center justify-between bg-zinc-900/60 backdrop-blur-md border border-white/5 hover:border-white/10 rounded-[18px] p-[18px] px-[22px] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] hover:-translate-y-[3px] w-full text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 select-none shadow-inner border border-white/5 nav-card-icon">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-white tracking-wide">Main Page</h3>
                <p className="text-[12px] text-zinc-400 mt-0.5">Back where it all begins...</p>
              </div>
            </div>
            <span className="text-[21px] text-zinc-500 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1.5 select-none leading-none pr-1">
              &rsaquo;
            </span>
          </a>

          {/* Card 2: Showcase */}
          <a 
            href="https://mockrithm.me/interview"
            className="group flex items-center justify-between bg-zinc-900/60 backdrop-blur-md border border-white/5 hover:border-white/10 rounded-[18px] p-[18px] px-[22px] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] hover:-translate-y-[3px] w-full text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 select-none shadow-inner border border-white/5 nav-card-icon">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx={12} cy={12} r={9} fill="currentColor" />
                  <circle cx={12} cy={12} r={3.5} fill="#18181b" />
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-white tracking-wide">Showcase</h3>
                <p className="text-[12px] text-zinc-400 mt-0.5">Where we walk the walk</p>
              </div>
            </div>
            <span className="text-[21px] text-zinc-500 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1.5 select-none leading-none pr-1">
              &rsaquo;
            </span>
          </a>

        </div>

      </main>
    </div>
  );
}
