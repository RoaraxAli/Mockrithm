import LandingDashboard from "@/components/LandingDashboard";
import MarketingLanding from "@/components/MarketingLanding";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <LandingDashboard
        user={user}
        userInterviews={[]}
        allInterviews={[]}
      />
    );
  }

  return <MarketingLanding />;
}

