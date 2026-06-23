"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function MagneticCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Motion values for instant cursor tracking (0ms delay)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Dynamic stretching scales based on speed
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
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

    // Attach magnetic hover triggers to ALL interactive elements AND text elements
    const setupMagneticElements = () => {
      const targets = document.querySelectorAll(
        "a, button, select, input, textarea, [data-magnetic], .magnetic-target, [role=button], h1, h2, h3, h4, h5, h6, p, span, li, label, strong, em, code"
      );

      targets.forEach((elem) => {
        const handleEnter = () => {
          setIsHovered(true);
        };

        const handleLeave = () => {
          setIsHovered(false);
        };

        elem.addEventListener("mouseenter", handleEnter);
        elem.addEventListener("mouseleave", handleLeave);
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
      
      // Clean up injected style tag
      const existingStyle = document.getElementById("force-hide-default-cursor");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [cursorX, cursorY]);

  if (!mounted || !isVisible) return null;

  return (
    <motion.div
      ref={cursorRef}
      style={{
        x: cursorX,
        y: cursorY,
        scaleX: scaleX,
        scaleY: scaleY,
        rotate: angle,
        transition: "width 0.12s ease-out, height 0.12s ease-out, background-color 0.12s ease-out, border 0.12s ease-out",
      }}
      className={`fixed top-0 left-0 size-5 rounded-full border border-white bg-transparent pointer-events-none z-[9999] mix-blend-difference ${
        isHovered ? "size-12 bg-white border-none" : ""
      } ${isClicking ? "scale-90" : ""}`}
    />
  );
}
