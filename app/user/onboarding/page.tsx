import WorkspaceGateway from "@/components/resume/WorkspaceGateway";
import OnboardingWelcome from "@/components/resume/OnboardingWelcome";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <OnboardingWelcome />
      <WorkspaceGateway />
    </div>
  );
}
