"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { getTemplateComponent } from "@/components/resume/templates";

export default function LivePreviewRenderer() {
  const { parsedData } = useResumeStore();
  const templateId = parsedData?.templateId || "minimal";
  const TemplateComponent = getTemplateComponent(templateId);

  return (
    <div className="w-full h-[85vh] overflow-y-auto bg-zinc-950/40 relative select-text flex justify-center items-start">
      <div className="w-full max-w-[620px]">
        <TemplateComponent data={parsedData} templateId={templateId} />
      </div>
    </div>
  );
}
