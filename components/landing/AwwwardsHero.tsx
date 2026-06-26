"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AwwwardsHero() {
  const transition = { type: "spring" as const, stiffness: 70, damping: 18 };
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Fade out all hero elements as we scroll down
      gsap.to(".hero-fade-target", {
        scrollTrigger: {
          trigger: "#awwwards-hero",
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
        opacity: 0,
        y: -60,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="awwwards-hero"
      className="relative w-full min-h-screen flex flex-col justify-between items-center px-6 py-12 md:py-20 select-none overflow-hidden bg-transparent z-20"
    >


      {/* Centered Main Content Area */}
      <div className="hero-fade-target flex-1 flex flex-col items-center justify-center text-center gap-8 max-w-4xl mx-auto z-30 my-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="flex flex-col gap-4 items-center"
        >
          <h1 className="font-sans font-black tracking-tight text-4xl sm:text-6xl md:text-8xl leading-[1.05] uppercase select-none bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            Own the <br />
            interview.
          </h1>
        </motion.div>

        {/* Description paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.3 }}
          className="max-w-xl md:max-w-2xl px-4"
        >
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-450 leading-relaxed md:leading-loose">
            Conduct dynamic, voice-driven mock interviews tailored specifically to your resume. Eliminate vocal fillers, perfect your pacing, and pass corporate screeners with automated real-time analytics.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md px-4 mt-2"
        >
          <Button
            asChild
            className="bg-white hover:bg-zinc-200 text-black font-extrabold text-[10px] uppercase tracking-widest px-8 py-3 rounded-none border border-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 h-11 w-full sm:w-44 cursor-pointer"
            data-magnetic
          >
            <Link
              href={getAuthRedirectUrl("sign-up")}
              className="flex items-center justify-center gap-2"
            >
              Start Prep <ArrowRight className="size-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-white/20 hover:border-white/50 bg-black/40 backdrop-blur-md text-zinc-350 hover:text-white font-extrabold text-[10px] uppercase tracking-widest px-8 py-3 rounded-none hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 h-11 w-full sm:w-44 cursor-pointer"
            data-magnetic
          >
            <Link href={getAuthRedirectUrl("sign-in")}>Access Portal</Link>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator - center bottom */}
      <div className="hero-fade-target w-full flex justify-center z-40 mt-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[7px] font-black uppercase tracking-[0.3em] text-zinc-500">SCROLL DOWN TO FLY</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white via-zinc-800 to-transparent relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute left-0 top-0 w-full h-1/2 bg-white"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
