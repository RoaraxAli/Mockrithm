import ResumeUploadWizard from "@/components/resume/ResumeUploadWizard";
import OnboardingWelcome from "@/components/resume/OnboardingWelcome";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function ResumeUploadPage({ searchParams }: { searchParams: Promise<{ onboarding?: string }> }) {
  const resolvedParams = await searchParams;
  const isOnboarding = resolvedParams?.onboarding === "true";

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-6 w-full">
      {isOnboarding && <OnboardingWelcome />}
      
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white">Upload Resume</h2>
        <p className="text-sm text-light-100">
          Upload your PDF to extract data and analyze ATS compatibility.
        </p>
      </div>

      <div className="mt-4">
        <ResumeUploadWizard userId={user.id} />
      </div>
    </div>
  );
}
