import ResumeUploadWizard from "@/components/resume/ResumeUploadWizard";
import OnboardingWelcome from "@/components/resume/OnboardingWelcome";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ResumeUploadPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarding?: string }>;
}) {
  const resolvedParams = await searchParams;
  const isOnboarding = resolvedParams?.onboarding === "true";

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-6 w-full px-6 md:px-10 lg:px-16 py-6">
      {isOnboarding && <OnboardingWelcome />}

      <div className="flex flex-col gap-4 text-center">
        <h2 className="text-3xl font-black text-white">
          Upload Resume
        </h2>
        <p className="text-sm text-light-100">
          Upload your PDF to extract data and analyze ATS compatibility.
        </p>
      </div>

      <div className="flex justify-start items-center gap-2 mb-4">
        <Link
          href="/user/dashboard/resume"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="size-5" />
          Back
        </Link>
      </div>

      <div className="mt-4">
        <ResumeUploadWizard userId={user.id} />
      </div>
    </div>
  );
}