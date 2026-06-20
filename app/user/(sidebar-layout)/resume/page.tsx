import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { ResumeEngineWrapper } from "@/app/user/components/ResumeEngineWrapper";

export default async function UserResumePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white">Smart Resume & ATS Optimization</h2>
      </div>
      <ResumeEngineWrapper
        userId={user.id}
        userName={user.name}
      />
    </div>
  );
}

