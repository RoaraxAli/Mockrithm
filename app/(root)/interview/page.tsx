import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="root-layout">
      <h3>Interview generation</h3>

      <Agent
        userName={user.name}
        userId={user.id}
        profileImage={user.imageUrl || ""}
        type="generate"
        userResumeData={{
          targetRole: (user as any).targetRole || "",
          resumeData: user.resumeData || null,
          country: user.country || "",
        }}
        userTier={(user as any).tier || "freemium"}
      />
    </div>
  );
};

export default Page;
