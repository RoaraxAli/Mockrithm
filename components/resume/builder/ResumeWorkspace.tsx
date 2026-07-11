"use client";

import { useEffect, useState, useRef, Component, ReactNode } from "react";
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
import { getTemplateComponent, TEMPLATE_MAPPING } from "@/components/resume/templates";
import { FONT_OPTIONS, getFontClass, getFontLabel } from "@/components/resume/templates/fonts";
import { SAMPLE_PROFILES } from "@/components/resume/sampleProfiles";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  initialResume: ResumeDocument;
}

type TabType = "edit" | "customize" | "ats";
type CustomizeSubTab = "layout" | "color" | "typography";

const ALL_TEMPLATES = [
  { id: "minimal", name: "Minimalist", category: "ATS Friendly", supportsColor: false },
  { id: "tech", name: "Tech / Developer", category: "ATS Friendly", supportsColor: false },
  { id: "compact", name: "Compact / Clean", category: "ATS Friendly", supportsColor: false },
  { id: "corporate", name: "Corporate", category: "Two Column", supportsColor: true },
  { id: "modern", name: "Modern", category: "Two Column", supportsColor: true },
  { id: "executive", name: "Executive", category: "Two Column", supportsColor: true },
  { id: "creative", name: "Creative", category: "Creative & Portfolio", supportsColor: true },
  { id: "elegant", name: "Elegant", category: "Creative & Portfolio", supportsColor: true },
  { id: "cyber", name: "Cyberpunk", category: "Creative & Portfolio", supportsColor: true },
  { id: "academic", name: "Academic", category: "Creative & Portfolio", supportsColor: false }
];

// Error boundary so a single failing template preview can't crash the entire page
class PreviewErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("Template preview failed to render:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full aspect-[1/1.414] flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl">
          <span className="text-[9px] font-mono text-slate-600 uppercase">Preview unavailable</span>
        </div>
      );
    }
    return this.props.children;
  }
}

function TemplatePreview({ templateId }: { templateId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

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
  const profileData = SAMPLE_PROFILES[templateId] || SAMPLE_PROFILES[TEMPLATE_MAPPING[templateId]] || SAMPLE_PROFILES["elementary-teacher"];

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-[1/1.414] overflow-hidden bg-white border border-slate-900 relative shadow-inner flex justify-center items-start rounded-xl"
    >
      <div 
        className="absolute top-0 left-0 pointer-events-none select-none text-slate-800 origin-top-left"
        style={{ 
          width: "800px", 
          height: "1131px",
          transform: `scale(${scale})`,
        }}
      >
        <TemplateComponent data={profileData} templateId={templateId} />
      </div>
    </div>
  );
}

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
  const [customSubTab, setCustomSubTab] = useState<CustomizeSubTab>("layout");
  const [layoutFilter, setLayoutFilter] = useState<"all" | "ats" | "twocol" | "creative">("all");
  const [layoutSort, setLayoutSort] = useState<"default" | "name">("default");
  
  const [jobUrl, setJobUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showDensityDropdown, setShowDensityDropdown] = useState(false);
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
        // Preserve current template and custom styles when importing new resume data
        const currentTemplateId = parsedData.templateId || initialTemplateId;
        const currentCustomStyles = parsedData.customStyles || {};
        setParsedData({
          ...data.parsedData,
          templateId: data.parsedData.templateId || currentTemplateId,
          customStyles: data.parsedData.customStyles || currentCustomStyles,
        });
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
    const selectedFont = currentStyles.fontFamily || "inter";
    const selectedSize = currentStyles.fontSize || "base";

    // Per-template color support check
    const currentTemplate = ALL_TEMPLATES.find(t => t.id === (parsedData.templateId || "minimal"));
    const templateSupportsColor = currentTemplate?.supportsColor ?? false;

    // Color presets for color-capable templates
    const colorPresets = [
      "#1e3a5f", "#2d5a3d", "#7c2d3e", "#4a5568", "#0d7377",
      "#4338ca", "#b45309", "#1e293b", "#6d28d9", "#be123c"
    ];

    // Filter templates
    let filtered = ALL_TEMPLATES;
    if (layoutFilter === "ats") {
      filtered = ALL_TEMPLATES.filter(t => t.category === "ATS Friendly");
    } else if (layoutFilter === "twocol") {
      filtered = ALL_TEMPLATES.filter(t => t.category === "Two Column");
    } else if (layoutFilter === "creative") {
      filtered = ALL_TEMPLATES.filter(t => t.category === "Creative & Portfolio");
    }

    // Sort templates
    if (layoutSort === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return (
      <div className="flex flex-col p-6 gap-6 text-slate-200">
        
        {/* Customize Sub-tab Selector */}
        <div className="flex bg-slate-950/60 p-1 border border-slate-850 rounded-2xl">
          <button
            onClick={() => setCustomSubTab("layout")}
            className={`flex-1 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              customSubTab === "layout"
                ? "bg-white text-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Layouts
          </button>
          <button
            onClick={() => setCustomSubTab("color")}
            className={`flex-1 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              customSubTab === "color"
                ? "bg-white text-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Color
          </button>
          <button
            onClick={() => setCustomSubTab("typography")}
            className={`flex-1 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              customSubTab === "typography"
                ? "bg-white text-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Typography &amp; Density
          </button>
        </div>

        {customSubTab === "layout" ? (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Filters and Sort */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Filters</span>
                {parsedData.templateId !== initialTemplateId && (
                  <button
                    onClick={() => updateParsedData({ templateId: initialTemplateId })}
                    className="text-[9px] font-mono font-bold text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Revert layout
                  </button>
                )}
              </div>

              {/* Layout category tags */}
              <div className="flex flex-wrap gap-1.5">
                {(["all", "ats", "twocol", "creative"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLayoutFilter(cat)}
                    className={`px-3 py-1 rounded-full border text-[9px] font-mono uppercase font-bold transition-all cursor-pointer ${
                      layoutFilter === cat
                        ? "border-white bg-white text-black font-extrabold"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat === "all" ? "All" : cat === "ats" ? "ATS Friendly" : cat === "twocol" ? "Two Column" : "Creative"}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="flex justify-between items-center mt-2 border-t border-slate-900 pt-3">
                <span className="text-[9px] font-mono tracking-widest text-slate-550 uppercase">Sort Order</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLayoutSort("default")}
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer ${layoutSort === "default" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => setLayoutSort("name")}
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer ${layoutSort === "name" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
                  >
                    Name (A-Z)
                  </button>
                </div>
              </div>
            </div>

            {/* Template Gallery — 2-column grid */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {filtered.map((t) => {
                const isSelected = parsedData.templateId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => updateParsedData({ templateId: t.id })}
                    className={`flex flex-col gap-2 p-2.5 rounded-2xl border transition-all text-left cursor-pointer group ${
                      isSelected
                        ? "border-white bg-slate-900/50 shadow-lg shadow-white/5"
                        : "border-slate-800 bg-slate-950/20 hover:border-slate-700"
                    }`}
                  >
                    <PreviewErrorBoundary>
                      <TemplatePreview templateId={t.id} />
                    </PreviewErrorBoundary>
                    <div className="flex items-center justify-between px-1 pb-0.5">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider group-hover:text-white transition-colors">
                        {t.name}
                      </span>
                      {isSelected && (
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-black bg-white px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase px-1">
                      {t.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : customSubTab === "color" ? (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {templateSupportsColor ? (
              <>
                {/* Color Presets */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Accent Color</span>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {colorPresets.map((color) => (
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

                {/* Full Color Picker */}
                <div className="flex flex-col gap-3 border-t border-slate-900 pt-5">
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Custom Color</span>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={selectedColor || "#1e3a5f"}
                        onChange={(e) => updateParsedData({
                          customStyles: { ...currentStyles, primaryColor: e.target.value }
                        })}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div 
                        className="w-10 h-10 rounded-xl border border-slate-800 shadow-inner cursor-pointer"
                        style={{ backgroundColor: selectedColor || "#1e3a5f" }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400 uppercase">{selectedColor || "None selected"}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-slate-600 gap-3 border border-dashed border-slate-800 rounded-2xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-center font-bold">
                  This layout is black &amp; white only.
                </span>
                <span className="text-[9px] font-mono text-slate-700 text-center">
                  Color customization is not available for this template. Switch to a two-column or creative layout to access color options.
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Font Family Dropdown */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Font Family</span>
              <div className="relative">
                <button
                  onClick={() => setShowFontDropdown(!showFontDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-white text-xs font-mono transition-all hover:border-slate-700 cursor-pointer"
                >
                  <span className={getFontClass(selectedFont)}>{getFontLabel(selectedFont)}</span>
                  <ChevronDown className={`size-3.5 text-slate-400 transition-transform ${showFontDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showFontDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowFontDropdown(false)} />
                    <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-30 animate-scaleIn">
                      {FONT_OPTIONS.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => {
                            updateParsedData({ customStyles: { ...currentStyles, fontFamily: font.id } });
                            setShowFontDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer border-b border-slate-800/50 last:border-0 ${
                            selectedFont === font.id
                              ? "bg-slate-800 text-white"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                          }`}
                        >
                          <span className={font.className}>{font.label}</span>
                          {selectedFont === font.id && <span className="text-[8px] text-white font-bold">✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Text Density Dropdown */}
            <div className="flex flex-col gap-3 border-t border-slate-900 pt-5">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Text Density</span>
              <div className="relative">
                <button
                  onClick={() => setShowDensityDropdown(!showDensityDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-white text-xs font-mono transition-all hover:border-slate-700 cursor-pointer"
                >
                  <span>{selectedSize === "sm" ? "High Density" : selectedSize === "lg" ? "Low Density" : "Standard"}</span>
                  <ChevronDown className={`size-3.5 text-slate-400 transition-transform ${showDensityDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showDensityDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowDensityDropdown(false)} />
                    <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-30 animate-scaleIn">
                      {([
                        { id: "sm", label: "High Density", desc: "Compact text — fits more content" },
                        { id: "base", label: "Standard", desc: "Balanced text — default sizing" },
                        { id: "lg", label: "Low Density", desc: "Spacious text — more breathing room" }
                      ] as const).map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            updateParsedData({ customStyles: { ...currentStyles, fontSize: size.id } });
                            setShowDensityDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 transition-colors flex flex-col gap-0.5 cursor-pointer border-b border-slate-800/50 last:border-0 ${
                            selectedSize === size.id
                              ? "bg-slate-800 text-white"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                          }`}
                        >
                          <span className="text-xs font-mono font-bold">{size.label}</span>
                          <span className="text-[9px] text-slate-500">{size.desc}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Tab: AI Review & Tailor (merged)
  const renderAtsReviewTab = () => {
    const isBusy = isAnalyzing || isTailoring;
    return (
      <div className="flex flex-col p-6 gap-6 text-slate-200">
        
        {/* Unified Scan + Tailor card */}
        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80">
          <span className="text-[10px] font-mono tracking-widest text-white uppercase flex items-center gap-1.5 font-bold">
            <Sparkles className="size-3.5 animate-pulse" /> AI Review &amp; Tailoring Studio
          </span>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Paste your target job posting URL. Run an AI checkup to calculate your ATS match rating and revisions, or have AI automatically tailor your resume to the requirements.
          </p>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="Paste LinkedIn, Indeed or company job posting URL..."
            className="bg-slate-950/70 text-slate-100 text-xs rounded-xl border border-slate-850 p-3.5 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 font-sans transition-all placeholder:text-slate-650"
          />

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-1">
            <button
              onClick={handleRunAtsAnalysis}
              disabled={isBusy || !jobUrl.trim()}
              className="py-3 rounded-xl bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> SCANNING...
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" /> RUN AI CHECKUP
                </>
              )}
            </button>
            <button
              onClick={handleTailorResume}
              disabled={isBusy || !jobUrl.trim()}
              className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> TAILORING...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" /> START AI TAILORING
                </>
              )}
            </button>
          </div>
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
              href="/dashboard"
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
          {(["edit", "customize", "ats"] as TabType[]).map((tab) => (
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
                    className="w-full text-left px-4 py-2.5 text-xs font-mono text-slate-350 hover:text-white hover:bg-slate-955/50 transition-colors flex items-center gap-2 cursor-pointer border-b border-slate-955/20"
                  >
                    <FileText className="size-3.5 text-slate-450" /> PDF Document (.pdf)
                  </button>
                  <button
                    onClick={() => {
                      setShowDownloadDropdown(false);
                      exportAsDOCX();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-mono text-slate-350 hover:text-white hover:bg-slate-955/50 transition-colors flex items-center gap-2 cursor-pointer border-b border-slate-955/20"
                  >
                    <FileText className="size-3.5 text-slate-450" /> Word Document (.doc)
                  </button>
                  <button
                    onClick={() => {
                      setShowDownloadDropdown(false);
                      exportAsTXT();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-mono text-slate-350 hover:text-white hover:bg-slate-955/50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <File className="size-3.5 text-slate-450" /> Plain Text (.txt)
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
        </div>

        {/* Right Pane: Live Preview */}
        <div className="w-1/2 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black relative custom-scrollbar flex justify-center border-l border-slate-900/80">
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
