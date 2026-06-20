import { getCurrentUser } from "@/lib/actions/auth.action"
import { getUserData, getUserInterviews, getUserFeedback } from "@/app/user/lib/firestore"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  let userData = null
  let interviews: any[] = []
  let feedback: any[] = []
  let error: string | null = null

  try {
    const [userDataResult, interviewsResult, feedbackResult] = await Promise.all([
      getUserData(user.id),
      getUserInterviews(user.id),
      getUserFeedback(user.id),
    ])
    userData = userDataResult
    interviews = interviewsResult
    feedback = feedbackResult
  } catch (err: any) {
    console.error("Dashboard fetch error:", err)
    error = `Failed to load dashboard data: ${err.message || err}`
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-black">
        <Alert className="border-red-800 bg-red-900">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const lastScore = feedback.length > 0 ? feedback[0].totalScore : 0
  const averageScore =
    feedback.length > 0 ? Math.round(feedback.reduce((sum, f) => sum + f.totalScore, 0) / feedback.length) : 0

  return (
    <div className="space-y-8 font-mona-sans animate-fadeIn">
      
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <span className="w-fit text-[9px] font-black tracking-widest uppercase text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">Operational Portfolio</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Welcome back, {userData?.name || "User"}!
        </h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Here&apos;s your interview portfolio and progress analysis overview.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative p-6 backdrop-blur-2xl bg-zinc-950/40 rounded-md border border-white/8 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Total Evaluations</h4>
          <span className="text-4xl font-black text-white">{interviews.length}</span>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">Completed and ongoing sessions</p>
        </div>

        <div className="relative p-6 backdrop-blur-2xl bg-zinc-950/40 rounded-md border border-white/8 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Most Recent Score</h4>
          <span className="text-4xl font-black text-white">{lastScore > 0 ? `${lastScore}%` : "N/A"}</span>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">Your latest preparation matching rate</p>
        </div>

        <div className="relative p-6 backdrop-blur-2xl bg-zinc-950/40 rounded-md border border-white/8 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Average Prep score</h4>
          <span className="text-4xl font-black text-white">{averageScore > 0 ? `${averageScore}%` : "N/A"}</span>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">Aggregated score across all trials</p>
        </div>
      </div>
    </div>
  )
}
