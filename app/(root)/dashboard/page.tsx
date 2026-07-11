import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ResumeSubdomainLayout from "../resume/layout";
import ResumeDashboardPage from "../resume/dashboard/page";

export default async function DashboardPage() {
  const headerList = await headers();
  const host = headerList.get("host") || "";

  if (host.startsWith("resume.")) {
    return (
      <ResumeSubdomainLayout>
        <ResumeDashboardPage />
      </ResumeSubdomainLayout>
    );
  }

  redirect("/");
}
