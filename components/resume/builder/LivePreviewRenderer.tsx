"use client";

import { useRef, useEffect, useState } from "react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { getTemplateComponent } from "../templates";
import { getFontClass } from "../templates/fonts";

const A4_HEIGHT = 1131; // A4 height in pixels at ~96dpi (297mm)

export default function LivePreviewRenderer() {
  const { parsedData } = useResumeStore();
  const currentTemplateId = parsedData.templateId || "minimal";
  const TemplateComponent = getTemplateComponent(currentTemplateId);

  const fontSize = parsedData.customStyles?.fontSize || "base";
  const fontFamily = parsedData.customStyles?.fontFamily || "inter";
  const zoomFactor = fontSize === "sm" ? 0.92 : fontSize === "lg" ? 1.08 : 1.0;

  const fontClass = getFontClass(fontFamily);

  const contentRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!contentRef.current) return;
      const contentHeight = contentRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(contentHeight / A4_HEIGHT));
      setTotalPages(pages);
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [parsedData, zoomFactor]);

  return (
    <div className="flex flex-col w-full max-w-[800px] relative gap-6 py-6">
      {Array.from({ length: totalPages }, (_, pageIndex) => (
        <div key={pageIndex} className="relative">
          {/* A4 Page */}
          <div
            className={`w-full bg-white shadow-2xl overflow-hidden transition-all duration-300 ${fontClass}`}
            style={{
              height: `${A4_HEIGHT}px`,
              zoom: zoomFactor,
            }}
          >
            <div
              ref={pageIndex === 0 ? contentRef : undefined}
              style={{
                marginTop: `-${pageIndex * A4_HEIGHT}px`,
              }}
            >
              <TemplateComponent data={parsedData} templateId={currentTemplateId} />
            </div>
          </div>

          {/* Page indicator */}
          <div className="absolute bottom-3 right-4 bg-black/60 backdrop-blur-sm text-white/80 text-[10px] font-mono px-2.5 py-1 rounded-md z-10">
            {pageIndex + 1} / {totalPages}
          </div>
        </div>
      ))}
    </div>
  );
}
