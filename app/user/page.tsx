import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/user/dashboard");
  } else {
    redirect("/sign-in");
  }
}
