"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";

export default function MagneticCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Motion values for instant cursor tracking (0ms delay)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Dynamic stretching scales based on speed
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isLandingPage) return;
    setMounted(true);

    // Disable on mobile touch interfaces
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setIsVisible(true);

    // Inject a global stylesheet to force hide the default cursor on all elements
    const styleEl = document.createElement("style");
    styleEl.id = "force-hide-default-cursor";
    styleEl.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    let mouseX = 0;
    let mouseY = 0;
    let prevX = 0;
    let prevY = 0;
    let speed = 0;
    let requestFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Track mouse exactly
      cursorX.set(mouseX - 8);
      cursorY.set(mouseY - 8);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    // Compute velocity stretching
    const updatePhysics = () => {
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;

      speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1) {
        const rad = Math.atan2(dy, dx);
        setAngle(rad * (180 / Math.PI));

        const stretch = Math.min(speed * 0.012, 0.35);
        setScaleX(1 + stretch);
        setScaleY(1 - stretch);
      } else {
        setScaleX(1);
        setScaleY(1);
      }

      prevX = mouseX;
      prevY = mouseY;

      requestFrameId = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    updatePhysics();

    // ---- Magnetic pull: physically drag [data-magnetic] buttons toward cursor ----
    const magneticRadius = 90; // px radius within which pull activates
    const attachedElements: Array<{ el: HTMLElement; cleanup: () => void }> = [];

    const attachMagnetic = (el: HTMLElement) => {
      if (el.dataset.magneticBound === "true") return;
      el.dataset.magneticBound = "true";
      el.style.willChange = "transform";

      let rafId: number | null = null;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < magneticRadius) {
          const strength = 1 - dist / magneticRadius; // 1 near, 0 at edge
          xTo(dx * 0.4 * strength);
          yTo(dy * 0.4 * strength);
        } else {
          xTo(0);
          yTo(0);
        }
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      window.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      const cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        if (rafId) cancelAnimationFrame(rafId);
        gsap.set(el, { x: 0, y: 0 });
      };

      attachedElements.push({ el, cleanup });
    };

    const boundHoverElements: Array<{ el: HTMLElement; enter: () => void; leave: () => void }> = [];

    // Attach magnetic hover triggers to ALL interactive elements AND text elements
    const setupMagneticElements = () => {
      const targets = document.querySelectorAll(
        "a, button, select, input, textarea, [data-magnetic], .magnetic-target, [role=button], h1, h2, h3, h4, h5, h6, p, span, li, label, strong, em, code"
      );

      targets.forEach((elem) => {
        const el = elem as HTMLElement;

        // Cursor-grow hover (existing behavior)
        const handleEnter = () => setIsHovered(true);
        const handleLeave = () => setIsHovered(false);

        if (el.dataset.cursorBound !== "true") {
          el.dataset.cursorBound = "true";
          el.addEventListener("mouseenter", handleEnter);
          el.addEventListener("mouseleave", handleLeave);
          boundHoverElements.push({ el, enter: handleEnter, leave: handleLeave });
        }

        // Magnetic pull — only for explicitly magnetic elements
        if (el.hasAttribute("data-magnetic") || el.classList.contains("magnetic-target")) {
          attachMagnetic(el);
        }
      });
    };

    // Run setup and retry occasionally to capture dynamically rendered elements
    setupMagneticElements();
    const intervalId = setInterval(setupMagneticElements, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      cancelAnimationFrame(requestFrameId);
      clearInterval(intervalId);
      attachedElements.forEach(({ cleanup }) => cleanup());
      
      // Clean up grow hover listeners
      boundHoverElements.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        if (el.dataset) {
          delete el.dataset.cursorBound;
        }
      });

      // Clean up injected style tag
      const existingStyle = document.getElementById("force-hide-default-cursor");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [cursorX, cursorY, isLandingPage]);

  if (!mounted || !isVisible || !isLandingPage) return null;
 
   return (
     <motion.div
       ref={cursorRef}
       style={{
         x: cursorX,
         y: cursorY,
         scaleX: isClicking ? scaleX * 0.85 : scaleX,
         scaleY: isClicking ? scaleY * 0.85 : scaleY,
         rotate: angle,
         transition: "width 0.12s ease-out, height 0.12s ease-out, background-color 0.12s ease-out, border 0.12s ease-out",
         zIndex: 999999,
       }}
       className={`fixed top-0 left-0 size-5 rounded-full border border-white bg-transparent pointer-events-none mix-blend-difference ${
         isHovered ? "size-12 bg-white border-none" : ""
       }`}
     />
   );
}
