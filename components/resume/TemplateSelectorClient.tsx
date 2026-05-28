"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createResumeFromTemplate } from "@/lib/actions/resume.action";
import { Layout, Check, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Props {
  userId: string;
}

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimalist",
    description: "Ultra-clean, single-column design focused on clarity and readability. Highly recommended for standard ATS engines.",
    color: "from-slate-600 to-slate-800",
    tags: ["ATS Friendly", "Clean", "Universal"]
  },
  {
    id: "corporate",
    name: "Classic Corporate",
    description: "Traditional corporate layout with structured dividers. Ideal for banking, finance, consulting, and management roles.",
    color: "from-blue-600 to-blue-800",
    tags: ["Professional", "Structured", "Traditional"]
  },
  {
    id: "cyber",
    name: "Tech & Cyberpunk",
    description: "Vibrant accents, futuristic fonts, and dark/neon accents. Perfect for front-end developers, game devs, and creative technologists.",
    color: "from-cyan-500 to-indigo-600",
    tags: ["Tech", "Modern", "Creative"]
  },
  {
    id: "modern",
    name: "Modern Sidebar",
    description: "A sleek two-column layout separating contact details and skills from core professional experience. Great for designers and marketers.",
    color: "from-emerald-500 to-teal-700",
    tags: ["Two-Column", "Designer", "Sleek"]
  },
  {
    id: "creative",
    name: "Vibrant Creative",
    description: "Bold headings and artistic highlights designed to stand out. Recommended for content creators, copywriters, and UI/UX designers.",
    color: "from-pink-500 to-rose-600",
    tags: ["Artistic", "Bold", "Impactful"]
  },
  {
    id: "academic",
    name: "Academic CV",
    description: "Extended spacing, formal typography, and sections built for publications, teaching, and research grants. Built for academia.",
    color: "from-amber-600 to-orange-700",
    tags: ["Academic", "Extended", "Detailed"]
  }
];

export default function TemplateSelectorClient({ userId }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = async (templateId: string) => {
    try {
      setSelectedId(templateId);
      setIsSubmitting(true);
      toast.info("Creating your workspace resume...");

      const res = await createResumeFromTemplate(userId, templateId);
      if (res.success && res.resumeId) {
        toast.success("Workspace loaded successfully!");
        router.push(`/user/dashboard/resume/workspace/${res.resumeId}`);
      } else {
        throw new Error(res.error || "Failed to create resume template");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create resume.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {TEMPLATES.map((tpl) => (
        <motion.div
          key={tpl.id}
          whileHover={{ y: -4 }}
          onClick={() => !isSubmitting && handleSelect(tpl.id)}
          className={`group cursor-pointer relative rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all ${
            isSubmitting && selectedId === tpl.id ? "border-cyan-500" : ""
          }`}
        >
          <div>
            <div className={`h-32 rounded-xl bg-gradient-to-br ${tpl.color} relative overflow-hidden flex items-center justify-center mb-6`}>
              <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
              <Layout className="size-12 text-white/40 group-hover:text-white/60 group-hover:scale-110 transition-all duration-300 relative z-10" />
              {isSubmitting && selectedId === tpl.id ? (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 z-20">
                  <Loader2 className="size-6 text-cyan-400 animate-spin" />
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Creating...</span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {tpl.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 uppercase border border-slate-850">
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              {tpl.name}
              <ArrowRight className="size-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
              {tpl.description}
            </p>
          </div>

          <div className="w-full h-[1px] bg-slate-850 mb-4" />
          
          <button
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-lg border font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isSubmitting && selectedId === tpl.id
                ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950"
            }`}
          >
            {isSubmitting && selectedId === tpl.id ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Preparing...
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" /> Start Building
              </>
            )}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
