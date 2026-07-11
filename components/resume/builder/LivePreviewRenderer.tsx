"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { getTemplateComponent } from "@/components/resume/templates";

export default function LivePreviewRenderer() {
  const { parsedData } = useResumeStore();
  const templateId = parsedData?.templateId || "minimal";
  const TemplateComponent = getTemplateComponent(templateId);

  return (
    <div className="w-full h-[85vh] overflow-y-auto rounded-xl border border-white/5 bg-zinc-950/40 p-4 shadow-2xl relative select-text">
      <div className="max-w-[620px] mx-auto aspect-[1/1.414] bg-white rounded-xl shadow-2xl overflow-hidden p-8 border border-zinc-200">
        <TemplateComponent data={parsedData} templateId={templateId} />
      </div>
    </div>
  );
}
