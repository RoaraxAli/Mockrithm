import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DocumentationPage from "../documentation/page";
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
    redirect("/dashboard");
  }

  return <MarketingLanding />;
}

