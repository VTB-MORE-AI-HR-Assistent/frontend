import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenManager } from "../auth/token-manager";
import { RefreshResponse } from "./types";

// API URL configuration
// - Production: https://hraiassistant.ru (with Traefik routing /api/* to API Gateway)
// - Local development: http://localhost:8081
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://api-gateway:8081";
const API_URL = baseURL.includes("hraiassistant.ru")
  ? `${baseURL}/api`
  : baseURL;
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "30000",
  10
);

// Log the API URL being used (helpful for debugging)
if (typeof window !== "undefined") {
  console.log("🔍 Environment variables:");
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("baseURL:", baseURL);
  console.log("API URL configured:", API_URL);
  console.log(
    "Contains hraiassistant.ru:",
    baseURL.includes("hraiassistant.ru")
  );
  console.log(
    "All NEXT_PUBLIC_ vars:",
    Object.keys(process.env).filter((key) => key.startsWith("NEXT_PUBLIC_"))
  );
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token for auth endpoints
    const isAuthEndpoint =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/refresh");

    if (!isAuthEndpoint) {
      const token = tokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Skip refresh for auth endpoints
      if (originalRequest.url?.includes("/auth/")) {
        return Promise.reject(error);
      }

      try {
        // Check if there's already a refresh in progress
        let refreshPromise = tokenManager.getRefreshPromise();

        if (!refreshPromise) {
          // Start new refresh
          refreshPromise = refreshAccessToken();
          tokenManager.setRefreshPromise(refreshPromise);
        }

        const newToken = await refreshPromise;
        tokenManager.clearRefreshPromise();

        if (newToken) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        tokenManager.clearTokens();
        tokenManager.clearRefreshPromise();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Function to refresh access token
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenManager.getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<RefreshResponse>(
      `${API_URL}/v1/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { accessToken, expiresIn } = response.data;
    tokenManager.updateAccessToken(accessToken, expiresIn);

    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

export default apiClient;
