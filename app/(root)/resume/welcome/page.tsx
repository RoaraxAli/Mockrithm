import WorkspaceGateway from "@/components/resume/WorkspaceGateway";
import OnboardingWelcome from "@/components/resume/OnboardingWelcome";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function SubdomainResumeWelcomePage({ searchParams }: { searchParams: Promise<{ onboarding?: string }> }) {
  const resolvedParams = await searchParams;
  const isOnboarding = resolvedParams?.onboarding === "true";
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("https://accounts.mockrithm.me/sign-in?redirect_url=https://resume.mockrithm.me/welcome");
  }

  return (
    <div className="flex flex-col gap-6 w-full min-h-[80vh] items-center justify-center font-sans">
      {isOnboarding && <OnboardingWelcome />}
      <WorkspaceGateway />
    </div>
  );
}
