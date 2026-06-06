import FeedbackForm from "@/components/FeedbackForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function ContactPage() {
  const user = await getCurrentUser();
  const serializedUser = user ? {
    name: user.name,
    email: user.email,
  } : null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <FeedbackForm initialUser={serializedUser} />
    </div>
  );
}