import ResumeUploadWizard from "@/components/resume/ResumeUploadWizard";
import OnboardingWelcome from "@/components/resume/OnboardingWelcome";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function SubdomainResumeUploadPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarding?: string }>;
}) {
  const resolvedParams = await searchParams;
  const isOnboarding = resolvedParams?.onboarding === "true";
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("https://accounts.mockrithm.me/sign-in?redirect_url=https://resume.mockrithm.me/upload");
  }

  return (
    <div className="flex flex-col gap-6 w-full px-6 py-6 font-sans">
      {isOnboarding && <OnboardingWelcome />}

      <div className="flex flex-col gap-2 mb-8 text-center max-w-xl mx-auto">
        <h2 className="text-4xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Upload Resume
        </h2>
        <p className="text-sm text-zinc-400">
          Upload your PDF to extract data and analyze ATS compatibility.
        </p>
      </div>

      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold uppercase tracking-wider"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
      </div>

      <div className="mt-4">
        <ResumeUploadWizard userId={user.id} />
      </div>
    </div>
  );
}
