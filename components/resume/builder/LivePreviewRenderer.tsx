"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { getTemplateComponent } from "../templates";

export default function LivePreviewRenderer() {
  const { parsedData } = useResumeStore();
  const currentTemplateId = parsedData.templateId || "minimal";
  const TemplateComponent = getTemplateComponent(currentTemplateId);

  const fontSize = parsedData.customStyles?.fontSize || "base";
  const fontFamily = parsedData.customStyles?.fontFamily || "sans";
  const zoomFactor = fontSize === "sm" ? 0.9 : fontSize === "lg" ? 1.08 : 1.0;

  const fontClass = 
    fontFamily === "sans" ? "font-sans" : 
    fontFamily === "serif" ? "font-serif" : 
    fontFamily === "mono" ? "font-mono" : "";

  return (
    <div className="flex flex-col w-full max-w-[800px] h-full relative">
      <div 
        className={`w-full bg-white rounded-xl shadow-2xl overflow-hidden min-h-[1131px] transition-all duration-300 ${fontClass}`}
        style={{ zoom: zoomFactor }}
      >
        <TemplateComponent data={parsedData} templateId={currentTemplateId} />
      </div>
    </div>
  );
}
