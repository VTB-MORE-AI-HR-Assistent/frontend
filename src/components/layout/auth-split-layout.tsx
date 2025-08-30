import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SlideContent {
  title: string
  subtitle?: string
  description?: string
}

interface AuthSplitLayoutProps {
  children: React.ReactNode
  className?: string
  slides?: SlideContent[]
}

export function AuthSplitLayout({ children, className, slides = [] }: AuthSplitLayoutProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)

  // Auto-rotate slides every 5 seconds
  React.useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const activeSlide = slides[currentSlide] || slides[0]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {/* Header */}
        <header className="p-8">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">VTB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900">VTB Bank</span>
              <span className="text-xs text-slate-500">AI HR Assistant</span>
            </div>
          </Link>
        </header>

        {/* Main Content */}
        <main className={cn("flex-1 flex items-center justify-center px-8 pb-8", className)}>
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-8">
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-slate-700 transition-colors">
              Help
            </Link>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">
            © 2024 VTB Bank. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Right Side - Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1B4F8C] via-[#2563EB] to-[#4F46E5]">
        {/* Background Pattern - Simplified to avoid rendering issues */}

        {/* Centered Content Container */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          {/* Content - Now properly centered */}
          <div className="px-12 text-center max-w-2xl mx-auto">
            {activeSlide && (
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {activeSlide.title}
                </h2>
                {activeSlide.subtitle && (
                  <p className="text-xl text-white/90 mb-4">
                    {activeSlide.subtitle}
                  </p>
                )}
                {activeSlide.description && (
                  <p className="text-base text-white/70 max-w-md mx-auto">
                    {activeSlide.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Slide Indicators - Positioned at bottom */}
          {slides.length > 1 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <div className="flex justify-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentSlide
                        ? "bg-white w-8"
                        : "bg-white/30 hover:bg-white/50"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Elements Animation - Hidden for now to fix CSS issue */}
        {/* <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-2xl animate-float" />
        <div className="absolute bottom-32 left-20 w-16 h-16 bg-white/10 rounded-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/10 rounded-lg animate-float" style={{ animationDelay: '2s' }} /> */}
      </div>

    </div>
  )
}