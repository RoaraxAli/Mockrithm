"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.push("/")
      } else {
        router.push("/sign-in")
      }
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-gray-200" />
          <Skeleton className="h-4 w-32 bg-gray-200" />
        </div>
      </div>
    )
  }

  return null
}
