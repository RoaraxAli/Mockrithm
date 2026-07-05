"use client";

import { useState, useEffect, useRef } from "react";
import { getBlogs } from "@/lib/actions/admin.action";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import AwwwardsCanvas from "./landing/AwwwardsCanvas";
import AwwwardsHero from "./landing/AwwwardsHero";
import AwwwardsShowcase from "./landing/AwwwardsShowcase";
import ResourcesSection from "./landing/ResourcesSection";
import PricingSection from "./landing/PricingSection";

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
}

// Custom geometric monochrome divider — animated width on enter
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
      <div className="divider-line w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent relative origin-center">
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 size-1.5 rotate-45 border border-zinc-700 bg-black" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        <div className="absolute right-[15%] top-1/2 -translate-y-1/2 size-1.5 rotate-45 border border-zinc-700 bg-black" />
      </div>
    </div>
  );
};

export default function MarketingLanding() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Fetch blogs dynamically for the resources section
  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await getBlogs();
        if (res.success && res.data) {
          setArticles(res.data as any[]);
        }
      } catch (err) {
        console.error("Failed to load blogs on landing page:", err);
      } finally {
        setLoadingBlogs(false);
      }
    }
    loadBlogs();
  }, []);

  // Initialize Lenis smooth scroll + GSAP velocity animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.07, // Looser, floaty cinematic damping
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

    // ---- Scroll progress bar driven by Lenis progress callback ----
    const progressTarget = gsap.quickTo(progressBarRef.current, "scaleX", {
      duration: 0.4,
      ease: "power2.out",
    });
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      progressTarget(progress);
    });

    // ---- Scroll velocity stretch (extended to feature cards) ----
    const cardElements = gsap.utils.toArray<HTMLElement>(
      ".floating-card, .pricing-card, .feature-visual, .stage-bullet"
    );

    if (cardElements.length > 0) {
      const scaleYTo = cardElements.map((el) =>
        gsap.quickTo(el, "scaleY", { duration: 0.8, ease: "power3.out" })
      );
      const yOffsetTo = cardElements.map((el) =>
        gsap.quickTo(el, "yPercent", { duration: 1.2, ease: "power2.out" })
      );

      lenis.on("scroll", ({ velocity }: { velocity: number }) => {
        const clampedVelocity = Math.max(Math.min(velocity, 12), -12);
        const scaleStretch = 1 + Math.abs(clampedVelocity) * 0.0035;

        scaleYTo.forEach((fn) => fn(scaleStretch));
        yOffsetTo.forEach((fn, idx) => {
          const baseOffset = idx % 2 === 0 ? -1 : 1;
          const speedInfluence = clampedVelocity * 0.1 * (idx % 2 === 0 ? -1 : 1);
          fn(baseOffset + speedInfluence);
        });
      });
    }

    // ---- Parallax background layers ----
    const parallaxTriggers: ScrollTrigger[] = [];
    const parallaxLayer1 = document.querySelector(".parallax-layer-far");
    const parallaxLayer2 = document.querySelector(".parallax-layer-mid");
    const parallaxLayer3 = document.querySelector(".parallax-layer-near");

    if (parallaxLayer1) {
      parallaxTriggers.push(
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(parallaxLayer1, { yPercent: -self.progress * 100 * 0.1 });
          },
        })
      );
    }
    if (parallaxLayer2) {
      parallaxTriggers.push(
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(parallaxLayer2, { yPercent: -self.progress * 100 * 0.3 });
          },
        })
      );
    }
    if (parallaxLayer3) {
      parallaxTriggers.push(
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(parallaxLayer3, { yPercent: -self.progress * 100 * 0.6 });
          },
        })
      );
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
      parallaxTriggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // ---- Section "breathing" zoom transitions ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".section-zoom");

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { scale: 1.05, opacity: 0.6 },
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

        gsap.to(section, {
          scale: 0.95,
          opacity: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom center",
            end: "bottom top",
            scrub: 0.1,
          },
        });
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 bg-black min-h-screen text-white overflow-x-hidden selection:bg-white selection:text-black">

      {/* 3D WebGL centerpiece and gallery scene */}
      <AwwwardsCanvas />

      {/* Parallax depth layers (background) */}
      <div className="parallax-layer-far fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0 premium-grid-dot opacity-60" />
      </div>
      <div className="parallax-layer-mid fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_70%)]" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.015)_0%,rgba(0,0,0,0)_70%)]" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0)_70%)]" />
      </div>
      <div className="parallax-layer-near fixed inset-0 pointer-events-none z-0" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute size-1 rounded-full bg-white/20"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              opacity: 0.2 + ((i * 13) % 5) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Scroll progress bar (top of viewport) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[9998] pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-white/40 via-white to-white/40 origin-left shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>

      {/* Cinematic layout content */}
      <div ref={contentRef} className="relative z-10 w-full flex flex-col min-h-screen">
        <div className="section-zoom"><AwwwardsHero /></div>

        <SectionDivider />
        <AwwwardsShowcase />

        <div className="section-zoom"><PricingSection /></div>
      </div>

    </div>
  );
}
