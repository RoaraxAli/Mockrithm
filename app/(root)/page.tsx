import { headers } from "next/headers";
import DocumentationPage from "../documentation/page";
import LandingDashboard from "@/components/LandingDashboard";
import MarketingLanding from "@/components/MarketingLanding";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function Home() {
  const headerList = await headers();
  const host = headerList.get("host") || "";

  if (host.startsWith("docs.")) {
    return <DocumentationPage />;
  }

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

