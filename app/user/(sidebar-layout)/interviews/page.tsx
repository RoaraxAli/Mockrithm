import { getCurrentUser } from "@/lib/actions/auth.action"
import { getUserInterviews } from "@/app/user/lib/firestore"
import { InterviewTable } from "@/app/user/components/InterviewTable"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { redirect } from "next/navigation"

export default async function InterviewsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  let interviews: any[] = []
  let error: string | null = null

  try {
    interviews = await getUserInterviews(user.id)
  } catch (err) {
    error = "Failed to load interviews"
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Your Interviews</h1>
        <p className="text-gray-200">
          {interviews.length > 0
            ? `You have completed ${interviews.length} interview${interviews.length === 1 ? "" : "s"}`
            : "No interviews found. Start your first interview!"}
        </p>
      </div>

      {interviews.length > 0 ? (
        <InterviewTable interviews={interviews} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-200 mb-4">No interviews yet</p>
          <p className="text-sm text-gray-200">Take your first interview to see it here</p>
        </div>
      )}
    </div>
  )
}