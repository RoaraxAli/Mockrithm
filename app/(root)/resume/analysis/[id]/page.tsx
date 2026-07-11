import AtsScoreDashboard from "@/components/resume/AtsScoreDashboard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getResumeById } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SubdomainResumeAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("https://accounts.mockrithm.me/sign-in?redirect_url=https://resume.mockrithm.me/analysis/" + resolvedParams.id);
  }

  const resume = await getResumeById(user.id, resolvedParams.id);

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[50vh] font-sans">
        <p className="text-zinc-400">Resume not found.</p>
        <Link href="/dashboard" className="text-white mt-4 underline text-sm uppercase font-semibold">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      <div className="flex flex-col gap-2">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-white transition-colors uppercase tracking-wider w-fit mb-2"
        >
          <ArrowLeft className="size-3.5" /> BACK TO DASHBOARD
        </Link>
        <h2 className="text-4xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>ATS Analysis Report</h2>
      </div>

      <div className="mt-4">
        <AtsScoreDashboard resume={resume} />
      </div>
    </div>
  );
}
