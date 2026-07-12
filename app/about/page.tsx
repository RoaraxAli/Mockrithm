"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Compass, Sparkles, Target, HeartHandshake, Mail, MapPin, Clock, ArrowRight, ArrowUpRight } from "lucide-react";
import MarketingNavbar from "@/components/shared/MarketingNavbar";
import Footer from "@/components/shared/Footer";
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

      <main className="relative z-10 max-w-[1400px] mx-auto pt-32 pb-24 flex flex-col gap-32">
        
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

        {/* --- CUSTOM FOUNDERS SECTION BASED ON PROMPT --- */}
        <section id="about" className="relative min-h-[80vh] flex flex-col justify-center py-20 sm:py-28 px-6 sm:px-10 overflow-hidden">
          {/* We replace #F0F5F7 with dark theme colors */}
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
                
                <a href="https://github.com/RoaraxAli/Mockrithm" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-4 mt-6 text-[14px] font-medium text-white hover:text-zinc-300 transition-colors">
                  View Repository
                  <div 
                    className="flex items-center justify-center w-8 h-8 border border-white/30 transition-transform group-hover:-translate-y-0.5"
                    style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                  </div>
                </a>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Card 1 */}
              <div 
                className="relative w-full h-[280px] sm:h-[340px] bg-white/10 p-[1.5px]"
                style={{ clipPath: "polygon(64px 0, calc(100% - 14px) 0, calc(100% - 4px) 4px, 100% 14px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px), 0 64px)" }}
              >
                <div 
                  className="relative w-full h-full overflow-hidden bg-zinc-900 bg-cover bg-center"
                  style={{ 
                    clipPath: "polygon(64px 0, calc(100% - 14px) 0, calc(100% - 4px) 4px, 100% 14px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px), 0 64px)",
                    backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1280&q=80')",
                    backgroundBlendMode: "overlay"
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
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
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300">
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
                  className="relative w-full h-full overflow-hidden bg-zinc-900 bg-cover bg-center"
                  style={{ 
                    clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 64px 100%, 0 calc(100% - 64px))",
                    backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1280&q=80')",
                    backgroundBlendMode: "overlay"
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
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
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300">
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
                  className="relative w-full h-full overflow-hidden bg-zinc-900 bg-cover bg-center"
                  style={{ 
                    clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 64px), calc(100% - 64px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px))",
                    backgroundImage: "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&q=80')",
                    backgroundBlendMode: "overlay"
                  }}
                >
                  <div className="absolute inset-0 bg-black/60" />
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
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300">
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

        {/* Divider / Spacer before Contact */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent max-w-6xl mx-auto" />

        {/* Contact Section */}
        <section id="contact" className="w-full scroll-mt-32 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Reach Out</h2>
            <h3 className="text-4xl md:text-5xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Get in <em className="text-white/60 italic font-light">touch</em>
            </h3>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed font-medium max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Have questions, feedback, or need support? Send us a message directly and our team will get back to you shortly. We're building this for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Info & Story */}
            <div className="flex flex-col gap-8 lg:pt-8">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  <Mail className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Us</span>
                  <a href="mailto:support@mockrithm.me" className="text-xl font-medium text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
                    support@mockrithm.me <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                  <span className="text-sm text-zinc-500">We typically reply within 24 hours.</span>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-white/70" />
                </div>
                <div className="flex flex-col gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Location</span>
                  <span className="text-xl font-medium text-white">Global / Remote</span>
                  <span className="text-sm text-zinc-500">Built in the cloud, for the world.</span>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-white/70" />
                </div>
                <div className="flex flex-col gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Operating Hours</span>
                  <span className="text-xl font-medium text-white">24/7 Platform</span>
                  <span className="text-sm text-zinc-500">Support: Mon-Fri, 9AM-5PM EST</span>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="relative w-full rounded-3xl border border-white/10 bg-zinc-900/40 p-8 md:p-10 backdrop-blur-md overflow-hidden shadow-2xl">
              <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-normal text-white mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Send a Message
                </h3>
                <div className="form-container-override">
                  <FeedbackForm />
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
