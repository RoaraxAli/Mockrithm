import { getCurrentUser } from "@/lib/actions/auth.action"
import { getUserData } from "@/app/user/lib/firestore"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfileClientView } from "@/app/user/components/ProfileClientView"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  let userData = null
  let error: string | null = null

  try {
    userData = await getUserData(user.id)
  } catch (err) {
    error = "Failed to load profile data"
  }

  if (error || !userData) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-700">{error || "Profile not found"}</AlertDescription>
      </Alert>
    )
  }

  return <ProfileClientView initialUserData={userData} />
}
