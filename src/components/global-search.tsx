"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, FileText, Users, Briefcase, Calendar, Hash, ArrowRight, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  type: "vacancy" | "candidate" | "interview" | "document"
  title: string
  subtitle?: string
  status?: string
  url: string
}

export function GlobalSearch() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut to open search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Navigation with arrow keys when search is open
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === "Enter" && results[selectedIndex]) {
          e.preventDefault()
          handleResultClick(results[selectedIndex])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTimer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(searchTimer)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    
    // Simulate API call - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock search results
    const mockResults: SearchResult[] = []
    const lowerQuery = searchQuery.toLowerCase()
    
    // Search vacancies
    if ("senior react developer".includes(lowerQuery) || "react".includes(lowerQuery)) {
      mockResults.push({
        id: "1",
        type: "vacancy",
        title: "Senior React Developer",
        subtitle: "Engineering • Moscow",
        status: "active",
        url: "/vacancies/1"
      })
    }
    
    if ("frontend".includes(lowerQuery) || "developer".includes(lowerQuery)) {
      mockResults.push({
        id: "2",
        type: "vacancy",
        title: "Frontend Developer",
        subtitle: "Engineering • Remote",
        status: "active",
        url: "/vacancies/2"
      })
    }
    
    // Search candidates
    if ("john".includes(lowerQuery) || "doe".includes(lowerQuery) || "developer".includes(lowerQuery)) {
      mockResults.push({
        id: "3",
        type: "candidate",
        title: "John Doe",
        subtitle: "Senior Developer • 5 years experience",
        status: "interviewed",
        url: "/candidates/3"
      })
    }
    
    if ("jane".includes(lowerQuery) || "smith".includes(lowerQuery)) {
      mockResults.push({
        id: "4",
        type: "candidate",
        title: "Jane Smith",
        subtitle: "Full Stack Developer • 3 years experience",
        status: "screening",
        url: "/candidates/4"
      })
    }
    
    // Search interviews
    if ("interview".includes(lowerQuery) || "meeting".includes(lowerQuery)) {
      mockResults.push({
        id: "5",
        type: "interview",
        title: "Technical Interview - John Doe",
        subtitle: "Today at 2:00 PM",
        url: "/interviews/5"
      })
    }
    
    setResults(mockResults)
    setSelectedIndex(0)
    setIsLoading(false)
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    setIsOpen(false)
    setQuery("")
    setResults([])
  }

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "vacancy":
        return <Briefcase className="h-4 w-4" />
      case "candidate":
        return <Users className="h-4 w-4" />
      case "interview":
        return <Calendar className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <Hash className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "vacancy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "candidate":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "document":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return ""
    }
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 rounded-lg border border-input bg-background/50 backdrop-blur px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-background hover:shadow-sm w-full"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vacancies, candidates, interviews..."
              className="flex h-12 w-full border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="ml-2 rounded-sm opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                      index === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className={cn("rounded-md p-1", getTypeColor(result.type))}>
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                      )}
                    </div>
                    {result.status && (
                      <Badge variant="secondary" className="text-xs">
                        {result.status}
                      </Badge>
                    )}
                    <ArrowRight className="h-4 w-4 opacity-50" />
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-4 p-4">
                <div className="text-xs font-medium text-muted-foreground">RECENT SEARCHES</div>
                <div className="space-y-1">
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <Search className="h-3 w-3 opacity-50" />
                    Senior Developer
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <Search className="h-3 w-3 opacity-50" />
                    Moscow vacancies
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <Search className="h-3 w-3 opacity-50" />
                    React skills
                  </button>
                </div>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="border-t p-2">
              <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="rounded border px-1">↑↓</kbd>
                  <span>to navigate</span>
                  <kbd className="rounded border px-1">↵</kbd>
                  <span>to select</span>
                  <kbd className="rounded border px-1">esc</kbd>
                  <span>to close</span>
                </div>
                <div>{results.length} results</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}