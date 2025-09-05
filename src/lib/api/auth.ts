import apiClient from "./client";
import { tokenManager } from "../auth/token-manager";
import { formatAuthError } from "../auth/auth-helpers";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshRequest,
  RefreshResponse,
  UserDto,
} from "./types";

// Login user
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/v1/auth/login", data);

    // Store tokens and user data
    tokenManager.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });

    // Store user data in localStorage
    if (typeof window !== "undefined" && response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    throw new Error(formatAuthError(status, message));
  }
}

// Register new user
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/v1/auth/register",
      data
    );

    // Store tokens and user data
    tokenManager.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });

    // Store user data in localStorage
    if (typeof window !== "undefined" && response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    throw new Error(formatAuthError(status, message));
  }
}

// Refresh access token
export async function refreshToken(
  refreshToken: string
): Promise<RefreshResponse> {
  try {
    const response = await apiClient.post<RefreshResponse>("/v1/auth/refresh", {
      refreshToken,
    } as RefreshRequest);

    // Update access token with new expiry
    tokenManager.updateAccessToken(
      response.data.accessToken,
      response.data.expiresIn
    );

    return response.data;
  } catch (error: any) {
    // If refresh fails, clear tokens and redirect to login
    tokenManager.clearTokens();
    throw new Error(
      error.response?.data?.message || "Session expired. Please login again."
    );
  }
}

// Get current user
export async function getCurrentUser(): Promise<UserDto> {
  try {
    const response = await apiClient.get<UserDto>("/v1/users/me");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get user data");
  }
}

// Logout user
export async function logout(): Promise<void> {
  const refreshToken = tokenManager.getRefreshToken();

  // Try to invalidate token on backend if endpoint exists
  if (refreshToken) {
    try {
      await apiClient.post("/v1/auth/logout", { refreshToken });
    } catch (error) {
      // Ignore errors - backend might not have logout endpoint
      console.log("Logout endpoint not available, clearing tokens locally");
    }
  }

  // Always clear tokens locally
  tokenManager.clearTokens();
}
