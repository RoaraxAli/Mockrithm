"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Globe, Briefcase, FileUp, Loader2, 
  Check, ArrowRight, ShieldAlert, Award, RefreshCw,
  FileText, Activity, CheckCircle, AlertTriangle, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveOnboardingData } from "@/lib/actions/onboarding.action";
import PDFRenderer from "@/components/resume/PDFRenderer";

// Interactive Legible Resume Preview Component
const ResumePreview = ({ data, title }: { data: any; title: string }) => {
  if (!data) return null;
  const basics = data.basics || {};
  const skills = data.skills || [];
  const work = data.work || [];
  const education = data.education || [];

  return (
    <div className="mt-4 p-5 bg-zinc-950/80 border border-zinc-900 rounded-2xl flex flex-col gap-4 text-left animate-fadeIn">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <FileText className="size-4 text-white" /> {title}
        </h4>
        {basics.email && (
          <span className="text-xs font-mono text-zinc-400">{basics.email}</span>
        )}
      </div>
      
      {/* Basics Info */}
      <div className="flex flex-col gap-1">
        <span className="text-base font-bold text-white">{basics.name || "Candidate Name"}</span>
        <span className="text-xs text-zinc-350 font-semibold uppercase tracking-wider">{basics.label || "Professional"}</span>
        {basics.summary && (
          <p className="text-xs text-zinc-350 leading-relaxed mt-2 bg-white/[0.02] p-3 rounded-xl border border-white/5 font-medium italic">
            "{basics.summary}"
          </p>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Extracted Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill: any, idx: number) => {
              const name = typeof skill === 'string' ? skill : skill.name || "";
              return name ? (
                <span key={idx} className="text-xs font-mono px-2.5 py-1 bg-zinc-900 border border-white/10 text-zinc-200 rounded">
                  {name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {work.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider border-t border-zinc-900/50 pt-3">Work History</span>
          <div className="flex flex-col gap-4">
            {work.slice(0, 3).map((job: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-start flex-wrap gap-1.5">
                  <span className="font-bold text-zinc-100">{job.position} at {job.company}</span>
                  <span className="text-xs font-mono text-zinc-400">{job.startDate} — {job.endDate || "Present"}</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-zinc-300 pl-1 mt-1">
                  {(job.highlights || []).slice(0, 3).map((h: string, hIdx: number) => (
                    <li key={hIdx} className="leading-relaxed font-medium">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface OnboardingWizardClientProps {
  userId: string;
  userName: string;
}

export default function OnboardingWizardClient({ userId, userName }: OnboardingWizardClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // States for API interactions
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Parsed and Optimized Resume Details
  const [fileName, setFileName] = useState("");
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<any>(null);
  const [fixedParsedData, setFixedParsedData] = useState<any>(null);
  const [fixedAtsAnalysis, setFixedAtsAnalysis] = useState<any>(null);
  const [summary, setSummary] = useState("");

  // Load custom handwritten font
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const getJobDescription = (targetRole: string) => {
    const roleLower = targetRole.toLowerCase();
    if (roleLower.includes("frontend") || roleLower.includes("react")) {
      return "Looking for a Frontend Developer with expertise in React, Next.js, HTML5, CSS3, Tailwind CSS, and TypeScript. Responsible for building responsive user interfaces, optimizing page loading performance, collaborating with designers, and ensuring semantic HTML and accessibility best practices.";
    }
    if (roleLower.includes("backend") || roleLower.includes("node")) {
      return "Looking for a Backend Developer with expertise in Node.js, Express, databases (SQL, NoSQL, Firestore), and system architecture. Responsible for creating high-performance APIs, database optimization, backend security, server management, and cloud integrations.";
    }
    if (roleLower.includes("software engineer") || roleLower.includes("developer")) {
      return "Looking for a Software Engineer proficient in JavaScript, React, Node.js, and TypeScript. Responsible for building scalable web applications, designing RESTful APIs, participating in code reviews, and collaborating with cross-functional teams. Experience with cloud databases, automated testing, and CI/CD pipelines is highly preferred.";
    }
    if (roleLower.includes("data scientist") || roleLower.includes("machine learning")) {
      return "Looking for a Data Scientist with expertise in Python, machine learning models, SQL, data analysis, and visualization. Responsible for parsing large data sets, building predictive algorithms, and presenting insights to stakeholders.";
    }
    if (roleLower.includes("product manager") || roleLower.includes("pm")) {
      return "Looking for a Product Manager with strong product strategy, user research, agile product development, roadmap planning, and cross-functional leadership skills. Responsible for defining product vision, analyzing product metrics, and collaborating with design and engineering teams.";
    }
    return `Looking for a skilled ${targetRole} to join our growing team. The ideal candidate will have strong expertise in the relevant field, experience with industry-standard tools, excellent problem-solving capabilities, and strong communication skills.`;
  };

  const handleUploadAndParse = async () => {
    if (!file) {
      setError("Please select a PDF resume file to continue.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setStatusText("EXTRACTING RESUME TEXT & PARSING...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process resume upload.");
      }

      const data = await res.json();
      setRawText(data.rawText);
      setParsedData(data.parsedData);
      setFileName(data.fileName);

      // Prepopulate role and country from parsing details
      if (data.parsedData?.basics?.label) {
        setRole(data.parsedData.basics.label);
      }
      if (data.parsedData?.basics?.country) {
        setCountry(data.parsedData.basics.country);
      }

      setIsProcessing(false);
      // Proceed to review details (Step 3)
      setStep(3);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
      setIsProcessing(false);
    }
  };

  const handleEvaluateAts = async () => {
    setIsProcessing(true);
    setError(null);
    setStatusText("CALCULATING ATS COMPATIBILITY...");

    try {
      const jd = getJobDescription(role);
      const res = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, jobDescription: jd }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to calculate ATS score.");
      }

      const data = await res.json();
      setAtsAnalysis(data);
      setIsProcessing(false);
      setStep(4);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during evaluation.");
      setIsProcessing(false);
    }
  };

  const handleOptimizeResume = async () => {
    setIsProcessing(true);
    setError(null);
    setStatusText("AUTO-OPTIMIZING RESUME WITH AI...");

    try {
      const jd = getJobDescription(role);
      const res = await fetch("/api/resume/autofix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData, jobDescription: jd }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to optimize resume.");
      }

      const data = await res.json();
      setFixedParsedData(data.optimizedData);

      setStatusText("RE-EVALUATING IMPROVED ATS SCORE...");
      const scoreRes = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData: data.optimizedData, jobDescription: jd }),
      });

      if (!scoreRes.ok) {
        const errorData = await scoreRes.json();
        throw new Error(errorData.error || "Failed to re-evaluate ATS score.");
      }

      const scoreData = await scoreRes.json();
      setFixedAtsAnalysis(scoreData);

      // Generate a short professional profile summary dynamically
      const changesText = `Successfully optimized resume for target role of '${role}'. Aligned key highlights under the STAR framework and integrated missing keywords: ${scoreData.missingKeywords.slice(0, 4).join(", ") || "N/A"}.`;
      setSummary(changesText);

      setStep(5);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during optimization.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsProcessing(true);
    setError(null);
    setStatusText("PERSISTING PROFILE TO DATABASE...");

    try {
      const res = await saveOnboardingData({
        userId,
        country,
        role,
        rawText,
        parsedData,
        atsAnalysis,
        fixedParsedData: fixedParsedData || parsedData,
        summary
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to save onboarding data.");
      }

      setStep(6);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Final save failed.");
      setIsProcessing(false);
    }
  };

  // Determine Graded Stamp letter based on score
  const getGradeStamp = (score: number) => {
    if (score >= 90) return { l: "A+", c: "text-emerald-500 border-emerald-500" };
    if (score >= 80) return { l: "B", c: "text-blue-500 border-blue-500" };
    if (score >= 65) return { l: "C-", c: "text-amber-500 border-amber-500" };
    if (score >= 50) return { l: "D", c: "text-orange-500 border-orange-500" };
    return { l: "F", c: "text-red-500 border-red-500" };
  };

  return (
    <div className="w-full max-w-4xl relative z-10 font-mona-sans px-2">
      <div className="backdrop-blur-2xl bg-zinc-950/45 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col gap-6">
        
        {/* Glowing aura */}
        <div className="absolute -top-40 -right-40 size-80 bg-white/[0.02] blur-[80px] rounded-full pointer-events-none" />

        {/* Step tracker dot indicator */}
        <div className="flex justify-between items-center w-full mb-2 border-b border-white/5 pb-4">
          <div className="flex flex-col">
            <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">MOCKRITHM ARCHITECTURE</span>
            <span className="text-sm font-bold text-zinc-200 uppercase tracking-wider mt-0.5">
              Career calibration
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s 
                    ? "w-6 bg-white" 
                    : step > s 
                    ? "w-2 bg-zinc-400" 
                    : "w-2 bg-zinc-800"
                }`} 
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-rose-950/20 border border-rose-500/30 text-rose-350 rounded-xl p-4 text-xs font-mono flex items-start gap-2.5 shadow-lg">
            <ShieldAlert className="size-5 shrink-0 mt-0.5 text-rose-455" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Welcome Screen */}
          {step === 1 && (
            <motion.div 
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6 max-w-xl mx-auto"
            >
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <h1 className="text-3xl font-black tracking-tight text-white font-mono leading-tight">
                  Welcome to Mockrithm, {userName}!
                </h1>
                <p className="text-base text-zinc-200 leading-relaxed font-semibold">
                  Let&apos;s build your professional career engine. We will parse your resume, assess your ATS score, automatically optimize it, and configure our AI to give you the ultimate personalized preparation experience.
                </p>
              </div>

              <div className="h-[1px] bg-zinc-900 w-full my-1" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white shrink-0">
                    <Sparkles className="size-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tailored Feedback loop</h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">Every mock interview dynamically targets your real credentials and goals.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white shrink-0">
                    <RefreshCw className="size-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Self-Improving Profile</h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">Mockrithm learns from your interview results to continuously perfect your details.</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="w-full mt-4 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Get Started
              </Button>
            </motion.div>
          )}

          {/* Resume Upload Screen (Step 2) */}
          {step === 2 && (
            <motion.div 
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6 max-w-xl mx-auto w-full"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-white">Import Your Resume</h2>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">STEP 02 OF 05</p>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed font-semibold">
                Upload your resume in PDF format. We will extract all text, structures, skills, and work highlights instantly.
              </p>

              <div 
                {...getRootProps()} 
                className={`border border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-950/50 ${
                  isDragActive ? "border-white bg-white/5" : "border-zinc-850 hover:border-white/20 hover:bg-zinc-900/50"
                }`}
              >
                <input {...getInputProps()} />
                <FileUp className="size-10 mb-4 text-zinc-400" />
                
                {file ? (
                  <div className="flex flex-col gap-1.5 items-center">
                    <span className="text-sm font-bold text-white">{file.name}</span>
                    <span className="text-xs font-mono text-zinc-350">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    <span className="text-sm font-bold text-zinc-200">Drag & drop your resume PDF here</span>
                    <span className="text-xs font-mono text-zinc-400">or click to browse local files (Max 5MB)</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border border-zinc-850 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-200 cursor-pointer"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleUploadAndParse}
                  disabled={!file || isProcessing}
                  className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="size-4 animate-spin" /> Ingestion...
                    </span>
                  ) : (
                    "Upload and Parse"
                  )}
                </Button>
              </div>

              {isProcessing && (
                <div className="text-center font-mono text-xs text-zinc-400 uppercase tracking-widest mt-2 animate-pulse">
                  // {statusText}
                </div>
              )}
            </motion.div>
          )}

          {/* Review Parsed Details Screen (Step 3) */}
          {step === 3 && parsedData && (
            <motion.div 
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Review Extracted Details</h2>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">STEP 03 OF 05</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Auto-Populated Inputs & Extracted Fields List */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  
                  <div className="p-5 bg-white/[0.015] border border-white/5 rounded-2xl flex flex-col gap-4">
                    <span className="text-xs font-bold uppercase text-white tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="size-4 text-white" /> Calibration Calibration
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                      We auto-detected these details from your resume. Adjust them if they are incorrect before calculating your ATS score.
                    </p>

                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                          <Briefcase className="size-4 text-white" /> Target Job Role
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. Software Engineer"
                          className="bg-zinc-950 text-white text-xs rounded-xl p-3 border border-zinc-900 focus:border-zinc-700 outline-none leading-relaxed font-semibold transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                          <Globe className="size-4 text-white" /> Target Country
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. United States"
                          className="bg-zinc-950 text-white text-xs rounded-xl p-3 border border-zinc-900 focus:border-zinc-700 outline-none leading-relaxed font-semibold transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Complete list of extracted values by heading */}
                  <div className="flex flex-col gap-4 p-5 bg-zinc-950 border border-zinc-900 rounded-2xl max-h-[300px] overflow-y-auto">
                    <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Extracted Heading Fields</span>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-xs font-bold text-white uppercase block">Basics</span>
                        <span className="text-xs text-zinc-300 leading-relaxed mt-0.5 block font-semibold">
                          Name: {parsedData.basics?.name || "N/A"} • Email: {parsedData.basics?.email || "N/A"}
                        </span>
                      </div>

                      <div className="h-[1px] bg-zinc-900 w-full" />

                      <div>
                        <span className="text-xs font-bold text-white uppercase block">Professional Summary</span>
                        <p className="text-xs text-zinc-400 leading-relaxed mt-0.5 line-clamp-3 font-semibold">
                          {parsedData.basics?.summary || "N/A"}
                        </p>
                      </div>

                      <div className="h-[1px] bg-zinc-900 w-full" />

                      <div>
                        <span className="text-xs font-bold text-white uppercase block">Inferred Skills ({parsedData.skills?.length || 0})</span>
                        <p className="text-xs text-zinc-300 leading-relaxed mt-0.5 line-clamp-2 font-semibold">
                          {parsedData.skills?.join(", ") || "N/A"}
                        </p>
                      </div>

                      <div className="h-[1px] bg-zinc-900 w-full" />

                      <div>
                        <span className="text-xs font-bold text-white uppercase block">Work Experience</span>
                        <p className="text-xs text-zinc-300 leading-relaxed mt-0.5 block font-semibold">
                          {parsedData.work?.map((w: any) => `${w.position} at ${w.company}`).join(" | ") || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Detailed visual preview */}
                <div className="lg:col-span-6 flex flex-col gap-4">
                  <ResumePreview data={parsedData} title="Structured Resume Preview" />
                </div>
              </div>

              <div className="flex gap-4 border-t border-white/5 pt-4">
                <Button 
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border border-zinc-850 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-200 cursor-pointer"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleEvaluateAts}
                  disabled={isProcessing}
                  className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="size-4 animate-spin" /> Scoring...
                    </span>
                  ) : (
                    "Evaluate ATS Match"
                  )}
                </Button>
              </div>

              {isProcessing && (
                <div className="text-center font-mono text-xs text-zinc-400 uppercase tracking-widest mt-1 animate-pulse">
                  // {statusText}
                </div>
              )}
            </motion.div>
          )}

          {/* ATS Diagnostics (Step 4: Graded/Marked Paper View) */}
          {step === 4 && atsAnalysis && (
            <motion.div 
              key="step-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">ATS Diagnostics & Feedback</h2>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">STEP 04 OF 05</p>
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="size-10 animate-spin text-white" />
                  <span className="font-mono text-xs tracking-widest text-zinc-300">{statusText}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Side: Score card & Feedback notes */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Graded Circle Stamp */}
                    <div className="p-6 bg-rose-950/10 border border-rose-500/20 rounded-2xl flex flex-col items-center gap-4 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 bg-red-500/10 text-red-400 text-[10px] font-mono uppercase tracking-wider border-b border-l border-red-500/20 rounded-bl-lg">
                        Correction Phase
                      </div>
                      
                      <span className="text-xs font-mono uppercase tracking-wider text-rose-350">ATS Compliance Grade</span>
                      
                      <div className={`size-28 rounded-full border-4 flex items-center justify-center font-bold text-4xl rotate-[-8deg] shadow-lg font-mono ${getGradeStamp(atsAnalysis.atsScore).c} bg-zinc-950/60`}>
                        {getGradeStamp(atsAnalysis.atsScore).l}
                      </div>

                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-2xl font-black text-white font-mono">{atsAnalysis.atsScore}% Score</span>
                        <p className="text-xs text-zinc-300 font-semibold leading-relaxed max-w-xs mt-1">
                          Your resume requires critical corrections to align with requirements for a <span className="font-bold text-white">#{role}</span>.
                        </p>
                      </div>
                    </div>

                    {/* Score Explanation Callout */}
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="size-4 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">Why is my score {atsAnalysis.atsScore}%?</span>
                      </div>
                      <p className="text-[11px] text-zinc-350 leading-relaxed font-semibold">
                        Since your uploaded resume has sparse content (e.g. very brief experience or few projects), the initial compliance score is low.
                        We do not fabricate fake jobs or credentials. Optimizing it in the next step will align your existing details to the STAR framework and add key skills, boosting your score up to around 58%. To get a 90%+ score, you should add more project achievements and job descriptions once you reach your dashboard.
                      </p>
                    </div>

                    {/* Auto-Fix Callout Card */}
                    <div className="p-5 bg-white/[0.01] border border-white/10 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4.5 text-white animate-pulse" />
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Optimization</h4>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                        We can automatically fix these corrections by integrating missing keywords, restructuring highlights under the STAR framework, and strengthening summaries.
                      </p>
                      
                      <Button 
                        onClick={handleOptimizeResume}
                        disabled={isProcessing}
                        className="w-full mt-2 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="size-4" /> Auto-Fix Resume
                      </Button>
                    </div>

                    <Button 
                      onClick={() => setStep(3)}
                      variant="outline"
                      className="w-full h-11 rounded-xl border border-zinc-850 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-200 cursor-pointer"
                    >
                      Back to Review details
                    </Button>
                  </div>

                  {/* Right Side: Graded PDF copy view with corrections */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">ATS Marked Resume Preview</span>
                    <PDFRenderer data={parsedData} mode="diagnostic" atsAnalysis={atsAnalysis} />
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* Outcome & Summary Screen (Step 5: Everything Fixed) */}
          {step === 5 && fixedAtsAnalysis && (
            <motion.div 
              key="step-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">Polished and Optimised Profile</h2>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-mono">STEP 05 OF 05</p>
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="size-10 animate-spin text-white" />
                  <span className="font-mono text-xs tracking-widest text-zinc-300">{statusText}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Side: Score calibration & Onboarding complete actions */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Score comparison gauge */}
                    <div className="p-6 bg-emerald-950/15 border border-emerald-900/30 rounded-2xl flex flex-col items-center gap-4 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono uppercase tracking-wider border-b border-l border-emerald-500/20 rounded-bl-lg">
                        Final Score
                      </div>

                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Calibration Successful</span>

                      <div className={`size-28 rounded-full border-4 flex items-center justify-center font-bold text-4xl rotate-[-4deg] shadow-lg font-mono ${getGradeStamp(fixedAtsAnalysis.atsScore).c} bg-zinc-950/60`}>
                        {getGradeStamp(fixedAtsAnalysis.atsScore).l}
                      </div>

                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-2xl font-black text-white font-mono">{fixedAtsAnalysis.atsScore}% Score</span>
                        <p className="text-xs text-zinc-300 font-semibold leading-relaxed max-w-xs mt-1">
                          Excellent! Your resume details have been optimized and are fully calibrated for a <span className="font-bold text-white">#{role}</span> profile.
                        </p>
                      </div>
                    </div>

                    {/* Final Score Explanation Callout */}
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="size-4 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">Why is the new score {fixedAtsAnalysis.atsScore}%?</span>
                      </div>
                      <p className="text-[11px] text-zinc-350 leading-relaxed font-semibold">
                        Your score improved because we optimized your current summary, restructured accomplishments to use metrics/STAR frameworks, and added missing keywords.
                        Since we do not fabricate fake content (like companies or certifications), the score maxes out at the limits of your uploaded details. To reach a 90%+ score, simply update your profile on the dashboard with additional experiences and projects.
                      </p>
                    </div>

                    {/* Summary list of changes */}
                    <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col gap-2">
                      <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase flex items-center gap-1">
                        <CheckCircle className="size-4 text-emerald-400" /> Optimization Changes
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-semibold mt-1">
                        {summary}
                      </p>
                    </div>

                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-2.5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Calibration Ingest Complete</h4>
                      <p className="text-xs text-zinc-350 leading-relaxed font-semibold">
                        Click complete to persist this profile to the database. These details will serve as instructions to tailor AI mock interviews.
                      </p>
                    </div>

                    <Button 
                      onClick={handleCompleteOnboarding}
                      className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Complete Onboarding {"→"}
                    </Button>
                  </div>

                  {/* Right Side: Clean, Optimized Resume Preview (Everything Fixed) */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Optimized Resume Preview</span>
                    <PDFRenderer data={fixedParsedData} mode="optimized" atsAnalysis={atsAnalysis} />
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* Success Screen */}
          {step === 6 && (
            <motion.div 
              key="step-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-10 gap-4 max-w-xl mx-auto"
            >
              <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-2 shadow-2xl relative">
                <div className="absolute inset-0 bg-white/5 rounded-full blur animate-ping" />
                <Check className="size-8" />
              </div>
              <h2 className="text-2xl font-black text-white font-mono">Onboarding Success!</h2>
              <p className="text-sm text-zinc-300 font-semibold max-w-sm">
                Your profile has been saved. We are preparing your interactive dashboard...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
