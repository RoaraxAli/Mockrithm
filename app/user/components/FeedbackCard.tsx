import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeedbackCardProps {
  category: string
  score: number
  maxScore: number
}

export function FeedbackCard({ category, score, maxScore }: FeedbackCardProps) {
  const percentage = (score / maxScore) * 100

  return (
    <Card className="glass-card hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 rounded-md overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-sm font-bold text-cyan-400">/ {maxScore}</span>
        </div>
        <div className="w-full bg-white/5 rounded-md h-2">
          <div className="bg-cyan-500 h-2 rounded-md transition-all duration-300" style={{ width: `${percentage}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}
