"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vacancies",
    href: "/vacancies",
    icon: Briefcase,
  },
  {
    title: "Candidates",
    href: "/candidates",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/dashboard/interview-reports",
    icon: FileText,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[64px]",
                isActive
                  ? "text-[#1B4F8C]"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive && "text-[#1B4F8C]"
              )} />
              <span className="text-xs font-medium">{item.title}</span>
              {isActive && (
                <div className="absolute bottom-0 h-0.5 w-12 bg-gradient-to-r from-[#1B4F8C] to-[#2563EB]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}