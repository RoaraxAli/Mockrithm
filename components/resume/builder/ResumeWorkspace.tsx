"use client";

import { useEffect, useState, useRef } from "react";
import { ResumeDocument, AtsScoreResult } from "@/types/resume";
import { useResumeStore } from "@/lib/store/resumeStore";
import ResumeFormEditor from "./ResumeFormEditor";
import LivePreviewRenderer from "./LivePreviewRenderer";
import { 
  Loader2, Download, Save, ArrowLeft, Activity, 
  X, Sparkles, CheckCircle2, XCircle, AlertCircle, ShieldAlert, Award, Play 
} from "lucide-react";
import { toast } from "sonner";
import { updateResumeData, saveAtsAnalysis } from "@/lib/actions/resume.action";
import Link from "next/link";

interface Props {
  initialResume: ResumeDocument;
}

export default function ResumeWorkspace({ initialResume }: Props) {
  const { 
    resumeId, 
    parsedData, 
    atsAnalysis,
    setResumeId, 
    setParsedData, 
    setAtsAnalysis, 
    isSaving, 
    setIsSaving, 
    lastSaved, 
    setLastSaved 
  } = useResumeStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isInitialMount = useRef(true);

  // Initialize Zustand state on mount
  useEffect(() => {
    setResumeId(initialResume.id!);
    setParsedData(initialResume.parsedData);
    if (initialResume.atsAnalysis) {
      setAtsAnalysis(initialResume.atsAnalysis);
    }
  }, [initialResume]);

  // Debounced Autosave to Database
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

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 font-mona-sans relative overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/user/dashboard/resume"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono uppercase tracking-wider transition-colors mr-2"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <h1 className="text-xl font-black text-white uppercase tracking-wider">
            Resume Builder
          </h1>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            {isSaving ? (
              <>
                <Loader2 className="size-3 animate-spin text-cyan-500" />
                <span className="text-cyan-500">Saving...</span>
              </>
            ) : (
              <>
                <Save className="size-3" />
                <span>Saved {lastSaved ? new Date(lastSaved).toLocaleTimeString() : 'recently'}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAtsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider hover:bg-cyan-950/20 border border-cyan-500/30 px-3.5 py-2 rounded-lg bg-cyan-950/10 shadow-[0_0_12px_rgba(6,182,212,0.1)] transition-all"
          >
            <Activity className="size-4 text-cyan-400" />
            {atsAnalysis?.atsScore ? `ATS Score: ${atsAnalysis.atsScore}%` : "Run ATS Scan"}
          </button>
          
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] text-sm uppercase tracking-wider"
          >
            {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Export PDF
          </button>
        </div>
      </header>

      {/* Split Screen Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Form Editor */}
        <div className="w-1/2 border-r border-slate-800 overflow-y-auto bg-slate-950/80 custom-scrollbar">
          <ResumeFormEditor />
        </div>

        {/* Right Pane: Live Preview */}
        <div className="w-1/2 overflow-y-auto bg-slate-900 relative custom-scrollbar flex justify-center p-8">
          <LivePreviewRenderer />
        </div>
      </div>

      {/* Slide-out ATS Analysis Dashboard */}
      {isAtsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-850 h-full flex flex-col shadow-2xl animate-slideLeft">
            
            {/* Header */}
            <div className="h-16 border-b border-slate-900 flex items-center justify-between px-6 shrink-0 bg-slate-900/30">
              <div className="flex items-center gap-2">
                <Activity className="size-5 text-cyan-400" />
                <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">ATS Optimizer</h2>
              </div>
              <button 
                onClick={() => setIsAtsOpen(false)}
                className="text-slate-500 hover:text-white p-1.5 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content Drawer */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
              
              {/* Target Job Input */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-850">
                <span className="text-[9px] font-mono tracking-widest text-cyan-450 uppercase flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Context Tailoring
                </span>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Paste the requirements of the job you want to scan against. We will run semantic matching and provide localized advice.
                </p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job responsibilities, skills, qualifications..."
                  rows={4}
                  className="bg-slate-950 text-slate-100 text-xs rounded border border-slate-800 p-3 outline-none focus:border-cyan-500/40 font-mono resize-none"
                />
                <button
                  onClick={handleRunAtsAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> SCANNING DOCUMENT...
                    </>
                  ) : (
                    <>
                      <Play className="size-3.5 fill-current" /> RUN ATS CHECKUP
                    </>
                  )}
                </button>
              </div>

              {/* Metrics Display */}
              {atsAnalysis ? (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  
                  {/* Radial Score Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-4 bg-slate-900/30 rounded-xl border border-slate-900">
                    <div className="flex flex-col items-center justify-center gap-2 sm:border-r border-slate-900 py-2">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">MATCH RATING</span>
                      <span className={`text-4xl font-black font-mono ${atsAnalysis.atsScore >= 80 ? 'text-emerald-400' : atsAnalysis.atsScore >= 60 ? 'text-cyan-400' : 'text-rose-400'}`}>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Missing */}
                    <div className="p-4 rounded-xl bg-rose-950/5 border border-rose-900/20 flex flex-col gap-3">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-450 flex items-center gap-1.5">
                        <ShieldAlert className="size-4 shrink-0" /> MISSING ({atsAnalysis.missingKeywords.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {atsAnalysis.missingKeywords.map((kw, i) => (
                          <span key={i} className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-950 border border-rose-500/10 text-rose-400 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Exiting */}
                    <div className="p-4 rounded-xl bg-cyan-950/5 border border-cyan-900/20 flex flex-col gap-3">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-450 flex items-center gap-1.5">
                        <Award className="size-4 shrink-0" /> FOUND SKILLS ({parsedData.skills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedData.skills.slice(0, 12).map((kw, i) => (
                          <span key={i} className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-950 border border-cyan-500/10 text-cyan-400 rounded">
                            {kw}
                          </span>
                        ))}
                        {parsedData.skills.length > 12 && (
                          <span className="text-[9px] font-mono text-slate-500 font-bold self-center">
                            +{parsedData.skills.length - 12} MORE
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="size-4" /> RECOGNIZED STRENGTHS
                      </span>
                      <ul className="flex flex-col gap-1.5 text-xs text-slate-350 leading-relaxed pl-4 list-disc font-medium">
                        {atsAnalysis.strengths.slice(0, 3).map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-450 flex items-center gap-1.5">
                        <XCircle className="size-4" /> CORE WEAKNESSES
                      </span>
                      <ul className="flex flex-col gap-1.5 text-xs text-slate-350 leading-relaxed pl-4 list-disc font-medium">
                        {atsAnalysis.weaknesses.slice(0, 3).map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actionable Suggestions */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="size-4" /> SUGGESTED REVISIONS
                    </span>
                    <div className="flex flex-col gap-2.5">
                      {atsAnalysis.improvementSuggestions.slice(0, 3).map((s, idx) => (
                        <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-900 border border-slate-850 text-xs text-slate-300 font-medium">
                          <span className="text-cyan-400 shrink-0 font-mono font-bold">{idx + 1}.</span>
                          <p>{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-slate-650 gap-3 border border-dashed border-slate-900 rounded-xl mt-8">
                  <AlertCircle className="size-8 text-slate-700" />
                  <p className="font-mono text-xs uppercase text-center font-bold">No ATS metrics calculated for this workspace state yet.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
