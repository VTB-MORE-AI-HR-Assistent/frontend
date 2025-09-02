"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Sparkles,
  Upload,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Zap,
  Loader2,
  X,
  BookOpen,
  Edit
} from "lucide-react"

type PipelineStep = "vacancy" | "upload" | "analysis" | "notification" | "interview-config" | "scheduling" | "complete"

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  matchScore: number
  skills: string[]
  experience: string
  status: "analyzing" | "qualified" | "notified" | "scheduled" | "rejected"
  cvUrl?: string
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<PipelineStep>("vacancy")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTab, setCurrentTab] = useState("manual")
  const [vacancyData, setVacancyData] = useState<{
    title: string;
    description: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    priority: string;
    salaryMin: string;
    salaryMax: string;
    currency: string;
    deadline: string;
    startDate: string;
    uploadedFile: File | null;
    jobUrl: string;
  }>({
    title: "",
    description: "",
    department: "",
    location: "",
    type: "Full-time",
    experience: "",
    priority: "medium",
    salaryMin: "",
    salaryMax: "",
    currency: "RUB",
    deadline: "",
    startDate: "",
    uploadedFile: null,
    jobUrl: ""
  })
  const [uploadedCVs, setUploadedCVs] = useState<File[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [analysisProgress, setAnalysisProgress] = useState(0)
  
  // Question distribution state
  const [questionDistribution, setQuestionDistribution] = useState({
    technical: 50,
    behavioral: 30,
    experience: 20
  })
  
  // Question selection state
  const [questionSelectionMode, setQuestionSelectionMode] = useState<"auto" | "manual" | "custom">("auto")
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([])
  const [customQuestions, setCustomQuestions] = useState<string>("")

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
    { id: 1, title: "Senior React Developer", uploadedCVs: 45, new: 12, status: "active" },
    { id: 2, title: "Product Manager", uploadedCVs: 23, new: 5, status: "active" },
    { id: 3, title: "DevOps Engineer", uploadedCVs: 31, new: 8, status: "active" },
    { id: 4, title: "QA Automation Engineer", uploadedCVs: 18, new: 3, status: "paused" }
  ]


  const onDropCVs = useCallback((acceptedFiles: File[]) => {
    setUploadedCVs(prev => [...prev, ...acceptedFiles])
  }, [])

  const onDropVacancy = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setVacancyData(prev => ({ ...prev, uploadedFile: acceptedFiles[0] }))
    }
  }, [])

  // Dropzone for CVs
  const { getRootProps: getCVRootProps, getInputProps: getCVInputProps, isDragActive: isCVDragActive } = useDropzone({
    onDrop: onDropCVs,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  })

  // Dropzone for Vacancy
  const { getRootProps: getVacancyRootProps, getInputProps: getVacancyInputProps, isDragActive: isVacancyDragActive } = useDropzone({
    onDrop: onDropVacancy,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  })

  const submitVacancy = () => {
    setCurrentStep("upload")
  }

  const startAnalysis = async () => {
    setCurrentStep("analysis")
    setIsProcessing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)

    // Generate mock candidates after "analysis"
    setTimeout(() => {
      const mockCandidates: Candidate[] = uploadedCVs.slice(0, 5).map((file, index) => ({
        id: `candidate-${index}`,
        name: ["Maria Petrova", "Alexander Smirnov", "Elena Kozlova", "Ivan Petrov", "Natalia Volkova"][index],
        email: ["maria@email.com", "alex@email.com", "elena@email.com", "ivan@email.com", "natalia@email.com"][index],
        phone: "+7 (999) 123-45-67",
        matchScore: Math.floor(Math.random() * 30) + 70,
        skills: ["React", "TypeScript", "Node.js", "Python", "MongoDB"],
        experience: `${Math.floor(Math.random() * 5) + 3} years`,
        status: "analyzing",
        cvUrl: file.name
      }))
      
      // Sort by match score and mark top 3
      mockCandidates.sort((a, b) => b.matchScore - a.matchScore)
      mockCandidates.forEach((c, i) => {
        c.status = i < 3 ? "qualified" : "rejected"
      })
      
      setCandidates(mockCandidates)
      setSelectedCandidates(mockCandidates.slice(0, 3).map(c => c.id))
      setIsProcessing(false)
      setCurrentStep("notification")
    }, 5500)
  }

  const sendNotifications = () => {
    setIsProcessing(true)
    
    // Simulate sending notifications
    setTimeout(() => {
      setCandidates(prev => prev.map(c => 
        selectedCandidates.includes(c.id) 
          ? { ...c, status: "notified" as const }
          : c
      ))
      setIsProcessing(false)
      setCurrentStep("interview-config")
    }, 2000)
  }

  const handleQuestionDistributionChange = (type: 'technical' | 'behavioral' | 'experience', value: number) => {
    const otherTypes = Object.keys(questionDistribution).filter(k => k !== type) as Array<'technical' | 'behavioral' | 'experience'>
    const currentOthersTotal = otherTypes.reduce((sum, t) => sum + questionDistribution[t], 0)
    const newTotal = value + currentOthersTotal
    
    if (newTotal <= 100) {
      setQuestionDistribution(prev => ({
        ...prev,
        [type]: value
      }))
    } else {
      // Adjust other values proportionally
      const excess = newTotal - 100
      const ratio = excess / currentOthersTotal
      
      const newDistribution = { ...questionDistribution, [type]: value }
      otherTypes.forEach(t => {
        newDistribution[t] = Math.max(0, Math.floor(questionDistribution[t] * (1 - ratio)))
      })
      
      // Ensure total is exactly 100
      const sum = Object.values(newDistribution).reduce((a, b) => a + b, 0)
      if (sum < 100) {
        newDistribution[otherTypes[0]] += 100 - sum
      }
      
      setQuestionDistribution(newDistribution)
    }
  }


  const getStepNumber = (step: PipelineStep) => {
    const steps: PipelineStep[] = ["vacancy", "upload", "analysis", "notification", "interview-config", "scheduling", "complete"]
    return steps.indexOf(step) + 1
  }

  const currentStepNumber = getStepNumber(currentStep)

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
            Here&apos;s what&apos;s happening with your recruitment today
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* AI Recruitment Banner */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] opacity-5"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-full bg-[#1B4F8C] flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Start Hiring with AI</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload vacancy → AI screens CVs → Schedule top candidates
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      5 min process
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      85% time saved
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Animated Process Flow */}
                  <div className="hidden md:flex items-center gap-2">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-[#1B4F8C]" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 animate-pulse" />
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Brain className="h-6 w-6 text-[#1B4F8C]" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse delay-75"></div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 animate-pulse delay-150" />
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-[#1B4F8C]" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                  <Button className="bg-[#1B4F8C] hover:bg-[#163c6e] group-hover:scale-105 transition-transform">
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI-Powered Candidate Screening</DialogTitle>
              <DialogDescription>
                Upload a job vacancy and CVs - AI will find the best candidates and help schedule interviews
              </DialogDescription>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6">
              {["Upload Vacancy", "Upload CVs", "AI Analysis", "Notify", "Schedule"].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    index + 1 <= currentStepNumber 
                      ? "bg-blue-500 border-blue-500 text-white" 
                      : "border-gray-300 text-gray-500"
                  }`}>
                    {index + 1 <= currentStepNumber - 1 ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  {index < 4 && (
                    <div className={`w-16 h-0.5 ${
                      index + 1 < currentStepNumber ? "bg-blue-500" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Vacancy Upload */}
              {currentStep === "vacancy" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 1: Upload Vacancy</h3>
                  <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      <TabsTrigger value="file">Upload File</TabsTrigger>
                      <TabsTrigger value="link">From URL</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="manual" className="space-y-4 max-h-[500px] overflow-y-auto">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Job Title <span className="text-red-500">*</span></Label>
                            <Input 
                              placeholder="e.g., Senior Frontend Developer"
                              value={vacancyData.title}
                              onChange={(e) => setVacancyData({...vacancyData, title: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Department <span className="text-red-500">*</span></Label>
                            <Select 
                              value={vacancyData.department}
                              onValueChange={(v) => setVacancyData({...vacancyData, department: v})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="Product">Product</SelectItem>
                                <SelectItem value="Design">Design</SelectItem>
                                <SelectItem value="Analytics">Analytics</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="HR">HR</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Location <span className="text-red-500">*</span></Label>
                            <Input 
                              placeholder="e.g., Moscow, Remote"
                              value={vacancyData.location}
                              onChange={(e) => setVacancyData({...vacancyData, location: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Employment Type</Label>
                            <Select 
                              value={vacancyData.type}
                              onValueChange={(v) => setVacancyData({...vacancyData, type: v})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Internship">Internship</SelectItem>
                                <SelectItem value="Freelance">Freelance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Experience Level <span className="text-red-500">*</span></Label>
                            <Input 
                              placeholder="e.g., 3-5 years"
                              value={vacancyData.experience || ''}
                              onChange={(e) => setVacancyData({...vacancyData, experience: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Priority Level</Label>
                            <Select 
                              value={vacancyData.priority || 'medium'}
                              onValueChange={(v) => setVacancyData({...vacancyData, priority: v})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Compensation */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">Compensation</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Min Salary</Label>
                            <Input 
                              type="number"
                              placeholder="150000"
                              value={vacancyData.salaryMin || ''}
                              onChange={(e) => setVacancyData({...vacancyData, salaryMin: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Max Salary</Label>
                            <Input 
                              type="number"
                              placeholder="250000"
                              value={vacancyData.salaryMax || ''}
                              onChange={(e) => setVacancyData({...vacancyData, salaryMax: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Currency</Label>
                            <Select 
                              value={vacancyData.currency || 'RUB'}
                              onValueChange={(v) => setVacancyData({...vacancyData, currency: v})}
                            >
                              <SelectTrigger>
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

                      <Separator />

                      {/* Timeline */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">Timeline</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Application Deadline <span className="text-red-500">*</span></Label>
                            <Input 
                              type="date"
                              value={vacancyData.deadline || ''}
                              onChange={(e) => setVacancyData({...vacancyData, deadline: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Expected Start Date</Label>
                            <Input 
                              type="date"
                              value={vacancyData.startDate || ''}
                              onChange={(e) => setVacancyData({...vacancyData, startDate: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Description */}
                      <div className="space-y-2">
                        <Label>Job Description <span className="text-red-500">*</span></Label>
                        <Textarea 
                          placeholder="Detailed description of the position..."
                          rows={4}
                          value={vacancyData.description}
                          onChange={(e) => setVacancyData({...vacancyData, description: e.target.value})}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="file" className="space-y-4">
                      <div className="space-y-4">
                        <div
                          {...getVacancyRootProps()}
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                            isVacancyDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input {...getVacancyInputProps()} />
                          <Upload className={`mx-auto h-12 w-12 mb-3 ${
                            isVacancyDragActive ? "text-blue-500" : "text-gray-400"
                          }`} />
                          <p className="font-medium text-gray-900 mb-1">
                            {isVacancyDragActive ? "Drop the vacancy file here" : "Drop your vacancy file here"}
                          </p>
                          <p className="text-sm text-muted-foreground">or click to browse</p>
                          <Button variant="outline" className="mt-4" type="button">
                            <Upload className="mr-2 h-4 w-4" />
                            Select File
                          </Button>
                        </div>
                        
                        {vacancyData.uploadedFile && (
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">{vacancyData.uploadedFile.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({Math.round(vacancyData.uploadedFile.size / 1024)}KB)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setVacancyData({...vacancyData, uploadedFile: null})}
                              type="button"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="link" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Job Posting URL</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="https://example.com/job/12345" 
                            value={vacancyData.jobUrl}
                            onChange={(e) => setVacancyData({...vacancyData, jobUrl: e.target.value})}
                          />
                          <Button type="button">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Import
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {["HeadHunter", "LinkedIn", "Indeed"].map(site => (
                          <div key={site} className="p-2 border rounded text-center text-sm">
                            {site}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={submitVacancy} 
                      disabled={
                        currentTab === 'manual' 
                          ? !vacancyData.title || !vacancyData.department || !vacancyData.location || !vacancyData.experience || !vacancyData.deadline || !vacancyData.description
                          : currentTab === 'file' 
                            ? !vacancyData.uploadedFile
                            : !vacancyData.jobUrl
                      }
                    >
                      Next: Upload CVs
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: CV Upload */}
              {currentStep === "upload" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 2: Upload Candidate CVs</h3>
                  
                  <div
                    {...getCVRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                      isCVDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input {...getCVInputProps()} />
                    <Upload className={`mx-auto h-12 w-12 mb-3 ${
                      isCVDragActive ? "text-blue-500" : "text-gray-400"
                    }`} />
                    <p className="font-medium text-gray-900 mb-1">
                      Drop CV files here
                    </p>
                    <p className="text-sm text-blue-600">or click to browse</p>
                    <p className="text-xs text-gray-500 mt-2">
                      PDF, DOC, DOCX • Multiple files supported
                    </p>
                  </div>

                  {uploadedCVs.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded CVs ({uploadedCVs.length})</Label>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {uploadedCVs.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({Math.round(file.size / 1024)}KB)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setUploadedCVs(prev => prev.filter((_, i) => i !== index))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("vacancy")}>
                      Back
                    </Button>
                    <Button 
                      onClick={startAnalysis}
                      disabled={uploadedCVs.length === 0}
                    >
                      Start AI Analysis
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: AI Analysis */}
              {currentStep === "analysis" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 3: AI Analysis in Progress</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Analyzing {uploadedCVs.length} CVs</span>
                      <span className="text-sm font-medium">{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-blue-600">
                            {uploadedCVs.length}
                          </div>
                          <p className="text-xs text-muted-foreground">Total CVs</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.floor(analysisProgress / 100 * uploadedCVs.length)}
                          </div>
                          <p className="text-xs text-muted-foreground">Analyzed</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-purple-600">
                            {analysisProgress >= 100 ? "3" : "..."}
                          </div>
                          <p className="text-xs text-muted-foreground">Qualified</p>
                        </CardContent>
                      </Card>
                    </div>

                    {isProcessing && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Notification */}
              {currentStep === "notification" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 4: Notify Top Candidates</h3>
                  
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900">Analysis Complete</AlertTitle>
                    <AlertDescription className="text-green-800">
                      AI has identified the top 3 candidates based on match score
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    {candidates.filter(c => c.status === "qualified").map((candidate, index) => (
                      <Card key={candidate.id} className="border-blue-200">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback>
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{candidate.name}</h4>
                                  <Badge variant="outline" className="gap-1">
                                    #{index + 1} Match
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {candidate.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {candidate.phone}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">{candidate.matchScore}%</span>
                                  </div>
                                  <Separator orientation="vertical" className="h-4" />
                                  <span className="text-sm">{candidate.experience}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedCandidates.includes(candidate.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCandidates([...selectedCandidates, candidate.id])
                                  } else {
                                    setSelectedCandidates(selectedCandidates.filter(id => id !== candidate.id))
                                  }
                                }}
                                className="h-4 w-4"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                      Back
                    </Button>
                    <Button 
                      onClick={sendNotifications}
                      disabled={selectedCandidates.length === 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Interview Invitations
                          <Mail className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Interview Configuration */}
              {currentStep === "interview-config" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 5: Configure AI Interview</h3>
                  
                  <Alert className="border-blue-200 bg-blue-50">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-900">Customize Interview Focus</AlertTitle>
                    <AlertDescription className="text-blue-800">
                      Set the distribution of question types for the AI interviewer to ensure comprehensive candidate assessment.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle>Question Distribution</CardTitle>
                      <CardDescription>
                        Adjust the percentage of each question type. Total must equal 100%.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Technical Questions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium">Technical Questions</Label>
                          <span className="text-2xl font-bold text-[#1B4F8C]">{questionDistribution.technical}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Programming skills, frameworks, tools, and technical problem-solving
                        </p>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={questionDistribution.technical}
                          onChange={(e) => handleQuestionDistributionChange('technical', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B4F8C]"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Behavioral Questions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium">Behavioral Questions</Label>
                          <span className="text-2xl font-bold text-[#1B4F8C]">{questionDistribution.behavioral}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Soft skills, teamwork, communication, and problem-solving approach
                        </p>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={questionDistribution.behavioral}
                          onChange={(e) => handleQuestionDistributionChange('behavioral', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B4F8C]"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Experience Questions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium">Experience Questions</Label>
                          <span className="text-2xl font-bold text-[#1B4F8C]">{questionDistribution.experience}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Previous work experience, projects, achievements, and career progression
                        </p>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={questionDistribution.experience}
                          onChange={(e) => handleQuestionDistributionChange('experience', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B4F8C]"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Total Indicator */}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Distribution</span>
                          <span className={`text-lg font-bold ${
                            (questionDistribution.technical + questionDistribution.behavioral + questionDistribution.experience) === 100
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {questionDistribution.technical + questionDistribution.behavioral + questionDistribution.experience}%
                          </span>
                        </div>
                        {(questionDistribution.technical + questionDistribution.behavioral + questionDistribution.experience) !== 100 && (
                          <p className="text-sm text-red-600 mt-1">
                            Distribution must equal 100%
                          </p>
                        )}
                      </div>

                      {/* Visual Distribution */}
                      <div className="pt-4">
                        <Label className="text-sm font-medium mb-2 block">Visual Distribution</Label>
                        <div className="flex h-8 rounded-lg overflow-hidden">
                          {questionDistribution.technical > 0 && (
                            <div 
                              style={{ width: `${questionDistribution.technical}%` }}
                              className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                            >
                              {questionDistribution.technical > 10 && `${questionDistribution.technical}%`}
                            </div>
                          )}
                          {questionDistribution.behavioral > 0 && (
                            <div 
                              style={{ width: `${questionDistribution.behavioral}%` }}
                              className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                            >
                              {questionDistribution.behavioral > 10 && `${questionDistribution.behavioral}%`}
                            </div>
                          )}
                          {questionDistribution.experience > 0 && (
                            <div 
                              style={{ width: `${questionDistribution.experience}%` }}
                              className="bg-purple-500 flex items-center justify-center text-xs text-white font-medium"
                            >
                              {questionDistribution.experience > 10 && `${questionDistribution.experience}%`}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-xs">Technical</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-xs">Behavioral</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-purple-500 rounded"></div>
                            <span className="text-xs">Experience</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Question Selection Mode */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Question Selection</CardTitle>
                      <CardDescription>
                        Choose how AI should select interview questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Tabs value={questionSelectionMode} onValueChange={(value: any) => setQuestionSelectionMode(value)}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="auto">Automatic</TabsTrigger>
                          <TabsTrigger value="manual">From Question Bank</TabsTrigger>
                          <TabsTrigger value="custom">Custom Questions</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="auto" className="space-y-3">
                          <Alert>
                            <Brain className="h-4 w-4" />
                            <AlertTitle>AI-Generated Questions</AlertTitle>
                            <AlertDescription>
                              AI will automatically generate relevant questions based on the job requirements and candidate's resume, 
                              following the distribution percentages you've set above.
                            </AlertDescription>
                          </Alert>
                        </TabsContent>
                        
                        <TabsContent value="manual" className="space-y-3">
                          <Alert>
                            <BookOpen className="h-4 w-4" />
                            <AlertTitle>Select from Question Bank</AlertTitle>
                            <AlertDescription>
                              Choose specific questions from your question bank for this role. AI will use these questions 
                              during the interview while maintaining the distribution balance.
                            </AlertDescription>
                          </Alert>
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <p className="text-sm text-muted-foreground mb-3">
                              {selectedQuestions.length > 0 
                                ? `${selectedQuestions.length} questions selected`
                                : "No questions selected yet"}
                            </p>
                            <Button 
                              variant="outline" 
                              onClick={() => window.open('/dashboard/question-bank', '_blank')}
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              Open Question Bank
                            </Button>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="custom" className="space-y-3">
                          <Alert>
                            <Edit className="h-4 w-4" />
                            <AlertTitle>Custom Questions</AlertTitle>
                            <AlertDescription>
                              Add your own custom questions for this specific interview. Enter one question per line.
                            </AlertDescription>
                          </Alert>
                          <Textarea
                            placeholder="Enter your custom questions here...&#10;One question per line&#10;&#10;Example:&#10;1. What interests you about this position?&#10;2. Describe your experience with React and TypeScript&#10;3. How do you handle tight deadlines?"
                            value={customQuestions}
                            onChange={(e) => setCustomQuestions(e.target.value)}
                            rows={8}
                            className="font-mono text-sm"
                          />
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              {customQuestions.split('\n').filter(q => q.trim()).length} questions added
                            </p>
                            <div className="space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setCustomQuestions("")}
                                disabled={!customQuestions}
                              >
                                Clear All
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      {/* Advanced Options */}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">Skip Question Selection</Label>
                            <p className="text-xs text-muted-foreground">
                              Let AI handle everything automatically
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setQuestionSelectionMode("auto")
                              setSelectedQuestions([])
                              setCustomQuestions("")
                            }}
                          >
                            Reset to Default
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>AI Interview Customization</AlertTitle>
                    <AlertDescription>
                      These settings will be applied to all AI interviews for this vacancy. 
                      The AI will dynamically adjust questions based on candidate responses while maintaining the specified distribution.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("notification")}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep("scheduling")}
                      disabled={(questionDistribution.technical + questionDistribution.behavioral + questionDistribution.experience) !== 100}
                    >
                      Continue to Scheduling
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 6: Scheduling */}
              {currentStep === "scheduling" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 6: Share Scheduling Links</h3>
                  
                  <Alert className="border-blue-200 bg-blue-50">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-900">Invitations Sent</AlertTitle>
                    <AlertDescription className="text-blue-800">
                      Scheduling links have been sent to candidates. They will select their preferred interview times.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    {candidates.filter(c => c.status === "notified").map((candidate, index) => (
                      <Card key={candidate.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{candidate.name}</h4>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                              </div>
                            </div>
                            <Badge className="bg-amber-100 text-amber-800">
                              <Clock className="mr-1 h-3 w-3" />
                              Awaiting Response
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground mb-1">Scheduling Link</Label>
                              <div className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-slate-500" />
                                <code className="text-xs text-slate-600">
                                  {`${window.location.origin}/interview-schedule/${candidate.id}-${index + 1}`}
                                </code>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/interview-schedule/${candidate.id}-${index + 1}`
                                )
                                // In production, would show a toast notification
                                alert("Link copied to clipboard!")
                              }}
                            >
                              <LinkIcon className="mr-2 h-3 w-3" />
                              Copy Link
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>Email sent at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Tracking Interview Scheduling</AlertTitle>
                    <AlertDescription>
                      You'll receive notifications when candidates select their interview times. 
                      The dashboard will automatically update with confirmed schedules.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("interview-config")}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep("complete")}
                    >
                      Finish Setup
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Complete */}
              {currentStep === "complete" && (
                <div className="space-y-4 text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Process Complete!</h3>
                  <p className="text-muted-foreground">
                    Interviews have been scheduled with top candidates
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{uploadedCVs.length}</div>
                        <p className="text-xs text-muted-foreground">CVs Analyzed</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{selectedCandidates.length}</div>
                        <p className="text-xs text-muted-foreground">Interviews Scheduled</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">Time Saved</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setCurrentStep("vacancy")
                      setUploadedCVs([])
                      setCandidates([])
                      setSelectedCandidates([])
                    }}
                    className="mt-4"
                  >
                    Start New Process
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
      </Dialog>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today&apos;s Schedule</span>
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
                      {vacancy.status === "paused" && (
                        <Badge variant="secondary" className="text-xs py-0 px-1.5 h-5">
                          Paused
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {vacancy.uploadedCVs} CVs uploaded · {vacancy.new} new
                    </p>
                  </div>
                  <Link href={`/vacancies/${vacancy.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
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