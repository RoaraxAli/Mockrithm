"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, Compass, Sparkles, Target, HeartHandshake, Users, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
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

    // Calculate rotation (-12 to 12 degrees)
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
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
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
            style={{
              background: `radial-gradient(circle 140px at ${glareX}% ${glareY}%, rgba(255,255,255,0.2), transparent)`,
            }}
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

  const differences = [
    {
      metric: "Conversational Pace",
      traditional: "Static forms, slow text inputs, or rigid videos.",
      mockrithm: "Instant, low-latency conversational AI simulating real vocal flow.",
    },
    {
      metric: "Feedback Quality",
      traditional: "Generic grades or delayed human assessment.",
      mockrithm: "Instant breakdowns of pace, filler words, and answer structure.",
    },
    {
      metric: "Resume Optimization",
      traditional: "Basic templates that don't match specific roles.",
      mockrithm: "ATS-friendly builders aligned directly with target role configurations.",
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

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-32">
        
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center max-w-4xl mx-auto pt-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge
              variant="outline"
              className="border-white/10 bg-white/5 text-zinc-300 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full backdrop-blur-md mb-6"
            >
              The Philosophy
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-[-2px] leading-[1.1] text-white"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Redefining Career Prep. <br />
            <em className="text-white/60 italic font-light">Built for the Modern Builder.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-8 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Mockrithm bridges the gap between passive learning and high-intensity realism. We build intelligence tools designed to forge confidence, structure, and pacing in the most crucial career moments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="https://accounts.mockrithm.me/sign-up"
              className="liquid-glass rounded-full px-8 py-3.5 text-sm text-white font-medium hover:scale-[1.03] transition-all duration-300 shadow-xl border-none outline-none flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Go to Dashboard <ExternalLink className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/RoaraxAli/Mockrithm"
              target="_blank"
              className="rounded-full px-8 py-3.5 text-sm text-zinc-300 font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Github className="h-4 w-4" /> View Repository
            </Link>
          </motion.div>
        </section>

        {/* The Genesis (Bento Grid Style) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
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
        <section className="w-full">
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

        {/* Creator Story */}
        <section className="w-full">
          <ThreeDTiltCard className="p-0 border border-white/10 overflow-hidden bg-zinc-900/40">
            <div className="absolute inset-0 premium-grid-dot opacity-[0.03] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
            <CardContent className="p-10 md:p-14 text-center flex flex-col items-center relative z-10">
              <Badge variant="outline" className="border-white/20 bg-white/5 text-white font-bold text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Creator Base
              </Badge>
              <h3 className="text-3xl md:text-4xl font-normal text-white flex items-center justify-center gap-3 mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                <Users className="h-8 w-8 text-white/80" /> Built by Ali & Ahmed
              </h3>
              <div className="max-w-2xl space-y-6 text-sm md:text-base text-zinc-400 leading-relaxed font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p>
                  Mockrithm was created by Ali & Ahmed — engineers who understand the pressure, anxiety, and bottlenecks of recruitment. Having faced the hurdles of professional job hunts first-hand, we built this tool to represent the ultimate high-fidelity preparation companion.
                </p>
                <p>
                  We believe standard study guides aren't enough. Communication is a muscle, and Mockrithm helps you train it. We look forward to hearing your feedback and continually iterating on our AI-powered interview dynamics.
                </p>
              </div>
            </CardContent>
          </ThreeDTiltCard>
        </section>

        {/* Divider / Spacer before Contact */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Contact Section */}
        <section id="contact" className="w-full scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Reach Out</h2>
            <h3 className="text-4xl md:text-5xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Get in <em className="text-white/60 italic font-light">touch</em>
            </h3>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed font-medium max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Have questions, feedback, or need support? Send us a message directly and our team will get back to you shortly. We're building this for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start max-w-6xl mx-auto">
            
            {/* Left Column: Info & Story */}
            <div className="flex flex-col gap-8 lg:pt-8">
              {/* Contact Method: Email */}
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

              {/* Contact Method: Location */}
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

              {/* Contact Method: Hours */}
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
