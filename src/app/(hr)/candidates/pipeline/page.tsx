"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Search, 
  Filter, 
  UserPlus,
  Eye,
  Mail,
  Calendar,
  Phone,
  FileText,
  MoreVertical,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { AddCandidateDialog } from "@/components/candidates/add-candidate-dialog"

// Pipeline stages configuration
const pipelineStages = [
  {
    id: "new",
    title: "New Applications",
    color: "bg-blue-50 border-blue-200",
    headerColor: "bg-blue-100 text-blue-900",
    icon: <AlertCircle className="h-4 w-4" />,
    description: "Newly received applications"
  },
  {
    id: "screening",
    title: "Screening",
    color: "bg-yellow-50 border-yellow-200",
    headerColor: "bg-yellow-100 text-yellow-900",
    icon: <FileText className="h-4 w-4" />,
    description: "Initial review and screening"
  },
  {
    id: "interview",
    title: "Interview",
    color: "bg-purple-50 border-purple-200",
    headerColor: "bg-purple-100 text-purple-900",
    icon: <Calendar className="h-4 w-4" />,
    description: "Interview process"
  },
  {
    id: "offer",
    title: "Offer",
    color: "bg-green-50 border-green-200",
    headerColor: "bg-green-100 text-green-900",
    icon: <CheckCircle className="h-4 w-4" />,
    description: "Offer extended"
  },
  {
    id: "rejected",
    title: "Rejected",
    color: "bg-red-50 border-red-200",
    headerColor: "bg-red-100 text-red-900",
    icon: <XCircle className="h-4 w-4" />,
    description: "Not selected"
  }
]

// Mock candidates data organized by stage
const mockCandidatesByStage = {
  new: [
    {
      id: "3",
      name: "Dmitry Volkov",
      position: "Backend Developer",
      department: "IT",
      matchScore: 78,
      appliedDate: "2024-01-14",
      daysInStage: 1,
      vacancy: "Backend Developer",
      skills: ["Java", "Spring", "PostgreSQL"],
      avatar: null
    },
    {
      id: "7",
      name: "Anna Fedorova",
      position: "QA Engineer",
      department: "IT",
      matchScore: 82,
      appliedDate: "2024-01-15",
      daysInStage: 0,
      vacancy: "QA Engineer",
      skills: ["Selenium", "Jest", "Cypress"],
      avatar: null
    }
  ],
  screening: [
    {
      id: "2",
      name: "Elena Mikhailova",
      position: "Product Manager",
      department: "Product",
      matchScore: 85,
      appliedDate: "2024-01-12",
      daysInStage: 3,
      vacancy: "Product Manager",
      skills: ["Product Strategy", "Agile", "Analytics"],
      avatar: null
    },
    {
      id: "8",
      name: "Pavel Kozlov",
      position: "Business Analyst",
      department: "Product",
      matchScore: 79,
      appliedDate: "2024-01-13",
      daysInStage: 2,
      vacancy: "Business Analyst",
      skills: ["SQL", "Jira", "Requirements"],
      avatar: null
    },
    {
      id: "9",
      name: "Natalia Smirnova",
      position: "HR Manager",
      department: "HR",
      matchScore: 88,
      appliedDate: "2024-01-11",
      daysInStage: 4,
      vacancy: "HR Manager",
      skills: ["Recruiting", "HRIS", "Team Building"],
      avatar: null
    }
  ],
  interview: [
    {
      id: "1",
      name: "Ivan Sokolov",
      position: "Senior Frontend Developer",
      department: "IT",
      matchScore: 92,
      appliedDate: "2024-01-10",
      daysInStage: 5,
      vacancy: "Senior Frontend Developer",
      skills: ["React", "TypeScript", "Next.js"],
      avatar: null,
      interviewDate: "2024-01-18",
      interviewType: "Technical"
    },
    {
      id: "6",
      name: "Maria Ivanova",
      position: "DevOps Engineer",
      department: "IT",
      matchScore: 95,
      appliedDate: "2024-01-11",
      daysInStage: 4,
      vacancy: "DevOps Engineer",
      skills: ["Kubernetes", "AWS", "CI/CD"],
      avatar: null,
      interviewDate: "2024-01-19",
      interviewType: "Final"
    }
  ],
  offer: [
    {
      id: "4",
      name: "Olga Kuznetsova",
      position: "UX/UI Designer",
      department: "Design",
      matchScore: 88,
      appliedDate: "2024-01-05",
      daysInStage: 2,
      vacancy: "UX/UI Designer",
      skills: ["Figma", "Sketch", "Adobe XD"],
      avatar: null,
      offerDate: "2024-01-14",
      offerStatus: "Pending"
    }
  ],
  rejected: [
    {
      id: "5",
      name: "Sergey Popov",
      position: "Data Analyst",
      department: "Analytics",
      matchScore: 65,
      appliedDate: "2024-01-08",
      daysInStage: 7,
      vacancy: "Data Analyst",
      skills: ["Python", "SQL", "Tableau"],
      avatar: null,
      rejectionReason: "Insufficient experience"
    }
  ]
}

export default function CandidatePipelinePage() {
  const [candidatesByStage, setCandidatesByStage] = useState(mockCandidatesByStage)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [draggedCandidate, setDraggedCandidate] = useState<typeof candidatesByStage['new'][0] | null>(null)
  const [draggedFromStage, setDraggedFromStage] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  // Calculate stage metrics
  const getStageMetrics = (stageId: string) => {
    const candidates = candidatesByStage[stageId as keyof typeof candidatesByStage] || []
    const totalCandidates = Object.values(candidatesByStage).flat().length
    const percentage = totalCandidates > 0 ? (candidates.length / totalCandidates) * 100 : 0
    
    return {
      count: candidates.length,
      percentage: percentage.toFixed(1)
    }
  }

  // Filter candidates
  const getFilteredCandidates = (stageId: string) => {
    const candidates = candidatesByStage[stageId as keyof typeof candidatesByStage] || []
    return candidates.filter(candidate => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = filterDepartment === "all" || candidate.department === filterDepartment
      return matchesSearch && matchesDepartment
    })
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, candidate: typeof candidatesByStage['new'][0], stageId: string) => {
    setDraggedCandidate(candidate)
    setDraggedFromStage(stageId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, toStageId: string) => {
    e.preventDefault()
    
    if (!draggedCandidate || !draggedFromStage || draggedFromStage === toStageId) {
      setDragOverStage(null)
      return
    }

    // Remove candidate from original stage
    const newCandidatesByStage = { ...candidatesByStage }
    const fromStage = newCandidatesByStage[draggedFromStage as keyof typeof candidatesByStage]
    const candidateIndex = fromStage.findIndex(c => c.id === draggedCandidate.id)
    
    if (candidateIndex !== -1) {
      fromStage.splice(candidateIndex, 1)
      
      // Add candidate to new stage
      const toStage = newCandidatesByStage[toStageId as keyof typeof candidatesByStage]
      const updatedCandidate = { ...draggedCandidate, daysInStage: 0 }
      // @ts-expect-error - Complex union type, candidate structure varies by stage
      toStage.push(updatedCandidate)
      
      setCandidatesByStage(newCandidatesByStage)
    }

    // Reset drag state
    setDraggedCandidate(null)
    setDraggedFromStage(null)
    setDragOverStage(null)
  }

  const getMatchScoreBadge = (score: number) => {
    let color = "bg-gray-100 text-gray-800"
    if (score >= 90) color = "bg-green-100 text-green-800"
    else if (score >= 75) color = "bg-blue-100 text-blue-800"
    else if (score >= 60) color = "bg-yellow-100 text-yellow-800"
    else color = "bg-red-100 text-red-800"
    
    return (
      <Badge className={`${color} text-xs`}>
        {score}%
      </Badge>
    )
  }

  const handleAddCandidate = (newCandidate: Record<string, unknown>) => {
    const newCandidatesByStage = { ...candidatesByStage }
    newCandidatesByStage.new = [newCandidate as typeof candidatesByStage['new'][0], ...newCandidatesByStage.new]
    setCandidatesByStage(newCandidatesByStage)
    console.log("New candidate added to pipeline:", newCandidate)
  }

  // Calculate total candidates and conversion rates
  const totalCandidates = Object.values(candidatesByStage).flat().length
  const conversionRate = totalCandidates > 0 
    ? ((candidatesByStage.offer.length / totalCandidates) * 100).toFixed(1)
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/candidates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidate Pipeline</h1>
            <p className="text-muted-foreground">
              Drag and drop candidates to move them through stages
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <AddCandidateDialog onAdd={handleAddCandidate} />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total in Pipeline</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidates}</div>
            <p className="text-xs text-muted-foreground">Active candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">To offer stage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Interview</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidatesByStage.interview.length}</div>
            <p className="text-xs text-muted-foreground">Being interviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 days</div>
            <p className="text-xs text-muted-foreground">From application</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Analytics">Analytics</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Pipeline Kanban Board */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {pipelineStages.map((stage) => {
            const metrics = getStageMetrics(stage.id)
            const candidates = getFilteredCandidates(stage.id)
            const isDropTarget = dragOverStage === stage.id

            return (
              <Card
                key={stage.id}
                className={`min-w-[320px] border-2 transition-all ${
                  isDropTarget ? "border-blue-400 bg-blue-50/50" : ""
                } ${stage.color}`}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <CardHeader className={`${stage.headerColor} rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {stage.icon}
                      <CardTitle className="text-base">{stage.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-white">
                      {metrics.count}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    {stage.description} • {metrics.percentage}% of total
                  </CardDescription>
                  <Progress value={parseFloat(metrics.percentage)} className="h-1 mt-2" />
                </CardHeader>
                <CardContent className="p-2 space-y-2 min-h-[400px]">
                  {candidates.map((candidate) => (
                    <Card
                      key={candidate.id}
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate, stage.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Link 
                                href={`/candidates/${candidate.id}`}
                                className="font-medium text-sm hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {candidate.name}
                              </Link>
                              <p className="text-xs text-muted-foreground">
                                {candidate.position}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Interview
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <ChevronRight className="mr-2 h-4 w-4" />
                                Move to Next Stage
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {candidate.department}
                            </Badge>
                            {getMatchScoreBadge(candidate.matchScore)}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.skills.length - 2}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{candidate.vacancy}</span>
                            <span>{candidate.daysInStage}d in stage</span>
                          </div>
                          
                          {stage.id === "interview" && 'interviewDate' in candidate && (candidate as Record<string, unknown>).interviewDate ? (
                            <div className="flex items-center gap-1 text-xs text-blue-600 mt-2">
                              <Calendar className="h-3 w-3" />
                              <span>Interview: {'interviewType' in candidate ? String((candidate as Record<string, unknown>).interviewType) : ''} on {'interviewDate' in candidate ? String((candidate as Record<string, unknown>).interviewDate) : ''}</span>
                            </div>
                          ) : null}
                          {stage.id === "offer" && 'offerStatus' in candidate && (candidate as Record<string, unknown>).offerStatus ? (
                            <Badge className="mt-2 text-xs bg-green-100 text-green-800">
                              Offer {'offerStatus' in candidate ? String((candidate as Record<string, unknown>).offerStatus) : ''}
                            </Badge>
                          ) : null}
                          {stage.id === "rejected" && 'rejectionReason' in candidate && (candidate as Record<string, unknown>).rejectionReason ? (
                            <p className="text-xs text-red-600 mt-2">
                              Reason: {'rejectionReason' in candidate ? String((candidate as Record<string, unknown>).rejectionReason) : ''}
                            </p>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}