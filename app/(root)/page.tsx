import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BlogsPage from "../blog/page";
import MarketingLanding from "@/components/MarketingLanding";
import LandingDashboard from "@/components/LandingDashboard";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function Home() {
  const headerList = await headers();
  const host = headerList.get("host") || "";

  if (host.startsWith("docs.")) {
    redirect("/documentation");
  }

  if (host.startsWith("blog.")) {
    return <BlogsPage />;
  }

  if (host.startsWith("accounts.")) {
    redirect("/sign-in");
  }

  const user = await getCurrentUser();

  if (user) {
    if (!user.onboarded) {
      redirect("/onboarding");
    }
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

