import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, Terminal } from "lucide-react"
import Link from "next/link"

export default function TakeInterviewPage() {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-300">
          Mock Interview Engine
        </h1>
        <p className="text-sm text-gray-400 font-medium">Launch interactive, voice-driven AI evaluations customized to your skill level.</p>
      </div>

      <Card className="max-w-2xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500" />
        
        {/* Glow overlay effect */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/20 transition-all duration-500" />

        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-violet-400" />
            Start New Evaluation
          </CardTitle>
          <CardDescription className="text-gray-300 text-sm leading-relaxed mt-2 font-medium">
            Take a simulated mock session with our voice-enabled conversational AI agent. 
            Ensure you are in a quiet room, have enabled microphone access, and are ready for real-time coding or behavioral challenges.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-xs text-gray-400 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Voice streaming & STAR parsing active</span>
            </div>
            <Link href="/interview" className="w-fit">
              <Button size="lg" className="btn-primary flex items-center gap-2 px-6 py-3 font-bold text-sm">
                <PlayCircle className="h-5 w-5" />
                Launch Session
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
