"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { useDropzone } from "react-dropzone"
import { VacanciesPageSkeleton } from "@/components/skeletons/vacancies-skeleton"
import { WeightPipeline } from "@/components/ui/weight-pipeline"
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
  TrendingUp,
  Settings,
  Upload,
  Link2,
  FileJson,
  FileSpreadsheet
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
    interviewDuration: 60,
    technicalWeight: 40,
    behavioralWeight: 35,
    softSkillsWeight: 25,
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
    interviewDuration: 45,
    technicalWeight: 30,
    behavioralWeight: 45,
    softSkillsWeight: 25,
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
    interviewDuration: 90,
    technicalWeight: 60,
    behavioralWeight: 25,
    softSkillsWeight: 15,
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
  const [isEditConfigOpen, setIsEditConfigOpen] = useState(false)
  const [editingVacancyConfig, setEditingVacancyConfig] = useState<any>(null)
  const [isCreateVacancyOpen, setIsCreateVacancyOpen] = useState(false)
  const [createMethod, setCreateMethod] = useState<"manual" | "file" | "link">("manual")
  const [importLink, setImportLink] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [newVacancy, setNewVacancy] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    experience: "",
    salaryMin: 0,
    salaryMax: 0,
    currency: "RUB",
    status: "draft",
    priority: "medium",
    deadline: "",
    description: "",
    interviewDuration: 60,
    technicalWeight: 40,
    behavioralWeight: 30,
    softSkillsWeight: 30
  })

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

  const handleUpdateVacancyConfig = () => {
    if (editingVacancyConfig) {
      setVacancies(prev => prev.map(vacancy => {
        if (vacancy.id === editingVacancyConfig.id) {
          return {
            ...vacancy,
            interviewDuration: editingVacancyConfig.interviewDuration,
            technicalWeight: editingVacancyConfig.technicalWeight,
            behavioralWeight: editingVacancyConfig.behavioralWeight,
            softSkillsWeight: editingVacancyConfig.softSkillsWeight
          }
        }
        return vacancy
      }))
      setIsEditConfigOpen(false)
      setEditingVacancyConfig(null)
    }
  }

  const handleCreateVacancy = () => {
    if (newVacancy.title && newVacancy.department && newVacancy.location) {
      const vacancy = {
        ...newVacancy,
        id: `v-${Date.now()}`,
        created: new Date().toISOString().split('T')[0],
        candidates: [],
        customQuestions: []
      }
      setVacancies(prev => [vacancy, ...prev])
      setIsCreateVacancyOpen(false)
      setCreateMethod("manual")
      setImportLink("")
      setNewVacancy({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        experience: "",
        salaryMin: 0,
        salaryMax: 0,
        currency: "RUB",
        status: "draft",
        priority: "medium",
        deadline: "",
        description: "",
        interviewDuration: 60,
        technicalWeight: 40,
        behavioralWeight: 30,
        softSkillsWeight: 30
      })
    }
  }

  const handleFileUpload = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setIsImporting(true)
      
      // Simulate file parsing
      setTimeout(() => {
        // Mock parsed data from file
        const parsedVacancy = {
          title: "Imported: " + file.name.replace(/\.[^/.]+$/, ""),
          department: "Engineering",
          location: "Moscow",
          type: "Full-time",
          experience: "3-5 years",
          salaryMin: 200000,
          salaryMax: 300000,
          currency: "RUB",
          status: "draft",
          priority: "medium",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: "This vacancy was imported from a file. Please review and edit the details.",
          interviewDuration: 60,
          technicalWeight: 40,
          behavioralWeight: 30,
          softSkillsWeight: 30
        }
        
        setNewVacancy(parsedVacancy)
        setIsImporting(false)
        // Switch to manual tab to show imported data
        setCreateMethod("manual")
      }, 1500)
    }
  }, [])

  const handleLinkImport = () => {
    if (importLink) {
      setIsImporting(true)
      
      // Simulate fetching from link
      setTimeout(() => {
        // Mock data from link
        const importedVacancy = {
          title: "Senior Full Stack Developer",
          department: "Engineering",
          location: "Remote",
          type: "Full-time",
          experience: "5+ years",
          salaryMin: 300000,
          salaryMax: 450000,
          currency: "RUB",
          status: "draft",
          priority: "high",
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: "We are looking for an experienced Full Stack Developer to join our team. This position was imported from an external job board.",
          interviewDuration: 90,
          technicalWeight: 50,
          behavioralWeight: 30,
          softSkillsWeight: 20
        }
        
        setNewVacancy(importedVacancy)
        setIsImporting(false)
        setImportLink("")
        // Switch to manual tab to show imported data
        setCreateMethod("manual")
      }, 2000)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  })

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
        <Button 
          className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white"
          onClick={() => setIsCreateVacancyOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Vacancy
        </Button>
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

                        {/* Interview Configuration Section */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium">Interview Configuration</h3>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setEditingVacancyConfig({
                                  id: vacancy.id,
                                  title: vacancy.title,
                                  interviewDuration: vacancy.interviewDuration || 60,
                                  technicalWeight: vacancy.technicalWeight || 40,
                                  behavioralWeight: vacancy.behavioralWeight || 30,
                                  softSkillsWeight: vacancy.softSkillsWeight || 30
                                })
                                setIsEditConfigOpen(true)
                              }}
                            >
                              <Settings className="mr-2 h-3 w-3" />
                              Edit Config
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Interview Duration:</span>
                              <span className="font-medium">{vacancy.interviewDuration || 60} minutes</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Question Weights:</span>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">
                                  Technical: {vacancy.technicalWeight || 40}%
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Behavioral: {vacancy.behavioralWeight || 30}%
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Soft Skills: {vacancy.softSkillsWeight || 30}%
                                </Badge>
                              </div>
                            </div>
                          </div>
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

      {/* Edit Interview Configuration Dialog */}
      <Dialog open={isEditConfigOpen} onOpenChange={setIsEditConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Interview Configuration</DialogTitle>
            <DialogDescription>
              Configure interview settings for {editingVacancyConfig?.title}
            </DialogDescription>
          </DialogHeader>
          {editingVacancyConfig && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="duration" className="text-sm font-medium">
                  Interview Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="180"
                  value={editingVacancyConfig.interviewDuration}
                  onChange={(e) => setEditingVacancyConfig({
                    ...editingVacancyConfig,
                    interviewDuration: parseInt(e.target.value) || 60
                  })}
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Question Type Weights</Label>
                <WeightPipeline
                  segments={[
                    {
                      label: "Technical",
                      value: editingVacancyConfig.technicalWeight,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Behavioral",
                      value: editingVacancyConfig.behavioralWeight,
                      color: "bg-green-500",
                    },
                    {
                      label: "Soft Skills",
                      value: editingVacancyConfig.softSkillsWeight,
                      color: "bg-yellow-500",
                    }
                  ]}
                  onChange={(segments) => {
                    setEditingVacancyConfig({
                      ...editingVacancyConfig,
                      technicalWeight: Math.round(segments[0].value),
                      behavioralWeight: Math.round(segments[1].value),
                      softSkillsWeight: Math.round(segments[2].value)
                    })
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditConfigOpen(false)
                setEditingVacancyConfig(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateVacancyConfig}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Vacancy Dialog */}
      <Dialog open={isCreateVacancyOpen} onOpenChange={(open) => {
        setIsCreateVacancyOpen(open)
        if (!open) {
          setCreateMethod("manual")
          setImportLink("")
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Vacancy</DialogTitle>
            <DialogDescription>
              Choose how you want to create a new job vacancy
            </DialogDescription>
          </DialogHeader>
          
          {/* Method Selection Tabs */}
          <Tabs value={createMethod} onValueChange={(value: any) => setCreateMethod(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Import from Link
              </TabsTrigger>
            </TabsList>
            
            {/* Manual Entry Tab */}
            <TabsContent value="manual" className="mt-4">
              <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Frontend Developer"
                    value={newVacancy.title}
                    onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="department" className="text-sm">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={newVacancy.department} 
                    onValueChange={(value) => setNewVacancy({ ...newVacancy, department: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-sm">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Moscow"
                    value={newVacancy.location}
                    onChange={(e) => setNewVacancy({ ...newVacancy, location: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type" className="text-sm">
                    Employment Type
                  </Label>
                  <Select 
                    value={newVacancy.type} 
                    onValueChange={(value) => setNewVacancy({ ...newVacancy, type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="experience" className="text-sm">
                    Experience Required
                  </Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 3-5 years"
                    value={newVacancy.experience}
                    onChange={(e) => setNewVacancy({ ...newVacancy, experience: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deadline" className="text-sm">
                    Application Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newVacancy.deadline}
                    onChange={(e) => setNewVacancy({ ...newVacancy, deadline: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm">
                  Job Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={newVacancy.description}
                  onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            
            {/* Salary Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Salary Information</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="salaryMin" className="text-sm">
                    Minimum Salary
                  </Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder="0"
                    value={newVacancy.salaryMin}
                    onChange={(e) => setNewVacancy({ ...newVacancy, salaryMin: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="salaryMax" className="text-sm">
                    Maximum Salary
                  </Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder="0"
                    value={newVacancy.salaryMax}
                    onChange={(e) => setNewVacancy({ ...newVacancy, salaryMax: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currency" className="text-sm">
                    Currency
                  </Label>
                  <Select 
                    value={newVacancy.currency} 
                    onValueChange={(value) => setNewVacancy({ ...newVacancy, currency: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RUB">RUB</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Interview Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Interview Configuration</h3>
              
              <div>
                <Label htmlFor="interviewDuration" className="text-sm">
                  Interview Duration (minutes)
                </Label>
                <Input
                  id="interviewDuration"
                  type="number"
                  min="15"
                  max="180"
                  value={newVacancy.interviewDuration}
                  onChange={(e) => setNewVacancy({ ...newVacancy, interviewDuration: parseInt(e.target.value) || 60 })}
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm">Question Type Weights</Label>
                <WeightPipeline
                  segments={[
                    {
                      label: "Technical",
                      value: newVacancy.technicalWeight,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Behavioral",
                      value: newVacancy.behavioralWeight,
                      color: "bg-green-500",
                    },
                    {
                      label: "Soft Skills",
                      value: newVacancy.softSkillsWeight,
                      color: "bg-yellow-500",
                    }
                  ]}
                  onChange={(segments) => {
                    setNewVacancy({
                      ...newVacancy,
                      technicalWeight: Math.round(segments[0].value),
                      behavioralWeight: Math.round(segments[1].value),
                      softSkillsWeight: Math.round(segments[2].value)
                    })
                  }}
                />
              </div>
            </div>
            
            {/* Status and Priority */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Status & Priority</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-sm">
                    Status
                  </Label>
                  <Select 
                    value={newVacancy.status} 
                    onValueChange={(value) => setNewVacancy({ ...newVacancy, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority" className="text-sm">
                    Priority
                  </Label>
                  <Select 
                    value={newVacancy.priority} 
                    onValueChange={(value) => setNewVacancy({ ...newVacancy, priority: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
            </TabsContent>
            
            {/* File Upload Tab */}
            <TabsContent value="file" className="mt-4">
              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                    ${isImporting ? 'opacity-50 pointer-events-none' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="text-lg font-medium mb-2">
                    {isImporting ? 'Processing file...' : 'Drop your vacancy file here'}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    or click to browse from your computer
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: JSON, CSV, Excel (XLSX, XLS)
                  </p>
                </div>
                
                {isImporting && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-sm text-gray-600">Parsing file...</span>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">File Format Guide</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• JSON: Include fields like title, department, location, salary range</li>
                    <li>• CSV: First row should contain column headers</li>
                    <li>• Excel: Use the first sheet with headers in the first row</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            {/* Link Import Tab */}
            <TabsContent value="link" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="import-link" className="text-sm font-medium">
                    Job Posting URL
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="import-link"
                      type="url"
                      placeholder="https://example.com/job/senior-developer"
                      value={importLink}
                      onChange={(e) => setImportLink(e.target.value)}
                      disabled={isImporting}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleLinkImport}
                      disabled={!importLink || isImporting}
                      className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white"
                    >
                      {isImporting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Importing...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Import
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Paste a link from popular job boards like LinkedIn, Indeed, HeadHunter, etc.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-900 mb-2">Supported Platforms</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-green-800">
                    <div>
                      <p className="font-semibold mb-1">International:</p>
                      <ul className="space-y-0.5">
                        <li>• LinkedIn Jobs</li>
                        <li>• Indeed</li>
                        <li>• Glassdoor</li>
                        <li>• AngelList</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Russian:</p>
                      <ul className="space-y-0.5">
                        <li>• HeadHunter (hh.ru)</li>
                        <li>• SuperJob</li>
                        <li>• Rabota.ru</li>
                        <li>• Zarplata.ru</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-900 mb-1">Note</h4>
                  <p className="text-xs text-amber-800">
                    The AI will extract and parse the job details from the provided link. 
                    Please review and adjust the imported information before saving.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateVacancyOpen(false)
                setCreateMethod("manual")
                setImportLink("")
                setNewVacancy({
                  title: "",
                  department: "",
                  location: "",
                  type: "Full-time",
                  experience: "",
                  salaryMin: 0,
                  salaryMax: 0,
                  currency: "RUB",
                  status: "draft",
                  priority: "medium",
                  deadline: "",
                  description: "",
                  interviewDuration: 60,
                  technicalWeight: 40,
                  behavioralWeight: 30,
                  softSkillsWeight: 30
                })
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateVacancy}
              disabled={!newVacancy.title || !newVacancy.department || !newVacancy.location}
              className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white"
            >
              Create Vacancy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}