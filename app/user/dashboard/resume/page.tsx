import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserResumes } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus, Activity, ArrowRight, Calendar } from "lucide-react";
import WorkspaceGateway from "@/components/resume/WorkspaceGateway";
import { Sidebar } from "@/app/user/components/Sidebar";
import HeroSection from "@/components/resume/HeroSection";

export default async function ResumeDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const resumes = await getUserResumes(user.id);

  // 1. Onboarding Mode (0 resumes): Fullscreen, no sidebar, responsive padding, no scroll unless overflows
  if (resumes.length === 0) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 sm:p-6 md:p-8">
        <WorkspaceGateway />
      </div>
    );
  }

  // 2. Dashboard Mode (1+ resumes): Render with the standard Sidebar layout manually
  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-transparent">
        <div className="p-8 max-w-6xl mx-auto w-full font-mona-sans animate-fadeIn">
          <HeroSection />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => {
              const atsScore = resume.atsAnalysis?.atsScore || 0;
              const date = new Date(resume.createdAt).toLocaleDateString();

              return (
                <div
                  key={resume.id}
                  className="flex flex-col gap-4 p-5 backdrop-blur-xl bg-slate-950/60 border border-slate-800 hover:border-white/20 rounded-2xl transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <FileText className="size-3.5 text-white" />
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
                      <span
                        className={`text-2xl font-black font-mono ${atsScore >= 80 ? "text-white" : atsScore >= 60 ? "text-gray-300" : "text-gray-500"}`}
                      >
                        {atsScore}%
                      </span>
                    </div>

                    <Link
                      href={`/user/dashboard/resume/analysis/${resume.id}`}
                      className="flex items-center gap-1 text-[10px] font-mono font-bold text-white uppercase tracking-wider group-hover:text-gray-300 transition-colors"
                    >
                      VIEW REPORT <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
