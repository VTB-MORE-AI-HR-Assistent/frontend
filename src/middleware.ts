import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/vacancies',
  '/candidates',
  '/profile',
  '/settings',
]

// Routes that should redirect to dashboard if authenticated
const authRoutes = [
  '/login',
  '/register',
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))
  
  // Get token from cookies (we'll check localStorage on client side)
  const token = request.cookies.get('vtb_access_token')?.value || 
                request.cookies.get('vtb_refresh_token')?.value
  
  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', path)
    return NextResponse.redirect(url)
  }
  
  // Redirect to dashboard if accessing auth route with token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}