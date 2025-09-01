import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export function CandidatesPageSkeleton() {
  return (
    <div className="p-6 bg-gray-50/50 min-h-[calc(100vh-64px)]">
      <div className="flex gap-6 h-[calc(100vh-112px)]">
        {/* Left Panel - Upload Section Skeleton */}
        <Card className="w-[400px] flex-shrink-0 h-fit">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vacancy Selection Skeleton */}
            <div>
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-10 w-full mb-1" />
              <Skeleton className="h-3 w-56" />
            </div>

            {/* Upload Drop Zone Skeleton */}
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                <Skeleton className="h-12 w-12 mx-auto mb-3 rounded-full" />
                <Skeleton className="h-5 w-40 mx-auto mb-1" />
                <Skeleton className="h-4 w-32 mx-auto mb-2" />
                <Skeleton className="h-3 w-48 mx-auto" />
              </div>
            </div>

            {/* Upload Button Skeleton */}
            <Skeleton className="h-10 w-full" />

            {/* Stats Section Skeleton */}
            <div className="pt-6 border-t space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-40" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-8" />
                </div>
                
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-6" />
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Table Section Skeleton */}
        <Card className="flex-1 h-full overflow-hidden flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-6 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {/* Filters Skeleton */}
            <div className="flex gap-3 mb-6">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>

            {/* Table Skeleton */}
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="border-b bg-gray-50 p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                </div>
              </div>
              
              {/* Table Rows */}
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <div key={row} className="border-b p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <div className="flex gap-1 ml-auto">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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