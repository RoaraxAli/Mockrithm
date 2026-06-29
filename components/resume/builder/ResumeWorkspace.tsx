"use client";

import { useEffect, useState, useRef } from "react";
import { ResumeDocument, AtsScoreResult } from "@/types/resume";
import { useResumeStore } from "@/lib/store/resumeStore";
import ResumeFormEditor from "./ResumeFormEditor";
import LivePreviewRenderer from "./LivePreviewRenderer";
import { 
  Loader2, Download, ArrowLeft, Activity, 
  X, Sparkles, CheckCircle2, XCircle, AlertCircle, ShieldAlert, Award, Play 
} from "lucide-react";
import { toast } from "sonner";
import { updateResumeData, saveAtsAnalysis, getUserResumes } from "@/lib/actions/resume.action";
import { TEMPLATE_MAPPING } from "@/components/resume/templates";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  initialResume: ResumeDocument;
}

type TabType = "edit" | "customize" | "ats" | "tailor";

export default function ResumeWorkspace({ initialResume }: Props) {
  const { 
    resumeId, 
    parsedData, 
    atsAnalysis,
    setResumeId, 
    setParsedData, 
    updateParsedData,
    setAtsAnalysis, 
    isSaving, 
    setIsSaving, 
    lastSaved, 
    setLastSaved 
  } = useResumeStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get("from") === "onboarding";
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("edit");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [userResumes, setUserResumes] = useState<ResumeDocument[]>([]);
  const isInitialMount = useRef(true);

  // Initialize Zustand state on mount
  useEffect(() => {
    setResumeId(initialResume.id!);
    setParsedData(initialResume.parsedData);
    if (initialResume.atsAnalysis) {
      setAtsAnalysis(initialResume.atsAnalysis);
    }
  }, [initialResume]);

  // Load user's other resumes on mount
  useEffect(() => {
    async function loadResumes() {
      try {
        const res = await getUserResumes(initialResume.userId);
        setUserResumes(res.filter((r) => r.id !== initialResume.id));
      } catch (err) {
        console.error("Failed to load user resumes:", err);
      }
    }
    if (initialResume.userId) {
      loadResumes();
    }
  }, [initialResume.userId, initialResume.id]);

  // Debounced Autosave to Database (keeps autosaving silently in background)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!resumeId) return;

    setIsSaving(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await updateResumeData(initialResume.userId, resumeId, parsedData);
        if (res.success) {
          setLastSaved(new Date().toISOString());
        } else {
          toast.error("Failed to autosave changes.");
        }
      } catch (err) {
        console.error("Autosave error:", err);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [parsedData, resumeId, initialResume.userId]);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      toast.info("Generating high-quality PDF...");
      
      const response = await fetch("/api/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: initialResume.id, userId: initialResume.userId })
      });

      if (!response.ok) throw new Error("Failed to export PDF");

      // Download the generated blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${parsedData.basics.name || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not export PDF right now.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRunAtsAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      toast.info("Analyzing resume with AI...");

      const res = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, jobDescription })
      });

      if (!res.ok) throw new Error("Failed to calculate ATS metrics");

      const scoreResult: AtsScoreResult = await res.json();

      // Save to Firebase
      const saveRes = await saveAtsAnalysis(initialResume.userId, resumeId!, scoreResult);
      if (!saveRes.success) throw new Error(saveRes.error || "Failed to save score");

      setAtsAnalysis(scoreResult);
      toast.success("ATS Analysis completed successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyze resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTailorResume = async () => {
    try {
      setIsTailoring(true);
      toast.info("AI is tailoring your resume details to the job requirements...");

      const res = await fetch("/api/resume/autofix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, jobDescription })
      });

      if (!res.ok) throw new Error("Tailoring API failed");
      const data = await res.json();
      
      // Update store with optimized fields
      updateParsedData({
        basics: {
          ...parsedData.basics,
          summary: data.basics?.summary || parsedData.basics.summary
        },
        work: parsedData.work.map((w, idx) => ({
          ...w,
          highlights: data.work?.[idx]?.highlights || w.highlights
        })),
        skills: data.skills || parsedData.skills
      });

      toast.success("Successfully tailored and optimized your resume using AI!");
    } catch (err: any) {
      console.error(err);
      toast.error("Could not tailor resume at this moment.");
    } finally {
      setIsTailoring(false);
    }
  };

  // Tab: Customize
  const renderCustomizeTab = () => {
    const currentStyles = parsedData.customStyles || {};
    const selectedColor = currentStyles.primaryColor || "";
    const selectedFont = currentStyles.fontFamily || "";
    const selectedSize = currentStyles.fontSize || "";

    const presets = ["#06b6d4", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#f59e0b", "#64748b"];

    return (
      <div className="flex flex-col p-6 gap-6 text-slate-200">
        {/* Template Gallery */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Select Base Layout</span>
          <div className="grid grid-cols-2 gap-2.5">
            {Object.keys(TEMPLATE_MAPPING).slice(0, 10).map((key) => {
              const label = key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
              const isSelected = parsedData.templateId === key;
              return (
                <button
                  key={key}
                  onClick={() => updateParsedData({ templateId: key })}
                  className={`p-3 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all text-left cursor-pointer ${
                    isSelected
                      ? "border-cyan-500 bg-slate-900 text-white shadow-lg shadow-cyan-500/5"
                      : "border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Customization */}
        <div className="flex flex-col gap-3 border-t border-slate-900 pt-5">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Accent Colors</span>
          <div className="flex flex-wrap gap-2.5 items-center">
            {presets.map((color) => (
              <button
                key={color}
                onClick={() => updateParsedData({ 
                  customStyles: { ...currentStyles, primaryColor: color } 
                })}
                className="size-6 rounded-full border border-slate-900 shadow-inner cursor-pointer transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: color, outline: selectedColor === color ? "2px solid #06b6d4" : "none" }}
              />
            ))}
            
            {/* Custom Color Input */}
            <div className="flex items-center gap-2 border border-slate-800 rounded-xl px-3 py-1 bg-slate-950/50">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Custom</span>
              <input
                type="color"
                value={selectedColor || "#06b6d4"}
                onChange={(e) => updateParsedData({
                  customStyles: { ...currentStyles, primaryColor: e.target.value }
                })}
                className="size-5 rounded border-none bg-transparent cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Typography Customization */}
        <div className="flex flex-col gap-3 border-t border-slate-900 pt-5">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Typography</span>
          <div className="grid grid-cols-3 gap-2">
            {(["sans", "serif", "mono"] as const).map((font) => (
              <button
                key={font}
                onClick={() => updateParsedData({
                  customStyles: { ...currentStyles, fontFamily: font }
                })}
                className={`py-2 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  selectedFont === font
                    ? "border-cyan-500 bg-slate-900 text-white shadow-lg"
                    : "border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white"
                }`}
              >
                {font === "sans" ? "Sans-Serif" : font === "serif" ? "Serif" : "Monospace"}
              </button>
            ))}
          </div>
        </div>

        {/* Text Size Customization */}
        <div className="flex flex-col gap-3 border-t border-slate-900 pt-5">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Text Density</span>
          <div className="grid grid-cols-3 gap-2">
            {(["sm", "base", "lg"] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateParsedData({
                  customStyles: { ...currentStyles, fontSize: size }
                })}
                className={`py-2 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  selectedSize === size
                    ? "border-cyan-500 bg-slate-900 text-white shadow-lg"
                    : "border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white"
                }`}
              >
                {size === "sm" ? "High" : size === "lg" ? "Low" : "Standard"}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Tab: AI Review
  const renderAtsReviewTab = () => {
    return (
      <div className="flex flex-col p-6 gap-6 text-slate-200">
        {/* Run Scan card */}
        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> AI Scan Settings
          </span>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Provide the description of your target job. Gemini will calculate your ATS match rating and suggest revisions.
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job responsibilities, skills, qualifications..."
            rows={4}
            className="bg-slate-950/70 text-slate-100 text-xs rounded-xl border border-slate-850 p-3.5 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 font-sans resize-none transition-all placeholder:text-slate-650"
          />
          <button
            onClick={handleRunAtsAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-xl bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="size-4 animate-spin" /> SCANNING DOCUMENT...
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" /> RUN AI CHECKUP
              </>
            )}
          </button>
        </div>

        {atsAnalysis ? (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Radial Score Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-4 bg-slate-900/20 rounded-xl border border-slate-800/85">
              <div className="flex flex-col items-center justify-center gap-2 sm:border-r border-slate-800 py-2">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">MATCH RATING</span>
                <span className="text-4xl font-black font-mono text-cyan-400">
                  {atsAnalysis.atsScore}%
                </span>
              </div>

              <div className="col-span-2 flex flex-col gap-2">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">VERDICT</span>
                <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                  {atsAnalysis.atsScore >= 80 
                    ? "Optimized for automated filters. You possess high semantic keyword overlap."
                    : atsAnalysis.atsScore >= 60
                    ? "Acceptable overlap, but you're missing key skills listed in the target requirements."
                    : "High risk of filtration. Revise and weave the missing terms into your experience."
                  }
                </p>
              </div>
            </div>

            {/* Keywords Columns */}
            <div className="grid grid-cols-1 gap-4">
              {/* Missing */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col gap-3">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="size-4 shrink-0" /> MISSING KEYWORDS ({atsAnalysis.missingKeywords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {atsAnalysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono font-bold px-2.5 py-1 bg-rose-500/5 border border-rose-500/20 text-rose-300 rounded-lg">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actionable Suggestions */}
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                <Sparkles className="size-4 text-cyan-400" /> ACTIONABLE REVISIONS
              </span>
              <div className="flex flex-col gap-2.5">
                {atsAnalysis.improvementSuggestions.slice(0, 3).map((s, idx) => (
                  <div key={idx} className="flex gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 font-medium">
                    <span className="text-cyan-400 shrink-0 font-mono font-bold">{idx + 1}.</span>
                    <p className="leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-slate-650 gap-3 border border-dashed border-slate-850 rounded-2xl mt-4">
            <AlertCircle className="size-8 text-slate-750 animate-pulse" />
            <p className="font-mono text-[10px] uppercase text-center font-bold">No ATS metrics calculated. Paste job description above to scan.</p>
          </div>
        )}
      </div>
    );
  };

  // Tab: Tailor
  const renderTailorTab = () => {
    return (
      <div className="flex flex-col p-6 gap-6 text-slate-200">
        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
            <Sparkles className="size-3.5 animate-pulse" /> AI Job-Tailoring Studio
          </span>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            AI will analyze the target job details, rewrite your summary, optimize your work descriptions in STAR format, and inject target keywords automatically.
          </p>
          
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Paste Target Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job responsibilities, skills, qualifications..."
              rows={6}
              className="bg-slate-950/70 text-slate-100 text-xs rounded-xl border border-slate-850 p-3.5 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 font-sans resize-none transition-all placeholder:text-slate-650"
            />
          </div>

          <button
            onClick={handleTailorResume}
            disabled={isTailoring || !jobDescription.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
          >
            {isTailoring ? (
              <>
                <Loader2 className="size-4 animate-spin" /> TAILORING RESUME...
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> START AI TAILORING
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 font-mona-sans relative overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-10">
        
        {/* Back and Title */}
        <div className="flex items-center gap-3">
          {fromOnboarding ? (
            <Link 
              href="/onboarding"
              className="size-9 rounded-full border border-slate-800/80 bg-slate-900/30 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-sm"
            >
              <ArrowLeft className="size-4" />
            </Link>
          ) : (
            <Link 
              href="/user/resume"
              className="size-9 rounded-full border border-slate-800/80 bg-slate-900/30 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-sm"
            >
              <ArrowLeft className="size-4" />
            </Link>
          )}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-sm font-black text-white uppercase tracking-wider">
              Resume Builder
            </h1>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
              {isSaving ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="size-2.5 animate-spin text-cyan-400" />
                  <span>Autosaving...</span>
                </span>
              ) : (
                <span>Changes saved locally</span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Center Navigation Switcher */}
        <div className="flex bg-slate-950/70 p-1 border border-slate-850 rounded-2xl">
          {(["edit", "customize", "ats", "tailor"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab 
                  ? "bg-white text-black shadow-md shadow-white/5" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "ats" ? "AI Review" : tab}
            </button>
          ))}
        </div>

        {/* Action Options */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowImportDialog(true)}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-350 hover:text-white uppercase tracking-wider bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Sparkles className="size-3.5 text-cyan-400" />
            Import
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 text-xs font-mono font-bold bg-white hover:bg-gray-200 disabled:opacity-50 text-black px-4 py-2 rounded-xl transition-all shadow-md uppercase tracking-wider cursor-pointer"
          >
            {isExporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            Download PDF
          </button>

          {fromOnboarding ? (
            <button
              onClick={async () => {
                await handleExportPDF();
                router.push(`/onboarding?resumeId=${resumeId}`);
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer"
            >
              Continue
            </button>
          ) : (
            <Link
              href="/user/dashboard"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
            >
              Finish
            </Link>
          )}
        </div>
      </header>

      {/* Split Screen Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Switchable Sub-pages */}
        <div className="w-1/2 border-r border-slate-900/80 overflow-y-auto bg-slate-950/80 custom-scrollbar">
          {activeTab === "edit" && <ResumeFormEditor />}
          {activeTab === "customize" && renderCustomizeTab()}
          {activeTab === "ats" && renderAtsReviewTab()}
          {activeTab === "tailor" && renderTailorTab()}
        </div>

        {/* Right Pane: Live Preview */}
        <div className="w-1/2 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black relative custom-scrollbar flex justify-center p-8 border-l border-slate-900/80">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
          <div className="relative z-10 w-full max-w-[800px] flex justify-center">
            <LivePreviewRenderer />
          </div>
        </div>
      </div>

      {/* Import Resume Modal */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80%] animate-scaleIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Import details</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Select a resume to copy all personal details and section items.</p>
              </div>
              <button 
                onClick={() => setShowImportDialog(false)}
                className="text-slate-450 hover:text-white p-1.5 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
              {userResumes.length === 0 ? (
                <div className="text-center py-8 flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="size-8 text-slate-650" />
                  <p className="text-xs text-slate-400 font-semibold font-mono uppercase">No other resumes found in your account.</p>
                </div>
              ) : (
                userResumes.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => {
                      setParsedData(res.parsedData);
                      setShowImportDialog(false);
                      toast.success(`Successfully imported data from "${res.fileName}"!`);
                    }}
                    className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all flex justify-between items-center group cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
                        {res.fileName || "Untitled Resume"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">
                        Template: {res.parsedData?.templateId || "minimal"} • Created: {new Date(res.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Play className="size-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
