"use client";

import { useState, useEffect } from "react";
import { getBlogs } from "@/lib/actions/admin.action";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import AwwwardsCanvas from "./landing/AwwwardsCanvas";
import MagneticCursor from "./landing/MagneticCursor";
import AwwwardsHero from "./landing/AwwwardsHero";
import AwwwardsShowcase from "./landing/AwwwardsShowcase";
import AwwwardsKineticTypography from "./landing/AwwwardsKineticTypography";
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

// Custom geometric monochrome divider
const SectionDivider = () => (
  <div className="relative w-full flex items-center justify-center my-16 select-none z-20">
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent relative">
      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 size-1.5 rotate-45 border border-zinc-700 bg-black" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
      <div className="absolute right-[15%] top-1/2 -translate-y-1/2 size-1.5 rotate-45 border border-zinc-700 bg-black" />
    </div>
  </div>
);

export default function MarketingLanding() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

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
      lerp: 0.045, // Slightly heavier lerp for a highly cinematic damping feel
      wheelMultiplier: 0.6,
      touchMultiplier: 0.65,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Apply velocity physical transformations on text cards (Awwwards kinetic stretching)
    const cardElements = gsap.utils.toArray(".floating-card, .pricing-card");
    
    if (cardElements.length > 0) {
      const skewTo = cardElements.map((el: any) => 
        gsap.quickTo(el, "skewY", { duration: 0.8, ease: "power3.out" })
      );
      const scaleYTo = cardElements.map((el: any) => 
        gsap.quickTo(el, "scaleY", { duration: 0.8, ease: "power3.out" })
      );
      const yOffsetTo = cardElements.map((el: any) => 
        gsap.quickTo(el, "y", { duration: 1.2, ease: "power2.out" })
      );

      lenis.on("scroll", ({ velocity }) => {
        const clampedVelocity = Math.max(Math.min(velocity, 12), -12);
        const skewAngle = clampedVelocity * 0.45;
        const scaleStretch = 1 + Math.abs(clampedVelocity) * 0.0035;
        
        skewTo.forEach((fn) => fn(skewAngle));
        scaleYTo.forEach((fn) => fn(scaleStretch));
        
        yOffsetTo.forEach((fn, idx) => {
          const baseOffset = idx % 2 === 0 ? -25 : 25;
          const speedInfluence = clampedVelocity * 2.5 * (idx % 2 === 0 ? -1 : 1);
          fn(baseOffset + speedInfluence);
        });
      });
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 bg-black min-h-screen text-white overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* Custom magnetic and fluid cursor */}
      <MagneticCursor />

      {/* 3D WebGL centerpiece and gallery scene */}
      <AwwwardsCanvas />

      {/* Ambient monochrome background lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.015)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      {/* Cinematic layout content */}
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <AwwwardsHero />
        
        <SectionDivider />
        <AwwwardsShowcase />
        
        <SectionDivider />
        <ResourcesSection articles={articles} loadingBlogs={loadingBlogs} />
        
        <SectionDivider />
        <AwwwardsKineticTypography />
        
        <PricingSection />
      </div>

    </div>
  );
}
