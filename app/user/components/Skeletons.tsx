import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border-zinc-900 bg-zinc-950/20">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24 bg-zinc-900" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 bg-zinc-900" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="border border-zinc-900 rounded-lg p-4 bg-zinc-950/20">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-4 w-24 bg-zinc-900" />
            <Skeleton className="h-4 w-20 bg-zinc-900" />
            <Skeleton className="h-4 w-16 bg-zinc-900" />
            <Skeleton className="h-4 w-20 bg-zinc-900" />
            <Skeleton className="h-4 w-24 bg-zinc-900" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <Card className="border-zinc-900 bg-zinc-950/20">
      <CardHeader>
        <Skeleton className="h-6 w-32 bg-zinc-900" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 bg-zinc-900" />
          <Skeleton className="h-10 w-full bg-zinc-900" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-zinc-900" />
          <Skeleton className="h-10 w-full bg-zinc-900" />
        </div>
      </CardContent>
    </Card>
  )
}
