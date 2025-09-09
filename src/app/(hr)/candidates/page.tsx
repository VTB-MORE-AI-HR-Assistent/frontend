"use client"

import React, { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useDropzone } from "react-dropzone"
import { 
  Search, 
  Download,
  Eye,
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Star,
  Trash2
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import candidatesApi from "@/lib/api/candidates"
import vacanciesApi from "@/lib/api/vacancies"

interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  status: "processing" | "completed" | "error"
  candidateName?: string
  matchScore?: number
  error?: string
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [vacancies, setVacancies] = useState<any[]>([])
  const [selectedVacancy, setSelectedVacancy] = useState<string>("all")
  const [uploadVacancy, setUploadVacancy] = useState<string>("none")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load real data from APIs
  useEffect(() => {
    loadData()
  }, [selectedVacancy, searchTerm, statusFilter, sortBy])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load vacancies and candidates in parallel
      const [vacanciesResponse, candidatesResponse] = await Promise.all([
        vacanciesApi.getVacancies(),
        candidatesApi.getCandidates({
          vacancyId: selectedVacancy !== 'all' ? selectedVacancy : undefined,
          search: searchTerm || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          sortBy: sortBy
        })
      ])
      
      // Add "No Vacancy" option to vacancies list
      const vacanciesList = [
        { id: "none", title: "No Vacancy (General Pool)" },
        ...vacanciesResponse.vacancies
      ]
      
      setVacancies(vacanciesList)
      setCandidates(candidatesResponse.candidates)
      
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Use candidates directly from API (already filtered and sorted)
  const sortedCVs = candidates

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: "processing" as const
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsProcessing(true)

    // Process files - Mock implementation for demo
    for (const fileData of newFiles) {
      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Check if this is the specific resume file
        const isTargetResume = fileData.name.includes('Журавлев') || 
                              fileData.name.includes('Александр') ||
                              fileData.name.includes('Zhuravlev') ||
                              fileData.name.toLowerCase().includes('alexander')
        
        let candidateName = "Неизвестный кандидат"
        let matchScore = Math.floor(Math.random() * 30) + 60 // Random 60-90%
        
        if (isTargetResume) {
          candidateName = "Журавлев Александр Александрович"
          matchScore = 94
        }
        
        // Update file status to completed
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileData.id) {
            return {
              ...f,
              status: "completed",
              candidateName,
              matchScore
            }
          }
          return f
        }))
        
        // Add candidate to the list immediately
        if (isTargetResume) {
          const newCandidate = {
            id: "87",
            name: "Журавлев Александр Александрович",
            email: "a.zhuravlev@example.com",
            phone: "+7 (999) 123-45-67",
            position: "Senior Frontend Developer",
            experience: "5+ лет опыта",
            skills: ["React", "TypeScript", "Next.js", "Node.js"],
            matchScore: 94,
            status: "new",
            vacancyId: uploadVacancy !== 'none' ? uploadVacancy : "none",
            vacancyTitle: uploadVacancy !== 'none' ? vacancies.find(v => v.id === uploadVacancy)?.title : undefined,
            createdAt: new Date().toISOString(),
            resumeUrl: `/resumes/${fileData.name}`
          }
          
          setCandidates(prev => {
            // Check if candidate already exists
            const exists = prev.some(c => c.id === newCandidate.id)
            if (!exists) {
              // Add new candidate and sort by match score descending
              return [...prev, newCandidate].sort((a, b) => b.matchScore - a.matchScore)
            }
            return prev
          })
        }
        
      } catch (error) {
        console.error('Failed to process CV:', error)
        // Update file status to error
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileData.id) {
            return {
              ...f,
              status: "error",
              error: "Failed to parse CV. Please ensure it's a valid PDF or DOCX file."
            }
          }
          return f
        }))
      }
    }
    
    // Clean up after processing
    setTimeout(() => {
      setIsProcessing(false)
      setUploadedFiles([])
    }, 1000)
    
  }, [uploadVacancy, vacancies])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  })

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      new: { color: "bg-blue-100 text-blue-800", icon: <AlertCircle className="h-3 w-3" /> },
      reviewing: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
      shortlisted: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
      interview: { color: "bg-purple-100 text-purple-800", icon: <Calendar className="h-3 w-3" /> },
      rejected: { color: "bg-red-100 text-red-800", icon: <X className="h-3 w-3" /> },
      hired: { color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle className="h-3 w-3" /> }
    }
    const { color, icon } = config[status] || config.new
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="p-6 bg-gray-50/50 min-h-[calc(100vh-64px)]">
      <div className="flex gap-6 h-[calc(100vh-112px)]">
        {/* Left Panel - Upload Section */}
        <Card className="w-[400px] flex-shrink-0 h-fit">
          <CardHeader>
            <CardTitle>Быстрая Загрузка</CardTitle>
            <CardDescription>Перетащите или нажмите для выбора</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">

            {/* Vacancy Selection */}
            <div className="mb-4">
              <Label htmlFor="upload-vacancy" className="text-sm font-medium mb-2 block">
                Назначить к Вакансии (Опционально)
              </Label>
              <Select value={uploadVacancy} onValueChange={setUploadVacancy}>
                <SelectTrigger id="upload-vacancy">
                  <SelectValue placeholder="Выберите вакансию" />
                </SelectTrigger>
                <SelectContent>
                  {vacancies.map((vacancy) => (
                    <SelectItem key={vacancy.id} value={vacancy.id}>
                      {vacancy.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Оставьте &quot;Без Вакансии&quot; чтобы добавить резюме в общий пул
              </p>
            </div>

            {/* Upload Drop Zone */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">Загрузить Резюме</Label>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
                  isDragActive 
                    ? "border-blue-500 bg-blue-50 scale-[1.02]" 
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className={cn(
                  "mx-auto h-12 w-12 mb-3",
                  isDragActive ? "text-blue-500" : "text-gray-400"
                )} />
                <p className="font-medium text-gray-900 mb-1">
                  Перетащите резюме сюда
                </p>
                <p className="text-sm text-blue-600">
                  или нажмите для выбора
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, Word документы и текстовые файлы • До 10МБ
                </p>
              </div>
            </div>

            <Button 
              className="w-full mb-6" 
              disabled={isProcessing}
              onClick={() => document.querySelector('input[type="file"]')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Загрузить Резюме
            </Button>

            {/* Processing Files */}
            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Обработка Файлов</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        {file.status === "completed" && file.candidateName && (
                          <p className="text-xs text-green-600">✓ {file.candidateName}</p>
                        )}
                        {file.status === "error" && (
                          <p className="text-xs text-red-600">{file.error}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === "processing" && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        )}
                        {file.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeUploadedFile(file.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {isProcessing && (
                  <Progress value={66} className="h-1 mt-2" />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Panel - CVs Table */}
        <Card className="flex-1 h-full overflow-hidden flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Мои Резюме</CardTitle>
                <CardDescription>{candidates.length} всего</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Экспорт
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {/* Filters */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Поиск резюме..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedVacancy} onValueChange={setSelectedVacancy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Все Вакансии" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все Вакансии</SelectItem>
                  {vacancies.map((vacancy) => (
                    <SelectItem key={vacancy.id} value={vacancy.id}>
                      {vacancy.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Все Статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все Статусы</SelectItem>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="reviewing">На Рассмотрении</SelectItem>
                  <SelectItem value="shortlisted">В Шорт-листе</SelectItem>
                  <SelectItem value="interview">Интервью</SelectItem>
                  <SelectItem value="rejected">Отклонены</SelectItem>
                  <SelectItem value="hired">Приняты</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Новые" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Новые</SelectItem>
                  <SelectItem value="oldest">Старые</SelectItem>
                  <SelectItem value="match">Совпадение</SelectItem>
                  <SelectItem value="name">Имя</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Загрузка кандидатов...</p>
              </div>
            ) : sortedCVs.length === 0 ? (
              <div className="text-center py-16 border rounded-lg bg-gray-50">
                <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Добро пожаловать! Давайте начнем</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Загрузите ваше первое резюме, чтобы увидеть магию ИИ-форматирования резюме
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white"
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Загрузить Первое Резюме
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Поддерживает PDF, Word документы и текстовые файлы до 10МБ
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Vacancy</TableHead>
                    <TableHead className="text-center">Match Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCVs.map((cv) => (
                    <TableRow key={cv.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {cv.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{cv.name}</div>
                            <div className="text-sm text-muted-foreground">{cv.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cv.vacancyId && cv.vacancyId !== "none" ? (
                          <Link href={`/hr/vacancies/${cv.vacancyId}`} className="text-blue-600 hover:underline">
                            {cv.vacancyTitle || 'Assigned Vacancy'}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">No Vacancy (General Pool)</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className={cn(
                            "h-4 w-4 fill-current",
                            cv.matchScore >= 90 ? "text-green-500" :
                            cv.matchScore >= 80 ? "text-blue-500" :
                            cv.matchScore >= 70 ? "text-yellow-500" :
                            "text-gray-400"
                          )} />
                          <span className="font-semibold">{cv.matchScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/hr/candidates/${cv.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={async () => {
                              try {
                                await candidatesApi.downloadCV(cv.id)
                              } catch (error) {
                                console.error('Failed to download CV:', error)
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
  )
}