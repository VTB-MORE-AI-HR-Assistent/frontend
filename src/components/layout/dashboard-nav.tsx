"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  {
    title: "Дашборд",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Вакансии",
    href: "/vacancies",
    icon: Briefcase,
  },
  {
    title: "Кандидаты",
    href: "/candidates",
    icon: Users,
  },
  {
    title: "Отчеты",
    href: "/dashboard/interview-reports",
    icon: FileText,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      "hidden md:block relative bg-white border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="sticky top-0 p-4">
        {/* Navigation Items */}
        <nav className="space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-[#1B4F8C]/10 to-[#2563EB]/10 text-[#1B4F8C]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon className={cn(
                  "flex-shrink-0",
                  collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                )} />
                {!collapsed && item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-white shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}