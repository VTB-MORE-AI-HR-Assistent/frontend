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
  Clock,
  AlertCircle
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { VacancyFilters, type VacancyFilters as FiltersType } from "@/components/vacancies/vacancy-filters"

// Mock data for vacancies
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
    salaryMin: 200000,
    salaryMax: 280000,
    currency: "RUB",
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
    experience: "1-2 years",
    salaryMin: 180000,
    salaryMax: 250000,
    currency: "RUB",
    status: "closed",
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
    department: "Product",
    location: "Moscow",
    type: "Full-time",
    experience: "1-2 years",
    salaryMin: 150000,
    salaryMax: 200000,
    currency: "RUB",
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
    department: "Engineering",
    location: "Moscow",
    type: "Full-time",
    experience: "3-5 years",
    salaryMin: 280000,
    salaryMax: 380000,
    currency: "RUB",
    status: "draft",
    priority: "high",
    created: "2024-01-16",
    deadline: "2024-02-25",
    candidates: 0,
    interviews: 0,
    description: "Looking for a DevOps engineer to improve our infrastructure..."
  },
  {
    id: "7",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    experience: "5-10 years",
    salaryMin: 200000,
    salaryMax: 300000,
    currency: "RUB",
    status: "published",
    priority: "medium",
    created: "2024-01-18",
    deadline: "2024-02-28",
    candidates: 15,
    interviews: 2,
    description: "Lead our marketing initiatives and brand strategy..."
  },
  {
    id: "8",
    title: "QA Engineer",
    department: "Engineering",
    location: "Hybrid",
    type: "Contract",
    experience: "1-2 years",
    salaryMin: 120000,
    salaryMax: 180000,
    currency: "RUB",
    status: "active",
    priority: "low",
    created: "2024-01-20",
    deadline: "2024-03-01",
    candidates: 18,
    interviews: 3,
    description: "Ensure quality of our software products through comprehensive testing..."
  }
]

export default function VacanciesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [vacancies] = useState(mockVacancies)
  const [selectedVacancies, setSelectedVacancies] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [filters, setFilters] = useState<FiltersType>({
    search: "",
    status: [],
    department: [],
    location: [],
    type: [],
    experience: [],
    salaryMin: 0,
    salaryMax: 1000000,
    priority: []
  })

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Filter logic with advanced filters
  const filteredVacancies = useMemo(() => {
    return vacancies.filter(vacancy => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          vacancy.title.toLowerCase().includes(searchLower) ||
          vacancy.department.toLowerCase().includes(searchLower) ||
          vacancy.location.toLowerCase().includes(searchLower) ||
          vacancy.description.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(vacancy.status)) {
        return false
      }

      // Department filter
      if (filters.department.length > 0 && !filters.department.includes(vacancy.department)) {
        return false
      }

      // Location filter
      if (filters.location.length > 0 && !filters.location.includes(vacancy.location)) {
        return false
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(vacancy.type)) {
        return false
      }

      // Experience filter
      if (filters.experience.length > 0 && !filters.experience.includes(vacancy.experience)) {
        return false
      }

      // Salary filter
      if (filters.salaryMin > 0 || filters.salaryMax < 1000000) {
        const vacancyMaxSalary = vacancy.salaryMax || 0
        const vacancyMinSalary = vacancy.salaryMin || 0
        
        if (vacancyMaxSalary < filters.salaryMin || vacancyMinSalary > filters.salaryMax) {
          return false
        }
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(vacancy.priority)) {
        return false
      }

      return true
    })
  }, [vacancies, filters])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVacancies(filteredVacancies.map(v => v.id))
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
    setSelectedVacancies([])
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      published: "bg-blue-100 text-blue-800 border-blue-200",
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
      urgent: "bg-red-100 text-red-800 border-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-slate-100 text-slate-800 border-slate-200"
    }
    return (
      <Badge className={colors[priority] || ""}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return "Not specified"
    const formatter = new Intl.NumberFormat('ru-RU')
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)} ${currency || 'RUB'}`
    }
    if (min) return `From ${formatter.format(min)} ${currency || 'RUB'}`
    if (max) return `Up to ${formatter.format(max)} ${currency || 'RUB'}`
    return "Not specified"
  }

  if (isLoading) {
    return <VacanciesPageSkeleton />
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
              {vacancies.filter(v => v.priority === "high" || v.priority === "urgent").length}
            </div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <VacancyFilters 
              onFiltersChange={setFilters} 
              totalResults={filteredVacancies.length}
            />
            <div className="flex gap-2 ml-4">
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
                      checked={selectedVacancies.length === filteredVacancies.length && filteredVacancies.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVacancies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No vacancies found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVacancies.map((vacancy) => (
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
                        <span className="text-sm">
                          {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                        </span>
                      </TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
              {filteredVacancies.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No vacancies found matching your filters
                </div>
              ) : (
                filteredVacancies.map((vacancy) => (
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
                            <span className="text-xs">{formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}</span>
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
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}