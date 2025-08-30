"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Will be used in future updates
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  // Clock, // Will be used in future updates
  CheckCircle,
  // AlertCircle, // Will be used in future updates
  MoreHorizontal,
  Filter,
  Download
} from "lucide-react"
// Charts removed per user request
// import { 
//   ApplicationTrendsChart, 
//   DepartmentDistributionChart,
//   TimeToHireChart,
//   HiringFunnelChart 
// } from "@/components/lazy/lazy-charts"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 pb-20 md:pb-6 md:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your recruitment overview
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Vacancies Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vacancies
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                12%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        {/* Active Candidates Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Candidates
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                28%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        {/* Scheduled Interviews Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Interviews
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        {/* Hiring Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hiring Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 inline-flex items-center">
                <ArrowDown className="h-3 w-3 mr-1" />
                5%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Activity Feed & Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Feed */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your recruitment pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Activity Item 1 */}
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <Users className="h-4 w-4 text-[#1B4F8C]" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New application received
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ivan Petrov applied for Senior Frontend Developer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2 minutes ago
                  </p>
                </div>
              </div>

              {/* Activity Item 2 */}
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Interview completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maria Ivanova completed technical interview
                  </p>
                  <p className="text-xs text-muted-foreground">
                    1 hour ago
                  </p>
                </div>
              </div>

              {/* Activity Item 3 */}
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-amber-100 p-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Interview scheduled
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Alexander Smirnov scheduled for tomorrow at 10:00 AM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    3 hours ago
                  </p>
                </div>
              </div>

              {/* Activity Item 4 */}
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-purple-100 p-2">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New vacancy posted
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Backend Developer position opened in Engineering
                  </p>
                  <p className="text-xs text-muted-foreground">
                    5 hours ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>
              Next scheduled interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Interview 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-sm font-medium">AS</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Alexander Smirnov
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tomorrow, 10:00 AM
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Interview 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-sm font-medium">EK</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Elena Kozlova
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tomorrow, 2:00 PM
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Interview 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-sm font-medium">DM</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Dmitry Mikhailov
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Dec 3, 11:00 AM
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Interview 4 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-sm font-medium">OL</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Olga Lebedeva
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Dec 3, 3:00 PM
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}