"use client";

import { useRef, useEffect, useState } from "react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { getTemplateComponent } from "../templates";
import { getFontClass } from "../templates/fonts";

export default function LivePreviewRenderer() {
  const { parsedData } = useResumeStore();
  const currentTemplateId = parsedData.templateId || "minimal";
  const TemplateComponent = getTemplateComponent(currentTemplateId);

  const fontSize = parsedData.customStyles?.fontSize || "base";
  const fontFamily = parsedData.customStyles?.fontFamily || "inter";
  const zoomFactor = fontSize === "sm" ? 0.92 : fontSize === "lg" ? 1.08 : 1.0;

  const fontClass = getFontClass(fontFamily);

  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !resumeRef.current) return;
      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;
      // The resume's natural dimensions (A4-ish at 800px wide, ~1131px tall)
      const resumeNaturalHeight = 1131 * zoomFactor;
      const resumeNaturalWidth = 800;

      const scaleByHeight = containerHeight / resumeNaturalHeight;
      const scaleByWidth = containerWidth / resumeNaturalWidth;
      const newScale = Math.min(scaleByHeight, scaleByWidth, 1); // never scale up beyond 1
      setScale(newScale);
    };

    calculateScale();

    const observer = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [zoomFactor, parsedData]);

  return (
    <div ref={containerRef} className="flex items-start justify-center w-full h-full overflow-hidden">
      <div
        ref={resumeRef}
        className={`w-[800px] bg-white rounded-xl shadow-2xl overflow-hidden min-h-[1131px] transition-all duration-300 origin-top ${fontClass}`}
        style={{ zoom: zoomFactor, transform: `scale(${scale})`, transformOrigin: "top center" }}
      >
        <TemplateComponent data={parsedData} templateId={currentTemplateId} />
      </div>
    </div>
  );
}
