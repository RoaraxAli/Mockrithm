import { redirect } from "next/navigation";

export default function UserFeedbackRedirectPage() {
  redirect("/dashboard");
}
