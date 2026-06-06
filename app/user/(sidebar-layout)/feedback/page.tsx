import { getCurrentUser } from "@/lib/actions/auth.action"
import { getUserFeedback } from "@/app/user/lib/firestore"
import { FeedbackCard } from "@/app/user/components/FeedbackCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { redirect } from "next/navigation"

export default async function FeedbackPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  let feedback: any[] = []
  let error: string | null = null

  try {
    feedback = await getUserFeedback(user.id)
  } catch (err) {
    error = "Failed to load feedback"
  }

  if (error) {
    return (
      <Alert className="border-red-500/20 bg-red-500/10 text-red-400 rounded-2xl">
        <AlertDescription className="text-red-400 font-medium">{error}</AlertDescription>
      </Alert>
    )
  }

  if (feedback.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Feedback Analytics</h1>
          <p className="text-sm text-gray-400 font-medium">Your aggregated interview feedback and performance metrics</p>
        </div>
        <div className="text-center py-16 glass-card rounded-2xl border border-white/5">
          <p className="text-gray-400 mb-2 font-medium">No feedback assessments available yet.</p>
          <p className="text-xs text-gray-550">Complete your first mock interview to view analytics here.</p>
        </div>
      </div>
    )
  }

  // Aggregate category scores across all feedback
  const aggregatedCategories = feedback.reduce(
    (acc, fb) => {
      if (fb.categoryScores) {
        fb.categoryScores.forEach((category: any) => {
          if (!acc[category.category]) {
            acc[category.category] = { totalScore: 0, totalMax: 0, count: 0 }
          }
          acc[category.category].totalScore += category.score
          acc[category.category].totalMax += category.maxScore
          acc[category.category].count += 1
        })
      }
      return acc
    },
    {} as Record<string, { totalScore: number; totalMax: number; count: number }>,
  )

  // Aggregate strengths and areas for improvement
  const allStrengths = feedback.flatMap((fb) => fb.strengths || [])
  const allImprovements = feedback.flatMap((fb) => fb.areasForImprovement || [])

  // Get unique items with frequency
  const strengthCounts = allStrengths.reduce(
    (acc, strength) => {
      acc[strength] = (acc[strength] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const improvementCounts = allImprovements.reduce(
    (acc, improvement) => {
      acc[improvement] = (acc[improvement] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topStrengths = Object.entries(strengthCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([strength]) => strength)

  const topImprovements = Object.entries(improvementCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([improvement]) => improvement)

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">
          Feedback Analytics
        </h1>
        <p className="text-sm text-gray-400 font-medium">
          Aggregated competency analysis and metrics from {feedback.length} interview{feedback.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(aggregatedCategories).map(([category, data]) => {
          const d = data as { totalScore: number; totalMax: number; count: number };
          return (
            <FeedbackCard
              key={category}
              category={category}
              score={Math.round(d.totalScore / d.count)}
              maxScore={Math.round(d.totalMax / d.count)}
            />
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 opacity-25" />
          <CardHeader>
            <CardTitle className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topStrengths.map((strength, index) => (
                <li key={index} className="text-gray-200 text-sm font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-400 font-black">•</span>
                  <span>{strength}</span>
                  {strengthCounts[strength] > 1 && (
                    <span className="ml-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black">
                      {strengthCounts[strength]}x
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500 opacity-25" />
          <CardHeader>
            <CardTitle className="text-base font-bold text-amber-400 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Areas to Focus On
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topImprovements.map((improvement, index) => (
                <li key={index} className="text-gray-200 text-sm font-medium flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 font-black">•</span>
                  <span>{improvement}</span>
                  {improvementCounts[improvement] > 1 && (
                    <span className="ml-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-black">
                      {improvementCounts[improvement]}x
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card rounded-md border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 opacity-20" />
        <CardHeader>
          <CardTitle className="text-base font-bold text-gray-200">Recent Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {feedback.slice(0, 3).map((fb, index) => (
              <div key={fb.id} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-200">Interview Session #{feedback.length - index}</span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(fb.createdAt)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">{fb.finalAssessment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
