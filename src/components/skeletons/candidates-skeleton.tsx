import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export function CandidatesPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline View */}
      <div className="grid gap-4 md:grid-cols-5">
        {['Applied', 'Screening', 'Interview', 'Offer', 'Hired'].map((stage) => (
          <Card key={stage} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24 mb-2" />
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-12 rounded" />
                        <Skeleton className="h-5 w-16 rounded" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <Skeleton className="h-8 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function CandidateCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CandidateTableSkeleton() {
  return (
    <div className="border rounded-lg">
      {/* Table header */}
      <div className="flex items-center p-4 border-b bg-muted/50">
        <Skeleton className="h-4 w-4 mr-4" />
        {[150, 120, 100, 80, 100, 120, 80].map((width, i) => (
          <Skeleton key={i} className="h-4 mr-4" style={{ width: `${width}px` }} />
        ))}
      </div>
      {/* Table rows */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
        <div key={row} className="flex items-center p-4 border-b">
          <Skeleton className="h-4 w-4 mr-4" />
          <div className="flex items-center gap-3 mr-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-28 mr-4" />
          <Skeleton className="h-6 w-20 rounded-full mr-4" />
          <Skeleton className="h-4 w-16 mr-4" />
          <Skeleton className="h-4 w-24 mr-4" />
          <Skeleton className="h-4 w-32 mr-4" />
          <Skeleton className="h-8 w-8 ml-auto" />
        </div>
      ))}
    </div>
  )
}