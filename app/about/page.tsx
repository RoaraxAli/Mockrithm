"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Compass, Sparkles, Target, HeartHandshake, ArrowUpRight, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import MarketingNavbar from "@/components/shared/MarketingNavbar";
import FeedbackForm from "@/components/FeedbackForm";

// Premium 3D Tilt Card with Enhanced Glassmorphism
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
      className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
        isHovered ? "border-white/20 shadow-[0_20px_40px_rgba(255,255,255,0.05)]" : ""
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
            className="absolute inset-0 pointer-events-none rounded-2xl mix-blend-overlay opacity-50 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle 140px at ${glareX}% ${glareY}%, rgba(255,255,255,0.3), transparent)` }}
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
      title: "Real Conversations",
      description: "We don't do flashcards. Mockrithm simulates a real interview by listening, responding, and challenging your answers dynamically.",
    },
    {
      icon: <Target className="h-6 w-6 text-white" />,
      title: "Clear Feedback",
      description: "We break down your performance into actionable metrics, looking at pacing, structure, and technical accuracy so you can actually improve.",
    },
    {
      icon: <HeartHandshake className="h-6 w-6 text-white" />,
      title: "Built for Everyone",
      description: "We believe proper interview preparation shouldn't be locked behind an expensive paywall or an exclusive coaching program.",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden font-sans selection:bg-white selection:text-black">
      <MarketingNavbar />

      {/* Fixed Fullscreen Background Video & Overlay */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/upscaled-video.mp4"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-32 flex flex-col gap-32">
        
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center max-w-3xl mx-auto pt-16 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight"
          >
            A realistic mock interview platform.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-8 text-lg sm:text-xl text-zinc-300 leading-relaxed font-medium"
          >
            We built Mockrithm because standard interview prep is broken. Memorizing answers doesn't help you in a real technical interview. You need actual practice with an interviewer that challenges your logic.
          </motion.p>
        </section>

        {/* The Story Section */}
        <section className="px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">The Story</h2>
          <h3 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-6">
            Why we built this.
          </h3>
          <div className="space-y-4 text-base md:text-lg text-zinc-300 leading-relaxed">
            <p>
              We were tired of paying for expensive mock interviews. We wanted a tool that anyone could use to practice technical and behavioral questions anytime, anywhere. 
            </p>
            <p>
              Mockrithm was created to simulate the actual mental pressure of real conversations, enabling candidates to build speaking rhythm, conquer anxiety, and land their dream jobs without breaking the bank.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="w-full px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <ThreeDTiltCard key={index} className="flex flex-col h-full">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 mb-6 shrink-0 relative z-10 backdrop-blur-xl transition-colors">
                  {value.icon}
                </div>
                <h4 className="text-lg font-semibold text-white mb-3 tracking-tight relative z-10">{value.title}</h4>
                <p className="text-sm text-zinc-300 leading-relaxed relative z-10">{value.description}</p>
              </ThreeDTiltCard>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full scroll-mt-32 px-6 pt-10 max-w-5xl mx-auto mb-20 border-t border-white/10 mt-10">
          <div className="text-center mb-16 pt-16">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">Reach Out</h2>
            <h3 className="text-4xl md:text-5xl font-semibold text-white">
              Get in touch
            </h3>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
              Have questions, feedback, or need support? Send us a message directly and our team will get back to you shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Info */}
            <div className="flex flex-col gap-10 lg:pt-8">
              <div className="flex items-start gap-5 group cursor-pointer">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors shadow-lg">
                  <HeartHandshake className="h-6 w-6 text-white/80 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Us</span>
                  <a href="mailto:support@mockrithm.me" className="text-xl font-medium text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
                    support@mockrithm.me <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                  <span className="text-sm text-zinc-400 mt-1">We typically reply within 24 hours.</span>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                  <Target className="h-6 w-6 text-white/80" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Location</span>
                  <span className="text-xl font-medium text-white">Global / Remote</span>
                  <span className="text-sm text-zinc-400 mt-1">Built in the cloud, for the world.</span>
                </div>
              </div>
              
              <div className="flex items-start gap-5 group cursor-pointer">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors shadow-lg">
                  <Instagram className="h-6 w-6 text-white/80 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Instagram</span>
                  <a href="https://instagram.com/mockrithm" target="_blank" rel="noreferrer" className="text-xl font-medium text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
                    @mockrithm <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                  <span className="text-sm text-zinc-400 mt-1">Follow us for updates & tips.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Simple Form */}
            <div className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <FeedbackForm />
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
