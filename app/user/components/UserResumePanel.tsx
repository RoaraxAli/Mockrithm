"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserResumes } from "@/lib/actions/resume.action";
import { FileText, Plus, Activity, ArrowRight, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import WorkspaceGateway from "@/components/resume/WorkspaceGateway";
import HeroSection from "@/components/resume/HeroSection";

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
      <div className="flex justify-center items-center py-12 text-zinc-400 font-mona-sans">
        <Loader2 className="size-6 animate-spin mr-2" />
        <span className="text-xs uppercase tracking-wider font-bold">Loading saved resumes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mona-sans">
        {error}
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col gap-6 w-full min-h-[50vh] items-center justify-center p-4">
        <WorkspaceGateway />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-2 max-w-6xl mx-auto w-full font-mona-sans animate-fadeIn text-white">
      <HeroSection />

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <FileText className="size-4" /> Your Saved Resumes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => {
            const atsScore = resume.atsAnalysis?.atsScore || 0;
            const date = new Date(resume.createdAt).toLocaleDateString();

            return (
              <div
                key={resume.id}
                className="flex flex-col gap-5 p-6 backdrop-blur-xl bg-slate-950/60 border border-slate-850 hover:border-white/20 rounded-2xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    <FileText className="size-3.5 text-white" />
                    <span className="text-[10px] font-mono font-bold text-slate-300 truncate max-w-[120px]">
                      {resume.fileName || "Untitled Resume"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase">
                    <Calendar className="size-3.5" />
                    {date}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Activity className="size-3" /> ATS SCORE
                    </span>
                    <span
                      className={`text-2xl font-black font-mono ${atsScore >= 80 ? "text-white" : atsScore >= 60 ? "text-gray-300" : "text-gray-500"}`}
                    >
                      {atsScore}%
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <Link
                      href={`/user/dashboard/resume/workspace/${resume.id}`}
                      className="flex items-center gap-1 text-[10px] font-mono font-bold text-white uppercase tracking-wider group-hover:text-gray-300 transition-colors"
                    >
                      EDIT RESUME <ArrowRight className="size-3" />
                    </Link>
                    <Link
                      href={`/user/dashboard/resume/analysis/${resume.id}`}
                      className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
                    >
                      VIEW REPORT <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create New Resume Card */}
          <Link 
            href="/user/dashboard/resume/welcome" 
            className="border border-dashed border-zinc-800 hover:border-white/20 hover:bg-zinc-950/40 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-500 hover:text-white transition-all group min-h-[160px]"
          >
            <Plus className="size-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Create New Resume</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
