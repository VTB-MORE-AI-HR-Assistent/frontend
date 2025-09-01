import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-4 pt-6 pb-20 md:pb-6 md:p-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="text-right">
          <Skeleton className="h-4 w-12 mb-1 ml-auto" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>

      {/* AI Recruitment Banner Skeleton */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-4 w-64 mb-3" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-5 w-24 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-1 w-4" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-1 w-4" />
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <Skeleton className="h-10 w-24 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-2.5 flex-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-2">
                  <Skeleton className="h-4 w-14" />
                  <div className="flex-1 space-y-0.5">
                    <Skeleton className="h-4 w-32 mb-0.5" />
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-5 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-8 w-full mt-3" />
          </CardContent>
        </Card>

        {/* Top Match Candidates */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-2 rounded-lg border">
                  <div className="flex items-start gap-2.5">
                    <div className="relative">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="absolute -bottom-0.5 -right-0.5 h-4 w-8 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <Skeleton className="h-4 w-28 mb-0.5" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-5 w-12 rounded" />
                      </div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3].map((j) => (
                          <Skeleton key={j} className="h-4 w-12 rounded" />
                        ))}
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 opacity-0" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-8 w-full mt-3" />
          </CardContent>
        </Card>

        {/* Top Vacancies */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader className="pb-3 pt-4">
            <div className="flex items-center justify-between text-base">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-0">
            <div className="space-y-2 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-40 mb-0.5" />
                    </div>
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-7 w-7" />
                </div>
              ))}
            </div>
            <Skeleton className="h-8 w-full mt-3" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  )
}

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-48 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}