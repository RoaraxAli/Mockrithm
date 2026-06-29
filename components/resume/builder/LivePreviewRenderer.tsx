"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { getTemplateComponent } from "../templates";

export default function LivePreviewRenderer() {
  const { parsedData } = useResumeStore();
  const currentTemplateId = parsedData.templateId || "minimal";
  const TemplateComponent = getTemplateComponent(currentTemplateId);

  return (
    <div className="flex flex-col w-full max-w-[800px] h-full relative">
      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden min-h-[1131px] scale-[0.98] origin-top transition-all duration-300">
        <TemplateComponent data={parsedData} templateId={currentTemplateId} />
      </div>
    </div>
  );
}
