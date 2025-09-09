"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "./mobile-nav"
import { GlobalSearch } from "@/components/global-search"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <MobileNav />
          {/* Logo */}
          <Link href="/" className="hidden md:flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] flex items-center justify-center">
              <span className="text-sm font-bold text-white">VTB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">VTB HR</span>
              <span className="text-xs text-slate-500">AI Assistant</span>
            </div>
          </Link>
        </div>

        {/* Center Section - Search (takes remaining space and centers) */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <GlobalSearch />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New application received</p>
                  <p className="text-xs text-muted-foreground">
                    Ivan Petrov applied for Senior Frontend Developer
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Interview reminder</p>
                  <p className="text-xs text-muted-foreground">
                    Alexander Smirnov interview in 30 minutes
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Vacancy expiring</p>
                  <p className="text-xs text-muted-foreground">
                    Backend Developer position expires in 2 days
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1B4F8C] to-[#2563EB]">
                  <span className="text-xs font-medium text-white">
                    {user?.name?.split(' ')?.map(n => n[0])?.join('') || 'HR'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'HR Manager'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'hr@vtb.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}