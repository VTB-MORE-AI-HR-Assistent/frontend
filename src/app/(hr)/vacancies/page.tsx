"use client"

import React, { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { VacanciesPageSkeleton } from "@/components/skeletons/vacancies-skeleton"
import { 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  Archive,
  Download,
  Calendar,
  Users,
  Building,
  MapPin,
  Briefcase,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  UserPlus,
  FileText,
  MessageSquare,
  X,
  CheckCircle,
  Clock,
  TrendingUp
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for vacancies with candidates and custom questions
const mockVacancies = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Moscow",
    type: "Full-time",
    experience: "5-10 years",
    salaryMin: 250000,
    salaryMax: 350000,
    currency: "RUB",
    status: "active",
    priority: "high",
    created: "2024-01-15",
    deadline: "2024-02-15",
    description: "We are looking for an experienced Frontend Developer to join our team...",
    candidates: [
      { id: "c1", name: "Maria Petrova", position: "Frontend Dev", matchScore: 95, status: "interview", uploadDate: "2024-01-20" },
      { id: "c2", name: "Ivan Sidorov", position: "React Developer", matchScore: 88, status: "new", uploadDate: "2024-01-21" },
      { id: "c3", name: "Elena Kozlova", position: "UI Developer", matchScore: 82, status: "review", uploadDate: "2024-01-19" },
      { id: "c4", name: "Dmitry Volkov", position: "Frontend Engineer", matchScore: 79, status: "new", uploadDate: "2024-01-22" },
      { id: "c5", name: "Anna Mikhailova", position: "Web Developer", matchScore: 75, status: "rejected", uploadDate: "2024-01-18" },
    ],
    customQuestions: [
      { id: "q1", question: "Describe your experience with React performance optimization", type: "technical", required: true },
      { id: "q2", question: "How do you handle state management in large applications?", type: "technical", required: true },
      { id: "q3", question: "Tell us about a challenging project you've worked on", type: "behavioral", required: false },
    ]
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "St. Petersburg",
    type: "Full-time",
    experience: "3-5 years",
    salaryMin: 200000,
    salaryMax: 280000,
    currency: "RUB",
    status: "active",
    priority: "medium",
    created: "2024-01-10",
    deadline: "2024-02-10",
    description: "Seeking a talented Product Manager to lead our digital banking initiatives...",
    candidates: [
      { id: "c6", name: "Alexander Smirnov", position: "Senior PM", matchScore: 91, status: "interview", uploadDate: "2024-01-15" },
      { id: "c7", name: "Natalia Ivanova", position: "Product Manager", matchScore: 85, status: "review", uploadDate: "2024-01-16" },
      { id: "c8", name: "Sergey Popov", position: "PM", matchScore: 78, status: "new", uploadDate: "2024-01-17" },
    ],
    customQuestions: [
      { id: "q4", question: "How do you prioritize features in a product roadmap?", type: "behavioral", required: true },
      { id: "q5", question: "Describe your experience with agile methodologies", type: "experience", required: true },
    ]
  },
  {
    id: "3",
    title: "Backend Developer",
    department: "Engineering",
    location: "Moscow",
    type: "Full-time",
    experience: "3-5 years",
    salaryMin: 220000,
    salaryMax: 300000,
    currency: "RUB",
    status: "active",
    priority: "high",
    created: "2024-01-12",
    deadline: "2024-02-20",
    description: "Join our backend team to build scalable banking solutions...",
    candidates: [
      { id: "c9", name: "Pavel Fedorov", position: "Backend Engineer", matchScore: 93, status: "interview", uploadDate: "2024-01-14" },
      { id: "c10", name: "Olga Sokolova", position: "Python Developer", matchScore: 87, status: "review", uploadDate: "2024-01-15" },
      { id: "c11", name: "Viktor Petrov", position: "Java Developer", matchScore: 84, status: "new", uploadDate: "2024-01-16" },
      { id: "c12", name: "Marina Lebedeva", position: "Backend Dev", matchScore: 76, status: "new", uploadDate: "2024-01-17" },
    ],
    customQuestions: [
      { id: "q6", question: "Explain your approach to microservices architecture", type: "technical", required: true },
      { id: "q7", question: "How do you ensure API security?", type: "technical", required: true },
    ]
  },
];

export default function VacanciesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [vacancies, setVacancies] = useState(mockVacancies)
  const [expandedVacancies, setExpandedVacancies] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [selectedVacancyForQuestion, setSelectedVacancyForQuestion] = useState<string | null>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter logic
  const filteredVacancies = useMemo(() => {
    return vacancies.filter(vacancy => {
      const matchesSearch = vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vacancy.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vacancy.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === "all" || vacancy.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [vacancies, searchQuery, filterStatus])

  const toggleVacancyExpansion = (vacancyId: string) => {
    setExpandedVacancies(prev => 
      prev.includes(vacancyId) 
        ? prev.filter(id => id !== vacancyId)
        : [...prev, vacancyId]
    )
  }

  const handleRemoveCandidate = (vacancyId: string, candidateId: string) => {
    setVacancies(prev => prev.map(vacancy => {
      if (vacancy.id === vacancyId) {
        return {
          ...vacancy,
          candidates: vacancy.candidates.filter(c => c.id !== candidateId)
        }
      }
      return vacancy
    }))
  }

  const handleAddQuestion = (vacancyId: string, question: any) => {
    setVacancies(prev => prev.map(vacancy => {
      if (vacancy.id === vacancyId) {
        return {
          ...vacancy,
          customQuestions: [...vacancy.customQuestions, { ...question, id: `q${Date.now()}` }]
        }
      }
      return vacancy
    }))
    setIsAddQuestionOpen(false)
    setSelectedVacancyForQuestion(null)
  }

  const handleRemoveQuestion = (vacancyId: string, questionId: string) => {
    setVacancies(prev => prev.map(vacancy => {
      if (vacancy.id === vacancyId) {
        return {
          ...vacancy,
          customQuestions: vacancy.customQuestions.filter(q => q.id !== questionId)
        }
      }
      return vacancy
    }))
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      published: "bg-blue-100 text-blue-800 border-blue-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
      closed: "bg-red-100 text-red-800 border-red-200"
    }
    return (
      <Badge className={`text-xs ${colors[status] || ""}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getCandidateStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      interview: "bg-blue-100 text-blue-800",
      review: "bg-yellow-100 text-yellow-800",
      new: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    }
    return (
      <Badge className={`text-[10px] ${colors[status] || ""}`}>
        {status}
      </Badge>
    )
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-gray-600"
  }

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return "Not specified"
    const formatter = new Intl.NumberFormat('ru-RU')
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)} ${currency || 'RUB'}`
    }
    return "Not specified"
  }

  if (isLoading) {
    return <VacanciesPageSkeleton />
  }

  return (
    <div className="p-4 pt-6 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vacancies</h1>
          <p className="text-sm text-muted-foreground">
            Manage vacancies, candidates, and interview questions
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Vacancy
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search vacancies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vacancies List */}
      <div className="space-y-4">
        {filteredVacancies.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No vacancies found matching your filters
          </Card>
        ) : (
          filteredVacancies.map((vacancy) => (
            <Card key={vacancy.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 w-6"
                        onClick={() => toggleVacancyExpansion(vacancy.id)}
                      >
                        {expandedVacancies.includes(vacancy.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                      {getStatusBadge(vacancy.status)}
                      <Badge variant="outline" className="text-xs">
                        {vacancy.priority} priority
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 text-xs flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {vacancy.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {vacancy.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {vacancy.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {vacancy.experience}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium">{vacancy.candidates.length} candidates</p>
                      <p className="text-xs text-muted-foreground">
                        Avg. match: {Math.round(vacancy.candidates.reduce((sum, c) => sum + c.matchScore, 0) / vacancy.candidates.length)}%
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Vacancy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Candidates
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
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

                {/* Quick Stats */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>Deadline: {vacancy.deadline}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Salary: {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                  </div>
                </div>
              </CardHeader>

              {/* Expanded Content */}
              {expandedVacancies.includes(vacancy.id) && (
                <CardContent className="pt-0">
                  <Tabs defaultValue="candidates" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="candidates">
                        Candidates ({vacancy.candidates.length})
                      </TabsTrigger>
                      <TabsTrigger value="questions">
                        Custom Questions ({vacancy.customQuestions.length})
                      </TabsTrigger>
                      <TabsTrigger value="overview">
                        Overview
                      </TabsTrigger>
                    </TabsList>

                    {/* Candidates Tab */}
                    <TabsContent value="candidates" className="mt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium">Matched Candidates</h3>
                          <Button size="sm" variant="outline">
                            <UserPlus className="mr-2 h-3 w-3" />
                            Add Candidates
                          </Button>
                        </div>
                        
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-2">
                            {vacancy.candidates.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground text-sm">
                                No candidates uploaded yet
                              </div>
                            ) : (
                              vacancy.candidates.map((candidate) => (
                                <div key={candidate.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                                  <div className="flex items-center gap-3">
                                    <Checkbox 
                                      checked={selectedCandidates.includes(candidate.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedCandidates([...selectedCandidates, candidate.id])
                                        } else {
                                          setSelectedCandidates(selectedCandidates.filter(id => id !== candidate.id))
                                        }
                                      }}
                                    />
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs">
                                        {candidate.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{candidate.name}</p>
                                      <p className="text-xs text-muted-foreground">{candidate.position}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <p className={`text-sm font-bold ${getMatchScoreColor(candidate.matchScore)}`}>
                                        {candidate.matchScore}% match
                                      </p>
                                      <p className="text-[10px] text-muted-foreground">
                                        Uploaded {candidate.uploadDate}
                                      </p>
                                    </div>
                                    {getCandidateStatusBadge(candidate.status)}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveCandidate(vacancy.id, candidate.id)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>

                        {selectedCandidates.length > 0 && (
                          <div className="flex justify-between items-center pt-3 border-t">
                            <span className="text-xs text-muted-foreground">
                              {selectedCandidates.length} selected
                            </span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Schedule Interviews
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                Remove Selected
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Custom Questions Tab */}
                    <TabsContent value="questions" className="mt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium">Interview Questions</h3>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedVacancyForQuestion(vacancy.id)
                              setIsAddQuestionOpen(true)
                            }}
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            Add Question
                          </Button>
                        </div>
                        
                        <ScrollArea className="h-[300px] pr-4">
                          <div className="space-y-2">
                            {vacancy.customQuestions.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground text-sm">
                                No custom questions added yet
                              </div>
                            ) : (
                              vacancy.customQuestions.map((question, index) => (
                                <div key={question.id} className="p-3 rounded-lg border">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-muted-foreground">
                                          Q{index + 1}
                                        </span>
                                        <Badge variant="outline" className="text-[10px]">
                                          {question.type}
                                        </Badge>
                                        {question.required && (
                                          <Badge className="text-[10px] bg-red-100 text-red-800">
                                            Required
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm">{question.question}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveQuestion(vacancy.id, question.id)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Description</h3>
                          <p className="text-sm text-muted-foreground">{vacancy.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Department</h4>
                            <p className="text-sm">{vacancy.department}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Location</h4>
                            <p className="text-sm">{vacancy.location}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Employment Type</h4>
                            <p className="text-sm">{vacancy.type}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Experience</h4>
                            <p className="text-sm">{vacancy.experience}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Salary Range</h4>
                            <p className="text-sm">{formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Deadline</h4>
                            <p className="text-sm">{vacancy.deadline}</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Add Question Dialog */}
      <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Question</DialogTitle>
            <DialogDescription>
              Add a custom interview question for this vacancy
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter your question..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type">Question Type</Label>
              <Select defaultValue="technical">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="required" />
              <Label htmlFor="required">Required question</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddQuestionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedVacancyForQuestion) {
                handleAddQuestion(selectedVacancyForQuestion, {
                  question: "New question",
                  type: "technical",
                  required: true
                })
              }
            }}>
              Add Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}