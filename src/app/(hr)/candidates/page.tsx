"use client"

import React, { useState, useCallback } from "react"
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
import { Separator } from "@/components/ui/separator"

// Mock vacancies data
const mockVacancies = [
  { id: "none", title: "No Vacancy (General Pool)" },
  { id: "1", title: "Senior Frontend Developer" },
  { id: "2", title: "Product Manager" },
  { id: "3", title: "Backend Developer" },
  { id: "4", title: "UX/UI Designer" },
  { id: "5", title: "Data Analyst" },
  { id: "6", title: "DevOps Engineer" }
]

// Mock CVs data
const mockCVs = [
  {
    id: "1",
    candidateName: "Maria Petrova",
    email: "maria.petrova@email.com",
    phone: "+7 (999) 123-45-67",
    position: "Senior Frontend Developer",
    experience: "7 years",
    skills: ["React", "TypeScript", "Next.js", "Redux"],
    matchScore: 95,
    uploadedAt: "2024-01-20T10:30:00",
    status: "interview",
    vacancyId: "1",
    vacancyTitle: "Senior Frontend Developer",
    cvUrl: "cv_maria_petrova.pdf"
  },
  {
    id: "2",
    candidateName: "Alexander Smirnov",
    email: "alex.smirnov@email.com",
    phone: "+7 (999) 234-56-78",
    position: "Product Manager",
    experience: "5 years",
    skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
    matchScore: 87,
    uploadedAt: "2024-01-19T14:20:00",
    status: "reviewing",
    vacancyId: "2",
    vacancyTitle: "Product Manager",
    cvUrl: "cv_alexander_smirnov.pdf"
  },
  {
    id: "3",
    candidateName: "Elena Kozlova",
    email: "elena.k@email.com",
    phone: "+7 (999) 345-67-89",
    position: "Backend Developer",
    experience: "6 years",
    skills: ["Node.js", "Python", "MongoDB", "Docker"],
    matchScore: 92,
    uploadedAt: "2024-01-18T09:15:00",
    status: "shortlisted",
    vacancyId: "3",
    vacancyTitle: "Backend Developer",
    cvUrl: "cv_elena_kozlova.pdf"
  },
  {
    id: "4",
    candidateName: "Ivan Petrov",
    email: "ivan.petrov@email.com",
    phone: "+7 (999) 456-78-90",
    position: "Full Stack Developer",
    experience: "4 years",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    matchScore: 78,
    uploadedAt: "2024-01-17T16:45:00",
    status: "new",
    vacancyId: "none",
    vacancyTitle: "No Vacancy (General Pool)",
    cvUrl: "cv_ivan_petrov.pdf"
  },
  {
    id: "5",
    candidateName: "Natalia Volkova",
    email: "natalia.v@email.com",
    phone: "+7 (999) 567-89-01",
    position: "UX/UI Designer",
    experience: "3 years",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
    matchScore: 85,
    uploadedAt: "2024-01-16T11:30:00",
    status: "interview",
    vacancyId: "4",
    vacancyTitle: "UX/UI Designer",
    cvUrl: "cv_natalia_volkova.pdf"
  }
]

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
  const [cvs, setCvs] = useState(mockCVs)
  const [selectedVacancy, setSelectedVacancy] = useState<string>("all")
  const [uploadVacancy, setUploadVacancy] = useState<string>("none")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter CVs based on selected vacancy and other filters
  const filteredCVs = cvs.filter(cv => {
    const matchesVacancy = selectedVacancy === "all" || cv.vacancyId === selectedVacancy
    const matchesSearch = 
      cv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || cv.status === statusFilter
    
    return matchesVacancy && matchesSearch && matchesStatus
  })

  // Sort CVs
  const sortedCVs = [...filteredCVs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case "oldest":
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      case "match":
        return b.matchScore - a.matchScore
      case "name":
        return a.candidateName.localeCompare(b.candidateName)
      default:
        return 0
    }
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: "processing" as const
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsProcessing(true)

    // Simulate file processing
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const isSuccess = Math.random() > 0.1
            if (isSuccess) {
              // Add to CVs list
              const newCV = {
                id: Math.random().toString(36).substr(2, 9),
                candidateName: `Candidate ${Math.floor(Math.random() * 1000)}`,
                email: `candidate${Math.floor(Math.random() * 1000)}@email.com`,
                phone: `+7 (999) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90) + 10}`,
                position: ["Frontend Developer", "Backend Developer", "Product Manager", "Designer"][Math.floor(Math.random() * 4)],
                experience: `${Math.floor(Math.random() * 10) + 1} years`,
                skills: ["React", "TypeScript", "Node.js", "Python"].slice(0, Math.floor(Math.random() * 4) + 1),
                matchScore: Math.floor(Math.random() * 30) + 70,
                uploadedAt: new Date().toISOString(),
                status: "new" as const,
                vacancyId: uploadVacancy,
                vacancyTitle: mockVacancies.find(v => v.id === uploadVacancy)?.title || "No Vacancy",
                cvUrl: file.name
              }
              setCvs(prev => [newCV, ...prev])
              
              return {
                ...f,
                status: "completed",
                candidateName: newCV.candidateName,
                matchScore: newCV.matchScore
              }
            } else {
              return {
                ...f,
                status: "error",
                error: "Failed to parse CV. Please ensure it's a valid PDF or DOCX file."
              }
            }
          }
          return f
        }))

        // Check if all files are processed
        if (index === newFiles.length - 1) {
          setTimeout(() => {
            setIsProcessing(false)
            setUploadedFiles([])
          }, 2000)
        }
      }, 1500 + index * 500)
    })
  }, [uploadVacancy])

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

  // Stats calculations
  const totalCVs = selectedVacancy === "all" ? cvs.length : filteredCVs.length
  const newCVs = filteredCVs.filter(cv => cv.status === "new").length
  const reviewingCVs = filteredCVs.filter(cv => cv.status === "reviewing").length
  const interviewCVs = filteredCVs.filter(cv => cv.status === "interview").length

  return (
    <div className="p-6 bg-gray-50/50 min-h-[calc(100vh-64px)]">
      <div className="flex gap-6">
        {/* Left Panel - Upload Section */}
        <Card className="w-[400px] flex-shrink-0">
          <CardHeader>
            <CardTitle>Quick Upload</CardTitle>
            <CardDescription>Drag & drop or click to browse</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">

            {/* Vacancy Selection */}
            <div className="mb-4">
              <Label htmlFor="upload-vacancy" className="text-sm font-medium mb-2 block">
                Assign to Vacancy (Optional)
              </Label>
              <Select value={uploadVacancy} onValueChange={setUploadVacancy}>
                <SelectTrigger id="upload-vacancy">
                  <SelectValue placeholder="Select vacancy" />
                </SelectTrigger>
                <SelectContent>
                  {mockVacancies.map((vacancy) => (
                    <SelectItem key={vacancy.id} value={vacancy.id}>
                      {vacancy.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Leave as "No Vacancy" to add CVs to general pool
              </p>
            </div>

            {/* Upload Drop Zone */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">Upload CV File</Label>
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
                  Drop your CV here
                </p>
                <p className="text-sm text-blue-600">
                  or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, Word documents, and text files • Up to 10MB
                </p>
              </div>
            </div>

            <Button 
              className="w-full mb-6" 
              disabled={isProcessing}
              onClick={() => document.querySelector('input[type="file"]')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload CV
            </Button>

            {/* Processing Files */}
            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Processing Files</Label>
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
        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My CVs</CardTitle>
                <CardDescription>{filteredCVs.length} total</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search CVs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedVacancy} onValueChange={setSelectedVacancy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Vacancies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vacancies</SelectItem>
                  {mockVacancies.map((vacancy) => (
                    <SelectItem key={vacancy.id} value={vacancy.id}>
                      {vacancy.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="match">Match Score</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {sortedCVs.length === 0 ? (
              <div className="text-center py-16 border rounded-lg bg-gray-50">
                <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome! Let's get started</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Upload your first CV to see the magic of AI-powered CV formatting
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white"
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your First CV
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supports PDF, Word documents, and text files up to 10MB
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Vacancy</TableHead>
                    <TableHead className="text-center">Match Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
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
                              {cv.candidateName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{cv.candidateName}</div>
                            <div className="text-sm text-muted-foreground">{cv.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cv.position}</div>
                          <div className="text-sm text-muted-foreground">{cv.experience}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cv.vacancyId !== "none" ? (
                          <Link href={`/vacancies/${cv.vacancyId}`} className="text-blue-600 hover:underline">
                            {cv.vacancyTitle}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">{cv.vacancyTitle}</span>
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
                      <TableCell>{getStatusBadge(cv.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(cv.uploadedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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