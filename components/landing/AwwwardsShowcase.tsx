"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------ */
/* Feature data                                                       */
/* ------------------------------------------------------------------ */
const FEATURES = [
  {
    num: "01",
    title: "Conversational AI Engine",
    subtitle: "High-fidelity audio feedback",
    points: [
      "Vocal Filler Tracking: Logs speech halts like 'um' and 'basically'.",
      "WPM Pacing Analyzer: Guides speaking speed inside optimal ranges.",
      "STAR Method Recognition: Rates structured answers in real time.",
    ],
  },
  {
    num: "02",
    title: "ATS-Optimized Resumes",
    subtitle: "Pass the screening algorithms",
    points: [
      "6 Professional Templates: Calibrated to clear standard parser gates.",
      "Real-Time Markdown Preview: Edit content structure dynamically.",
      "Export Support: Download clean, parseable PDF files instantly.",
    ],
  },
  {
    num: "03",
    title: "Real-Time AI Analytics",
    subtitle: "Instant feedback reports on finish",
    points: [
      "Aggregated Grading Scale: Get overall readiness marks on complete.",
      "Strengths & Improvements: AI highlights detailed diagnostic points.",
      "Session Logs: Review the complete conversational transcripts.",
    ],
  },
  {
    num: "04",
    title: "Guides & Resources",
    subtitle: "Proven preparation logs",
    points: [
      "Preparation Studies: Research vocal pacing benchmarks and trends.",
      "Technical Layouts: Access standard syntax guides and questions.",
      "Telemetry Reviews: Learn speaking tips from engineering leads.",
    ],
  },
  {
    num: "05",
    title: "Flexible Access Tiers",
    subtitle: "Unlock professional preparation",
    points: [
      "Freemium practice: Test the conversational voice simulator.",
      "Premium level: Access unlimited evaluations and transcripts.",
      "Pro subscription: Unlock system design sandbox configurations.",
    ],
  },
] as const;

// Curated theme configs per feature stage
const FEATURE_THEMES = [
  {
    accent: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.08)",
    badge: "CORE // VOICE SIMULATOR",
    tag: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    accent: "text-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.08)",
    badge: "ATS // RESUME PARSER",
    tag: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    accent: "text-pink-400",
    glowColor: "rgba(236, 72, 153, 0.08)",
    badge: "METRICS // TELEMETRY",
    tag: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  {
    accent: "text-zinc-300",
    glowColor: "rgba(228, 228, 231, 0.08)",
    badge: "ARCHIVE // RESOURCE LAB",
    tag: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  },
  {
    accent: "text-amber-400",
    glowColor: "rgba(251, 191, 36, 0.08)",
    badge: "ACCESS // MEMBERSHIPS",
    tag: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
];

/* ------------------------------------------------------------------ */
/* Per-feature animated visual mockups (scroll-reactive)              */
/* ------------------------------------------------------------------ */

/** Feature 1 — waveform + mic */
function WaveformVisual({ progress }: { progress: number }) {
  const bars = Array.from({ length: 32 });
  return (
    <div className="feature-visual relative flex flex-col items-center justify-center gap-8 w-full max-w-md">
      <div className="relative flex items-center justify-center">
        <span className="absolute size-24 rounded-full border border-purple-500/20 animate-ping-slow" />
        <span className="absolute size-36 rounded-full border border-purple-500/10" />
        <span className="absolute size-48 rounded-full border border-purple-500/5" />
        <svg viewBox="0 0 24 24" className="size-12 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex items-end justify-center gap-[3px] h-24 w-full px-4">
        {bars.map((_, i) => {
          const seed = Math.sin(i * 1.3 + progress * 12) * 0.5 + 0.5;
          const h = 12 + seed * 80 * (0.3 + progress * 0.7);
          return (
            <span
              key={i}
              className="w-[2.5px] rounded-full transition-all duration-700"
              style={{
                height: `${h}%`,
                background: seed > 0.7
                  ? "rgba(167, 139, 250, 0.85)"
                  : "rgba(167, 139, 250, 0.25)",
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-purple-500/80">
        <span className="size-1.5 rounded-full bg-purple-500 animate-pulse" />
        <span>Live Audio Pipeline</span>
      </div>
    </div>
  );
}

/** Feature 2 — terminal / ATS scan */
function DocumentVisual({ progress }: { progress: number }) {
  const lines = [
    { w: "75%", strong: true },
    { w: "50%" },
    { w: "65%", strong: true },
    { w: "40%" },
    { w: "58%" },
    { w: "35%" },
    { w: "70%", strong: true },
    { w: "45%" },
  ];
  return (
    <div className="feature-visual relative w-full max-w-sm">
      <div className="relative rounded-xl border border-cyan-500/25 bg-black/80 backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5 bg-zinc-950/40">
          <span className="size-2 rounded-full bg-rose-500/40" />
          <span className="size-2 rounded-full bg-amber-500/40" />
          <span className="size-2 rounded-full bg-emerald-500/40" />
          <span className="ml-3 text-[8px] font-mono tracking-[0.2em] text-cyan-400/80 font-bold uppercase">resume.ats</span>
        </div>
        <div className="relative p-6 space-y-3.5 min-h-[200px]">
          <span
            className="pointer-events-none absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_rgba(34,211,238,0.6)]"
            style={{ top: `${8 + progress * 84}%` }}
          />
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <span className="h-2 w-[30%] rounded-full bg-cyan-500/20" />
            <span className="h-2 w-[20%] rounded-full bg-cyan-500/10" />
          </div>
          {lines.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`h-1.5 rounded-full transition-all duration-105 ${l.strong ? "bg-cyan-500/40" : "bg-zinc-800"}`} style={{ width: l.w }} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5 bg-zinc-950/40">
          <span className="text-[8px] font-mono tracking-[0.2em] text-zinc-500 uppercase">ATS MATCH</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${60 + progress * 40}%`, transition: "width 100ms linear" }} />
            </div>
            <span className="text-[9px] font-mono font-bold text-cyan-400">{Math.round(60 + progress * 40)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Feature 3 — rings + bar chart */
function AnalyticsVisual({ progress }: { progress: number }) {
  const Ring = ({ value, label, size = 70 }: { value: number; label: string; size?: number }) => {
    const r = (size - 6) / 2;
    const c = 2 * Math.PI * r;
    const dash = c * value;
    return (
      <div className="flex flex-col items-center gap-1.5 bg-black/40 border border-white/5 rounded-xl p-3 flex-1 min-w-[75px] backdrop-blur-sm shadow-md">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" />
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#f472b6" strokeWidth="2" fill="none" strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`} style={{ transition: "stroke-dasharray 150ms ease-out" }} />
        </svg>
        <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</span>
        <span className="text-[10px] font-mono font-bold text-pink-400">{Math.round(value * 100)}%</span>
      </div>
    );
  };

  const chartPoints = Array.from({ length: 15 }).map((_, idx) => {
    const scale = Math.sin(idx * 0.5 + progress * 4) * 0.3 + 0.5;
    return 10 + scale * 45;
  });

  return (
    <div className="feature-visual relative w-full max-w-sm rounded-xl border border-pink-500/25 bg-black/85 backdrop-blur-md overflow-hidden shadow-2xl p-5 space-y-5">
      {/* Tab bar header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="text-[8px] font-mono tracking-[0.2em] text-pink-400/80 font-bold uppercase">telemetry.metrics</span>
        </div>
        <span className="text-[7px] font-mono text-zinc-600">ID // 982-AC</span>
      </div>

      {/* Ring charts container */}
      <div className="flex items-center justify-between gap-3">
        <Ring value={Math.min(0.92, 0.15 + progress * 0.77)} label="Clarity" />
        <Ring value={Math.min(0.85, 0.1 + progress * 0.75)} label="Pacing" />
        <Ring value={Math.min(0.78, 0.05 + progress * 0.73)} label="STAR" />
      </div>

      {/* Animated Telemetry Graph */}
      <div className="border border-white/5 rounded-xl p-3.5 bg-black/50 space-y-2.5">
        <div className="flex items-center justify-between text-[7px] font-mono tracking-widest text-zinc-500 uppercase">
          <span>Speech Pacing Rate</span>
          <span className="text-pink-400 font-bold">WPM: {Math.round(110 + progress * 40)}</span>
        </div>
        <div className="h-16 w-full flex items-end justify-between relative border-b border-white/5 pb-1">
          {/* Subtle grid lines */}
          <div className="absolute inset-x-0 top-1/3 h-px bg-white/2 pointer-events-none" />
          <div className="absolute inset-x-0 top-2/3 h-px bg-white/2 pointer-events-none" />
          
          {chartPoints.map((h, i) => (
            <div
              key={i}
              className="flex-1 mx-[1px] rounded-t-sm"
              style={{
                height: `${h}%`,
                opacity: 0.25 + (i / 15) * 0.5,
                transition: "height 120ms ease-out",
                backgroundColor: i === 12 ? "#f472b6" : "rgba(244,114,182,0.3)"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Feature 4 — cards fanned */
function ResourcesVisual({ progress }: { progress: number }) {
  const cards = [
    {
      title: "Pacing study: pitch patterns in leading voice metrics",
      tag: "Telem Review",
      time: "06 min read",
      author: "Lead Architect",
    },
    {
      title: "STAR framework layout: structured answer models",
      tag: "Layout study",
      time: "08 min read",
      author: "Senior Recruiter",
    },
    {
      title: "Aggregated readiness scales for telemetry logging",
      tag: "Metrics log",
      time: "05 min read",
      author: "Vocal Coach",
    },
  ];

  return (
    <div className="feature-visual relative h-80 w-full max-w-sm flex items-center justify-center select-none">
      {cards.map((c, i) => {
        const spreadProgress = Math.min(1, progress * 1.5);
        const translateX = (i - 1) * 35 * spreadProgress;
        const translateY = (i - 1) * -20 * spreadProgress;
        const rotate = (i - 1) * 8 * spreadProgress;
        const scale = 0.9 + i * 0.05 - (1 - spreadProgress) * 0.02;

        return (
          <div
            key={i}
            className="absolute w-64 h-36 rounded-xl border bg-black/90 backdrop-blur-lg shadow-2xl p-4 flex flex-col justify-between transition-all duration-300"
            style={{
              transform: `translateX(-50%) translateY(-50%) translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
              left: "50%",
              top: "50%",
              opacity: 0.3 + (i * 0.35) + (spreadProgress * 0.1),
              zIndex: i,
              borderColor: `rgba(255,255,255,${0.03 + (i * 0.04)})`,
              boxShadow: "0 20px 45px -15px rgba(0,0,0,0.8)",
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between">
              <span className="text-[7px] font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase border border-white/8 px-1.5 py-0.5 rounded-md bg-white/2">
                {c.tag}
              </span>
              <span className="text-[6.5px] font-mono text-zinc-500">{c.time}</span>
            </div>

            {/* Card title */}
            <p className="text-[10px] font-bold text-zinc-200 tracking-tight leading-snug my-2 pr-2">
              {c.title}
            </p>

            {/* Card footer */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
              <span className="text-[7px] font-mono font-bold text-zinc-500 uppercase">By {c.author}</span>
              <svg viewBox="0 0 24 24" className="size-2 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Feature 5 — tier badges */
function TiersVisual({ progress }: { progress: number }) {
  const tiers = [
    { name: "Freemium", desc: "Practice core", active: progress > 0.05, icon: "○" },
    { name: "Premium", desc: "Unlimited logs", active: progress > 0.3, icon: "◎" },
    { name: "Pro", desc: "System design sim", active: progress > 0.6, icon: "●" },
  ];
  return (
    <div className="feature-visual flex flex-col items-center gap-4 w-full max-w-xs select-none">
      {tiers.map((t, i) => (
        <div
          key={t.name}
          className="w-full rounded-xl border bg-black/70 backdrop-blur-md px-6 py-4 shadow-2xl flex items-center justify-between transition-all duration-700"
          style={{
            transform: `translateY(${t.active ? 0 : 30}px) rotateX(${t.active ? 0 : 60}deg)`,
            opacity: t.active ? 1 : 0,
            transitionDelay: `${i * 100}ms`,
            transformOrigin: "center bottom",
            borderColor: t.active ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.03)",
          }}
        >
          <div className="flex items-center gap-4">
            <span className={`text-sm ${t.active ? "text-amber-400" : "text-zinc-600"}`}>{t.icon}</span>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] block ${t.active ? "text-amber-400" : "text-zinc-400"}`}>{t.name}</span>
              <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t.desc}</span>
            </div>
          </div>
          <span 
            className="size-2 rounded-full transition-all duration-500" 
            style={{ 
              backgroundColor: t.active ? "#fbbf24" : "rgba(255,255,255,0.1)",
              boxShadow: t.active ? "0 0 8px rgba(251,191,36,0.6)" : "none" 
            }} 
          />
        </div>
      ))}
      <div className="w-px h-6 bg-amber-500/20" style={{ opacity: progress > 0.6 ? 1 : 0, transition: "opacity 400ms" }} />
    </div>
  );
}

const VISUALS = [WaveformVisual, DocumentVisual, AnalyticsVisual, ResourcesVisual, TiersVisual];

/* ------------------------------------------------------------------ */
/* Component — stacked-pin: one feature per viewport                   */
/* ------------------------------------------------------------------ */
export default function AwwwardsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stagesContainerRef = useRef<HTMLDivElement>(null);
  const dotNavRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState<number[]>(FEATURES.map(() => 0));
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const ctx = gsap.context(() => {
      if (!isMobile) {
        /* ========== DESKTOP: stacked-pin (one feature per viewport) ========== */
        const stages = gsap.utils.toArray<HTMLElement>(".feature-stage");
        if (stages.length === 0) return;

        const totalScroll = (stages.length - 1) * window.innerHeight * 0.7;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stagesContainerRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 0.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (stages.length - 1),
              duration: { min: 0.25, max: 0.5 },
              delay: 0.05,
              ease: "power2.out",
            },
            onUpdate: (self) => {
              const p = self.progress;
              const idx = Math.min(stages.length - 1, Math.floor(p * stages.length + 0.0001));
              setActiveIndex(idx);

              const nextProgress = new Array(stages.length).fill(0) as number[];
              stages.forEach((stage, i) => {
                const stageLen = 1 / stages.length;
                const rawLocal = (p - i * stageLen) / stageLen;
                const local = gsap.utils.clamp(0, 1, rawLocal);
                nextProgress[i] = local;
              });

              setStageProgress(nextProgress);
            },
          },
        });

        gsap.to(dotNavRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 50%",
            end: "bottom 50%",
            toggleActions: "play reverse play reverse",
          },
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.3,
        });

        tl.scrollTrigger?.refresh();
      } else {
        /* ========== MOBILE: simple fade-in for each stage ========== */
        const stages = gsap.utils.toArray<HTMLElement>(".feature-stage");
        stages.forEach((stage) => {
          gsap.set(stage.querySelectorAll(".stage-char"), { yPercent: 0 });
          gsap.set(stage.querySelectorAll(".stage-bullet"), { opacity: 1, y: 0 });
          const visual = stage.querySelector(".feature-visual");
          if (visual) gsap.set(visual, { clipPath: "none", opacity: 1 });
          const titleWrap = stage.querySelector(".stage-title-wrap");
          if (titleWrap) gsap.set(titleWrap, { clipPath: "none", opacity: 1 });
          const numEl = stage.querySelector(".stage-num");
          if (numEl) gsap.set(numEl, { scale: 1, opacity: 0.04 });

          gsap.from(stage, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stage,
              start: "top 85%",
              toggleActions: "play none none reverse",
              onEnter: () => {
                const idx = Number(stage.dataset.stage);
                setActiveIndex(idx);
              },
            },
          });

          const bullets = stage.querySelectorAll(".stage-bullet");
          gsap.from(bullets, {
            opacity: 0,
            y: 25,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
            delay: 0.15,
            scrollTrigger: { trigger: stage, start: "top 80%", toggleActions: "play none none reverse" },
          });
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Desktop active stage animation triggers
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) return;

    const stages = gsap.utils.toArray<HTMLElement>(".feature-stage");
    if (stages.length === 0) return;

    stages.forEach((stage, i) => {
      const isCurrent = i === activeIndex;
      const numEl = stage.querySelector(".stage-num");
      const titleWrap = stage.querySelector(".stage-title-wrap");
      const titleChars = stage.querySelectorAll(".stage-char");
      const bullets = stage.querySelectorAll(".stage-bullet");
      const visual = stage.querySelector(".feature-visual");
      const subtitleEl = stage.querySelector(".stage-subtitle");

      if (isCurrent) {
        gsap.to(stage, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });

        if (numEl) {
          gsap.to(numEl, {
            scale: 1.0,
            opacity: 0.04,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (subtitleEl) {
          gsap.to(subtitleEl, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (titleWrap) {
          gsap.to(titleWrap, {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (titleChars.length > 0) {
          gsap.to(titleChars, {
            yPercent: 0,
            duration: 0.5,
            stagger: 0.02,
            ease: "power3.out",
            overwrite: "auto",
          });
        }

        if (bullets.length > 0) {
          gsap.to(bullets, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (visual) {
          gsap.to(visual, {
            clipPath: "circle(150% at 50% 50%)",
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      } else {
        gsap.to(stage, {
          opacity: 0,
          scale: 0.97,
          y: i > activeIndex ? 60 : -60,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });

        if (numEl) gsap.set(numEl, { scale: 3.5, opacity: 0 });
        if (subtitleEl) gsap.set(subtitleEl, { opacity: 0 });
        if (titleWrap) gsap.set(titleWrap, { clipPath: "inset(0 100% 0 0)", opacity: 0 });
        if (titleChars.length > 0) gsap.set(titleChars, { yPercent: 100 });
        if (bullets.length > 0) gsap.set(bullets, { y: 35, opacity: 0 });
        if (visual) gsap.set(visual, { clipPath: "circle(0% at 50% 50%)", opacity: 0 });
      }
    });
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      id="features"
      className="relative w-full bg-transparent text-zinc-200 select-none z-10 overflow-hidden scroll-mt-24"
    >
      {/* Section label — shown once at top */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center pt-6 lg:pt-8 z-20 pointer-events-none">
        <div className="flex items-center gap-4">
          <span className="w-12 h-px bg-zinc-800" />
          <span className="text-[8px] font-black uppercase tracking-[0.35em] text-zinc-600">Platform Features</span>
          <span className="w-12 h-px bg-zinc-800" />
        </div>
      </div>

      {/* Stacked stages container — pinned on desktop */}
      <div 
        ref={stagesContainerRef} 
        className={isDesktop ? "relative h-[100svh] w-full" : "relative w-full flex flex-col gap-24 py-20"}
      >
        {FEATURES.map((feat, i) => {
          const Visual = VISUALS[i];
          const theme = FEATURE_THEMES[i];

          return (
            <section
              key={i}
              data-stage={i}
              className={`feature-stage w-full flex flex-col items-center justify-center px-6 py-12 lg:py-0 overflow-hidden transition-all duration-700 ${
                isDesktop ? "absolute inset-0 h-[100svh]" : "relative min-h-[85vh] border-b border-white/5 last:border-0"
              }`}
              style={
                isDesktop 
                  ? { opacity: i === activeIndex ? 1 : 0, pointerEvents: i === activeIndex ? "auto" : "none" }
                  : { opacity: 1, pointerEvents: "auto" }
              }
            >
              {/* Giant background number watermark */}
              <span
                className="stage-num absolute pointer-events-none select-none font-black leading-none tracking-tighter text-white/[0.015] z-0 transition-opacity duration-500"
                style={{
                  fontSize: "32vw",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  willChange: "transform, opacity",
                }}
              >
                {feat.num}
              </span>

              {/* HUD Frame Container */}
              <div 
                className="relative z-10 w-full max-w-6xl p-8 lg:p-12 rounded-3xl border bg-zinc-950/20 backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-all duration-500"
                style={{
                  borderColor: i === activeIndex
                    ? (i === 0 ? "rgba(168,85,247,0.25)" : i === 1 ? "rgba(34,211,238,0.25)" : i === 2 ? "rgba(236,72,153,0.25)" : i === 3 ? "rgba(255,255,255,0.2)" : "rgba(251,191,36,0.25)")
                    : "rgba(255,255,255,0.06)"
                }}
              >
                {/* Tech Crosshair node markers */}
                <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-800 font-bold pointer-events-none select-none">+</div>
                <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-800 font-bold pointer-events-none select-none">+</div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-800 font-bold pointer-events-none select-none">+</div>
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-800 font-bold pointer-events-none select-none">+</div>
                
                {/* Grid Scanline watermark overlay inside frame */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none select-none" />

                {/* Subtle dynamic ambient glow inside the card */}
                <div 
                  className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-all duration-500"
                  style={{
                    backgroundColor: i === activeIndex ? theme.glowColor : "transparent"
                  }}
                />

                {/* Text column */}
                <div className="flex flex-col gap-6 lg:items-start items-center text-center lg:text-left z-10">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black tracking-widest px-2.5 py-0.5 border rounded-full font-mono transition-all duration-500 ${theme.tag}`}>
                      {theme.badge}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-550">
                      FEAT // {feat.num}
                    </span>
                  </div>

                  {/* Title with char-split clip reveal */}
                  <h3 className="stage-title-wrap text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9] text-white">
                    <span className="flex flex-wrap gap-x-3.5 justify-center lg:justify-start">
                      {feat.title.split(" ").map((word, wi) => (
                        <span key={wi} className="inline-flex overflow-hidden">
                          {word.split("").map((char, ci) => (
                            <span key={ci} className="stage-char inline-block text-white transition-transform duration-500">{char}</span>
                          ))}
                        </span>
                      ))}
                    </span>
                  </h3>

                  {/* Telemetry Bullets list */}
                  <ul className="space-y-4 pt-2 list-none flex flex-col lg:items-start items-center">
                    {feat.points.map((pt, pIdx) => {
                      const [head, desc] = pt.split(":");
                      return (
                        <li
                          key={pIdx}
                          className="stage-bullet flex items-start gap-3.5 text-[12px] md:text-[13px] text-zinc-400 font-semibold list-none max-w-lg text-left"
                          style={{ willChange: "transform, opacity" }}
                        >
                          <span 
                            className="size-5 rounded-full border bg-zinc-950 flex items-center justify-center text-[8px] font-mono font-bold shrink-0 mt-0.5 shadow-inner transition-all duration-500"
                            style={{
                              borderColor: i === activeIndex
                                ? (i === 0 ? "rgba(168,85,247,0.3)" : i === 1 ? "rgba(34,211,238,0.3)" : i === 2 ? "rgba(236,72,153,0.3)" : i === 3 ? "rgba(255,255,255,0.3)" : "rgba(251,191,36,0.3)")
                                : "rgba(255,255,255,0.05)",
                              color: i === activeIndex
                                ? (i === 0 ? "#c084fc" : i === 1 ? "#22d3ee" : i === 2 ? "#f472b6" : i === 3 ? "#e4e4e7" : "#fbbf24")
                                : "rgba(255,255,255,0.3)"
                            }}
                          >
                            {pIdx + 1}
                          </span>
                          <span className="leading-relaxed">
                            <strong className="text-zinc-200 font-bold tracking-tight">{head}</strong>: {desc}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Visual column */}
                <div className="flex items-center justify-center lg:justify-end order-first lg:order-last z-10">
                  <div 
                    className="relative p-6 rounded-2xl border bg-zinc-950/20 shadow-2xl flex items-center justify-center min-h-[320px] w-full max-w-sm overflow-hidden transition-all duration-500"
                    style={{
                      borderColor: i === activeIndex
                        ? (i === 0 ? "rgba(168,85,247,0.2)" : i === 1 ? "rgba(34,211,238,0.2)" : i === 2 ? "rgba(236,72,153,0.2)" : i === 3 ? "rgba(255,255,255,0.15)" : "rgba(251,191,36,0.2)")
                        : "rgba(255,255,255,0.05)"
                    }}
                  >
                    {/* Visual grid watermark */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    <Visual progress={isDesktop ? (stageProgress[i] ?? 0) : 1} />
                  </div>
                </div>

              </div>
            </section>
          );
        })}
      </div>

      {/* Fixed dot navigation */}
      <div ref={dotNavRef} className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 opacity-0 pointer-events-none transition-opacity duration-300">
        {FEATURES.map((feat, i) => (
          <button
            key={i}
            className="group relative flex items-center justify-center"
            style={{ width: 12, height: 12 }}
            onClick={() => {
              const stagesContainer = stagesContainerRef.current;
              if (!stagesContainer) return;
              const target = stagesContainer.querySelector(`[data-stage="${i}"]`) as HTMLElement;
              if (target) {
                const sectionTop = containerRef.current?.getBoundingClientRect().top ?? 0;
                const viewportH = window.innerHeight;
                const scrollTo = sectionTop + window.scrollY + (i * viewportH * 0.7);
                window.scrollTo({ top: scrollTo, behavior: "smooth" });
              }
            }}
          >
            <span
              className="block rounded-full transition-all duration-500 ease-out animate-pulse"
              style={{
                width: i === activeIndex ? 6 : 4,
                height: i === activeIndex ? 6 : 4,
                backgroundColor: i === activeIndex
                  ? (i === 0 ? "#a78bfa" : i === 1 ? "#22d3ee" : i === 2 ? "#f472b6" : i === 3 ? "#e4e4e7" : "#fbbf24")
                  : "rgba(255,255,255,0.15)",
                boxShadow: i === activeIndex 
                  ? (i === 0 ? "0 0 10px rgba(168,85,247,0.5)" : i === 1 ? "0 0 10px rgba(34,211,238,0.5)" : i === 2 ? "0 0 10px rgba(236,72,153,0.5)" : i === 3 ? "0 0 10px rgba(228,228,231,0.5)" : "0 0 10px rgba(251,191,36,0.5)")
                  : "none",
              }}
            />
            {/* Tooltip on hover */}
            <span className="absolute right-5 whitespace-nowrap text-[8.5px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {feat.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
