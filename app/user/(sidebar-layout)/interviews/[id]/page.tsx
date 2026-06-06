import { getCurrentUser } from "@/lib/actions/auth.action"
import { getInterviewById, getInterviewFeedback } from "@/app/user/lib/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Briefcase } from "lucide-react"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InterviewDetailPage({ params }: PageProps) {
  const { id: interviewId } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  let interview: any = null
  let feedback: any = null
  let error: string | null = null

  try {
    const [interviewResult, feedbackResult] = await Promise.all([
      getInterviewById(interviewId),
      getInterviewFeedback(interviewId),
    ])

    interview = interviewResult
    feedback = feedbackResult
  } catch (err) {
    error = "Failed to load interview details"
  }

  if (error || !interview) {
    return (
      <div className="p-8 min-h-screen bg-black">
        <Alert className="border-red-800 bg-red-900">
          <AlertDescription className="text-red-200">{error || "Interview not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">
            Interview Review
          </h1>
          <p className="text-sm text-gray-400 font-medium">Detailed breakdown and analytics of your mock interview performance.</p>
        </div>
        {interview.reportUrl && (
          <Button
            variant="outline"
            className="border-white/10 text-gray-200 hover:text-white hover:bg-white/5 bg-transparent rounded-md"
            asChild
          >
            <a href={interview.reportUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download PDF Report
            </a>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 glass-card rounded-md border border-white/10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 opacity-20" />
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-200 flex items-center">
              <Briefcase className="mr-2.5 h-5 w-5 text-cyan-400" />
              Interview Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400">Target Role:</span>
              <span className="text-white capitalize font-semibold">{interview.role}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400">Experience Level:</span>
              <span className="text-white font-semibold">{interview.level}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400">Evaluation Type:</span>
              <span className="text-white font-semibold">{interview.type}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-400">Status Check:</span>
              <Badge
                className={
                  interview.finalized 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/20 rounded-md" 
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400 font-bold hover:bg-amber-500/20 rounded-md"
                }
              >
                {interview.finalized ? "Completed" : "In Progress"}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5 sm:col-span-2">
              <span className="text-gray-400">Attempted Timestamp:</span>
              <span className="text-white font-semibold">{formatDate(interview.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {feedback && (
          <Card className="md:col-span-1 glass-card rounded-md border border-white/10 shadow-xl flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 opacity-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Impression Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-5xl font-black text-white mb-2">{feedback.totalScore}%</div>
              <p className="text-xs text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
                {feedback.totalScore >= 80 ? "Excellent Match" : feedback.totalScore >= 60 ? "Satisfactory" : "Needs Practice"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {interview.questions && interview.questions.length > 0 && (
        <Card className="glass-card rounded-md border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 opacity-20" />
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-200">Questions & Response Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {interview.questions.map((question: any, index: number) => (
              <div key={question.id || index} className="border-b border-white/5 pb-5 last:border-b-0 last:pb-0 flex flex-col gap-2.5">
                <h3 className="font-bold text-white text-sm flex items-start gap-2 leading-relaxed">
                  <span className="text-cyan-400 font-extrabold shrink-0">Q{index + 1}:</span>
                  <span>{question.question}</span>
                </h3>
                {question.answer ? (
                  <p className="text-xs text-indigo-200 bg-[#09090b]/75 border border-white/5 p-4 rounded-md font-mono leading-relaxed max-w-full overflow-x-auto">
                    {question.answer}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 italic">No answer provided.</p>
                )}
                {question.category && (
                  <div className="w-fit">
                    <Badge className="bg-white/5 text-gray-300 border-white/10 text-[10px] font-bold rounded-md">
                      {question.category}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {feedback && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card rounded-md border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 opacity-25" />
            <CardHeader>
              <CardTitle className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-md bg-emerald-400" />
                Demonstrated Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {feedback.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm font-medium flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-black">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-md border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500 opacity-25" />
            <CardHeader>
              <CardTitle className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-md bg-amber-400" />
                Areas to Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {feedback.areasForImprovement.map((area: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm font-medium flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-400 font-black">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {feedback?.categoryScores && feedback.categoryScores.length > 0 && (
        <Card className="glass-card rounded-md border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 opacity-20" />
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-200">Competency Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feedback.categoryScores.map((category: any, index: number) => (
                <div key={index} className="space-y-2 bg-white/[0.01] p-4 rounded-md border border-white/5">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-gray-300 truncate mr-2">{category.category}</span>
                    <span className="text-cyan-400">
                      {category.score}/{category.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-md h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-md transition-all duration-1000 ease-out"
                      style={{
                        width: `${(category.score / category.maxScore) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {feedback?.finalAssessment && (
        <Card className="glass-card rounded-md border border-white/10 shadow-xl relative overflow-hidden bg-white/[0.01]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 opacity-20" />
          <CardHeader>
            <CardTitle className="text-base font-bold text-gray-200">AI Evaluation Narrative</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">{feedback.finalAssessment}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}