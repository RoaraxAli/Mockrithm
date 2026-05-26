import AtsScoreDashboard from "@/components/resume/AtsScoreDashboard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getResumeById } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ResumeAnalysisPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const resume = await getResumeById(user.id, params.id);

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-slate-400">Resume not found.</p>
        <Link href="/user/dashboard/resume" className="text-cyan-400 mt-4 underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <Link 
          href="/user/dashboard/resume" 
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest w-fit mb-2"
        >
          <ArrowLeft className="size-3.5" /> BACK TO PORTFOLIO
        </Link>
        <h2 className="text-3xl font-black text-white">ATS Analysis Report</h2>
      </div>

      <div className="mt-4">
        <AtsScoreDashboard resume={resume} />
      </div>
    </div>
  );
}
