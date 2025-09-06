"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ROUTES } from "@/lib/constants";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface RouteGuardProps {
  children: React.ReactNode;
}

// Public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/403",
  "/404",
  "/",
  "/mock-email",
  "/test-interview",
  "/test-daily",
];

// Routes that should be publicly accessible with any path (like interview sessions)
const publicRoutePrefixes = [
  "/interview/", // All interview sessions are public
];

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("🔍 RouteGuard: useEffect triggered", {
      isLoading,
      user,
      pathname,
    });

    // Wait for auth check to complete
    if (isLoading) return;

    // Check if user is authenticated for protected routes
    // Also check localStorage as fallback
    const storedUser = localStorage.getItem("vtb_user");
    const hasUser = user || storedUser;

    // Check if route is public (exact match or prefix match)
    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix));

    console.log("🔍 RouteGuard: Route check", { pathname, isPublicRoute });

    if (isPublicRoute) {
      // Public routes are always accessible
      console.log("🔍 RouteGuard: Public route, allowing access");

      // BUT if user is authenticated and on login/register page, redirect to dashboard
      if (hasUser && (pathname === "/login" || pathname === "/register")) {
        console.log(
          "🔍 RouteGuard: Authenticated user on auth page, redirecting to dashboard"
        );
        router.push(ROUTES.HR_DASHBOARD);
        return;
      }

      return;
    }

    console.log("🔍 RouteGuard: Auth check", {
      user,
      storedUser: !!storedUser,
      hasUser,
    });

    if (!hasUser) {
      console.log("🔍 RouteGuard: No user, redirecting to login");
      // Redirect to login if not authenticated
      router.push(ROUTES.LOGIN);
      return;
    }

    console.log("🔍 RouteGuard: User authenticated, allowing access");
  }, [isLoading, user, pathname, router]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check if this is a public route (exact match or prefix match)
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix));

  // For protected routes, ensure user is authenticated
  const storedUser = localStorage.getItem("vtb_user");
  const hasUser = user || storedUser;

  if (!isPublicRoute && !hasUser) {
    // Don't render protected content if not authenticated
    return null;
  }

  // Render children
  return <>{children}</>;
}
