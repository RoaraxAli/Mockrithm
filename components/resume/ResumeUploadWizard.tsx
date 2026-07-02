"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, FileText, Loader2, Sparkles, AlertCircle, ArrowRight, Check, Activity, ShieldAlert, Award, RefreshCw, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { saveParsedResume } from "@/lib/actions/resume.action";
import PDFRenderer from "@/components/resume/PDFRenderer";
import EmbeddedPlanSelector from "@/components/resume/EmbeddedPlanSelector";

export default function ResumeUploadWizard({ userId }: { userId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [country, setCountry] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Extracted Data and ATS analysis states
  const [parsedData, setParsedData] = useState<any>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<any>(null);
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isFixing, setIsFixing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropRejected: (fileRejections) => {
      setError(fileRejections[0].errors[0].message);
    }
  });

  const handleUploadAndParse = async () => {
    if (!file) {
      setError("Please upload a PDF resume first.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      setStatusText("EXTRACTING TEXT & PARSING PDF...");
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || "Failed to process PDF.");
      }

      const res = await uploadRes.json();
      setRawText(res.rawText);
      setParsedData(res.parsedData);
      setFileName(res.fileName);

      setStep(3); // Go to Visual Previewing Step
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAtsEvaluation = async () => {
    try {
      setIsUploading(true);
      setError(null);
      setStatusText("CALCULATING ATS METRICS...");

      const scoreRes = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, jobDescription }),
      });

      if (!scoreRes.ok) {
        const errorData = await scoreRes.json();
        throw new Error(errorData.error || "Failed to analyze resume.");
      }

      const analysis = await scoreRes.json();
      setAtsAnalysis(analysis);
      setStep(4); // Go to Advanced ATS SIM Step
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAutoFix = async () => {
    try {
      setIsFixing(true);
      setError(null);
      
      const res = await fetch("/api/resume/autofix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, jobDescription }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to auto-optimize resume.");
      }

      const data = await res.json();
      setParsedData(data.optimizedData);
      
      // Re-trigger ATS score check after fixing
      setStatusText("RE-EVALUATING IMPROVEMENTS...");
      const scoreRes = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData: data.optimizedData, jobDescription }),
      });

      if (scoreRes.ok) {
        const newAnalysis = await scoreRes.json();
        setAtsAnalysis(newAnalysis);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during optimization.");
    } finally {
      setIsFixing(false);
    }
  };

  const handleSaveAndOnboard = async (tier: "freemium" | "premium" | "pro") => {
    try {
      setIsUploading(true);
      setStatusText("FINALIZING PROFILE & SAVING...");

      const saveRes = await saveParsedResume({
        userId,
        fileName,
        rawText,
        parsedData,
        atsAnalysis,
        country
      });

      if (!saveRes.success || !saveRes.resumeId) {
        throw new Error(saveRes.error || "Failed to save profile details.");
      }

      router.push(`/user/dashboard/resume`);
    } catch (err: any) {
      setError(err.message || "Final save failed.");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 font-mona-sans">
      
      {/* Step Tracker Indicator */}
      <div className="w-full backdrop-blur-md bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">ONBOARDING PROFILE ENGINE</span>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center gap-2">
            <FileUp className="size-5 text-white" />
            RESUME PIPELINE
          </h2>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 font-mono text-[9px] sm:text-xs flex-wrap">
          {[
            { s: 1, label: "UPLOAD" },
            { s: 2, label: "JD TARGET" },
            { s: 3, label: "VISUAL" },
            { s: 4, label: "ATS REPORT" },
            { s: 5, label: "TIER" }
          ].map((item) => (
            <div key={item.s} className="flex items-center gap-2">
              <span className={cn(
                "size-6 rounded-full flex items-center justify-center border font-bold text-[9px] transition-all",
                step >= item.s ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-950 text-zinc-500"
              )}>
                {step > item.s ? "✓" : `0${item.s}`}
              </span>
              <span className={cn("hidden md:inline", step === item.s ? "text-white font-bold" : "text-zinc-500")}>
                {item.label}
              </span>
              {item.s < 5 && <div className="w-4 h-[1px] bg-zinc-800" />}
            </div>
          ))}
        </div>
      </div>

      {/* Error Output */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-rose-950/30 border border-rose-500/30 text-rose-450 rounded-xl p-4 text-xs flex gap-3 items-start font-mono shadow-lg"
          >
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <span>
              <strong className="uppercase">PIPELINE_ERROR // </strong> {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 p-6 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-3xl flex flex-col gap-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <h3 className="text-[11px] font-mono font-bold text-zinc-400 tracking-[0.2em] uppercase flex items-center gap-2">
                <FileText className="size-4.5 text-white" />
                INGESTION GATE
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                Upload your resume in PDF format. The parsing engine will extract text and map your professional history into structured data.
              </p>
              
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-950/50",
                  isDragActive ? "border-white bg-white/5" : "border-zinc-800 hover:border-white/20 hover:bg-zinc-900/50",
                  file ? "border-zinc-500 bg-zinc-900/10" : ""
                )}
              >
                <input {...getInputProps()} />
                <FileUp className={cn("size-10 mb-4 transition-colors", file ? "text-white" : isDragActive ? "text-white" : "text-zinc-600")} />
                
                {file ? (
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm font-bold text-white">{file.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB • READY FOR EXTRACTION</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm font-bold text-zinc-300">Drag & drop your PDF resume here</span>
                    <span className="text-[10px] font-mono text-zinc-500">or click to browse local files (Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <h3 className="text-[11px] font-mono font-bold text-zinc-400 tracking-[0.2em] uppercase flex items-center gap-2">
                <Sparkles className="size-4.5 text-white" />
                TARGET JD CALIBRATION
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                To evaluate ATS score precisely, enter your country and target job requirements.
              </p>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="size-3.5" /> Target / Residence Country
                </label>
                <input
                  type="text"
                  placeholder="e.g. United States, United Kingdom, Canada"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-zinc-950/80 text-white text-xs rounded-xl p-3 border border-zinc-900 focus:border-zinc-700 outline-none leading-relaxed font-mono"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Job Description / Requirements</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                  className="bg-zinc-950/80 text-white text-xs rounded-xl p-3.5 border border-zinc-900 focus:border-zinc-700 outline-none resize-none placeholder:text-zinc-800 leading-relaxed font-mono"
                />
              </div>
            </div>
          )}

          {step === 3 && parsedData && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <h3 className="text-[11px] font-mono font-bold text-zinc-400 tracking-[0.2em] uppercase">
                PIXEL-PERFECT TEMPLATE RENDERING
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                Below is a rendering of the parsed data in our premium ATS minimalist template.
              </p>
              <PDFRenderer data={parsedData} />
            </div>
          )}

          {step === 4 && atsAnalysis && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-zinc-900 pb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Advanced ATS Simulation Report</h3>
                  <p className="text-xs text-zinc-450">Complete match metrics check</p>
                </div>
                
                {/* Radial Score Gauge */}
                <div className="relative size-24 flex items-center justify-center flex-shrink-0">
                  <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="stroke-zinc-900" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path
                      className={cn(atsAnalysis.atsScore >= 85 ? "stroke-emerald-400" : atsAnalysis.atsScore >= 60 ? "stroke-white" : "stroke-zinc-600")}
                      strokeWidth="3"
                      strokeDasharray={`${atsAnalysis.atsScore}, 100`}
                      fill="none"
                      strokeLinecap="round"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-xl font-mono font-black text-white">{atsAnalysis.atsScore}%</div>
                </div>
              </div>

              {/* Keyword Diagnostic metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-3">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-455 flex items-center gap-1">
                    <ShieldAlert className="size-4 shrink-0 text-rose-400" /> MISSING KEYWORDS
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto">
                    {atsAnalysis.missingKeywords.length > 0 ? (
                      atsAnalysis.missingKeywords.map((kw: string, i: number) => (
                        <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-zinc-950 border border-rose-500/20 text-rose-400 rounded">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono">No missing keywords!</span>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-3">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white flex items-center gap-1">
                    <Award className="size-4 shrink-0 text-white" /> FORMATTING QUALITY
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
                    {atsAnalysis.formattingQuality}
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-emerald-950/10 border border-emerald-900/30 rounded-2xl flex flex-col gap-3">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400">• STRENGTHS</span>
                  <ul className="space-y-1.5">
                    {atsAnalysis.strengths.slice(0, 3).map((str: string, i: number) => (
                      <li key={i} className="text-[10px] text-zinc-400 leading-relaxed font-semibold flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-rose-950/10 border border-rose-900/30 rounded-2xl flex flex-col gap-3">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-400">• WEAKNESSES</span>
                  <ul className="space-y-1.5">
                    {atsAnalysis.weaknesses.slice(0, 3).map((w: string, i: number) => (
                      <li key={i} className="text-[10px] text-zinc-400 leading-relaxed font-semibold flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Auto Fix Module Trigger */}
              <div className="p-6 bg-white/[0.01] border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="size-4 text-white" /> God-Tier Optimizations
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-md">
                    Instantly rewrite and format your experience descriptions to structure achievements under the STAR framework and integrate missing keywords. Target Score: 95%+ Match.
                  </p>
                </div>
                
                <Button
                  onClick={handleAutoFix}
                  disabled={isFixing}
                  className="bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider h-11 px-6 rounded-xl flex-shrink-0 flex items-center gap-2"
                >
                  {isFixing ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" /> Rewriting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" /> Auto-Fix Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fadeIn">
              <EmbeddedPlanSelector userId={userId} onSelected={handleSaveAndOnboard} />
            </div>
          )}

        </div>

        {/* Right side options: Control protocol decks */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col gap-4 shadow-xl">
            <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase">// PIPELINE RULES</span>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {step === 1 ? "File Policy" : step === 2 ? "Calibration Policy" : "Simulation Guidance"}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
              {step === 1 
                ? "Upload a readable PDF resume. Highly visual or graphical designs will be mapped clean for optimal ATS ingestion."
                : step === 2 
                ? "Specifying target country and description parameters permits the analyzer to trace target keywords."
                : "Verify the rendered layout. Our templates are guaranteed to achieve high parsing yields in major ATS systems."
              }
            </p>
          </div>

          {step === 1 && (
            <Button
              onClick={handleUploadAndParse}
              disabled={isUploading || !file}
              className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-4 animate-spin text-black" />
                  {statusText}
                </>
              ) : (
                <>
                  EXTRACT DATA <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAtsEvaluation}
                disabled={isUploading}
                className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-black" />
                    {statusText}
                  </>
                ) : (
                  <>
                    EVALUATE ATS MATCH <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full h-12 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Back
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setStep(2)}
                className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                PROCEED TO ATS EVAL <ArrowRight className="size-4" />
              </Button>
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="w-full h-12 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Back
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setStep(5)}
                className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                CHOOSE MEMBERSHIP TIER <ArrowRight className="size-4" />
              </Button>
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="w-full h-12 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Back
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
