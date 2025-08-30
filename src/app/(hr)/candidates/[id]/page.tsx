"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  Star,
  FileText,
  Video,
  MessageSquare,
  Edit,
  Trash2,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  TrendingUp,
  User,
  Building,
  Globe,
  Linkedin,
  Github
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock candidate data
const mockCandidate = {
  id: "1",
  name: "Ivan Sokolov",
  email: "ivan.sokolov@example.com",
  phone: "+7 (495) 123-45-67",
  location: "Moscow, Russia",
  currentPosition: "Senior Frontend Developer at Tech Corp",
  experience: "5+ years",
  education: "MSU, Computer Science, 2018",
  languages: ["Russian (Native)", "English (Fluent)"],
  salary: {
    current: "200,000 RUB",
    expected: "250,000 - 300,000 RUB"
  },
  availability: "2 weeks notice",
  status: "interview",
  stage: "Technical Interview",
  matchScore: 92,
  appliedDate: "2024-01-10",
  lastActivity: "2 hours ago",
  vacancy: {
    id: "1",
    title: "Senior Frontend Developer",
    department: "IT"
  },
  avatar: null,
  resume: {
    url: "/resume/ivan-sokolov.pdf",
    uploadedAt: "2024-01-10"
  },
  socialLinks: {
    linkedin: "linkedin.com/in/ivansokolov",
    github: "github.com/ivansokolov",
    portfolio: "ivansokolov.dev"
  },
  skills: {
    technical: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "REST API", "Git", "Docker"],
    soft: ["Team Leadership", "Problem Solving", "Communication", "Agile/Scrum", "Mentoring"]
  },
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Frontend Developer",
      period: "2021 - Present",
      description: "Leading frontend development team, architecting scalable React applications",
      achievements: [
        "Increased application performance by 40%",
        "Led team of 5 developers",
        "Implemented CI/CD pipeline"
      ]
    },
    {
      company: "StartupXYZ",
      position: "Frontend Developer",
      period: "2019 - 2021",
      description: "Developed web applications using React and TypeScript",
      achievements: [
        "Built 3 major product features",
        "Reduced bundle size by 30%",
        "Improved test coverage to 85%"
      ]
    },
    {
      company: "Digital Agency",
      position: "Junior Developer",
      period: "2018 - 2019",
      description: "Worked on various client projects",
      achievements: [
        "Delivered 10+ client projects",
        "Learned modern web technologies"
      ]
    }
  ],
  assessments: [
    {
      type: "Technical Screening",
      date: "2024-01-12",
      score: 85,
      status: "passed",
      notes: "Strong technical skills, good communication"
    },
    {
      type: "Coding Challenge",
      date: "2024-01-14",
      score: 90,
      status: "passed",
      notes: "Excellent problem-solving, clean code"
    },
    {
      type: "Technical Interview",
      date: "2024-01-18",
      score: null,
      status: "scheduled",
      notes: "Scheduled with senior engineers"
    }
  ],
  notes: [
    {
      id: "1",
      author: "Maria Ivanova",
      role: "Recruiter",
      date: "2024-01-15",
      content: "Very promising candidate. Strong technical background and excellent communication skills. Recommended for technical interview."
    },
    {
      id: "2",
      author: "Alexander Petrov",
      role: "Engineering Manager",
      date: "2024-01-16",
      content: "Reviewed coding challenge - impressive solution. Shows good understanding of React patterns and performance optimization."
    }
  ],
  timeline: [
    {
      date: "2024-01-10",
      event: "Applied for position",
      type: "application"
    },
    {
      date: "2024-01-11",
      event: "Application reviewed",
      type: "review"
    },
    {
      date: "2024-01-12",
      event: "Passed technical screening",
      type: "assessment"
    },
    {
      date: "2024-01-14",
      event: "Completed coding challenge",
      type: "assessment"
    },
    {
      date: "2024-01-15",
      event: "Moved to interview stage",
      type: "stage_change"
    },
    {
      date: "2024-01-18",
      event: "Technical interview scheduled",
      type: "interview"
    }
  ]
}

export default function CandidateProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")
  const [candidateStatus, setCandidateStatus] = useState(mockCandidate.status)
  
  const candidate = mockCandidate // In real app, fetch based on params.id

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      new: { 
        color: "bg-blue-100 text-blue-800 border-blue-200", 
        icon: <Clock className="h-3 w-3" />,
        label: "New"
      },
      screening: { 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        icon: <FileText className="h-3 w-3" />,
        label: "Screening"
      },
      interview: { 
        color: "bg-purple-100 text-purple-800 border-purple-200", 
        icon: <Calendar className="h-3 w-3" />,
        label: "Interview"
      },
      offer: { 
        color: "bg-green-100 text-green-800 border-green-200", 
        icon: <CheckCircle className="h-3 w-3" />,
        label: "Offer"
      },
      rejected: { 
        color: "bg-red-100 text-red-800 border-red-200", 
        icon: <XCircle className="h-3 w-3" />,
        label: "Rejected"
      }
    }
    const { color, icon, label } = config[status] || config.new
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        {icon}
        {label}
      </Badge>
    )
  }

  const getAssessmentStatusBadge = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      passed: { color: "bg-green-100 text-green-800", label: "Passed" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
      scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" }
    }
    const { color, label } = config[status] || config.pending
    return <Badge className={color}>{label}</Badge>
  }

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-4 w-4" />
      case "review":
        return <Eye className="h-4 w-4" />
      case "assessment":
        return <Target className="h-4 w-4" />
      case "interview":
        return <Calendar className="h-4 w-4" />
      case "stage_change":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote)
      setNewNote("")
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setCandidateStatus(newStatus)
    console.log("Status changed to:", newStatus)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/candidates")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{candidate.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                <span>{candidate.currentPosition}</span>
                <span>•</span>
                <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          <Button className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
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
                <Video className="mr-2 h-4 w-4" />
                Schedule Video Call
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Candidate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status and Match Score */}
      <div className="flex items-center gap-4">
        {getStatusBadge(candidateStatus)}
        <Badge variant="outline">{candidate.stage}</Badge>
        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300">
          <Target className="h-3 w-3 mr-1" />
          {candidate.matchScore}% Match
        </Badge>
        <Badge variant="outline">
          <Briefcase className="h-3 w-3 mr-1" />
          {candidate.vacancy.title}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{candidate.experience}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {candidate.location}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{candidate.availability}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expected Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{candidate.salary.expected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{candidate.lastActivity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="notes">Notes & Feedback</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.location}</span>
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    {candidate.socialLinks.linkedin && (
                      <a href={`https://${candidate.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Linkedin className="h-4 w-4 mr-1" />
                          LinkedIn
                        </Button>
                      </a>
                    )}
                    {candidate.socialLinks.github && (
                      <a href={`https://${candidate.socialLinks.github}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </Button>
                      </a>
                    )}
                    {candidate.socialLinks.portfolio && (
                      <a href={`https://${candidate.socialLinks.portfolio}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Globe className="h-4 w-4 mr-1" />
                          Portfolio
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">Technical Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {candidate.skills.technical.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium mb-2">Soft Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {candidate.skills.soft.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.education}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {candidate.languages.map((language, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{language}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions & Status */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Select value={candidateStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full" variant="outline">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Move to Next Stage
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Salary Expectations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Current Salary</Label>
                    <p className="font-medium">{candidate.salary.current}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-xs text-muted-foreground">Expected Salary</Label>
                    <p className="font-medium">{candidate.salary.expected}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Resume</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Uploaded {new Date(candidate.resume.uploadedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Professional experience and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 pb-6">
                    {index !== candidate.experience.length - 1 && (
                      <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-gradient-to-r from-[#1B4F8C] to-[#2563EB]" />
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold">{exp.position}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-3 w-3" />
                          <span>{exp.company}</span>
                          <span>•</span>
                          <span>{exp.period}</span>
                        </div>
                      </div>
                      <p className="text-sm">{exp.description}</p>
                      <div className="space-y-1">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>Tests and evaluations completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.assessments.map((assessment, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{assessment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(assessment.date).toLocaleDateString()}
                          </p>
                        </div>
                        {getAssessmentStatusBadge(assessment.status)}
                      </div>
                      
                      {assessment.score !== null && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Score</span>
                            <span className="font-medium">{assessment.score}%</span>
                          </div>
                          <Progress value={assessment.score} className="h-2" />
                        </div>
                      )}
                      
                      {assessment.notes && (
                        <p className="text-sm text-muted-foreground">{assessment.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your notes about this candidate..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAddNote} className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
                Add Note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes & Feedback</CardTitle>
              <CardDescription>Internal notes and interview feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.notes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {note.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{note.author}</p>
                            <p className="text-xs text-muted-foreground">{note.role}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Complete history of candidate interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      item.type === 'application' ? 'bg-blue-100' :
                      item.type === 'review' ? 'bg-purple-100' :
                      item.type === 'assessment' ? 'bg-green-100' :
                      item.type === 'interview' ? 'bg-amber-100' :
                      item.type === 'stage_change' ? 'bg-indigo-100' :
                      'bg-gray-100'
                    }`}>
                      {getTimelineIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
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