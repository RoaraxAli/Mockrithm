import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BlogsPage from "../blog/page";
import LandingDashboard from "@/components/LandingDashboard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import MarketingLandingWrapper from "@/components/MarketingLandingWrapper";
import ResumeLandingPage from "./resume/page";
import GamesLandingPage from "./games/page";

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

  if (host.startsWith("resume.")) {
    if (user) {
      redirect("/dashboard");
    }
    return <ResumeLandingPage />;
  }

  if (host.startsWith("games.")) {
    if (user) {
      redirect("/user");
    }
    return <GamesLandingPage />;
  }

  if (host.startsWith("accounts.")) {
    if (user) {
      redirect("/user");
    } else {
      redirect("/sign-in");
    }
  }

  if (user) {
    if (user.role?.toLowerCase() === "admin") {
      redirect("/admin");
    }
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

  return <MarketingLandingWrapper />;
}

