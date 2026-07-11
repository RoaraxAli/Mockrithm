import { getCurrentUser } from "@/lib/actions/auth.action";
import { getResumeById } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import ResumeWorkspace from "@/components/resume/builder/ResumeWorkspace";

export default async function SubdomainWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("https://accounts.mockrithm.me/sign-in?redirect_url=https://resume.mockrithm.me/workspace/" + resolvedParams.id);
  }

  const resume = await getResumeById(user.id, resolvedParams.id);

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[50vh]">
        <p className="text-zinc-400">Resume not found.</p>
      </div>
    );
  }

  return (
    <div className="dark bg-zinc-950 text-zinc-100 w-full h-screen overflow-hidden flex flex-col relative z-50">
      <ResumeWorkspace initialResume={resume} />
    </div>
  );
}
