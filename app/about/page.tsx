"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Compass, Sparkles, Target, HeartHandshake, ArrowUpRight, Instagram } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import MarketingNavbar from "@/components/shared/MarketingNavbar";
import FeedbackForm from "@/components/FeedbackForm";

// Custom geometric monochrome divider matching Home page
const SectionDivider = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const line = ref.current?.querySelector(".divider-line") as HTMLElement | null;
    if (!line || !ref.current) return;

    const tween = gsap.fromTo(
      line,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full flex items-center justify-center my-16 select-none z-20">
      <div className="divider-line w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent relative origin-center">
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 size-1.5 rotate-45 border border-zinc-600 bg-zinc-950/60 backdrop-blur-sm" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        <div className="absolute right-[15%] top-1/2 -translate-y-1/2 size-1.5 rotate-45 border border-zinc-600 bg-zinc-950/60 backdrop-blur-sm" />
      </div>
    </div>
  );
};

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
      className={`relative rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
        isHovered ? "border-white/20 shadow-[0_20px_40px_rgba(255,255,255,0.08)]" : ""
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
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoSrc("/bg.mp4");
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Lenis smooth scroll + top progress bar driven by scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 0.8,
      touchMultiplier: 0.8,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const progressTarget = gsap.quickTo(progressBarRef.current, "scaleX", {
      duration: 0.4,
      ease: "power2.out",
    });
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      progressTarget(progress);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Section zoom animation on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".section-zoom");

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { scale: 1.03, opacity: 0.85 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 75%",
              scrub: 0.1,
            },
          }
        );
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

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
    <div className="min-h-screen bg-zinc-950 text-white relative font-mona-sans selection:bg-white selection:text-black">
      {!isSignedIn && <MarketingNavbar />}

      {/* Scroll progress bar (top of viewport) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[9998] pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-white/40 via-white to-white/40 origin-left shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>

      {/* Fixed Fullscreen Background Video & Overlay */}
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
        <div className="absolute inset-0 bg-black/50 z-0" />
      </div>

      {/* Cinematic ambient background glow spot */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-0" />

      <main ref={contentRef} className="relative z-10 max-w-[1400px] mx-auto pt-32 flex flex-col gap-12">
        
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center max-w-4xl mx-auto pt-16 px-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 font-mono mb-8 backdrop-blur-md shadow-lg">
              <Sparkles className="size-3.5 text-white" /> THE PHILOSOPHY
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-[5.5rem] leading-[1] tracking-[-2px] font-normal text-white animate-fade-rise"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            A realistic mock <br />
            <em className="not-italic text-white/60">interview platform.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-8 text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed font-normal animate-fade-rise-delay"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We built Mockrithm because standard interview prep is broken. Memorizing answers doesn't help you in a real technical interview. You need actual practice with an interviewer that challenges your logic.
          </motion.p>
        </section>

        <SectionDivider />

        {/* The Story */}
        <section className="section-zoom px-6 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 font-mono mb-4 backdrop-blur-md">
            <Compass className="size-3.5 text-white" /> THE STORY
          </div>
          <h2 className="text-4xl md:text-5xl font-normal text-white leading-tight mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Why we <em className="not-italic text-white/60">built this</em>
          </h2>
          <div className="space-y-4 text-base md:text-lg text-zinc-300 leading-relaxed font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p>
              We were tired of paying for expensive mock interviews. We wanted a tool that anyone could use to practice technical and behavioral questions anytime, anywhere.
            </p>
            <p>
              Mockrithm was created to simulate the actual mental pressure of real conversations, enabling candidates to build speaking rhythm, conquer anxiety, and land their dream jobs.
            </p>
          </div>
        </section>

        <SectionDivider />

        {/* Core Values / Pillars */}
        <section className="section-zoom w-full px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 font-mono mb-3 backdrop-blur-md">
              <Target className="size-3.5 text-white" /> OUR PILLARS
            </div>
            <h3 className="text-4xl md:text-5xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              What <em className="not-italic text-white/60">guides our platform</em>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <ThreeDTiltCard key={index} className="flex flex-col h-full !bg-zinc-900/40 !backdrop-blur-xl border border-white/10 hover:!border-white/20 transition-all duration-300 shadow-2xl">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15 mb-6 shrink-0 relative z-10 transition-colors shadow-inner">
                  {value.icon}
                </div>
                <h4 className="text-xl font-normal text-white mb-3 tracking-tight relative z-10" style={{ fontFamily: "'Instrument Serif', serif" }}>{value.title}</h4>
                <p className="text-sm text-zinc-300 font-normal leading-relaxed relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>{value.description}</p>
              </ThreeDTiltCard>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* --- CUSTOM FOUNDERS SECTION --- */}
        <section id="about" className="section-zoom relative min-h-[70vh] flex flex-col justify-center py-12 px-6 sm:px-10 overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-20">
              
              {/* Left Side: Heading */}
              <div>
                <h2 className="text-white font-normal uppercase tracking-tight leading-[0.95] text-[36px] sm:text-[48px] lg:text-[54px]" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  About <br /> <em className="not-italic text-white/60">the creators</em>
                </h2>
              </div>

              {/* Right Side: Description */}
              <div className="flex flex-col max-w-xl text-zinc-300 text-[17px] sm:text-[18px] leading-[1.6] font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p>
                  Mockrithm was created by Ali & Ahmed — engineers who understand the intense pressure, anxiety, and bottlenecks of technical recruitment.
                </p>
                <p className="mt-4">
                  Our mission is to offer every candidate the chance to reshape their career trajectory by providing high-fidelity, adaptive, AI-driven preparation that was previously locked behind expensive coaching.
                </p>
              </div>
            </div>
            
            {/* Stats Cards Grid */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div 
                className="relative w-full h-[280px] sm:h-[340px] bg-white/15 p-[1.5px] shadow-2xl transition-all duration-300 hover:bg-white/25"
                style={{ clipPath: "polygon(64px 0, calc(100% - 14px) 0, calc(100% - 4px) 4px, 100% 14px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px), 0 64px)" }}
              >
                <div 
                  className="relative w-full h-full overflow-hidden bg-cover bg-center bg-zinc-950/90 backdrop-blur-md"
                  style={{ 
                    clipPath: "polygon(64px 0, calc(100% - 14px) 0, calc(100% - 4px) 4px, 100% 14px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px), 0 64px)",
                    backgroundImage: "url('/images/ring1.png')"
                  }}
                >
                  <div className="absolute left-6 right-6 bottom-6 max-w-[66%]">
                    <div 
                      className="font-normal uppercase leading-none text-[42px] sm:text-[56px]"
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        background: "linear-gradient(294deg, #ffffff 20%, #a1a1aa)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      26
                    </div>
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300 drop-shadow-md font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                      public repositories built across both our GitHub accounts.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div 
                className="relative w-full h-[280px] sm:h-[340px] bg-white/15 p-[1.5px] lg:mt-24 shadow-2xl transition-all duration-300 hover:bg-white/25"
                style={{ clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 64px 100%, 0 calc(100% - 64px))" }}
              >
                <div 
                  className="relative w-full h-full overflow-hidden bg-cover bg-center bg-zinc-950/90 backdrop-blur-md"
                  style={{ 
                    clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 14px) 100%, 64px 100%, 0 calc(100% - 64px))",
                    backgroundImage: "url('/images/ring2.png')"
                  }}
                >
                  <div className="absolute left-6 bottom-20 max-w-[66%]">
                    <div 
                      className="font-normal uppercase leading-none text-[42px] sm:text-[56px]"
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        background: "linear-gradient(294deg, #ffffff 20%, #a1a1aa)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      330+
                    </div>
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300 drop-shadow-md font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                      commits pushed to Mockrithm alone. We are constantly iterating and building.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div 
                className="relative w-full h-[280px] sm:h-[340px] bg-white/15 p-[1.5px] shadow-2xl transition-all duration-300 hover:bg-white/25"
                style={{ clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 64px), calc(100% - 64px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px))" }}
              >
                <div 
                  className="relative w-full h-full overflow-hidden bg-cover bg-center bg-zinc-950/90 backdrop-blur-md"
                  style={{ 
                    clipPath: "polygon(0 14px, 4px 4px, 14px 0, calc(100% - 64px) 0, 100% 64px, 100% calc(100% - 14px), calc(100% - 4px) calc(100% - 4px), calc(100% - 64px) 100%, 14px 100%, 4px calc(100% - 4px), 0 calc(100% - 14px))",
                    backgroundImage: "url('/images/ring3.png')"
                  }}
                >
                  <div className="absolute left-6 right-28 bottom-6 max-w-[66%]">
                    <div 
                      className="font-normal uppercase leading-none text-[42px] sm:text-[56px]"
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        background: "linear-gradient(294deg, #ffffff 20%, #a1a1aa)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent"
                      }}
                    >
                      2
                    </div>
                    <div className="mt-3 text-[14px] leading-[1.4] text-zinc-300 drop-shadow-md font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                      passionate creators — engineers and students pushing code every single day.
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        <SectionDivider />

        {/* Contact Section */}
        <section id="contact" className="section-zoom w-full scroll-mt-32 px-6 pt-6 max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 font-mono mb-3 backdrop-blur-md">
              <HeartHandshake className="size-3.5 text-white" /> REACH OUT
            </div>
            <h3 className="text-4xl md:text-5xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Get in <em className="not-italic text-white/60">touch</em>
            </h3>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed font-normal max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Have questions, feedback, or need support? Send us a message directly and our team will get back to you shortly. We're building this for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Left Column: Info */}
            <div className="flex flex-col gap-8 lg:pt-4">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="h-14 w-14 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all shadow-md">
                  <HeartHandshake className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Email Us</span>
                  <a href="mailto:support@mockrithm.me" className="text-xl font-medium text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
                    support@mockrithm.me <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                  <span className="text-sm text-zinc-500">We typically reply within 24 hours.</span>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-white/70" />
                </div>
                <div className="flex flex-col gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Location</span>
                  <span className="text-xl font-medium text-white">Global / Remote</span>
                  <span className="text-sm text-zinc-500">Built in the cloud, for the world.</span>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="h-14 w-14 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all shadow-md">
                  <Instagram className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Instagram</span>
                  <a href="https://instagram.com/mockrithm" target="_blank" rel="noreferrer" className="text-xl font-medium text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
                    @mockrithm <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                  <span className="text-sm text-zinc-500">Follow us for updates & tips.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Feedback Form Card */}
            <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl">
              <FeedbackForm />
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
