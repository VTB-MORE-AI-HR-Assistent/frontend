"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  Archive,
  Download,
  ChevronDown,
  Calendar,
  Users,
  Building,
  MapPin,
  Briefcase,
  Clock,
  AlertCircle
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

// Mock data for vacancies
const mockVacancies = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "IT",
    location: "Moscow",
    type: "Full-time",
    experience: "5+ years",
    salary: "250,000 - 350,000 RUB",
    status: "active",
    priority: "high",
    created: "2024-01-15",
    deadline: "2024-02-15",
    candidates: 45,
    interviews: 8,
    description: "We are looking for an experienced Frontend Developer to join our team..."
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "St. Petersburg",
    type: "Full-time",
    experience: "3-5 years",
    salary: "200,000 - 280,000 RUB",
    status: "active",
    priority: "medium",
    created: "2024-01-10",
    deadline: "2024-02-10",
    candidates: 32,
    interviews: 5,
    description: "Seeking a talented Product Manager to lead our digital banking initiatives..."
  },
  {
    id: "3",
    title: "Backend Developer",
    department: "IT",
    location: "Moscow",
    type: "Full-time",
    experience: "3+ years",
    salary: "220,000 - 300,000 RUB",
    status: "active",
    priority: "high",
    created: "2024-01-12",
    deadline: "2024-02-20",
    candidates: 38,
    interviews: 6,
    description: "Join our backend team to build scalable banking solutions..."
  },
  {
    id: "4",
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    experience: "2-4 years",
    salary: "180,000 - 250,000 RUB",
    status: "paused",
    priority: "low",
    created: "2024-01-08",
    deadline: "2024-02-08",
    candidates: 28,
    interviews: 4,
    description: "Looking for a creative designer to enhance our digital products..."
  },
  {
    id: "5",
    title: "Data Analyst",
    department: "Analytics",
    location: "Moscow",
    type: "Full-time",
    experience: "2+ years",
    salary: "150,000 - 200,000 RUB",
    status: "active",
    priority: "medium",
    created: "2024-01-14",
    deadline: "2024-02-14",
    candidates: 22,
    interviews: 3,
    description: "We need a data analyst to help drive data-driven decisions..."
  },
  {
    id: "6",
    title: "DevOps Engineer",
    department: "IT",
    location: "Moscow",
    type: "Full-time",
    experience: "4+ years",
    salary: "280,000 - 380,000 RUB",
    status: "draft",
    priority: "high",
    created: "2024-01-16",
    deadline: "2024-02-25",
    candidates: 0,
    interviews: 0,
    description: "Looking for a DevOps engineer to improve our infrastructure..."
  }
]

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState(mockVacancies)
  const [selectedVacancies, setSelectedVacancies] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [sortBy, setSortBy] = useState("created")
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")

  // Filter and search logic
  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacancy.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacancy.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || vacancy.department === filterDepartment
    const matchesStatus = filterStatus === "all" || vacancy.status === filterStatus
    const matchesPriority = filterPriority === "all" || vacancy.priority === filterPriority
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority
  })

  // Sort logic
  const sortedVacancies = [...filteredVacancies].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "created":
        return new Date(b.created).getTime() - new Date(a.created).getTime()
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      case "candidates":
        return b.candidates - a.candidates
      default:
        return 0
    }
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVacancies(sortedVacancies.map(v => v.id))
    } else {
      setSelectedVacancies([])
    }
  }

  const handleSelectVacancy = (vacancyId: string, checked: boolean) => {
    if (checked) {
      setSelectedVacancies([...selectedVacancies, vacancyId])
    } else {
      setSelectedVacancies(selectedVacancies.filter(id => id !== vacancyId))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for vacancies:`, selectedVacancies)
    // Implement bulk actions here
    setSelectedVacancies([])
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      active: "default",
      paused: "secondary",
      draft: "outline",
      closed: "destructive"
    }
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

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-amber-100 text-amber-800 border-amber-200",
      low: "bg-blue-100 text-blue-800 border-blue-200"
    }
    return (
      <Badge className={colors[priority] || ""}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vacancies</h1>
          <p className="text-muted-foreground">
            Manage your job openings and recruitment pipeline
          </p>
        </div>
        <Link href="/vacancies/new">
          <Button className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Vacancy
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vacancies</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vacancies.length}</div>
            <p className="text-xs text-muted-foreground">
              {vacancies.filter(v => v.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vacancies.reduce((sum, v) => sum + v.candidates, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all vacancies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vacancies.reduce((sum, v) => sum + v.interviews, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Positions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vacancies.filter(v => v.priority === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vacancies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[150px]">
                  <Building className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="candidates">Candidates</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Bulk Actions */}
        {selectedVacancies.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-t border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedVacancies.length} vacancy(ies) selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("archive")}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("export")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <CardContent className="p-0">
          {viewMode === "table" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedVacancies.length === sortedVacancies.length && sortedVacancies.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVacancies.map((vacancy) => (
                  <TableRow key={vacancy.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedVacancies.includes(vacancy.id)}
                        onCheckedChange={(checked) => handleSelectVacancy(vacancy.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link href={`/vacancies/${vacancy.id}`} className="hover:underline">
                        <div>
                          <div className="font-medium">{vacancy.title}</div>
                          <div className="text-sm text-muted-foreground">{vacancy.type} • {vacancy.experience}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{vacancy.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        {vacancy.location}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vacancy.status)}</TableCell>
                    <TableCell>{getPriorityBadge(vacancy.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{vacancy.candidates}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(vacancy.deadline).toLocaleDateString()}
                        </span>
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
                            <Link href={`/vacancies/${vacancy.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/vacancies/${vacancy.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
              {sortedVacancies.map((vacancy) => (
                <Card key={vacancy.id} className="relative">
                  <div className="absolute top-4 right-4">
                    <Checkbox
                      checked={selectedVacancies.includes(vacancy.id)}
                      onCheckedChange={(checked) => handleSelectVacancy(vacancy.id, checked as boolean)}
                    />
                  </div>
                  <CardHeader>
                    <Link href={`/vacancies/${vacancy.id}`}>
                      <CardTitle className="hover:underline">{vacancy.title}</CardTitle>
                    </Link>
                    <CardDescription>{vacancy.department} • {vacancy.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {getStatusBadge(vacancy.status)}
                        {getPriorityBadge(vacancy.priority)}
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{vacancy.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Experience:</span>
                          <span>{vacancy.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Salary:</span>
                          <span>{vacancy.salary}</span>
                        </div>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{vacancy.candidates} candidates</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{vacancy.interviews} interviews</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <Link href={`/vacancies/${vacancy.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View
                          </Button>
                        </Link>
                        <Link href={`/vacancies/${vacancy.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Edit
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
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}