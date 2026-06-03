"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, Sparkles, CheckCircle2, XCircle, AlertCircle, 
  ArrowRight, Copy, Check, Loader2, RefreshCw, Briefcase, Code, Award,
  Cpu, Terminal, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BulletSuggestion {
  original: string;
  suggested: string;
  explanation: string;
}

interface AnalysisResult {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletPointSuggestions: BulletSuggestion[];
}

export default function ResumeTailoringEngine({ 
  userId, 
  userName 
}: { 
  userId: string; 
  userName: string; 
}) {
  const router = useRouter();
  
  // Wizard Steps: 1 = Resume Setup, 2 = Job Description, 3 = Match Diagnosis Report
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [resumeMode, setResumeMode] = useState<"paste" | "build">("paste");

  // Inputs
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  // Scratch Form Builder
  const [builderTitle, setBuilderTitle] = useState("");
  const [builderLevel, setBuilderLevel] = useState("Mid-level");
  const [builderTechStack, setBuilderTechStack] = useState("");
  const [builderSkills, setBuilderSkills] = useState("");
  const [builderExperience, setBuilderExperience] = useState("");
  const [builderProjects, setBuilderProjects] = useState("");

  // Loading and error states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Results
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedIndices, setAppliedIndices] = useState<number[]>([]);

  // Toggle resume modes
  const handleModeChange = (mode: "paste" | "build") => {
    setResumeMode(mode);
    setError(null);
  };

  // Build resume text from builder form
  const getCombinedResumeText = () => {
    if (resumeMode === "paste") {
      return resumeText;
    }
    
    return `
      Professional Title: ${builderTitle}
      Experience Level: ${builderLevel}
      Tech Stack: ${builderTechStack}
      Skills: ${builderSkills}
      
      Professional Experience:
      ${builderExperience}
      
      Key Projects:
      ${builderProjects}
    `.trim();
  };

  // Check validation for Step 1
  const validateStep1 = () => {
    setError(null);
    const content = getCombinedResumeText();
    if (!content.trim()) {
      setError("Please paste your resume narrative or build it using the form.");
      return false;
    }
    return true;
  };

  // Check validation for Step 2
  const validateStep2 = () => {
    setError(null);
    if (!jobDescription.trim()) {
      setError("Please provide the job requirements description to match against.");
      return false;
    }
    return true;
  };

  // Go to Step 2
  const handleGoToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Call the ATS Analysis API & Advance to Step 3
  const handleAnalyze = async () => {
    setError(null);
    if (!validateStep1()) return;
    if (!validateStep2()) return;

    setIsAnalyzing(true);
    const content = getCombinedResumeText();
    
    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: content,
          jobDescription: jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume. Please try again.");
      }

      const data = await response.json();
      setAnalysis(data);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Call the Interview Generation API
  const handleStartInterview = async () => {
    if (!analysis) return;
    
    setIsGeneratingInterview(true);
    setError(null);
    
    const content = getCombinedResumeText();
    
    // Attempt to extract role and level from details
    let role = "Software Engineer";
    let level = "Mid-level";
    let techstack = "React, Node, TypeScript";
    let type = "Mixed";

    if (resumeMode === "build") {
      role = builderTitle || "Software Engineer";
      level = builderLevel;
      techstack = builderTechStack || builderSkills || "React, Node, TypeScript";
    } else {
      role = builderTitle || "Software Engineer";
      level = builderLevel;
      techstack = builderTechStack || "React, Node, TypeScript";
    }

    try {
      const response = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          role,
          level,
          techstack,
          amount: 5,
          userid: userId,
          resumeText: content,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate interview questions. Please try again.");
      }

      const data = await response.json();
      if (data.success && data.interviewId) {
        router.push(`/interview/${data.interviewId}`);
      } else {
        throw new Error(data.error || "Failed to start interview");
      }
    } catch (err: any) {
      setError(err.message || "Failed to seed interview.");
      setIsGeneratingInterview(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const applyBulletSuggestion = (suggested: string, index: number) => {
    if (resumeMode === "build") {
      setBuilderExperience((prev) => prev + "\n- " + suggested);
    } else {
      setResumeText((prev) => prev + "\n- " + suggested);
    }
    setAppliedIndices((prev) => [...prev, index]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 font-mona-sans">
      
      {/* High-Tech Cockpit Steppers Guide Header */}
      <div className="w-full backdrop-blur-md bg-slate-950/40 border border-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
        
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold font-mono tracking-wide text-gray-300 flex items-center gap-2">
            <Cpu className="size-5 text-gray-300 animate-pulse" />
            ATS CONTEXT ENGINE
          </h2>
        </div>

        {/* The 3 Stepper Dials */}
        <div className="flex items-center gap-2.5 sm:gap-6 font-mono text-[10px] sm:text-xs">
          {/* Step 1 */}
          <div 
            onClick={() => currentStep > 1 && setCurrentStep(1)}
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              currentStep === 1 ? "text-white font-bold" : currentStep > 1 ? "text-white cursor-pointer hover:text-gray-300" : "text-slate-600"
            )}
          >
            <span className={cn(
              "size-6 rounded-full flex items-center justify-center border font-bold text-[9px] transition-all duration-300",
              currentStep === 1 
                ? "border-gray-500/50 bg-gray-950/40 text-gray-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]" 
                : currentStep > 1 ? "border-gray-500/50 bg-gray-950/30 text-gray-300" : "border-slate-800 text-slate-600"
            )}>
              {currentStep > 1 ? "✓" : "01"}
            </span>
            <span className="hidden sm:inline">SETUP</span>
          </div>

          <div className="w-6 h-[1px] bg-slate-800" />

          {/* Step 2 */}
          <div 
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              currentStep === 2 ? "text-cyan-400 font-bold" : currentStep > 2 ? "text-emerald-400 cursor-pointer hover:text-emerald-300" : "text-slate-600"
            )}
          >
            <span className={cn(
              "size-6 rounded-full flex items-center justify-center border font-bold text-[9px] transition-all duration-300",
              currentStep === 2 
                ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]" 
                : currentStep > 2 ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-400" : "border-slate-800 text-slate-600"
            )}>
              {currentStep > 2 ? "✓" : "02"}
            </span>
            <span className="hidden sm:inline">TARGETS</span>
          </div>

          <div className="w-6 h-[1px] bg-slate-800" />

          {/* Step 3 */}
          <div 
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              currentStep === 3 ? "text-cyan-400 font-bold" : "text-slate-600"
            )}
          >
            <span className={cn(
              "size-6 rounded-full flex items-center justify-center border font-bold text-[9px] transition-all duration-300",
              currentStep === 3 
                ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]" 
                : "border-slate-800 text-slate-600"
            )}>
              03
            </span>
            <span className="hidden sm:inline">MATCH</span>
          </div>
        </div>
      </div>

      {/* Error Output Screen */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-rose-950/30 border border-rose-500/30 text-rose-400 rounded-xl p-4 text-xs flex gap-3 items-start font-mono shadow-lg"
          >
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">
              <strong className="uppercase">VALIDATION_ERROR // </strong> {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Step Panel rendering */}
      <div className="w-full">
        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Left Resume Entry Portal */}
            <div className="md:col-span-8 p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col gap-5 shadow-[0_0_50px_#000] relative overflow-hidden group">
              {/* Corner Indicators */}
              <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-slate-700" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-slate-700" />
              <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-slate-700" />
              <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-slate-700" />
              
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-mono font-bold text-slate-300 tracking-[0.2em] uppercase flex items-center gap-2">
                  <FileText className="size-4.5 text-gray-300" />
                  RESUME DATA SOURCE
                </h3>
                
                {/* Custom Toggle Mode */}
                <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-900 text-[9px] font-mono font-bold uppercase tracking-wider shadow-inner">
                  <button
                    onClick={() => handleModeChange("paste")}
                    className={cn(
                      "px-3 py-1.5 rounded cursor-pointer transition-all",
                      resumeMode === "paste" ? "bg-white text-gray-600 font-extrabold shadow" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Quick Paste
                  </button>
                  <button
                    onClick={() => handleModeChange("build")}
                    className={cn(
                      "px-3 py-1.5 rounded cursor-pointer transition-all",
                      resumeMode === "build" ? "bg-cyan-500 text-slate-950 font-extrabold shadow" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Form Builder
                  </button>
                </div>
              </div>

              {resumeMode === "paste" ? (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    Paste the raw details of your current curriculum vitae (work history, competencies, metrics) below to load the context.
                  </p>
                  
                  <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                    <label className="text-slate-500 uppercase tracking-widest">// TARGET_TITLE</label>
                    <input
                      type="text"
                      value={builderTitle}
                      onChange={(e) => setBuilderTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Developer"
                      className="bg-slate-950/80 text-white text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none placeholder:text-slate-700 transition-all font-semibold"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                      <label className="text-slate-500 uppercase tracking-widest">// TARGET_LEVEL</label>
                      <select
                        value={builderLevel}
                        onChange={(e) => setBuilderLevel(e.target.value)}
                        className="bg-slate-950 text-white text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none cursor-pointer hover:bg-slate-900 transition-all font-bold"
                      >
                        <option value="Intern">Intern</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid-level">Mid-level</option>
                        <option value="Senior">Senior</option>
                        <option value="Lead / Manager">Lead / Manager</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                      <label className="text-slate-500 uppercase tracking-widest">// TECH_STACK</label>
                      <input
                        type="text"
                        value={builderTechStack}
                        onChange={(e) => setBuilderTechStack(e.target.value)}
                        placeholder="e.g. Next.js, React, Node.js"
                        className="bg-slate-950/80 text-white text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none placeholder:text-slate-700 transition-all font-semibold"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                    <label className="text-slate-500 uppercase tracking-widest">// RAW_CURRICULUM_VITAE_PASTE</label>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste narrative of experiences, achievements, and core metrics here..."
                      rows={12}
                      className="bg-slate-950/80 text-cyan-100 text-xs rounded-lg p-3.5 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none resize-none placeholder:text-slate-700 leading-relaxed font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                      <label className="text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Briefcase className="size-3.5 text-cyan-400" /> Target Job Title
                      </label>
                      <input
                        type="text"
                        value={builderTitle}
                        onChange={(e) => setBuilderTitle(e.target.value)}
                        placeholder="e.g. React Lead"
                        className="bg-slate-950/80 text-white text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none placeholder:text-slate-700 transition-all font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                      <label className="text-slate-500 uppercase tracking-widest">Experience Level</label>
                      <select
                        value={builderLevel}
                        onChange={(e) => setBuilderLevel(e.target.value)}
                        className="bg-slate-950 text-white text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none cursor-pointer hover:bg-slate-900 transition-all font-bold"
                      >
                        <option value="Intern">Intern</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid-level">Mid-level</option>
                        <option value="Senior">Senior</option>
                        <option value="Lead / Manager">Lead / Manager</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                      <label className="text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Code className="size-3.5 text-cyan-400" /> Tech Stack
                      </label>
                      <input
                        type="text"
                        value={builderTechStack}
                        onChange={(e) => setBuilderTechStack(e.target.value)}
                        placeholder="e.g. React, Next.js, Go"
                        className="bg-slate-950/80 text-white text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none placeholder:text-slate-700 transition-all font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                      <label className="text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Award className="size-3.5 text-cyan-400" /> Core Competencies
                      </label>
                      <input
                        type="text"
                        value={builderSkills}
                        onChange={(e) => setBuilderSkills(e.target.value)}
                        placeholder="e.g. AWS Cloud, API Architectures"
                        className="bg-slate-950/80 text-white text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none placeholder:text-slate-700 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                    <label className="text-slate-500 uppercase tracking-widest">Professional History (Bullet Points)</label>
                    <textarea
                      value={builderExperience}
                      onChange={(e) => setBuilderExperience(e.target.value)}
                      placeholder="Company | Role | Timeline&#10;- Designed responsive dashboards leading to 35% performance speeds.&#10;- Refactored high-traffic APIs..."
                      rows={6}
                      className="bg-slate-950/80 text-white text-xs rounded-lg p-3.5 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none resize-none placeholder:text-slate-700 leading-relaxed font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                    <label className="text-slate-500 uppercase tracking-widest">Key Projects</label>
                    <textarea
                      value={builderProjects}
                      onChange={(e) => setBuilderProjects(e.target.value)}
                      placeholder="Project Title&#10;- Designed high-performance server architectures.&#10;- Integrated payment gateways..."
                      rows={4}
                      className="bg-slate-950/80 text-white text-xs rounded-lg p-3.5 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none resize-none placeholder:text-slate-700 leading-relaxed font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Guide Panel */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="p-6 backdrop-blur-xl bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-4 shadow-xl">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Step 1 Instructions</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Provide your professional profile details. Pasting or compiling active experience metrics allows the ATS context engine to measure keyword overlaps.
                </p>
                <div className="border-t border-slate-900 pt-3 flex flex-col gap-2.5 text-[11px] font-mono text-slate-500 text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>Paste complete bullets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>Define specific level</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGoToStep2}
                className="w-full h-12 rounded-lg bg-white text-slate-950 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider"
              >
                PROCEED TO TARGETS <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2 Panel: Targets & Analysis */}
        {currentStep === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Target Job Requirements Text Input */}
            <div className="md:col-span-8 p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col gap-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
              <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-slate-700" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-slate-700" />
              <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-slate-700" />
              <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-slate-700" />
              
              <h3 className="text-[11px] font-mono font-bold text-slate-300 tracking-[0.2em] uppercase flex items-center gap-2">
                <Terminal className="size-4.5 text-cyan-400 animate-pulse" />
                JOB DESCRIPTION REQUIREMENTS
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Paste the targets description, qualifications, or exact hiring requirements to execute the matching algorithms.
              </p>
              
              <div className="flex flex-col gap-1.5 font-mono text-[10px] relative">
                <label className="text-slate-500 uppercase tracking-widest">// TARGET_SPEC_METRICS</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste complete hiring requirements, qualifications, and core developer competencies..."
                  rows={14}
                  className="bg-slate-950/80 text-cyan-100 text-xs rounded-lg p-3.5 border border-slate-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 outline-none resize-none placeholder:text-slate-700 leading-relaxed font-mono"
                />
              </div>
            </div>

            {/* Back & Submit Navigation Right Deck */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="p-6 backdrop-blur-xl bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-4 shadow-xl">
                <span className="text-[8px] font-mono tracking-widest text-cyan-400 uppercase">// TARGETS_ALIGNED</span>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Parameters Seeding</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Once requirements are mapped, click the matching analyzer. The engine will run a lexical keyword alignment diagnosis.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={cn(
                    "w-full h-12 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer",
                    isAnalyzing && "opacity-75 cursor-not-allowed"
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-black" />
                      EXTRACTING MATCH...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 text-black animate-pulse" />
                      EXECUTE DIAGNOSTICS
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full h-12 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-900 flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <ArrowLeft className="size-4" /> RE-CALIBRATE RESUME
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Match & Diagnosis Report */}
        {currentStep === 3 && analysis && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8 animate-fadeIn"
          >
            {/* Top Score Dash widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ATS radial match gauge card */}
              <div className="p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center gap-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">ATS MATCH METRIC</h4>
                
                <div className="relative size-36 flex items-center justify-center">
                  <svg className="size-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-slate-900/60"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className={cn(
                        "transition-all duration-1000 ease-out",
                        analysis.atsScore >= 80 ? "stroke-emerald-400" : analysis.atsScore >= 60 ? "stroke-cyan-400" : "stroke-rose-400"
                      )}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * analysis.atsScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-3xl font-mono font-black text-white">
                    {analysis.atsScore}%
                  </div>
                </div>
                
                <div className="flex flex-col gap-2.5 items-center">
                  <span className={cn(
                    "text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border shadow-md",
                    analysis.atsScore >= 80 
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" 
                      : analysis.atsScore >= 60 
                      ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400" 
                      : "bg-rose-950/20 border-rose-500/30 text-rose-400"
                  )}>
                    {analysis.atsScore >= 80 ? "OPTIMAL HARMONY" : analysis.atsScore >= 60 ? "COMPATIBLE PROSPECT" : "SYSTEM DEGRADED"}
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono tracking-wider uppercase font-bold">
                    Target 80% to bypass gatekeeping filters
                  </span>
                </div>
              </div>

              {/* Keyword list badges alignment dashboard */}
              <div className="md:col-span-2 p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
                <h4 className="text-[10px] font-mono font-bold text-slate-300 tracking-widest flex items-center gap-1.5 uppercase border-b border-slate-900 pb-2">
                  <Code className="size-4 text-cyan-400" /> LEXICAL ALIGNMENT ALGORITHMS
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full overflow-y-auto max-h-[170px] pr-2 custom-scrollbar">
                  {/* Matched Keywords */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 shrink-0" />
                      ALIGNED BADGES ({analysis.matchedKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.matchedKeywords.length > 0 ? (
                        analysis.matchedKeywords.map((kw, i) => (
                          <span key={i} className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-950 border border-emerald-500/20 text-emerald-400 rounded">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-600 font-mono">No active matches found.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                      <XCircle className="size-4 shrink-0" />
                      MISSING DEFICITS ({analysis.missingKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingKeywords.length > 0 ? (
                        analysis.missingKeywords.map((kw, i) => (
                          <span key={i} className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-950 border border-rose-500/20 text-rose-400 rounded">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-mono">Perfect alignment! Deficits zero.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Glowing comparative before/after dockets list */}
            <div className="flex flex-col gap-5 mt-2">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <h3 className="text-[10px] font-mono font-bold text-slate-300 tracking-[0.2em] uppercase flex items-center gap-2">
                  <Sparkles className="size-4 text-cyan-400 animate-pulse" />
                  BEFORE & AFTER HOLOGRAPHIC REPHRASING DOCKETS
                </h3>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                  STAR FRAMEWORK QUANTIFICATION
                </span>
              </div>

              {/* comparative dockets mapping */}
              <div className="flex flex-col gap-6">
                {analysis.bulletPointSuggestions.map((suggestion, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 backdrop-blur-xl bg-slate-950/50 border border-slate-900 rounded-2xl relative hover:border-cyan-500/30 transition-all duration-300 overflow-hidden"
                  >
                    {/* Cyber corner markings */}
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-slate-800" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-slate-800" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-slate-800" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-slate-800" />
                    
                    {/* Original Narrative - Neon Rose Border Wrapper */}
                    <div className="lg:col-span-5 flex flex-col gap-2">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        ORIGINAL NARRATIVE
                      </span>
                      <p className="text-xs text-slate-400 bg-slate-950 border border-rose-950/20 p-4 rounded-xl font-semibold leading-relaxed min-h-[64px]">
                        {suggestion.original}
                      </p>
                    </div>
                    
                    {/* Diagnostic Vector Arrow */}
                    <div className="lg:col-span-1 flex items-center justify-center max-lg:rotate-90">
                      <ArrowRight className="size-5 text-slate-700 animate-[pulse_1.5s_infinite]" />
                    </div>
                    
                    {/* Targeted Suggestion - Neon Green/Emerald Border Wrapper */}
                    <div className="lg:col-span-6 flex flex-col gap-4 justify-between">
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          ATS PROTOCOL SUGGESTION
                        </span>
                        <p className="text-xs text-white bg-slate-950 border border-cyan-500/30 p-4 rounded-xl font-bold leading-relaxed shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          {suggestion.suggested}
                        </p>
                        
                        <div className="text-[11px] text-slate-400 leading-relaxed font-semibold bg-slate-950/60 p-3 rounded-lg border border-slate-900 font-mono mt-1">
                          <span className="text-cyan-400 font-bold uppercase tracking-wider mr-1.5">// DIAGNOSTIC_REASON:</span>
                          {suggestion.explanation}
                        </div>
                      </div>

                      {/* Action buttons inside comparative docket */}
                      <div className="flex gap-3 justify-end mt-1.5">
                        <Button
                          variant="secondary"
                          onClick={() => copyToClipboard(suggestion.suggested, idx)}
                          className="text-[9px] font-mono font-bold uppercase tracking-wider px-4 py-2 h-9 flex items-center gap-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="size-3.5 text-emerald-400" /> SECURED
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5 text-cyan-400" /> COPY TEXT
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => applyBulletSuggestion(suggestion.suggested, idx)}
                          disabled={appliedIndices.includes(idx)}
                          className="text-[9px] font-mono font-bold uppercase tracking-wider px-4 py-2 h-9 flex items-center gap-1.5 bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-lg disabled:opacity-50 cursor-pointer"
                        >
                          {appliedIndices.includes(idx) ? (
                            <>
                              <CheckCircle2 className="size-3.5 text-black" /> INJECTED
                            </>
                          ) : (
                            <>
                              <RefreshCw className="size-3.5 text-black animate-spin" style={{ animationDuration: '4s' }} /> INJECT PROTOCOL
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Cockpit Action Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-center backdrop-blur-2xl bg-slate-950/70 p-6 border border-slate-800 rounded-2xl shadow-2xl mt-4 gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
              
              <div className="flex flex-col gap-1 w-full md:max-w-xl">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                  SYNC INTEGRATION PARAMETERS
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-0.5">
                  Seed your tailored impact achievements directly into the AI interviewer session, instructing the evaluator to refer to these specific outcomes.
                </p>
              </div>
              
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="rounded-lg font-mono font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 border border-slate-800 text-slate-200 hover:bg-slate-900 transition-all cursor-pointer"
                >
                  Edit Resume
                </button>
                <button
                  onClick={handleStartInterview}
                  disabled={isGeneratingInterview}
                  className="rounded-lg font-mono font-bold text-[10px] uppercase tracking-wider px-6 py-2.5 bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer shadow-lg border border-cyan-400/40"
                >
                  {isGeneratingInterview ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-black" />
                      GENERATING...
                    </>
                  ) : (
                    <>
                      LAUNCH EVAL COCKPIT <ArrowRight className="size-4 text-black animate-pulse" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
