"use client"

import React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Archive,
  Share2,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Eye,
  FileText,
  Mail,
  Phone,
  Building,
  Target,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Download,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Mock data for a single vacancy
const mockVacancy = {
  id: "1",
  title: "Senior Frontend Developer",
  department: "IT",
  location: "Moscow",
  type: "Full-time",
  experience: "5+ years",
  salary: "250,000 - 350,000 RUB",
  status: "active",
  priority: "high",
  created: "2024-01-15",
  updated: "2024-01-20",
  deadline: "2024-02-15",
  startDate: "2024-03-01",
  candidates: 45,
  interviews: 8,
  offers: 2,
  hired: 0,
  description: `We are looking for an experienced Frontend Developer to join our innovative team at VTB Bank. You will be responsible for developing and maintaining high-quality web applications that serve millions of users.

As a Senior Frontend Developer, you will work closely with our product and design teams to deliver exceptional user experiences. You'll have the opportunity to work with modern technologies and contribute to the digital transformation of one of Russia's leading banks.`,
  responsibilities: [
    "Develop and maintain responsive web applications using React and TypeScript",
    "Collaborate with UX/UI designers to implement pixel-perfect designs",
    "Optimize applications for maximum speed and scalability",
    "Participate in code reviews and maintain high code quality standards",
    "Mentor junior developers and contribute to team knowledge sharing",
    "Work with backend developers to integrate APIs",
    "Implement automated testing and continuous integration",
    "Stay up-to-date with emerging technologies and industry trends"
  ],
  requirements: [
    "5+ years of experience in frontend development",
    "Expert knowledge of React, TypeScript, and modern JavaScript",
    "Strong understanding of responsive design and cross-browser compatibility",
    "Experience with state management libraries (Redux, MobX, or Context API)",
    "Proficiency with version control systems (Git)",
    "Experience with testing frameworks (Jest, React Testing Library)",
    "Strong problem-solving skills and attention to detail",
    "Excellent communication skills in Russian and English"
  ],
  benefits: [
    "Competitive salary and performance bonuses",
    "Health insurance for you and your family",
    "Professional development budget",
    "Flexible working hours and remote work options",
    "Modern office in the heart of Moscow",
    "Gym membership and wellness programs",
    "Team building events and corporate activities",
    "Relocation assistance if needed"
  ],
  hiringManager: {
    name: "Alexander Petrov",
    role: "Engineering Manager",
    email: "a.petrov@vtb.com",
    phone: "+7 (495) 123-45-67",
    avatar: null
  },
  recruiter: {
    name: "Maria Ivanova",
    role: "Senior Recruiter",
    email: "m.ivanova@vtb.com",
    phone: "+7 (495) 123-45-68",
    avatar: null
  },
  stages: [
    { name: "Application Review", count: 45, percentage: 100 },
    { name: "Phone Screening", count: 28, percentage: 62 },
    { name: "Technical Interview", count: 12, percentage: 27 },
    { name: "Final Interview", count: 4, percentage: 9 },
    { name: "Offer", count: 2, percentage: 4 }
  ],
  recentCandidates: [
    { id: "1", name: "Ivan Sokolov", applied: "2 hours ago", status: "new", rating: 4.5 },
    { id: "2", name: "Elena Mikhailova", applied: "5 hours ago", status: "screening", rating: 4.8 },
    { id: "3", name: "Dmitry Volkov", applied: "1 day ago", status: "interview", rating: 4.2 },
    { id: "4", name: "Olga Kuznetsova", applied: "2 days ago", status: "rejected", rating: 3.5 },
    { id: "5", name: "Sergey Popov", applied: "3 days ago", status: "interview", rating: 4.6 }
  ],
  activities: [
    { id: "1", action: "Candidate applied", user: "Ivan Sokolov", time: "2 hours ago", type: "application" },
    { id: "2", action: "Interview scheduled", user: "Maria Ivanova", time: "5 hours ago", type: "interview" },
    { id: "3", action: "Vacancy updated", user: "Alexander Petrov", time: "1 day ago", type: "update" },
    { id: "4", action: "Candidate rejected", user: "Maria Ivanova", time: "2 days ago", type: "rejection" },
    { id: "5", action: "Vacancy published", user: "Alexander Petrov", time: "5 days ago", type: "publish" }
  ]
}

export default function VacancyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vacancy = mockVacancy // In real app, fetch based on params.id

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
      closed: "bg-red-100 text-red-800 border-red-200"
    }
    return (
      <Badge className={colors[status] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-amber-100 text-amber-800 border-amber-200",
      low: "bg-blue-100 text-blue-800 border-blue-200"
    }
    return (
      <Badge className={colors[priority] || ""}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    )
  }

  const getCandidateStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      new: { color: "bg-blue-100 text-blue-800", icon: <AlertCircle className="h-3 w-3" /> },
      screening: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
      interview: { color: "bg-purple-100 text-purple-800", icon: <Calendar className="h-3 w-3" /> },
      offer: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> }
    }
    const { color, icon } = config[status] || config.new
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-4 w-4" />
      case "interview":
        return <Calendar className="h-4 w-4" />
      case "update":
        return <Edit className="h-4 w-4" />
      case "rejection":
        return <XCircle className="h-4 w-4" />
      case "publish":
        return <Eye className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/vacancies")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vacancy.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{vacancy.department}</span>
              <span>•</span>
              <MapPin className="h-4 w-4" />
              <span>{vacancy.location}</span>
              <span>•</span>
              <span>ID: #{vacancy.id}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Link href={`/vacancies/${vacancy.id}/edit`}>
            <Button className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
              <Edit className="mr-2 h-4 w-4" />
              Edit Vacancy
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex gap-2">
        {getStatusBadge(vacancy.status)}
        {getPriorityBadge(vacancy.priority)}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacancy.candidates}</div>
            <p className="text-xs text-muted-foreground">Total received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Being screened</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacancy.interviews}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacancy.offers}</div>
            <p className="text-xs text-muted-foreground">Extended</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacancy.hired}</div>
            <p className="text-xs text-muted-foreground">Positions filled</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {vacancy.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vacancy.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vacancy.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vacancy.benefits.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Type
                    </span>
                    <span className="text-sm font-medium">{vacancy.type}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Experience
                    </span>
                    <span className="text-sm font-medium">{vacancy.experience}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Salary
                    </span>
                    <span className="text-sm font-medium">{vacancy.salary}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Deadline
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(vacancy.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Start Date
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(vacancy.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hiring Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Hiring Manager</div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {vacancy.hiringManager.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{vacancy.hiringManager.name}</div>
                        <div className="text-sm text-muted-foreground">{vacancy.hiringManager.role}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{vacancy.hiringManager.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{vacancy.hiringManager.phone}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Recruiter</div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {vacancy.recruiter.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{vacancy.recruiter.name}</div>
                        <div className="text-sm text-muted-foreground">{vacancy.recruiter.role}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{vacancy.recruiter.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{vacancy.recruiter.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(vacancy.created).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{new Date(vacancy.updated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days Active</span>
                    <span>
                      {Math.floor((new Date().getTime() - new Date(vacancy.created).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days Until Deadline</span>
                    <span className="text-orange-600">
                      {Math.floor((new Date(vacancy.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Candidates</CardTitle>
              <CardDescription>Latest applicants for this position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vacancy.recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">Applied {candidate.applied}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(candidate.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm">{candidate.rating}</span>
                      </div>
                      {getCandidateStatusBadge(candidate.status)}
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href={`/candidates?vacancy=${vacancy.id}`}>
                  <Button variant="outline">
                    View All {vacancy.candidates} Candidates
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
              <CardDescription>Candidate progression through stages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {vacancy.stages.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{stage.name}</span>
                    <span className="text-muted-foreground">{stage.count} candidates</span>
                  </div>
                  <Progress value={stage.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">62%</div>
                  <div className="text-sm text-muted-foreground">Screening Rate</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">27%</div>
                  <div className="text-sm text-muted-foreground">Interview Rate</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">4%</div>
                  <div className="text-sm text-muted-foreground">Offer Rate</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">18 days</div>
                  <div className="text-sm text-muted-foreground">Avg. Time to Hire</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vacancy.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'application' ? 'bg-blue-100' :
                      activity.type === 'interview' ? 'bg-purple-100' :
                      activity.type === 'update' ? 'bg-green-100' :
                      activity.type === 'rejection' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}