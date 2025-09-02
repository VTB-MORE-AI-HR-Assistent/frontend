"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Menu, Search, Settings, LogOut, User, Briefcase, Home, Users, Calendar, FileText, BarChart3, Brain } from "lucide-react"
import { ROUTES } from "@/lib/constants"

interface NavigationProps {
  user?: {
    name: string
    email: string
    avatar?: string
    role: "hr_manager" | "recruiter" | "candidate" | "admin"
  }
}

export function Navigation({ user }: NavigationProps) {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Navigation items based on user role
  const navItems = React.useMemo(() => {
    if (!user) return []
    
    if (user.role === "candidate") {
      return [
        { href: ROUTES.CANDIDATE_PORTAL, label: "Dashboard", icon: Home },
        { href: ROUTES.CANDIDATE_JOBS, label: "Jobs", icon: Briefcase },
        { href: ROUTES.CANDIDATE_APPLICATIONS, label: "Applications", icon: FileText },
        { href: ROUTES.CANDIDATE_INTERVIEWS, label: "Interviews", icon: Calendar },
        { href: ROUTES.CANDIDATE_PROFILE, label: "Profile", icon: User },
      ]
    }
    
    return [
      { href: ROUTES.HR_DASHBOARD, label: "Dashboard", icon: Home },
      { href: ROUTES.HR_VACANCIES, label: "Vacancies", icon: Briefcase },
      { href: ROUTES.HR_CANDIDATES, label: "Candidates", icon: Users },
      { href: ROUTES.HR_INTERVIEWS, label: "Interviews", icon: Calendar },
      { href: ROUTES.HR_ANALYTICS, label: "Analytics", icon: BarChart3 },
    ]
  }, [user])

  // Mock notifications
  const notifications = [
    { id: 1, title: "New Application", message: "John Doe applied for Senior Developer", time: "5m ago", unread: true },
    { id: 2, title: "Interview Scheduled", message: "Interview with Jane Smith at 2 PM", time: "1h ago", unread: true },
    { id: 3, title: "Vacancy Approved", message: "Your vacancy has been approved", time: "2h ago", unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <nav className="nav-vtb">
      <div className="container-vtb flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-3">
                    <div className="avatar-vtb w-10 h-10">
                      <span className="text-sm">VTB</span>
                    </div>
                    <span className="text-lg font-semibold">AI HR Assistant</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-[#1B4F8C]/10 text-[#1B4F8C]"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="avatar-vtb">
              <span className="text-sm font-bold">VTB</span>
            </div>
            <span className="hidden text-xl font-semibold text-slate-900 lg:block">
              AI HR Assistant
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#1B4F8C]",
                  pathname === item.href
                    ? "text-[#1B4F8C]"
                    : "text-slate-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Command className="hidden lg:block">
            <Button
              variant="outline"
              className="h-9 w-[200px] justify-start text-sm text-slate-500"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search...
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </Command>
          <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <CommandInput placeholder="Search candidates, vacancies, or interviews..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Search Candidates</CommandItem>
                <CommandItem>View Vacancies</CommandItem>
                <CommandItem>Schedule Interview</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Recent">
                <CommandItem>John Doe - Senior Developer</CommandItem>
                <CommandItem>Frontend Developer Position</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0" align="end">
              <div className="border-b border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
              </div>
              <div className="max-h-[400px] overflow-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "border-b border-slate-100 p-4 hover:bg-slate-50",
                      notification.unread && "bg-blue-50/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="h-2 w-2 rounded-full bg-[#1B4F8C]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 p-2">
                <Button variant="ghost" className="w-full justify-center text-sm">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
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
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="vtbPrimary" size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}