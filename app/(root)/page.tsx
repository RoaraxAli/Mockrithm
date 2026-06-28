import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BlogsPage from "../blog/page";
import LandingDashboard from "@/components/LandingDashboard";
import { getCurrentUser } from "@/lib/actions/auth.action";

const MarketingLanding = dynamic(() => import("@/components/MarketingLanding"), {
  ssr: false,
});

export default async function Home() {
  const headerList = await headers();
  const host = headerList.get("host") || "";
  const user = await getCurrentUser();

  if (host.startsWith("docs.")) {
    redirect("/documentation");
  }

  if (host.startsWith("blog.")) {
    return <BlogsPage />;
  }

  if (host.startsWith("accounts.")) {
    if (user) {
      redirect("/user");
    } else {
      redirect("/sign-in");
    }
  }

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

