"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserResumes } from "@/lib/actions/resume.action";
import { FileText, Plus, Calendar, Loader2, ArrowRight, Sparkles, UploadCloud, LayoutTemplate } from "lucide-react";
import Link from "next/link";

export function UserResumePanel() {
  const { isLoaded, user } = useUser();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumes() {
      if (!isLoaded || !user) return;
      try {
        setLoading(true);
        const data = await getUserResumes(user.id);
        setResumes(data);
      } catch (err: any) {
        console.error("Error fetching resumes:", err);
        setError("Failed to load resumes");
      } finally {
        setLoading(false);
      }
    }
    fetchResumes();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center py-16 text-zinc-400 font-sans">
        <Loader2 className="size-5 animate-spin mr-2 text-zinc-300" />
        <span className="text-[10px] uppercase tracking-widest font-bold font-mono">Loading saved resumes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 text-red-400 text-xs font-mono text-center">
        [Error: {error}]
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-1 w-full font-sans animate-fadeIn text-zinc-300 bg-transparent selection:bg-zinc-850">
      
      {/* Premium Compact Header */}
      <div className="flex flex-col gap-2 border-b border-zinc-900 pb-5">
        <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-500 font-mono">
          Calibration Desk
        </span>
        <h2 className="text-2xl font-light tracking-tight text-white leading-none">
          Resume Desk
        </h2>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
          Create tailored, ATS-optimized profiles and templates for mock simulator runs.
        </p>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/user/dashboard/resume/templates"
          className="flex items-center justify-center gap-3 bg-white text-black font-semibold text-[10px] uppercase tracking-wider h-11 px-5 rounded-xl hover:bg-zinc-200 transition-all duration-300 border border-white"
        >
          <LayoutTemplate className="size-4" /> 
          Choose Template
        </Link>
        <Link
          href="/user/dashboard/resume/upload"
          className="flex items-center justify-center gap-3 bg-black hover:bg-zinc-900 text-zinc-300 hover:text-white font-semibold text-[10px] uppercase tracking-wider h-11 px-5 rounded-xl transition-all duration-300 border border-zinc-850"
        >
          <UploadCloud className="size-4" /> 
          Import PDF Resume
        </Link>
      </div>

      {/* Resumes List Container */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest font-mono flex items-center gap-2">
          <FileText className="size-3.5" /> Saved Records
        </h3>

        {resumes.length === 0 ? (
          <div className="flex flex-col gap-3 py-10 px-6 border border-dashed border-zinc-850 rounded-2xl items-center justify-center text-center bg-zinc-950/10">
            <FileText className="size-6 text-zinc-700" />
            <p className="text-xs text-zinc-500 font-light">
              No saved resume records found. Choose an option above to build one.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 w-full">
            {resumes.map((resume) => {
              const atsScore = resume.atsAnalysis?.atsScore || 0;
              const date = new Date(resume.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <div
                  key={resume.id}
                  className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 p-4.5 bg-zinc-950/20 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-all duration-300"
                >
                  {/* Left Side: Metadata */}
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-zinc-300" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                        {resume.fileName || "Untitled Resume"}
                      </span>
                      <span className="text-[8.5px] font-mono font-bold text-zinc-500 uppercase flex items-center gap-1 mt-0.5">
                        <Calendar className="size-3" />
                        {date}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Score & Links */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-zinc-900/60 pt-3 sm:pt-0 sm:border-t-0">
                    {/* Score Badge */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7.5px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                        ATS SCORE
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-300 leading-none">
                        {atsScore}%
                      </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/user/dashboard/resume/workspace/${resume.id}`}
                        className="text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 hover:text-zinc-300 transition-colors"
                      >
                        workspace <ArrowRight className="size-3" />
                      </Link>
                      <Link
                        href={`/user/dashboard/resume/analysis/${resume.id}`}
                        className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors"
                      >
                        report <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
