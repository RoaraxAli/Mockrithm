"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Compass, Sparkles, Target, HeartHandshake, ArrowUpRight, Github, Twitter, Linkedin } from "lucide-react";
import MarketingNavbar from "@/components/shared/MarketingNavbar";
import FeedbackForm from "@/components/FeedbackForm";

// Premium 3D Tilt Card with Glare Reflection
function ThreeDTiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rY = ((mouseX / width) - 0.5) * 24;
    const rX = ((mouseY / height) - 0.5) * -24;

    setRotateY(rY);
    setRotateX(rX);
    setGlareX((mouseX / width) * 100);
    setGlareY((mouseY / height) * 100);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={`relative rounded-xl border border-white/5 bg-zinc-950/70 p-6 transition-all duration-300 ${
        isHovered ? "border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.7)]" : ""
      } ${className}`}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "none" : "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl mix-blend-overlay opacity-30 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle 140px at ${glareX}% ${glareY}%, rgba(255,255,255,0.2), transparent)` }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const coreValues = [
    {
      icon: <Sparkles className="h-6 w-6 text-white" />,
      title: "High-Fidelity Realism",
      description: "We focus on replicating the actual cognitive friction of interview pressure. Our adaptive AI doesn't just ask templates; it listens, follows up, and challenges you dynamically.",
    },
    {
      icon: <Target className="h-6 w-6 text-white" />,
      title: "Actionable Intelligence",
      description: "Vague feedback like 'do better' is useless. We break down your performance through speech metrics, pacing, confidence delivery, and STAR structural methodology.",
    },
    {
      icon: <HeartHandshake className="h-6 w-6 text-white" />,
      title: "Radical Accessibility",
      description: "Elite interview coaching shouldn't cost thousands of dollars. We believe that top-tier career preparation and ATS resume optimization tools should be accessible to anyone, anywhere.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden font-mona-sans selection:bg-white selection:text-black">
      <MarketingNavbar />

      {/* Abstract Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-white/[0.01] blur-[120px] rounded-full" />
        <div className="absolute inset-0 premium-grid-dot opacity-10" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto pt-32 flex flex-col gap-32">
        
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center max-w-4xl mx-auto pt-16 px-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge
              variant="outline"
              className="border-white/10 bg-white/5 text-zinc-300 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full backdrop-blur-md mb-8"
            >
              The Philosophy
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight leading-[1.05] text-white"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            We build AI <br />
            <em className="text-white/60 italic font-light">that pushes back.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-10 text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-3xl font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Mockrithm isn't a flashcard app. It's a high-fidelity cognitive forge designed to simulate the exact friction of elite technical and behavioral interviews. We bridge the gap between passive learning and high-intensity realism.
          </motion.p>
        </section>

        {/* The Genesis (Bento Grid Style) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch px-6 max-w-6xl mx-auto">
          <div className="lg:col-span-7 flex flex-col justify-center gap-6 pr-0 lg:pr-12">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>The Genesis</h2>
              <h3 className="text-4xl md:text-5xl font-normal text-white leading-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Why We Built Mockrithm
              </h3>
            </div>
            <div className="space-y-4 text-sm md:text-base text-zinc-400 leading-relaxed font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p>
                We realized that standard career preparation is fundamentally broken. Standard platforms rely on passive reading or static video responses, while hiring managers are seeking authentic communication, structured logic, and quick critical thinking.
              </p>
              <p>
                Mockrithm was created to simulate the actual mental pressure of real conversations. Our vision is to combine advanced conversational artificial intelligence with high-fidelity speech diagnostics, enabling candidates to build speaking rhythm, conquer anxiety, and land their dream jobs.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-5 h-full">
            <ThreeDTiltCard className="h-full flex flex-col justify-between border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <Compass className="absolute top-6 right-6 h-16 w-16 text-white/10" />
              <div className="mt-auto pt-24">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Our Vision</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  To build the ultimate companion for career preparation—making premium, adaptive, real-time AI-driven coaching accessible to job-seekers worldwide without the premium price tag.
                </p>
              </div>
            </ThreeDTiltCard>
          </div>
        </section>

        {/* Core Values */}
        <section className="w-full px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Our Pillars</h2>
            <h3 className="text-4xl md:text-5xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>What Guides Our Platform</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <ThreeDTiltCard key={index} className="flex flex-col h-full bg-zinc-900/40 border-white/5">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 mb-6 shrink-0 shadow-inner">
                  {value.icon}
                </div>
                <h4 className="text-base font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{value.title}</h4>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{value.description}</p>
              </ThreeDTiltCard>
            ))}
          </div>
        </section>

        {/* --- CUSTOM FOUNDERS SECTION --- */}
        <section id="about" className="relative min-h-[80vh] flex flex-col justify-center py-20 sm:py-28 px-6 sm:px-10 overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-20">
              
              {/* Left Side: Heading */}
              <div>
                <h2 className="text-white font-semibold uppercase tracking-tight leading-[0.95] text-[36px] sm:text-[48px] lg:text-[54px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  About <br /> the creators
                </h2>
              </div>

              {/* Right Side: Description */}
              <div className="flex flex-col max-w-xl text-zinc-300 text-[17px] sm:text-[18px] leading-[1.5]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p>
                  Mockrithm was created by Ali & Ahmed — engineers who understand the intense pressure, anxiety, and bottlenecks of technical recruitment.
                </p>
                <p className="mt-4">
                  Our mission is to offer every candidate the chance to reshape their career trajectory by providing high-fidelity, adaptive, AI-driven preparation that was previously locked behind expensive coaching.
                </p>
              </div>
            </div>

            {/* Stats Cards Grid - IMAGES FIXED TO FULL OPACITY */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Card 1 */}
              <div 
                className="relative w-full h-[280px] sm:h-[340px] bg-white/10 p-[1.5px]"
                style={{ clipPath: "polygon(64px 0, calc(100% - 14px) 0, calc(100% - 4px) 4px, 100% 14px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px), 0 64px)" }}
              >
                <div 
                  className="relative w-full h-full overflow-hidden bg-cover bg-center"
                  style={{ 
                    clipPath: "polygon(64px 0, calc(100% - 14px) 0, calc(100% - 4px) 4px, 100% 14px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px), 0 64px)",
                    backgroundImage: "url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260514_154203_6c6f94dc-a07e-4ba5-8688-106f01ccd2c8.png&w=1280&q=85')"
                  }}
                >
                  <div className="absolute left-6 right-6 bottom-6 max-w-[66%]">
                    <div 
                      className="font-semibold uppercase leading-none text-[36px] sm:text-[52px]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        background: "linear-gradient(294deg, #ffffff 20%, #a1a1aa)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      10x
                    </div>
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300 drop-shadow-md">
                      faster feedback loops compared to traditional human-led mock interviews.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div 
                className="relative w-full h-[280px] sm:h-[340px] bg-white/10 p-[1.5px] lg:mt-24"
                style={{ clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 64px 100%, 0 calc(100% - 64px))" }}
              >
                <div 
                  className="relative w-full h-full overflow-hidden bg-cover bg-center"
                  style={{ 
                    clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 64px 100%, 0 calc(100% - 64px))",
                    backgroundImage: "url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260514_154151_45c62c60-3bcc-4f21-8f9d-03722ebb5df8.png&w=1280&q=85')"
                  }}
                >
                  <div className="absolute left-6 bottom-20 max-w-[66%]">
                    <div 
                      className="font-semibold uppercase leading-none text-[36px] sm:text-[52px]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        background: "linear-gradient(294deg, #ffffff 20%, #a1a1aa)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      50+
                    </div>
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300 drop-shadow-md">
                      unique behavioral and technical scenarios mapped to top tech companies.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div 
                className="relative w-full h-[280px] sm:h-[340px] bg-white/10 p-[1.5px]"
                style={{ clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 64px), calc(100% - 64px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px))" }}
              >
                <div 
                  className="relative w-full h-full overflow-hidden bg-cover bg-center"
                  style={{ 
                    clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 64px), calc(100% - 64px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px))",
                    backgroundImage: "url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260514_152238_24ec8db4-d728-4739-bb30-e985533e9637.png&w=1280&q=85')"
                  }}
                >
                  <div className="absolute left-6 right-28 bottom-6 max-w-[66%]">
                    <div 
                      className="font-semibold uppercase leading-none text-[36px] sm:text-[52px]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        background: "linear-gradient(294deg, #ffffff 20%, #a1a1aa)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      24/7
                    </div>
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300 drop-shadow-md">
                      availability. Your personal elite interview coach, ready whenever you are.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom fade overlay adapted for dark mode */}
          <div 
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-56 z-10"
            style={{ background: "linear-gradient(to bottom, rgba(3, 7, 18, 0) 0%, rgba(3, 7, 18, 0.7) 60%, #030712 100%)" }}
          />
        </section>

        {/* --- CUSTOM CONTACT SECTION OVERHAUL --- */}
        <section id="contact" className="relative w-full pt-10 pb-40 px-6 scroll-mt-32 border-t border-white/5 bg-zinc-950">
          <div className="absolute inset-0 premium-grid-dot opacity-20 pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto relative z-10">
            {/* Massive Heading */}
            <div className="mb-16 md:mb-24 relative z-20">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-500 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Initiate Sequence
              </h2>
              <h3 className="text-6xl sm:text-8xl md:text-[10rem] font-normal text-white leading-none tracking-tighter" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Let's <br className="hidden md:block" /> Connect.
              </h3>
            </div>

            {/* Architectural Layout: Main Container overlapping the heading */}
            <div className="relative -mt-10 md:-mt-32 ml-0 md:ml-32">
              <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
                  {/* Left: Contact Information (Ticker Style) */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-12">
                    <div className="space-y-10">
                      <div className="group">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Connect</p>
                        <a href="mailto:support@mockrithm.me" className="text-xl md:text-2xl text-white font-light group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                          support@mockrithm.me
                          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </a>
                      </div>

                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Status</p>
                        <div className="flex items-center gap-3 text-white text-xl md:text-2xl font-light">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Online • 24/7 Access
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Location</p>
                        <p className="text-xl md:text-2xl text-white font-light">Global / Remote</p>
                      </div>
                    </div>

                    {/* Socials / Repo */}
                    <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                      <a href="https://github.com/RoaraxAli/Mockrithm" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                        <Github className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                        <Twitter className="w-6 h-6" />
                      </a>
                      <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                        <Linkedin className="w-6 h-6" />
                      </a>
                    </div>
                  </div>

                  {/* Right: The High-End Editorial Form */}
                  <div className="lg:col-span-8">
                    <FeedbackForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
