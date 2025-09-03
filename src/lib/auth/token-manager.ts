import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'vtb_access_token'
const REFRESH_TOKEN_KEY = 'vtb_refresh_token'
const TOKEN_EXPIRY_KEY = 'vtb_token_expiry'

interface TokenData {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

class TokenManager {
  private accessToken: string | null = null
  private refreshPromise: Promise<string | null> | null = null

  // Store tokens
  setTokens(data: TokenData): void {
    this.accessToken = data.accessToken
    
    // Store in localStorage as backup (for development)
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
      
      // Calculate and store expiry time
      const expiryTime = Date.now() + (data.expiresIn * 1000)
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
      
      // Also try to set cookies for better security
      Cookies.set(REFRESH_TOKEN_KEY, data.refreshToken, {
        expires: 30, // 30 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
    }
  }

  // Get access token
  getAccessToken(): string | null {
    if (this.accessToken) {
      return this.accessToken
    }
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (token) {
        this.accessToken = token
      }
      return token
    }
    
    return null
  }

  // Get refresh token
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try to get from cookie first
      const cookieToken = Cookies.get(REFRESH_TOKEN_KEY)
      if (cookieToken) {
        return cookieToken
      }
      
      // Fallback to localStorage
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    }
    
    return null
  }

  // Check if token is expired or about to expire
  isTokenExpired(): boolean {
    if (typeof window === 'undefined') {
      return true
    }
    
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiryTime) {
      return true
    }
    
    const expiry = parseInt(expiryTime, 10)
    const now = Date.now()
    
    // Consider token expired if less than 1 minute remaining
    return now >= expiry - 60000
  }

  // Update access token after refresh
  updateAccessToken(accessToken: string, expiresIn: number): void {
    this.accessToken = accessToken
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      
      const expiryTime = Date.now() + (expiresIn * 1000)
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
    }
  }

  // Clear all tokens
  clearTokens(): void {
    this.accessToken = null
    this.refreshPromise = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(TOKEN_EXPIRY_KEY)
      
      Cookies.remove(REFRESH_TOKEN_KEY)
    }
  }

  // Set refresh promise to prevent multiple simultaneous refresh attempts
  setRefreshPromise(promise: Promise<string | null>): void {
    this.refreshPromise = promise
  }

  // Get refresh promise
  getRefreshPromise(): Promise<string | null> | null {
    return this.refreshPromise
  }

  // Clear refresh promise
  clearRefreshPromise(): void {
    this.refreshPromise = null
  }
}

// Export singleton instance
export const tokenManager = new TokenManager()