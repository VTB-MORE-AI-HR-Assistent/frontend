"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Download,
  Mail,
  UserPlus,
  MoreVertical, 
  Eye, 
  Star,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  FileText,
  Phone,
  Grid3x3,
  List
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddCandidateDialog } from "@/components/candidates/add-candidate-dialog"

// Mock data for candidates
const mockCandidates = [
  {
    id: "1",
    name: "Ivan Sokolov",
    email: "ivan.sokolov@example.com",
    phone: "+7 (495) 123-45-67",
    position: "Senior Frontend Developer",
    department: "IT",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Next.js", "Node.js"],
    education: "MSU, Computer Science",
    location: "Moscow",
    status: "interview",
    stage: "Technical Interview",
    matchScore: 92,
    appliedDate: "2024-01-10",
    lastActivity: "2 hours ago",
    vacancy: "Senior Frontend Developer",
    notes: 3,
    avatar: null
  },
  {
    id: "2",
    name: "Elena Mikhailova",
    email: "elena.mikhailova@example.com",
    phone: "+7 (495) 123-45-68",
    position: "Product Manager",
    department: "Product",
    experience: "3-5 years",
    skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
    education: "HSE, Business Administration",
    location: "St. Petersburg",
    status: "screening",
    stage: "Phone Screening",
    matchScore: 85,
    appliedDate: "2024-01-12",
    lastActivity: "1 day ago",
    vacancy: "Product Manager",
    notes: 2,
    avatar: null
  },
  {
    id: "3",
    name: "Dmitry Volkov",
    email: "dmitry.volkov@example.com",
    phone: "+7 (495) 123-45-69",
    position: "Backend Developer",
    department: "IT",
    experience: "3+ years",
    skills: ["Java", "Spring", "PostgreSQL", "Docker"],
    education: "MIPT, Software Engineering",
    location: "Moscow",
    status: "new",
    stage: "Application Review",
    matchScore: 78,
    appliedDate: "2024-01-14",
    lastActivity: "3 hours ago",
    vacancy: "Backend Developer",
    notes: 0,
    avatar: null
  },
  {
    id: "4",
    name: "Olga Kuznetsova",
    email: "olga.kuznetsova@example.com",
    phone: "+7 (495) 123-45-70",
    position: "UX/UI Designer",
    department: "Design",
    experience: "2-4 years",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
    education: "British Higher School of Design",
    location: "Moscow",
    status: "offer",
    stage: "Offer Extended",
    matchScore: 88,
    appliedDate: "2024-01-05",
    lastActivity: "5 hours ago",
    vacancy: "UX/UI Designer",
    notes: 5,
    avatar: null
  },
  {
    id: "5",
    name: "Sergey Popov",
    email: "sergey.popov@example.com",
    phone: "+7 (495) 123-45-71",
    position: "Data Analyst",
    department: "Analytics",
    experience: "2+ years",
    skills: ["Python", "SQL", "Tableau", "Machine Learning"],
    education: "ITMO, Data Science",
    location: "Remote",
    status: "rejected",
    stage: "Not Selected",
    matchScore: 65,
    appliedDate: "2024-01-08",
    lastActivity: "2 days ago",
    vacancy: "Data Analyst",
    notes: 1,
    avatar: null
  },
  {
    id: "6",
    name: "Maria Ivanova",
    email: "maria.ivanova@example.com",
    phone: "+7 (495) 123-45-72",
    position: "DevOps Engineer",
    department: "IT",
    experience: "4+ years",
    skills: ["Kubernetes", "AWS", "CI/CD", "Terraform"],
    education: "Bauman University, Computer Engineering",
    location: "Moscow",
    status: "interview",
    stage: "Final Interview",
    matchScore: 95,
    appliedDate: "2024-01-11",
    lastActivity: "30 minutes ago",
    vacancy: "DevOps Engineer",
    notes: 4,
    avatar: null
  }
]

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(mockCandidates)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterPosition, setFilterPosition] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [viewMode, setViewMode] = useState<"list" | "grid" | "pipeline">("list")

  // Filter and search logic
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filterStatus === "all" || candidate.status === filterStatus
    const matchesDepartment = filterDepartment === "all" || candidate.department === filterDepartment
    const matchesPosition = filterPosition === "all" || candidate.position.includes(filterPosition)
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesPosition
  })

  // Sort logic
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "date":
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
      case "score":
        return b.matchScore - a.matchScore
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(sortedCandidates.map(c => c.id))
    } else {
      setSelectedCandidates([])
    }
  }

  const handleSelectCandidate = (candidateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates([...selectedCandidates, candidateId])
    } else {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for candidates:`, selectedCandidates)
    // Implement bulk actions here
    setSelectedCandidates([])
  }

  const handleAddCandidate = (newCandidate: Partial<typeof candidates[0]>) => {
    setCandidates([newCandidate as typeof candidates[0], ...candidates])
    console.log("New candidate added:", newCandidate)
  }

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

  const getMatchScoreBadge = (score: number) => {
    let color = "bg-gray-100 text-gray-800"
    if (score >= 90) color = "bg-green-100 text-green-800"
    else if (score >= 75) color = "bg-blue-100 text-blue-800"
    else if (score >= 60) color = "bg-yellow-100 text-yellow-800"
    else color = "bg-red-100 text-red-800"
    
    return (
      <Badge className={color}>
        {score}% Match
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground">
            Manage and track all candidate applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <AddCandidateDialog onAdd={handleAddCandidate} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates.filter(c => c.status === "screening").length}
            </div>
            <p className="text-xs text-muted-foreground">Being screened</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviewing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates.filter(c => c.status === "interview").length}
            </div>
            <p className="text-xs text-muted-foreground">In interview process</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates.filter(c => c.status === "offer").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'grid')}>
        <TabsList>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="grid">
            <Grid3x3 className="h-4 w-4 mr-2" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="pipeline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Pipeline View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search candidates by name, email, skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Applied Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="score">Match Score</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            {/* Bulk Actions */}
            {selectedCandidates.length > 0 && (
              <div className="px-6 py-3 bg-blue-50 border-t border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {selectedCandidates.length} candidate(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("email")}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Send Email
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("status")}
                    >
                      Update Status
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("export")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedCandidates.length === sortedCandidates.length && sortedCandidates.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCandidates.includes(candidate.id)}
                          onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/candidates/${candidate.id}`} className="hover:underline">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">{candidate.email}</div>
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{candidate.position}</div>
                          <div className="text-sm text-muted-foreground">{candidate.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(candidate.status)}
                          <div className="text-xs text-muted-foreground">{candidate.stage}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getMatchScoreBadge(candidate.matchScore)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(candidate.appliedDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {candidate.lastActivity}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/candidates/${candidate.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row gap-4">
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedCandidates.map((candidate) => (
                  <Card key={candidate.id} className="relative">
                    <div className="absolute top-4 right-4">
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Link href={`/candidates/${candidate.id}`}>
                            <CardTitle className="text-lg hover:underline">
                              {candidate.name}
                            </CardTitle>
                          </Link>
                          <CardDescription>{candidate.position}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        {getStatusBadge(candidate.status)}
                        {getMatchScoreBadge(candidate.matchScore)}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{candidate.experience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{candidate.education}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 pt-3">
                        <Link href={`/candidates/${candidate.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Add Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <div className="text-center py-8">
            <Link href="/candidates/pipeline">
              <Button className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
                Open Pipeline View
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}