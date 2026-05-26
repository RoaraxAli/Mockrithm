import { getCurrentUser } from "@/lib/actions/auth.action";
import { getResumeById } from "@/lib/actions/resume.action";
import { redirect } from "next/navigation";
import ResumeWorkspace from "@/components/resume/builder/ResumeWorkspace";

export default async function WorkspacePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const resume = await getResumeById(user.id, params.id);

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-slate-400">Resume not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-950 flex flex-col">
      <ResumeWorkspace initialResume={resume} />
    </div>
  );
}
