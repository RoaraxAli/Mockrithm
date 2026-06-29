"use client";

import { useEffect, useState, useRef } from "react";
import { ResumeDocument, AtsScoreResult } from "@/types/resume";
import { useResumeStore } from "@/lib/store/resumeStore";
import ResumeFormEditor from "./ResumeFormEditor";
import LivePreviewRenderer from "./LivePreviewRenderer";
import { 
  Loader2, Download, ArrowLeft, Activity, 
  X, Sparkles, CheckCircle2, XCircle, AlertCircle, ShieldAlert, Award, Play,
  UploadCloud, FileText, File, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { updateResumeData, saveAtsAnalysis } from "@/lib/actions/resume.action";
import { TEMPLATE_MAPPING } from "@/components/resume/templates";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  initialResume: ResumeDocument;
}

type TabType = "edit" | "customize" | "ats" | "tailor";

const TEMPLATE_CATEGORIES = {
  "ATS Friendly": ["minimal", "tech", "compact"],
  "Two Column": ["corporate", "modern", "executive"],
  "Creative & Portfolio": ["creative", "elegant", "cyber", "academic"]
};

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
  const [jobUrl, setJobUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [initialTemplateId, setInitialTemplateId] = useState("minimal");
  const isInitialMount = useRef(true);

  // Initialize Zustand state on mount
  useEffect(() => {
    setResumeId(initialResume.id!);
    setParsedData(initialResume.parsedData);
    if (initialResume.parsedData?.templateId) {
      setInitialTemplateId(initialResume.parsedData.templateId);
    }
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

  const exportAsTXT = () => {
    const d = parsedData;
    let txt = `${(d.basics.name || "Candidate Name").toUpperCase()}\n${d.basics.label || "Professional Title"}\n\n`;
    txt += `Email: ${d.basics.email || ""} | Phone: ${d.basics.phone || ""}\n\n`;
    txt += `SUMMARY\n=======\n${d.basics.summary || ""}\n\n`;
    txt += `WORK EXPERIENCE\n===============\n`;
    (d.work || []).forEach(w => {
      txt += `${w.position} at ${w.company} (${w.startDate} - ${w.endDate || "Present"})\n`;
      (w.highlights || []).forEach(h => {
        txt += `- ${h}\n`;
      });
      txt += `\n`;
    });
    txt += `EDUCATION\n=========\n`;
    (d.education || []).forEach(e => {
      txt += `${e.studyType} in ${e.area} - ${e.institution} (Graduated: ${e.endDate})\n`;
    });
    txt += `\nSKILLS\n======\n${(d.skills || []).join(", ")}\n`;
    
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${d.basics.name || "resume"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded successfully!");
  };

  const exportAsDOCX = () => {
    const d = parsedData;
    let html = `<html><head><meta charset="utf-8"></head><body style="font-family: Arial, sans-serif; line-height: 1.6;">`;
    html += `<h1 style="text-align: center; margin-bottom: 5px;">${d.basics.name || "Candidate Name"}</h1>`;
    html += `<p style="text-align: center; color: #555; margin-top: 0;">${d.basics.label || "Professional Title"}</p>`;
    html += `<p style="text-align: center; font-size: 11px;">Email: ${d.basics.email || ""} | Phone: ${d.basics.phone || ""}</p><hr>`;
    html += `<h2>Summary</h2><p>${d.basics.summary || ""}</p>`;
    html += `<h2>Work Experience</h2>`;
    (d.work || []).forEach(w => {
      html += `<p><strong>${w.position}</strong> - ${w.company} (${w.startDate} - ${w.endDate || "Present"})</p><ul>`;
      (w.highlights || []).forEach(h => {
        html += `<li>${h}</li>`;
      });
      html += `</ul>`;
    });
    html += `<h2>Education</h2>`;
    (d.education || []).forEach(e => {
      html += `<p><strong>${e.studyType} in ${e.area}</strong> - ${e.institution} (Graduation: ${e.endDate})</p>`;
    });
    html += `<h2>Skills</h2><p>${(d.skills || []).join(", ")}</p>`;
    html += `</body></html>`;
    
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${d.basics.name || "resume"}.doc`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Word document downloaded successfully!");
  };

  const handleRunAtsAnalysis = async () => {
    if (!jobUrl.trim()) {
      toast.error("Please enter a valid job posting URL first.");
      return;
    }
    try {
      setIsAnalyzing(true);
      toast.info("Scraping and analyzing job requirements with AI...");

      const res = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, jobDescription: `URL requirements matching ${jobUrl}` })
      });

      if (!res.ok) throw new Error("Failed to calculate ATS metrics");

      const scoreResult: AtsScoreResult = await res.json();

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
    if (!jobUrl.trim()) {
      toast.error("Please enter a valid job URL first.");
      return;
    }
    try {
      setIsTailoring(true);
      toast.info("AI is tailoring your resume details to the job requirements...");

      const res = await fetch("/api/resume/autofix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, jobUrl })
      });

      if (!res.ok) throw new Error("Tailoring API failed");
      const data = await res.json();
      
      if (data.optimizedData) {
        updateParsedData(data.optimizedData);
        toast.success("Successfully tailored and optimized your resume using AI!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Could not tailor resume at this moment.");
    } finally {
      setIsTailoring(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsExtracting(true);
      toast.info("AI parsing document and extracting resume details...");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to parse resume.");
      const data = await res.json();

      if (data.parsedData) {
        setParsedData(data.parsedData);
        setShowImportDialog(false);
        toast.success("Successfully extracted and imported details from your resume!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to extract details.");
    } finally {
      setIsExtracting(false);
    }
  };

  // Tab: Customize
  const renderCustomizeTab = () => {
    const currentStyles = parsedData.customStyles || {};
    const selectedColor = currentStyles.primaryColor || "";
    const selectedFont = currentStyles.fontFamily || "";
    const selectedSize = currentStyles.fontSize || "";

    const presets = ["#000000", "#1f2937", "#4b5563", "#9ca3af", "#d1d5db", "#ffffff"];

    return (
      <div className="flex flex-col p-6 gap-6 text-slate-200">
        
        {/* Template Gallery Categories */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Select Base Layout</span>
            {parsedData.templateId !== initialTemplateId && (
              <button
                onClick={() => updateParsedData({ templateId: initialTemplateId })}
                className="text-[9px] font-mono font-bold text-slate-400 hover:text-white underline cursor-pointer"
              >
                ← Revert layout ({initialTemplateId})
              </button>
            )}
          </div>

          {Object.entries(TEMPLATE_CATEGORIES).map(([categoryName, templateIds]) => (
            <div key={categoryName} className="flex flex-col gap-2">
              <span className="text-[9px] font-mono tracking-widest text-slate-550 uppercase">{categoryName}</span>
              <div className="grid grid-cols-2 gap-2.5">
                {templateIds.map((key) => {
                  const label = key.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                  const isSelected = parsedData.templateId === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateParsedData({ templateId: key })}
                      className={`p-3 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all text-left cursor-pointer ${
                        isSelected
                          ? "border-white bg-slate-900 text-white shadow-lg shadow-white/5"
                          : "border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Color Customization */}
        <div className="flex flex-col gap-3 border-t border-slate-900 pt-5">
          <span className="text-[10px] font-mono tracking-widest text-slate-550 uppercase font-bold">Accent Shades (Greyscale)</span>
          <div className="flex flex-wrap gap-2.5 items-center">
            {presets.map((color) => (
              <button
                key={color}
                onClick={() => updateParsedData({ 
                  customStyles: { ...currentStyles, primaryColor: color } 
                })}
                className="size-7 rounded-full border border-slate-800 shadow-inner cursor-pointer transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: color, outline: selectedColor === color ? "2px solid #ffffff" : "none" }}
              />
            ))}
          </div>
        </div>

        {/* Typography Customization */}
        <div className="flex flex-col gap-3 border-t border-slate-900 pt-5">
          <span className="text-[10px] font-mono tracking-widest text-slate-550 uppercase">Typography</span>
          <div className="grid grid-cols-3 gap-2">
            {(["sans", "serif", "mono"] as const).map((font) => (
              <button
                key={font}
                onClick={() => updateParsedData({
                  customStyles: { ...currentStyles, fontFamily: font }
                })}
                className={`py-2 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  selectedFont === font
                    ? "border-white bg-slate-900 text-white shadow-lg"
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
          <span className="text-[10px] font-mono tracking-widest text-slate-550 uppercase">Text Density</span>
          <div className="grid grid-cols-3 gap-2">
            {(["sm", "base", "lg"] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateParsedData({
                  customStyles: { ...currentStyles, fontSize: size }
                })}
                className={`py-2 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  selectedSize === size
                    ? "border-white bg-slate-900 text-white shadow-lg"
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
          <span className="text-[10px] font-mono tracking-widest text-white uppercase flex items-center gap-1.5 font-bold">
            <Sparkles className="size-3.5" /> AI Scan Settings
          </span>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Provide the URL of your target job posting. Gemini will calculate your ATS match rating and suggest revisions.
          </p>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="Paste LinkedIn, Indeed or company job posting URL..."
            className="bg-slate-950/70 text-slate-100 text-xs rounded-xl border border-slate-850 p-3.5 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 font-sans transition-all placeholder:text-slate-650"
          />
          <button
            onClick={handleRunAtsAnalysis}
            disabled={isAnalyzing || !jobUrl.trim()}
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
                <span className="text-4xl font-black font-mono text-white">
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
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="size-4 shrink-0" /> MISSING KEYWORDS ({atsAnalysis.missingKeywords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {atsAnalysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono font-bold px-2.5 py-1 bg-white/5 border border-white/10 text-white rounded-lg">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actionable Suggestions */}
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                <Sparkles className="size-4 text-white" /> ACTIONABLE REVISIONS
              </span>
              <div className="flex flex-col gap-2.5">
                {atsAnalysis.improvementSuggestions.slice(0, 3).map((s, idx) => (
                  <div key={idx} className="flex gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 font-medium">
                    <span className="text-white shrink-0 font-mono font-bold">{idx + 1}.</span>
                    <p className="leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-slate-650 gap-3 border border-dashed border-slate-850 rounded-2xl mt-4">
            <AlertCircle className="size-8 text-slate-750 animate-pulse" />
            <p className="font-mono text-[10px] uppercase text-center font-bold">No ATS metrics calculated. Enter job url above to scan.</p>
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
          <span className="text-[10px] font-mono tracking-widest text-white uppercase flex items-center gap-1.5 font-bold">
            <Sparkles className="size-3.5 animate-pulse" /> AI Job-Tailoring Studio
          </span>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            AI will analyze the target job link, rewrite your summary, optimize your work descriptions in STAR format, and inject target keywords automatically.
          </p>
          
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Target Job URL</label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="Paste LinkedIn, Indeed or company job posting URL..."
              className="bg-slate-950/70 text-slate-100 text-xs rounded-xl border border-slate-850 p-3.5 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 font-sans transition-all placeholder:text-slate-650"
            />
          </div>

          <button
            onClick={handleTailorResume}
            disabled={isTailoring || !jobUrl.trim()}
            className="w-full py-3.5 rounded-xl bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
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
                  <Loader2 className="size-2.5 animate-spin text-white" />
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
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-355 hover:text-white uppercase tracking-wider bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <UploadCloud className="size-3.5" />
            Import
          </button>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="flex items-center gap-1 bg-white hover:bg-gray-200 text-black font-bold px-4 py-2 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer font-mono"
            >
              <Download className="size-3.5" />
              Download
              <ChevronDown className="size-3.5" />
            </button>
            
            {showDownloadDropdown && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowDownloadDropdown(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-30 animate-scaleIn">
                  <button
                    onClick={() => {
                      setShowDownloadDropdown(false);
                      handleExportPDF();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-mono text-slate-350 hover:text-white hover:bg-slate-950/50 transition-colors flex items-center gap-2 cursor-pointer border-b border-slate-955/20"
                  >
                    <FileText className="size-3.5 text-slate-400" /> PDF Document (.pdf)
                  </button>
                  <button
                    onClick={() => {
                      setShowDownloadDropdown(false);
                      exportAsDOCX();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-mono text-slate-350 hover:text-white hover:bg-slate-950/50 transition-colors flex items-center gap-2 cursor-pointer border-b border-slate-955/20"
                  >
                    <FileText className="size-3.5 text-slate-400" /> Word Document (.doc)
                  </button>
                  <button
                    onClick={() => {
                      setShowDownloadDropdown(false);
                      exportAsTXT();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-mono text-slate-350 hover:text-white hover:bg-slate-950/50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <File className="size-3.5 text-slate-400" /> Plain Text (.txt)
                  </button>
                </div>
              </>
            )}
          </div>

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

      {/* Import/Upload Modal */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Upload & Extract Details</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Upload an existing resume to automatically parse and import details.</p>
              </div>
              <button 
                onClick={() => setShowImportDialog(false)}
                className="text-slate-450 hover:text-white p-1.5 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-4">
              <label className="border border-dashed border-slate-800 hover:border-slate-600 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-950/40 cursor-pointer transition-all hover:bg-slate-950 group">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.doc,.txt" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  disabled={isExtracting}
                />
                {isExtracting ? (
                  <>
                    <Loader2 className="size-8 animate-spin text-white" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">AI parsing document...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="size-8 text-slate-550 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-wider text-center">Select PDF, Word, or Text File</span>
                    <span className="text-[9px] font-mono text-slate-650">Max size 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
