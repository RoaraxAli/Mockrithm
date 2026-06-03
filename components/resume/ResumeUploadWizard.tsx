"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, FileText, Loader2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { saveParsedResume } from "@/lib/actions/resume.action";

export default function ResumeUploadWizard({ userId }: { userId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

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

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      setError("Please upload a PDF resume first.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Step 1: Upload and Parse PDF
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

      const { rawText, parsedData, fileName } = await uploadRes.json();

      // Step 2: ATS Scoring
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

      const atsAnalysis = await scoreRes.json();

      // Step 3: Save to Firestore
      setStatusText("SECURING DATA...");
      const saveRes = await saveParsedResume({
        userId,
        fileName,
        rawText,
        parsedData,
        atsAnalysis
      });

      if (!saveRes.success || !saveRes.resumeId) {
        throw new Error(saveRes.error || "Failed to save resume securely.");
      }

      const { resumeId } = saveRes;

      // Step 4: Redirect to resume builder workspace
      router.push(`/user/dashboard/resume/workspace/${resumeId}`);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 font-mona-sans">
      
      {/* Header Deck */}
      <div className="w-full backdrop-blur-md bg-slate-950/40 border border-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
        
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono tracking-[0.2em] text-slate-500 uppercase">DOCUMENT INGESTION</span>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center gap-2">
            <FileUp className="size-5 text-white" />
            RESUME PARSER PIPELINE
          </h2>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-6 font-mono text-[10px] sm:text-xs">
          <div className={cn("flex items-center gap-2 transition-all duration-300", step === 1 ? "text-white font-bold" : "text-gray-400")}>
            <span className={cn("size-6 rounded-full flex items-center justify-center border font-bold text-[9px] transition-all duration-300", step === 1 ? "border-white/50 bg-white/10 text-white" : "border-gray-500/50 bg-gray-900/30 text-gray-400")}>
              {step > 1 ? "✓" : "01"}
            </span>
            <span className="hidden sm:inline">UPLOAD</span>
          </div>
          <div className="w-6 h-[1px] bg-slate-800" />
          <div className={cn("flex items-center gap-2 transition-all duration-300", step === 2 ? "text-white font-bold" : "text-slate-600")}>
            <span className={cn("size-6 rounded-full flex items-center justify-center border font-bold text-[9px] transition-all duration-300", step === 2 ? "border-white/50 bg-white/10 text-white" : "border-slate-800 text-slate-600")}>
              02
            </span>
            <span className="hidden sm:inline">TARGETS</span>
          </div>
        </div>
      </div>

      {/* Error Output */}
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
              <strong className="uppercase">SYSTEM_ERROR // </strong> {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col gap-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-slate-700" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-slate-700" />
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-slate-700" />
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-slate-700" />

          {step === 1 ? (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <h3 className="text-[11px] font-mono font-bold text-slate-300 tracking-[0.2em] uppercase flex items-center gap-2">
                <FileText className="size-4.5 text-white" />
                DROPZONE PORTAL
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Upload your resume in PDF format. The parsing engine will extract text and map your professional history into structured data.
              </p>
              
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-slate-950/50",
                  isDragActive ? "border-white bg-white/5" : "border-slate-800 hover:border-white/20 hover:bg-slate-900/50",
                  file ? "border-gray-500/50 bg-gray-900/10" : ""
                )}
              >
                <input {...getInputProps()} />
                <FileUp className={cn("size-10 mb-4 transition-colors", file ? "text-white" : isDragActive ? "text-white" : "text-slate-600")} />
                
                {file ? (
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm font-bold text-white">{file.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • READY FOR EXTRACTION</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-sm font-bold text-slate-300">Drag & drop your PDF resume here</span>
                    <span className="text-[10px] font-mono text-slate-500">or click to browse local files (Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <h3 className="text-[11px] font-mono font-bold text-slate-300 tracking-[0.2em] uppercase flex items-center gap-2">
                <Sparkles className="size-4.5 text-white" />
                TARGET JOB DESCRIPTION (OPTIONAL)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                To receive a precise ATS score, paste the job description you are targeting. You can skip this to get a general baseline score.
              </p>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements here..."
                rows={10}
                className="bg-slate-950/80 text-white text-xs rounded-lg p-3.5 border border-slate-800 focus:border-white/40 focus:ring-1 focus:ring-white/10 outline-none resize-none placeholder:text-slate-700 leading-relaxed font-mono"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="p-6 backdrop-blur-xl bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col gap-4 shadow-xl">
            <span className="text-[8px] font-mono tracking-widest text-white uppercase">// INSTRUCTIONS</span>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {step === 1 ? "File Requirements" : "Execution Protocol"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              {step === 1 
                ? "Ensure your resume is a readable PDF. Image-based or heavily formatted PDFs might reduce extraction accuracy."
                : "The system will extract text, parse into structured JSON, perform ATS scoring, and save to your dashboard."
              }
            </p>
          </div>

          {step === 1 ? (
            <Button
              onClick={() => { if (file) setStep(2); else setError("Please upload a file first."); }}
              className="w-full h-12 rounded-lg bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider"
            >
              PROCEED <ArrowRight className="size-4" />
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleUploadAndAnalyze}
                disabled={isUploading}
                className={cn(
                  "w-full h-12 rounded-lg bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider",
                  isUploading && "opacity-75 cursor-not-allowed"
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-black" />
                    {statusText || "PROCESSING..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 text-black animate-pulse" />
                    INITIATE PARSING
                  </>
                )}
              </Button>
              <Button
                onClick={() => setStep(1)}
                disabled={isUploading}
                variant="outline"
                className="w-full h-12 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-900 font-mono font-bold text-xs uppercase tracking-wider"
              >
                BACK TO UPLOAD
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
