"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, Sparkles, CheckCircle2, XCircle, AlertCircle, 
  ArrowRight, Copy, Check, Loader2, RefreshCw, Briefcase, Code, Award 
} from "lucide-react";
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
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"input" | "report">("input");
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

  // Call the ATS Analysis API
  const handleAnalyze = async () => {
    setError(null);
    const content = getCombinedResumeText();
    
    if (!content.trim()) {
      setError("Please paste your resume or build it using the form.");
      return;
    }
    
    if (!jobDescription.trim()) {
      setError("Please provide a target job description to match against.");
      return;
    }

    setIsAnalyzing(true);
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
      setActiveTab("report");
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
      // For pasted text, attempt to infer from ATS suggestions or default
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
    // If build mode, append or replace
    if (resumeMode === "build") {
      setBuilderExperience((prev) => prev + "\n- " + suggested);
    } else {
      setResumeText((prev) => prev + "\n- " + suggested);
    }
    setAppliedIndices((prev) => [...prev, index]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fadeIn">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-white/5 items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("input")}
            className={cn(
              "py-3.5 px-4 text-sm font-bold transition-all border-b-2 cursor-pointer",
              activeTab === "input" 
                ? "border-violet-500 text-violet-400" 
                : "border-transparent text-gray-400 hover:text-white"
            )}
          >
            1. Resume & Job Setup
          </button>
          {analysis && (
            <button
              onClick={() => setActiveTab("report")}
              className={cn(
                "py-3.5 px-4 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2",
                activeTab === "report" 
                  ? "border-violet-500 text-violet-400" 
                  : "border-transparent text-gray-400 hover:text-white"
              )}
            >
              2. ATS Tailoring Report
              <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {analysis.atsScore}% Match
              </span>
            </button>
          )}
        </div>
        
        {analysis && activeTab === "input" && (
          <button
            onClick={() => setActiveTab("report")}
            className="text-xs font-bold text-violet-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            View Tailoring Report <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl p-4 text-sm flex gap-3 items-start animate-fadeIn">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Setup Tab */}
      {activeTab === "input" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Resume Source Panel */}
          <div className="flex flex-col gap-5 p-6 glass-card rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-200 flex items-center gap-2">
                <FileText className="size-5 text-violet-400" />
                Resume Portfolio
              </h3>
              <div className="flex bg-zinc-900 p-0.5 rounded-xl border border-white/5 text-xs font-bold">
                <button
                  onClick={() => handleModeChange("paste")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg cursor-pointer transition-all",
                    resumeMode === "paste" ? "bg-white/5 text-violet-400 shadow-sm" : "text-gray-400"
                  )}
                >
                  Quick Paste
                </button>
                <button
                  onClick={() => handleModeChange("build")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg cursor-pointer transition-all",
                    resumeMode === "build" ? "bg-white/5 text-violet-400 shadow-sm" : "text-gray-400"
                  )}
                >
                  Build Custom
                </button>
              </div>
            </div>

            {resumeMode === "paste" ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Paste the full text of your current resume (e.g., from a Word document or PDF) below.
                </p>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Target Role Title</label>
                  <input
                    type="text"
                    value={builderTitle}
                    onChange={(e) => setBuilderTitle(e.target.value)}
                    placeholder="e.g. Frontend Engineer, Product Manager"
                    className="bg-white/[0.02] text-white text-sm rounded-xl p-3 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none placeholder:text-gray-600 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Experience Level</label>
                    <select
                      value={builderLevel}
                      onChange={(e) => setBuilderLevel(e.target.value)}
                      className="bg-white/[0.02] text-white text-sm rounded-xl p-3 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <option value="Intern">Intern</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead / Manager">Lead / Manager</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Tech Stack</label>
                    <input
                      type="text"
                      value={builderTechStack}
                      onChange={(e) => setBuilderTechStack(e.target.value)}
                      placeholder="e.g. React, Next.js, Node.js"
                      className="bg-white/[0.02] text-white text-sm rounded-xl p-3 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none placeholder:text-gray-600 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Resume Content Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste details of your resume here: profile description, experiences, projects, skills..."
                    rows={12}
                    className="bg-white/[0.02] text-indigo-100 text-sm rounded-xl p-3.5 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none resize-none placeholder:text-gray-600 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1">
                      <Briefcase className="size-3.5 text-violet-400" /> Target Role Title
                    </label>
                    <input
                      type="text"
                      value={builderTitle}
                      onChange={(e) => setBuilderTitle(e.target.value)}
                      placeholder="e.g. Senior React Developer"
                      className="bg-white/[0.02] text-white text-sm rounded-xl p-3 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none placeholder:text-gray-600 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Experience Level</label>
                    <select
                      value={builderLevel}
                      onChange={(e) => setBuilderLevel(e.target.value)}
                      className="bg-white/[0.02] text-white text-sm rounded-xl p-3 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none cursor-pointer hover:bg-white/5 transition-colors"
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
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1">
                      <Code className="size-3.5 text-violet-400" /> Tech Stack
                    </label>
                    <input
                      type="text"
                      value={builderTechStack}
                      onChange={(e) => setBuilderTechStack(e.target.value)}
                      placeholder="e.g. Next.js, TypeScript, Tailwind"
                      className="bg-white/[0.02] text-white text-sm rounded-xl p-3 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none placeholder:text-gray-600 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1">
                      <Award className="size-3.5 text-violet-400" /> Core Skills
                    </label>
                    <input
                      type="text"
                      value={builderSkills}
                      onChange={(e) => setBuilderSkills(e.target.value)}
                      placeholder="e.g. System Design, REST APIs, Git"
                      className="bg-white/[0.02] text-white text-sm rounded-xl p-3 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none placeholder:text-gray-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Experience (with Bullet Points)</label>
                  <textarea
                    value={builderExperience}
                    onChange={(e) => setBuilderExperience(e.target.value)}
                    placeholder="Company - Role - Duration&#10;- Built a SaaS dashboard utilizing Next.js, reducing load times by 20%.&#10;- Coordinated a team of 4 engineers to deliver an analytics pipeline..."
                    rows={6}
                    className="bg-white/[0.02] text-white text-sm rounded-xl p-3.5 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none resize-none placeholder:text-gray-600 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Key Projects</label>
                  <textarea
                    value={builderProjects}
                    onChange={(e) => setBuilderProjects(e.target.value)}
                    placeholder="Project 1: E-commerce Platform&#10;- Designed shopping cart API with Express and PostgreSQL.&#10;- Optimized queries, boosting response speeds."
                    rows={4}
                    className="bg-white/[0.02] text-white text-sm rounded-xl p-3.5 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none resize-none placeholder:text-gray-600 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Job Description & Match Trigger Panel */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-5 p-6 glass-card rounded-2xl border border-white/10 shadow-2xl">
              <h3 className="text-base font-bold text-gray-200 flex items-center gap-2">
                <Sparkles className="size-5 text-violet-400" />
                Target Job Description
              </h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Paste the job description of the role you are applying to. Our ATS Engine will analyze keywords and rephrase points to match.
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here. Include key requirements, tech stack, and responsibilities."
                rows={14}
                className="bg-white/[0.02] text-white text-sm rounded-xl p-3.5 border border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 outline-none resize-none placeholder:text-gray-600 transition-colors font-mono"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={cn(
                "w-full flex items-center justify-center gap-2 min-h-12 py-3.5 px-6 rounded-full font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all cursor-pointer shadow-lg",
                isAnalyzing && "opacity-75 cursor-not-allowed"
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Analyzing Resume against ATS filters...
                </>
              ) : (
                <>
                  <Sparkles className="size-5" />
                  Analyze & Tailor Resume
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ATS Tailoring Report Tab */}
      {activeTab === "report" && analysis && (
        <div className="flex flex-col gap-8 animate-fadeIn">
          
          {/* Top Score Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ATS Score Card */}
            <div className="md:col-span-1 p-6 glass-card rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center gap-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">ATS Score</h4>
              <div className="relative size-36 flex items-center justify-center">
                
                {/* SVG Radial Progress with Neon Glow */}
                <svg className="size-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-white/[0.04]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Glowing Blur Backing */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={cn(
                      "transition-all duration-1000 ease-out opacity-40 blur-[2px]",
                      analysis.atsScore >= 80 ? "stroke-emerald-400" : analysis.atsScore >= 60 ? "stroke-violet-400" : "stroke-rose-400"
                    )}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * analysis.atsScore) / 100}
                    strokeLinecap="round"
                  />
                  {/* Crisp Front Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      analysis.atsScore >= 80 ? "stroke-emerald-400" : analysis.atsScore >= 60 ? "stroke-violet-400" : "stroke-rose-400"
                    )}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * analysis.atsScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-3xl font-black text-white">
                  {analysis.atsScore}%
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className={cn(
                  "text-xs font-bold px-3 py-1 rounded-full border",
                  analysis.atsScore >= 80 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : analysis.atsScore >= 60 
                    ? "bg-violet-500/10 border-violet-500/20 text-violet-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                )}>
                  {analysis.atsScore >= 80 ? "High Match Readiness" : analysis.atsScore >= 60 ? "Moderate Match" : "Needs Optimization"}
                </span>
                <span className="text-[10px] text-gray-400 mt-1 font-semibold">Recommended target: 80%+ match rate</span>
              </div>
            </div>

            {/* Keyword Match Stats Card */}
            <div className="md:col-span-2 p-6 glass-card rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="size-4 text-violet-400" /> Keywords Alignment Tracker
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full overflow-y-auto max-h-[170px] pr-2">
                {/* Matched Keywords */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 shrink-0" />
                    Matched ({analysis.matchedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedKeywords.length > 0 ? (
                      analysis.matchedKeywords.map((kw, i) => (
                        <span key={i} className="text-xs font-bold px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No matching keywords found.</span>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <XCircle className="size-4 shrink-0" />
                    Missing ({analysis.missingKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.length > 0 ? (
                      analysis.missingKeywords.map((kw, i) => (
                        <span key={i} className="text-xs font-bold px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-400">Excellent! No missing key skills found.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bullet Point Suggestion Rephrasing List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-base font-bold text-gray-200 flex items-center gap-2">
                <Sparkles className="size-5 text-violet-400" />
                ATS Rephrasing Recommendations (STAR Format)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Suggests keywords + results structure</span>
            </div>

            <div className="flex flex-col gap-4">
              {analysis.bulletPointSuggestions.map((suggestion, idx) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 bg-white/[0.01] border border-white/5 rounded-2xl relative hover:border-violet-500/30 hover:bg-white/[0.02] transition-all duration-300">
                  
                  {/* Original Bullet */}
                  <div className="lg:col-span-5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Original Bullet Point</span>
                    <p className="text-sm text-gray-300 bg-white/[0.01] p-3.5 rounded-xl border border-white/5 h-full min-h-[50px] font-medium leading-relaxed">
                      {suggestion.original}
                    </p>
                  </div>
                  
                  {/* arrow indicator */}
                  <div className="lg:col-span-1 flex items-center justify-center max-lg:rotate-90">
                    <ArrowRight className="size-5 text-gray-600" />
                  </div>
                  
                  {/* Tailored Suggestion */}
                  <div className="lg:col-span-6 flex flex-col gap-3 justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-violet-400" /> Suggested Rephrase
                      </span>
                      <p className="text-sm text-white bg-violet-950/20 p-3.5 rounded-xl border border-violet-500/30 font-semibold leading-relaxed shadow-[0_0_15px_rgba(124,58,237,0.04)] backdrop-blur-xs">
                        {suggestion.suggested}
                      </p>
                      <span className="text-xs text-gray-400 leading-relaxed">
                        <strong className="text-violet-400">Insight:</strong> {suggestion.explanation}
                      </span>
                    </div>

                    <div className="flex gap-2 justify-end mt-1">
                      <Button
                        variant="secondary"
                        onClick={() => copyToClipboard(suggestion.suggested, idx)}
                        className="text-xs font-bold px-4 py-2 h-9 flex items-center gap-1.5 border border-white/10 hover:bg-white/5 hover:text-white rounded-xl"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="size-3.5 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5 text-violet-400" /> Copy
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => applyBulletSuggestion(suggestion.suggested, idx)}
                        disabled={appliedIndices.includes(idx)}
                        className="text-xs font-bold px-4 py-2 h-9 flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 rounded-xl hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] disabled:opacity-50"
                      >
                        {appliedIndices.includes(idx) ? (
                          <>
                            <CheckCircle2 className="size-3.5" /> Applied
                          </>
                        ) : (
                          <>
                            <RefreshCw className="size-3.5" /> Apply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer: Seed & Launch Interview */}
          <div className="flex flex-row justify-between items-center glass-card p-6 border border-white/10 rounded-2xl shadow-2xl mt-4 gap-4 max-sm:flex-col">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-white">Seed tailored resume details into interview</h4>
              <p className="text-xs text-gray-400 font-medium">The AI interviewer will reference your projects and match terms dynamically.</p>
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("input")}
                className="rounded-full font-bold text-xs px-5 border border-white/10 text-gray-200 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleStartInterview}
                disabled={isGeneratingInterview}
                className="rounded-full font-black text-xs px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center gap-1.5 transition-all duration-300"
              >
                {isGeneratingInterview ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating Session...
                  </>
                ) : (
                  <>
                    Launch AI Mock Interview <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
