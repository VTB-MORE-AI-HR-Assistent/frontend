"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { 
  Brain,
  Clock,
  Users, 
  Briefcase,
  ChevronRight,
  Calendar,
  FileText,
  TrendingUp,
  Bell,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus,
  Search,
  UserPlus,
  FileSearch,
  MessageSquare,
  Sparkles
} from "lucide-react"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Mock data - in real app would come from backend
  const quickStats = {
    openPositions: 12,
    totalCandidates: 347,
    interviewsToday: 3,
    pendingReviews: 18
  }

  const recentActivity = [
    {
      id: 1,
      type: "new_candidate",
      message: "New application for Senior Developer",
      name: "Maria Petrova",
      time: "5 minutes ago",
      icon: UserPlus,
      color: "text-blue-600"
    },
    {
      id: 2,
      type: "interview",
      message: "Interview scheduled for tomorrow",
      name: "Alexander Smirnov - Product Manager",
      time: "1 hour ago",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      id: 3,
      type: "ai_match",
      message: "AI found 5 matches for Backend Developer",
      name: "Review matches",
      time: "2 hours ago",
      icon: Sparkles,
      color: "text-purple-600"
    },
    {
      id: 4,
      type: "feedback",
      message: "Interview feedback received",
      name: "Elena Kozlova passed technical round",
      time: "3 hours ago",
      icon: MessageSquare,
      color: "text-amber-600"
    }
  ]

  const todayTasks = [
    {
      id: 1,
      time: "10:00 AM",
      title: "Interview with Ivan Petrov",
      role: "Frontend Developer",
      type: "Technical Interview"
    },
    {
      id: 2,
      time: "2:00 PM",
      title: "Review AI matches",
      role: "Data Scientist position",
      type: "15 new candidates"
    },
    {
      id: 3,
      time: "4:00 PM",
      title: "Team sync",
      role: "Weekly hiring review",
      type: "Meeting"
    }
  ]

  const topVacancies = [
    { id: 1, title: "Senior React Developer", candidates: 45, new: 12, urgent: true },
    { id: 2, title: "Product Manager", candidates: 23, new: 5, urgent: false },
    { id: 3, title: "DevOps Engineer", candidates: 31, new: 8, urgent: false },
    { id: 4, title: "QA Automation Engineer", candidates: 18, new: 3, urgent: true }
  ]

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 pb-20 md:pb-6 md:p-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, John
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your recruitment today
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/vacancies/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Plus className="h-5 w-5 mr-3 text-[#1B4F8C]" />
              <div>
                <p className="font-medium">Add Vacancy</p>
                <p className="text-xs text-muted-foreground">Create new job posting</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/candidates/upload">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <FileText className="h-5 w-5 mr-3 text-[#1B4F8C]" />
              <div>
                <p className="font-medium">Upload Resume</p>
                <p className="text-xs text-muted-foreground">Import candidate profiles</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/candidates">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Search className="h-5 w-5 mr-3 text-[#1B4F8C]" />
              <div>
                <p className="font-medium">Search Candidates</p>
                <p className="text-xs text-muted-foreground">Browse database</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Schedule</span>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3">
                  <div className="text-xs font-medium text-muted-foreground w-16 pt-1">
                    {task.time}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.role}</p>
                    <Badge variant="outline" className="text-xs">
                      {task.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View full calendar
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`mt-1 ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs font-medium text-muted-foreground">
                        {activity.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View all activity
            </Button>
          </CardContent>
        </Card>

        {/* Top Vacancies */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Vacancies</span>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {topVacancies.map((vacancy) => (
                <div key={vacancy.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{vacancy.title}</p>
                      {vacancy.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {vacancy.candidates} candidates · {vacancy.new} new
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Link href="/vacancies">
              <Button variant="outline" className="w-full mt-4" size="sm">
                Manage all vacancies
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}