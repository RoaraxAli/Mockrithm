import ResumeUploadWizard from "@/components/resume/ResumeUploadWizard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function OnboardingUploadPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-400 uppercase">
            STEP 01 // IMPORT DATA
          </span>
          <h2 className="text-4xl font-black text-white">Upload Your Resume</h2>
          <p className="text-sm text-slate-400">
            Upload your PDF to extract data and analyze ATS compatibility.
          </p>
        </div>

        <div className="mt-4">
          <ResumeUploadWizard userId={user.id} />
        </div>
      </div>
    </div>
  );
}
