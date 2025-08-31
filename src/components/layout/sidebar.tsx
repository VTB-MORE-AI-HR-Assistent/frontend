"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Home,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  UserCheck,
  Building,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react"
import { ROUTES } from "@/lib/constants"

interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: string | number
  children?: NavItem[]
}

export function Sidebar({ collapsed = false, onCollapsedChange, className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed)

  // HR Navigation items
  const mainNavItems: NavItem[] = [
    {
      href: ROUTES.HR_DASHBOARD,
      label: "Dashboard",
      icon: Home,
    },
    {
      href: ROUTES.HR_VACANCIES,
      label: "Vacancies",
      icon: Briefcase,
      badge: "12",
    },
    {
      href: ROUTES.HR_CANDIDATES,
      label: "Candidates",
      icon: Users,
      badge: "47",
    },
    {
      href: ROUTES.HR_INTERVIEWS,
      label: "Interviews",
      icon: Calendar,
      badge: "3",
    },
    {
      href: ROUTES.HR_ANALYTICS,
      label: "Analytics",
      icon: BarChart3,
    },
  ]

  const secondaryNavItems: NavItem[] = [
    {
      href: "/dashboard/reports",
      label: "Reports",
      icon: FileText,
    },
    {
      href: "/dashboard/team",
      label: "Team",
      icon: UserCheck,
    },
    {
      href: "/dashboard/company",
      label: "Company",
      icon: Building,
    },
  ]

  const bottomNavItems: NavItem[] = [
    {
      href: ROUTES.HR_SETTINGS,
      label: "Settings",
      icon: Settings,
    },
    {
      href: "/help",
      label: "Help & Support",
      icon: HelpCircle,
    },
  ]

  const quickStats = [
    { label: "Open Positions", value: "8", icon: Briefcase, trend: "+2" },
    { label: "New Applications", value: "24", icon: Users, trend: "+12" },
    { label: "Today's Interviews", value: "3", icon: Calendar },
    { label: "Hire Rate", value: "72%", icon: TrendingUp, trend: "+5%" },
  ]

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)
  }

  const SidebarContent = () => (
    <>
      {/* Collapse Button */}
      <div className="flex h-16 items-center justify-end border-b border-slate-200 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Quick Stats - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="border-b border-slate-200 p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase text-slate-500">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="rounded-lg bg-slate-50 p-2 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-3 w-3 text-slate-400" />
                    {stat.trend && (
                      <span className="text-[10px] text-green-600">{stat.trend}</span>
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-[10px] text-slate-500">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        <Separator className="my-4" />

        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-200 p-3">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      {/* User Section */}
      {!isCollapsed && (
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="avatar-vtb w-10 h-10">
              <span className="text-xs">AP</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Anna Petrova</p>
              <p className="text-xs text-slate-500">HR Manager</p>
            </div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col bg-white border-r border-slate-200 transition-all duration-300",
          isCollapsed ? "w-[70px]" : "w-[280px]",
          className
        )}
      >
        <SidebarContent />
      </aside>
    </TooltipProvider>
  )
}

// NavLink component for sidebar items
function NavLink({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem
  isActive: boolean
  isCollapsed: boolean
}) {
  const Icon = item.icon
  const linkContent = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1B4F8C]/10 px-1 text-[10px] font-semibold text-[#1B4F8C]">
              {item.badge}
            </span>
          )}
        </>
      )}
    </>
  )

  const linkElement = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-gradient-to-r from-[#1B4F8C]/10 to-[#2563EB]/10 text-[#1B4F8C]"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        isCollapsed && "justify-center"
      )}
    >
      {linkContent}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex items-center gap-2">
            <span>{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-[#1B4F8C]/10 px-1.5 text-[10px] font-semibold text-[#1B4F8C]">
                {item.badge}
              </span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkElement
}

// Mobile Sidebar component
export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}