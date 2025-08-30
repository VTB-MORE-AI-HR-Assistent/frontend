import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react"

interface PublicLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PublicLayout({ children, className }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="nav-vtb">
        <div className="container-vtb flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="avatar-vtb w-12 h-12">
              <span className="text-sm font-bold">VTB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">VTB Bank</span>
              <span className="text-xs text-slate-500">AI HR Assistant</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={ROUTES.HOME}
              className="text-sm font-medium text-slate-600 hover:text-[#1B4F8C] transition-colors"
            >
              Home
            </Link>
            <Link
              href={ROUTES.CAREERS}
              className="text-sm font-medium text-slate-600 hover:text-[#1B4F8C] transition-colors"
            >
              Careers
            </Link>
            <Link
              href={ROUTES.ABOUT}
              className="text-sm font-medium text-slate-600 hover:text-[#1B4F8C] transition-colors"
            >
              About Us
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="text-sm font-medium text-slate-600 hover:text-[#1B4F8C] transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.LOGIN}>Sign In</Link>
            </Button>
            <Button variant="vtbPrimary" asChild>
              <Link href={ROUTES.REGISTER}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1", className)}>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        {/* Main Footer Content */}
        <div className="container-vtb px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VTB</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">VTB Bank</h3>
                  <p className="text-xs text-slate-400">AI HR Assistant</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Revolutionizing recruitment with AI-powered solutions for modern HR teams.
              </p>
              <div className="flex gap-3">
                <Link
                  href="#"
                  className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    AI Interview Assistant
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Candidate Screening
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Analytics Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Recruitment CRM
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={ROUTES.ABOUT}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.CAREERS}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span className="text-sm text-slate-400">
                    123 Business Center<br />
                    Moscow, Russia 101000
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">+7 (495) 123-45-67</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">hr@vtb.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="container-vtb px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                © 2024 VTB Bank. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}