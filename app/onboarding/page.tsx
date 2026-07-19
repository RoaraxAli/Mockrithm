import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import OnboardingWizardClient from "./OnboardingWizardClient";

export const metadata = {
  title: "Career Onboarding | Mockrithm",
  description: "Calibrate your professional background, evaluate your ATS compatibility, and kickstart your voice AI mock interview preparation.",
};

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.onboarded) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-mona-sans">
      {/* Background gradients */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <OnboardingWizardClient userId={user.id} userName={user.name || "User"} userTier={(user as any).tier || "freemium"} />
    </div>
  );
}
