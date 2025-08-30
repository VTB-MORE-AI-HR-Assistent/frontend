"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Define status types for different contexts
export type CandidateStatus = "approved" | "pending" | "rejected" | "new" | "screening" | "interview" | "offer"
export type InterviewStatus = "scheduled" | "inProgress" | "completed" | "cancelled"
export type VacancyStatus = "active" | "paused" | "closed" | "draft"
export type ApplicationStatus = "submitted" | "reviewing" | "shortlisted" | "rejected" | "withdrawn"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      type: {
        // Candidate statuses
        approved: "bg-green-100 text-green-700 border-green-200",
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        rejected: "bg-red-100 text-red-700 border-red-200",
        new: "bg-blue-100 text-[#1B4F8C] border-blue-200",
        screening: "bg-indigo-100 text-indigo-700 border-indigo-200",
        interview: "bg-purple-100 text-purple-700 border-purple-200",
        offer: "bg-emerald-100 text-emerald-700 border-emerald-200",
        
        // Interview statuses
        scheduled: "bg-blue-100 text-[#1B4F8C] border-blue-200",
        inProgress: "bg-amber-100 text-amber-700 border-amber-200",
        completed: "bg-green-100 text-green-700 border-green-200",
        cancelled: "bg-slate-100 text-slate-600 border-slate-200",
        
        // Vacancy statuses
        active: "bg-green-100 text-green-700 border-green-200",
        paused: "bg-amber-100 text-amber-700 border-amber-200",
        closed: "bg-slate-100 text-slate-600 border-slate-200",
        draft: "bg-gray-100 text-gray-700 border-gray-200",
        
        // Application statuses
        submitted: "bg-blue-100 text-[#1B4F8C] border-blue-200",
        reviewing: "bg-indigo-100 text-indigo-700 border-indigo-200",
        shortlisted: "bg-purple-100 text-purple-700 border-purple-200",
        withdrawn: "bg-slate-100 text-slate-600 border-slate-200",
        
        // Generic statuses
        success: "bg-green-100 text-green-700 border-green-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        error: "bg-red-100 text-red-700 border-red-200",
        info: "bg-blue-100 text-[#1B4F8C] border-blue-200",
        default: "bg-slate-100 text-slate-700 border-slate-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
      variant: {
        default: "border-0",
        outline: "border",
        gradient: "bg-gradient-to-r border-0 text-white",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: string
  type?: keyof typeof statusBadgeVariants.variants.type
  dot?: boolean
  icon?: React.ReactNode
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, type, size, variant, dot, icon, ...props }, ref) => {
    // Determine the type based on status if not explicitly provided
    const badgeType = type || (status.toLowerCase() as keyof typeof statusBadgeVariants.variants.type) || "default"
    
    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ type: badgeType, size, variant }), className)}
        {...props}
      >
        {dot && (
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {icon && (
          <span className="mr-1">{icon}</span>
        )}
        {status}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

// Specialized badge components for specific contexts
interface MatchScoreBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  score: number
}

const MatchScoreBadge = React.forwardRef<HTMLSpanElement, MatchScoreBadgeProps>(
  ({ className, score, ...props }, ref) => {
    let colorClass = "bg-red-100 text-red-700 border-red-200"
    
    if (score >= 90) {
      colorClass = "bg-green-100 text-green-700 border-green-200"
    } else if (score >= 70) {
      colorClass = "bg-blue-100 text-[#1B4F8C] border-blue-200"
    } else if (score >= 50) {
      colorClass = "bg-amber-100 text-amber-700 border-amber-200"
    }
    
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
          colorClass,
          className
        )}
        {...props}
      >
        {score}% Match
      </span>
    )
  }
)
MatchScoreBadge.displayName = "MatchScoreBadge"

// Priority badge for tasks and interviews
interface PriorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  priority: "high" | "medium" | "low" | "urgent"
}

const PriorityBadge = React.forwardRef<HTMLSpanElement, PriorityBadgeProps>(
  ({ className, priority, ...props }, ref) => {
    const priorityConfig = {
      urgent: {
        class: "bg-red-100 text-red-700 border-red-200",
        label: "Urgent",
        icon: "🔴"
      },
      high: {
        class: "bg-orange-100 text-orange-700 border-orange-200",
        label: "High",
        icon: "🟠"
      },
      medium: {
        class: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "Medium",
        icon: "🟡"
      },
      low: {
        class: "bg-green-100 text-green-700 border-green-200",
        label: "Low",
        icon: "🟢"
      }
    }
    
    const config = priorityConfig[priority]
    
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
          config.class,
          className
        )}
        {...props}
      >
        <span className="mr-1 text-[10px]">{config.icon}</span>
        {config.label}
      </span>
    )
  }
)
PriorityBadge.displayName = "PriorityBadge"

// Department badge with VTB colors
interface DepartmentBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  department: string
}

const DepartmentBadge = React.forwardRef<HTMLSpanElement, DepartmentBadgeProps>(
  ({ className, department, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md bg-gradient-to-r from-[#1B4F8C]/10 to-[#2563EB]/10 px-2.5 py-0.5 text-xs font-medium text-[#1B4F8C] border border-[#1B4F8C]/20",
          className
        )}
        {...props}
      >
        {department}
      </span>
    )
  }
)
DepartmentBadge.displayName = "DepartmentBadge"

// Skill badge for candidate profiles
interface SkillBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  skill: string
  endorsed?: boolean
}

const SkillBadge = React.forwardRef<HTMLSpanElement, SkillBadgeProps>(
  ({ className, skill, endorsed = false, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
          endorsed 
            ? "bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200",
          className
        )}
        {...props}
      >
        {endorsed && (
          <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {skill}
      </span>
    )
  }
)
SkillBadge.displayName = "SkillBadge"

export { 
  StatusBadge, 
  MatchScoreBadge, 
  PriorityBadge,
  DepartmentBadge,
  SkillBadge,
  statusBadgeVariants 
}