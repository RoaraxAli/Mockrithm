import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import TemplateSelectorClient from "@/components/resume/TemplateSelectorClient";

export default async function TemplatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-12 px-4 font-mona-sans">
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-400 uppercase">STEP 02 // VISUAL LAYOUT</span>
        <h2 className="text-4xl font-black text-white">Select a Resume Template</h2>
        <p className="text-sm text-slate-400">
          Choose a layout optimized for applicant tracking systems (ATS). You can change this template at any time in the editor.
        </p>
      </div>

      <TemplateSelectorClient userId={user.id} />
    </div>
  );
}
