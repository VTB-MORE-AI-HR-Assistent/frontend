import { tokenManager } from "../auth/token-manager";
import { mockAuthResponse, simulateApiDelay } from "../mock-data";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshResponse,
  UserDto,
} from "./types";

// Login user - MOCKED
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    // Simulate API delay
    await simulateApiDelay(800);

    // Mock validation - check for demo credentials
    if (data.email === "hr.manager@vtb.com" && data.password === "password") {
      // Store tokens and user data
      tokenManager.setTokens({
        accessToken: mockAuthResponse.accessToken,
        refreshToken: mockAuthResponse.refreshToken,
        expiresIn: mockAuthResponse.expiresIn,
      });

      // Store user data in localStorage
      if (typeof window !== "undefined" && mockAuthResponse.user) {
        localStorage.setItem("user", JSON.stringify(mockAuthResponse.user));
      }

      return mockAuthResponse;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      throw error;
    }
    throw new Error("Login failed");
  }
}

// Register new user - MOCKED
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    // Simulate API delay
    await simulateApiDelay(800);

    // Mock registration - create new user with provided data
    const mockResponse = {
      ...mockAuthResponse,
      user: {
        ...mockAuthResponse.user,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName
      }
    };

    // Store tokens and user data
    tokenManager.setTokens({
      accessToken: mockResponse.accessToken,
      refreshToken: mockResponse.refreshToken,
      expiresIn: mockResponse.expiresIn,
    });

    // Store user data in localStorage
    if (typeof window !== "undefined" && mockResponse.user) {
      localStorage.setItem("user", JSON.stringify(mockResponse.user));
    }

    return mockResponse;
  } catch {
    throw new Error("Registration failed");
  }
}

// Refresh access token - MOCKED
export async function refreshToken(
  _refreshToken: string
): Promise<RefreshResponse> {
  try {
    // Simulate API delay
    await simulateApiDelay(300);

    // Mock refresh response
    const mockRefreshResponse: RefreshResponse = {
      accessToken: "mock_new_access_token_" + Date.now(),
      tokenType: "Bearer",
      expiresIn: 3600
    };

    // Update access token with new expiry
    tokenManager.updateAccessToken(
      mockRefreshResponse.accessToken,
      mockRefreshResponse.expiresIn
    );

    return mockRefreshResponse;
  } catch {
    // If refresh fails, clear tokens and redirect to login
    tokenManager.clearTokens();
    throw new Error("Session expired. Please login again.");
  }
}

// Get current user - MOCKED
export async function getCurrentUser(): Promise<UserDto> {
  try {
    // Simulate API delay
    await simulateApiDelay(200);
    
    // Return mock user data
    return mockAuthResponse.user;
  } catch {
    throw new Error("Failed to get user data");
  }
}

// Logout user - MOCKED
export async function logout(): Promise<void> {
  // Simulate API delay
  await simulateApiDelay(200);
  
  // Always clear tokens locally (no backend call needed for mock)
  tokenManager.clearTokens();
  
  // Clear user data from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}
