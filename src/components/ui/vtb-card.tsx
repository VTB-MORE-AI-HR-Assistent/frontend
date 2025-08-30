"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const vtbCardVariants = cva(
  "rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-white border-slate-200 hover:shadow-lg",
        gradient: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg",
        dark: "bg-slate-800 border-slate-700 text-white hover:border-slate-600",
        vtbPrimary: "bg-gradient-to-br from-[#1B4F8C]/5 to-[#2563EB]/5 border-[#1B4F8C]/20 hover:shadow-xl hover:border-[#1B4F8C]/40",
        elevated: "bg-white border-0 shadow-md hover:shadow-xl",
        outline: "bg-transparent border-slate-300 hover:bg-slate-50 hover:border-slate-400",
      },
      padding: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface VTBCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof vtbCardVariants> {
  children?: React.ReactNode
}

const VTBCard = React.forwardRef<HTMLDivElement, VTBCardProps>(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(vtbCardVariants({ variant, padding }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
VTBCard.displayName = "VTBCard"

// VTB Gradient Card - Pre-configured gradient card
const VTBGradientCard = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Card>>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    )
  }
)
VTBGradientCard.displayName = "VTBGradientCard"

// VTB Metric Card - For displaying KPIs and metrics
interface VTBMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

const VTBMetricCard = React.forwardRef<HTMLDivElement, VTBMetricCardProps>(
  ({ className, title, value, description, icon, trend, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden hover:shadow-lg transition-all duration-200",
          className
        )}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {title}
          </CardTitle>
          {icon && (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1B4F8C]/10 to-[#2563EB]/10 flex items-center justify-center">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-400 ml-1">vs last month</span>
            </div>
          )}
        </CardContent>
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#1B4F8C]/5 to-[#2563EB]/5" />
      </Card>
    )
  }
)
VTBMetricCard.displayName = "VTBMetricCard"

// VTB Feature Card - For feature sections
interface VTBFeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

const VTBFeatureCard = React.forwardRef<HTMLDivElement, VTBFeatureCardProps>(
  ({ className, title, description, icon, action, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "hover:shadow-lg transition-all duration-200 group",
          className
        )}
        {...props}
      >
        <CardHeader>
          {icon && (
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          )}
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-slate-600 mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        {action && (
          <CardFooter>
            {action}
          </CardFooter>
        )}
      </Card>
    )
  }
)
VTBFeatureCard.displayName = "VTBFeatureCard"

export { 
  VTBCard, 
  VTBGradientCard, 
  VTBMetricCard, 
  VTBFeatureCard,
  vtbCardVariants 
}