"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, GraduationCap, Code, 
  Layers, Award, Globe, Plus, Trash2, ChevronDown, ChevronUp 
} from "lucide-react";

type SectionType = "basics" | "work" | "education" | "skills" | "projects" | "certifications" | "socialLinks";

export default function ResumeFormEditor() {
  const { parsedData, updateParsedData } = useResumeStore();
  const [activeSection, setActiveSection] = useState<SectionType>("basics");

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

  return (
    <div className="flex flex-col p-6 gap-4 text-slate-200">
      
      {/* SECTION: BASICS */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
        <button
          onClick={() => toggleSection("basics")}
          className="w-full flex items-center justify-between p-4 font-mono font-bold text-sm text-white uppercase tracking-wider hover:bg-slate-900/50 transition-all border-b border-slate-800/40"
        >
          <span className="flex items-center gap-2">
            <User className="size-4 text-white" /> Basics Info
          </span>
          {activeSection === "basics" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "basics" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      value={parsedData.basics.name || ""}
                      onChange={(e) => handleBasicsChange("name", e.target.value)}
                      placeholder="John Doe"
                      className="bg-slate-950 border border-slate-800 text-sm text-slate-100 rounded-lg p-2.5 outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Job Title</label>
                    <input
                      type="text"
                      value={parsedData.basics.label || ""}
                      onChange={(e) => handleBasicsChange("label", e.target.value)}
                      placeholder="Senior React Engineer"
                      className="bg-slate-950 border border-slate-800 text-sm text-slate-100 rounded-lg p-2.5 outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      value={parsedData.basics.email || ""}
                      onChange={(e) => handleBasicsChange("email", e.target.value)}
                      placeholder="johndoe@email.com"
                      className="bg-slate-950 border border-slate-800 text-sm text-slate-100 rounded-lg p-2.5 outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="text"
                      value={parsedData.basics.phone || ""}
                      onChange={(e) => handleBasicsChange("phone", e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="bg-slate-950 border border-slate-800 text-sm text-slate-100 rounded-lg p-2.5 outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Summary / Objective</label>
                  <textarea
                    value={parsedData.basics.summary || ""}
                    onChange={(e) => handleBasicsChange("summary", e.target.value)}
                    placeholder="Brief professional intro..."
                    rows={4}
                    className="bg-slate-950 border border-slate-800 text-sm text-slate-100 rounded-lg p-2.5 outline-none focus:border-white/40 resize-none font-mono"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: EXPERIENCE */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
        <button
          onClick={() => toggleSection("work")}
          className="w-full flex items-center justify-between p-4 font-mono font-bold text-sm text-white uppercase tracking-wider hover:bg-slate-900/50 transition-all border-b border-slate-800/40"
        >
          <span className="flex items-center gap-2">
            <Briefcase className="size-4 text-white" /> Work Experience ({parsedData.work.length})
          </span>
          {activeSection === "work" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "work" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                {parsedData.work.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeWork(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Company</label>
                        <input
                          type="text"
                          value={item.company || ""}
                          onChange={(e) => handleWorkChange(idx, "company", e.target.value)}
                          placeholder="Acme Corp"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Position</label>
                        <input
                          type="text"
                          value={item.position || ""}
                          onChange={(e) => handleWorkChange(idx, "position", e.target.value)}
                          placeholder="Software Engineer"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Start Date</label>
                        <input
                          type="text"
                          value={item.startDate || ""}
                          onChange={(e) => handleWorkChange(idx, "startDate", e.target.value)}
                          placeholder="Jan 2024"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">End Date</label>
                        <input
                          type="text"
                          value={item.endDate || ""}
                          onChange={(e) => handleWorkChange(idx, "endDate", e.target.value)}
                          placeholder="Present"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-between">
                        Key Responsibilities & Highlights
                        <button
                          onClick={() => addHighlight(idx)}
                          className="flex items-center gap-1 text-[8px] bg-slate-900 border border-slate-800 text-white px-2 py-0.5 rounded uppercase hover:bg-slate-850"
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
                              className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded p-2 outline-none focus:border-white/40 font-mono"
                            />
                            <button
                              onClick={() => removeHighlight(idx, hIdx)}
                              className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
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
                  className="w-full py-2.5 rounded-lg border border-dashed border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold uppercase text-white hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" /> Add Experience Position
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: EDUCATION */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
        <button
          onClick={() => toggleSection("education")}
          className="w-full flex items-center justify-between p-4 font-mono font-bold text-sm text-white uppercase tracking-wider hover:bg-slate-900/50 transition-all border-b border-slate-800/40"
        >
          <span className="flex items-center gap-2">
            <GraduationCap className="size-4 text-white" /> Education ({parsedData.education.length})
          </span>
          {activeSection === "education" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "education" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                {parsedData.education.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeEducation(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Institution</label>
                        <input
                          type="text"
                          value={item.institution || ""}
                          onChange={(e) => handleEducationChange(idx, "institution", e.target.value)}
                          placeholder="Stanford University"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Study Degree</label>
                        <input
                          type="text"
                          value={item.studyType || ""}
                          onChange={(e) => handleEducationChange(idx, "studyType", e.target.value)}
                          placeholder="Bachelor of Science"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Field of Study</label>
                        <input
                          type="text"
                          value={item.area || ""}
                          onChange={(e) => handleEducationChange(idx, "area", e.target.value)}
                          placeholder="Computer Science"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Graduation Date</label>
                        <input
                          type="text"
                          value={item.endDate || ""}
                          onChange={(e) => handleEducationChange(idx, "endDate", e.target.value)}
                          placeholder="June 2023"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addEducation}
                  className="w-full py-2.5 rounded-lg border border-dashed border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold uppercase text-white hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" /> Add Education Section
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: SKILLS */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
        <button
          onClick={() => toggleSection("skills")}
          className="w-full flex items-center justify-between p-4 font-mono font-bold text-sm text-white uppercase tracking-wider hover:bg-slate-900/50 transition-all border-b border-slate-800/40"
        >
          <span className="flex items-center gap-2">
            <Code className="size-4 text-white" /> Skills ({parsedData.skills.length})
          </span>
          {activeSection === "skills" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "skills" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="React, TypeScript, AWS, Node.js..."
                    className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-2.5 outline-none focus:border-white/40 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-200 text-black text-xs font-mono font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1 uppercase shrink-0"
                  >
                    <Plus className="size-3.5" /> Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full font-mono"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: PROJECTS */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
        <button
          onClick={() => toggleSection("projects")}
          className="w-full flex items-center justify-between p-4 font-mono font-bold text-sm text-white uppercase tracking-wider hover:bg-slate-900/50 transition-all border-b border-slate-800/40"
        >
          <span className="flex items-center gap-2">
            <Layers className="size-4 text-white" /> Projects ({parsedData.projects.length})
          </span>
          {activeSection === "projects" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "projects" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                {parsedData.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeProject(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Project Name</label>
                        <input
                          type="text"
                          value={proj.name || ""}
                          onChange={(e) => handleProjectChange(idx, "name", e.target.value)}
                          placeholder="Mockrithm AI Platform"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Project URL</label>
                        <input
                          type="text"
                          value={proj.link || ""}
                          onChange={(e) => handleProjectChange(idx, "link", e.target.value)}
                          placeholder="https://github.com/..."
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={proj.technologies ? proj.technologies.join(", ") : ""}
                        onChange={(e) => handleProjTechChange(idx, e.target.value)}
                        placeholder="Next.js, Tailwind, Firebase"
                        className="bg-slate-900 border border-slate-800 text-xs text-slate-150 rounded p-2 outline-none focus:border-white/40 font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Description</label>
                      <textarea
                        value={proj.description || ""}
                        onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                        placeholder="Brief overview of the project and impact..."
                        rows={3}
                        className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 resize-none font-mono"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addProject}
                  className="w-full py-2.5 rounded-lg border border-dashed border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold uppercase text-white hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" /> Add Project Module
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: CERTIFICATIONS */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
        <button
          onClick={() => toggleSection("certifications")}
          className="w-full flex items-center justify-between p-4 font-mono font-bold text-sm text-white uppercase tracking-wider hover:bg-slate-900/50 transition-all border-b border-slate-800/40"
        >
          <span className="flex items-center gap-2">
            <Award className="size-4 text-white" /> Certifications ({parsedData.certifications.length})
          </span>
          {activeSection === "certifications" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "certifications" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                {parsedData.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeCert(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Name</label>
                        <input
                          type="text"
                          value={cert.name || ""}
                          onChange={(e) => handleCertChange(idx, "name", e.target.value)}
                          placeholder="AWS Solutions Architect"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer || ""}
                          onChange={(e) => handleCertChange(idx, "issuer", e.target.value)}
                          placeholder="Amazon Web Services"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Date</label>
                        <input
                          type="text"
                          value={cert.date || ""}
                          onChange={(e) => handleCertChange(idx, "date", e.target.value)}
                          placeholder="Oct 2024"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addCert}
                  className="w-full py-2.5 rounded-lg border border-dashed border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold uppercase text-white hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" /> Add Certification
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: SOCIAL LINKS */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
        <button
          onClick={() => toggleSection("socialLinks")}
          className="w-full flex items-center justify-between p-4 font-mono font-bold text-sm text-white uppercase tracking-wider hover:bg-slate-900/50 transition-all border-b border-slate-800/40"
        >
          <span className="flex items-center gap-2">
            <Globe className="size-4 text-white" /> Social Links ({parsedData.socialLinks.length})
          </span>
          {activeSection === "socialLinks" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <AnimatePresence initial={false}>
          {activeSection === "socialLinks" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                {parsedData.socialLinks.map((link, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-850 flex flex-col gap-3 relative">
                    <button
                      onClick={() => removeSocial(idx)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Platform</label>
                        <input
                          type="text"
                          value={link.platform || ""}
                          onChange={(e) => handleSocialChange(idx, "platform", e.target.value)}
                          placeholder="GitHub or LinkedIn"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Link URL</label>
                        <input
                          type="text"
                          value={link.url || ""}
                          onChange={(e) => handleSocialChange(idx, "url", e.target.value)}
                          placeholder="https://github.com/username"
                          className="bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded p-2 outline-none focus:border-white/40 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSocial}
                  className="w-full py-2.5 rounded-lg border border-dashed border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold uppercase text-white hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2"
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
