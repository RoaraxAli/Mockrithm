"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import type { Interview} from "@/app/user/types"
import { getUserInterviews } from "@/app/user/lib/firestore"
import { InterviewTable } from "@/app/user/components/InterviewTable"
import { TableSkeleton } from "@/app/user/components/Skeletons"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function InterviewsPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInterviews() {
      if (!isLoaded || !user) return

      try {
        setLoading(true)
        const result = await getUserInterviews(user.id)
        setInterviews(result)
      } catch (err) {
        setError("Failed to load interviews")
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [isLoaded, user])

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Interviews</h1>
          <p className="text-gray-200">View all your completed and in-progress interviews</p>
        </div>
        <TableSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
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