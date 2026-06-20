import { redirect } from "next/navigation";
import LandingDashboard from "@/components/LandingDashboard";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <LandingDashboard
      user={user}
      userInterviews={[]}
      allInterviews={[]}
    />
  );
}
