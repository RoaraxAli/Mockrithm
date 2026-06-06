import LandingDashboard from "@/components/LandingDashboard";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function Home() {
  const user = await getCurrentUser();
  return <LandingDashboard user={user} />;
}

