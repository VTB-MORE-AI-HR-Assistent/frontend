// Authentication helper functions for JWT token management

/**
 * Decode JWT token to get payload data
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token)
    if (!payload || !payload.exp) return true
    
    // exp is in seconds, convert to milliseconds
    const expiryTime = payload.exp * 1000
    const now = Date.now()
    
    // Add 5 minute buffer before actual expiry
    return now >= expiryTime - (5 * 60 * 1000)
  } catch {
    return true
  }
}

/**
 * Get user info from JWT token
 */
export function getUserFromToken(token: string): any {
  try {
    const payload = decodeJWT(token)
    if (!payload) return null
    
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      // Add other fields as needed
    }
  } catch {
    return null
  }
}

/**
 * Calculate token expiry time in milliseconds
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const payload = decodeJWT(token)
    if (!payload || !payload.exp) return null
    
    // exp is in seconds, convert to milliseconds
    return payload.exp * 1000
  } catch {
    return null
  }
}

/**
 * Format error message based on status code
 */
export function formatAuthError(status: number, message?: string): string {
  switch (status) {
    case 401:
      return 'Invalid email or password'
    case 403:
      return 'Access denied. Please check your permissions.'
    case 409:
      return 'An account with this email already exists'
    case 422:
      return 'Please check your input and try again'
    case 502:
    case 503:
      return 'Service temporarily unavailable. Please try again later.'
    default:
      return message || 'An unexpected error occurred. Please try again.'
  }
}