"use client"

import React, { useState } from "react"
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
  Upload,
  Star,
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

// Mock data for uploaded CVs
interface UploadedCV {
  id: string
  candidateName: string
  email: string
  phone: string
  position: string
  experience: string
  skills: string[]
  matchScore: number
  uploadedAt: string
  uploadedBy: string
  status: "new" | "reviewing" | "shortlisted" | "interview" | "rejected" | "hired"
  cvUrl?: string
}

const mockUploadedCVs: UploadedCV[] = [
  {
    id: "cv1",
    candidateName: "Maria Petrova",
    email: "maria.petrova@email.com",
    phone: "+7 (999) 123-45-67",
    position: "Senior Frontend Developer",
    experience: "7 years",
    skills: ["React", "TypeScript", "Next.js", "Redux", "CSS"],
    matchScore: 95,
    uploadedAt: "2024-01-20T10:30:00",
    uploadedBy: "John HR",
    status: "interview"
  },
  {
    id: "cv2",
    candidateName: "Alexander Smirnov",
    email: "alex.smirnov@email.com",
    phone: "+7 (999) 234-56-78",
    position: "Frontend Developer",
    experience: "5 years",
    skills: ["React", "JavaScript", "Vue.js", "CSS", "Webpack"],
    matchScore: 87,
    uploadedAt: "2024-01-19T14:20:00",
    uploadedBy: "John HR",
    status: "reviewing"
  },
  {
    id: "cv3",
    candidateName: "Elena Kozlova",
    email: "elena.k@email.com",
    phone: "+7 (999) 345-67-89",
    position: "React Developer",
    experience: "6 years",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "Testing"],
    matchScore: 92,
    uploadedAt: "2024-01-18T09:15:00",
    uploadedBy: "John HR",
    status: "shortlisted"
  },
  {
    id: "cv4",
    candidateName: "Ivan Petrov",
    email: "ivan.petrov@email.com",
    phone: "+7 (999) 456-78-90",
    position: "Full Stack Developer",
    experience: "4 years",
    skills: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
    matchScore: 78,
    uploadedAt: "2024-01-17T16:45:00",
    uploadedBy: "John HR",
    status: "new"
  },
  {
    id: "cv5",
    candidateName: "Natalia Volkova",
    email: "natalia.v@email.com",
    phone: "+7 (999) 567-89-01",
    position: "Frontend Engineer",
    experience: "8 years",
    skills: ["React", "TypeScript", "Next.js", "Testing", "CI/CD"],
    matchScore: 89,
    uploadedAt: "2024-01-16T11:30:00",
    uploadedBy: "John HR",
    status: "interview"
  }
]

// Mock data for a single vacancy
const mockVacancy = {
  id: "1",
  title: "Senior Frontend Developer",
  location: "Moscow",
  type: "Full-time",
  experience: "5+ years",
  salary: "250,000 - 350,000 RUB",
  status: "active",
  created: "2024-01-15",
  updated: "2024-01-20",
  startDate: "2024-03-01",
  uploadedCVs: 45,
  interviews: 8,
  shortlisted: 12,
  rejected: 15,
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
    { name: "CVs Uploaded", count: 45, percentage: 100 },
    { name: "Under Review", count: 28, percentage: 62 },
    { name: "Shortlisted", count: 12, percentage: 27 },
    { name: "Interview Scheduled", count: 8, percentage: 18 },
    { name: "Hired", count: 0, percentage: 0 }
  ],
  activities: [
    { id: "1", action: "uploaded 5 CVs", user: "John HR", time: "2 hours ago", type: "upload" },
    { id: "2", action: "shortlisted Maria Petrova", user: "John HR", time: "5 hours ago", type: "shortlist" },
    { id: "3", action: "scheduled interview with Elena Kozlova", user: "John HR", time: "1 day ago", type: "interview" },
    { id: "4", action: "rejected Ivan Petrov", user: "John HR", time: "2 days ago", type: "rejection" },
    { id: "5", action: "uploaded 3 CVs", user: "John HR", time: "3 days ago", type: "upload" }
  ]
}

export default function VacancyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [cvs, setCvs] = useState<UploadedCV[]>(mockUploadedCVs)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const vacancy = mockVacancy // In real app, fetch based on params.id

  const filteredCVs = filterStatus === "all" 
    ? cvs 
    : cvs.filter(cv => cv.status === filterStatus)

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


  const getCandidateStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      new: { color: "bg-blue-100 text-blue-800", icon: <AlertCircle className="h-3 w-3" /> },
      reviewing: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
      shortlisted: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
      interview: { color: "bg-purple-100 text-purple-800", icon: <Calendar className="h-3 w-3" /> },
      rejected: { color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> },
      hired: { color: "bg-emerald-100 text-emerald-800", icon: <Award className="h-3 w-3" /> }
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
      case "upload":
        return <Upload className="h-4 w-4" />
      case "shortlist":
        return <CheckCircle className="h-4 w-4" />
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
              <MapPin className="h-4 w-4" />
              <span>{vacancy.location}</span>
              <span>•</span>
              <Briefcase className="h-4 w-4" />
              <span>{vacancy.type}</span>
              <span>•</span>
              <span>ID: #{vacancy.id}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/candidates/upload">
            <Button className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
              <Upload className="mr-2 h-4 w-4" />
              Upload CVs
            </Button>
          </Link>
          <Link href={`/vacancies/${vacancy.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
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

      {/* Status */}
      <div className="flex gap-2">
        {getStatusBadge(vacancy.status)}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uploaded CVs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacancy.uploadedCVs}</div>
            <p className="text-xs text-muted-foreground">Total uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cvs.filter(cv => cv.status === "reviewing").length}</div>
            <p className="text-xs text-muted-foreground">Being reviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacancy.shortlisted}</div>
            <p className="text-xs text-muted-foreground">Selected</p>
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
            <CardTitle className="text-sm font-medium">Average Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(cvs.reduce((acc, cv) => acc + cv.matchScore, 0) / cvs.length)}%
            </div>
            <p className="text-xs text-muted-foreground">AI Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="cvs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cvs">Uploaded CVs ({cvs.length})</TabsTrigger>
          <TabsTrigger value="overview">Vacancy Details</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        {/* CVs Tab */}
        <TabsContent value="cvs" className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All ({cvs.length})
            </Button>
            <Button
              variant={filterStatus === "new" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("new")}
            >
              New ({cvs.filter(cv => cv.status === "new").length})
            </Button>
            <Button
              variant={filterStatus === "reviewing" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("reviewing")}
            >
              Reviewing ({cvs.filter(cv => cv.status === "reviewing").length})
            </Button>
            <Button
              variant={filterStatus === "shortlisted" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("shortlisted")}
            >
              Shortlisted ({cvs.filter(cv => cv.status === "shortlisted").length})
            </Button>
            <Button
              variant={filterStatus === "interview" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("interview")}
            >
              Interview ({cvs.filter(cv => cv.status === "interview").length})
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("rejected")}
            >
              Rejected ({cvs.filter(cv => cv.status === "rejected").length})
            </Button>
          </div>

          {/* CVs List */}
          <div className="space-y-3">
            {filteredCVs.map((cv) => (
              <Card key={cv.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {cv.candidateName?.split(' ')?.map(n => n[0])?.join('') || 'N/A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{cv.candidateName}</h3>
                          {getCandidateStatusBadge(cv.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{cv.position} • {cv.experience}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {cv.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {cv.phone}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cv.skills.slice(0, 5).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className={`h-5 w-5 ${cv.matchScore >= 90 ? 'text-green-500' : cv.matchScore >= 80 ? 'text-blue-500' : 'text-gray-400'} fill-current`} />
                          <p className="text-2xl font-bold">{cv.matchScore}%</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Match Score</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-3 w-3" />
                          View CV
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <p>Uploaded {new Date(cv.uploadedAt).toLocaleDateString()}</p>
                        <p>by {cv.uploadedBy}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCVs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">No CVs found with the selected filter</p>
                <Button onClick={() => setFilterStatus("all")}>Show All CVs</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

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
                          {vacancy.hiringManager.name?.split(' ')?.map(n => n[0])?.join('') || 'HM'}
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
                          {vacancy.recruiter.name?.split(' ')?.map(n => n[0])?.join('') || 'R'}
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
                </CardContent>
              </Card>
            </div>
          </div>
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
                      activity.type === 'upload' ? 'bg-blue-100' :
                      activity.type === 'shortlist' ? 'bg-green-100' :
                      activity.type === 'interview' ? 'bg-purple-100' :
                      activity.type === 'update' ? 'bg-yellow-100' :
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