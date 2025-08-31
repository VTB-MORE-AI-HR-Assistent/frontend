"use client"

import React, { useState } from "react"
import { 
  Filter, 
  X, 
  ChevronDown,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

export interface VacancyFilters {
  search: string
  status: string[]
  location: string[]
  type: string[]
  experience: string[]
  salaryMin: number
  salaryMax: number
}

interface VacancyFiltersProps {
  onFiltersChange: (filters: VacancyFilters) => void
  totalResults?: number
}

export function VacancyFilters({ onFiltersChange, totalResults }: VacancyFiltersProps) {
  const [filters, setFilters] = useState<VacancyFilters>({
    search: "",
    status: [],
    location: [],
    type: [],
    experience: [],
    salaryMin: 0,
    salaryMax: 1000000
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Filter options
  const statusOptions = [
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
    { value: "published", label: "Published", color: "bg-blue-100 text-blue-800" },
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "closed", label: "Closed", color: "bg-red-100 text-red-800" }
  ]


  const locationOptions = [
    "Moscow",
    "St. Petersburg",
    "Remote",
    "Hybrid",
    "Novosibirsk",
    "Yekaterinburg",
    "Nizhny Novgorod",
    "Kazan"
  ]

  const typeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance"
  ]

  const experienceOptions = [
    "No experience",
    "1-2 years",
    "3-5 years",
    "5-10 years",
    "10+ years"
  ]


  const updateFilters = (newFilters: Partial<VacancyFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
    
    // Count active filters
    let count = 0
    if (updated.search) count++
    if (updated.status.length > 0) count++
    if (updated.location.length > 0) count++
    if (updated.type.length > 0) count++
    if (updated.experience.length > 0) count++
    if (updated.salaryMin > 0 || updated.salaryMax < 1000000) count++
    setActiveFiltersCount(count)
  }

  const toggleArrayFilter = (key: keyof VacancyFilters, value: string) => {
    const currentValues = filters[key] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    updateFilters({ [key]: newValues })
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      status: [],
      department: [],
      location: [],
      type: [],
      experience: [],
      salaryMin: 0,
      salaryMax: 1000000,
      priority: []
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    setActiveFiltersCount(0)
  }

  const QuickFilter = ({ 
    icon: Icon, 
    label, 
    options, 
    filterKey,
    multiSelect = true 
  }: {
    icon: any
    label: string
    options: any[]
    filterKey: keyof VacancyFilters
    multiSelect?: boolean
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Icon className="mr-2 h-4 w-4" />
          {label}
          {(filters[filterKey] as string[]).length > 0 && (
            <Badge variant="secondary" className="ml-2 h-4 px-1">
              {(filters[filterKey] as string[]).length}
            </Badge>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          {options.map((option) => {
            const value = typeof option === "string" ? option : option.value
            const label = typeof option === "string" ? option : option.label
            const isChecked = (filters[filterKey] as string[]).includes(value)
            
            return (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={value}
                  checked={isChecked}
                  onCheckedChange={() => toggleArrayFilter(filterKey, value)}
                />
                <label
                  htmlFor={value}
                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {typeof option === "object" && option.color ? (
                    <Badge variant="outline" className={option.color}>
                      {label}
                    </Badge>
                  ) : (
                    label
                  )}
                </label>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <>
      {/* Desktop Filters Bar */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        {/* Search Input */}
        <Input
          placeholder="Search vacancies..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-64 h-8"
        />

        {/* Quick Filters */}
        <QuickFilter
          icon={AlertCircle}
          label="Status"
          options={statusOptions}
          filterKey="status"
        />

        <QuickFilter
          icon={MapPin}
          label="Location"
          options={locationOptions}
          filterKey="location"
        />

        <QuickFilter
          icon={Briefcase}
          label="Type"
          options={typeOptions}
          filterKey="type"
        />

        {/* More Filters Button */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
              {activeFiltersCount > 4 && (
                <Badge variant="secondary" className="ml-2 h-4 px-1">
                  +{activeFiltersCount - 4}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Refine your search with additional filters
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Experience Filter */}
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <div className="space-y-2">
                  {experienceOptions.map((exp) => (
                    <div key={exp} className="flex items-center space-x-2">
                      <Checkbox
                        id={exp}
                        checked={filters.experience.includes(exp)}
                        onCheckedChange={() => toggleArrayFilter("experience", exp)}
                      />
                      <label
                        htmlFor={exp}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {exp}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Salary Range */}
              <div className="space-y-2">
                <Label>Salary Range (RUB)</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.salaryMin || ""}
                      onChange={(e) => updateFilters({ salaryMin: parseInt(e.target.value) || 0 })}
                      className="w-32"
                    />
                    <span>—</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.salaryMax === 1000000 ? "" : filters.salaryMax}
                      onChange={(e) => updateFilters({ salaryMax: parseInt(e.target.value) || 1000000 })}
                      className="w-32"
                    />
                  </div>
                  <Slider
                    min={0}
                    max={1000000}
                    step={10000}
                    value={[filters.salaryMin, filters.salaryMax]}
                    onValueChange={([min, max]) => updateFilters({ salaryMin: min, salaryMax: max })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₽0</span>
                    <span>₽1,000,000+</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setIsSheetOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={clearAllFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Clear ({activeFiltersCount})
          </Button>
        )}

        {/* Results Count */}
        {totalResults !== undefined && (
          <div className="ml-auto text-sm text-muted-foreground">
            {totalResults} results
          </div>
        )}
      </div>

      {/* Mobile Filters Button */}
      <div className="md:hidden flex items-center gap-2">
        <Input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="flex-1"
        />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            {/* Mobile filters content - same as desktop but in sheet */}
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your vacancy search
              </SheetDescription>
            </SheetHeader>
            {/* ... Add all filters here for mobile ... */}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}