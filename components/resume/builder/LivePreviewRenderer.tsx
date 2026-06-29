"use client";

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

