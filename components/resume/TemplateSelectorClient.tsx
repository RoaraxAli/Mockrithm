"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createResumeFromTemplate } from "@/lib/actions/resume.action";
import { Layout, Check, Sparkles, Loader2, ArrowRight, User, Briefcase, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Props } from "next/script";
import AnimatedResumeCard from "./AnimatedResumeCard";

// Sample data for mini-resume previews (same as before)
const SAMPLE_PROFILES = {
  minimal: {
    name: "Alex Johnson",
    title: "Software Engineer",
    summary: "Full‑stack developer with 5+ years experience building scalable web applications.",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
    experience: [
      { role: "Senior Engineer", company: "TechCorp", years: "2021‑Present" },
      { role: "Developer", company: "WebStart", years: "2018‑2021" }
    ],
    education: [{ degree: "B.Sc. Computer Science", school: "State University", year: "2018" }]
  },
  corporate: {
    name: "Maria Lopez",
    title: "Financial Analyst",
    summary: "Analytical professional with 6 years in banking and investment analysis.",
    skills: ["Excel", "Financial Modeling", "SQL", "PowerBI", "Risk Management"],
    experience: [
      { role: "Senior Analyst", company: "Global Bank", years: "2020‑Present" },
      { role: "Analyst", company: "Capital Advisors", years: "2017‑2020" }
    ],
    education: [{ degree: "M.B.A. Finance", school: "Harvard Business School", year: "2017" }]
  },
  cyber: {
    name: "Samir Patel",
    title: "Full‑Stack Developer",
    summary: "Passionate about cutting‑edge web tech and building performant UI/UX.",
    skills: ["React", "Next.js", "Tailwind", "GraphQL", "Docker"],
    experience: [
      { role: "Lead Engineer", company: "Neon Labs", years: "2022‑Present" },
      { role: "Junior Developer", company: "Pixel Forge", years: "2020‑2022" }
    ],
    education: [{ degree: "B.Tech Computer Engineering", school: "MIT", year: "2020" }]
  },
  modern: {
    name: "Lena Chen",
    title: "Creative Designer",
    summary: "Design specialist with a focus on brand identity and digital experiences.",
    skills: ["Figma", "Adobe CC", "UI/UX", "Brand Strategy", "Illustration"],
    experience: [
      { role: "Senior Designer", company: "CreativeWorks", years: "2021‑Present" },
      { role: "Designer", company: "Studio 9", years: "2018‑2021" }
    ],
    education: [{ degree: "B.A. Visual Communication", school: "Art Institute", year: "2018" }]
  },
  creative: {
    name: "Jenna Ruiz",
    title: "Content Creator & Copywriter",
    summary: "Storyteller crafting compelling copy for brands across media platforms.",
    skills: ["Copywriting", "SEO", "Social Media", "WordPress", "Video Editing"],
    experience: [
      { role: "Lead Content Strategist", company: "MediaSpark", years: "2019‑Present" },
      { role: "Freelance Writer", company: "Various", years: "2016‑2019" }
    ],
    education: [{ degree: "B.Sc. Journalism", school: "Columbia University", year: "2016" }]
  },
  academic: {
    name: "Daniel Kim",
    title: "Ph.D. Candidate in Biology",
    summary: "Researcher focused on cellular signaling pathways and gene expression analysis.",
    skills: ["R", "Python", "Bioinformatics", "NGS", "Lab Techniques"],
    experience: [
      { role: "Research Assistant", company: "University Lab", years: "2019‑Present" }
    ],
    education: [
      { degree: "M.Sc. Molecular Biology", school: "UCLA", year: "2019" },
      { degree: "B.Sc. Biochemistry", school: "UCLA", year: "2017" }
    ]
  }
};

function MiniResumeCard({ templateId }: { templateId: string }) {
  const profile = SAMPLE_PROFILES[templateId];
  if (!profile) return null;
  const { name, title, summary, skills, experience, education } = profile;
  const gradientMap: Record<string, string> = {
    minimal: "from-gray-800 to-gray-700",
    corporate: "from-indigo-800 to-indigo-600",
    cyber: "from-purple-800 to-pink-600",
    modern: "from-blue-800 to-cyan-600",
    creative: "from-pink-800 to-red-600",
    executive: "from-green-800 to-emerald-600",
    academic: "from-yellow-800 to-amber-600",
  };
  const gradient = gradientMap[templateId] || "from-gray-800 to-gray-700";
  return (
    <motion.div
      className={`bg-gradient-to-br ${gradient} rounded-xl shadow-xl p-4 text-gray-200 text-xs overflow-hidden`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, rotate: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with avatar */}
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs mr-2 text-gray-800">
          {name.split(' ')[0][0]}
          {name.split(' ')[1] ? name.split(' ')[1][0] : ''}
        </div>
        <div>
          <div className="font-bold text-white">{name}</div>
          <div className="italic text-gray-300">{title}</div>
        </div>
      </div>
      <p className="mb-2 text-gray-100">{summary}</p>
      <div className="mb-2"><span className="font-semibold text-white">Skills:</span> {skills.join(', ')}</div>
      <div className="mb-2"><span className="font-semibold text-white">Experience:</span>
        <ul className="list-disc list-inside">
          {experience.map((exp: any, i: number) => (
            <li key={i}>{exp.role} @ {exp.company} ({exp.years})</li>
          ))}
        </ul>
      </div>
      <div className="mb-2"><span className="font-semibold text-white">Education:</span>
        <ul className="list-disc list-inside">
          {education.map((ed: any, i: number) => (
            <li key={i}>{ed.degree}, {ed.school} ({ed.year})</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function renderPreview(id: string) {
  return <AnimatedResumeCard templateId={id} />;
}

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimalist",
    color: "from-white/10 to-white/5",
    tags: ["ATS Friendly", "Clean", "Universal"],
  },
  {
    id: "corporate",
    name: "Classic Corporate",
    color: "from-white/10 to-white/5",
    tags: ["Professional", "Structured", "Traditional"],
    },
  {
    id: "cyber",
    name: "Tech & Cyberpunk",
    color: "from-white/10 to-white/5",
    tags: ["Tech", "Modern", "Creative"],
  },
  {
    id: "modern",
    name: "Modern Sidebar",
    color: "from-white/10 to-white/5",
    tags: ["Two-Column", "Designer", "Sleek"],
  },
  {
    id: "creative",
    name: "Vibrant Creative",
    color: "from-white/10 to-white/5",
    tags: ["Artistic", "Bold", "Impactful"],
  },
  {
    id: "executive",
    name: "Executive Leader",
    color: "from-white/10 to-white/5",
    tags: ["Executive", "Formal", "Leadership"],
  },
  {
    id: "academic",
    name: "Academic CV",
    color: "from-white/10 to-white/5",
    tags: ["Academic", "Extended", "Detailed"],
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
          className={`group cursor-pointer relative rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-white/20 hover:shadow-xl transition-all ${
            isSubmitting && selectedId === tpl.id ? "border-white" : ""
          }`}
        >
          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tpl.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 uppercase border border-slate-850">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              {tpl.name}
              <ArrowRight className="size-4 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </h3>
            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed font-medium mb-2">
              {tpl.description}
            </p>
            {/* Audience label */}
            <p className="text-sm text-gray-300 italic mb-4">{tpl.audience}</p>

            {/* Mini resume preview */}
            <div className="bg-slate-950/30 backdrop-blur-xl rounded-xl p-4 border border-slate-800 mb-4">
              {renderPreview(tpl.id)}
            </div>
          </div>

          <div className="w-full h-[1px] bg-slate-850 mb-4" />
          
          <button
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-lg border font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isSubmitting && selectedId === tpl.id
                ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white hover:text-black text-white"
            }`}
          >
            {isSubmitting && selectedId === tpl.id ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Preparing...
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" /> Use Template
              </>
            )}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
