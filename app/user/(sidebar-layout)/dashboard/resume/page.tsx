import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserResumes } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus, Activity, ArrowRight, Calendar } from "lucide-react";

export default async function ResumeDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const resumes = await getUserResumes(user.id);

  return (
    <div className="flex flex-col gap-8 font-mona-sans max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-white">Resume Dashboard</h2>
          <p className="text-sm text-light-100">
            Manage your parsed resumes, view ATS scores, and optimize your profile for applications.
          </p>
        </div>
        
        <Link 
          href="/user/dashboard/resume/upload" 
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] w-fit uppercase tracking-wider text-xs font-mono"
        >
          <Plus className="size-4" /> UPLOAD NEW RESUME
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 backdrop-blur-xl bg-slate-950/40 border border-slate-800 rounded-2xl border-dashed">
            <FileText className="size-12 text-slate-600 mb-4" />
            <p className="text-slate-400 font-semibold">No resumes parsed yet.</p>
            <p className="text-sm text-slate-500 mb-6">Upload a PDF to get your first ATS analysis.</p>
            <Link 
              href="/user/dashboard/resume/upload" 
              className="text-cyan-400 font-mono text-xs font-bold hover:underline"
            >
              START PARSING &rarr;
            </Link>
          </div>
        ) : (
          resumes.map((resume) => {
            const atsScore = resume.atsAnalysis?.atsScore || 0;
            const date = new Date(resume.createdAt).toLocaleDateString();

            return (
              <div 
                key={resume.id}
                className="flex flex-col gap-4 p-5 backdrop-blur-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    <FileText className="size-3.5 text-cyan-400" />
                    <span className="text-[10px] font-mono font-bold text-slate-300 truncate max-w-[120px]">
                      {resume.fileName}
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
                    <span className={`text-2xl font-black font-mono ${atsScore >= 80 ? 'text-emerald-400' : atsScore >= 60 ? 'text-cyan-400' : 'text-rose-400'}`}>
                      {atsScore}%
                    </span>
                  </div>
                  
                  <Link 
                    href={`/user/dashboard/resume/analysis/${resume.id}`}
                    className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider group-hover:text-cyan-300 transition-colors"
                  >
                    VIEW REPORT <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
