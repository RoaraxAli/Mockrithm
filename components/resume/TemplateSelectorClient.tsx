"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createResumeFromTemplate } from "@/lib/actions/resume.action";
import { Layout, Check, Sparkles, Loader2, ArrowRight, User, Briefcase, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getTemplateComponent } from "./templates";
import { ParsedResume } from "@/types/resume";

interface Props {
  userId: string;
}

const SAMPLE_PROFILES: Record<string, ParsedResume> = {
  minimal: {
    basics: {
      name: "Alex Johnson",
      label: "Software Engineer",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 019-2834",
      summary: "Full-stack developer with 5+ years of experience building scalable web applications. Passionate about performance, clean code, and UI/UX design."
    },
    work: [
      { company: "TechCorp", position: "Senior Engineer", startDate: "2021", endDate: "Present", highlights: ["Led development of React-based cloud portal, improving load times by 40%.", "Mentored 4 junior engineers and introduced automated testing pipelines."] }
    ],
    education: [
      { institution: "State University", studyType: "B.Sc.", area: "Computer Science", endDate: "2018" }
    ],
    skills: ["React", "Node.js", "TypeScript", "Next.js", "AWS"],
    projects: [
      { name: "Analytics Dashboard", description: "Built real-time telemetry dashboard using Tailwind and React.", technologies: ["React", "Tailwind"] }
    ],
    certifications: [
      { name: "AWS Solutions Architect", issuer: "Amazon", date: "2023" }
    ],
    socialLinks: [
      { platform: "GitHub", url: "github.com/alexj" }
    ]
  },
  corporate: {
    basics: {
      name: "Maria Lopez",
      label: "Financial Analyst",
      email: "maria.lopez@email.com",
      phone: "+1 (555) 012-7729",
      summary: "Analytical finance professional with 6 years of experience in corporate banking, financial modeling, and risk assessment."
    },
    work: [
      { company: "Global Bank", position: "Senior Analyst", startDate: "2020", endDate: "Present", highlights: ["Managed $50M portfolio of corporate clients, optimizing yield by 8%.", "Created dynamic forecasting models to support executive budgeting decisions."] }
    ],
    education: [
      { institution: "Harvard Business School", studyType: "M.B.A.", area: "Finance", endDate: "2017" }
    ],
    skills: ["Excel", "Financial Modeling", "SQL", "PowerBI", "Risk Management"],
    projects: [
      { name: "Treasury Sync Project", description: "Redesigned reporting automation using PowerBI.", technologies: ["SQL", "PowerBI"] }
    ],
    certifications: [
      { name: "Chartered Financial Analyst (CFA)", issuer: "CFA Institute", date: "2021" }
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "linkedin.com/in/marialopez" }
    ]
  },
  cyber: {
    basics: {
      name: "Samir Patel",
      label: "Security Engineer",
      email: "samir.patel@email.com",
      phone: "+1 (555) 015-8839",
      summary: "Cybersecurity specialist focused on application penetration testing, cloud security compliance, and network monitoring."
    },
    work: [
      { company: "Neon Labs", position: "Lead Security Analyst", startDate: "2022", endDate: "Present", highlights: ["Discovered and patched 12 critical vulnerabilities in the core API infrastructure.", "Conducted audit of AWS IAM structures, reducing access overlap by 60%."] }
    ],
    education: [
      { institution: "MIT", studyType: "B.Tech", area: "Computer Engineering", endDate: "2020" }
    ],
    skills: ["Pentesting", "Next.js", "IAM Auditing", "Docker", "Wireshark"],
    projects: [
      { name: "Vulnerability Scanner", description: "Created an automated API penetration scanning tool.", technologies: ["Python", "Docker"] }
    ],
    certifications: [
      { name: "Certified Ethical Hacker (CEH)", issuer: "EC-Council", date: "2021" }
    ],
    socialLinks: [
      { platform: "GitHub", url: "github.com/samirp" }
    ]
  },
  modern: {
    basics: {
      name: "Lena Chen",
      label: "Creative Designer",
      email: "lena.chen@email.com",
      phone: "+1 (555) 011-9230",
      summary: "UX/UI designer crafting elegant digital experiences and distinct corporate branding guidelines."
    },
    work: [
      { company: "CreativeWorks", position: "Senior Designer", startDate: "2021", endDate: "Present", highlights: ["Rebranded consumer web app, boosting conversion rates by 22%.", "Designed responsive layout templates used by 10k+ clients."] }
    ],
    education: [
      { institution: "Art Institute", studyType: "B.A.", area: "Visual Communication", endDate: "2018" }
    ],
    skills: ["Figma", "Adobe CC", "UI/UX", "Brand Strategy", "Illustration"],
    projects: [
      { name: "Design System Build", description: "Created UI kit in Figma to speed up developer handoffs.", technologies: ["Figma"] }
    ],
    certifications: [
      { name: "UX Design Certificate", issuer: "Google", date: "2020" }
    ],
    socialLinks: [
      { platform: "Dribbble", url: "dribbble.com/lenachen" }
    ]
  },
  creative: {
    basics: {
      name: "Jenna Ruiz",
      label: "Content Strategist",
      email: "jenna.ruiz@email.com",
      phone: "+1 (555) 013-6450",
      summary: "Digital copywriter and content strategist specialized in building brand narrative across social channels."
    },
    work: [
      { company: "MediaSpark", position: "Lead Content Writer", startDate: "2019", endDate: "Present", highlights: ["Grew newsletter subscribers from 2k to 50k inside 12 months.", "Created SEO-focused article database driving 200k+ organic views monthly."] }
    ],
    education: [
      { institution: "Columbia University", studyType: "B.Sc.", area: "Journalism", endDate: "2016" }
    ],
    skills: ["SEO", "Copywriting", "WordPress", "Campaign Analytics"],
    projects: [
      { name: "Viral Growth Hack", description: "Engineered campaign generating 10M social media impressions.", technologies: ["Analytics"] }
    ],
    certifications: [
      { name: "SEO Expert certification", issuer: "HubSpot", date: "2020" }
    ],
    socialLinks: [
      { platform: "Twitter", url: "twitter.com/jennaruiz" }
    ]
  },
  executive: {
    basics: {
      name: "Arthur Pendelton",
      label: "Operations Director",
      email: "arthur.p@email.com",
      phone: "+1 (555) 017-9092",
      summary: "Executive with 12+ years of management driving manufacturing process scaling, quality control, and regional scaling."
    },
    work: [
      { company: "Apex Industrial", position: "Director of Operations", startDate: "2020", endDate: "Present", highlights: ["Oversaw 3 regional hubs, streamlining logistics to save $2M annually.", "Implemented Lean Six Sigma framework across factories, reducing waste by 25%."] }
    ],
    education: [
      { institution: "Stanford Graduate School", studyType: "M.S.", area: "Management", endDate: "2012" }
    ],
    skills: ["Operations", "Budgeting", "Lean Six Sigma", "Supply Chain", "ERP"],
    projects: [
      { name: "Hub Consolidation", description: "Managed merge of two distribution facilities in Texas.", technologies: ["Six Sigma", "ERP"] }
    ],
    certifications: [
      { name: "Six Sigma Black Belt", issuer: "ASQ", date: "2018" }
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "linkedin.com/in/arthurpendelton" }
    ]
  },
  academic: {
    basics: {
      name: "Dr. Nancy Adams",
      label: "Biology Professor",
      email: "n.adams@university.edu",
      phone: "+1 (555) 019-3382",
      summary: "Academic researcher specializing in genetics, DNA sequencing pathways, and biochemistry lab guidance."
    },
    work: [
      { company: "State University", position: "Associate Professor", startDate: "2019", endDate: "Present", highlights: ["Secured $500k research grant for genetic pathway modeling.", "Published 8 peer-reviewed articles in core biochemical journals."] }
    ],
    education: [
      { institution: "UCLA", studyType: "Ph.D.", area: "Molecular Biology", endDate: "2016" }
    ],
    skills: ["Genetics", "Grant Writing", "Bioinformatics", "Data Analysis", "Lecturing"],
    projects: [
      { name: "Gene Map Pipeline", description: "Created open-source sequencing parser for research labs.", technologies: ["R", "Python"] }
    ],
    certifications: [
      { name: "Lab Safety Director Certification", issuer: "OSHA", date: "2021" }
    ],
    socialLinks: [
      { platform: "ResearchGate", url: "researchgate.net/profile/nancy_adams" }
    ]
  },
  elegant: {
    basics: {
      name: "Victoria Sterling",
      label: "Wealth Management Consultant",
      email: "v.sterling@consulting.com",
      phone: "+1 (555) 012-4422",
      summary: "Bespoke wealth consultant guiding high-net-worth individuals in portfolio diversity, estate planning, and tax strategy."
    },
    work: [
      { company: "Sterling Assets", position: "Senior Partner", startDate: "2018", endDate: "Present", highlights: ["Advised 80+ active clients on capital allocations, maintaining 99% client retention.", "Reduced average client tax liabilities by 14% via structured asset diversification."] }
    ],
    education: [
      { institution: "Penn State University", studyType: "B.Sc.", area: "Economics", endDate: "2015" }
    ],
    skills: ["Tax Strategy", "Capital Allocation", "Estate Planning", "Client Relations"],
    projects: [
      { name: "Estate Trust Redesign", description: "Custom trust structures for high-net-worth generational planning.", technologies: ["Finance"] }
    ],
    certifications: [
      { name: "Certified Financial Planner (CFP)", issuer: "CFP Board", date: "2017" }
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "linkedin.com/in/vsterling" }
    ]
  },
  tech: {
    basics: {
      name: "Marcus Chen",
      label: "DevOps Engineer",
      email: "marcus.chen@tech.io",
      phone: "+1 (555) 014-9988",
      summary: "Infrastructure engineer specialized in Kubernetes orchestration, CI/CD automation, and cloud cost reduction."
    },
    work: [
      { company: "CloudScale Inc", position: "Senior DevOps Engineer", startDate: "2021", endDate: "Present", highlights: ["Automated cloud resource provisioning using Terraform, saving 30% on AWS costs.", "Migrated legacy monolith to Docker containers orchestrated by Kubernetes."] }
    ],
    education: [
      { institution: "University of Washington", studyType: "B.S.", area: "Informatics", endDate: "2019" }
    ],
    skills: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "AWS"],
    projects: [
      { name: "GitOps Infrastructure", description: "Automated continuous delivery deployments using ArgoCD.", technologies: ["Kubernetes", "ArgoCD"] }
    ],
    certifications: [
      { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", date: "2022" }
    ],
    socialLinks: [
      { platform: "GitHub", url: "github.com/marcusdevops" }
    ]
  },
  compact: {
    basics: {
      name: "Diana Klein",
      label: "Elementary School Teacher",
      email: "diana.klein@school.org",
      phone: "+1 (555) 016-5511",
      summary: "Passionate elementary educator with 7 years of classroom management experience and child development instruction."
    },
    work: [
      { company: "The Hill School", position: "Lead Kindergarten Teacher", startDate: "2018", endDate: "Present", highlights: ["Designed interactive science curriculum adopted across 4 district schools.", "Organized quarterly parent conferences to review children developmental scores."] }
    ],
    education: [
      { institution: "Boston College", studyType: "B.Ed.", area: "Elementary Education", endDate: "2016" }
    ],
    skills: ["Classroom Management", "Curriculum Design", "Early Literacy", "Child Psychology"],
    projects: [
      { name: "Reading Circle Initiative", description: "Improved class average reading levels by 35% through parent collaboration.", technologies: ["Education"] }
    ],
    certifications: [
      { name: "State Educator License", issuer: "Board of Education", date: "2016" }
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "linkedin.com/in/dianaklein" }
    ]
  }
};

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimalist",
    color: "from-white/10 to-white/5",
    tags: ["ATS Friendly", "Clean", "Universal"],
    description: "Clean, distraction-free layout highlighting experience and skills.",
    audience: "Best for tech professionals and traditional industries."
  },
  {
    id: "corporate",
    name: "Classic Corporate",
    color: "from-white/10 to-white/5",
    tags: ["Professional", "Structured", "Traditional"],
    description: "Structured, formal style with traditional layout rules.",
    audience: "Best for banking, legal, and executive applications."
  },
  {
    id: "cyber",
    name: "Tech & Cyberpunk",
    color: "from-white/10 to-white/5",
    tags: ["Tech", "Modern", "Creative"],
    description: "High-contrast modern look with subtle digital grid highlights.",
    audience: "Best for creative tech roles and startup environments."
  },
  {
    id: "modern",
    name: "Modern Sidebar",
    color: "from-white/10 to-white/5",
    tags: ["Two-Column", "Designer", "Sleek"],
    description: "Two-column design with a dark left sidebar for credentials.",
    audience: "Great for designers, marketers, and developers."
  },
  {
    id: "creative",
    name: "Vibrant Creative",
    color: "from-white/10 to-white/5",
    tags: ["Artistic", "Bold", "Impactful"],
    description: "Dynamic top color banner with offset multi-column highlights.",
    audience: "Best for copywriters, artists, and creators."
  },
  {
    id: "executive",
    name: "Executive Leader",
    color: "from-white/10 to-white/5",
    tags: ["Executive", "Formal", "Leadership"],
    description: "Serif-based elegant style designed for leadership profiles.",
    audience: "Best for directors, VPs, and senior executives."
  },
  {
    id: "academic",
    name: "Academic CV",
    color: "from-white/10 to-white/5",
    tags: ["Academic", "Extended", "Detailed"],
    description: "Detail-heavy layout optimized for lists and publications.",
    audience: "Best for researchers, educators, and PhD candidates."
  },
  {
    id: "elegant",
    name: "Elegant Serif",
    color: "from-white/10 to-white/5",
    tags: ["Warm", "Creative", "Sophisticated"],
    description: "Classy warm layout with beautiful font borders.",
    audience: "Great for luxury brands, consulting, and finance."
  },
  {
    id: "tech",
    name: "Developer Tech",
    color: "from-white/10 to-white/5",
    tags: ["Developer", "Markdown", "Compact"],
    description: "Monospaced developer code layout with bold tech tags.",
    audience: "Designed specifically for programmers and devops engineers."
  },
  {
    id: "compact",
    name: "Compact Grid",
    color: "from-white/10 to-white/5",
    tags: ["High Density", "One-Page", "Structured"],
    description: "Dense double-column layout designed to fit maximum details in 1 page.",
    audience: "Best for professionals with extensive project portfolios."
  }
];

export default function TemplateSelectorClient({ userId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get("from") === "onboarding";
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

            {/* Mini resume preview (White paper look like resume.io!) */}
            <div className="w-full h-[260px] overflow-hidden border border-slate-800/80 rounded-xl bg-slate-950/80 relative flex justify-center items-start mb-4 shadow-inner">
              <div 
                className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none select-none shadow-2xl rounded bg-white text-slate-800"
                style={{ 
                  width: "800px", 
                  transform: "scale(0.26)", 
                  transformOrigin: "top center" 
                }}
              >
                {(() => {
                  const TemplateComponent = getTemplateComponent(tpl.id);
                  const profileData = SAMPLE_PROFILES[tpl.id] || SAMPLE_PROFILES.minimal;
                  return <TemplateComponent data={profileData} />;
                })()}
              </div>
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
