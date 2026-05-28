import ResumeTailoringEngine from "@/components/ResumeTailoringEngine";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function UserResumePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white">Smart Resume & ATS Optimization</h2>
        <p className="text-sm text-light-100">
          Upload your resume or build it from scratch, paste your target job description, and optimize for ATS scanner filters.
        </p>
      </div>

      <ResumeTailoringEngine
        userId={user.id}
        userName={user.name}
      />
    </div>
  );
}
