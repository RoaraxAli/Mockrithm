"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AwwwardsKineticTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. KINETIC LETTERS PARALLAX ANIMATION
    gsap.registerPlugin(ScrollTrigger);

    const oddLetters = gsap.utils.toArray(".letter-odd");
    const evenLetters = gsap.utils.toArray(".letter-even");

    oddLetters.forEach((letter: any) => {
      gsap.to(letter, {
        y: -100,
        skewX: 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    });

    evenLetters.forEach((letter: any) => {
      gsap.to(letter, {
        y: 120,
        skewX: -10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    });

    // 2. FILM GRAIN NOISE EFFECT ON CANVAS
    const canvas = noiseCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resizeNoise = () => {
      canvas.width = canvas.clientWidth / 2; // Low res for speed & style
      canvas.height = canvas.clientHeight / 2;
    };
    resizeNoise();
    window.addEventListener("resize", resizeNoise);

    const drawNoise = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      // Draw random noise pixels
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;       // R
        data[i+1] = val;     // G
        data[i+2] = val;     // B
        data[i+3] = 12;      // A (very low opacity noise overlay)
      }

      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(drawNoise);
    };

    drawNoise();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeNoise);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  const word1 = "MOCKRITHM".split("");
  const word2 = "PRICING".split("");

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[60vh] bg-transparent flex flex-col justify-center items-center overflow-hidden select-none z-10"
    >
      {/* Dynamic noise layer */}
      <canvas
        ref={noiseCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-overlay z-0"
      />

      {/* Decorative lines */}
      <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Kinetic Typography Rows */}
      <div className="w-full flex flex-col gap-6 items-center text-center justify-center relative z-10 font-mona-sans">
        
        {/* ROW 1 */}
        <div className="flex justify-center overflow-hidden select-none uppercase tracking-tighter">
          {word1.map((char, index) => (
            <span
              key={index}
              className={`text-[12vw] font-black inline-block text-white ${
                index % 2 === 0 ? "letter-odd" : "letter-even"
              }`}
              style={{ willChange: "transform" }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Row Telemetry Sub-line */}
        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-550 my-2">
          INTELLIGENCE INTERACTION MATRIX CORE // ONLINE
        </div>

        {/* ROW 2 */}
        <div className="flex justify-center overflow-hidden select-none uppercase tracking-tighter">
          {word2.map((char, index) => (
            <span
              key={index}
              className={`text-[12vw] font-black inline-block ${
                index % 2 === 0 ? "letter-even text-zinc-700/80" : "letter-odd text-white"
              }`}
              style={{ willChange: "transform" }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
