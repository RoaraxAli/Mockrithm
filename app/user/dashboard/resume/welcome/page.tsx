import WorkspaceGateway from "@/components/resume/WorkspaceGateway";
import OnboardingWelcome from "@/components/resume/OnboardingWelcome";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function ResumeWelcomePage({ searchParams }: { searchParams: Promise<{ onboarding?: string }> }) {
  const resolvedParams = await searchParams;
  const isOnboarding = resolvedParams?.onboarding === "true";

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-6 w-full min-h-[80vh] items-center justify-center">
      {isOnboarding && <OnboardingWelcome />}
      <WorkspaceGateway />
    </div>
  );
}
