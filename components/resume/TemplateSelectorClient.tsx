"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createResumeFromTemplate } from "@/lib/actions/resume.action";
import { Layout, Check, Sparkles, Loader2, ArrowRight, User, Briefcase, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getTemplateComponent, TEMPLATE_MAPPING } from "./templates";
import { ParsedResume } from "@/types/resume";
import { SAMPLE_PROFILES } from "./sampleProfiles";

interface Props {
  userId: string;
}

function TemplatePreview({ templateId }: { templateId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        setScale(width / 800);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const TemplateComponent = getTemplateComponent(templateId);
  const profileData = SAMPLE_PROFILES[templateId] || SAMPLE_PROFILES[TEMPLATE_MAPPING[templateId]] || SAMPLE_PROFILES.minimal;

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-[1/1.414] overflow-hidden bg-white border border-zinc-200 relative shadow-inner mb-4 transition-all duration-500 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex justify-center items-start"
    >
      <div 
        className="absolute top-0 left-0 pointer-events-none select-none text-slate-800 origin-top-left"
        style={{ 
          width: "800px", 
          height: "1131px",
          transform: `scale(${scale})`,
        }}
      >
        <TemplateComponent data={profileData} />
      </div>
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

const TEMPLATES = [
  // 1. Education
  {
    id: "elementary-teacher",
    name: "Elementary School Teacher",
    category: "Education",
    tags: ["Compact", "One-Page"],
    description: "Highly structured layout ideal for primary school teachers."
  },
  {
    id: "high-school-teacher",
    name: "High School Teacher",
    category: "Education",
    tags: ["Minimalist", "ATS Friendly"],
    description: "Clean layout prioritizing subject specialization and classroom results."
  },
  {
    id: "college-professor",
    name: "College Professor",
    category: "Education",
    tags: ["Academic", "Detailed"],
    description: "Research-heavy layout optimized for publications and lectures."
  },
  {
    id: "special-education",
    name: "Special Education Teacher",
    category: "Education",
    tags: ["Modern", "Spacious"],
    description: "Two-column design showing special needs certifications and highlights."
  },
  {
    id: "esl-teacher",
    name: "ESL Instructor",
    category: "Education",
    tags: ["Creative", "Vibrant"],
    description: "Layout optimized for language training and conversational skills."
  },
  {
    id: "school-counselor",
    name: "School Guidance Counselor",
    category: "Education",
    tags: ["Elegant", "Serif"],
    description: "Classy warm layout showing counseling and student progress metrics."
  },

  // 2. Government
  {
    id: "public-policy",
    name: "Public Policy Analyst",
    category: "Government",
    tags: ["Corporate", "Structured"],
    description: "Formal corporate grid layout emphasizing policy drafts and statistics."
  },
  {
    id: "city-planner",
    name: "Urban City Planner",
    category: "Government",
    tags: ["Minimalist", "Clean"],
    description: "Clear layout showing spatial planning experience and public works."
  },
  {
    id: "environmental-officer",
    name: "Environmental Officer",
    category: "Government",
    tags: ["Executive", "Formal"],
    description: "Structured design focused on regulatory compliance and field operations."
  },
  {
    id: "federal-admin",
    name: "Federal Program Admin",
    category: "Government",
    tags: ["Academic", "Detailed"],
    description: "Comprehensive template designed for federal job applications."
  },
  {
    id: "social-worker",
    name: "Social Services Coordinator",
    category: "Government",
    tags: ["Compact", "Structured"],
    description: "Dense single page layout outlining casework volume and community support."
  },
  {
    id: "diplomat",
    name: "Foreign Relations Advisor",
    category: "Government",
    tags: ["Elegant", "Serif"],
    description: "Polished design emphasizing bilateral agreements and consulate actions."
  },

  // 3. Legal
  {
    id: "corporate-counsel",
    name: "Corporate Legal Counsel",
    category: "Legal",
    tags: ["Elegant", "Serif"],
    description: "Classy warm layout showing transaction highlights and advisory."
  },
  {
    id: "litigation-attorney",
    name: "Litigation Attorney",
    category: "Legal",
    tags: ["Corporate", "Traditional"],
    description: "Structured, formal style with traditional layout rules for courts."
  },
  {
    id: "compliance-specialist",
    name: "Compliance Specialist",
    category: "Legal",
    tags: ["Minimalist", "Clean"],
    description: "Clean, distraction-free layout highlighting regulatory guidelines."
  },
  {
    id: "legal-assistant",
    name: "Legal Assistant / Paralegal",
    category: "Legal",
    tags: ["Compact", "One-Page"],
    description: "Dense double-column layout designed to fit extensive support details."
  },
  {
    id: "judge-clerk",
    name: "Judicial Law Clerk",
    category: "Legal",
    tags: ["Academic", "Detailed"],
    description: "Detailed style highlighting opinion drafts, research and transcripts."
  },
  {
    id: "arbitrator",
    name: "Conflict Resolution Specialist",
    category: "Legal",
    tags: ["Modern", "Sleek"],
    description: "Modern layout highlighting mediation results and union arbitrations."
  },

  // 4. Technology
  {
    id: "full-stack-dev",
    name: "Full-Stack Developer",
    category: "Technology",
    tags: ["Tech", "Code"],
    description: "Monospaced developer code layout with bold tech tags."
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    category: "Technology",
    tags: ["Tech", "Cloud"],
    description: "Kubernetes and infrastructure-themed clean layout."
  },
  {
    id: "ui-ux-designer",
    name: "UI/UX Designer",
    category: "Technology",
    tags: ["Modern", "Sleek"],
    description: "Two-column design showing design systems and UX research."
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    category: "Technology",
    tags: ["Minimalist", "ATS Friendly"],
    description: "Clean layout prioritizing quantitative models and data projects."
  },
  {
    id: "product-manager",
    name: "Technical Product Manager",
    category: "Technology",
    tags: ["Executive", "Modern"],
    description: "Product roadmap-themed layout with product release metrics."
  },
  {
    id: "cyber-security",
    name: "PenTester & Security Analyst",
    category: "Technology",
    tags: ["Cyber", "Code"],
    description: "Security-themed layout highlighting penetration audits and vulnerability fixes."
  },

  // 5. Creative
  {
    id: "art-director",
    name: "Creative Art Director",
    category: "Creative",
    tags: ["Creative", "Artistic"],
    description: "Dynamic top color banner with offset multi-column highlights."
  },
  {
    id: "copywriter",
    name: "Professional Copywriter",
    category: "Creative",
    tags: ["Creative", "Minimalist"],
    description: "Clean, storytelling layout focusing on copy impact and client list."
  },
  {
    id: "social-media",
    name: "Social Media Manager",
    category: "Creative",
    tags: ["Creative", "Modern"],
    description: "Bold layout emphasizing audience growth and campaign stats."
  },
  {
    id: "content-producer",
    name: "Digital Content Producer",
    category: "Creative",
    tags: ["Modern", "Spacious"],
    description: "Two-column template showing media production skills and links."
  },
  {
    id: "fashion-designer",
    name: "Apparel Designer",
    category: "Creative",
    tags: ["Elegant", "Serif"],
    description: "Elegant serif layout demonstrating fabric sourcing and runway collections."
  },
  {
    id: "illustrator",
    name: "Concept Illustrator",
    category: "Creative",
    tags: ["Compact", "One-Page"],
    description: "Visual portfolio layout displaying digital artwork formats."
  },

  // 6. Executive
  {
    id: "ops-director",
    name: "Operations Director",
    category: "Executive",
    tags: ["Executive", "Leadership"],
    description: "Serif-based elegant style designed for leadership profiles."
  },
  {
    id: "vp-product",
    name: "VP of Product Management",
    category: "Executive",
    tags: ["Executive", "Modern"],
    description: "Clean, high-impact layout for product roadmaps and releases."
  },
  {
    id: "chief-staff",
    name: "Chief of Staff",
    category: "Executive",
    tags: ["Elegant", "Formal"],
    description: "Classy warm layout showing cross-functional strategy."
  },
  {
    id: "managing-director",
    name: "Managing Director",
    category: "Executive",
    tags: ["Executive", "Corporate"],
    description: "Traditional executive design highlighting P&L management."
  },
  {
    id: "cfo",
    name: "Chief Financial Officer",
    category: "Executive",
    tags: ["Executive", "Corporate"],
    description: "Structured corporate style emphasizing accounting audits and treasury."
  },
  {
    id: "cio",
    name: "Chief Information Officer",
    category: "Executive",
    tags: ["Tech", "Leadership"],
    description: "Tech infrastructure template designed for IT directors."
  },

  // 7. Healthcare
  {
    id: "registered-nurse",
    name: "Registered Nurse",
    category: "Healthcare",
    tags: ["Minimalist", "ATS Friendly"],
    description: "Distraction-free layout highlighting clinical skills and license details."
  },
  {
    id: "clinical-coordinator",
    name: "Clinical Trial Coordinator",
    category: "Healthcare",
    tags: ["Academic", "Detailed"],
    description: "Detail-heavy layout optimized for trials and research protocols."
  },
  {
    id: "physical-therapist",
    name: "Physical Therapist",
    category: "Healthcare",
    tags: ["Corporate", "Structured"],
    description: "Traditional structured style focused on patient rehab and care."
  },
  {
    id: "health-admin",
    name: "Healthcare Administrator",
    category: "Healthcare",
    tags: ["Compact", "One-Page"],
    description: "High density layout to fit operational compliance in one page."
  },
  {
    id: "pharmacist",
    name: "Pharmacist Lead",
    category: "Healthcare",
    tags: ["Elegant", "Serif"],
    description: "Structured serif layout detailing dosage auditing and inventory control."
  },
  {
    id: "dentist",
    name: "Dental Surgeon",
    category: "Healthcare",
    tags: ["Modern", "Sleek"],
    description: "Clean layout showcasing surgical procedures and 3D modeling skills."
  },

  // 8. Finance
  {
    id: "banking-associate",
    name: "Investment Banking Associate",
    category: "Finance",
    tags: ["Elegant", "Serif"],
    description: "Elegant serif design emphasizing M&A deals and transactions."
  },
  {
    id: "wealth-consultant",
    name: "Wealth Advisor / Consultant",
    category: "Finance",
    tags: ["Elegant", "Corporate"],
    description: "Sophisticated styling focusing on wealth strategy and assets."
  },
  {
    id: "management-consultant",
    name: "Management Consultant",
    category: "Finance",
    tags: ["Corporate", "Structured"],
    description: "Structured corporate design outlining advisory casework."
  },
  {
    id: "tax-associate",
    name: "Senior Tax Associate",
    category: "Finance",
    tags: ["Minimalist", "ATS Friendly"],
    description: "Clean layout prioritizing tax accounting and auditing qualifications."
  },
  {
    id: "risk-manager",
    name: "Risk Assessment Lead",
    category: "Finance",
    tags: ["Compact", "One-Page"],
    description: "High density layout to fit stress-testing models and audit details."
  },
  {
    id: "auditor",
    name: "Internal Auditor",
    category: "Finance",
    tags: ["Academic", "Detailed"],
    description: "Traditional grid layout for corporate reconciliations and balance sheets."
  },

  // 9. Sales
  {
    id: "account-executive",
    name: "Enterprise Account Executive",
    category: "Sales",
    tags: ["Modern", "Sleek"],
    description: "Modern two-column design focusing on quota attainment and sales pipeline."
  },
  {
    id: "brand-manager",
    name: "Global Brand Manager",
    category: "Sales",
    tags: ["Creative", "Impactful"],
    description: "Vibrant accents focusing on campaign launches and market shares."
  },
  {
    id: "marketing-director",
    name: "Director of Marketing",
    category: "Sales",
    tags: ["Executive", "Formal"],
    description: "Premium leadership layout focusing on marketing ROI and growth."
  },
  {
    id: "sales-rep",
    name: "Regional Sales Representative",
    category: "Sales",
    tags: ["Compact", "Structured"],
    description: "Dense single page layout outlining territory numbers and products."
  },
  {
    id: "customer-success",
    name: "Customer Success Manager",
    category: "Sales",
    tags: ["Minimalist", "ATS Friendly"],
    description: "Clean, distraction-free layout emphasizing client onboarding and CSAT."
  },
  {
    id: "business-dev",
    name: "Business Development Associate",
    category: "Sales",
    tags: ["Elegant", "Serif"],
    description: "Bespoke elegant layout tracking partnership growth and leads."
  },

  // 10. Hospitality
  {
    id: "hotel-manager",
    name: "Hotel Operations Manager",
    category: "Hospitality",
    tags: ["Corporate", "Structured"],
    description: "Traditional structured style highlighting hospitality standards."
  },
  {
    id: "restaurant-manager",
    name: "Restaurant General Manager",
    category: "Hospitality",
    tags: ["Compact", "One-Page"],
    description: "Compact template focusing on team scheduling and food safety."
  },
  {
    id: "event-coordinator",
    name: "Lead Event Coordinator",
    category: "Hospitality",
    tags: ["Modern", "Sleek"],
    description: "Elegant layout outlining vendor contacts and logistics planning."
  },
  {
    id: "travel-agent",
    name: "Travel Specialist",
    category: "Hospitality",
    tags: ["Minimalist", "Clean"],
    description: "Distraction-free layout outlining itinerary planning and booking platforms."
  },
  {
    id: "flight-attendant",
    name: "Cabin Crew Lead",
    category: "Hospitality",
    tags: ["Elegant", "Serif"],
    description: "Serif layout highlighting cabin safety, CPR, and customer ratings."
  },
  {
    id: "sommelier",
    name: "Wine & Beverage Director",
    category: "Hospitality",
    tags: ["Creative", "Vibrant"],
    description: "Vibrant layout detailing cellaring management and menu tastings."
  }
];

const CATEGORIES = [
  "All", "Education", "Government", "Legal", "Technology",
  "Creative", "Executive", "Healthcare", "Finance", "Sales", "Hospitality"
];

export default function TemplateSelectorClient({ userId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get("from") === "onboarding";
  const [activeCategory, setActiveCategory] = useState<string>("All");
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
        if (fromOnboarding) {
          router.push(`/user/dashboard/resume/workspace/${res.resumeId}?from=onboarding`);
        } else {
          router.push(`/user/dashboard/resume/workspace/${res.resumeId}`);
        }
      } else {
        throw new Error(res.error || "Failed to create resume template");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create resume.");
      setIsSubmitting(false);
    }
  };

  const filteredTemplates = activeCategory === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Category selector row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold transition-all border shrink-0 ${
              activeCategory === cat
                ? "bg-white text-black border-white shadow-md"
                : "bg-zinc-950 text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid displaying filtered templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
        {filteredTemplates.map((tpl) => (
          <motion.div
            key={tpl.id}
            whileHover={{ y: -6 }}
            onClick={() => !isSubmitting && handleSelect(tpl.id)}
            className={`group cursor-pointer relative rounded-2xl bg-zinc-900/30 border border-zinc-850 p-4 flex flex-col justify-between hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 ${
              isSubmitting && selectedId === tpl.id ? "border-white shadow-lg" : ""
            }`}
          >
            <div>
              <TemplatePreview templateId={tpl.id} />

              {/* Template Info */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors font-mono uppercase tracking-wider">
                    {tpl.name}
                  </h3>
                  <div className="flex gap-1">
                    {tpl.tags.slice(0, 1).map((tag) => (
                      <span key={tag} className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800 uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <button
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-lg border font-mono font-bold text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  isSubmitting && selectedId === tpl.id
                    ? "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-white/5 border-white/10 group-hover:border-white group-hover:bg-white group-hover:text-black text-white"
                }`}
              >
                {isSubmitting && selectedId === tpl.id ? (
                  <>
                    <Loader2 className="size-3 animate-spin" /> Preparing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3" /> Use Template
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
