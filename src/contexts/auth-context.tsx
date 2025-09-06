"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types";
import { ROUTES } from "@/lib/constants";
import * as authApi from "@/lib/api/auth";
import { tokenManager } from "@/lib/auth/token-manager";
import { isTokenExpired } from "@/lib/auth/auth-helpers";
import { UserDto } from "@/lib/api/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert UserDto to User type
function convertUserDtoToUser(userDto: UserDto): User {
  return {
    id: userDto.id.toString(),
    email: userDto.email,
    firstName: userDto.firstName,
    lastName: userDto.lastName,
    name: `${userDto.firstName} ${userDto.lastName}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const refreshTimerRef = useRef<NodeJS.Timeout>();

  // Stop token refresh timer
  const stopTokenRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Stop token refresh timer
      stopTokenRefreshTimer();

      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth data
      localStorage.removeItem("vtb_user");
      setUser(null);
      setError(null);

      // Redirect to login
      router.push(ROUTES.LOGIN);
    }
  }, [router, stopTokenRefreshTimer]);

  // Start token refresh timer
  const startTokenRefreshTimer = useCallback(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Check token every 5 minutes
    refreshTimerRef.current = setInterval(async () => {
      const token = tokenManager.getAccessToken();
      if (token && tokenManager.isTokenExpired()) {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          try {
            await authApi.refreshToken(refreshToken);
          } catch (error) {
            console.error("Token refresh failed:", error);
            // Logout if refresh fails
            await logout();
          }
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }, [logout]);

  // Check authentication
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if we have a token
      const token = tokenManager.getAccessToken();

      if (token && !tokenManager.isTokenExpired()) {
        // Try to get current user data
        const userDto = await authApi.getCurrentUser();
        const user = convertUserDtoToUser(userDto);
        setUser(user);

        // Store user data in localStorage for persistence
        localStorage.setItem("vtb_user", JSON.stringify(user));

        // Start token refresh timer
        startTokenRefreshTimer();
      } else if (tokenManager.getRefreshToken()) {
        // Try to refresh token if we have refresh token
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          try {
            await authApi.refreshToken(refreshToken);
            const userDto = await authApi.getCurrentUser();
            const user = convertUserDtoToUser(userDto);
            setUser(user);
            localStorage.setItem("vtb_user", JSON.stringify(user));

            // Start token refresh timer after successful refresh
            startTokenRefreshTimer();
          } catch (error) {
            // Refresh failed, clear everything
            tokenManager.clearTokens();
            localStorage.removeItem("vtb_user");
            setUser(null);
          }
        }
      } else {
        // No tokens, check localStorage for cached user data
        const storedUser = localStorage.getItem("vtb_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            // If we have user data but no token, clear it
            localStorage.removeItem("vtb_user");
            setUser(null);
          } catch (e) {
            localStorage.removeItem("vtb_user");
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [startTokenRefreshTimer]);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();

    // Cleanup on unmount
    return () => {
      stopTokenRefreshTimer();
    };
  }, [checkAuth, stopTokenRefreshTimer]);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      console.log("🔍 AuthContext: Starting login process");
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.login({ email, password });
        console.log("🔍 AuthContext: API response", response);
        const user = convertUserDtoToUser(response.user);
        console.log("🔍 AuthContext: Converted user", user);

        // Store user data
        setUser(user);
        console.log("🔍 AuthContext: User state set");
        localStorage.setItem("vtb_user", JSON.stringify(user));
        console.log("🔍 AuthContext: User stored in localStorage");

        // Start token refresh timer
        startTokenRefreshTimer();

        // Redirect to dashboard
        console.log("🔍 AuthContext: Redirecting to dashboard");
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.HR_DASHBOARD;
        } else {
          router.push(ROUTES.HR_DASHBOARD);
        }
      } catch (error: any) {
        console.error("🔍 AuthContext: Login error", error);
        setError(error.message || "Failed to login");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, startTokenRefreshTimer]
  );

  // Register function
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.register({
          email,
          password,
          firstName,
          lastName,
        });
        const user = convertUserDtoToUser(response.user);

        // Store user data
        setUser(user);
        localStorage.setItem("vtb_user", JSON.stringify(user));

        // Start token refresh timer
        startTokenRefreshTimer();

        // Redirect to dashboard
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.HR_DASHBOARD;
        } else {
          router.push(ROUTES.HR_DASHBOARD);
        }
      } catch (error: any) {
        setError(error.message || "Failed to register");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, startTokenRefreshTimer]
  );

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
