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
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus,
  Search,
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

  const topMatchCandidates = [
    {
      id: 1,
      name: "Maria Petrova",
      position: "Senior Frontend Developer",
      matchScore: 95,
      vacancy: "Senior React Developer",
      skills: ["React", "TypeScript", "Next.js"],
      experience: "7 years",
      status: "new",
      avatar: null
    },
    {
      id: 2,
      name: "Alexander Smirnov",
      position: "Product Manager",
      matchScore: 92,
      vacancy: "Product Manager",
      skills: ["Agile", "Analytics", "Strategy"],
      experience: "5 years",
      status: "reviewing",
      avatar: null
    },
    {
      id: 3,
      name: "Elena Kozlova",
      position: "Backend Developer",
      matchScore: 89,
      vacancy: "Backend Developer",
      skills: ["Node.js", "Python", "MongoDB"],
      experience: "4 years",
      status: "interview",
      avatar: null
    },
    {
      id: 4,
      name: "Ivan Petrov",
      position: "DevOps Engineer",
      matchScore: 87,
      vacancy: "DevOps Engineer",
      skills: ["Docker", "K8s", "AWS"],
      experience: "6 years",
      status: "new",
      avatar: null
    },
    {
      id: 5,
      name: "Natalia Volkova",
      position: "UX/UI Designer",
      matchScore: 85,
      vacancy: "UX/UI Designer",
      skills: ["Figma", "Prototyping", "Research"],
      experience: "3 years",
      status: "reviewing",
      avatar: null
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
            <div className="space-y-2.5 flex-1">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-2">
                  <div className="text-xs font-medium text-muted-foreground w-14 pt-0">
                    {task.time}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium leading-tight">{task.title}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{task.role}</p>
                    <Badge variant="outline" className="text-xs py-0 px-1.5 h-5">
                      {task.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3 h-8" size="sm">
              View full calendar
            </Button>
          </CardContent>
        </Card>

        {/* Top Match Candidates */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Match Candidates</span>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              AI-matched candidates with highest compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              {topMatchCandidates.map((candidate) => (
                <div key={candidate.id} className="group relative">
                  <div className="flex items-start gap-2.5 p-2 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] flex items-center justify-center text-white font-semibold text-xs">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {/* Match Score Badge */}
                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full shadow-sm">
                        <div className={`text-[10px] font-bold px-1 py-0 rounded-full ${
                          candidate.matchScore >= 90 ? 'bg-green-100 text-green-700' :
                          candidate.matchScore >= 80 ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {candidate.matchScore}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm truncate leading-tight">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground leading-tight">{candidate.position}</p>
                        </div>
                        {candidate.status === "new" && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0">New</Badge>
                        )}
                        {candidate.status === "reviewing" && (
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0">Reviewing</Badge>
                        )}
                        {candidate.status === "interview" && (
                          <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0">Interview</Badge>
                        )}
                      </div>
                      
                      {/* Vacancy Match */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground leading-tight">{candidate.vacancy}</span>
                      </div>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {candidate.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium bg-gray-100 text-gray-700 h-4">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/candidates">
              <Button variant="outline" className="w-full mt-3 h-8" size="sm">
                View all candidates
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Top Vacancies */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Active Vacancies</span>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-0">
            <div className="space-y-2 flex-1">
              {topVacancies.map((vacancy) => (
                <div key={vacancy.id} className="flex items-center justify-between py-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-tight">{vacancy.title}</p>
                      {vacancy.urgent && (
                        <Badge variant="destructive" className="text-xs py-0 px-1.5 h-5">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {vacancy.candidates} candidates · {vacancy.new} new
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Link href="/vacancies">
              <Button variant="outline" className="w-full mt-3 h-8" size="sm">
                Manage all vacancies
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}