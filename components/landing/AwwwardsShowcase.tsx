"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";

export default function AwwwardsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const blocks = gsap.utils.toArray(".showcase-block");

    blocks.forEach((block: any) => {
      // Fade in/out ScrollTrigger for each scattered absolute block
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: "top 90%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse",
          scrub: 1.2,
        }
      });

      tl.fromTo(block, 
        { opacity: 0, scale: 0.88, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }
      ).to(block,
        { opacity: 0, scale: 0.88, y: -50, duration: 1, ease: "power2.in" }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === containerRef.current || (trigger.vars as any).trigger?.toString().includes("showcase-block")) {
          trigger.kill();
        }
      });
    };
  }, []);

  const features = [
    {
      num: "01",
      title: "Conversational AI Engine",
      subtitle: "High-fidelity audio feedback",
      posClass: "absolute left-[5%] top-[15vh]", // Asymmetric coordinates
      points: [
        "Vocal Filler Tracking: Logs pauses like 'um' and 'ah'.",
        "WPM Pacing Analyzer: Guides speaking speed in the optimal range.",
        "STAR Method Recognition: Rates outline answers.",
      ],
    },
    {
      num: "02",
      title: "ATS-Optimized Resumes",
      subtitle: "Pass the screening algorithms",
      posClass: "absolute right-[8%] top-[90vh]", // Staggered opposite side
      points: [
        "6 Professional Templates: Pass standard parser filters.",
        "Real-Time HTML Preview: Edit values and see updates.",
        "Export Support: Download clean, parseable PDF files.",
      ],
    },
    {
      num: "03",
      title: "Real-Time AI Analytics",
      subtitle: "Instant feedback reports on finish",
      posClass: "absolute left-[20%] top-[165vh]", // Middle offset
      points: [
        "Aggregated Grading Scale: Get overall readiness marks.",
        "Strengths & Improvements: AI outlines exactly what to fix.",
        "Session Logs: Review the full transcription.",
      ],
    },
    {
      num: "04",
      title: "Guides & Resources",
      subtitle: "Proven preparation logs",
      posClass: "absolute right-[12%] top-[240vh]", // Offset depth placement
      points: [
        "Preparation Feedback: Study vocal metrics and studies.",
        "Technical Layouts: Access standard structure guidelines.",
        "Telemetry Reviews: Learn pacing indicators from leads.",
      ],
    },
    {
      num: "05",
      title: "Flexible Access Tiers",
      subtitle: "Unlock professional preparation",
      posClass: "absolute left-[10%] top-[315vh]", // Bottom offset
      points: [
        "Freemium practice: Test the voice engine core.",
        "Premium level: Unlimited voice session logs.",
        "Pro subscription: Interactive system design simulator.",
      ],
    },
  ];

  return (
    <div
      ref={containerRef}
      id="showcase-container"
      className="relative w-full h-[400vh] bg-transparent text-white select-none z-10"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {features.map((feat, idx) => (
        <div
          key={idx}
          className={`${feat.posClass} w-full max-w-md px-6 sm:px-0 z-10`}
        >
          {/* Background numeric watermark overlapping the card for 3D depth collision */}
          <span className="absolute -left-12 -top-16 text-[18vw] font-black text-zinc-900/15 leading-none select-none pointer-events-none z-0 tracking-tighter">
            {feat.num}
          </span>

          {/* Outer wrapper for ScrollTrigger timeline */}
          <div className="showcase-block w-full relative z-10 opacity-0">
            
            {/* Inner card for GSAP scroll velocity skew/stretching (no property conflicts) */}
            <div
              className="floating-card p-8 sm:p-10 rounded-none border border-white/5 bg-black/60 backdrop-blur-md transition-all duration-300 shadow-2xl hover:border-white/20"
              style={{ willChange: "transform" }}
            >
              {/* Top scanning animation line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    SYSTEM CORE MODULE // {feat.num}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-550">
                    REF://{Math.random().toString(36).substring(3, 8).toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-[9px] text-zinc-455 font-black uppercase tracking-widest mt-1.5">
                    {feat.subtitle}
                  </p>
                </div>

                <ul className="space-y-3.5 pt-4 border-t border-white/5 list-none">
                  {feat.points.map((pt, pIdx) => {
                    const [head, desc] = pt.split(":");
                    return (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-400 list-none font-medium">
                        <Check className="size-3.5 text-white shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          <strong className="text-white font-bold">{head}</strong>: {desc}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
