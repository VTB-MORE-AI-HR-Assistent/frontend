"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
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
import vacanciesApi from "@/lib/api/vacancies";
import candidatesApi from "@/lib/api/candidates";
import interviewsApi from "@/lib/api/interviews";
import reportsApi from "@/lib/api/reports";
import { 
  Brain,
  Clock,
  Users, 
  Briefcase,
  ChevronRight,
  ChevronLeft,
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
  Edit,
  Code
} from "lucide-react"

type PipelineStep = "vacancy" | "upload" | "complete"

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
  const { user } = useAuth()
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
    jobId: number | null
  }>({
    title: '',
    description: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    priority: 'medium',
    salaryMin: '',
    salaryMax: '',
    currency: 'RUB',
    deadline: '',
    startDate: '',
    uploadedFile: null as File | null,
    jobId: null as number | null
  })
  const [uploadedCVs, setUploadedCVs] = useState<File[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  // Question distribution state
  const [questionDistribution, setQuestionDistribution] = useState({
    technical: 50,
    behavioral: 30,
    experience: 20
  })
  
  // Question selection state
  const [questionSelectionMode, setQuestionSelectionMode] = useState<"auto" | "role" | "custom">("auto")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, unknown>[]>([])
  const [customQuestions, setCustomQuestions] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<string>("")

  // State for real data
  const [stats, setStats] = useState({
    openPositions: 0,
    totalCandidates: 0,
    interviewsToday: 0,
    pendingReviews: 0
  })
  const [topCandidates, setTopCandidates] = useState<Record<string, unknown>[]>([])
  const [recentReports, setRecentReports] = useState<Record<string, unknown>[]>([])

  // Load real data from APIs
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Load stats from all services with individual error handling
        const loadWithTimeout = (promise: Promise<any>, timeout: number, fallback: any) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ]).catch(() => fallback);
        };

        const [vacancyStats, candidateStats, interviewStats, reportStats] = await Promise.all([
          loadWithTimeout(vacanciesApi.getVacancyStats(), 5000, { active: 0, total: 0 }),
          loadWithTimeout(candidatesApi.getCandidateStats(), 5000, { total: 0 }),
          loadWithTimeout(interviewsApi.getInterviewStats(), 3000, { scheduled: 0 }),
          loadWithTimeout(reportsApi.getRecentReports({ limit: 5 }), 5000, { total: 0, reports: [] })
        ])

        setStats({
          openPositions: vacancyStats?.active || 0,
          totalCandidates: candidateStats?.total || 0,
          interviewsToday: interviewStats?.scheduled || 0,
          pendingReviews: reportStats?.total || 0
        })

        // Load top candidates with error handling
        try {
          const candidatesResponse = await loadWithTimeout(
            candidatesApi.getCandidates({
              sortBy: 'matchScore',
              sortOrder: 'desc',
              limit: 10
            }),
            5000,
            { candidates: [] }
          );
          setTopCandidates(candidatesResponse?.candidates || [])
        } catch (error) {
          console.warn('Failed to load candidates:', error)
          setTopCandidates([])
        }
        
        setRecentReports(reportStats?.reports || [])
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        // Set fallback values to prevent crashes
        setStats({
          openPositions: 0,
          totalCandidates: 0,
          interviewsToday: 0,
          pendingReviews: 0
        })
        setTopCandidates([])
        setRecentReports([])
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // All candidate data now loaded from real API

  // AI Interview Schedule - loaded from real API
  const [todayInterviews, setTodayInterviews] = useState<Record<string, unknown>[]>([])

  // Load today's interviews
  useEffect(() => {
    const loadTodayInterviews = async () => {
      try {
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0))
        const endOfDay = new Date(today.setHours(23, 59, 59, 999))
        
        // Add timeout handling for interviews API
        const loadWithTimeout = (promise: Promise<any>, timeout: number, fallback: any) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ]).catch(() => fallback);
        };
        
        const interviewsResponse = await loadWithTimeout(
          interviewsApi.getInterviews({
            dateFrom: startOfDay.toISOString(),
            dateTo: endOfDay.toISOString(),
            sortBy: 'scheduledAt',
            sortOrder: 'asc'
          }),
          3000,
          { interviews: [] }
        );
        
        setTodayInterviews(interviewsResponse?.interviews || [])
      } catch (error) {
        console.error('Failed to load today interviews:', error)
        setTodayInterviews([])
      }
    }

    loadTodayInterviews()
  }, [])

  // Load top vacancies
  const [topVacancies, setTopVacancies] = useState<Record<string, unknown>[]>([])
  
  useEffect(() => {
    const loadTopVacancies = async () => {
      try {
        // Add timeout handling for vacancies API
        const loadWithTimeout = (promise: Promise<any>, timeout: number, fallback: any) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ]).catch(() => fallback);
        };
        
        const vacanciesResponse = await loadWithTimeout(
          vacanciesApi.getVacancies({
            status: 'active',
            sortBy: 'applicants',
            sortOrder: 'desc',
            limit: 4
          }),
          5000,
          { vacancies: [] }
        );
        
        setTopVacancies(vacanciesResponse?.vacancies || [])
      } catch (error) {
        console.error('Failed to load top vacancies:', error)
        setTopVacancies([])
      }
    }

    loadTopVacancies()
  }, [])


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

  const submitVacancy = async () => {
    if (currentTab === 'file' && vacancyData.uploadedFile) {
      try {
        setIsProcessing(true)
        setUploadError(null)
        
        // Вызываем API для загрузки и парсинга файла вакансии
        const parsedVacancy = await vacanciesApi.uploadVacancyFile(vacancyData.uploadedFile)
        
        // Обновляем данные вакансии из распарсенного файла
        setVacancyData(prev => ({
          ...prev,
          title: parsedVacancy.title || prev.title,
          description: parsedVacancy.description || prev.description,
          department: parsedVacancy.department || prev.department,
          location: parsedVacancy.location || prev.location,
          type: parsedVacancy.type || prev.type,
          salaryMin: parsedVacancy.salary?.min?.toString() || prev.salaryMin,
          salaryMax: parsedVacancy.salary?.max?.toString() || prev.salaryMax,
          currency: parsedVacancy.salary?.currency || prev.currency,
          jobId: typeof parsedVacancy.id === 'number' ? parsedVacancy.id : prev.jobId
        }))
        
        console.log('Vacancy parsed successfully:', parsedVacancy)
        setCurrentStep("upload")
      } catch (error: unknown) {
        console.error('Error uploading vacancy file:', error)
        const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Ошибка при загрузке файла вакансии'
        setUploadError(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    } else {
      // Для ручного ввода просто переходим к следующему шагу
      setCurrentStep("upload")
    }
  }

  const startAnalysis = async () => {
    // Don't immediately jump to complete - let the user see the process
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
      const candidateNames = [
        "Maria Petrova", "Alexander Smirnov", "Elena Kozlova", 
        "Ivan Petrov", "Natalia Volkova", "Sergey Ivanov",
        "Olga Fedorova", "Dmitry Sokolov", "Anna Mikhailova", "Pavel Novikov"
      ]
      
      const candidateEmails = [
        "maria@email.com", "alex@email.com", "elena@email.com",
        "ivan@email.com", "natalia@email.com", "sergey@email.com",
        "olga@email.com", "dmitry@email.com", "anna@email.com", "pavel@email.com"
      ]
      
      // Generate 8-10 candidates with varied match scores
      const numCandidates = Math.min(uploadedCVs.length, 10)
      const mockCandidates: Candidate[] = Array.from({ length: numCandidates }, (_, index) => {
        // Create varied match scores: some high (80-95%), some medium (60-79%), some low (40-59%)
        let matchScore: number
        if (index < 3) {
          // Top candidates
          matchScore = Math.floor(Math.random() * 15) + 80 // 80-95%
        } else if (index < 6) {
          // Medium candidates
          matchScore = Math.floor(Math.random() * 20) + 60 // 60-79%
        } else {
          // Lower candidates
          matchScore = Math.floor(Math.random() * 20) + 40 // 40-59%
        }
        
        return {
          id: `candidate-${index}`,
          name: candidateNames[index] || `Candidate ${index + 1}`,
          email: candidateEmails[index] || `candidate${index + 1}@email.com`,
          phone: "+7 (999) 123-45-67",
          matchScore,
          skills: ["React", "TypeScript", "Node.js", "Python", "MongoDB"],
          experience: `${Math.floor(Math.random() * 5) + 3} years`,
          status: "analyzing",
          cvUrl: uploadedCVs[index]?.name || `cv-${index + 1}.pdf`
        }
      })
      
      // Sort by match score but keep all candidates
      mockCandidates.sort((a, b) => b.matchScore - a.matchScore)
      
      // All candidates are available for selection, not pre-marked
      mockCandidates.forEach(c => {
        c.status = "analyzing"
      })
      
      setCandidates(mockCandidates)
      // Pre-select top 3 candidates by default
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
      setCurrentStep("scheduling")
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
    const steps: PipelineStep[] = ["vacancy", "upload", "complete"]
    return steps.indexOf(step) + 1
  }

  const currentStepNumber = getStepNumber(currentStep)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex flex-col h-screen p-4 pt-6 md:p-8 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || 'there'}
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
                  <p className="text-sm text-muted-foreground">
                    Upload vacancy → AI screens CVs → Schedule top candidates
                  </p>
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
            <div className="mb-8">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
                
                {/* Progress Line */}
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-blue-500 transition-all duration-500"
                  style={{ width: `${((currentStepNumber - 1) / 2) * 100}%` }}
                ></div>
                
                {/* Steps */}
                <div className="relative flex items-center justify-between">
                  {[
                    { label: "Upload Vacancy", icon: "📋" },
                    { label: "Upload CVs", icon: "📄" },
                    { label: "AI Analysis", icon: "🤖" },
                    { label: "Complete", icon: "🎯" }
                  ].map((step, index) => (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        index + 1 <= currentStepNumber 
                          ? index + 1 === currentStepNumber
                            ? "bg-blue-500 border-blue-500 text-white scale-110 shadow-lg"
                            : "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}>
                        {index + 1 < currentStepNumber ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <span className="text-xs font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <span className={`mt-2 text-xs font-medium whitespace-nowrap ${
                        index + 1 <= currentStepNumber ? "text-gray-900" : "text-gray-400"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Vacancy Upload */}
              {currentStep === "vacancy" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 1: Upload Vacancy</h3>
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
                  
                  {/* Error Alert */}
                  {uploadError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800">Ошибка загрузки</AlertTitle>
                      <AlertDescription className="text-red-700">
                        {uploadError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={submitVacancy} 
                      disabled={isProcessing || !vacancyData.uploadedFile}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Next: Upload CVs
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
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
                      onClick={uploadCVs}
                      disabled={uploadedCVs.length === 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing CVs...
                        </>
                      ) : (
                        <>
                          Process CVs
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: AI Analysis */}
              {false && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 4: AI Analysis in Progress</h3>
                  
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




              {/* Complete */}
              {currentStep === "complete" && (
                <div className="space-y-4 text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Process Complete!</h3>
                  <p className="text-muted-foreground">
                    Your vacancy and CVs have been successfully uploaded
                  </p>
                  
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

      {/* Main Content Grid - Fill remaining height */}
      <div className="grid gap-6 md:grid-cols-1 flex-1">

        {/* Top Match Candidates */}
        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Top Match Candidates</span>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription className="text-xs">
              AI-matched candidates with highest compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-2">
            <div className="space-y-1.5 flex-1 overflow-y-auto">
              {topCandidates.slice(0, 4).map((candidate) => (
                <Link key={candidate.id} href={`/candidates/${candidate.id}`} className="block group">
                  <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50 hover:border-[#1B4F8C]/20 transition-all cursor-pointer">
                    {/* Avatar - simple without badge */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] flex items-center justify-center text-white font-semibold text-xs">
                      {candidate.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                    </div>
                    
                    {/* Candidate Info - just name and position */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
                    </div>
                    
                    {/* Match percentage - single display on the right */}
                    <div className={`text-sm font-bold ${
                      candidate.matchScore >= 90 ? 'text-green-600' :
                      candidate.matchScore >= 80 ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>
                      {candidate.matchScore}% match
                    </div>
                    
                    {/* Action Button */}
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/candidates">
              <Button variant="outline" className="w-full mt-3 h-8" size="sm">
                View all candidates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}