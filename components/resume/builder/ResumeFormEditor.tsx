"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, GraduationCap, Code, 
  Layers, Award, Globe, Plus, Trash2, ChevronDown, ChevronUp,
  Sparkles, Loader2, CheckCircle2, AlertCircle, Github, Linkedin, MapPin, Link
} from "lucide-react";
import { toast } from "sonner";

type SectionType = "basics" | "work" | "education" | "skills" | "projects" | "certifications" | "socialLinks";

// Standard Greyscale Theme Styles
const ACCORDION_CONTAINER_CLASS = (isActive: boolean) => 
  `border rounded-2xl transition-all duration-300 overflow-hidden ${
    isActive 
      ? "border-white/20 bg-slate-900/40 shadow-[0_0_25px_rgba(255,255,255,0.01)]" 
      : "border-slate-800/80 bg-slate-900/10 hover:border-slate-700/80"
  }`;

const ACCORDION_HEADER_CLASS = "w-full flex items-center justify-between p-4.5 font-mono font-bold text-xs text-white uppercase tracking-wider hover:bg-slate-900/40 transition-all border-b border-slate-850/40 cursor-pointer";

const INPUT_CLASS = "bg-slate-950/70 border border-slate-850 text-sm text-slate-100 rounded-xl p-3 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 font-sans transition-all duration-200 placeholder:text-slate-650 w-full";

const SUB_INPUT_CLASS = "bg-slate-900/60 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 font-sans transition-all duration-200 placeholder:text-slate-600 w-full";

export default function ResumeFormEditor() {
  const { parsedData, updateParsedData } = useResumeStore();
  const [activeSection, setActiveSection] = useState<SectionType>("basics");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const toggleSection = (section: SectionType) => {
    setActiveSection(activeSection === section ? "basics" : section);
  };

  // Basics Handlers
  const handleBasicsChange = (field: string, value: string) => {
    updateParsedData({
      basics: {
        ...parsedData.basics,
        [field]: value
      }
    });
  };

  // AI Summary generation
  const handleImproveSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      toast.info("Generating professional summary...");
      
      const res = await fetch("/api/resume/improve-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: parsedData.basics.label,
          skills: parsedData.skills,
          currentSummary: parsedData.basics.summary
        })
      });

      if (!res.ok) throw new Error("Failed to generate summary");
      const data = await res.json();
      
      if (data.summary) {
        handleBasicsChange("summary", data.summary);
        toast.success("AI summary generated successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Work Handlers
  const handleWorkChange = (index: number, field: string, value: any) => {
    const updatedWork = [...parsedData.work];
    updatedWork[index] = { ...updatedWork[index], [field]: value };
    updateParsedData({ work: updatedWork });
  };

  const addWork = () => {
    updateParsedData({
      work: [...parsedData.work, { company: "", position: "", startDate: "", endDate: "", highlights: [] }]
    });
  };

  const removeWork = (index: number) => {
    updateParsedData({
      work: parsedData.work.filter((_, i) => i !== index)
    });
  };

  const handleHighlightChange = (workIdx: number, hlIdx: number, value: string) => {
    const updatedWork = [...parsedData.work];
    const updatedHighlights = [...updatedWork[workIdx].highlights];
    updatedHighlights[hlIdx] = value;
    updatedWork[workIdx] = { ...updatedWork[workIdx], highlights: updatedHighlights };
    updateParsedData({ work: updatedWork });
  };

  const addHighlight = (workIdx: number) => {
    const updatedWork = [...parsedData.work];
    updatedWork[workIdx] = {
      ...updatedWork[workIdx],
      highlights: [...updatedWork[workIdx].highlights, ""]
    };
    updateParsedData({ work: updatedWork });
  };

  const removeHighlight = (workIdx: number, hlIdx: number) => {
    const updatedWork = [...parsedData.work];
    updatedWork[workIdx] = {
      ...updatedWork[workIdx],
      highlights: updatedWork[workIdx].highlights.filter((_, i) => i !== hlIdx)
    };
    updateParsedData({ work: updatedWork });
  };

  // Education Handlers
  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEdu = [...parsedData.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    updateParsedData({ education: updatedEdu });
  };

  const addEducation = () => {
    updateParsedData({
      education: [...parsedData.education, { institution: "", studyType: "", area: "", endDate: "" }]
    });
  };

  const removeEducation = (index: number) => {
    updateParsedData({
      education: parsedData.education.filter((_, i) => i !== index)
    });
  };

  // Skills Handlers
  const [skillInput, setSkillInput] = useState("");
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!parsedData.skills.includes(skillInput.trim())) {
      updateParsedData({ skills: [...parsedData.skills, skillInput.trim()] });
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    updateParsedData({
      skills: parsedData.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Projects Handlers
  const handleProjectChange = (index: number, field: string, value: any) => {
    const updatedProjs = [...parsedData.projects];
    updatedProjs[index] = { ...updatedProjs[index], [field]: value };
    updateParsedData({ projects: updatedProjs });
  };

  const addProject = () => {
    updateParsedData({
      projects: [...parsedData.projects, { name: "", description: "", technologies: [], link: "" }]
    });
  };

  const removeProject = (index: number) => {
    updateParsedData({
      projects: parsedData.projects.filter((_, i) => i !== index)
    });
  };

  const handleProjTechChange = (index: number, value: string) => {
    const techs = value.split(",").map(t => t.trim()).filter(Boolean);
    handleProjectChange(index, "technologies", techs);
  };

  // Certifications Handlers
  const handleCertChange = (index: number, field: string, value: string) => {
    const updatedCerts = [...parsedData.certifications];
    updatedCerts[index] = { ...updatedCerts[index], [field]: value };
    updateParsedData({ certifications: updatedCerts });
  };

  const addCert = () => {
    updateParsedData({
      certifications: [...parsedData.certifications, { name: "", issuer: "", date: "" }]
    });
  };

  const removeCert = (index: number) => {
    updateParsedData({
      certifications: parsedData.certifications.filter((_, i) => i !== index)
    });
  };

  // Social Links Handlers
  const handleSocialChange = (index: number, field: string, value: string) => {
    const updatedSocials = [...parsedData.socialLinks];
    updatedSocials[index] = { ...updatedSocials[index], [field]: value };
    updateParsedData({ socialLinks: updatedSocials });
  };

  const addSocial = () => {
    updateParsedData({
      socialLinks: [...parsedData.socialLinks, { platform: "", url: "" }]
    });
  };

  const removeSocial = (index: number) => {
    updateParsedData({
      socialLinks: parsedData.socialLinks.filter((_, i) => i !== index)
    });
  };

  // Calculate completeness & items
  let score = 0;
  const checklist: { label: string; actionText: string; weight: number; isDone: boolean; onAction?: () => void }[] = [];

  // Basics Name
  if (parsedData.basics?.name) score += 15;
  checklist.push({
    label: "Full Name",
    actionText: "+15 Add Full Name",
    weight: 15,
    isDone: !!parsedData.basics?.name,
    onAction: () => setActiveSection("basics")
  });

  // Basics Job Title
  if (parsedData.basics?.label) score += 15;
  checklist.push({
    label: "Job Title",
    actionText: "+15 Add Job Title",
    weight: 15,
    isDone: !!parsedData.basics?.label,
    onAction: () => setActiveSection("basics")
  });

  // Basics Email
  if (parsedData.basics?.email) score += 15;
  checklist.push({
    label: "Email Address",
    actionText: "+15 Add Email Address",
    weight: 15,
    isDone: !!parsedData.basics?.email,
    onAction: () => setActiveSection("basics")
  });

  // Basics Phone
  if (parsedData.basics?.phone) score += 10;
  checklist.push({
    label: "Phone Number",
    actionText: "+10 Add Phone Number",
    weight: 10,
    isDone: !!parsedData.basics?.phone,
    onAction: () => setActiveSection("basics")
  });

  // Basics Summary
  if (parsedData.basics?.summary) score += 15;
  checklist.push({
    label: "Profile Summary",
    actionText: "Try AI profile summary",
    weight: 15,
    isDone: !!parsedData.basics?.summary,
    onAction: () => {
      setActiveSection("basics");
      handleImproveSummary();
    }
  });

  // Work Experience
  if (parsedData.work && parsedData.work.length > 0) score += 15;
  checklist.push({
    label: "Work Experience",
    actionText: "+15 Add Work Experience",
    weight: 15,
    isDone: !!(parsedData.work && parsedData.work.length > 0),
    onAction: () => setActiveSection("work")
  });

  // Education
  if (parsedData.education && parsedData.education.length > 0) score += 10;
  checklist.push({
    label: "Education",
    actionText: "+10 Add Education",
    weight: 10,
    isDone: !!(parsedData.education && parsedData.education.length > 0),
    onAction: () => setActiveSection("education")
  });

  // Skills
  if (parsedData.skills && parsedData.skills.length > 0) score += 5;
  checklist.push({
    label: "Skills",
    actionText: "+5 Add Skills",
    weight: 5,
    isDone: !!(parsedData.skills && parsedData.skills.length > 0),
    onAction: () => setActiveSection("skills")
  });

  return (
    <div className="flex flex-col p-6 gap-5 text-slate-200">
      
      {/* COMPLETENESS WIDGET */}
      <div className="border border-slate-800/80 rounded-2xl bg-slate-900/30 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/10 border border-white/20 text-white font-bold px-2 py-0.5 rounded text-xs font-mono">
              {score}%
            </span>
            <span className="text-xs font-semibold text-slate-350 font-mono uppercase tracking-wider">
              Resume Completeness
            </span>
          </div>
          {score === 100 && (
            <span className="text-[10px] text-white font-bold font-mono uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Fully complete
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850/50">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500" 
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Action Grid (checklist items that are not done) */}
        {score < 100 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {checklist.filter(item => !item.isDone).map((item, idx) => (
              <button
                key={idx}
                onClick={item.onAction}
                disabled={item.label === "Profile Summary" && isGeneratingSummary}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-50 flex items-center justify-between group cursor-pointer transition-all"
              >
                <span className="flex items-center gap-1.5">
                  {item.label === "Profile Summary" ? (
                    isGeneratingSummary ? (
                      <Loader2 className="size-3.5 text-white animate-spin" />
                    ) : (
                      <Sparkles className="size-3.5 text-white animate-pulse" />
                    )
                  ) : (
                    <Plus className="size-3.5 text-slate-550 group-hover:text-white transition-colors" />
                  )}
                  {item.label === "Profile Summary" && isGeneratingSummary ? "Writing summary..." : item.actionText}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: BASICS */}
      <div className={ACCORDION_CONTAINER_CLASS(activeSection === "basics")}>
        <button
          onClick={() => toggleSection("basics")}
          className={ACCORDION_HEADER_CLASS}
        >
          <span className="flex items-center gap-2">
            <User className={`size-4 ${activeSection === "basics" ? "text-white" : "text-white"}`} /> Basics Info
          </span>
          {activeSection === "basics" ? <ChevronUp className="size-4 text-white" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "basics" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-550 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      value={parsedData.basics.name || ""}
                      onChange={(e) => handleBasicsChange("name", e.target.value)}
                      placeholder="John Doe"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-555 uppercase tracking-widest">Job Title</label>
                    <input
                      type="text"
                      value={parsedData.basics.label || ""}
                      onChange={(e) => handleBasicsChange("label", e.target.value)}
                      placeholder="Senior React Engineer"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-550 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      value={parsedData.basics.email || ""}
                      onChange={(e) => handleBasicsChange("email", e.target.value)}
                      placeholder="johndoe@email.com"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-550 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="text"
                      value={parsedData.basics.phone || ""}
                      onChange={(e) => handleBasicsChange("phone", e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-550 uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="size-3" /> Location
                    </label>
                    <input
                      type="text"
                      value={parsedData.basics.location || ""}
                      onChange={(e) => handleBasicsChange("location", e.target.value)}
                      placeholder="San Francisco, CA"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-550 uppercase tracking-widest flex items-center gap-1">
                      <Globe className="size-3" /> Website
                    </label>
                    <input
                      type="text"
                      value={parsedData.basics.website || ""}
                      onChange={(e) => handleBasicsChange("website", e.target.value)}
                      placeholder="https://yoursite.com"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-550 uppercase tracking-widest flex items-center gap-1">
                      <Github className="size-3" /> GitHub
                    </label>
                    <input
                      type="text"
                      value={parsedData.basics.github || ""}
                      onChange={(e) => handleBasicsChange("github", e.target.value)}
                      placeholder="https://github.com/username"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-550 uppercase tracking-widest flex items-center gap-1">
                      <Linkedin className="size-3" /> LinkedIn
                    </label>
                    <input
                      type="text"
                      value={parsedData.basics.linkedin || ""}
                      onChange={(e) => handleBasicsChange("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-slate-550 uppercase tracking-widest">Summary / Objective</label>
                    <button
                      type="button"
                      onClick={handleImproveSummary}
                      disabled={isGeneratingSummary}
                      className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-white hover:text-slate-350 disabled:opacity-50 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="size-3 animate-spin text-white" /> Writing summary...
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-3 text-white" /> Get help with writing
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={parsedData.basics.summary || ""}
                    onChange={(e) => handleBasicsChange("summary", e.target.value)}
                    placeholder="Brief professional intro..."
                    rows={4}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: EXPERIENCE */}
      <div className={ACCORDION_CONTAINER_CLASS(activeSection === "work")}>
        <button
          onClick={() => toggleSection("work")}
          className={ACCORDION_HEADER_CLASS}
        >
          <span className="flex items-center gap-2">
            <Briefcase className={`size-4 ${activeSection === "work" ? "text-white" : "text-white"}`} /> Work Experience ({parsedData.work.length})
          </span>
          {activeSection === "work" ? <ChevronUp className="size-4 text-white" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "work" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                {parsedData.work.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col gap-3.5 relative">
                    <button
                      onClick={() => removeWork(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Company</label>
                        <input
                          type="text"
                          value={item.company || ""}
                          onChange={(e) => handleWorkChange(idx, "company", e.target.value)}
                          placeholder="Acme Corp"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-555 uppercase tracking-widest">Position</label>
                        <input
                          type="text"
                          value={item.position || ""}
                          onChange={(e) => handleWorkChange(idx, "position", e.target.value)}
                          placeholder="Software Engineer"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Start Date</label>
                        <input
                          type="text"
                          value={item.startDate || ""}
                          onChange={(e) => handleWorkChange(idx, "startDate", e.target.value)}
                          placeholder="Jan 2024"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">End Date</label>
                        <input
                          type="text"
                          value={item.endDate || ""}
                          onChange={(e) => handleWorkChange(idx, "endDate", e.target.value)}
                          placeholder="Present"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest flex items-center justify-between">
                        Key Responsibilities & Highlights
                        <button
                          onClick={() => addHighlight(idx)}
                          className="flex items-center gap-1 text-[8px] bg-slate-900 border border-slate-805 text-white px-2 py-1 rounded-md uppercase hover:bg-slate-850 cursor-pointer transition-colors"
                        >
                          <Plus className="size-3" /> Add Highlight
                        </button>
                      </label>

                      <div className="flex flex-col gap-2">
                        {item.highlights.map((hl, hIdx) => (
                          <div key={hIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={hl}
                              onChange={(e) => handleHighlightChange(idx, hIdx, e.target.value)}
                              placeholder="Led standard API optimization resulting in 40% speed up..."
                              className={SUB_INPUT_CLASS}
                            />
                            <button
                              onClick={() => removeHighlight(idx, hIdx)}
                              className="text-slate-500 hover:text-rose-400 p-1.5 shrink-0 cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addWork}
                  className="w-full py-3 rounded-xl border border-dashed border-slate-800 hover:border-white/30 text-xs font-mono font-bold uppercase text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4" /> Add Experience Position
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: EDUCATION */}
      <div className={ACCORDION_CONTAINER_CLASS(activeSection === "education")}>
        <button
          onClick={() => toggleSection("education")}
          className={ACCORDION_HEADER_CLASS}
        >
          <span className="flex items-center gap-2">
            <GraduationCap className={`size-4 ${activeSection === "education" ? "text-white" : "text-white"}`} /> Education ({parsedData.education.length})
          </span>
          {activeSection === "education" ? <ChevronUp className="size-4 text-white" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "education" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                {parsedData.education.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeEducation(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Institution</label>
                        <input
                          type="text"
                          value={item.institution || ""}
                          onChange={(e) => handleEducationChange(idx, "institution", e.target.value)}
                          placeholder="Stanford University"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-555 uppercase tracking-widest">Degree / Certificate</label>
                        <input
                          type="text"
                          value={item.studyType || ""}
                          onChange={(e) => handleEducationChange(idx, "studyType", e.target.value)}
                          placeholder="Bachelor of Science"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Field of Study</label>
                        <input
                          type="text"
                          value={item.area || ""}
                          onChange={(e) => handleEducationChange(idx, "area", e.target.value)}
                          placeholder="Computer Science"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Graduation Date</label>
                        <input
                          type="text"
                          value={item.endDate || ""}
                          onChange={(e) => handleEducationChange(idx, "endDate", e.target.value)}
                          placeholder="June 2024"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addEducation}
                  className="w-full py-3 rounded-xl border border-dashed border-slate-800 hover:border-white/30 text-xs font-mono font-bold uppercase text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4" /> Add Education
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: SKILLS */}
      <div className={ACCORDION_CONTAINER_CLASS(activeSection === "skills")}>
        <button
          onClick={() => toggleSection("skills")}
          className={ACCORDION_HEADER_CLASS}
        >
          <span className="flex items-center gap-2">
            <Code className={`size-4 ${activeSection === "skills" ? "text-white" : "text-white"}`} /> Skills ({parsedData.skills.length})
          </span>
          {activeSection === "skills" ? <ChevronUp className="size-4 text-white" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "skills" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g. TypeScript, React)"
                    className={SUB_INPUT_CLASS}
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-200 text-black font-bold px-4 py-2 rounded-xl text-xs font-mono uppercase transition-colors shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-slate-900 border border-slate-800 text-slate-300 font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:border-rose-500/40 hover:text-rose-400 transition-all cursor-pointer group"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill}
                      <Trash2 className="size-3 text-slate-500 group-hover:text-rose-455 transition-colors" />
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: PROJECTS */}
      <div className={ACCORDION_CONTAINER_CLASS(activeSection === "projects")}>
        <button
          onClick={() => toggleSection("projects")}
          className={ACCORDION_HEADER_CLASS}
        >
          <span className="flex items-center gap-2">
            <Layers className={`size-4 ${activeSection === "projects" ? "text-white" : "text-white"}`} /> Projects ({parsedData.projects.length})
          </span>
          {activeSection === "projects" ? <ChevronUp className="size-4 text-white" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "projects" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                {parsedData.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col gap-3.5 relative">
                    <button
                      onClick={() => removeProject(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Project Name</label>
                        <input
                          type="text"
                          value={proj.name || ""}
                          onChange={(e) => handleProjectChange(idx, "name", e.target.value)}
                          placeholder="SaaS Analytics Dashboard"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-555 uppercase tracking-widest">Technologies (Comma Separated)</label>
                        <input
                          type="text"
                          value={proj.technologies?.join(", ") || ""}
                          onChange={(e) => handleProjTechChange(idx, e.target.value)}
                          placeholder="Next.js, Tailwind, Prisma"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Project Link URL (Optional)</label>
                      <input
                        type="text"
                        value={proj.link || ""}
                        onChange={(e) => handleProjectChange(idx, "link", e.target.value)}
                        placeholder="https://myproject.com"
                        className={SUB_INPUT_CLASS}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Description</label>
                      <textarea
                        value={proj.description || ""}
                        onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                        placeholder="Built a cloud dashboard supporting real-time chart analysis..."
                        rows={3}
                        className={`${SUB_INPUT_CLASS} resize-none`}
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addProject}
                  className="w-full py-3 rounded-xl border border-dashed border-slate-800 hover:border-white/30 text-xs font-mono font-bold uppercase text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4" /> Add Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: CERTIFICATIONS */}
      <div className={ACCORDION_CONTAINER_CLASS(activeSection === "certifications")}>
        <button
          onClick={() => toggleSection("certifications")}
          className={ACCORDION_HEADER_CLASS}
        >
          <span className="flex items-center gap-2">
            <Award className={`size-4 ${activeSection === "certifications" ? "text-white" : "text-white"}`} /> Certifications ({parsedData.certifications.length})
          </span>
          {activeSection === "certifications" ? <ChevronUp className="size-4 text-white" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "certifications" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                {parsedData.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeCert(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Name</label>
                        <input
                          type="text"
                          value={cert.name || ""}
                          onChange={(e) => handleCertChange(idx, "name", e.target.value)}
                          placeholder="AWS Solutions Architect"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer || ""}
                          onChange={(e) => handleCertChange(idx, "issuer", e.target.value)}
                          placeholder="Amazon Web Services"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Date</label>
                        <input
                          type="text"
                          value={cert.date || ""}
                          onChange={(e) => handleCertChange(idx, "date", e.target.value)}
                          placeholder="Oct 2024"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addCert}
                  className="w-full py-3 rounded-xl border border-dashed border-slate-800 hover:border-white/30 text-xs font-mono font-bold uppercase text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4" /> Add Certification
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: SOCIAL LINKS */}
      <div className={ACCORDION_CONTAINER_CLASS(activeSection === "socialLinks")}>
        <button
          onClick={() => toggleSection("socialLinks")}
          className={ACCORDION_HEADER_CLASS}
        >
          <span className="flex items-center gap-2">
            <Globe className={`size-4 ${activeSection === "socialLinks" ? "text-white" : "text-white"}`} /> Social Links ({parsedData.socialLinks.length})
          </span>
          {activeSection === "socialLinks" ? <ChevronUp className="size-4 text-white" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "socialLinks" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                {parsedData.socialLinks.map((link, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeSocial(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Platform</label>
                        <input
                          type="text"
                          value={link.platform || ""}
                          onChange={(e) => handleSocialChange(idx, "platform", e.target.value)}
                          placeholder="GitHub or LinkedIn"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-550 uppercase tracking-widest">Link URL</label>
                        <input
                          type="text"
                          value={link.url || ""}
                          onChange={(e) => handleSocialChange(idx, "url", e.target.value)}
                          placeholder="https://github.com/username"
                          className={SUB_INPUT_CLASS}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSocial}
                  className="w-full py-3 rounded-xl border border-dashed border-slate-800 hover:border-white/30 text-xs font-mono font-bold uppercase text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="size-4" /> Add Social Link
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
