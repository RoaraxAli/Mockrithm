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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-border/50 items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("input")}
            className={cn(
              "py-3 px-4 text-sm font-semibold transition-all border-b-2 cursor-pointer",
              activeTab === "input" 
                ? "border-primary-200 text-primary-200" 
                : "border-transparent text-light-400 hover:text-white"
            )}
          >
            1. Resume & Job Setup
          </button>
          {analysis && (
            <button
              onClick={() => setActiveTab("report")}
              className={cn(
                "py-3 px-4 text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5",
                activeTab === "report" 
                  ? "border-primary-200 text-primary-200" 
                  : "border-transparent text-light-400 hover:text-white"
              )}
            >
              2. ATS Tailoring Report
              <span className="bg-primary-200/20 text-primary-200 text-xs px-2 py-0.5 rounded-full font-bold">
                {analysis.atsScore}% Match
              </span>
            </button>
          )}
        </div>
        
        {analysis && activeTab === "input" && (
          <button
            onClick={() => setActiveTab("report")}
            className="text-xs text-primary-200 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View Tailoring Report <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-destructive-100/10 border border-destructive-100/30 text-destructive-100 rounded-xl p-4 text-sm flex gap-3 items-start animate-fadeIn">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Setup Tab */}
      {activeTab === "input" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Resume Source Panel */}
          <div className="flex flex-col gap-5 p-6 bg-dark-200/50 border border-border/50 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary-100 flex items-center gap-2">
                <FileText className="size-5 text-primary-200" />
                Resume Portfolio
              </h3>
              <div className="flex bg-dark-300 p-0.5 rounded-lg border border-border text-xs">
                <button
                  onClick={() => handleModeChange("paste")}
                  className={cn(
                    "px-3 py-1.5 rounded-md font-medium cursor-pointer transition-all",
                    resumeMode === "paste" ? "bg-dark-200 text-primary-200 shadow-sm" : "text-light-400"
                  )}
                >
                  Quick Paste
                </button>
                <button
                  onClick={() => handleModeChange("build")}
                  className={cn(
                    "px-3 py-1.5 rounded-md font-medium cursor-pointer transition-all",
                    resumeMode === "build" ? "bg-dark-200 text-primary-200 shadow-sm" : "text-light-400"
                  )}
                >
                  Build Custom
                </button>
              </div>
            </div>

            {resumeMode === "paste" ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-light-400">
                  Paste the full text of your current resume (e.g., from a Word document or PDF) below.
                </p>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-light-100">Target Role Title (e.g. Frontend Developer)</label>
                  <input
                    type="text"
                    value={builderTitle}
                    onChange={(e) => setBuilderTitle(e.target.value)}
                    placeholder="e.g. Frontend Engineer, Product Manager"
                    className="bg-dark-300 text-white text-sm rounded-xl p-3 border border-border focus:ring-1 focus:ring-primary-200 outline-none placeholder:text-light-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-light-100">Experience Level</label>
                    <select
                      value={builderLevel}
                      onChange={(e) => setBuilderLevel(e.target.value)}
                      className="bg-dark-300 text-white text-sm rounded-xl p-3 border border-border focus:ring-1 focus:ring-primary-200 outline-none cursor-pointer"
                    >
                      <option value="Intern">Intern</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead / Manager">Lead / Manager</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-light-100">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={builderTechStack}
                      onChange={(e) => setBuilderTechStack(e.target.value)}
                      placeholder="e.g. React, Next.js, Node.js"
                      className="bg-dark-300 text-white text-sm rounded-xl p-3 border border-border focus:ring-1 focus:ring-primary-200 outline-none placeholder:text-light-600"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-light-100">Resume Content Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste details of your resume here: profile description, experiences, projects, skills..."
                    rows={12}
                    className="bg-dark-300 text-white text-sm rounded-xl p-3.5 border border-border focus:ring-1 focus:ring-primary-200 outline-none resize-none placeholder:text-light-600 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-light-100 flex items-center gap-1">
                      <Briefcase className="size-3.5 text-primary-200" /> Target Role Title
                    </label>
                    <input
                      type="text"
                      value={builderTitle}
                      onChange={(e) => setBuilderTitle(e.target.value)}
                      placeholder="e.g. Senior React Developer"
                      className="bg-dark-300 text-white text-sm rounded-xl p-3 border border-border focus:ring-1 focus:ring-primary-200 outline-none placeholder:text-light-600"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-light-100">Experience Level</label>
                    <select
                      value={builderLevel}
                      onChange={(e) => setBuilderLevel(e.target.value)}
                      className="bg-dark-300 text-white text-sm rounded-xl p-3 border border-border focus:ring-1 focus:ring-primary-200 outline-none cursor-pointer"
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
                    <label className="text-xs font-semibold text-light-100 flex items-center gap-1">
                      <Code className="size-3.5 text-primary-200" /> Tech Stack
                    </label>
                    <input
                      type="text"
                      value={builderTechStack}
                      onChange={(e) => setBuilderTechStack(e.target.value)}
                      placeholder="e.g. Next.js, TypeScript, Tailwind"
                      className="bg-dark-300 text-white text-sm rounded-xl p-3 border border-border focus:ring-1 focus:ring-primary-200 outline-none placeholder:text-light-600"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-light-100 flex items-center gap-1">
                      <Award className="size-3.5 text-primary-200" /> Core Skills
                    </label>
                    <input
                      type="text"
                      value={builderSkills}
                      onChange={(e) => setBuilderSkills(e.target.value)}
                      placeholder="e.g. System Design, REST APIs, Git"
                      className="bg-dark-300 text-white text-sm rounded-xl p-3 border border-border focus:ring-1 focus:ring-primary-200 outline-none placeholder:text-light-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-light-100">Professional Experience (with Bullet Points)</label>
                  <textarea
                    value={builderExperience}
                    onChange={(e) => setBuilderExperience(e.target.value)}
                    placeholder="Company - Role - Duration&#10;- Built a SaaS dashboard utilizing Next.js, reducing load times by 20%.&#10;- Coordinated a team of 4 engineers to deliver an analytics pipeline..."
                    rows={6}
                    className="bg-dark-300 text-white text-sm rounded-xl p-3.5 border border-border focus:ring-1 focus:ring-primary-200 outline-none resize-none placeholder:text-light-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-light-100">Key Projects</label>
                  <textarea
                    value={builderProjects}
                    onChange={(e) => setBuilderProjects(e.target.value)}
                    placeholder="Project 1: E-commerce Platform&#10;- Designed shopping cart API with Express and PostgreSQL.&#10;- Optimized queries, boosting response speeds."
                    rows={4}
                    className="bg-dark-300 text-white text-sm rounded-xl p-3.5 border border-border focus:ring-1 focus:ring-primary-200 outline-none resize-none placeholder:text-light-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Job Description & Match Trigger Panel */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 p-6 bg-dark-200/50 border border-border/50 rounded-2xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-primary-100 flex items-center gap-2">
                <Sparkles className="size-5 text-primary-200" />
                Target Job Description
              </h3>
              <p className="text-xs text-light-400">
                Paste the job description of the role you are applying to. Our ATS Engine will analyze keywords and rephrase points to match.
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here. Include key requirements, tech stack, and responsibilities."
                rows={14}
                className="bg-dark-300 text-white text-sm rounded-xl p-3.5 border border-border focus:ring-1 focus:ring-primary-200 outline-none resize-none placeholder:text-light-600"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={cn(
                "w-full flex items-center justify-center gap-2 min-h-12 py-3 px-6 rounded-full font-bold text-dark-100 bg-primary-200 hover:bg-primary-200/95 transition-all cursor-pointer shadow-lg",
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
            <div className="md:col-span-1 p-6 bg-dark-200/50 border border-border/50 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center text-center gap-4">
              <h4 className="text-sm font-bold text-light-100 uppercase tracking-wider">ATS Score</h4>
              <div className="relative size-36 flex items-center justify-center">
                
                {/* SVG Radial Progress */}
                <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-dark-300"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      analysis.atsScore >= 80 ? "stroke-success-100" : analysis.atsScore >= 60 ? "stroke-primary-200" : "stroke-destructive-100"
                    )}
                    strokeWidth="10"
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
                  "text-sm font-extrabold px-3 py-1 rounded-full",
                  analysis.atsScore >= 80 ? "bg-success-100/10 text-success-100" : analysis.atsScore >= 60 ? "bg-primary-200/10 text-primary-200" : "bg-destructive-100/10 text-destructive-100"
                )}>
                  {analysis.atsScore >= 80 ? "High Match Readiness" : analysis.atsScore >= 60 ? "Moderate Match" : "Needs Optimization"}
                </span>
                <span className="text-[11px] text-light-400 mt-1">Recommended target: 80%+ match rate</span>
              </div>
            </div>

            {/* Keyword Match Stats Card */}
            <div className="md:col-span-2 p-6 bg-dark-200/50 border border-border/50 rounded-2xl backdrop-blur-md flex flex-col gap-4">
              <h4 className="text-sm font-bold text-light-100 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="size-4 text-primary-200" /> Keywords Alignment Tracker
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full overflow-y-auto max-h-[170px] pr-2">
                {/* Matched Keywords */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-success-100 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 shrink-0" />
                    Matched ({analysis.matchedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedKeywords.length > 0 ? (
                      analysis.matchedKeywords.map((kw, i) => (
                        <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-success-100/5 border border-success-100/20 text-success-100 rounded-md">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-light-600">No matching keywords found.</span>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-destructive-100 flex items-center gap-1.5">
                    <XCircle className="size-4 shrink-0" />
                    Missing ({analysis.missingKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.length > 0 ? (
                      analysis.missingKeywords.map((kw, i) => (
                        <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-destructive-100/5 border border-destructive-100/20 text-destructive-100 rounded-md">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-success-100">Excellent! No missing key skills found.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bullet Point Suggestion Rephrasing List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary-100 flex items-center gap-2">
                <Sparkles className="size-5 text-primary-200" />
                ATS Rephrasing Recommendations (STAR Format)
              </h3>
              <span className="text-xs text-light-400">Suggests keywords + results structure</span>
            </div>

            <div className="flex flex-col gap-4">
              {analysis.bulletPointSuggestions.map((suggestion, idx) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 bg-dark-200/30 border border-border/40 rounded-xl relative hover:border-primary-200/30 transition-all">
                  
                  {/* Original Bullet */}
                  <div className="lg:col-span-5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-light-400 uppercase tracking-wider">Original Bullet Point</span>
                    <p className="text-sm text-light-100 bg-dark-300/40 p-3 rounded-lg border border-border/30 h-full min-h-[50px]">
                      {suggestion.original}
                    </p>
                  </div>
                  
                  {/* arrow indicator */}
                  <div className="lg:col-span-1 flex items-center justify-center max-lg:rotate-90">
                    <ArrowRight className="size-5 text-light-600" />
                  </div>
                  
                  {/* Tailored Suggestion */}
                  <div className="lg:col-span-6 flex flex-col gap-3 justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-primary-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-primary-200" /> Suggested Rephrase
                      </span>
                      <p className="text-sm text-white bg-primary-200/5 p-3 rounded-lg border border-primary-200/20 font-medium">
                        {suggestion.suggested}
                      </p>
                      <span className="text-[11px] text-light-400 italic">
                        <strong>Insight:</strong> {suggestion.explanation}
                      </span>
                    </div>

                    <div className="flex gap-2 justify-end mt-1">
                      <Button
                        variant="secondary"
                        onClick={() => copyToClipboard(suggestion.suggested, idx)}
                        className="text-xs font-semibold px-3 py-1.5 h-8 flex items-center gap-1.5 border border-border hover:bg-dark-300"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="size-3.5 text-success-100" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" /> Copy
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => applyBulletSuggestion(suggestion.suggested, idx)}
                        disabled={appliedIndices.includes(idx)}
                        className="text-xs font-bold px-3 py-1.5 h-8 flex items-center gap-1.5 bg-primary-200 text-dark-100 hover:bg-primary-200/90"
                      >
                        {appliedIndices.includes(idx) ? (
                          <>
                            <CheckCircle2 className="size-3.5 text-dark-100" /> Applied
                          </>
                        ) : (
                          <>
                            <RefreshCw className="size-3.5" /> Apply to Resume
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
          <div className="flex flex-row justify-between items-center bg-dark-200/50 p-6 border border-border/50 rounded-2xl backdrop-blur-md mt-4 gap-4 max-sm:flex-col">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-white">Seed tailored resume details into interview</h4>
              <p className="text-xs text-light-400">The AI interviewer will reference your projects and match terms dynamically.</p>
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("input")}
                className="rounded-full font-bold text-xs px-5 border border-border text-light-100 hover:bg-dark-300"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleStartInterview}
                disabled={isGeneratingInterview}
                className="rounded-full font-black text-xs px-6 bg-primary-200 text-dark-100 hover:bg-primary-200/90 flex items-center gap-1.5"
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
