"use client";

import { useResumeStore } from "@/lib/store/resumeStore";
import { getTemplateComponent } from "../templates";
import { Layout } from "lucide-react";

const TEMPLATE_CHOICES = [
  { id: "minimal", name: "Minimal" },
  { id: "corporate", name: "Corporate" },
  { id: "cyber", name: "Cyberpunk" },
  { id: "modern", name: "Modern" },
  { id: "creative", name: "Creative" },
  { id: "executive", name: "Executive" },
  { id: "academic", name: "Academic" },
  { id: "elegant", name: "Elegant" },
  { id: "tech", name: "Tech" },
  { id: "compact", name: "Compact" }
];

export default function LivePreviewRenderer() {
  const { parsedData, updateParsedData } = useResumeStore();
  const currentTemplateId = parsedData.templateId || "minimal";
  const TemplateComponent = getTemplateComponent(currentTemplateId);

  return (
    <div className="flex flex-col w-full max-w-[800px] h-full relative">
      {/* Quick Template Switcher Overlay */}
      <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg p-1.5 flex items-center gap-1 z-20 shadow-lg">
        <Layout className="size-3.5 text-white ml-1 shrink-0" />
        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider px-2 border-r border-slate-800">Layout</span>
        {TEMPLATE_CHOICES.map((choice) => (
          <button
            key={choice.id}
            onClick={() => updateParsedData({ templateId: choice.id })}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded transition-all ${
              currentTemplateId === choice.id
                ? "bg-white text-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {choice.name}
          </button>
        ))}
      </div>

      {/* Render Content */}
      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden min-h-[1050px] scale-[0.98] origin-top transition-all duration-300">
        <TemplateComponent data={parsedData} />
      </div>
    </div>
  );
}
