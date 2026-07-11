import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import TemplateSelectorClient from "@/components/resume/TemplateSelectorClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function SubdomainTemplatesPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const resolvedParams = await searchParams;
  const fromOnboarding = resolvedParams?.from === "onboarding";
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("https://accounts.mockrithm.me/sign-in?redirect_url=https://resume.mockrithm.me/templates");
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-12 px-4 font-sans">
      <div className="flex items-center gap-2 mb-4">
        <Link
          href={fromOnboarding ? "/welcome" : "/dashboard"}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold uppercase tracking-wider"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase">STEP 02 // VISUAL LAYOUT</span>
        <h2 className="text-4xl font-normal text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>Select a Resume Template</h2>
        <p className="text-sm text-zinc-400">
          Choose a layout optimized for applicant tracking systems (ATS). You can change this template at any time in the editor.
        </p>
      </div>

      <TemplateSelectorClient userId={user.id} />
    </div>
  );
}
